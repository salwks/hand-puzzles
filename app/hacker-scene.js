// 해커: the 3D board. A dark circuit board of 5×5 squares with server racks (walls), revolving
// platforms (glowing discs that turn a quarter on their beats, carrying what's on them), the agent,
// the data chip, the exit portal, the virus and the alarm. In front, the program: a row of T slots
// (each marked with the platforms that turn on that beat) and, below it, the supply of move tiles.
// Square (r, c) sits at world (c − 2, ·, r − 2 − BOARD_Z); row 0 is the far side, north is −z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Stage, NO_GLOW, applyGlow, damp, easeOutCubic, easeInOutCubic } from './stage.js';
import { N, ring } from './hacker-logic.js';
import { studioLight } from './studio.js';

const TOP = 0.14;
const BOARD_Z = -1.0;                 // the board sits back; the program row comes forward
const SLOT_Z = N / 2 + 0.55, SUPPLY_Z = SLOT_Z + 1.05;
const SLOT_W = 0.78;
const LIFT = 0.5;
const BEAT = 0.5;                     // seconds per beat when a program runs
const X = (c) => c - (N - 1) / 2;
const Z = (r) => r - (N - 1) / 2 + BOARD_Z;
const PLAT_COLORS = [0x36c5f0, 0xf0a336];
const HINT = 0x2fae7f;

const plastic = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.1, ...o });
const glowing = (color, intensity = 1.2) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });
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
  t.anisotropy = 8;
  return t;
}
const arrowTex = (color) => canvasTex(128, (g, s) => {
  g.fillStyle = color;
  g.beginPath(); g.moveTo(s / 2, 14); g.lineTo(s - 22, 62); g.lineTo(s / 2 + 15, 62); g.lineTo(s / 2 + 15, s - 16); g.lineTo(s / 2 - 15, s - 16); g.lineTo(s / 2 - 15, 62); g.lineTo(22, 62); g.closePath(); g.fill();
});
const ARROW_LIGHT = arrowTex('#e9fbff'), ARROW_DARK = arrowTex('#9fb3c4');
const CIRCUIT = canvasTex(512, (g, s) => {
  g.fillStyle = '#0d1b2a'; g.fillRect(0, 0, s, s);
  g.strokeStyle = 'rgba(64,180,220,0.18)'; g.lineWidth = 2;
  let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 60; i++) {
    let x = Math.floor(rnd() * 16) * 32 + 16, y = Math.floor(rnd() * 16) * 32 + 16;
    g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 4; k++) { if (rnd() < 0.5) x += (rnd() < 0.5 ? -1 : 1) * 32; else y += (rnd() < 0.5 ? -1 : 1) * 32; g.lineTo(x, y); }
    g.stroke();
    g.fillStyle = 'rgba(64,180,220,0.35)'; g.beginPath(); g.arc(x, y, 3, 0, Math.PI * 2); g.fill();
  }
});
const turnIcon = (dir, color) => canvasTex(128, (g, s) => {
  g.strokeStyle = color; g.lineWidth = 12; g.lineCap = 'round';
  g.beginPath(); g.arc(s / 2, s / 2, s * 0.32, -0.4, Math.PI * 1.3); g.stroke();
  const a = dir === 'cw' ? Math.PI * 1.3 : -0.4;
  const x = s / 2 + Math.cos(a) * s * 0.32, y = s / 2 + Math.sin(a) * s * 0.32;
  const t = dir === 'cw' ? a + Math.PI / 2 : a - Math.PI / 2;
  g.fillStyle = color; g.beginPath();
  g.moveTo(x + Math.cos(t) * 22, y + Math.sin(t) * 22);
  g.lineTo(x + Math.cos(t + 2.3) * 20, y + Math.sin(t + 2.3) * 20);
  g.lineTo(x + Math.cos(t - 2.3) * 20, y + Math.sin(t - 2.3) * 20);
  g.fill();
});
const LOCK = canvasTex(64, (g) => {
  g.fillStyle = '#ffd36b'; g.fillRect(16, 30, 32, 24);
  g.strokeStyle = '#ffd36b'; g.lineWidth = 6; g.beginPath(); g.arc(32, 30, 10, Math.PI, 0); g.stroke();
});
const LINK = canvasTex(128, (g, s) => {
  g.strokeStyle = '#7dffb4'; g.lineWidth = 12;
  for (const x of [s * 0.36, s * 0.64]) { g.beginPath(); g.ellipse(x, s / 2, s * 0.2, s * 0.12, 0, 0, Math.PI * 2); g.stroke(); }
});

export class HackerScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.tiles = [];
    this.held = null;
    this.hoverI = null;
    this.bloomThreshold = 1.1;
    this.board = new THREE.Group();
    this.scene.add(this.board);
    this.buildDesk();
    studioLight(this, { lampScale: 5, envIntensity: 0.55 });
    this.renderer.toneMappingExposure = 1.05;
    this.start();
  }

  buildDesk() {
    // the control panel: a strip under the slots and the supply tray
    this.panel = rounded(1, 0.12, 2.4, plastic(0x1d2632, { roughness: 0.5 }), 0.06);
    this.panel.position.set(0, 0.06, (SLOT_Z + SUPPLY_Z) / 2);
    this.scene.add(this.panel);
    this.slotGroup = new THREE.Group();
    this.scene.add(this.slotGroup);
    this.linkGroup = new THREE.Group();
    this.scene.add(this.linkGroup);
    this.ghost = new THREE.Mesh(new THREE.PlaneGeometry(SLOT_W - 0.06, SLOT_W - 0.06), new THREE.MeshBasicMaterial({ color: 0x7fd3ff, transparent: true, opacity: 0.45, depthWrite: false }));
    this.ghost.rotation.x = -Math.PI / 2;
    this.ghost.visible = false;
    this.scene.add(this.ghost);
    this.beatMark = new THREE.Mesh(new THREE.PlaneGeometry(SLOT_W, SLOT_W), new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, opacity: 0, depthWrite: false }));
    this.beatMark.rotation.x = -Math.PI / 2;
    this.scene.add(this.beatMark);
  }

  // ---------- a puzzle ----------

  /** Build the board and the program row for a game. */
  setGame(g) {
    const p = g.p;
    this.p = p;
    this.scene.remove(this.board);
    this.board = new THREE.Group();
    this.scene.add(this.board);
    this.slotGroup.clear();
    this.linkGroup.clear();

    const S = N + 0.4;
    const base = rounded(S, TOP, S, new THREE.MeshStandardMaterial({ map: CIRCUIT, roughness: 0.55, metalness: 0.2 }), 0.05);
    base.position.set(0, TOP / 2, BOARD_Z);
    this.board.add(base);
    const frame = new THREE.MeshPhysicalMaterial({ color: 0x2a3b4f, roughness: 0.35, metalness: 0.6 });
    for (const [w, d, x, z] of [[S + 0.2, 0.14, 0, -S / 2 - 0.04], [S + 0.2, 0.14, 0, S / 2 + 0.04], [0.14, S, -S / 2 - 0.04, 0], [0.14, S, S / 2 + 0.04, 0]]) {
      const m = rounded(w, 0.22, d, frame, 0.04); m.position.set(x, 0.11, z + BOARD_Z); this.board.add(m);
    }
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x2c8fb8, transparent: true, opacity: 0.45 });
    for (let k = 0; k <= N; k++) {
      const a = new THREE.Mesh(new THREE.PlaneGeometry(N, 0.025), lineMat); a.rotation.x = -Math.PI / 2; a.position.set(0, TOP + 0.003, k - N / 2 + BOARD_Z); this.board.add(a);
      const b = new THREE.Mesh(new THREE.PlaneGeometry(0.025, N), lineMat); b.rotation.x = -Math.PI / 2; b.position.set(k - N / 2, TOP + 0.003, BOARD_Z); this.board.add(b);
    }
    // server racks
    for (const [r, c] of p.walls) {
      const rack = rounded(0.84, 0.9, 0.84, plastic(0x14181f, { roughness: 0.45 }), 0.05);
      rack.position.set(X(c), TOP + 0.45, Z(r));
      this.board.add(rack);
      for (let k = 0; k < 4; k++) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.01), glowing(k % 2 ? 0x2fd6ff : 0x3dff8a, 1.6));
        led.position.set(X(c), TOP + 0.2 + k * 0.17, Z(r) + 0.425);
        this.board.add(led);
      }
    }
    // platforms: a disc under their four squares, with a ring glow and turn arrows
    this.platforms = p.platforms.map((pl, i) => {
      const col = PLAT_COLORS[i % PLAT_COLORS.length];
      const grp = new THREE.Group();
      grp.position.set(X(pl.c) + 0.5, TOP, Z(pl.r) + 0.5);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.06, 48), plastic(0x1a2b3d, { roughness: 0.35, metalness: 0.4 }));
      disc.position.y = 0.03; disc.receiveShadow = true;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.035, 10, 64), glowing(col, 1.4));
      rim.rotation.x = Math.PI / 2; rim.position.y = 0.06;
      const icon = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: turnIcon(pl.dir, '#' + new THREE.Color(col).getHexString()), transparent: true, depthWrite: false }));
      icon.rotation.x = -Math.PI / 2; icon.position.y = 0.065;
      grp.add(disc, rim, icon);
      this.board.add(grp);
      return { pl, grp, col };
    });
    // the pieces
    this.agent = this.makeAgent();
    this.items = {
      data: this.makeData(),
      exit: this.makeExit(),
      virus: this.makeVirus(),
      ...(p.alarm ? { alarm: this.makeAlarm() } : {}),
    };
    this.board.add(this.agent, ...Object.values(this.items));
    this.placeStart();

    // the program slots, each with the platforms that turn on its beat; the panel fits them
    this.panel.scale.x = p.T * (SLOT_W + 0.06) + 0.8;
    this.slots = [];
    for (let s = 0; s < p.T; s++) {
      const x = this.slotX(s);
      const well = rounded(SLOT_W, 0.05, SLOT_W, plastic(0x0f151c, { roughness: 0.5 }), 0.03);
      well.position.set(x, 0.14, SLOT_Z);
      this.slotGroup.add(well);
      const num = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: canvasTex(64, (gg) => { gg.fillStyle = '#7f93a6'; gg.font = 'bold 34px sans-serif'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(String(s + 1), 32, 34); }), transparent: true, depthWrite: false }));
      num.rotation.x = -Math.PI / 2; num.position.set(x, 0.125, SLOT_Z - SLOT_W / 2 - 0.2);
      this.slotGroup.add(num);
      p.platforms.forEach((pl, i) => {
        if (!pl.at.includes(s)) return;
        const col = '#' + new THREE.Color(PLAT_COLORS[i % PLAT_COLORS.length]).getHexString();
        const ic = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: turnIcon(pl.dir, col), transparent: true, depthWrite: false }));
        ic.rotation.x = -Math.PI / 2; ic.position.set(x + (i ? 0.2 : -0.2), 0.126, SLOT_Z - SLOT_W / 2 - 0.2);
        this.slotGroup.add(ic);
      });
      this.slots.push(well);
    }
    // tiles
    for (const t of this.tiles) this.scene.remove(t);
    this.tiles = g.tiles.map((t, i) => {
      const grp = new THREE.Group();
      const mat = plastic(t.locked ? 0x3b4656 : 0x1f8fb8, { roughness: 0.25 });
      const cap = rounded(SLOT_W - 0.12, 0.2, SLOT_W - 0.12, mat, 0.06);
      cap.position.y = 0.1;
      const arrow = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), new THREE.MeshBasicMaterial({ map: t.locked ? ARROW_DARK : ARROW_LIGHT, transparent: true, depthWrite: false }));
      arrow.rotation.x = -Math.PI / 2; arrow.rotation.z = -t.dir * Math.PI / 2; arrow.position.y = 0.202;
      grp.add(cap, arrow);
      if (t.locked) {
        const lock = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), new THREE.MeshBasicMaterial({ map: LOCK, transparent: true, depthWrite: false }));
        lock.rotation.x = -Math.PI / 2; lock.position.set(0.19, 0.203, 0.19);
        grp.add(lock);
      }
      grp.traverse((m) => { if (m.isMesh) m.userData.tile = i; });
      grp.userData = { mats: [mat], glow: NO_GLOW };
      this.scene.add(grp);
      return grp;
    });
    this.held = null;
    this.syncTiles(g, true);
    this.setLinks([]);
  }

  slotX(s) { return (s - (this.p.T - 1) / 2) * (SLOT_W + 0.06); }

  /** The agent: a little figure with a glowing visor. */
  makeAgent() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.3, 6, 16), plastic(0xeef3f7));
    body.position.y = 0.34; body.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16), plastic(0xeef3f7));
    head.position.y = 0.66; head.castShadow = true;
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.152, 24, 16, -Math.PI * 0.35, Math.PI * 0.7, Math.PI * 0.35, Math.PI * 0.25), glowing(0x2fd6ff, 1.8));
    visor.position.y = 0.66; visor.rotation.y = Math.PI;
    g.add(body, head, visor);
    return g;
  }
  makeData() {
    const g = new THREE.Group();
    const chip = rounded(0.4, 0.06, 0.3, plastic(0x1c2230), 0.02);
    chip.position.y = 0.32;
    for (let k = 0; k < 5; k++) for (const sz of [-1, 1]) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.07), plastic(0xd9b45a, { metalness: 0.9, roughness: 0.2 }));
      pin.position.set(-0.14 + k * 0.07, 0.31, sz * 0.18); g.add(pin);
    }
    const lab = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, 0.14), glowing(0xffc94d, 1.3));
    lab.position.y = 0.356;
    g.add(chip, lab);
    g.userData.spin = true;
    return g;
  }
  makeExit() {
    const g = new THREE.Group();
    const ringM = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 12, 48), glowing(0x3dff8a, 1.6));
    ringM.rotation.x = Math.PI / 2; ringM.position.y = 0.03;
    const pad = new THREE.Mesh(new THREE.CircleGeometry(0.3, 40), new THREE.MeshBasicMaterial({ color: 0x3dff8a, transparent: true, opacity: 0.25, depthWrite: false }));
    pad.rotation.x = -Math.PI / 2; pad.position.y = 0.02;
    g.add(ringM, pad);
    g.userData.pulse = pad;
    return g;
  }
  makeVirus() {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 1), glowing(0xff3b6b, 1.1));
    core.position.y = 0.36; core.castShadow = true;
    g.add(core);
    for (let k = 0; k < 12; k++) {
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 8), glowing(0xff7a9a, 0.8));
      const v = new THREE.Vector3().setFromSphericalCoords(0.24, Math.acos(1 - 2 * ((k + 0.5) / 12)), k * 2.4);
      sp.position.copy(v).add(new THREE.Vector3(0, 0.36, 0));
      sp.lookAt(new THREE.Vector3(0, 0.36, 0)); sp.rotateX(-Math.PI / 2);
      g.add(sp);
    }
    g.userData.spin = true;
    return g;
  }
  makeAlarm() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.12, 24), plastic(0x2a2f38));
    base.position.y = 0.06;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xff2a1a, emissive: 0xff2a1a, emissiveIntensity: 0.6, transparent: true, opacity: 0.85 }));
    dome.position.y = 0.12;
    g.add(base, dome);
    g.userData.dome = dome;
    return g;
  }

  /** Everything back where the puzzle starts. */
  placeStart() {
    const p = this.p;
    const at = (o, [r, c]) => o.position.set(X(c), TOP + (this.onPlatform(r, c) ? 0.06 : 0), Z(r));
    at(this.agent, p.agent);
    for (const k of Object.keys(this.items)) if (p[k]) { at(this.items[k], p[k]); this.items[k].visible = true; }
    for (const pp of this.platforms) pp.grp.rotation.y = 0;
    this.agent.rotation.y = 0;
    this.beatMark.material.opacity = 0;
  }
  onPlatform(r, c) { return this.p.platforms.some((pl) => ring(pl).some(([a, b]) => a === r && b === c)); }

  // ---------- tiles ----------

  /** Where tile i rests: its slot, or its place in the supply. */
  tileRest(g, i) {
    const t = g.tiles[i];
    if (t.slot !== null) return new THREE.Vector3(this.slotX(t.slot), 0.165, SLOT_Z);
    const free = g.tiles.map((_, j) => j).filter((j) => !g.tiles[j].locked);
    const k = free.indexOf(i), n = free.length;
    return new THREE.Vector3((k - (n - 1) / 2) * (SLOT_W + 0.1), 0.12, SUPPLY_Z);
  }
  syncTiles(g, instant = false) {
    g.tiles.forEach((_, i) => {
      const o = this.tiles[i];
      if (this.held?.i === i) return;
      const to = this.tileRest(g, i);
      if (instant) { o.position.copy(to); return; }
      const from = o.position.clone();
      if (from.distanceTo(to) < 1e-3) return;
      this.tween({ dur: 0.22, update: (k) => { o.position.lerpVectors(from, to, easeOutCubic(k)); o.position.y += Math.sin(Math.PI * k) * 0.15; } });
    });
  }

  tileAt(x, y, ids) {
    this.ray(x, y);
    const hit = this.raycaster.intersectObjects(ids.map((i) => this.tiles[i]), true).find((h) => h.object.userData.tile !== undefined);
    if (hit) return hit.object.userData.tile;
    let best = null, bd = 1;
    for (const i of ids) {
      const p = this.tiles[i].position, s = this.toScreen(p.x, p.y + 0.2, p.z);
      const dy = y - s.y;
      const d = Math.hypot((x - s.x) / 45, dy / (dy < 0 ? 70 : 45));
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  /** The slot under a screen point (or 'supply' / null), judged on the panel's surface. */
  slotAt(x, y) {
    const p = this.pointOnPlane(x, y, 0.17);
    if (!p) return null;
    if (Math.abs(p.z - SLOT_Z) < SLOT_W * 0.75) {
      const s = Math.round(p.x / (SLOT_W + 0.06) + (this.p.T - 1) / 2);
      if (s >= 0 && s < this.p.T) return s;
    }
    if (p.z > SLOT_Z + SLOT_W * 0.6) return 'supply';
    return null;
  }

  hold(i) { this.held = { i, at: this.tiles[i].position.clone() }; }
  /** Carry the held tile; `slotFor(x, y)` says which slot it would land in (or 'supply'/null). */
  carry(x, y, target) {
    const h = this.held;
    if (!h) return;
    const p = this.pointOnPlane(x, y, 0.17 + LIFT);
    if (typeof target === 'number') {
      h.at.set(this.slotX(target), 0.17 + LIFT * 0.6, SLOT_Z);
      this.ghost.position.set(this.slotX(target), 0.2, SLOT_Z);
      this.ghost.visible = true;
    } else {
      if (p) h.at.set(p.x, 0.17 + LIFT, p.z);
      this.ghost.visible = false;
    }
  }
  release() { this.held = null; this.ghost.visible = false; }
  setTileGlow(i, glow) { const o = this.tiles[i]; if (o) o.userData.glow = glow ?? NO_GLOW; }

  /** The link spots between back-to-back tiles (fix phase): [{ pair, x }]; `chosen` is shown linked. */
  setLinks(spots, chosen = null) {
    this.linkGroup.clear();
    this.linkSpots = spots.map((sp) => {
      // a round button floating over the seam between the two tiles
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.24, 32), new THREE.MeshBasicMaterial({ color: 0x0b1a14, transparent: true, opacity: 0.85, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(sp.x, 0.39, SLOT_Z);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), new THREE.MeshBasicMaterial({ map: LINK, transparent: true, depthWrite: false, opacity: sp.pair === chosen ? 1 : 0.8 }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(sp.x, 0.4, SLOT_Z);
      m.userData.pair = sp.pair;
      this.linkGroup.add(disc, m);
      return { ...sp, mesh: m };
    });
  }
  linkAt(x, y) {
    let best = null, bd = 60;
    for (const sp of this.linkSpots ?? []) {
      const s = this.toScreen(sp.x, 0.4, SLOT_Z);
      const d = Math.hypot(x - s.x, y - s.y);
      if (d < bd) { bd = d; best = sp.pair; }
    }
    return best;
  }

  // ---------- running a program ----------

  /**
   * Play a run from hacker-logic simulate(): each beat the agent steps (or bumps), then platforms
   * turn with whatever stands on them. `done()` when finished.
   */
  playRun(run, done) {
    this.placeStart();
    const frames = run.frames;
    const pos = (o) => o.position;
    let beat = 0;
    const next = () => {
      if (beat >= frames.length) { done?.(); return; }
      const f = frames[beat];
      this.beatMark.position.set(this.slotX(f.t), 0.2, SLOT_Z);
      this.beatMark.material.opacity = 0.5;
      const from = pos(this.agent).clone();
      // 1. the step (target = where the agent is before any turn)
      const stepTo = this.stepTarget(f);
      const hop = f.move !== null ? 0.18 : 0;
      if (f.move !== null) this.agent.rotation.y = [0, -Math.PI / 2, Math.PI, Math.PI / 2][f.move];
      this.tween({ dur: BEAT * 0.45, update: (k) => {
        if (f.bumped) { const b = Math.sin(Math.PI * k) * 0.18; pos(this.agent).copy(from).add(new THREE.Vector3([0, 1, 0, -1][f.move] * b, 0, [-1, 0, 1, 0][f.move] * b)); return; }
        pos(this.agent).lerpVectors(from, stepTo, easeInOutCubic(k));
        pos(this.agent).y = stepTo.y + Math.sin(Math.PI * k) * hop;
      }, done: () => {
        // 2. platforms turn, carrying the agent and items standing on them
        if (!f.turned.length) { after(); return; }
        const riders = [this.agent, ...Object.values(this.items)];
        const starts = riders.map((o) => o.position.clone());
        const turns = f.turned.map((i) => {
          const pp = this.platforms[i];
          const c = pp.grp.position;
          const on = riders.map((o) => Math.abs(o.position.x - c.x) < 0.9 && Math.abs(o.position.z - c.z) < 0.9);
          return { pp, c, on, a0: pp.grp.rotation.y, sign: pp.pl.dir === 'cw' ? -1 : 1 };
        });
        this.tween({ dur: BEAT * 0.5, update: (k) => {
          const a = easeInOutCubic(k) * Math.PI / 2;
          for (const tr of turns) {
            tr.pp.grp.rotation.y = tr.a0 + tr.sign * a;
            riders.forEach((o, j) => {
              if (!tr.on[j]) return;
              const v = starts[j].clone().sub(tr.c).applyAxisAngle(new THREE.Vector3(0, 1, 0), tr.sign * a);
              o.position.set(tr.c.x + v.x, starts[j].y, tr.c.z + v.z);
            });
          }
        }, done: after });
      } });
      const after = () => {
        // snap to the engine's squares so drift never builds up
        const [ar, ac] = f.agent;
        this.agent.position.set(X(ac), TOP + (this.onPlatform(ar, ac) ? 0.06 : 0), Z(ar));
        for (const [k, sq] of Object.entries(f.items)) if (this.items[k]) this.items[k].position.set(X(sq[1]), TOP + (this.onPlatform(sq[0], sq[1]) ? 0.06 : 0), Z(sq[0]));
        if (f.got && this.items.data.visible) { this.items.data.visible = false; this.flare(0.25, 0.6); }
        beat++;
        this.tween({ dur: BEAT * 0.05, update: () => {}, done: next });
      };
    };
    next();
  }

  /** Where the agent's step on this beat ends (before platforms turn). */
  stepTarget(f) {
    const cur = this.agent.position;
    if (f.move === null || f.bumped) return cur.clone();
    const dr = [-1, 0, 1, 0][f.move], dc = [0, 1, 0, -1][f.move];
    const c = Math.round(cur.x + (N - 1) / 2) + dc, r = Math.round(cur.z - BOARD_Z + (N - 1) / 2) + dr;
    return new THREE.Vector3(X(c), TOP + (this.onPlatform(r, c) ? 0.06 : 0), Z(r));
  }

  celebrate() { this.flare(0.7, 1.6); }

  // ---------- camera ----------

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(56);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const hw = 4.1, hd = 4.1;
    const tall = aspect < 0.9;
    const dist = Math.max(hw / (tanV * aspect * (tall ? 0.9 : 0.88)), (hd * Math.sin(el) + 0.6) / (tanV * 0.86), 7);
    const lift = tall ? dist * tanV * 0.36 : 0;
    this.camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist + 0.9 - lift);
    this.camera.lookAt(0, 0, 0.9 - lift);
  }

  // ---------- frame ----------

  update(dt, wave) {
    const h = this.held;
    if (h) this.tiles[h.i].position.lerp(h.at, damp(22, dt));
    for (const o of this.tiles) for (const m of o.userData.mats) applyGlow(m, o.userData.glow, wave, 0.5);
    const t = this.clock.elapsedTime;
    for (const o of Object.values(this.items ?? {})) {
      if (o.userData.spin) o.rotation.y = t * 0.8;
      if (o.userData.pulse) o.userData.pulse.material.opacity = 0.18 + 0.12 * (wave + 1) / 2;
      if (o.userData.dome) o.userData.dome.material.emissiveIntensity = 0.5 + 0.5 * Math.max(0, Math.sin(t * 5));
    }
    if (this.beatMark.material.opacity > 0) this.beatMark.material.opacity = Math.max(0, this.beatMark.material.opacity - dt * 0.4);
  }

  handAnchor() {
    if (this.held) { const p = this.tiles[this.held.i].position; return new THREE.Vector3(p.x, p.y + 0.5, p.z); }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, 0.9);
  }
  handGlow() { return this.held ? { color: 0x3f7fe6, intensity: 0.16 } : this.hoverI !== null ? { color: 0xe0a83a, intensity: 0.14 } : NO_GLOW; }
}
