// 성냥개비: the 3D table. Matchsticks (a square-section pine body and a rounded red head) lie on
// the lamp-lit leather table in their slots; empty slots show as faint grooves while a stick is
// carried, and the one it would drop into lights up with a preview of the stick there. Solving
// sets every head alight. Layout coordinates are (x right, y up the table) in stick lengths.
import * as THREE from 'three';
import { Stage, NO_GLOW, applyGlow, damp, easeInOutCubic, clamp } from './stage.js';

export const L = 1;                 // a stick's length
const T = 0.075;                    // its square section
const LIE = T / 2 + 0.002;          // height of a stick's axis lying on the table
const CARRY = 0.55;                 // how high a carried stick floats
const W = (x, y, h = LIE) => new THREE.Vector3(x, h, -y);

// ---------- materials ----------

function woodTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 32;
  const g = c.getContext('2d');
  g.fillStyle = '#e9c48c';
  g.fillRect(0, 0, 256, 32);
  for (let i = 0; i < 26; i++) { // long grain lines
    const y = Math.random() * 32, a = 0.05 + Math.random() * 0.12;
    g.strokeStyle = `rgba(150,96,44,${a})`;
    g.lineWidth = 0.5 + Math.random() * 1.2;
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 256; x += 32) g.lineTo(x, y + Math.sin(x * 0.03 + i) * 0.8);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const WOOD = woodTexture();
const BODY_GEO = new THREE.BoxGeometry(L * 0.93, T, T);
BODY_GEO.translate(-L * 0.035, 0, 0); // leave room for the head at +x
const HEAD_GEO = new THREE.SphereGeometry(1, 20, 14);

// a soft flame for the heads when the puzzle is solved
const FLAME = (() => {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 92, 2, 32, 80, 60);
  grd.addColorStop(0, 'rgba(255,255,230,1)'); grd.addColorStop(0.25, 'rgba(255,200,90,0.95)'); grd.addColorStop(0.6, 'rgba(255,110,30,0.5)'); grd.addColorStop(1, 'rgba(255,60,0,0)');
  g.fillStyle = grd;
  g.beginPath(); g.moveTo(32, 4); g.bezierCurveTo(58, 60, 58, 120, 32, 124); g.bezierCurveTo(6, 120, 6, 60, 32, 4); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})();

class Stick {
  constructor(id) {
    this.id = id;
    this.root = new THREE.Group();
    this.body = new THREE.Mesh(BODY_GEO, new THREE.MeshStandardMaterial({ map: WOOD, roughness: 0.72, metalness: 0 }));
    this.headMat = new THREE.MeshStandardMaterial({ color: 0xb3261e, roughness: 0.55, metalness: 0 });
    this.head = new THREE.Mesh(HEAD_GEO, this.headMat);
    this.head.scale.set(0.065, 0.058, 0.058);
    this.head.position.x = L / 2 - 0.05;
    for (const m of [this.body, this.head]) { m.castShadow = true; m.receiveShadow = true; m.userData.stick = id; }
    this.root.add(this.body, this.head);
    this.glow = NO_GLOW;
    this.moving = false;
    this.flame = null;
  }
}

export class MatchScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.sticks = new Map();
    this.grooves = new Map(); // slot id → groove mesh
    this.carried = null;
    this.carryAngle = 0;
    this.target = null;       // slot id the carried stick would drop into
    this.hoverId = null;
    this.bounds = { x0: -3, x1: 3, y0: -2, y1: 2 };
    this.softenLight();
    this.bloomThreshold = 2.4; // only the flames bloom, not the lamp-lit pale wood
    this.dots = null;
    this.preview = new Stick(-1);
    for (const m of [this.preview.body, this.preview.head]) { m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = 0.4; m.castShadow = false; }
    this.preview.root.visible = false;
    this.scene.add(this.preview.root);
    this.start();
  }

  softenLight() {
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.scene.environmentIntensity = 0.45;
    const fill = new THREE.DirectionalLight(0xffe9cc, 0.55);
    fill.position.set(6, 5, 4);
    const front = new THREE.DirectionalLight(0xfff4e4, 0.3);
    front.position.set(0, 3, 9);
    this.scene.add(fill, front);
  }

  // ---------- layout ----------

  /**
   * Lay out a puzzle. `slots`: [{ id, x, y, ang }] (x, y the stick's centre; ang its direction,
   * head end at +ang). `dots`: optional lattice points to mark. `tray`: the area where spare and
   * removed sticks lie, { x, y, w }.
   */
  setLayout({ slots, dots = [], tray = null }) {
    for (const g of this.grooves.values()) this.scene.remove(g);
    this.grooves.clear();
    this.slots = new Map(slots.map((s) => [s.id, s]));
    const grooveGeo = new THREE.PlaneGeometry(L * 0.92, T * 1.6);
    for (const s of slots) {
      const g = new THREE.Mesh(grooveGeo, new THREE.MeshBasicMaterial({ color: 0xede6d8, transparent: true, opacity: 0, depthWrite: false }));
      g.rotation.set(-Math.PI / 2, 0, s.ang);
      g.position.copy(W(s.x, s.y, 0.003));
      g.visible = false;
      this.scene.add(g);
      this.grooves.set(s.id, g);
    }
    if (this.dots) this.scene.remove(this.dots);
    this.dots = null;
    if (dots.length) {
      const geo = new THREE.BufferGeometry().setFromPoints(dots.map(([x, y]) => W(x, y, 0.004)));
      this.dots = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xcdb27a, size: 0.09, transparent: true, opacity: 0.6 }));
      this.scene.add(this.dots);
    }
    this.tray = tray;
    if (this.trayMesh) this.scene.remove(this.trayMesh);
    this.trayMesh = null;
    if (tray) {
      // a shallow matchbox tray
      const box = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x3a2a1e, roughness: 0.8 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(tray.w, 0.02, 0.62), mat);
      base.position.y = 0.01; base.receiveShadow = true;
      box.add(base);
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x8a2d24, roughness: 0.6 });
      for (const [w, d, x, z] of [[tray.w, 0.04, 0, -0.31], [tray.w, 0.04, 0, 0.31], [0.04, 0.62, -tray.w / 2, 0], [0.04, 0.62, tray.w / 2, 0]]) {
        const e = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, d), edgeMat);
        e.position.set(x, 0.035, z); e.castShadow = true;
        box.add(e);
      }
      box.position.copy(W(tray.x, tray.y, 0));
      this.scene.add(box);
      this.trayMesh = box;
    }
    const xs = slots.map((s) => s.x), ys = slots.map((s) => s.y);
    if (tray) { xs.push(tray.x - tray.w / 2, tray.x + tray.w / 2); ys.push(tray.y - 0.4); }
    this.bounds = { x0: Math.min(...xs) - 0.6, x1: Math.max(...xs) + 0.6, y0: Math.min(...ys) - 0.6, y1: Math.max(...ys) + 0.6 };
    this.resize();
  }

  /** Make (or reuse) the stick objects for these ids, dropping the rest. */
  setSticks(ids) {
    for (const [id, s] of this.sticks) if (!ids.includes(id)) { this.scene.remove(s.root); this.sticks.delete(id); }
    for (const id of ids) if (!this.sticks.has(id)) { const s = new Stick(id); this.sticks.set(id, s); this.scene.add(s.root); }
  }

  /** The pose of a stick lying in a slot, or in the tray at position i. */
  slotPose(slotId) {
    const s = this.slots.get(slotId);
    return { p: W(s.x, s.y), ang: s.ang };
  }
  trayPose(i) {
    const t = this.tray;
    const x = t.x - t.w / 2 + 0.2 + (i % 8) * 0.12, y = t.y + 0.12 - Math.floor(i / 8) * 0.12;
    return { p: W(x + 0.35, y, 0.02 + LIE), ang: 0 };
  }

  /** Put a stick at a pose, gliding there (with a little hop) unless `instant`. */
  place(id, { p, ang }, { instant = false, dur = 0.28, done = null } = {}) {
    const s = this.sticks.get(id);
    if (!s) return;
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ang);
    if (instant) { s.root.position.copy(p); s.root.quaternion.copy(q1); done?.(); return; }
    const p0 = s.root.position.clone(), q0 = s.root.quaternion.clone();
    const hop = Math.min(0.35, p0.distanceTo(p) * 0.3);
    s.moving = true;
    this.tween({
      dur,
      update: (k) => {
        const e = easeInOutCubic(k);
        s.root.position.lerpVectors(p0, p, e);
        s.root.position.y += Math.sin(Math.PI * k) * hop;
        s.root.quaternion.slerpQuaternions(q0, q1, e);
      },
      done: () => { s.moving = false; done?.(); },
    });
  }

  // ---------- carrying ----------

  carry(id) {
    this.carried = this.sticks.get(id) ?? null;
    if (this.carried) this.carryAngle = new THREE.Euler().setFromQuaternion(this.carried.root.quaternion, 'YXZ').y;
    this.showGrooves(true);
  }
  dropCarry() {
    const c = this.carried;
    this.carried = null;
    this.setTarget(null);
    this.showGrooves(false);
    return c;
  }

  /** Empty slots show as faint grooves while a stick is being carried. */
  showGrooves(on, occupied = this.occupied ?? new Set()) {
    for (const [id, g] of this.grooves) {
      g.visible = on && !occupied.has(id);
      g.material.opacity = 0;
      g.material.color.set(0xede6d8);
    }
  }

  /** The slot the carried stick would drop into: its groove lights up and a ghost stick lies there. */
  setTarget(slotId) {
    if (this.target !== null) { const g = this.grooves.get(this.target); if (g) { g.material.opacity = 0.1; g.material.color.set(0xede6d8); } }
    this.target = slotId;
    this.preview.root.visible = slotId !== null;
    if (slotId === null) return;
    const g = this.grooves.get(slotId);
    if (g) { g.material.opacity = 0.35; g.material.color.set(0xe0b45a); }
    const { p, ang } = this.slotPose(slotId);
    this.preview.root.position.copy(p);
    this.preview.root.rotation.set(0, ang, 0);
  }

  /** Hint/hover glows on sticks. */
  setGlow(id, glow) { const s = this.sticks.get(id); if (s) s.glow = glow ?? NO_GLOW; }
  clearGlows() { for (const s of this.sticks.values()) s.glow = NO_GLOW; }

  /** Mark whole glyph areas for a hint: rectangles on the table. */
  markAreas(rects) {
    if (this.marks) { this.scene.remove(this.marks); this.marks = null; }
    if (!rects?.length) return;
    const g = new THREE.Group();
    for (const r of rects) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.h), new THREE.MeshBasicMaterial({ color: 0x2fae7f, transparent: true, opacity: 0.16, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.copy(W(r.x, r.y, 0.002));
      g.add(m);
    }
    this.scene.add(g);
    this.marks = g;
  }

  // ---------- solving ----------

  /** Set heads alight, one after another. */
  ignite(ids) {
    ids.forEach((id, i) => {
      const s = this.sticks.get(id);
      if (!s || s.flame) return;
      setTimeout(() => {
        const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: FLAME, color: new THREE.Color(4, 2.8, 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
        f.scale.set(0.001, 0.001, 1);
        s.head.add(f);
        f.position.set(0.3, 3.4, 0);
        s.flame = { f, t: 0, seed: Math.random() * 10 };
        s.headMat.emissive.set(0xff5a1f);
        s.headMat.emissiveIntensity = 3;
      }, i * 70);
    });
    this.flare(0.7, 2.4);
  }
  extinguish() {
    for (const s of this.sticks.values()) {
      if (s.flame) { s.head.remove(s.flame.f); s.flame = null; }
      s.headMat.emissiveIntensity = 0;
      s.headMat.color.set(0xb3261e);
    }
  }

  /** A shake of the sticks that were moved, for a wrong answer. */
  shakeSticks(ids) {
    for (const id of ids) {
      const s = this.sticks.get(id);
      if (!s || s.moving) continue;
      const x0 = s.root.position.x;
      this.tween({ dur: 0.45, update: (k) => { s.root.position.x = x0 + Math.sin(k * Math.PI * 6) * 0.05 * (1 - k); }, done: () => { s.root.position.x = x0; } });
    }
  }

  // ---------- pointer helpers ----------

  /** Table point (layout coordinates) under a screen position, at height h. */
  layoutAt(x, y, h = 0) {
    const p = this.pointOnPlane(x, y, h);
    return p ? { x: p.x, y: -p.z } : null;
  }

  /**
   * The stick nearest a screen point, measured to each stick's on-screen segment. Pinches tend to
   * land above what they aim at, so a point above a stick reaches further than one below.
   */
  stickNear(x, y, ids, reach = 70) {
    let best = null, bd = 1;
    for (const id of ids) {
      const s = this.sticks.get(id);
      if (!s) continue;
      const ang = new THREE.Euler().setFromQuaternion(s.root.quaternion, 'YXZ').y;
      const c = s.root.position, dx = Math.cos(ang) * L * 0.46, dz = -Math.sin(ang) * L * 0.46;
      const a = this.toScreen(c.x - dx, c.y, c.z - dz), b = this.toScreen(c.x + dx, c.y, c.z + dz);
      const vx = b.x - a.x, vy = b.y - a.y, len2 = vx * vx + vy * vy || 1;
      const t = clamp(((x - a.x) * vx + (y - a.y) * vy) / len2, 0, 1);
      const px = a.x + vx * t, py = a.y + vy * t;
      const ex = x - px, ey = y - py;
      const d = Math.hypot(ex / reach, ey / (ey < 0 ? reach * 1.8 : reach));
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  }

  /**
   * The free slot a stick carried under this screen point would land in: anything along the line
   * of sight from carry height down to the table counts (players read both), nearest first.
   */
  slotNear(x, y, free, reach = 0.55) {
    const lo = this.layoutAt(x, y, 0), hi = this.layoutAt(x, y, CARRY);
    if (!lo || !hi) return null;
    let best = null, bd = reach;
    for (const id of free) {
      const s = this.slots.get(id);
      // distance from the slot centre to the sight segment hi→lo on the table plane
      const vx = lo.x - hi.x, vy = lo.y - hi.y, len2 = vx * vx + vy * vy || 1;
      const t = clamp(((s.x - hi.x) * vx + (s.y - hi.y) * vy) / len2, 0, 1);
      const d = Math.hypot(s.x - (hi.x + vx * t), s.y - (hi.y + vy * t));
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  }

  // ---------- camera ----------

  frameCamera(aspect) {
    const b = this.bounds ?? { x0: -3, x1: 3, y0: -2, y1: 2 };
    const el = THREE.MathUtils.degToRad(58);
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    const hw = (b.x1 - b.x0) / 2 + 0.3, hd = (b.y1 - b.y0) / 2 + 0.3;
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    // leave the top of the screen for the HUD and the prompt
    const dist = Math.max(hw / (tanV * aspect * 0.86), (hd * Math.sin(el) + 0.4) / (tanV * 0.72), 5);
    this.camera.position.set(cx, Math.sin(el) * dist, -cy + Math.cos(el) * dist - 0.4);
    this.camera.lookAt(cx, 0, -cy - 0.55);
    this.setLampScale(Math.max(hw, hd));
  }

  // ---------- frame ----------

  update(dt, wave) {
    const c = this.carried;
    if (c) {
      const pt = this.pointerOnTable ? this.pointerOnTable() : null;
      if (pt) {
        const k = damp(22, dt);
        c.root.position.x += (pt.x - c.root.position.x) * k;
        c.root.position.z += (pt.z - c.root.position.z) * k;
        c.root.position.y += (CARRY - c.root.position.y) * k;
      }
      // turn towards the target slot's direction as it comes near
      const want = this.target !== null ? this.slots.get(this.target).ang : this.carryAngle;
      const cur = new THREE.Euler().setFromQuaternion(c.root.quaternion, 'YXZ').y;
      let d = want - cur;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      c.root.rotation.set(0, cur + d * damp(14, dt), 0.12 * Math.sin(this.clock.elapsedTime * 2));
    }
    for (const s of this.sticks.values()) {
      applyGlow(s.body.material, s.glow, wave, 0.5);
      if (s.flame) {
        s.flame.t += dt;
        const grow = Math.min(1, s.flame.t * 3), fl = 1 + 0.12 * Math.sin(this.clock.elapsedTime * 23 + s.flame.seed) + 0.08 * Math.sin(this.clock.elapsedTime * 37 + s.flame.seed);
        s.flame.f.scale.set(2.6 * grow * fl, 6.2 * grow * fl, 1); // in head units (the head is ~0.06 across)
        s.headMat.color.lerp(new THREE.Color(0x2a1a14), dt * 0.25); // the head chars as it burns
      }
    }
    if (this.preview.root.visible) this.preview.body.material.opacity = 0.3 + 0.12 * wave;
    // empty grooves show only around the carried stick, so a full board doesn't turn to clutter
    if (c) {
      const cx = c.root.position.x, cz = c.root.position.z;
      for (const [id, g] of this.grooves) {
        if (!g.visible || id === this.target) continue;
        const d = Math.hypot(g.position.x - cx, g.position.z - cz);
        g.material.opacity = 0.16 * clamp(1 - (d - 0.6) / 1.8, 0, 1);
      }
    }
  }

  pointerOnTable() { return this.pointOnPlane(this.pointer.x, this.pointer.y, CARRY); }

  handAnchor() {
    if (this.carried) {
      const r = this.carried.root.position;
      return new THREE.Vector3(r.x, r.y + 0.08, r.z);
    }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, 0.9);
  }
  handGlow() { return this.carried ? { color: 0x3f7fe6, intensity: 0.16 } : this.hoverId !== null ? { color: 0xe0a83a, intensity: 0.14 } : NO_GLOW; }
}
