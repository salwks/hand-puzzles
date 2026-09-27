// 레이저 미로: the 3D board, modelled on the real puzzle — a black 5×5 board with a well for every
// square, translucent coloured tokens with the mirror inside them, and a red beam that is traced
// live as tokens move. The tokens the player places wait in a tray at the front.
// Square (r, c) sits at world (c − 2, ·, r − 2): row 0 is the far side, north is −z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Stage, NO_GLOW, applyGlow, damp, easeOutCubic, easeInOutCubic } from './stage.js';
import { N, DR, DC, TURNS } from './laser-logic.js';
import { studioLight, lightDesk } from './studio.js';

const TOP = 0.2;          // well floor: where a token's base sits
const BEAM_Y = TOP + 0.2; // beam height, through the middle of the tokens
const LIFT = 0.55;        // how high a carried token rides
const TRAY_Z = N / 2 + 1.25;
const X = (c) => c - (N - 1) / 2;
const Z = (r) => r - (N - 1) / 2;
const HINT = 0x2fae7f;

// the real set's colours
const COLORS = { laser: 0x2a2a2e, target: 0x8a4fd8, double: 0x2f7fe8, splitter: 0x2fbf6a, check: 0xf2c21b, block: 0x1c1c1f };
export const NAMES = { laser: '레이저', target: '목표·거울', double: '양면 거울', splitter: '빔 분할기', check: '통과점', block: '칸 막이' };

// ---------- materials ----------

const plastic = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.1, ...o });
const acrylic = (color) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide });
const mirrorMat = () => new THREE.MeshStandardMaterial({ color: 0xe8ecf2, metalness: 1, roughness: 0.04 });
const glassMat = () => new THREE.MeshPhysicalMaterial({ color: 0xcff5dd, metalness: 0.5, roughness: 0.05, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });

function rounded(w, h, d, mat, radius = 0.04) {
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
  return t;
}
const BULLSEYE = canvasTex(128, (g, s) => {
  for (const [r, col] of [[0.5, '#f4f1ea'], [0.38, '#d8231c'], [0.26, '#f4f1ea'], [0.14, '#d8231c']]) {
    g.fillStyle = col; g.beginPath(); g.arc(s / 2, s / 2, r * s, 0, Math.PI * 2); g.fill();
  }
});
const GLOW = canvasTex(128, (g, s) => {
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(255,240,230,1)'); grd.addColorStop(0.18, 'rgba(255,90,60,0.9)'); grd.addColorStop(0.5, 'rgba(255,40,20,0.25)'); grd.addColorStop(1, 'rgba(255,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, s, s);
});
const BLOT = canvasTex(128, (g, s) => {
  const grd = g.createRadialGradient(s / 2, s / 2, 6, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(0,0,0,0.85)'); grd.addColorStop(0.6, 'rgba(0,0,0,0.4)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, s, s);
});
const TURN_RING = canvasTex(128, (g, s) => {
  g.strokeStyle = '#f2d08a'; g.lineWidth = 7; g.lineCap = 'round';
  g.beginPath(); g.arc(s / 2, s / 2, s * 0.4, -0.3, Math.PI * 1.35); g.stroke();
  const a = Math.PI * 1.35, x = s / 2 + Math.cos(a) * s * 0.4, y = s / 2 + Math.sin(a) * s * 0.4;
  g.fillStyle = '#f2d08a'; g.beginPath(); g.moveTo(x - 12, y - 4); g.lineTo(x + 8, y - 12); g.lineTo(x + 6, y + 10); g.fill();
});

// ---------- tokens ----------

/** A token: base plate, translucent body and what's inside it, built in its base pose (see laser-logic). */
class Token3D {
  constructor(t, i) {
    this.i = i;
    this.type = t.type;
    this.root = new THREE.Group();
    this.spin = new THREE.Group(); // turns with the orientation
    this.root.add(this.spin);
    this.glow = NO_GLOW;
    this.mats = [];
    this.yaw = -t.o * Math.PI / 2;
    this.spin.rotation.y = this.yaw;
    const col = COLORS[t.type];
    const H = 0.34, W = 0.8;
    // base: white for the player's tokens, dark grey for those fixed by the puzzle
    const base = rounded(0.86, 0.06, 0.86, plastic(t.fixed ? 0x3a3b3f : 0xeeeeea), 0.025);
    base.position.y = 0.03;
    this.root.add(base);
    this.mats.push(base.material);
    const add = (m, spin = true) => { m.userData.token = i; (spin ? this.spin : this.root).add(m); if (m.material && !this.mats.includes(m.material)) this.mats.push(m.material); return m; };
    const y = 0.06 + H / 2;
    const diagonal = (mat, len = W * Math.SQRT2 - 0.06) => {
      const m = rounded(len, H - 0.02, 0.035, mat, 0.012);
      m.rotation.y = -Math.PI / 4; // along "\": north-west to south-east
      m.position.y = y;
      return add(m);
    };
    switch (t.type) {
      case 'laser': {
        const body = add(rounded(W, H, W, plastic(col, { roughness: 0.35 }), 0.06));
        body.position.y = y;
        const band = add(rounded(W + 0.01, 0.07, W + 0.01, plastic(0xd8231c), 0.03));
        band.position.y = y + 0.05;
        const muzzle = add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.22, 24), plastic(0x9a9ca2, { metalness: 0.8, roughness: 0.25 })));
        muzzle.rotation.x = Math.PI / 2; muzzle.position.set(0, BEAM_Y - TOP, -W / 2 - 0.05);
        const lens = add(new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), new THREE.MeshBasicMaterial({ color: 0xff4a3a })));
        lens.rotation.y = Math.PI; lens.position.set(0, BEAM_Y - TOP, -W / 2 - 0.165);
        break;
      }
      case 'target': {
        add(rounded(W, H, W, acrylic(col), 0.05)).position.y = y;
        diagonal(mirrorMat());
        // the target on the north face, the blocked east side solid
        this.face = new THREE.MeshStandardMaterial({ map: BULLSEYE, roughness: 0.5, emissive: 0xff2a1a, emissiveIntensity: 0 });
        const disc = add(new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), this.face));
        disc.rotation.y = Math.PI; disc.position.set(0.05, BEAM_Y - TOP, -W / 2 - 0.004);
        const wall = add(rounded(0.06, H, W, plastic(col), 0.02));
        wall.position.set(W / 2 - 0.03, y, 0);
        break;
      }
      case 'double':
        add(rounded(W, H, W, acrylic(col), 0.05)).position.y = y;
        diagonal(mirrorMat());
        break;
      case 'splitter':
        add(rounded(W, H, W, acrylic(col), 0.05)).position.y = y;
        diagonal(glassMat());
        break;
      case 'check': {
        // a slot running north–south between two solid sides
        for (const sx of [-1, 1]) {
          const side = add(rounded(0.24, H, W, plastic(col), 0.04));
          side.position.set(sx * (W / 2 - 0.12), y, 0);
        }
        const bridge = add(rounded(W, 0.06, 0.16, plastic(col), 0.02));
        bridge.position.set(0, 0.06 + H - 0.03, 0);
        break;
      }
      case 'block': {
        add(rounded(W, H * 0.8, W, plastic(col, { roughness: 0.5 }), 0.08)).position.y = 0.06 + H * 0.4;
        const grip = add(rounded(0.3, 0.1, 0.3, plastic(0x3a3a40), 0.04));
        grip.position.y = 0.06 + H * 0.8 + 0.04;
        break;
      }
    }
    // tokens the player may turn but not move carry a small gold turn arrow on top
    if (t.fixed && t.turnable && TURNS[t.type] > 1) {
      const ring = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: TURN_RING, transparent: true, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.06 + H + 0.012;
      this.root.add(ring);
    }
    this.root.traverse((m) => { if (m.isMesh) { m.userData.token = i; m.castShadow = m.material.transparent ? false : m.castShadow; } });
    this.blot = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.15), new THREE.MeshBasicMaterial({ map: BLOT, transparent: true, depthWrite: false, opacity: 0.5 }));
    this.blot.rotation.x = -Math.PI / 2;
    this.blot.renderOrder = 1;
  }
}

// ---------- the beam ----------

/** Glowing beam segments: a hot core in two soft halos, all additive, so it reads as light. */
class Beam {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.geo = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
    this.geo.rotateZ(Math.PI / 2); // along x
    const add = (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
    this.layers = [[0.018, add(0xfff0ea, 1)], [0.05, add(0xff3020, 0.6)], [0.14, add(0xff1a0a, 0.18)]];
    this.sprites = [];
    this.pool = [];
    this.spritePool = [];
  }
  clear() {
    for (const m of this.pool) m.visible = false;
    for (const s of this.spritePool) s.visible = false;
    this.used = 0; this.usedSprites = 0;
  }
  segment(a, b) {
    const len = a.distanceTo(b);
    if (len < 1e-3) return;
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const yaw = Math.atan2(-(b.z - a.z), b.x - a.x);
    for (const [r, mat] of this.layers) {
      let m = this.pool[this.used];
      if (!m) { m = new THREE.Mesh(this.geo, mat); m.renderOrder = 5; this.pool.push(m); this.group.add(m); }
      m.material = mat;
      m.visible = true;
      m.position.copy(mid);
      m.rotation.set(0, yaw, 0);
      m.scale.set(len, r, r);
      this.used++;
    }
  }
  spark(p, size, color = 0xffffff) {
    let s = this.spritePool[this.usedSprites];
    if (!s) { s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); s.renderOrder = 6; this.spritePool.push(s); this.group.add(s); }
    s.visible = true;
    s.position.copy(p);
    s.scale.setScalar(size);
    s.material.color.set(color);
    s.userData.base = size;
    this.usedSprites++;
    return s;
  }
}

// ---------- the scene ----------

export class LaserScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.tokens = [];
    this.held = null;
    this.hoverI = null;
    this.bloomThreshold = 1.6;
    this.buildBoard();
    this.beam = new Beam(this.scene);
    this.alerts = [];
    studioLight(this, { lampScale: 4.2, envIntensity: 0.8 });
    lightDesk(this);
    this.start();
  }

  buildBoard() {
    const g = new THREE.Group();
    const black = plastic(0x17181b, { roughness: 0.38, clearcoat: 0.4 });
    const S = N + 0.5;
    // the board: a black slab whose top is a grid of raised walls around a well for each square
    const slab = rounded(S, TOP, S, black, 0.06);
    slab.position.y = TOP / 2;
    g.add(slab);
    const wallH = 0.1, wallMat = plastic(0x222327, { roughness: 0.4 });
    for (let k = 0; k <= N; k++) {
      const along = rounded(N + 0.12, wallH, 0.1, wallMat, 0.03);
      along.position.set(0, TOP + wallH / 2, k - N / 2);
      g.add(along);
      const across = rounded(0.1, wallH, N + 0.12, wallMat, 0.03);
      across.position.set(k - N / 2, TOP + wallH / 2, 0);
      g.add(across);
    }
    // a thin grey line in each well, like the printed squares
    const floor = new THREE.MeshStandardMaterial({ color: 0x2c2d31, roughness: 0.7 });
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.86), floor);
      w.rotation.x = -Math.PI / 2;
      w.position.set(X(c), TOP + 0.002, Z(r));
      w.receiveShadow = true;
      g.add(w);
    }
    // the tray for the tokens still to place
    const tray = rounded(N + 0.3, 0.14, 1.3, plastic(0xe6e3dc, { roughness: 0.45 }), 0.06);
    tray.position.set(0, 0.07, TRAY_Z);
    g.add(tray);
    this.scene.add(g);
    this.board = g;

    // the square a carried token will land on
    this.ghost = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.92), new THREE.MeshBasicMaterial({ color: 0x7fd3ff, transparent: true, opacity: 0.35, depthWrite: false }));
    this.ghost.rotation.x = -Math.PI / 2;
    this.ghost.visible = false;
    this.scene.add(this.ghost);
    // a hint shows the right token, in green, where it belongs
    this.hintGhost = null;
  }

  // ---------- a game ----------

  /** Build the tokens for a new game. */
  setGame(g) {
    for (const t of this.tokens) { this.scene.remove(t.root, t.blot); }
    this.tokens = g.tokens.map((t, i) => {
      const o = new Token3D(t, i);
      this.scene.add(o.root, o.blot);
      return o;
    });
    this.held = null;
    this.clearHint();
    this.sync(g, true);
  }

  /** Where token i rests: its square, or its slot in the tray. */
  restOf(g, i) {
    const t = g.tokens[i];
    if (t.r !== null) return new THREE.Vector3(X(t.c), TOP, Z(t.r));
    const mine = g.tokens.map((x, j) => j).filter((j) => !g.tokens[j].fixed);
    const k = mine.indexOf(i), n = mine.length;
    return new THREE.Vector3((k - (n - 1) / 2) * 1.08, 0.14, TRAY_Z);
  }

  /** Move every token to its place and turn it to its orientation (gliding unless instant). */
  sync(g, instant = false, dur = 0.24) {
    g.tokens.forEach((t, i) => {
      const o = this.tokens[i];
      if (!o || o === this.held?.o) return;
      const to = this.restOf(g, i);
      const yaw = this.nearestYaw(o, t.o);
      if (instant) { o.root.position.copy(to); o.spin.rotation.y = o.yaw = yaw; return; }
      const from = o.root.position.clone();
      const hop = from.distanceTo(to) > 0.2 ? 0.35 : 0;
      o.yaw = yaw; // the frame loop turns it
      if (from.distanceTo(to) < 1e-3) return;
      this.tween({ dur, update: (k) => {
        o.root.position.lerpVectors(from, to, dur > 0.3 ? easeInOutCubic(k) : easeOutCubic(k));
        o.root.position.y += Math.sin(Math.PI * k) * hop;
      } });
    });
  }

  /** The yaw for orientation `turns`, taken the short way round from where the token points now. */
  nearestYaw(o, turns) {
    const k = TURNS[o.type];
    const step = Math.PI / 2;
    let target = -turns * step;
    const period = k * step;
    while (target - o.spin.rotation.y > period / 2) target -= period;
    while (target - o.spin.rotation.y < -period / 2) target += period;
    return target;
  }

  // ---------- the beam ----------

  /**
   * Draw the beam from a trace (laser-logic): segments from square to square, stopping at the face
   * of a target or a blocked side, sparks where it lands, a warning where it goes wrong.
   */
  setBeam(tr, lit = new Set()) {
    this.beam.clear();
    const at = (r, c) => new THREE.Vector3(X(c), BEAM_Y, Z(r));
    const endAt = new Map(tr.ends.map((e) => [`${e.r},${e.c},${e.d}`, e.kind]));
    for (const s of tr.steps) {
      const from = at(s.r - DR[s.d], s.c - DC[s.d]);
      let to = at(s.r, s.c);
      const kind = endAt.get(`${s.r},${s.c},${s.d}`);
      if (kind === 'target' || kind === 'bad' || kind === 'laser') {
        to = to.clone().addScaledVector(new THREE.Vector3(DC[s.d], 0, DR[s.d]), -0.42);
        this.beam.segment(from, to);
        if (kind === 'target') this.beam.spark(to, 0.9);
        else this.beam.spark(to, 0.7, 0xffb0a0).userData.alert = true;
      } else this.beam.segment(from, to);
    }
    for (const e of tr.ends) {
      if (e.kind !== 'off') continue;
      const a = at(e.r, e.c), dir = new THREE.Vector3(DC[e.d], 0, DR[e.d]);
      const edge = a.clone().addScaledVector(dir, 0.5 + 0.25);
      this.beam.segment(a, edge);
      this.beam.spark(edge.clone().addScaledVector(dir, 0.05), 0.75, 0xffb0a0).userData.alert = true;
    }
    this.tokens.forEach((o, i) => { if (o.face) o.lit = lit.has(i); });
  }

  // ---------- holding ----------

  /** Pick token i up to carry it. */
  hold(i) {
    const o = this.tokens[i];
    this.held = { i, o, at: o.root.position.clone(), cell: null };
    this.clearHint();
  }

  /** Carry the held token to the screen point; returns the square it would land on, 'tray', or null. */
  carry(x, y, isFree) {
    const h = this.held;
    if (!h) return null;
    const drop = this.dropAt(x, y, isFree);
    h.cell = drop;
    const p = this.pointOnPlane(x, y, TOP + LIFT);
    if (drop && drop !== 'tray') {
      // the token floats over the square it will land on, so where it goes is never in doubt
      h.at.set(X(drop.c), TOP + LIFT, Z(drop.r));
      this.ghost.position.set(X(drop.c), TOP + 0.006, Z(drop.r));
      this.ghost.visible = true;
    } else {
      if (p) h.at.set(p.x, TOP + LIFT, p.z);
      this.ghost.visible = false;
    }
    return drop;
  }

  /**
   * Where a token let go at a screen point lands: a free square along the line of sight between
   * the carry height and the board (players aim both ways), the tray in front, or null.
   */
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

  /** Put the held token down (the game then syncs it to wherever it ended up). */
  release() {
    this.held = null;
    this.ghost.visible = false;
  }

  /** Turn a token to show the orientation it has now (with a little lean while the wrist twists). */
  showTurn(i, turns, lean = 0) {
    const o = this.tokens[i];
    const yaw = this.nearestYaw(o, turns);
    o.yaw = yaw;
    o.lean = lean;
  }

  // ---------- hints ----------

  /** Show token i's right place and direction as a green ghost, and make the token pulse. */
  showHint(g, h) {
    this.clearHint();
    const t = g.tokens[h.i];
    const ghost = new Token3D({ ...t, r: h.r, c: h.c, o: h.o, fixed: false, turnable: false }, -1);
    ghost.root.traverse((m) => {
      if (!m.isMesh) return;
      m.material = new THREE.MeshBasicMaterial({ color: HINT, transparent: true, opacity: 0.35, depthWrite: false });
      m.castShadow = false;
      m.userData.token = undefined;
    });
    ghost.root.position.set(X(h.c), TOP + 0.01, Z(h.r));
    this.scene.add(ghost.root);
    this.hintGhost = ghost;
    this.tokens[h.i].glow = { color: HINT, intensity: 0.5, pulse: true };
  }
  clearHint() {
    if (this.hintGhost) { this.scene.remove(this.hintGhost.root); this.hintGhost = null; }
    for (const o of this.tokens) if (o.glow.color === HINT) o.glow = NO_GLOW;
  }
  setGlow(i, glow) { const o = this.tokens[i]; if (o) o.glow = glow ?? NO_GLOW; }

  celebrate() {
    this.flare(0.7, 1.6);
  }

  // ---------- pointer ----------

  /** The token under a screen point (among `ids`): the mesh hit, else the nearest one with an upward reach. */
  tokenAt(x, y, ids) {
    this.ray(x, y);
    const roots = ids.map((i) => this.tokens[i].root);
    const hit = this.raycaster.intersectObjects(roots, true).find((h) => h.object.userData.token !== undefined);
    if (hit) return hit.object.userData.token;
    let best = null, bd = 1;
    for (const i of ids) {
      const p = this.tokens[i].root.position, s = this.toScreen(p.x, p.y + 0.25, p.z);
      const dy = y - s.y;
      const d = Math.hypot((x - s.x) / 60, dy / (dy < 0 ? 110 : 60));
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  /** Board point under a screen position, at carry height (for measuring hand motion). */
  planeAt(x, y) {
    const p = this.pointOnPlane(x, y, TOP + LIFT);
    return p ? { x: p.x, z: p.z } : null;
  }

  // ---------- camera ----------

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(52);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const hw = N / 2 + 0.8, hd = N / 2 + 1.0;
    const tall = aspect < 0.9;
    const dist = Math.max(hw / (tanV * aspect * (tall ? 0.94 : 0.86)), (hd * Math.sin(el) + 0.6) / (tanV * 0.84), 6);
    const lift = tall ? dist * tanV * 0.28 : 0;
    this.camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist + 0.6 - lift);
    this.camera.lookAt(0, 0, 0.75 - lift);
  }

  // ---------- frame ----------

  update(dt, wave) {
    const h = this.held;
    if (h) {
      h.o.root.position.lerp(h.at, damp(22, dt));
    }
    for (const o of this.tokens) {
      const target = o.yaw - (o.lean ?? 0);
      o.spin.rotation.y += (target - o.spin.rotation.y) * damp(16, dt);
      for (const m of o.mats) if (m.emissive) applyGlow(m, o.glow, wave, 0.5);
      if (o.face) {
        const want = o.lit ? 1.4 + 0.25 * wave : 0;
        o.face.emissiveIntensity += (want - o.face.emissiveIntensity) * damp(10, dt);
      }
      const p = o.root.position;
      o.blot.position.set(p.x, (p.z > N / 2 ? 0.145 : TOP + 0.004), p.z);
      o.blot.material.opacity = 0.5 * Math.max(0.2, 1 - (p.y - TOP) / 0.6);
    }
    // the beam shimmers a little; a wrong hit blinks
    const t = this.clock.elapsedTime;
    for (const s of this.beam.spritePool) {
      if (!s.visible) continue;
      s.scale.setScalar(s.userData.base * (s.userData.alert ? 0.75 + 0.35 * Math.abs(Math.sin(t * 6)) : 1 + 0.06 * wave));
    }
    this.beam.layers[2][1].opacity = 0.14 + 0.03 * Math.sin(t * 13);
    if (this.hintGhost) this.hintGhost.root.traverse((m) => { if (m.isMesh) m.material.opacity = 0.25 + 0.15 * (wave + 1) / 2; });
  }

  handAnchor() {
    if (this.held) { const p = this.held.o.root.position; return new THREE.Vector3(p.x, p.y + 0.55, p.z); }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, 1.0);
  }
  handGlow() { return this.held ? { color: 0x3f7fe6, intensity: 0.16 } : this.hoverI !== null ? { color: 0xe0a83a, intensity: 0.14 } : NO_GLOW; }
}
