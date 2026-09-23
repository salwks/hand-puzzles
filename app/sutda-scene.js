// 섯다 scene: an oval felt table with an ebony rim, hwatu cards drawn procedurally (no
// commercial artwork), chips, the dealer's deck with its tell-tale bottom card, and the sleeve.
// Cards are squeezed (쪼기) by lifting their near edge about the far edge, like a real peek.
import * as THREE from 'three';
import { woodMaps, lacqueredWood, contactShadow } from './materials.js';
import { Stage, COLOR, NO_GLOW, applyGlow, damp, easeOutCubic, easeInOutCubic } from './stage.js';

export const CW = 0.92, CH = 1.38, CT = 0.018;
const CARRY_Y = 0.55;
const HOVER = 1.1;
// Seats: 0 = the player (near the camera), then left, far, right.
export const SEATS = [{ x: 0, z: 3.0 }, { x: -5.0, z: 0.1 }, { x: 0, z: -2.8 }, { x: 5.0, z: 0.1 }];
export const POT = { x: 0, z: 0.25 };
export const SLEEVE = { x: 3.6, z: 3.15 };
export const CHIPS = { x: -2.3, z: 2.75 };

// ---------- card art ----------

const FACE_W = 256, FACE_H = 384;
const faceCache = new Map();
function faceTexture(card) {
  if (faceCache.has(card.id)) return faceCache.get(card.id);
  const c = document.createElement('canvas');
  c.width = FACE_W; c.height = FACE_H;
  const g = c.getContext('2d');
  g.fillStyle = '#efe6d2';
  g.fillRect(0, 0, FACE_W, FACE_H);
  g.strokeStyle = '#b9a98a'; g.lineWidth = 6; g.strokeRect(10, 10, FACE_W - 20, FACE_H - 20);
  // month motif: a band of the month's colour across the lower half
  const hue = (card.month * 36) % 360;
  g.fillStyle = `hsl(${hue} 32% 30%)`;
  g.globalAlpha = 0.18; g.fillRect(22, 190, FACE_W - 44, 150); g.globalAlpha = 1;
  g.fillStyle = '#2a1d12';
  g.font = '600 150px "Cormorant Garamond", "Noto Serif KR", serif';
  g.textBaseline = 'top';
  g.fillText(String(card.month), 26, 14);
  if (card.kind === 'gwang') {
    g.fillStyle = '#b8322c'; g.beginPath(); g.arc(196, 70, 44, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#efe6d2'; g.font = '52px "Noto Serif KR", serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('光', 196, 72); g.textAlign = 'left';
  } else if (card.kind === 'yeol') {
    g.save(); g.translate(200, 64); g.rotate(Math.PI / 4); g.fillStyle = '#2f6b4f'; g.fillRect(-20, -20, 40, 40); g.restore();
  } else {
    g.fillStyle = '#8e2a20'; g.fillRect(172, 30, 30, 90);
  }
  g.fillStyle = '#c9b996'; g.fillRect(26, 300, FACE_W - 52, 2);
  g.textBaseline = 'alphabetic';
  g.font = '34px "Noto Serif KR", serif'; g.fillStyle = '#6b5a45'; g.fillText(`${card.month}월`, 28, 350);
  const label = card.kind === 'gwang' ? '광' : card.kind === 'yeol' ? '열끗' : '';
  g.fillStyle = '#8e2a20'; g.textAlign = 'right'; g.fillText(label, FACE_W - 28, 350);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  faceCache.set(card.id, t);
  return t;
}
let backTex = null;
function backTexture() {
  if (backTex) return backTex;
  const c = document.createElement('canvas');
  c.width = FACE_W; c.height = FACE_H;
  const g = c.getContext('2d');
  g.fillStyle = '#7a1e1b'; g.fillRect(0, 0, FACE_W, FACE_H);
  g.strokeStyle = '#b89b5e'; g.lineWidth = 3; g.globalAlpha = 0.6;
  g.strokeRect(20, 20, FACE_W - 40, FACE_H - 40);
  g.save(); g.translate(FACE_W / 2, FACE_H / 2); g.rotate(Math.PI / 4); g.strokeRect(-36, -36, 72, 72); g.restore();
  backTex = new THREE.CanvasTexture(c);
  backTex.colorSpace = THREE.SRGBColorSpace;
  return backTex;
}
const cardGeo = new THREE.BoxGeometry(CW, CT, CH);
const sideMat = new THREE.MeshStandardMaterial({ color: 0xd9ceb6, roughness: 0.7 });

class CardObj {
  constructor(card, faceUp = false) {
    this.card = card;
    this.face = new THREE.MeshStandardMaterial({ map: faceTexture(card), roughness: 0.55 });
    this.back = new THREE.MeshStandardMaterial({ map: backTexture(), roughness: 0.5 });
    // Box faces: +x, -x, +y (face), -y (back), +z, -z
    this.mesh = new THREE.Mesh(cardGeo, [sideMat, sideMat, this.face, this.back, sideMat, sideMat]);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.z = CH / 2;
    this.mesh.rotation.z = faceUp ? 0 : Math.PI;
    this.pivot = new THREE.Group(); // at the far edge: peeking lifts the near edge about it
    this.pivot.position.z = -CH / 2;
    this.pivot.add(this.mesh);
    this.root = new THREE.Group();
    this.root.add(this.pivot);
    this.contact = contactShadow(0.5);
    this.contact.scale.set(1, 1.3, 1);
    this.root.add(this.contact);
    this.faceUp = faceUp;
    this.peek = 0;
    this.glow = NO_GLOW;
    this.mesh.userData.pick = null;
  }
}

export class SutdaScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.cards = new Map(); // card id -> CardObj
    this.carried = null; // CardObj following the pointer
    this.picks = []; // meshes that can be picked
    this.buildTable();
    this.setLampScale(6.5);
    this.start();
  }

  buildTable() {
    const felt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.1, 96), new THREE.MeshStandardMaterial({
      color: 0x1d3a2d, roughness: 0.95,
    }));
    felt.scale.set(6.2, 1, 4.1);
    felt.position.y = -0.05;
    felt.receiveShadow = true;
    const ebony = woodMaps('#1a1410', '#030201', 29, { pores: 60, highlights: false });
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 96),
      lacqueredWood(ebony, { repeat: 3, roughness: 0.5, clearcoat: 0.35 }));
    rim.scale.set(6.7, 1, 4.6);
    rim.position.y = -0.165; // top just under the felt, so the felt and cards stay visible
    rim.receiveShadow = rim.castShadow = true;
    const curve = new THREE.EllipseCurve(0, 0, 6.28, 4.18, 0, Math.PI * 2);
    const pts = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, 0.004, p.y));
    const brass = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 320, 0.018, 6, true),
      new THREE.MeshStandardMaterial({ color: 0xc9a65c, metalness: 1, roughness: 0.25 }));
    // pot ring
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.09, 64), new THREE.MeshBasicMaterial({
      color: 0xb89b5e, transparent: true, opacity: 0.45, depthWrite: false,
    }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(POT.x, 0.003, POT.z);
    ring.scale.set(1.35, 1, 1);
    this.potRing = ring;
    // sleeve: a dark cloth patch at the player's right, just off the felt
    const sleeve = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.5), new THREE.MeshStandardMaterial({ color: 0x0c0b0a, roughness: 1 }));
    sleeve.rotation.x = -Math.PI / 2;
    sleeve.position.set(SLEEVE.x, 0.006, SLEEVE.z);
    sleeve.receiveShadow = true;
    this.sleevePatch = sleeve;
    this.scene.add(felt, rim, brass, ring, sleeve);

    // chips
    this.chipMat = new THREE.MeshStandardMaterial({ color: 0xb89b5e, metalness: 0.3, roughness: 0.4 });
    this.chipGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    this.potChips = new THREE.Group();
    this.myChips = new THREE.Group();
    this.scene.add(this.potChips, this.myChips);
    this.myChipToken = new THREE.Mesh(this.chipGeo, this.chipMat.clone());
    this.myChipToken.castShadow = true;
    this.myChipToken.userData.pick = { kind: 'chips' };
    this.scene.add(this.myChipToken);
    this.resetChipToken();
  }

  resetChipToken() {
    this.myChipToken.position.set(CHIPS.x + 0.5, 0.12, CHIPS.z - 0.2);
  }

  stack(group, count, x, z) {
    group.clear();
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(this.chipGeo, this.chipMat);
      const col = Math.floor(i / 12), row = i % 12;
      m.position.set(x + (col % 3) * 0.44 - 0.44, 0.025 + row * 0.052, z + Math.floor(col / 3) * 0.44);
      m.castShadow = m.receiveShadow = true;
      group.add(m);
    }
  }

  setMoney(pot, mine) {
    this.stack(this.potChips, Math.min(36, Math.ceil(pot / 20)), POT.x, POT.z - 0.1);
    this.stack(this.myChips, Math.min(24, Math.ceil(mine / 100)), CHIPS.x, CHIPS.z);
  }

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(57);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    // Frame the playing area (seats and cards), not the whole rim: the rim may run off-screen.
    const forWidth = (6.2 / (tanV * aspect)) * 1.02;
    const forDepth = (4.2 * Math.sin(el) + 1.0) / (tanV * 0.72);
    const dist = Math.max(forWidth, forDepth, 8.5);
    this.camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist);
    this.camera.lookAt(0, 0, 0.9);
  }

  // ---------- cards ----------

  clearCards() {
    for (const o of this.cards.values()) this.scene.remove(o.root);
    this.cards.clear();
    this.carried = null;
    this.picks = [];
    this.tweens = [];
  }

  /** Create (or fetch) the object for a card, placed at a world pose. */
  place(card, { x, z, yaw = 0, faceUp = false, y = 0 } = {}) {
    let o = this.cards.get(card.id);
    if (!o) {
      o = new CardObj(card, faceUp);
      this.cards.set(card.id, o);
      this.scene.add(o.root);
    }
    o.root.position.set(x, y + CT / 2, z);
    o.root.rotation.y = yaw;
    this.setFaceUp(o, faceUp, true);
    return o;
  }

  remove(card) {
    const o = this.cards.get(card.id);
    if (!o) return;
    this.scene.remove(o.root);
    this.cards.delete(card.id);
  }

  obj(card) { return this.cards.get(card.id); }

  setPick(card, pick) {
    const o = this.cards.get(card.id);
    if (o) o.mesh.userData.pick = pick;
  }

  setFaceUp(o, up, instant = false) {
    o.faceUp = up;
    const to = up ? 0 : Math.PI;
    if (instant) { o.mesh.rotation.z = to; return; }
    const from = o.mesh.rotation.z;
    o.busy = true;
    this.tween({
      dur: 0.45,
      update: (k) => {
        const e = easeInOutCubic(k);
        o.mesh.rotation.z = from + (to - from) * e;
        o.mesh.position.y = Math.sin(Math.PI * k) * 0.35;
      },
      done: () => { o.mesh.position.y = 0; o.busy = false; },
    });
  }

  setPeek(card, p) {
    const o = this.cards.get(card.id);
    if (!o) return;
    o.peek = p;
    o.pivot.rotation.x = -p * 1.3;
  }

  /** Slide / fly a card to a pose. */
  moveTo(card, { x, z, yaw = 0, faceUp = null, dur = 0.4, arc = 0.4, delay = 0 }) {
    const o = this.cards.get(card.id);
    if (!o) return;
    const from = o.root.position.clone(), fromYaw = o.root.rotation.y;
    if (faceUp !== null && faceUp !== o.faceUp) setTimeout(() => this.setFaceUp(o, faceUp), delay * 1000 + dur * 400);
    this.tween({
      dur, delay,
      update: (k) => {
        const e = easeOutCubic(k);
        o.root.position.set(from.x + (x - from.x) * e, CT / 2 + (from.y - CT / 2) * (1 - e) + Math.sin(Math.PI * k) * arc, from.z + (z - from.z) * e);
        o.root.rotation.y = fromYaw + (yaw - fromYaw) * e;
      },
    });
  }

  // ---------- carrying ----------

  carry(card) {
    this.carried = this.cards.get(card.id) ?? null;
    if (this.carried) this.setPeek(card, 0);
  }

  dropCarry() {
    const o = this.carried;
    this.carried = null;
    return o;
  }

  /** Table point under the pointer (on the felt plane). */
  pointerOnTable(y = 0) {
    return this.pointOnPlane(this.pointer.x, this.pointer.y, y);
  }

  /** What is under the screen position: { kind, ... } from the mesh's pick record, or null. */
  pick(x, y) {
    this.ray(x, y);
    const meshes = [];
    for (const o of this.cards.values()) if (o.mesh.userData.pick && o !== this.carried) meshes.push(o.mesh);
    meshes.push(this.myChipToken);
    const hit = this.raycaster.intersectObjects(meshes, false)[0];
    return hit ? hit.object.userData.pick : null;
  }

  dist(p, spot) { return p ? Math.hypot(p.x - spot.x, p.z - spot.z) : Infinity; }

  // ---------- look ----------

  setGlow(card, glow) {
    const o = this.cards.get(card.id);
    if (o) o.glow = glow;
  }

  /** Standoff lighting: the lamp narrows to a pool around the contested card. */
  setStandoff(on) {
    this.standoff = on;
  }

  update(dt, wave) {
    if (this.carried) {
      const p = this.pointerOnTable(CARRY_Y);
      if (p) {
        const r = this.carried.root.position, k = damp(22, dt);
        r.x += (p.x - r.x) * k;
        r.z += (p.z - r.z) * k;
        r.y += (CARRY_Y - r.y) * k;
      }
    }
    for (const o of this.cards.values()) {
      const lift = Math.max(0, o.root.position.y - CT / 2) + o.peek * 0.3;
      o.contact.material.opacity = 1 / (1 + lift * 4);
      applyGlow(o.face, o.glow, wave, 0.35);
      applyGlow(o.back, o.glow, wave, 0.6);
    }
    const target = this.standoff ? 0.25 : 1;
    this.keyLight.intensity += (this.baseKey * target - this.keyLight.intensity) * damp(3, dt);
    this.scene.environmentIntensity += ((this.standoff ? 0.08 : 0.28) - this.scene.environmentIntensity) * damp(3, dt);
  }

  setLampScale(r) {
    super.setLampScale(r);
    this.baseKey = this.keyLight.intensity;
    this.spot ??= (() => {
      const s = new THREE.SpotLight(0xffe7c4, 0, 0, 0.22, 0.6, 2);
      s.position.set(0, 9, 3);
      this.scene.add(s, s.target);
      return s;
    })();
  }

  /** Aim the standoff spotlight at a world point. */
  spotOn(x, z, on) {
    this.spot.target.position.set(x, 0, z);
    this.spot.intensity = on ? 160 : 0;
  }

  handAnchor() {
    if (this.carried) {
      const r = this.carried.root.position;
      return new THREE.Vector3(r.x, r.y + 0.08, r.z);
    }
    if (this.peeking) {
      const o = this.cards.get(this.peeking.id);
      if (o) {
        const near = new THREE.Vector3(0, 0, CH).applyEuler(o.pivot.rotation).add(o.pivot.position);
        return o.root.localToWorld(near);
      }
    }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, HOVER);
  }

  handGlow() {
    if (this.carried || this.peeking) return { color: COLOR.held, intensity: 0.16 };
    return this.hoverOn ? { color: COLOR.hover, intensity: 0.14 } : NO_GLOW;
  }

  seatScreen(i, y = 0.4) {
    return this.toScreen(SEATS[i].x, y, SEATS[i].z);
  }
}
