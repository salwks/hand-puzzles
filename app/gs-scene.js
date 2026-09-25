// Go-Stop scene: a green blanket in a lacquered frame, and 48 hwatu cards — thick, glossy
// plastic with a red back. Every card has a pose computed from where it is in the game
// (deck, floor slot, a hand, a capture pile) and glides there; a played card is slammed.
import * as THREE from 'three';
import { woodMaps, lacqueredWood, feltMaterial, woodUV } from './materials.js';
import { Stage, COLOR, NO_GLOW, applyGlow, damp, easeInOutCubic, easeInQuad } from './stage.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CARDS } from './gs-logic.js';

export const CW = 0.7, CH = 1.14, CT = 0.026; // card width, height (depth on the table), thickness
const HW = 5.3, HD = 4.3; // half width / depth of the blanket
const CARRY_Y = 0.9;
const HOVER = 1.1;

/** URL of a card face (also used by the HTML overlays). */
export const cardSrc = (id) => `assets/hwatu/${CARDS[id].file}.svg`;

// ---------- card art ----------

const faceTex = new Map();
function faceTexture(id) {
  if (!faceTex.has(id)) {
    const canvas = document.createElement('canvas');
    canvas.width = 412; canvas.height = 672;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const img = new Image();
    img.onload = () => { canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height); tex.needsUpdate = true; };
    img.src = cardSrc(id);
    faceTex.set(id, tex);
  }
  return faceTex.get(id);
}
for (let id = 0; id < 48; id++) faceTexture(id);

const backTex = (() => {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 418;
  const g = c.getContext('2d');
  g.fillStyle = '#8a1f1a';
  g.fillRect(0, 0, c.width, c.height);
  // a faint weave so the red isn't flat plastic
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,210,190'},${Math.random() * 0.05})`;
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 2);
  }
  g.strokeStyle = 'rgba(214,170,96,0.75)';
  g.lineWidth = 3;
  g.strokeRect(16, 16, c.width - 32, c.height - 32);
  g.lineWidth = 1.5;
  g.strokeRect(24, 24, c.width - 48, c.height - 48);
  g.save();
  g.translate(c.width / 2, c.height / 2);
  g.rotate(Math.PI / 4);
  g.strokeRect(-26, -26, 52, 52);
  g.strokeRect(-14, -14, 28, 28);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
})();

// ---------- card mesh ----------

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}
const SHAPE = roundedRect(CW, CH, 0.06);
/** A flat face in the XZ plane (image top towards -z), UVs spanning the card. */
function faceGeo(up) {
  const g = new THREE.ShapeGeometry(SHAPE, 6);
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / CW + 0.5, pos.getY(i) / CH + 0.5);
  g.rotateX(up ? -Math.PI / 2 : Math.PI / 2);
  g.translate(0, up ? CT / 2 + 0.0008 : -CT / 2 - 0.0008, 0);
  return g;
}
const FACE_GEO = faceGeo(true), BACK_GEO = faceGeo(false);
const EDGE_GEO = (() => {
  const g = new THREE.ExtrudeGeometry(SHAPE, { depth: CT, bevelEnabled: false, curveSegments: 6 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -CT / 2, 0);
  return g;
})();
const edgeMat = new THREE.MeshPhysicalMaterial({ color: 0x6e1814, roughness: 0.4, clearcoat: 0.5 });

class CardObj {
  constructor(id) {
    this.id = id;
    this.face = new THREE.MeshPhysicalMaterial({ map: faceTexture(id), roughness: 0.34, clearcoat: 0.8, clearcoatRoughness: 0.14 });
    this.back = new THREE.MeshPhysicalMaterial({ map: backTex, roughness: 0.36, clearcoat: 0.8, clearcoatRoughness: 0.16 });
    this.root = new THREE.Group();
    const edge = new THREE.Mesh(EDGE_GEO, edgeMat);
    const face = new THREE.Mesh(FACE_GEO, this.face);
    const back = new THREE.Mesh(BACK_GEO, this.back);
    for (const m of [edge, face, back]) { m.castShadow = true; m.receiveShadow = true; m.userData.card = id; }
    this.hit = edge;
    this.root.add(edge, face, back);
    this.glow = NO_GLOW;
    this.moving = false;
  }
}

// ---------- poses ----------

const eTmp = new THREE.Euler(), qTmp = new THREE.Quaternion();
const pose = (x, y, z, rx = 0, ry = 0, rz = 0, s = 1) => ({
  p: new THREE.Vector3(x, y, z), q: new THREE.Quaternion().setFromEuler(eTmp.set(rx, ry, rz, 'YXZ')), s,
});
/** A little per-card wobble so piles look placed by hand, not stamped. */
const jitter = (id, k = 1) => (((id * 7919) % 97) / 97 - 0.5) * k;

// floor: 5 slots in each of two rows around the deck, plus one at each end
const SLOTS = [
  [-1.45, 1.25], [0, 1.25], [1.45, 1.25], [-2.9, 1.25], [2.9, 1.25],
  [-1.45, -1.25], [0, -1.25], [1.45, -1.25], [-2.9, -1.25], [2.9, -1.25],
  [-4.2, 0], [4.2, 0],
];
export const SLOT_COUNT = SLOTS.length;
const KIND_ORDER = ['gwang', 'yeol', 'tti', 'pi'];

export class GoStopScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.cards = new Map();
    this.carried = null;
    this.buildTable();
    this.setLampScale(5.4);
    this.softenLight();
    for (let id = 0; id < 48; id++) {
      const o = new CardObj(id);
      o.root.position.copy(this.deckPose(id, 48).p);
      o.root.quaternion.copy(this.deckPose(id, 48).q);
      this.cards.set(id, o);
      this.scene.add(o.root);
    }
    this.start();
  }

  softenLight() {
    this.keyLight.intensity *= 0.8;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.environmentIntensity = 0.5;
    const fill = new THREE.DirectionalLight(0xffe9cc, 0.7);
    fill.position.set(6, 5, 4);
    const front = new THREE.DirectionalLight(0xfff4e4, 0.35);
    front.position.set(0, 3, 9);
    const back = new THREE.DirectionalLight(0xcbd8ee, 0.3);
    back.position.set(-2, 4, -8);
    const bounce = new THREE.HemisphereLight(0x565a66, 0x2c3a2e, 0.55);
    this.scene.add(fill, front, back, bounce);
  }

  buildTable() {
    // a heavy wool blanket, the traditional hwatu surface
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(HW * 2, 0.1, HD * 2), feltMaterial(0x24402f, 6));
    blanket.position.y = -0.05;
    blanket.receiveShadow = true;
    const walnut = woodMaps('#3a2418', '#120804', 31, { pores: 80 });
    const frameMat = lacqueredWood(walnut, { repeat: 1, roughness: 0.45, clearcoat: 0.6 });
    const frame = new THREE.Group();
    for (const [w, d, x, z] of [[HW * 2 + 0.9, 0.45, 0, HD + 0.225], [HW * 2 + 0.9, 0.45, 0, -HD - 0.225],
      [0.45, HD * 2, HW + 0.225, 0], [0.45, HD * 2, -HW - 0.225, 0]]) {
      const m = new THREE.Mesh(woodUV(new RoundedBoxGeometry(w, 0.26, d, 3, 0.05), w > d ? 'x' : 'z', 1.8), frameMat);
      m.position.set(x, 0.03, z);
      m.castShadow = m.receiveShadow = true;
      frame.add(m);
    }
    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a65c, metalness: 1, roughness: 0.25 });
    for (const [w, d, x, z] of [[HW * 2, 0.03, 0, HD - 0.08], [HW * 2, 0.03, 0, -HD + 0.08], [0.03, HD * 2, HW - 0.08, 0], [0.03, HD * 2, -HW + 0.08, 0]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.004, d), brass);
      b.position.set(x, 0.002, z);
      frame.add(b);
    }
    // gold rings: where the card will go (slot marker) and a pulsing one on the deck
    const ring = (r) => {
      const m = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.05, 48), new THREE.MeshBasicMaterial({ color: 0xd6a23e, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.004;
      return m;
    };
    this.deckRing = ring(0.8);
    this.deckRing.position.set(0, 0.004, 0);
    this.scene.add(blanket, frame, this.deckRing);
  }

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(56);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const forWidth = (HW + 0.2) / (tanV * aspect);
    const forDepth = (HD * Math.sin(el) + 0.5) / (tanV * 0.94);
    const dist = Math.max(forWidth, forDepth, 8);
    this.camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist + 0.9);
    this.camera.lookAt(0, 0, 0.5);
  }

  // ---------- poses ----------

  deckPose(i, n) { // i-th from the bottom of a deck of n; face down
    return pose(jitter(i, 0.03), CT * (i + 0.5) + 0.001, jitter(i + 5, 0.03), 0, jitter(i + 9, 0.06), Math.PI);
  }

  /** The top of the deck, turned face up and lifted towards the player. */
  revealPose() { return pose(0, 1.1, 0.8, 0.9, 0, 0); }

  /** A card held up off the table at (x, y, z), leaning back by `tilt`. */
  standPose(x, y, z, tilt = 0.45, s = 1) { return pose(x, y, z, tilt, 0, 0, s); }

  floorPose(slot, k, id) {
    const [x, z] = SLOTS[slot];
    return pose(x + k * 0.16, CT * (k + 0.5) + 0.001, z + k * 0.09, 0, jitter(id, 0.1), 0);
  }

  /** My hand: standing, leaning back towards me. */
  handPose(i, n, lift = 0) {
    const x = (i - (n - 1) / 2) * (CW + 0.07);
    return pose(x, 0.46 + lift, 3.45 - lift * 0.3, 0.95, 0, 0);
  }

  /** An opponent's hand: a tidy fan of backs at their side of the table. */
  oppHandPose(p, i, n) {
    const cx = p === 1 ? -3.3 : 3.3;
    const x = cx + (i - (n - 1) / 2) * 0.2;
    return pose(x, CT * (i + 0.5) + 0.001, -3.85, 0, (i - (n - 1) / 2) * 0.05, Math.PI, 0.7);
  }

  /** Capture piles, grouped 광 · 열끗 · 띠 · 피. `kind` is the pile, k the index in it. */
  capPose(p, kind, k, id) {
    const g = KIND_ORDER.indexOf(kind);
    if (p === 0) {
      const x0 = [-4.8, -3.35, -1.75, -0.1][g], step = g === 3 ? 0.1 : 0.14;
      return pose(x0 + k * step, CT * (k + 0.5) + 0.001, 2.5, 0, jitter(id, 0.05), 0, 0.72);
    }
    const s = 0.62, left = p === 1;
    const base = left ? -4.9 : 0.8;
    if (g === 3) return pose(base + k * 0.08, CT * (k + 0.5) + 0.001, -2.35, 0, jitter(id, 0.05), 0, s);
    const x0 = base + [0, 0.9, 2.05][g];
    return pose(x0 + k * 0.1, CT * (k + 0.5) + 0.001, -3.12, 0, jitter(id, 0.05), 0, s);
  }

  slotScreen(slot) {
    const [x, z] = SLOTS[slot];
    return this.toScreen(x, 0, z);
  }

  slotAt(point) { // the floor slot nearest a table point
    let best = 0, bd = Infinity;
    SLOTS.forEach(([x, z], i) => { const d = Math.hypot(point.x - x, point.z - z); if (d < bd) { bd = d; best = i; } });
    return { slot: best, dist: bd };
  }

  // ---------- motion ----------

  card(id) { return this.cards.get(id); }

  /** Glide a card to a pose. `face` true/false flips it on the way if needed (poses carry it). */
  place(id, target, { dur = 0.35, arc = 0.25, delay = 0, instant = false, done = null } = {}) {
    const o = this.cards.get(id);
    if (!o) return;
    const s1 = target.s ?? 1;
    if (instant) {
      o.root.position.copy(target.p);
      o.root.quaternion.copy(target.q);
      o.root.scale.setScalar(s1);
      done?.();
      return;
    }
    if (!o.moving && o.root.position.distanceTo(target.p) < 1e-3 && o.root.quaternion.angleTo(target.q) < 1e-3 && Math.abs(o.root.scale.x - s1) < 1e-3) return;
    const p0 = o.root.position.clone(), q0 = o.root.quaternion.clone(), s0 = o.root.scale.x;
    // the arc is for real journeys: a card nudged along its pile or fan slides flat
    const lift = arc * Math.min(1, Math.max(0, (p0.distanceTo(target.p) - 0.1) / 0.9));
    o.moving = true;
    this.tween({
      dur, delay,
      update: (k) => {
        const e = easeInOutCubic(k);
        o.root.position.lerpVectors(p0, target.p, e);
        o.root.position.y += Math.sin(Math.PI * k) * lift;
        o.root.quaternion.slerpQuaternions(q0, target.q, e);
        o.root.scale.setScalar(s0 + (s1 - s0) * e);
      },
      done: () => { o.moving = false; done?.(); },
    });
  }

  /**
   * Slam a card down onto a pose: a quick rise over the spot, then straight down hard.
   * `strength` 0..1 (how fast the hand came down) scales the drop and the jolt of the cards
   * it lands on. `onHit` fires at impact (for the sound).
   */
  slam(id, target, strength, onHit) {
    const o = this.cards.get(id);
    if (!o) return;
    const lift = 0.22 + 0.5 * strength;
    const above = { p: target.p.clone().add(new THREE.Vector3(0, lift, 0)), q: target.q, s: 1 };
    this.place(id, above, {
      dur: 0.16, arc: 0.05,
      done: () => {
        const p0 = o.root.position.clone();
        o.moving = true;
        this.tween({
          dur: 0.09 - 0.03 * strength,
          update: (k) => { o.root.position.lerpVectors(p0, target.p, easeInQuad(k)); },
          done: () => {
            o.moving = false;
            this.impact(target.p, strength, o);
            onHit?.();
          },
        });
      },
    });
  }

  impact(at, strength, landed) {
    // only the cards it lands on (a match under it) jolt; the rest of the table stays still
    for (const o of this.cards.values()) {
      if (o.moving || o === this.carried || o === landed) continue;
      const d = Math.hypot(o.root.position.x - at.x, o.root.position.z - at.z);
      if (d > 0.3 || o.root.position.y > 0.3) continue;
      const y0 = o.root.position.y, h = 0.02 * (0.4 + strength);
      this.tween({ dur: 0.18, update: (k) => { o.root.position.y = y0 + Math.sin(Math.PI * k) * h; }, done: () => { o.root.position.y = y0; } });
    }
    if (strength > 0.35) this.puff(at, strength);
  }

  /** A ring of blanket fluff kicked up by a hard slam. */
  puff(at, strength) {
    const n = Math.round(40 + 80 * strength);
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3), vel = [];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      pos.set([at.x + Math.cos(a) * 0.3, 0.03, at.z + Math.sin(a) * 0.45], i * 3);
      const v = 0.8 + Math.random() * 1.6 * strength;
      vel.push([Math.cos(a) * v, 0.4 + Math.random() * 0.8, Math.sin(a) * v]);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xd8d2bf, size: 0.03, transparent: true, opacity: 0.7, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);
    this.bursts.push({ pts, vel, t: 0, life: 0.6, drag: 5, gravity: 1.5 });
  }

  /** Reward: the winner's cards ripple and glow gold, and gold dust rises. */
  celebrate(ids, { strong = true } = {}) {
    ids.forEach((id, i) => {
      const o = this.cards.get(id);
      if (!o) return;
      o.glow = { color: 0xe0b45a, intensity: 1.1, pulse: true };
      const base = o.root.position.clone();
      this.tween({
        dur: 0.6, delay: 0.2 + i * 0.04,
        update: (k) => { o.root.position.y = base.y + Math.sin(Math.PI * k) * 0.35; },
        done: () => { o.root.position.y = base.y; },
      });
    });
    if (!strong || !ids.length) return;
    const c = new THREE.Vector3();
    for (const id of ids) c.add(this.cards.get(id).root.position);
    c.divideScalar(ids.length);
    const n = 420, geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), vel = [];
    for (let i = 0; i < n; i++) {
      pos.set([c.x + (Math.random() - 0.5) * 4, c.y + Math.random() * 0.3, c.z + (Math.random() - 0.5) * 1.2], i * 3);
      vel.push([(Math.random() - 0.5) * 0.9, 1.2 + Math.random() * 2.4, (Math.random() - 0.5) * 0.9]);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: new THREE.Color(0xffd98a).multiplyScalar(2.5), size: 0.08, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.scene.add(pts);
    this.bursts.push({ pts, vel, t: 0, life: 2.8, drag: 0, gravity: 1.4, twinkle: true });
  }

  setGlow(id, glow) {
    const o = this.cards.get(id);
    if (o) o.glow = glow ?? NO_GLOW;
  }

  clearGlows() { for (const o of this.cards.values()) o.glow = NO_GLOW; }

  // ---------- pointer ----------

  pick(x, y, ids) {
    this.ray(x, y);
    const meshes = ids.map((id) => this.cards.get(id)?.root).filter(Boolean);
    const hit = this.raycaster.intersectObjects(meshes, true)[0];
    return hit ? hit.object.userData.card : null;
  }

  pointerOnTable(y = 0) { return this.pointOnPlane(this.pointer.x, this.pointer.y, y); }

  carry(id) { this.carried = this.cards.get(id) ?? null; }

  dropCarry() { const o = this.carried; this.carried = null; return o; }

  // ---------- frame ----------

  bursts = [];

  update(dt, wave) {
    const c = this.carried;
    if (c) {
      const p = this.pointerOnTable(CARRY_Y);
      if (p) {
        const k = damp(20, dt);
        c.root.position.x += (p.x - c.root.position.x) * k;
        c.root.position.z += (p.z - c.root.position.z) * k;
        c.root.position.y += (CARRY_Y - c.root.position.y) * k;
        qTmp.setFromEuler(eTmp.set(0.55, 0, 0, 'YXZ')); // face up, tilted towards the player
        c.root.quaternion.slerp(qTmp, k);
        c.root.scale.setScalar(c.root.scale.x + (1 - c.root.scale.x) * k);
      }
    }
    for (const o of this.cards.values()) applyGlow(o.face, o.glow, wave, 0.4);
    this.deckRing.material.opacity = this.deckOn ? 0.55 + 0.35 * wave : 0;
    this.deckRing.scale.setScalar(this.deckOn ? 1 + 0.08 * wave : 1);

    for (const b of this.bursts) {
      b.t += dt;
      const a = b.pts.geometry.attributes.position;
      const drag = Math.exp(-b.drag * dt);
      for (let i = 0; i < b.vel.length; i++) {
        const v = b.vel[i];
        v[0] *= drag; v[2] *= drag;
        v[1] -= b.gravity * dt;
        a.setXYZ(i, a.getX(i) + v[0] * dt, Math.max(0.01, a.getY(i) + v[1] * dt), a.getZ(i) + v[2] * dt);
      }
      a.needsUpdate = true;
      b.pts.material.opacity = Math.max(0, 1 - b.t / b.life) * (b.twinkle ? 1 : 0.7);
      if (b.twinkle) b.pts.material.size = 0.07 * (1 + 0.3 * Math.sin(b.t * 20));
    }
    this.bursts = this.bursts.filter((b) => { if (b.t < b.life) return true; this.scene.remove(b.pts); return false; });

  }

  handAnchor() {
    if (this.carried) {
      const r = this.carried.root.position;
      return new THREE.Vector3(r.x, r.y + 0.1, r.z);
    }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, HOVER);
  }

  handGlow() {
    if (this.carried) return { color: COLOR.held, intensity: 0.16 };
    return this.hoverOn ? { color: COLOR.hover, intensity: 0.14 } : NO_GLOW;
  }

  seatScreen(p) {
    return p === 1 ? this.toScreen(-3.3, 0.3, -4.1) : this.toScreen(3.3, 0.3, -4.1);
  }
}
