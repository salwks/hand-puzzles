// Shared 3D stage for every game: renderer, lamp-lit leather table, camera, tweens,
// screen→world ray helpers and the tracked 3D hand. A game scene extends Stage, builds
// its own board and pieces, and implements the small hooks at the bottom of the class.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { leatherMaterial } from './materials.js';
import { RiggedHand } from './rigged-hand.js';
import { HAND_CONNECTIONS } from './hand.js';

const PALM_WORLD = 0.85; // wrist→middle-knuckle length of the 3D hand, in board squares
const JOINT_R = 0.085; // finger thickness of the fallback tube hand

// State colours, shared by pieces, board tiles, rings and the hand.
// Jewel tones, matching the CSS tokens in style.css (--amber, --sapphire, --ruby, --emerald).
export const COLOR = {
  hover: 0xe0a83a, // the piece the cursor would grab
  stuck: 0x8c8579, // ...but it can't do anything right now
  held: 0x3f7fe6, // the piece being carried (and where it came from)
  target: 0xd9363e, // what it may capture / where it can't go
  hint: 0x2fae7f,
};
export const BACKDROP = 0x0d0c0a; // same as --bg in style.css
export const NO_GLOW = { color: 0x000000, intensity: 0, pulse: false };

// Webcam image axes → world. The hand reaches over the board from the player's
// side: image-up points away from the player and slightly upward, and "closer
// to the webcam" points down into the board, so the palm faces the board.
const HAND_RIGHT = new THREE.Vector3(1, 0, 0);
const HAND_UP = new THREE.Vector3(0, 0.45, -1).normalize();
const HAND_DEPTH = new THREE.Vector3().crossVectors(HAND_RIGHT, HAND_UP);

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
export const easeOutCubic = (k) => 1 - (1 - k) ** 3;
export const easeInOutCubic = (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);
export const easeInQuad = (k) => k * k;
export function easeOutBounce(k) {
  const n = 7.5625, d = 2.75;
  if (k < 1 / d) return n * k * k;
  if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
  if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
  return n * (k -= 2.625 / d) * k + 0.984375;
}

/** Sets a material's emissive from a glow record; `wave` (-1..1) drives pulsing glows. */
export function applyGlow(material, glow, wave, gain = 1) {
  material.emissive.set(glow.color);
  material.emissiveIntensity = glow.intensity * gain * (glow.pulse ? 0.75 + 0.25 * wave : 1);
}

class HandModel {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;
    const material = new THREE.MeshStandardMaterial({
      color: 0xe0a583, roughness: 0.6, transparent: true, opacity: 0.78, // see-through enough to keep the piece colours readable
    });
    const jointGeo = new THREE.SphereGeometry(1, 16, 12);
    const boneGeo = new THREE.CylinderGeometry(1, 1, 1, 12, 1, true);
    // Simple tube hand: shown only until (or unless) the realistic model has loaded.
    this.tubes = new THREE.Group();
    this.group.add(this.tubes);
    const mesh = (geo) => {
      const m = new THREE.Mesh(geo, material);
      m.castShadow = true;
      this.tubes.add(m);
      return m;
    };
    this.joints = Array.from({ length: 21 }, () => mesh(jointGeo));
    this.bones = HAND_CONNECTIONS.map(() => mesh(boneGeo));

    // Palm: a fan over wrist + knuckles, rebuilt every frame.
    this.palmIdx = [0, 1, 5, 9, 13, 17];
    const palmGeo = new THREE.BufferGeometry();
    palmGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.palmIdx.length * 3), 3));
    palmGeo.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5]);
    this.palm = new THREE.Mesh(palmGeo, material.clone());
    this.palm.material.side = THREE.DoubleSide;
    this.palm.castShadow = true;
    this.tubes.add(this.palm);

    this.rigged = new RiggedHand(PALM_WORLD);
    this.group.add(this.rigged.group);
    this.size = 1; // a scene can shrink or grow the hand to suit its scale

    this.materials = [material, this.palm.material, this.rigged.material];
    this.offsets = Array.from({ length: 21 }, () => new THREE.Vector3());
    this.fresh = true;
  }

  hide() {
    this.group.visible = false;
    this.fresh = true;
  }

  setSize(k) {
    this.size = k;
    this.rigged.palmWorld = PALM_WORLD * k;
  }

  /** @param landmarks MediaPipe landmarks; @param aspect video width/height; @param anchor world pinch point */
  update(landmarks, aspect, anchor, side = 'right') {
    // Work in "height units" so x/y/z share one scale (MediaPipe's z uses the x scale).
    // Depth is MediaPipe's noisiest axis, so it is flattened a little.
    const P = landmarks.map((l) => new THREE.Vector3(l.x * aspect, l.y, l.z * aspect * 0.75));
    const pinch = P[4].clone().add(P[8]).multiplyScalar(0.5);
    const palmLen = Math.hypot(P[0].x - P[9].x, P[0].y - P[9].y) || 1e-3;
    const scale = (PALM_WORLD * this.size) / palmLen;
    const k = this.fresh ? 1 : 0.35; // per-joint smoothing of the pose (position comes from the cursor)
    this.fresh = false;

    const world = new THREE.Vector3();
    P.forEach((p, i) => {
      const d = p.sub(pinch).multiplyScalar(scale);
      world.set(0, 0, 0)
        .addScaledVector(HAND_RIGHT, -d.x) // mirrored
        .addScaledVector(HAND_UP, -d.y)
        .addScaledVector(HAND_DEPTH, d.z);
      this.offsets[i].lerp(world, k);
    });

    const realistic = this.rigged.ready(side);
    this.tubes.visible = !realistic;
    this.group.visible = true;
    if (realistic) {
      this.rigged.update(this.offsets, anchor, side);
      return;
    }
    this.rigged.hide();

    this.offsets.forEach((offset, i) => {
      this.joints[i].position.copy(anchor).add(offset);
      this.joints[i].scale.setScalar(i === 0 ? 0.13 : i % 4 === 0 ? 0.072 : JOINT_R);
    });

    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3();
    HAND_CONNECTIONS.forEach(([a, b], i) => {
      const A = this.joints[a].position, B = this.joints[b].position;
      const bone = this.bones[i];
      dir.subVectors(B, A);
      const len = dir.length() || 1e-4;
      bone.position.copy(A).addScaledVector(dir, 0.5);
      bone.quaternion.setFromUnitVectors(up, dir.divideScalar(len));
      const r = a === 0 || (a >= 5 && b >= 5 && b - a === 4) ? JOINT_R * 1.25 : JOINT_R; // palm bones are thicker
      bone.scale.set(r, len, r);
    });

    const pos = this.palm.geometry.attributes.position;
    this.palmIdx.forEach((j, i) => {
      const p = this.joints[j].position;
      pos.setXYZ(i, p.x, p.y, p.z);
    });
    pos.needsUpdate = true;
    this.palm.geometry.computeVertexNormals();
    this.palm.geometry.computeBoundingSphere();
    this.group.visible = true;
  }
}

export class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    // 1.5 rather than 2: on a full-screen retina window the renderer and the hand tracker share
    // the GPU, and logs showed tracking at 50 fps with more dropouts after the lighting upgrade.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(BACKDROP);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    this.renderer = renderer;

    const scene = new THREE.Scene();
    // Distant table fades into the page background instead of ending at a visible edge.
    scene.fog = new THREE.Fog(BACKDROP, 15, 34);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.28; // reflections and soft fill only; the key light does the modelling
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);

    // Key: one warm lamp above and to the left, like a reading lamp over a table. A spot
    // (not a sun) so the light pools on the board and falls off across the table, and
    // low enough that the pieces throw long, readable shadows.
    const key = new THREE.SpotLight(0xffdfb8, 560, 0, 0.6, 0.5, 2);
    key.position.set(-4.4, 7.2, 3.6);
    key.target.position.set(0.2, 0, 0.1);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); // with PCF soft filtering, a moderate map gives the softer, lamp-like edge
    key.shadow.camera.near = 3;
    key.shadow.camera.far = 18;
    key.shadow.bias = -0.00012;
    key.shadow.normalBias = 0.012;
    this.keyLight = key;
    // Rim: cool, from behind-right, separates the pieces' dark side from the dark table.
    const rim = new THREE.DirectionalLight(0x9db6e0, 0.55);
    rim.position.set(4.5, 3.2, -5);
    // Bounce: a little warm light coming back up off the table.
    const bounce = new THREE.HemisphereLight(0x2a2f3a, 0x3a2a1c, 0.3);
    scene.add(key, key.target, rim, bounce);

    const table = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), leatherMaterial());
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.215;
    table.receiveShadow = true;
    scene.add(table);
    this.table = table;
    this.lights = { key, rim, bounce };

    this.tweens = [];
    this.pointer = { x: 0, y: 0 };
    this.handFrame = null;
    this.hand = new HandModel();
    scene.add(this.hand.group);

    this.shift = 0; // horizontal view offset as a fraction of the width (start screen parks the board right)
    this.shiftTarget = 0;
    this.raycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();
    this.fx = 0; // bloom level, see flare()
    this.fxFade = 1.2;
    this.bloomThreshold = 1.25; // above the brightest lamp-lit surface; glossy scenes raise it
    this.shake = 0; // camera shake amplitude, decays by itself
  }

  /** Call once the subclass has built its scene. */
  start() {
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.renderer.setAnimationLoop(() => this.frame());
  }

  /**
   * Scales the lamp with the play area, so bigger boards are lit and shadowed the same way.
   * `radius` is the half-extent of the area that must sit inside the lamp's bright core.
   */
  setLampScale(radius) {
    const k = Math.max(1, radius / 3.4);
    this.keyLight.position.set(-4.4 * k, 7.2 * k, 3.6 * k);
    this.keyLight.intensity = 560 * k * k;
    this.keyLight.shadow.camera.near = 3 * k;
    this.keyLight.shadow.camera.far = 18 * k;
    this.keyLight.shadow.camera.updateProjectionMatrix();
    this.scene.fog.near = 15 * k;
    this.scene.fog.far = 34 * k;
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.frameCamera(w / h);
    this.applyShift();
    this.composer?.setSize(w, h);
  }

  /** Slide the whole view sideways; picking keeps working because rays use the same projection. */
  setShift(fraction, immediate = false) {
    this.shiftTarget = fraction;
    if (immediate) {
      this.shift = fraction;
      this.applyShift();
    }
  }

  applyShift() {
    const w = window.innerWidth, h = window.innerHeight;
    if (Math.abs(this.shift) < 1e-4) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, -this.shift * w, 0, w, h);
    this.camera.updateProjectionMatrix();
  }

  // ---------- pointer helpers ----------

  ray(x, y) {
    const ndc = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    return this.raycaster.ray;
  }

  /** World point where the screen position hits the horizontal plane at `height`. */
  pointOnPlane(x, y, height) {
    const out = new THREE.Vector3();
    const hit = this.ray(x, y).intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -height), out);
    return hit ? out : null;
  }

  /** Screen position of a world point (used by tests and UI). */
  toScreen(x, y, z) {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    return { x: ((v.x + 1) / 2) * window.innerWidth, y: ((1 - v.y) / 2) * window.innerHeight };
  }

  tween({ dur, delay = 0, update, done }) {
    this.tweens.push({ t: -delay, dur, update, done });
  }

  // ---------- hand ----------

  /** frame: MediaPipe frame from HandTracker, or null to hide. x/y: cursor in client px. */
  setHand(frame, x, y, aspect = 4 / 3) {
    // MediaPipe labels hands as seen in a mirrored image; the raw webcam frame isn't mirrored, so swap.
    const side = frame?.handedness === 'Right' ? 'left' : 'right';
    this.handFrame = frame ? { landmarks: frame.landmarks, aspect, side } : null;
    if (frame) this.pointer = { x, y };
    else this.hand.hide();
  }

  /** 'left' | 'right' | null — which hand model is currently shown. */
  handSide() {
    return this.hand.rigged.side ?? this.handFrame?.side ?? null;
  }

  // ---------- frame loop ----------

  frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;
    const wave = Math.sin(time * 7);

    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i];
      tw.t += dt;
      if (tw.t < 0) continue;
      const k = Math.min(1, tw.t / tw.dur);
      tw.update(k);
      if (k === 1) {
        this.tweens.splice(i, 1);
        tw.done?.();
      }
    }

    if (Math.abs(this.shiftTarget - this.shift) > 1e-4) {
      this.shift += (this.shiftTarget - this.shift) * damp(4.5, dt);
      if (Math.abs(this.shiftTarget - this.shift) < 5e-4) this.shift = this.shiftTarget;
      this.applyShift();
    }

    this.update(dt, wave);
    if (this.fx > 0) this.fx = Math.max(0, this.fx - dt / this.fxFade);
    this.shake *= Math.exp(-14 * dt);

    if (this.handFrame) {
      const anchor = this.handAnchor();
      if (anchor) this.hand.update(this.handFrame.landmarks, this.handFrame.aspect, anchor, this.handFrame.side);
    }
    // The hand itself shows its state (kept subtle so the skin still reads as skin).
    const glow = this.handGlow();
    for (const material of this.hand.materials) applyGlow(material, glow, wave);

    // a slam or a win shakes the view for a moment
    const cam = this.camera.position, s = this.shake;
    const ox = s > 1e-3 ? (Math.random() - 0.5) * s : 0, oy = s > 1e-3 ? (Math.random() - 0.5) * s : 0;
    cam.x += ox; cam.y += oy;
    this.draw();
    cam.x -= ox; cam.y -= oy;
  }

  // ---------- bloom ----------
  // Post-processing costs GPU time that hand tracking shares, so bloom only runs while a
  // moment calls for it (a win, a special play) and the plain renderer draws the rest.
  // The threshold sits above anything the lamp lights, so only emissive glows and the gold
  // dust bloom, never the white faces of the pieces.

  /** Flare the bloom up to `amount` (0..1); it fades over about `fade` seconds. */
  flare(amount, fade = 1.2) {
    if (!this.composer) {
      const w = window.innerWidth, h = window.innerHeight;
      this.composer = new EffectComposer(this.renderer);
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(w / 2, h / 2), 0, 0.45, this.bloomThreshold);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    }
    if (amount < this.fx) return; // a smaller flare never cuts a bigger one short
    this.fx = amount;
    this.fxFade = fade;
  }

  draw() {
    if (this.composer && this.fx > 0.02) {
      this.bloom.strength = 1.3 * this.fx;
      this.composer.render();
    } else this.renderer.render(this.scene, this.camera);
  }

  // ---------- hooks for the game scene ----------

  /** Place the camera for the given aspect ratio. */
  frameCamera(_aspect) {}

  /** Per-frame game animation. */
  update(_dt, _wave) {}

  /** World position of the pinch point: on the held piece, or hovering where the cursor points. */
  handAnchor() { return null; }

  handGlow() { return NO_GLOW; }
}
