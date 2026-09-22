#!/usr/bin/env python3
"""WiLoR hand-pose server: receives webcam JPEG frames from the browser over a WebSocket and
replies with 3D hand keypoints + a palm frame per hand.

    .venv-wilor/bin/python wilor_server.py            # ws://localhost:8766

The browser keeps MediaPipe for the fast cursor/pinch; this only supplies the slow, accurate
3D orientation (which way the palm faces, how the wrist is rolled). Only the newest frame is
processed — on an M1 the ViT-H backbone takes ~300 ms, so older frames are simply dropped.
"""
import asyncio
import json
import logging
import struct
import time

import cv2
import numpy as np
import torch
import websockets

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%H:%M:%S')
log = logging.getLogger('wilor')

PORT = 8766
# MANO / WiLoR keypoint order: 0 wrist, 1-4 thumb, 5-8 index, 9-12 middle, 13-16 ring, 17-20 pinky (same as MediaPipe)


def load_pipeline():
    from wilor_mini.pipelines.wilor_hand_pose3d_estimation_pipeline import WiLorHandPose3dEstimationPipeline
    if torch.backends.mps.is_available():
        device, dtype = torch.device('mps'), torch.float16
    elif torch.cuda.is_available():
        device, dtype = torch.device('cuda'), torch.float16
    else:
        device, dtype = torch.device('cpu'), torch.float32
    log.info('loading WiLoR on %s (%s)…', device, dtype)
    pipe = WiLorHandPose3dEstimationPipeline(device=device, dtype=dtype, verbose=False)
    # MPS convolutions reject the non-contiguous tensor the model hands its backbone.
    backbone, orig = pipe.wilor_model.backbone, pipe.wilor_model.backbone.forward
    backbone.forward = lambda x: orig(x.contiguous())
    # warm up (first call compiles kernels and takes several seconds)
    pipe.predict(np.zeros((240, 320, 3), np.uint8))
    log.info('ready')
    return pipe


def palm_frame(kp):
    """Orthonormal palm basis from 3D keypoints (camera coords: x right, y down, z away)."""
    u = kp[9] - kp[0]  # wrist -> middle knuckle
    v = kp[5] - kp[17]  # pinky knuckle -> index knuckle
    u = u / (np.linalg.norm(u) + 1e-9)
    n = np.cross(u, v)
    n = n / (np.linalg.norm(n) + 1e-9)
    v = np.cross(n, u)
    return u, v, n


def describe(hand, width, height):
    p = hand['wilor_preds']
    kp3d = np.asarray(p['pred_keypoints_3d'])[0]
    kp2d = np.asarray(p['pred_keypoints_2d'])[0]
    u, v, n = palm_frame(kp3d)
    return {
        'right': bool(hand['is_right']),
        'kp2d': [[round(float(x) / width, 4), round(float(y) / height, 4)] for x, y in kp2d],
        'kp3d': [[round(float(c), 4) for c in row] for row in kp3d],
        'u': [round(float(c), 4) for c in u],
        'v': [round(float(c), 4) for c in v],
        'n': [round(float(c), 4) for c in n],
        'bbox': [round(float(c), 1) for c in hand['hand_bbox']],
    }


async def serve(pipe):
    async def handle(ws):
        log.info('client connected')
        latest = None
        done = asyncio.Event()

        async def receive():
            nonlocal latest
            try:
                async for msg in ws:
                    if isinstance(msg, bytes) and len(msg) > 8:
                        latest = msg  # keep only the newest frame
            finally:
                done.set()

        async def process():
            nonlocal latest
            loop = asyncio.get_running_loop()
            while not done.is_set():
                if latest is None:
                    await asyncio.sleep(0.005)
                    continue
                msg, latest = latest, None
                (t_client,) = struct.unpack('<d', msg[:8])
                img = cv2.imdecode(np.frombuffer(msg[8:], np.uint8), cv2.IMREAD_COLOR)
                if img is None:
                    continue
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                t0 = time.time()
                hands = await loop.run_in_executor(None, pipe.predict, rgb)
                dt = time.time() - t0
                h, w = rgb.shape[:2]
                reply = {
                    't': t_client, 'ms': round(dt * 1000),
                    'hands': [describe(x, w, h) for x in hands if 'wilor_preds' in x],
                }
                await ws.send(json.dumps(reply))

        await asyncio.gather(receive(), process())
        log.info('client left')

    async with websockets.serve(handle, 'localhost', PORT, max_size=4_000_000):
        log.info('listening on ws://localhost:%d', PORT)
        await asyncio.Future()


if __name__ == '__main__':
    asyncio.run(serve(load_pipeline()))
