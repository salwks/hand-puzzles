// 도미노 미로: the 3D board. A pale plastic board with a socket for each of the 6×6 squares;
// glossy plastic dominoes with an arrow on top (the start one red), numbered target towers,
// pivots with a turning arm, grey blockers. Pushing plays the chain with the times the rules
// engine worked out: each piece tips over its front edge and rests against the next. The
// dominoes the player places wait in a tray at the front.
// Square (r, c) sits at world (c − 2.5, ·, r − 2.5): row 0 is the far side, north is −z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Stage, NO_GLOW, applyGlow, damp, easeOutCubic, easeInOutCubic, easeInQuad } from './stage.js';
import { N, DR, DC, FALL, TURNS } from './domino-logic.js';
import { studioLight, lightDesk } from './studio.js';

const TOP = 0.12;          // board surface
const LIFT = 0.6;          // how high a carried piece rides
const TRAY_Z = N / 2 + 1.1;
const TICK = 0.085;        // seconds per engine tick when the chain plays
const H = 0.82, W = 0.6, T = 0.16; // a domino: height, width, thickness
const X = (c) => c - (N - 1) / 2;
const Z = (r) => r - (N - 1) / 2;
const yawOf = (o) => -o * Math.PI / 4; // 0 = north, clockwise in 45° steps
const HINT = 0x2fae7f;

export const NAMES = { start: '시작 도미노', domino: '도미노', target: '목표물', pivot: '회전판', block: '막이' };
const ROMAN = ['', 'I', 'II', 'III'];

const plastic = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.08, ...o });

function rounded(w, h, d, mat, radius = 0.03) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, radius), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function canvasTex(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
const ARROW = canvasTex(128, (g, s) => {
  g.fillStyle = '#ffffff';
  g.beginPath(); g.moveTo(s / 2, 10); g.lineTo(s - 22, 58); g.lineTo(s / 2 + 14, 58); g.lineTo(s / 2 + 14, s - 10); g.lineTo(s / 2 - 14, s - 10); g.lineTo(s / 2 - 14, 58); g.lineTo(22, 58); g.closePath(); g.fill();
});
const numeral = (k) => canvasTex(128, (g, s) => {
  g.fillStyle = '#f7f3ea'; g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 4, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#2a2a2e'; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#2a2a2e'; g.font = 'bold 60px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ROMAN[k], s / 2, s / 2 + 4);
});
const TURN_RING = canvasTex(128, (g, s) => {
  g.strokeStyle = '#f2d08a'; g.lineWidth = 8; g.lineCap = 'round';
  g.beginPath(); g.arc(s / 2, s / 2, s * 0.4, -0.3, Math.PI * 1.35); g.stroke();
  const a = Math.PI * 1.35, x = s / 2 + Math.cos(a) * s * 0.4, y = s / 2 + Math.sin(a) * s * 0.4;
  g.fillStyle = '#f2d08a'; g.beginPath(); g.moveTo(x - 12, y - 4); g.lineTo(x + 8, y - 12); g.lineTo(x + 6, y + 10); g.fill();
});
const BLOT = canvasTex(128, (g, s) => {
  const grd = g.createRadialGradient(s / 2, s / 2, 6, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(0,0,0,0.8)'); grd.addColorStop(0.6, 'rgba(0,0,0,0.35)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, s, s);
});
const COLORS = { start: 0xd8231c, mine: 0x1f9e9a, fixed: 0x3a3d44, pivot: 0xf2c21b, block: 0x8c9096, target: [0, 0x2f63d8, 0x8a4fd8, 0xe8702a] };

/**
 * A piece: root (square) → yaw (its direction) → hinge (on the front edge at the floor) → body.
 * Tipping the hinge forward lays the piece over in the way it faces.
 */
class Piece3D {
  constructor(t, i) {
    this.i = i;
    this.type = t.type;
    this.root = new THREE.Group();
    this.yaw = new THREE.Group();
    this.hinge = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.yaw);
    this.yaw.add(this.hinge);
    this.hinge.add(this.body);
    this.glow = NO_GLOW;
    this.mats = [];
    this.tip = 0;      // current tip angle
    this.heading = yawOf(t.o);
    this.yaw.rotation.y = this.heading;
    const mat = (m) => { this.mats.push(m); return m; };
    const add = (m, to = this.body) => { to.add(m); return m; };
    let depth = T;
    switch (t.type) {
      case 'start':
      case 'domino': {
        const col = t.type === 'start' ? COLORS.start : t.fixed ? COLORS.fixed : COLORS.mine;
        const slab = add(rounded(W, H, T, mat(plastic(col)), 0.035));
        slab.position.y = H / 2;
        // an arrow on the board, pointing the way it falls (it stays put when the domino tips)
        const arrow = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: ARROW, transparent: true, depthWrite: false, color: t.type === 'start' ? 0xc81e16 : t.fixed ? 0x1d2433 : 0x137a76, opacity: 0.85 }));
        arrow.rotation.x = -Math.PI / 2; arrow.position.set(0, 0.006, -0.32);
        this.yaw.add(arrow);
        this.arrow = arrow;
        // pips on the faces, like a real domino
        const pip = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.4 });
        for (const [px, py] of [[-0.14, 0.22], [0.14, 0.22], [0, 0.41], [-0.14, 0.6], [0.14, 0.6]]) {
          for (const sz of [-1, 1]) {
            const p = add(new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), pip));
            p.position.set(px, py, sz * (T / 2 + 0.002));
            if (sz < 0) p.rotation.y = Math.PI;
          }
        }
        const line = add(new THREE.Mesh(new THREE.PlaneGeometry(W * 0.8, 0.02), pip));
        line.position.set(0, H / 2 + 0.1, T / 2 + 0.002);
        break;
      }
      case 'target': {
        depth = 0.42;
        const col = COLORS.target[t.k] ?? 0x888888;
        const tower = add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, H * 0.95, 28), mat(plastic(col))));
        tower.position.y = H * 0.475; tower.castShadow = true;
        const cap = add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.08, 28), mat(plastic(col))));
        cap.position.y = H * 0.95 + 0.04; cap.castShadow = true;
        this.badge = new THREE.MeshStandardMaterial({ map: numeral(t.k), roughness: 0.5, emissive: 0xffffff, emissiveIntensity: 0 });
        const disc = new THREE.Mesh(new THREE.CircleGeometry(0.19, 32), this.badge);
        disc.rotation.x = -Math.PI / 2; disc.position.y = H * 0.95 + 0.082;
        add(disc);
        break;
      }
      case 'pivot': {
        const post = add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.5, 20), mat(plastic(0x3a3d44))));
        post.position.y = 0.25; post.castShadow = true;
        // the arm: an L that swings a quarter when struck
        this.arm = new THREE.Group();
        this.arm.position.y = 0.42;
        add(this.arm);
        const armMat = mat(plastic(COLORS.pivot));
        const a1 = rounded(0.12, 0.14, 0.46, armMat, 0.03); a1.position.z = -0.23; this.arm.add(a1);
        const a2 = rounded(0.46, 0.14, 0.12, armMat, 0.03); a2.position.x = t.o ? -0.23 : 0.23; this.arm.add(a2);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.16, 20), armMat); hub.castShadow = true; this.arm.add(hub);
        const ring = add(new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: TURN_RING, transparent: true, depthWrite: false, color: 0x2a2a2e })));
        ring.rotation.x = -Math.PI / 2; ring.position.y = 0.012;
        if (t.o) ring.scale.x = -1; // anticlockwise: the arrow runs the other way
        this.ringDir = ring;
        break;
      }
      case 'block': {
        const b = add(rounded(0.8, 0.5, 0.8, mat(plastic(COLORS.block, { roughness: 0.5 })), 0.06));
        b.position.y = 0.25;
        break;
      }
    }
    // the hinge sits on the front edge, so tipping it lays the piece forward
    this.hinge.position.z = -depth / 2;
    this.body.position.z = depth / 2;
    if (t.fixed && t.turnable && TURNS[t.type] > 1) {
      const ring = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: TURN_RING, transparent: true, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.008;
      this.root.add(ring);
    }
    this.root.traverse((m) => { if (m.isMesh) m.userData.piece = i; });
    this.blot = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshBasicMaterial({ map: BLOT, transparent: true, depthWrite: false, opacity: 0.45 }));
    this.blot.rotation.x = -Math.PI / 2;
    this.blot.renderOrder = 1;
  }
}

export class DominoScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.pieces = [];
    this.held = null;
    this.hoverI = null;
    this.playing = null;
    this.buildBoard();
    studioLight(this, { lampScale: 4.6, envIntensity: 0.8 });
    lightDesk(this);
    this.start();
  }

  buildBoard() {
    const g = new THREE.Group();
    const S = N + 0.5;
    const board = rounded(S, TOP, S, plastic(0xe9eef2, { roughness: 0.4, clearcoat: 0.3 }), 0.06);
    board.position.y = TOP / 2;
    g.add(board);
    const rim = plastic(0x2f63d8, { roughness: 0.35 });
    for (const [w, d, x, z] of [[S + 0.2, 0.18, 0, -S / 2 - 0.05], [S + 0.2, 0.18, 0, S / 2 + 0.05], [0.18, S, -S / 2 - 0.05, 0], [0.18, S, S / 2 + 0.05, 0]]) {
      const m = rounded(w, 0.2, d, rim, 0.05); m.position.set(x, 0.1, z); g.add(m);
    }
    // a shallow socket for each square
    const sock = new THREE.MeshStandardMaterial({ color: 0xd3dbe2, roughness: 0.6 });
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const s = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), sock);
      s.rotation.x = -Math.PI / 2;
      s.position.set(X(c), TOP + 0.002, Z(r));
      s.receiveShadow = true;
      g.add(s);
    }
    const tray = rounded(N + 0.4, 0.12, 1.1, plastic(0xe6e3dc, { roughness: 0.45 }), 0.05);
    tray.position.set(0, 0.06, TRAY_Z);
    g.add(tray);
    this.scene.add(g);

    this.ghost = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: 0x7fd3ff, transparent: true, opacity: 0.45, depthWrite: false }));
    this.ghost.rotation.x = -Math.PI / 2;
    this.ghost.visible = false;
    this.scene.add(this.ghost);
    // where a failed chain stopped
    this.stopMark = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.44, 40), new THREE.MeshBasicMaterial({ color: 0xff4a3a, transparent: true, opacity: 0, depthWrite: false }));
    this.stopMark.rotation.x = -Math.PI / 2;
    this.scene.add(this.stopMark);
    this.hintGhost = null;
  }

  // ---------- a game ----------

  setGame(g) {
    for (const p of this.pieces) this.scene.remove(p.root, p.blot);
    this.pieces = g.tokens.map((t, i) => {
      const o = new Piece3D(t, i);
      this.scene.add(o.root, o.blot);
      return o;
    });
    this.held = null;
    this.playing = null;
    this.clearHint();
    this.sync(g, true);
  }

  restOf(g, i) {
    const t = g.tokens[i];
    if (t.r !== null) return new THREE.Vector3(X(t.c), TOP, Z(t.r));
    const mine = g.tokens.map((_, j) => j).filter((j) => !g.tokens[j].fixed);
    const k = mine.indexOf(i), n = mine.length;
    const gap = Math.min(0.8, (N + 0.2) / Math.max(1, n));
    return new THREE.Vector3((k - (n - 1) / 2) * gap, 0.12, TRAY_Z);
  }

  sync(g, instant = false, dur = 0.24) {
    g.tokens.forEach((t, i) => {
      const o = this.pieces[i];
      if (!o || o === this.held?.o) return;
      const to = this.restOf(g, i);
      o.heading = this.nearestYaw(o, t.o);
      if (instant) { o.root.position.copy(to); o.yaw.rotation.y = o.heading; return; }
      const from = o.root.position.clone();
      if (from.distanceTo(to) < 1e-3) return;
      const hop = from.distanceTo(to) > 0.2 ? 0.35 : 0;
      this.tween({ dur, update: (k) => {
        o.root.position.lerpVectors(from, to, dur > 0.3 ? easeInOutCubic(k) : easeOutCubic(k));
        o.root.position.y += Math.sin(Math.PI * k) * hop;
      } });
    });
  }

  nearestYaw(o, turns) {
    if (o.type === 'pivot' || o.type === 'target' || o.type === 'block') return 0;
    let target = yawOf(turns);
    const cur = o.yaw.rotation.y;
    while (target - cur > Math.PI) target -= Math.PI * 2;
    while (target - cur < -Math.PI) target += Math.PI * 2;
    return target;
  }

  /** Show piece i's direction (pivots switch hand; with a lean while the wrist twists). */
  showTurn(i, t, lean = 0) {
    const o = this.pieces[i];
    if (o.type === 'pivot') {
      o.arm.children[1].position.x = t.o ? -0.23 : 0.23;
      o.ringDir.scale.x = t.o ? -1 : 1;
      return;
    }
    o.heading = this.nearestYaw(o, t.o);
    o.lean = lean;
  }

  // ---------- the push ----------

  /**
   * Play a push: `rr` from domino-logic run(). Pieces tip at their times and rest against the
   * next square's piece (or lie flat); `done(rr)` is called when it's all still.
   */
  playPush(g, rr, done) {
    this.stand(g, true);
    const at = (i) => g.tokens[i];
    const occupied = (r, c) => g.tokens.some((t) => t.r === r && t.c === c);
    const start = this.clock.elapsedTime;
    const events = rr.falls.map((f) => {
      const t = at(f.i), o = this.pieces[f.i];
      const nr = t.r + DR[f.d], nc = t.c + DC[f.d];
      const rest = t.type === 'pivot' ? 0 : occupied(nr, nc) ? (f.d % 2 ? 1.22 : 1.18) : Math.PI / 2;
      return { f, o, t, rest, dur: FALL(f.d) * TICK * 1.9 };
    });
    this.playing = { start, events, rr, done, g, doneAt: null };
    this.stopMark.material.opacity = 0;
  }

  /** Stand everything back up (after a failed push, or before a new one). */
  stand(g, instant = false) {
    this.playing = null;
    this.stopMark.material.opacity = 0;
    this.pieces.forEach((o, i) => {
      const t = g.tokens[i];
      o.heading = this.nearestYaw(o, t.o);
      if (o.type === 'target') o.heading = 0;
      if (o.arm) o.arm.rotation.y = 0;
      if (o.badge) o.badge.emissiveIntensity = 0;
      if (instant) { o.tip = 0; o.hinge.rotation.x = 0; o.yaw.rotation.y = o.heading; return; }
      const from = o.tip;
      if (from < 1e-3) return;
      this.tween({ dur: 0.45, delay: Math.random() * 0.15, update: (k) => { o.tip = from * (1 - easeInOutCubic(k)); } });
    });
  }

  // ---------- holding ----------

  hold(i) {
    const o = this.pieces[i];
    this.held = { i, o, at: o.root.position.clone(), cell: null };
    this.clearHint();
  }

  carry(x, y, isFree) {
    const h = this.held;
    if (!h) return null;
    const drop = this.dropAt(x, y, isFree);
    h.cell = drop;
    const p = this.pointOnPlane(x, y, TOP + LIFT);
    if (drop && drop !== 'tray') {
      h.at.set(X(drop.c), TOP + LIFT, Z(drop.r));
      this.ghost.position.set(X(drop.c), TOP + 0.006, Z(drop.r));
      this.ghost.visible = true;
    } else {
      if (p) h.at.set(p.x, TOP + LIFT, p.z);
      this.ghost.visible = false;
    }
    return drop;
  }

  /** A free square along the line of sight between carry height and the board, the tray, or null. */
  dropAt(x, y, isFree) {
    const cands = [];
    for (const hgt of [TOP, TOP + LIFT * 0.5, TOP + LIFT]) {
      const p = this.pointOnPlane(x, y, hgt);
      if (!p) continue;
      const c = Math.round(p.x + (N - 1) / 2), r = Math.round(p.z + (N - 1) / 2);
      if (r >= 0 && r < N && c >= 0 && c < N && Math.abs(p.x - X(c)) < 0.62 && Math.abs(p.z - Z(r)) < 0.62) cands.push({ r, c });
      else if (hgt === TOP && p.z > N / 2 + 0.2) return cands.find((q) => isFree(q.r, q.c)) ?? 'tray';
    }
    return cands.find((q) => isFree(q.r, q.c)) ?? null;
  }

  release() {
    this.held = null;
    this.ghost.visible = false;
  }

  // ---------- hints ----------

  showHint(g, h) {
    this.clearHint();
    const t = g.tokens[h.i];
    const ghost = new Piece3D({ ...t, o: h.o, fixed: false, turnable: false }, -1);
    ghost.root.traverse((m) => {
      if (!m.isMesh) return;
      m.material = new THREE.MeshBasicMaterial({ color: HINT, transparent: true, opacity: 0.35, depthWrite: false });
      m.castShadow = false;
      m.userData.piece = undefined;
    });
    ghost.root.position.set(X(h.c), TOP + 0.005, Z(h.r));
    this.scene.add(ghost.root);
    this.hintGhost = ghost;
    this.pieces[h.i].glow = { color: HINT, intensity: 0.5, pulse: true };
  }
  clearHint() {
    if (this.hintGhost) { this.scene.remove(this.hintGhost.root); this.hintGhost = null; }
    for (const o of this.pieces) if (o.glow.color === HINT) o.glow = NO_GLOW;
  }
  setGlow(i, glow) { const o = this.pieces[i]; if (o) o.glow = glow ?? NO_GLOW; }
  celebrate() { this.flare(0.6, 1.5); }

  // ---------- pointer ----------

  pieceAt(x, y, ids) {
    this.ray(x, y);
    const roots = ids.map((i) => this.pieces[i].root);
    const hit = this.raycaster.intersectObjects(roots, true).find((h) => h.object.userData.piece !== undefined);
    if (hit) return hit.object.userData.piece;
    let best = null, bd = 1;
    for (const i of ids) {
      const p = this.pieces[i].root.position, s = this.toScreen(p.x, p.y + 0.4, p.z);
      const dy = y - s.y;
      const d = Math.hypot((x - s.x) / 55, dy / (dy < 0 ? 100 : 55));
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  planeAt(x, y) {
    const p = this.pointOnPlane(x, y, TOP + LIFT);
    return p ? { x: p.x, z: p.z } : null;
  }

  // ---------- camera ----------

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(54);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const hw = N / 2 + 0.8, hd = N / 2 + 1.0;
    const tall = aspect < 0.9;
    const dist = Math.max(hw / (tanV * aspect * (tall ? 0.94 : 0.86)), (hd * Math.sin(el) + 0.8) / (tanV * 0.84), 6.5);
    const lift = tall ? dist * tanV * 0.28 : 0;
    this.camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist + 0.6 - lift);
    this.camera.lookAt(0, 0, 0.7 - lift);
  }

  // ---------- frame ----------

  update(dt, wave) {
    const h = this.held;
    if (h) h.o.root.position.lerp(h.at, damp(22, dt));
    const pl = this.playing;
    if (pl) {
      const now = (this.clock.elapsedTime - pl.start) / TICK;
      let still = true;
      for (const e of pl.events) {
        const k = (now - e.f.t) / (e.dur / TICK);
        if (k < 0) { still = false; continue; }
        const kk = Math.min(1, k);
        if (e.t.type === 'pivot') {
          e.o.arm.rotation.y = (e.t.o ? 1 : -1) * (Math.PI / 2) * easeOutCubic(kk);
        } else {
          if (e.t.type === 'target') e.o.heading = yawOf(e.f.d);
          e.o.yaw.rotation.y = e.o.type === 'target' ? yawOf(e.f.d) : e.o.yaw.rotation.y;
          e.o.tip = e.rest * easeInQuad(kk);
          if (e.o.badge) e.o.badge.emissiveIntensity = kk * 0.6;
        }
        if (k < 1) still = false;
      }
      if (still && pl.doneAt === null) {
        pl.doneAt = this.clock.elapsedTime;
        const end = pl.rr.end;
        if (end) { this.stopMark.position.set(X(end.c), TOP + 0.01, Z(end.r)); }
        const cb = pl.done;
        pl.done = null;
        cb?.(pl.rr);
      }
      if (pl.doneAt !== null && pl.showStop) this.stopMark.material.opacity = 0.5 + 0.4 * wave;
    }
    for (const o of this.pieces) {
      if (!pl || !pl.events.some((e) => e.o === o && e.t.type === 'target')) {
        const target = o.heading - (o.lean ?? 0);
        o.yaw.rotation.y += (target - o.yaw.rotation.y) * damp(16, dt);
      }
      o.hinge.rotation.x = -o.tip;
      // the floor arrow sits on the camera's side of the domino, so the domino never hides it
      if (o.arrow) o.arrow.position.z = -Math.cos(o.yaw.rotation.y) < -0.3 ? 0.32 : -0.32;
      for (const m of o.mats) if (m.emissive) applyGlow(m, o.glow, wave, 0.5);
      const p = o.root.position;
      o.blot.position.set(p.x, p.z > N / 2 + 0.3 ? 0.125 : TOP + 0.004, p.z);
      o.blot.material.opacity = 0.45 * Math.max(0.2, 1 - (p.y - TOP) / 0.6);
    }
    if (this.hintGhost) this.hintGhost.root.traverse((m) => { if (m.isMesh) m.material.opacity = 0.25 + 0.15 * (wave + 1) / 2; });
  }

  /** Mark where the chain stopped (after a failed push). */
  showStop(on) { if (this.playing) this.playing.showStop = on; if (!on) this.stopMark.material.opacity = 0; }

  handAnchor() {
    if (this.held) { const p = this.held.o.root.position; return new THREE.Vector3(p.x, p.y + 0.9, p.z); }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, 1.1);
  }
  handGlow() { return this.held ? { color: 0x3f7fe6, intensity: 0.16 } : this.hoverI !== null ? { color: 0xe0a83a, intensity: 0.14 } : NO_GLOW; }
}
