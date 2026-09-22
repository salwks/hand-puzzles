// Client for wilor_server.py: streams webcam frames over a WebSocket and turns the replies
// into the two slow-but-accurate signals the hand tracker wants — which way the palm faces
// and how the wrist is rolled — from real 3D keypoints instead of 2D guesses.
// Optional: if the server isn't running the tracker carries on with MediaPipe alone.

const URL = 'ws://localhost:8766';
const RETRY_MS = 5000;
const SEND_WIDTH = 384; // enough for the detector; smaller JPEGs keep MediaPipe's frame rate up

export class WilorClient {
  /** @param {HTMLVideoElement} video */
  constructor(video) {
    this.video = video;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ws = null;
    this.busy = false; // a frame is in flight; the server only wants the newest anyway
    this.latest = null; // { t, roll, facing, ms, right }
    this.connected = false;
    this.stats = { ms: 0, fps: 0, lastAt: 0 };
    this.onStatus = null;
    this.enabled = true;
    this.stopped = false;
    // The server only ever runs on the player's own machine; a hosted page can't reach it.
    if (['localhost', '127.0.0.1'].includes(location.hostname)) this.connect();
  }

  connect() {
    if (this.stopped) return;
    let ws;
    try { ws = new WebSocket(URL); } catch { return this.retry(); }
    ws.onopen = () => { this.ws = ws; this.connected = true; this.onStatus?.(true); };
    ws.onclose = () => { this.ws = null; this.connected = false; this.busy = false; this.onStatus?.(false); this.retry(); };
    ws.onerror = () => ws.close();
    ws.onmessage = (e) => this.onReply(JSON.parse(e.data));
  }

  retry() {
    clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => this.connect(), RETRY_MS);
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.retryTimer);
    this.ws?.close();
  }

  /** Call once per video frame; sends only when the previous reply has arrived and `wanted` is true. */
  maybeSend(wanted = true) {
    if (!wanted || !this.enabled || !this.ws || this.busy || this.video.readyState < 2) return;
    const w = SEND_WIDTH, h = Math.round((w * this.video.videoHeight) / this.video.videoWidth) || 360;
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    this.ctx.drawImage(this.video, 0, 0, w, h);
    this.busy = true;
    const t = performance.now();
    this.canvas.toBlob(async (blob) => {
      if (!blob || !this.ws) { this.busy = false; return; }
      const header = new ArrayBuffer(8);
      new DataView(header).setFloat64(0, t, true);
      this.ws.send(await new Blob([header, blob]).arrayBuffer());
    }, 'image/jpeg', 0.7);
  }

  onReply(reply) {
    this.busy = false;
    const now = performance.now();
    if (this.stats.lastAt) this.stats.fps += (1000 / Math.max(1, now - this.stats.lastAt) - this.stats.fps) * 0.3;
    this.stats.lastAt = now;
    this.stats.ms = reply.ms;
    const hand = reply.hands?.[0];
    if (!hand) { this.latest = null; return; }

    // Camera coords: x right, y down, z away from the camera. The raw frame is not mirrored.
    const { u, v, n } = hand;
    // Palm normal towards the camera (-z) for one side of the hand, away for the other. Which
    // side is "front" doesn't matter to the tracker — only that it flips when the hand turns over.
    const facing = n[2] < 0 ? 1 : -1;
    // Roll on the mirrored screen: 0 = fingers up, clockwise positive. Use the finger direction
    // while it has length in the image plane, else the knuckle line turned a quarter turn.
    const ux = -u[0], uy = u[1]; // mirror x
    const vx = -v[0], vy = v[1];
    const uLen = Math.hypot(ux, uy);
    const dir = uLen > 0.45 ? [ux, uy] : [-vy * Math.sign(n[2] || 1), vx * Math.sign(n[2] || 1)];
    const roll = Math.atan2(-dir[0], -dir[1]);
    this.latest = { t: now, roll, facing, ms: reply.ms, right: hand.right, kp2d: hand.kp2d };
  }

  /** The newest sample if it is recent enough to trust, else null. */
  sample(maxAgeMs = 700) {
    return this.latest && performance.now() - this.latest.t < maxAgeMs ? this.latest : null;
  }
}
