// Webcam hand tracking (MediaPipe HandLandmarker) -> pointer-like events.
// Emits a smoothed, mirrored cursor position in [0,1]² plus a debounced pinch state.

const VISION_VERSION = '0.10.14';
const VISION_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VISION_VERSION}`;
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

// Only the central part of the camera frame is mapped to the screen, so the
// screen edges are reachable without moving the hand out of view.
export const ACTIVE_REGION = { x0: 0.18, x1: 0.82, y0: 0.12, y1: 0.78 };

// Pinch = thumb–index tip distance / palm length, measured in 3D so it doesn't
// change with the hand's angle to the camera. Hysteresis keeps a held pinch stable.
const PINCH_DOWN = 0.3;
const PINCH_UP = 0.44;
const PINCH_FRAMES = 2; // consecutive closed frames needed to grab
const RELEASE_MS = 140; // fingers must stay open this long to let go (see updatePinch)
const FAST_SPEED = 0.55; // screen-widths/s; above this a held pinch won't release unless wide open
const EDGE_ON = 0.15; // |palm cross| below this = hand seen edge-on (mid-flip): fingertips unreliable
const FACING = 0.3; // |palm cross| above this = palm side is unambiguous
const FACING_HOLD_MS = 180; // a new palm side must persist this long...
const FACING_MAX_SPEED = 1.0; // ...while the hand is not sweeping across the frame (blur flips the sign at random)
const EDGE_FREEZE_MS = 600; // how long an edge-on hand may keep a pinch from releasing
const LOST_HOLDING_MS = 1200; // keep holding through longer tracking dropouts (blur, hand half out of frame)
const PALM = [0, 5, 9, 13, 17]; // wrist + knuckles: the steadiest landmarks
const LOST_MS = 400; // tolerate short tracking dropouts

export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

class LowPass {
  constructor() { this.y = null; }
  filter(x, alpha) {
    this.y = this.y === null ? x : alpha * x + (1 - alpha) * this.y;
    return this.y;
  }
}

// One Euro filter: heavy smoothing when still (kills jitter), light when moving (low lag).
class OneEuro {
  constructor(minCutoff = 1.0, beta = 6.0, dCutoff = 1.0) {
    Object.assign(this, { minCutoff, beta, dCutoff });
    this.reset();
  }
  reset() {
    this.x = new LowPass();
    this.dx = new LowPass();
    this.last = null;
    this.t = null;
  }
  static alpha(cutoff, dt) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }
  filter(value, t) {
    const dt = this.t === null ? 1 / 30 : Math.max(1e-3, t - this.t);
    this.t = t;
    const raw = this.last === null ? 0 : (value - this.last) / dt;
    this.last = value;
    const speed = this.dx.filter(raw, OneEuro.alpha(this.dCutoff, dt));
    const cutoff = this.minCutoff + this.beta * Math.abs(speed);
    return this.x.filter(value, OneEuro.alpha(cutoff, dt));
  }
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export class HandTracker {
  /**
   * @param {HTMLVideoElement} video
   * @param {(frame: {present: boolean, x?: number, y?: number, pinching?: boolean,
   *   pinchRatio?: number, landmarks?: Array}) => void} onFrame
   */
  constructor(video, onFrame) {
    this.video = video;
    this.onFrame = onFrame;
    this.onDebug = null; // optional per-video-frame diagnostics sink
    this.external = null; // optional WilorClient: accurate 3D palm facing / roll at a few fps
    this.running = false;
    // Cursor = steady palm centre + slowly-filtered offset to the pinch point.
    // Fingertips are the noisiest landmarks and move when pinching, so they only
    // steer the cursor through the slow filter: closing the fingers doesn't make it jump.
    this.palm = [new OneEuro(), new OneEuro()];
    this.offset = [new OneEuro(0.5, 0), new OneEuro(0.5, 0)];
    this.offsetVal = [null, null];
    this.smoothing = 0.6; // 0 = raw & snappy … 1 = very steady
    this.sensitivity = 1; // scales the pinch thresholds; >1 pinches more easily
    this.ratio = null;
    this.pinching = false;
    this.pinchStreak = 0;
    this.openSince = null;
    this.speed = 0;
    this.lastPalm = null;
    this.facingSince = null;
    this.bias = [0, 0];
    this.lastOut = null;
    this.rebase = false;
    this.roll = null; // unwrapped, smoothed in-plane hand angle (radians, clockwise on screen)
    this.facing = 0; // +1 / -1: which side of the hand faces the camera (sign only meaningful relatively)
    this.edgeSince = null;
    this.lastSeen = 0;
    this.lastVideoTime = -1;
  }

  async start(onStatus = () => {}) {
    onStatus('카메라 권한 요청 중…');
    this.stream = await navigator.mediaDevices.getUserMedia({
      // A high frame rate shortens exposure, which means less motion blur on a fast hand.
      video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 60 }, facingMode: 'user' },
      audio: false,
    });
    this.video.srcObject = this.stream;
    await this.video.play();

    onStatus('손 인식 모델 불러오는 중…');
    const { FilesetResolver, HandLandmarker } = await import(`${VISION_URL}/vision_bundle.mjs`);
    const fileset = await FilesetResolver.forVisionTasks(`${VISION_URL}/wasm`);
    const options = (delegate) => ({
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: 'VIDEO',
      numHands: 1,
      // Lenient tracking keeps the hand through motion blur; detection stays strict.
      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.4,
      minTrackingConfidence: 0.4,
    });
    try {
      this.landmarker = await HandLandmarker.createFromOptions(fileset, options('GPU'));
    } catch {
      this.landmarker = await HandLandmarker.createFromOptions(fileset, options('CPU'));
    }

    this.running = true;
    onStatus('');
    const loop = () => {
      if (!this.running) return;
      this.tick();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.video.srcObject = null;
    this.landmarker?.close();
    this.landmarker = null;
    this.resetHand();
    this.onFrame({ present: false });
  }

  resetHand() {
    [...this.palm, ...this.offset].forEach((f) => f.reset());
    this.ratio = null;
    this.offsetVal = [null, null];
    this.pinching = false;
    this.pinchStreak = 0;
    this.openSince = null;
    this.speed = 0;
    this.lastPalm = null;
    this.roll = null;
    this.facing = 0;
    this.facingSince = null;
    this.edgeSince = null;
    this.bias = [0, 0];
    this.lastOut = null;
    this.rebase = false;
  }

  /**
   * Grabbing needs a couple of consistent frames. Releasing is deliberately harder:
   * motion blur makes the fingertips look apart for a few frames, so the fingers must
   * stay open for a while, and longer (or wider) the faster the hand is moving.
   * Players let go when the hand has stopped over a square, not mid-swing.
   */
  updatePinch(ratio, down, up, now) {
    if (!this.pinching) {
      this.pinchStreak = ratio < down ? this.pinchStreak + 1 : 0;
      if (this.pinchStreak >= PINCH_FRAMES) {
        this.pinching = true;
        this.pinchStreak = 0;
        this.openSince = null;
      }
      return;
    }
    // Mid-flip the hand is edge-on and the fingertips hide behind it: don't let that read as letting go.
    const flipping = this.edgeSince !== null && now - this.edgeSince < EDGE_FREEZE_MS;
    if (ratio <= up || flipping) {
      this.openSince = null;
      return;
    }
    this.openSince ??= now;
    const moving = this.speed > FAST_SPEED;
    const wideOpen = ratio > up * 1.5;
    const needed = moving ? (wideOpen ? RELEASE_MS * 2 : Infinity) : wideOpen ? RELEASE_MS / 2 : RELEASE_MS;
    if (now - this.openSince >= needed) {
      this.pinching = false;
      this.openSince = null;
    }
  }

  tick() {
    const video = this.video;
    if (video.readyState < 2 || video.currentTime === this.lastVideoTime) return;
    this.lastVideoTime = video.currentTime;

    const now = performance.now();
    const result = this.landmarker.detectForVideo(video, now);
    const lm = result.landmarks?.[0];

    if (!lm) {
      this.onDebug?.({ t: Math.round(now), hand: 0, pinching: +this.pinching });
      if (now - this.lastSeen > (this.pinching ? LOST_HOLDING_MS : LOST_MS)) {
        this.resetHand();
        this.onFrame({ present: false });
      }
      return;
    }
    this.lastSeen = now;

    const wl = result.worldLandmarks?.[0];
    let rawRatio;
    if (wl) {
      const d3 = (a, b) => Math.hypot(wl[a].x - wl[b].x, wl[a].y - wl[b].y, wl[a].z - wl[b].z);
      rawRatio = d3(4, 8) / (d3(0, 9) || 1);
    } else {
      const w = video.videoWidth, h = video.videoHeight;
      const d2 = (a, b) => Math.hypot((lm[a].x - lm[b].x) * w, (lm[a].y - lm[b].y) * h);
      rawRatio = d2(4, 8) / (d2(0, 9) || 1);
    }
    this.ratio = this.ratio === null ? rawRatio : this.ratio + (rawRatio - this.ratio) * 0.6;
    const pinchRatio = this.ratio;
    const pinchDown = PINCH_DOWN * this.sensitivity;
    const pinchUp = PINCH_UP * this.sensitivity;

    // Hand pose in the image plane, for games that turn and flip what is being held.
    // roll: direction wrist→middle knuckle as seen on the mirrored screen (0 = up, clockwise +).
    // cross: 2D cross product of wrist→index-knuckle and wrist→pinky-knuckle, normalised by
    // palm length². Its sign flips when the hand is turned over, and it needs no depth estimate.
    const aspect = video.videoWidth / video.videoHeight || 4 / 3;
    const vec = (i) => [(lm[i].x - lm[0].x) * aspect, lm[i].y - lm[0].y];
    const [mx, my] = vec(9), [ix, iy] = vec(5), [px, py] = vec(17);
    // Normalised by the two vectors' own lengths (= sine of the angle between them), so a palm
    // foreshortened towards the camera can't blow the value up. Open palm: about ±0.5.
    const cross = (ix * py - iy * px) / (Math.hypot(ix, iy) * Math.hypot(px, py) || 1e-6);
    // Session logs showed 8 of 9 "flips" firing mid-sweep at 2–6 screen-widths/s: motion blur.
    // So a new side only counts once it has held steady on a slow-moving hand.
    const ext = this.external?.sample();
    this.external?.maybeSend(this.pinching); // frames go out only while something is held
    // With a 3D estimate available its palm normal decides the side; the 2D cross only says "edge-on".
    const side = ext ? ext.facing : Math.abs(cross) > FACING ? Math.sign(cross) : 0;
    if (this.facing === 0) this.facing = side;
    else if (side === -this.facing && this.speed < FACING_MAX_SPEED) {
      this.facingSince ??= now;
      if (now - this.facingSince >= FACING_HOLD_MS) {
        this.facing = side;
        this.facingSince = null;
      }
    } else {
      this.facingSince = null;
    }
    const edgeOn = Math.abs(cross) < EDGE_ON;
    this.edgeSince = edgeOn ? this.edgeSince ?? now : null;
    // The hand is part-way through being turned over: its 2D layout is changing under us.
    const turning = Math.abs(cross) < FACING || this.facingSince !== null;

    // roll: which way the hand points on the mirrored screen (0 = up, clockwise +). The wrist→knuckle
    // direction alone collapses when the fingers point at the camera (a session log showed it
    // swinging through 350° inside one hold), so the knuckle line — turned a quarter towards the
    // fingers, on whichever side the palm currently faces — is added in; it stays long exactly
    // when the other gets short.
    const s = Math.sign(cross) || this.facing || 1;
    const vx = mx - (iy - py) * s, vy = my + (ix - px) * s;
    const rawRoll = Math.atan2(-vx, -vy);
    if (this.roll === null) this.roll = rawRoll;
    else if (!turning) {
      const delta = Math.atan2(Math.sin(rawRoll - this.roll), Math.cos(rawRoll - this.roll)); // shortest way round
      this.roll += delta * 0.35;
    }
    // The 3D roll is NOT blended in: at ~2 fps it arrives ~500 ms stale, and a session log showed
    // each late sample yanking the roll by up to 30°, which the wrist ratchet read as extra turns.
    // Only the palm side (a slow, binary signal) is taken from it.

    this.updatePinch(pinchRatio, pinchDown, pinchUp, now);

    // Mirrored like a mirror image; only the active region of the frame maps to the screen.
    const { x0, x1, y0, y1 } = ACTIVE_REGION;
    const toScreen = (px, py) => [(1 - px - x0) / (x1 - x0), (py - y0) / (y1 - y0)];
    const mean = (key) => PALM.reduce((sum, i) => sum + lm[i][key], 0) / PALM.length;
    const palm = toScreen(mean('x'), mean('y'));
    const tip = toScreen((lm[4].x + lm[8].x) / 2, (lm[4].y + lm[8].y) / 2);

    // Hand speed in screen-widths per second, used to make a held pinch sticky while moving.
    if (this.lastPalm) {
      const dt = Math.max(1e-3, (now - this.lastPalm.t) / 1000);
      const v = Math.hypot(palm[0] - this.lastPalm.x, palm[1] - this.lastPalm.y) / dt;
      this.speed += (v - this.speed) * 0.5;
    }
    this.lastPalm = { x: palm[0], y: palm[1], t: now };

    // Steadier while holding a piece: precision matters more than speed there.
    const minCutoff = (1.6 - 1.35 * this.smoothing) * (this.pinching ? 0.6 : 1);
    const beta = 8 - 5 * this.smoothing;
    const t = now / 1000;
    const fingersOpen = pinchRatio > pinchUp * 1.2;
    const pos = [0, 1].map((i) => {
      Object.assign(this.palm[i], { minCutoff, beta });
      // The palm→pinch offset is only tracked while the fingers are clearly open. As they
      // close (and until they reopen) it stays frozen, so pinching and releasing never
      // drag the cursor off the piece or square the player was aiming at.
      if (fingersOpen || this.offsetVal[i] === null) this.offsetVal[i] = this.offset[i].filter(tip[i] - palm[i], t);
      return this.palm[i].filter(palm[i], t) + this.offsetVal[i];
    });
    // Turning the hand over swaps the palm and fingertips around on screen, which used to fling
    // the cursor (and whatever it carried) ~20% of the screen sideways. So while a pinching hand
    // is turning the cursor holds still, and afterwards it carries on from where it was.
    let out = [pos[0] + this.bias[0], pos[1] + this.bias[1]];
    if (this.pinching && turning && this.lastOut) {
      out = this.lastOut;
      this.rebase = true;
    } else if (this.rebase) {
      this.bias = [this.lastOut[0] - pos[0], this.lastOut[1] - pos[1]];
      out = this.lastOut;
      this.rebase = false;
    }
    // Opening the fingers to let go moves the fingertips, the palm centre and the hand as a whole,
    // and release is only confirmed ~140 ms later: logs showed pieces landing 25% of the screen
    // away from where the player let go. So from the first frame the fingers start to open, the
    // cursor stays where the pinch last was, until the release has gone through.
    if (this.pinching && pinchRatio > pinchDown * 1.15 && this.lastOut) {
      out = this.lastOut;
      this.rebase = true;
    }
    if (!this.pinching) this.bias = this.bias.map((b) => b * 0.9); // drift back to the true mapping once free
    this.lastOut = out;
    const x = clamp01(out[0]);
    const y = clamp01(out[1]);

    const r3 = (v) => Math.round(v * 1000) / 1000;
    this.onDebug?.({
      t: Math.round(now), hand: 1, score: r3(result.handednesses?.[0]?.[0]?.score ?? 0),
      raw: r3(rawRatio), ratio: r3(pinchRatio), down: r3(pinchDown), up: r3(pinchUp),
      pinching: +this.pinching, speed: r3(this.speed), x: r3(x), y: r3(y),
      palm: palm.map(r3), tip: tip.map(r3), z: r3(lm[8].z - lm[0].z),
      side: result.handednesses?.[0]?.[0]?.categoryName?.[0] ?? '?',
      roll: r3(this.roll), cross: r3(cross), ext: ext ? [r3(ext.roll), ext.facing, ext.ms] : null,
    });
    const handedness = result.handednesses?.[0]?.[0]?.categoryName;
    this.onFrame({ present: true, x, y, pinching: this.pinching, pinchRatio, pinchDown, pinchUp, landmarks: lm, handedness,
      roll: this.roll, facing: this.facing, speed: this.speed });
  }
}
