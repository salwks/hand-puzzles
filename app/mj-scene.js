// Mahjong scene: a baize table in a lacquered frame, and 136 two-layer tiles (ivory body,
// jade back) with carved faces drawn in code. Every tile always has a pose computed from
// its place in the game — wall, hand, river or meld — and glides there when that changes.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { woodMaps, lacqueredWood, feltMaterial, woodUV } from './materials.js';
import { Stage, COLOR, NO_GLOW, applyGlow, damp, easeInOutCubic } from './stage.js';
import { typeOf } from './mj-logic.js';

export const TW = 0.34, TH = 0.46, TD = 0.27; // tile width, height, thickness // tile width, height, thickness
const HALF = 4.45; // half size of the playing surface
// RIVER_Z > half a 6-tile row (1.05) so neighbouring rivers never overlap at the corners
const HAND_Z = 3.8, RIVER_Z = 1.12, WALL_Z = 3.35, MELD_Z = 3.95;
const HOVER = 1.2;
const CARRY_Y = 0.75;
export const SEAT_YAW = [0, Math.PI / 2, Math.PI, -Math.PI / 2]; // me, right, across, left

// ---------- tile art ----------
// Faces are FluffyStuff's riichi-mahjong-tiles (CC0, public domain), in assets/tiles/.

const FILES = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `Man${n}`), ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `Pin${n}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `Sou${n}`), 'Ton', 'Nan', 'Shaa', 'Pei', 'Haku', 'Hatsu', 'Chun',
];
/** URL of a tile face image (also used by the HTML overlays). */
export const tileSrc = (t) => `assets/tiles/${FILES[t]}.svg`;

const FACE_W = 300, FACE_H = 400;
const faceTex = new Map();
function faceTexture(t) {
  if (!faceTex.has(t)) {
    const canvas = document.createElement('canvas');
    canvas.width = FACE_W * 2; canvas.height = FACE_H * 2; // 2x for crisp faces up close
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const img = new Image();
    img.onload = () => {
      // inset the art so it sits inside the tile's bevel with an ivory margin, like a carved face
      const mx = canvas.width * 0.13, my = canvas.height * 0.1;
      canvas.getContext('2d').drawImage(img, mx, my, canvas.width - 2 * mx, canvas.height - 2 * my);
      tex.needsUpdate = true;
    };
    img.src = tileSrc(t);
    faceTex.set(t, tex);
  }
  return faceTex.get(t);
}
// Start loading every face right away so none pops in mid-game.
for (let t = 0; t < 34; t++) faceTexture(t);

// ---------- tile mesh ----------

const BODY_D = TD * 0.7, BACK_D = TD * 0.3;
const tileGeo = (() => {
  const body = new RoundedBoxGeometry(TW, TH, BODY_D, 3, 0.035);
  body.translate(0, 0, TD / 2 - BODY_D / 2);
  const back = new RoundedBoxGeometry(TW, TH, BACK_D, 3, 0.035);
  back.translate(0, 0, -TD / 2 + BACK_D / 2);
  return mergeGeometries([body, back], true);
})();
const decalGeo = new THREE.PlaneGeometry(TW * 0.94, TH * 0.94);

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
    this.softenLight();
    this.bloomThreshold = 2.6; // glazed ivory throws highlights well above 1
    this.start();
  }

  /** Room light around the lamp: a softer key plus fills from the other sides, so shadows read
   *  as the lamp's but open up instead of dropping to black — the look of a lit room, not a stage. */
  softenLight() {
    this.keyLight.intensity *= 0.8;
    this.keyLight.shadow.radius = 4;
    this.keyLight.shadow.mapSize.set(1024, 1024); // lower res + PCF soft = wider penumbra
    this.scene.environmentIntensity = 0.5;
    const fill = new THREE.DirectionalLight(0xffe9cc, 0.7); // warm light bouncing off the wall opposite the lamp
    fill.position.set(6, 5, 4);
    const front = new THREE.DirectionalLight(0xfff4e4, 0.35); // off the player's side, lifts the hand's faces
    front.position.set(0, 3, 9);
    const back = new THREE.DirectionalLight(0xcbd8ee, 0.3); // cool sky from behind
    back.position.set(-2, 4, -8);
    const bounce = new THREE.HemisphereLight(0x565a66, 0x2c3a2e, 0.55); // green felt bounce under the tiles
    this.scene.add(fill, front, back, bounce);
  }

  buildTable() {
    const felt = new THREE.Mesh(new THREE.BoxGeometry(HALF * 2, 0.1, HALF * 2), feltMaterial(0x1a3a2b, 9));
    felt.position.y = -0.05;
    felt.receiveShadow = true;
    const walnut = woodMaps('#3a2418', '#120804', 31, { pores: 80 });
    const frameMat = lacqueredWood(walnut, { repeat: 1, roughness: 0.45, clearcoat: 0.6 });
    const frame = new THREE.Group();
    for (const [w, d, x, z] of [[HALF * 2 + 0.9, 0.45, 0, HALF + 0.225], [HALF * 2 + 0.9, 0.45, 0, -HALF - 0.225],
      [0.45, HALF * 2, HALF + 0.225, 0], [0.45, HALF * 2, -HALF - 0.225, 0]]) {
      // grain runs along each rail's length, at true scale
      const m = new THREE.Mesh(woodUV(new RoundedBoxGeometry(w, 0.26, d, 3, 0.05), w > d ? 'x' : 'z', 1.8), frameMat);
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
    const consoleMesh = new THREE.Mesh(woodUV(new RoundedBoxGeometry(1.25, 0.1, 1.25, 3, 0.04), 'x', 1.4), lacqueredWood(ebony, { repeat: 1, roughness: 0.4, clearcoat: 0.8 }));
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
    const zone = new THREE.Mesh(new THREE.RingGeometry((RIVER_Z - 0.06) * Math.SQRT2, (RIVER_Z - 0.04) * Math.SQRT2, 4, 1, Math.PI / 4), new THREE.MeshBasicMaterial({ color: 0xb89b5e, transparent: true, opacity: 0.0, depthWrite: false }));
    zone.rotation.x = -Math.PI / 2;
    zone.position.y = 0.003;
    this.zone = zone;
    // where the tile to draw waits: a pulsing gold ring on the felt
    const spot = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.36, 48), new THREE.MeshBasicMaterial({ color: 0xd6a23e, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    spot.rotation.x = -Math.PI / 2;
    spot.position.y = 0.004;
    this.drawSpot = spot;
    this.scene.add(felt, frame, consoleMesh, label, zone, spot);
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
    return seatPose((side + 3) % 4, (8 - stack) * (TW + 0.004) - 0.17, TD / 2 + level * TD, WALL_Z, Math.PI / 2);
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
    // Already there (and not on its way elsewhere): leave it still, so re-laying a hand only moves what changed.
    if (!o.moving && o.root.position.distanceTo(target.p) < 1e-3 && o.root.quaternion.angleTo(target.q) < 1e-3) {
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

  /** The pose a wall tile pops out to when it's the player's turn to draw: pulled out towards
   *  the centre and lifted, still face-down, so the hand in front can't hide it. */
  popPose(index) {
    const t = this.wallPose(index);
    const d = Math.hypot(t.p.x, t.p.z) || 1;
    t.p.x -= (t.p.x / d) * 0.375;
    t.p.z -= (t.p.z / d) * 0.375;
    t.p.y += 0.35;
    return t;
  }

  showDrawSpot(pos) {
    this.drawSpotOn = Boolean(pos);
    if (pos) this.drawSpot.position.set(pos.x, 0.004, pos.z);
  }

  /** Reward for a win: the winning hand ripples and glows gold, and gold dust rises from it. */
  celebrate(ids, { strong = true } = {}) {
    ids.forEach((id, i) => {
      const o = this.tiles.get(id);
      if (!o) return;
      o.glow = { color: 0xe0b45a, intensity: 2.2, pulse: true };
      const base = o.root.position.clone();
      this.tween({
        dur: 0.7, delay: 0.25 + i * 0.07,
        update: (k) => { o.root.position.y = base.y + Math.sin(Math.PI * k) * 0.45; },
        done: () => { o.root.position.y = base.y; },
      });
    });
    if (!strong || !ids.length) return;
    const c = new THREE.Vector3();
    for (const id of ids) c.add(this.tiles.get(id).root.position);
    c.divideScalar(ids.length);
    this.burst(c);
  }

  burst(at, count = 420) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3), vel = [];
    for (let i = 0; i < count; i++) {
      pos.set([at.x + (Math.random() - 0.5) * 3, at.y + Math.random() * 0.3, at.z + (Math.random() - 0.5) * 1.2], i * 3);
      vel.push([(Math.random() - 0.5) * 0.9, 1.2 + Math.random() * 2.4, (Math.random() - 0.5) * 0.9]);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: new THREE.Color(0xffd98a).multiplyScalar(5), size: 0.07, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);
    this.bursts ??= [];
    this.bursts.push({ pts, vel, t: 0 });
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
    for (const b of this.bursts ?? []) {
      b.t += dt;
      const a = b.pts.geometry.attributes.position;
      for (let i = 0; i < b.vel.length; i++) {
        const v = b.vel[i];
        v[1] -= 1.4 * dt; // slow fall, like dust in lamplight
        a.setXYZ(i, a.getX(i) + v[0] * dt, a.getY(i) + v[1] * dt, a.getZ(i) + v[2] * dt);
      }
      a.needsUpdate = true;
      b.pts.material.opacity = Math.max(0, 1 - b.t / 2.8);
      b.pts.material.size = 0.07 * (1 + 0.3 * Math.sin(b.t * 20));
    }
    this.bursts = (this.bursts ?? []).filter((b) => { if (b.t < 2.8) return true; this.scene.remove(b.pts); return false; });
    this.drawSpot.material.opacity = this.drawSpotOn ? 0.55 + 0.35 * wave : 0;
    this.drawSpot.scale.setScalar(this.drawSpotOn ? 1 + 0.12 * wave : 1);
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
