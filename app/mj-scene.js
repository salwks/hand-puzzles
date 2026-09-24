// Mahjong scene: a baize table in a lacquered frame, and 136 two-layer tiles (ivory body,
// jade back) with carved faces drawn in code. Every tile always has a pose computed from
// its place in the game — wall, hand, river or meld — and glides there when that changes.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { woodMaps, lacqueredWood, feltMaterial } from './materials.js';
import { Stage, COLOR, NO_GLOW, applyGlow, damp, easeInOutCubic } from './stage.js';
import { typeOf } from './mj-logic.js';

export const TW = 0.34, TH = 0.46, TD = 0.27; // tile width, height, thickness // tile width, height, thickness
const HALF = 4.45; // half size of the playing surface
const HAND_Z = 3.8, RIVER_Z = 0.82, WALL_Z = 3.02, MELD_Z = 3.95;
const HOVER = 1.2;
const CARRY_Y = 0.75;
export const SEAT_YAW = [0, Math.PI / 2, Math.PI, -Math.PI / 2]; // me, right, across, left

// ---------- tile art ----------

const FACE_W = 256, FACE_H = 346;
const KANJI = '一二三四五六七八九';
const HONOR = ['東', '南', '西', '北', '', '發', '中'];
const INK = '#1b1f2a', RED = '#a8231c', GREEN = '#1f6b44', BLUE = '#1c4f8c';

// Standard pip layouts for pin (circles) and sou (bamboo), in a 0..1 box.
const PIPS = {
  1: [[0.5, 0.5]], 2: [[0.5, 0.26], [0.5, 0.74]], 3: [[0.22, 0.2], [0.5, 0.5], [0.78, 0.8]],
  4: [[0.28, 0.26], [0.72, 0.26], [0.28, 0.74], [0.72, 0.74]],
  5: [[0.26, 0.22], [0.74, 0.22], [0.5, 0.5], [0.26, 0.78], [0.74, 0.78]],
  6: [[0.3, 0.2], [0.7, 0.2], [0.3, 0.52], [0.7, 0.52], [0.3, 0.82], [0.7, 0.82]],
  7: [[0.2, 0.14], [0.5, 0.24], [0.8, 0.34], [0.3, 0.58], [0.7, 0.58], [0.3, 0.84], [0.7, 0.84]],
  8: [[0.3, 0.14], [0.7, 0.14], [0.3, 0.38], [0.7, 0.38], [0.3, 0.62], [0.7, 0.62], [0.3, 0.86], [0.7, 0.86]],
  9: [[0.2, 0.18], [0.5, 0.18], [0.8, 0.18], [0.2, 0.5], [0.5, 0.5], [0.8, 0.5], [0.2, 0.82], [0.5, 0.82], [0.8, 0.82]],
};

/** Draws a tile face (transparent background) — used for the 3D decal and for the HTML overlays. */
export function drawFace(t, canvas = document.createElement('canvas')) {
  canvas.width = FACE_W; canvas.height = FACE_H;
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, FACE_W, FACE_H);
  // carved look: a faint dark offset under every mark
  const carve = (fn) => { g.save(); g.translate(2, 3); g.globalAlpha = 0.18; fn('#000'); g.restore(); fn(null); };
  const text = (s, x, y, size, color) => carve((c) => {
    g.fillStyle = c ?? color; g.font = `700 ${size}px "Noto Serif KR", "Songti SC", serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, x, y);
  });
  const box = { x: 28, y: 30, w: FACE_W - 56, h: FACE_H - 60 };
  if (t < 9) {
    text(KANJI[t], FACE_W / 2, 108, 120, INK);
    text('萬', FACE_W / 2, 250, 120, RED);
  } else if (t < 18) {
    const n = t - 8, r = n === 1 ? 70 : n <= 4 ? 40 : n <= 6 ? 32 : 26;
    for (const [i, [px, py]] of PIPS[n].entries()) {
      const x = box.x + px * box.w, y = box.y + py * box.h;
      const col = n === 1 ? RED : (n === 5 && i === 2) || (n === 9 && (i >= 3 && i <= 5)) || (n === 7 && i < 3) ? RED : i % 2 ? BLUE : GREEN;
      carve((c) => {
        g.strokeStyle = c ?? col; g.lineWidth = r * 0.22; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
        g.fillStyle = c ?? col; g.beginPath(); g.arc(x, y, r * 0.38, 0, Math.PI * 2); g.fill();
      });
    }
  } else if (t < 27) {
    const n = t - 17;
    if (n === 1) { // the "peacock": a single ornate stick
      carve((c) => { g.fillStyle = c ?? GREEN; g.fillRect(FACE_W / 2 - 22, 60, 44, 230); g.fillStyle = c ?? RED; g.beginPath(); g.arc(FACE_W / 2, 70, 36, 0, Math.PI * 2); g.fill(); });
    } else {
      const bw = 18, bh = n <= 3 ? 110 : n <= 6 ? 76 : 58;
      for (const [i, [px, py]] of PIPS[n].entries()) {
        const x = box.x + px * box.w, y = box.y + py * box.h;
        const col = (n === 5 && i === 2) || (n === 7 && i === 0) || (n === 9 && i % 3 === 1) ? RED : GREEN;
        carve((c) => {
          g.fillStyle = c ?? col; g.fillRect(x - bw / 2, y - bh / 2, bw, bh);
          g.fillStyle = c ?? '#f1ead8'; g.fillRect(x - bw / 2, y - 2, bw, 4);
        });
      }
    }
  } else if (t === 31) { // 白: an empty blue frame
    carve((c) => { g.strokeStyle = c ?? BLUE; g.lineWidth = 10; g.strokeRect(58, 64, FACE_W - 116, FACE_H - 128); });
  } else {
    text(HONOR[t - 27], FACE_W / 2, FACE_H / 2 + 6, 170, t === 32 ? GREEN : t === 33 ? RED : INK);
  }
  return canvas;
}

const faceTex = new Map();
function faceTexture(t) {
  if (!faceTex.has(t)) {
    const tex = new THREE.CanvasTexture(drawFace(t));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    faceTex.set(t, tex);
  }
  return faceTex.get(t);
}

// ---------- tile mesh ----------

const BODY_D = TD * 0.7, BACK_D = TD * 0.3;
const tileGeo = (() => {
  const body = new RoundedBoxGeometry(TW, TH, BODY_D, 3, 0.035);
  body.translate(0, 0, TD / 2 - BODY_D / 2);
  const back = new RoundedBoxGeometry(TW, TH, BACK_D, 3, 0.035);
  back.translate(0, 0, -TD / 2 + BACK_D / 2);
  return mergeGeometries([body, back], true);
})();
const decalGeo = new THREE.PlaneGeometry(TW * 0.84, TH * 0.86);

class TileObj {
  constructor(id) {
    this.id = id;
    this.t = typeOf(id);
    this.ivory = new THREE.MeshPhysicalMaterial({
      color: 0xf1ead8, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.18, sheen: 0.3, sheenColor: 0xfff6e0,
    });
    this.jade = new THREE.MeshPhysicalMaterial({ color: 0x1d6a4b, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1 });
    this.mesh = new THREE.Mesh(tileGeo, [this.ivory, this.jade]);
    this.mesh.castShadow = this.mesh.receiveShadow = true;
    this.mesh.userData.tile = id;
    this.root = new THREE.Group();
    this.root.add(this.mesh);
    this.decal = null;
    this.glow = NO_GLOW;
    this.moving = null;
  }

  showFace(on) {
    if (on && !this.decal) {
      this.decal = new THREE.Mesh(decalGeo, new THREE.MeshStandardMaterial({
        map: faceTexture(this.t), transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2,
      }));
      this.decal.position.z = TD / 2 + 0.002;
      this.root.add(this.decal);
    }
    if (this.decal) this.decal.visible = on;
  }
}

// ---------- poses ----------

const qTmp = new THREE.Quaternion(), eTmp = new THREE.Euler();
const pose = (x, y, z, rx = 0, ry = 0, rz = 0, order = 'YXZ') => ({
  p: new THREE.Vector3(x, y, z), q: new THREE.Quaternion().setFromEuler(eTmp.set(rx, ry, rz, order)),
});
/** Local seat frame (x across, z towards the seat's player) → world pose, lying/standing via rx. */
function seatPose(seat, lx, y, lz, rx, localYaw = 0) {
  const yaw = SEAT_YAW[seat];
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return pose(lx * c + lz * s, y, -lx * s + lz * c, rx, yaw + localYaw, 0);
}

export class MahjongScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.tiles = new Map(); // id -> TileObj
    this.carried = null;
    this.buildTable();
    this.setLampScale(5.2);
    this.start();
  }

  buildTable() {
    const felt = new THREE.Mesh(new THREE.BoxGeometry(HALF * 2, 0.1, HALF * 2), feltMaterial(0x1a3a2b, 9));
    felt.position.y = -0.05;
    felt.receiveShadow = true;
    const walnut = woodMaps('#3a2418', '#120804', 31, { pores: 80 });
    const frameMat = lacqueredWood(walnut, { repeat: 1.5, roughness: 0.45, clearcoat: 0.6 });
    const frame = new THREE.Group();
    for (const [w, d, x, z] of [[HALF * 2 + 0.9, 0.45, 0, HALF + 0.225], [HALF * 2 + 0.9, 0.45, 0, -HALF - 0.225],
      [0.45, HALF * 2, HALF + 0.225, 0], [0.45, HALF * 2, -HALF - 0.225, 0]]) {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, 0.26, d, 3, 0.05), frameMat);
      m.position.set(x, 0.03, z);
      m.castShadow = m.receiveShadow = true;
      frame.add(m);
    }
    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a65c, metalness: 1, roughness: 0.25 });
    for (const [w, d, x, z] of [[HALF * 2, 0.03, 0, HALF - 0.08], [HALF * 2, 0.03, 0, -HALF + 0.08], [0.03, HALF * 2, HALF - 0.08, 0], [0.03, HALF * 2, -HALF + 0.08, 0]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.004, d), brass);
      b.position.set(x, 0.002, z);
      frame.add(b);
    }
    // centre console with the round's wind
    const ebony = woodMaps('#1a1410', '#030201', 29, { pores: 60, highlights: false });
    const consoleMesh = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.1, 1.25, 3, 0.04), lacqueredWood(ebony, { repeat: 1, roughness: 0.4, clearcoat: 0.8 }));
    consoleMesh.position.y = 0.05;
    consoleMesh.castShadow = consoleMesh.receiveShadow = true;
    this.windCanvas = document.createElement('canvas');
    this.windCanvas.width = this.windCanvas.height = 256;
    this.windTex = new THREE.CanvasTexture(this.windCanvas);
    this.windTex.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshStandardMaterial({ map: this.windTex, transparent: true, roughness: 0.5 }));
    label.rotation.x = -Math.PI / 2;
    label.position.y = 0.102;
    // the river zone marker: where discards go
    const zone = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.62, 4, 1, Math.PI / 4), new THREE.MeshBasicMaterial({ color: 0xb89b5e, transparent: true, opacity: 0.0, depthWrite: false }));
    zone.rotation.x = -Math.PI / 2;
    zone.position.y = 0.003;
    this.zone = zone;
    this.scene.add(felt, frame, consoleMesh, label, zone);
  }

  /** Round label on the centre console, e.g. ('동', 1, [25000, …], dealerSeat). */
  setRoundLabel(wind, n, left) {
    const g = this.windCanvas.getContext('2d');
    g.clearRect(0, 0, 256, 256);
    g.fillStyle = '#b89b5e';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '600 64px "Noto Serif KR", serif';
    g.fillText(`${wind} ${n}국`, 128, 108);
    g.font = '28px "IBM Plex Sans KR", sans-serif';
    g.fillStyle = '#9c9385';
    g.fillText(`남은 패 ${left}`, 128, 176);
    this.windTex.needsUpdate = true;
  }

  frameCamera(aspect) {
    // Close enough that the player's own hand reads clearly; the far frame may crop a little.
    const el = THREE.MathUtils.degToRad(50);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const forWidth = (HALF - 0.15) / (tanV * aspect);
    const forDepth = (HALF * Math.sin(el) + 0.2) / (tanV * 0.92);
    const dist = Math.max(forWidth, forDepth, 7.5);
    this.camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist + 1.2);
    this.camera.lookAt(0, 0, 1.2);
  }

  // ---------- tiles ----------

  reset(ids) {
    for (const o of this.tiles.values()) this.scene.remove(o.root);
    this.tiles.clear();
    this.carried = null;
    this.tweens = [];
    for (const id of ids) {
      const o = new TileObj(id);
      this.tiles.set(id, o);
      this.scene.add(o.root);
    }
  }

  tile(id) { return this.tiles.get(id); }

  // Poses. Seat 0 is the player, looking at the table from +z.
  wallPose(index) { // 136 positions: 4 sides × 17 stacks × 2 levels, drawn top level first
    const side = Math.floor(index / 34), q = index % 34, stack = Math.floor(q / 2), level = 1 - (q % 2);
    // walls are staggered like a pinwheel so the four corners don't collide
    return seatPose((side + 3) % 4, (8 - stack) * (TW + 0.004) - 0.34, TD / 2 + level * TD, WALL_Z, Math.PI / 2);
  }

  handPose(seat, i, n, drawnGap = false, meldCount = 0) {
    // the hand slides left as melds take up the right-hand side
    const x = (i - (n - 1) / 2) * (TW + 0.01) - 0.5 - meldCount * 0.55 + (drawnGap ? 0.16 : 0);
    if (seat === 0) return seatPose(0, x, TH / 2 + 0.04, HAND_Z, -0.5); // leaning back towards the player
    return seatPose(seat, x, TH / 2, HAND_Z, 0);
  }

  /** A hand laid down face-up in front of its owner (win or exhaustive-draw reveal). */
  openHandPose(seat, i, n) {
    const x = (i - (n - 1) / 2) * (TW + 0.01) - 0.5;
    return seatPose(seat, x, TD / 2, HAND_Z - 0.25, -Math.PI / 2);
  }

  riverPose(seat, k, sideways = false, sidewaysBefore = false) {
    const row = Math.min(3, Math.floor(k / 6)), col = row === 3 ? k - 18 : k % 6;
    let x = -0.87 + col * (TW + 0.01) + (sidewaysBefore ? (TH - TW) : 0);
    if (sideways) x += (TH - TW) / 2;
    const z = RIVER_Z + row * (TH + 0.02) + TH / 2 - (sideways ? (TH - TW) / 2 : 0);
    return seatPose(seat, x, TD / 2, z, -Math.PI / 2, sideways ? Math.PI / 2 : 0);
  }

  meldPose(seat, offset, sideways = false) { // lying face-up, filling leftwards from the seat's right corner
    const x = 3.7 - offset - (sideways ? TH : TW) / 2;
    const z = MELD_Z - (sideways ? (TH - TW) / 2 : 0);
    return seatPose(seat, x, TD / 2, z, -Math.PI / 2, sideways ? Math.PI / 2 : 0);
  }

  /** Move a tile to a pose; `face` = whether its face should be visible. */
  place(id, target, { face = null, dur = 0.35, arc = 0.25, delay = 0, instant = false } = {}) {
    const o = this.tiles.get(id);
    if (!o) return;
    if (face !== null && face) o.showFace(true);
    if (instant) {
      o.root.position.copy(target.p);
      o.root.quaternion.copy(target.q);
      if (face === false) o.showFace(false);
      return;
    }
    const p0 = o.root.position.clone(), q0 = o.root.quaternion.clone();
    o.moving = true;
    this.tween({
      dur, delay,
      update: (k) => {
        const e = easeInOutCubic(k);
        o.root.position.lerpVectors(p0, target.p, e);
        o.root.position.y += Math.sin(Math.PI * k) * arc;
        o.root.quaternion.slerpQuaternions(q0, target.q, e);
      },
      done: () => { o.moving = null; if (face === false) o.showFace(false); },
    });
  }

  setGlow(id, glow) {
    const o = this.tiles.get(id);
    if (o) o.glow = glow ?? NO_GLOW;
  }

  // ---------- pointer ----------

  /** Tile id under the screen position, among `ids`. */
  pick(x, y, ids) {
    this.ray(x, y);
    const meshes = ids.map((id) => this.tiles.get(id)?.mesh).filter(Boolean);
    const hit = this.raycaster.intersectObjects(meshes, false)[0];
    return hit ? hit.object.userData.tile : null;
  }

  pointerOnTable(y = 0) { return this.pointOnPlane(this.pointer.x, this.pointer.y, y); }

  carry(id, sideways = false) {
    this.carried = this.tiles.get(id) ?? null;
    this.carrySideways = sideways;
    if (this.carried) this.carried.showFace(true);
  }

  setCarrySideways(on) { this.carrySideways = on; }

  dropCarry() { const o = this.carried; this.carried = null; return o; }

  // ---------- frame ----------

  update(dt, wave) {
    const c = this.carried;
    if (c) {
      const p = this.pointerOnTable(CARRY_Y);
      if (p) {
        const k = damp(20, dt);
        c.root.position.x += (p.x - c.root.position.x) * k;
        c.root.position.z += (p.z - c.root.position.z) * k;
        c.root.position.y += (CARRY_Y - c.root.position.y) * k;
        // held face-up, tilted towards the player; turned sideways for a riichi declaration
        eTmp.set(-Math.PI / 2 + 0.5, this.carrySideways ? Math.PI / 2 : 0, 0, 'YXZ');
        qTmp.setFromEuler(eTmp);
        c.root.quaternion.slerp(qTmp, k);
      }
    }
    for (const o of this.tiles.values()) {
      applyGlow(o.ivory, o.glow, wave, 0.45);
      applyGlow(o.jade, o.glow, wave, 0.6);
    }
    this.zone.material.opacity += ((this.zoneOn ? 0.55 + 0.25 * wave : 0) - this.zone.material.opacity) * damp(8, dt);
  }

  handAnchor() {
    if (this.carried) {
      const r = this.carried.root.position;
      return new THREE.Vector3(r.x, r.y + 0.12, r.z);
    }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, HOVER);
  }

  handGlow() {
    if (this.carried) return { color: COLOR.held, intensity: 0.16 };
    return this.hoverOn ? { color: COLOR.hover, intensity: 0.14 } : NO_GLOW;
  }

  seatScreen(seat) {
    const yaw = SEAT_YAW[seat], r = seat === 0 ? 0 : HALF + 0.2;
    return this.toScreen(Math.sin(yaw) * r, 0.3, Math.cos(yaw) * r);
  }
}
