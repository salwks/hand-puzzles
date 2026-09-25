// 궤도 방어: the 3D view. A round arena in deep space seen from above and in front, the ship at
// its centre inside a dial ring, the enemies (fifteen kinds, five bosses) as flat extruded hulls
// with glowing cores, laser pulses, and the tells the rules engine exposes: a dasher charging,
// a lancer's lock line, a blinker's ghost, a shielder's bubble, the hive's hatch, the core's
// plates. Logic (x, y) maps to world (x, 0, -y): "up" in the game is away from the camera.
import * as THREE from 'three';
import { Stage, damp } from './stage.js';
import { ENEMIES, ARENA, SHIP_R, SPAWN_R } from './orbit-logic.js';

const LOOK = 1.25; // enemies are drawn a little larger than their hit circles, to read at this distance

const W = (x, y, h = 0) => new THREE.Vector3(x, h, -y);
const FAMILY = {
  ruby: [0xc9454b, 0xff8a8f],
  sapphire: [0x4a7fd6, 0x9cc4ff],
  violet: [0x8a6bd1, 0xd2b8ff],
  emerald: [0x3f9f79, 0x8ff0c8],
  boss: [0xb0343b, 0xffd9a0],
};
const LASER = new THREE.Color(0x7ee8ff);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k); // over 1: blooms

// ---------- hull shapes: 2D outlines pointing along +x, about unit radius ----------

const poly = (pts) => {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
};
const ngon = (n, r = 1, sx = 1, sy = 1) => Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2) * r * sx, Math.sin((i / n) * Math.PI * 2) * r * sy]);
const star = (n, r1, r0) => Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2; const r = i % 2 ? r0 : r1; return [Math.cos(a) * r, Math.sin(a) * r]; });

const OUTLINE = {
  spark: [[1, 0], [-0.6, 0.62], [-0.25, 0], [-0.6, -0.62]],
  drone: ngon(8, 0.85),
  zig: [[1, 0], [0.2, 0.45], [0, 0.2], [-0.5, 0.75], [-0.75, 0], [-0.5, -0.75], [0, -0.2], [0.2, -0.45]],
  spinner: star(3, 1, 0.35),
  dasher: [[1.1, 0], [0.2, 0.55], [-0.9, 0.45], [-0.6, 0], [-0.9, -0.45], [0.2, -0.55]],
  orbiter: ngon(16, 0.72),
  splitter: [[1, 0], [0, 0.78], [-0.8, 0.45], [-0.5, 0], [-0.8, -0.45], [0, -0.78]],
  blinker: [[1, 0], [0, 0.9], [-1, 0], [0, -0.9]],
  hunter: [[1.1, 0], [0.1, 0.5], [-0.9, 0.95], [-0.5, 0], [-0.9, -0.95], [0.1, -0.5]],
  lancer: [[1.45, 0], [-0.2, 0.28], [-0.9, 0.72], [-0.7, 0], [-0.9, -0.72], [-0.2, -0.28]],
  shielder: [[0.75, 0.75], [-0.75, 0.75], [-0.75, -0.75], [0.75, -0.75]],
  gunner: [[0.5, 0.8], [-0.8, 0.8], [-0.8, -0.8], [0.5, -0.8], [0.5, -0.45], [1.15, -0.45], [1.15, -0.22], [0.5, -0.22], [0.5, 0.22], [1.15, 0.22], [1.15, 0.45], [0.5, 0.45]],
  brute: [[1, 0], [0.6, 0.8], [-0.3, 0.95], [-0.95, 0.4], [-0.95, -0.4], [-0.3, -0.95], [0.6, -0.8]],
  carrier: [[1.1, 0], [0.9, 0.62], [-0.9, 0.62], [-0.9, -0.62], [0.9, -0.62]],
  minelayer: ngon(20, 0.95),
  hive: ngon(28, 1, 1, 0.66),
  twin: [[1.3, 0], [-0.6, 0.55], [-0.3, 0], [-0.6, -0.55]],
  core: ngon(16, 0.9),
  serpent: ngon(12, 1),
  segment: ngon(10, 1),
  mother: [[0.55, 1], [-0.5, 0.8], [-0.7, 0], [-0.5, -0.8], [0.55, -1], [0.8, 0]],
  turret: [[0.9, 0.35], [-0.7, 0.7], [-0.7, -0.7], [0.9, -0.35]],
};
// where each kind's glowing core sits and how big it is (relative to the radius)
const CORE = { core: [0, 0.55], spark: [-0.2, 0.22], drone: [0, 0.35], spinner: [0, 0.3], orbiter: [0, 0.38], minelayer: [0, 0.42], hive: [0, 0.38], mother: [0.1, 0.22], serpent: [0.35, 0.22], segment: [0, 0.3], shielder: [0, 0.3], gunner: [-0.15, 0.3], carrier: [-0.2, 0.25] };

const geoCache = new Map();
function hullGeo(kind) {
  if (!geoCache.has(kind)) {
    const g = new THREE.ExtrudeGeometry(poly(OUTLINE[kind]), { depth: 0.3, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 1 });
    g.rotateX(-Math.PI / 2); // shape (x, y) → world (x, ·, -y), extruded upwards
    geoCache.set(kind, g);
  }
  return geoCache.get(kind);
}
const SPHERE = new THREE.SphereGeometry(1, 16, 12);
// a soft round dot for sparks (points are squares without it)
const DOT = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const MINE = new THREE.IcosahedronGeometry(1, 0);
const OCTA = new THREE.OctahedronGeometry(1, 0);

function familyOf(kind) {
  if (ENEMIES[kind]) return ENEMIES[kind].family;
  if (kind === 'segment' || kind === 'serpent') return 'violet';
  if (kind === 'hive') return 'emerald';
  if (kind === 'mother' || kind === 'turret') return 'boss';
  return 'ruby';
}

export class OrbitScene extends Stage {
  constructor(canvas) {
    super(canvas);
    // space, not a table: no leather, a cool key light from above, a dim blue fill
    this.table.visible = false;
    this.renderer.setClearColor(0x05060a);
    this.scene.fog = new THREE.Fog(0x05060a, 40, 80);
    const { key, rim, bounce } = this.lights;
    key.color.set(0xdfe8ff); key.intensity = 900; key.angle = 0.9; key.penumbra = 0.8;
    key.position.set(-8, 22, 10); key.target.position.set(0, 0, 0);
    key.shadow.camera.near = 8; key.shadow.camera.far = 50;
    rim.color.set(0x6f8fd6); rim.intensity = 0.9; rim.position.set(6, 6, -12);
    bounce.intensity = 0.55;
    this.scene.environmentIntensity = 0.4;
    this.bloomThreshold = 0.95;
    this.flare(0.01); // build the composer now: lasers and cores glow all the time

    this.views = new Map(); // enemy id → view
    this.fxList = [];
    this.buildSpace();
    this.buildArena();
    this.buildShip();
    this.buildShots();
    this.lockLines = new Map();
    this.aim = Math.PI / 2;
    this.state = null;
    this.onFrame = null; // set by the game: called every frame with dt before drawing
    this.start();
  }

  // ---------- the set ----------

  buildSpace() {
    const n = 1400, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 20 + Math.random() * 60, a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r, -6 - Math.random() * 30, Math.sin(a) * r - 10], i * 3);
      const c = 0.5 + Math.random() * 0.5, warm = Math.random() < 0.2;
      col.set([c, c * (warm ? 0.9 : 1), c * (warm ? 0.75 : 1.1)], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false }));
    this.scene.add(this.stars);
    // a faint nebula glow under the arena
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d');
    const grd = x.createRadialGradient(128, 128, 10, 128, 128, 128);
    grd.addColorStop(0, 'rgba(60,70,120,0.55)'); grd.addColorStop(0.5, 'rgba(40,30,70,0.25)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = grd; x.fillRect(0, 0, 256, 256);
    const neb = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    neb.rotation.x = -Math.PI / 2; neb.position.y = -8;
    this.scene.add(neb);
  }

  buildArena() {
    const g = new THREE.Group();
    // the floor: a dark glassy deck running out to the screen's edges, fading into space
    const fade = document.createElement('canvas');
    fade.width = fade.height = 256;
    const fx = fade.getContext('2d');
    const fg = fx.createRadialGradient(128, 128, 0, 128, 128, 128);
    fg.addColorStop(0, '#fff'); fg.addColorStop((ARENA + 1) / 40, '#fff'); fg.addColorStop(0.75, '#555'); fg.addColorStop(1, '#000');
    fx.fillStyle = fg; fx.fillRect(0, 0, 256, 256);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(40, 96), new THREE.MeshStandardMaterial({ color: 0x0b0d14, metalness: 0.6, roughness: 0.45, transparent: true, opacity: 0.9, alphaMap: new THREE.CanvasTexture(fade) }));
    disc.rotation.x = -Math.PI / 2; disc.position.y = -0.3; disc.receiveShadow = true;
    g.add(disc);
    const ring = (r, color, opacity, dashed = false) => {
      const pts = ngon(128, r).map(([px, py]) => W(px, py, -0.28));
      const geo = new THREE.BufferGeometry().setFromPoints([...pts, pts[0]]);
      const mat = dashed ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.35, gapSize: 0.5 }) : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const line = new THREE.Line(geo, mat);
      if (dashed) line.computeLineDistances();
      g.add(line);
      return line;
    };
    this.edge = ring(ARENA, 0xb89b5e, 0.55);
    ring(ARENA + 0.35, 0xb89b5e, 0.18);
    ring(8, 0x5a6a90, 0.35, true);
    ring(4, 0x5a6a90, 0.3, true);
    // spokes every 30°
    const spokes = [];
    for (let a = 0; a < 360; a += 30) {
      const r = (a * Math.PI) / 180;
      spokes.push(W(Math.cos(r) * 2.2, Math.sin(r) * 2.2, -0.28), W(Math.cos(r) * ARENA, Math.sin(r) * ARENA, -0.28));
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spokes), new THREE.LineBasicMaterial({ color: 0x2c3550, transparent: true, opacity: 0.5 })));

    // the dial ring around the ship: ticks every 15°, long ones at the quarters
    const ticks = [];
    for (let a = 0; a < 360; a += 15) {
      const r = (a * Math.PI) / 180, l = a % 90 === 0 ? 0.42 : 0.2;
      ticks.push(W(Math.cos(r) * 1.7, Math.sin(r) * 1.7, 0.02), W(Math.cos(r) * (1.7 + l), Math.sin(r) * (1.7 + l), 0.02));
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks), new THREE.LineBasicMaterial({ color: 0xcdb27a, transparent: true, opacity: 0.8 })));
    const dial = new THREE.Mesh(new THREE.RingGeometry(1.62, 1.7, 96), new THREE.MeshBasicMaterial({ color: hdr(0xcdb27a, 1.1), transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    dial.rotation.x = -Math.PI / 2; dial.position.y = 0.02;
    g.add(dial);
    // the aim: a bright notch on the dial and a faint sight line out to the edge
    this.notch = new THREE.Mesh(new THREE.RingGeometry(1.55, 2.25, 24, 1, -0.09, 0.18), new THREE.MeshBasicMaterial({ color: hdr(LASER, 2.2), transparent: true, opacity: 0.95, side: THREE.DoubleSide }));
    this.notch.rotation.x = -Math.PI / 2; this.notch.position.y = 0.03;
    const notchPivot = new THREE.Group();
    notchPivot.add(this.notch);
    g.add(notchPivot);
    this.notchPivot = notchPivot;
    const sight = new THREE.Mesh(new THREE.PlaneGeometry(ARENA - 2.3, 0.07), new THREE.MeshBasicMaterial({ color: hdr(LASER, 1.2), transparent: true, opacity: 0.22, depthWrite: false }));
    sight.rotation.x = -Math.PI / 2; sight.position.set(2.3 + (ARENA - 2.3) / 2, 0.01, 0);
    notchPivot.add(sight);
    this.sight = sight;
    this.scene.add(g);
    this.arena = g;
  }

  buildShip() {
    const ship = new THREE.Group();
    // a long, narrow arrowhead so the nose reads at a glance, with a gold spine along it
    const hullShape = poly([[1.7, 0], [-0.3, 0.3], [-0.75, 0.72], [-0.45, 0], [-0.75, -0.72], [-0.3, -0.3]]);
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 });
    hullGeo.rotateX(-Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, new THREE.MeshStandardMaterial({ color: 0xede6d8, metalness: 0.55, roughness: 0.3 }));
    hull.castShadow = true;
    ship.add(hull);
    const wingGeo = new THREE.ExtrudeGeometry(poly([[1.55, 0], [-0.3, 0.13], [-0.3, -0.13]]), { depth: 0.42, bevelEnabled: false });
    wingGeo.rotateX(-Math.PI / 2);
    ship.add(new THREE.Mesh(wingGeo, new THREE.MeshStandardMaterial({ color: 0xcdb27a, metalness: 0.8, roughness: 0.25 })));
    const cockpit = new THREE.Mesh(SPHERE, new THREE.MeshBasicMaterial({ color: hdr(LASER, 1.8) }));
    cockpit.scale.set(0.24, 0.12, 0.14); cockpit.position.set(0.45, 0.46, 0);
    ship.add(cockpit);
    const engine = new THREE.Mesh(SPHERE, new THREE.MeshBasicMaterial({ color: hdr(0xd6a23e, 2.4), transparent: true, opacity: 0.9 }));
    engine.scale.set(0.28, 0.1, 0.22); engine.position.set(-0.55, 0.2, 0);
    ship.add(engine);
    this.engine = engine;
    const shield = new THREE.Mesh(SPHERE, new THREE.MeshBasicMaterial({ color: hdr(0x3f9f79, 1.2), transparent: true, opacity: 0.18, depthWrite: false }));
    shield.scale.setScalar(1.35); shield.visible = false;
    ship.add(shield);
    this.shieldBubble = shield;
    ship.position.y = 0.05;
    this.scene.add(ship);
    this.ship = ship;
  }

  buildShots() {
    const geo = new THREE.CylinderGeometry(0.07, 0.07, 1.3, 6);
    geo.rotateZ(Math.PI / 2); // along +x
    const mat = new THREE.MeshBasicMaterial({ color: hdr(LASER, 2) });
    this.shotPool = [];
    this.shotMesh = { geo, mat };
  }

  // ---------- camera ----------

  frameCamera(aspect) {
    // full screen: the arena's edge touches the top and bottom of the window (or the sides on a
    // tall one); enemies spawn just off screen and fly in from the edges
    const el = (60 * Math.PI) / 180;
    this.camera.fov = 38;
    this.camera.aspect = aspect;
    const ring = ngon(32, ARENA + 0.4).map(([x, y]) => W(x, y, 0));
    const v = new THREE.Vector3();
    const place = (d, tz) => {
      this.camera.position.set(0, Math.sin(el) * d, Math.cos(el) * d + tz);
      this.camera.lookAt(0, 0, tz);
      this.camera.updateMatrixWorld();
      this.camera.updateProjectionMatrix();
    };
    const fits = () => ring.every((p) => { v.copy(p).project(this.camera); return Math.abs(v.x) < 1 && Math.abs(v.y) < 1; });
    // the nearest camera that fits, over a few aim points along the depth (the far edge is
    // foreshortened, so centring on the arena's middle wastes the top of the screen)
    let best = { d: Infinity, tz: 0 };
    for (let tz = -3; tz <= 4; tz += 0.25) {
      let lo = 8, hi = 120;
      for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; place(mid, tz); if (fits()) hi = mid; else lo = mid; }
      if (hi < best.d) best = { d: hi, tz };
    }
    const d = best.d;
    place(d, best.tz);
    // fog only far past the arena, however far back the camera had to go
    this.scene.fog.near = d + 25;
    this.scene.fog.far = d + 70;
  }

  // ---------- syncing to the rules state ----------

  /** Aim angle in logic radians (world rotation about y by the same angle). */
  setAim(a) {
    this.aim = a;
    this.ship.rotation.y = a;
    this.notchPivot.rotation.y = a;
  }

  makeView(e) {
    const g = new THREE.Group();
    const fam = familyOf(e.kind);
    const [base, tint] = FAMILY[fam];
    let body;
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(base).multiplyScalar(0.75), metalness: 0.5, roughness: 0.38, emissive: new THREE.Color(base), emissiveIntensity: 0.25 });
    if (e.kind === 'bullet') {
      body = new THREE.Mesh(SPHERE, new THREE.MeshBasicMaterial({ color: hdr(0xff6a55, 2.2) }));
      body.scale.setScalar(e.r);
    } else if (e.kind === 'mine') {
      body = new THREE.Mesh(MINE, new THREE.MeshStandardMaterial({ color: 0x3a2a55, emissive: new THREE.Color(0xd2b8ff), emissiveIntensity: 0.9, metalness: 0.6, roughness: 0.3, flatShading: true }));
      body.scale.setScalar(e.r * 1.1);
    } else {
      body = new THREE.Mesh(hullGeo(e.kind), mat);
      const k = e.boss ? 1 : LOOK;
      body.scale.set(e.r * k, e.r * k, e.r * k);
      body.castShadow = true;
    }
    g.add(body);
    // glowing core
    let core = null;
    if (!e.minor) {
      const [cx, cr] = CORE[e.kind] ?? [0, 0.26];
      core = new THREE.Mesh(SPHERE, new THREE.MeshBasicMaterial({ color: hdr(tint, 1.6) }));
      const k = e.boss ? 1 : LOOK;
      core.scale.setScalar(e.r * cr * k);
      core.position.set(cx * e.r * k, 0.42 * e.r * k + 0.1, 0);
      g.add(core);
    }
    const v = { g, body, core, mat: body.material, flash: 0, born: 0, kind: e.kind, extra: {} };
    // kind-specific parts
    if (e.kind === 'orbiter') {
      const torus = new THREE.Mesh(new THREE.TorusGeometry(e.r * 1.25, 0.05, 6, 40), new THREE.MeshBasicMaterial({ color: hdr(tint, 1.4) }));
      torus.rotation.x = Math.PI / 2; torus.position.y = 0.2;
      g.add(torus);
    }
    if (e.kind === 'shielder') {
      const bubble = new THREE.Mesh(new THREE.RingGeometry(3.3, 3.4, 64), new THREE.MeshBasicMaterial({ color: hdr(0x8ff0c8, 1.3), transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      bubble.rotation.x = -Math.PI / 2; bubble.position.y = -0.2;
      g.add(bubble);
      v.extra.bubble = bubble;
    }
    if (e.kind === 'core') {
      const plates = new THREE.Group();
      for (let k = 0; k < 4; k++) {
        const arc = new THREE.Mesh(new THREE.RingGeometry(e.r * 1.25, e.r * 1.6, 16, 1, -0.5, 1.0), new THREE.MeshStandardMaterial({ color: 0xede6d8, metalness: 0.8, roughness: 0.25, side: THREE.DoubleSide }));
        arc.rotation.x = -Math.PI / 2;
        const holder = new THREE.Group();
        holder.rotation.y = (k * Math.PI) / 2;
        holder.add(arc);
        plates.add(holder);
      }
      plates.position.y = 0.35;
      this.scene.add(plates); // world-aligned (the plates' angle is in world terms, not the hull's heading)
      v.extra.plates = plates;
    }
    if (e.kind === 'hive') {
      const hatch = new THREE.Mesh(new THREE.CircleGeometry(e.r * 0.42, 24), new THREE.MeshBasicMaterial({ color: hdr(0xffd9a0, 0.4), side: THREE.DoubleSide }));
      hatch.rotation.x = -Math.PI / 2; hatch.position.set(0, 0.55 * e.r, 0);
      g.add(hatch);
      v.extra.hatch = hatch;
    }
    if (e.kind === 'blinker') {
      const ghost = new THREE.Mesh(hullGeo('blinker'), new THREE.MeshBasicMaterial({ color: hdr(tint, 1.2), transparent: true, opacity: 0.3, depthWrite: false }));
      ghost.scale.setScalar(e.r); ghost.visible = false;
      this.scene.add(ghost);
      v.extra.ghost = ghost;
    }
    // shielded marker: a small emerald ring under anything a shielder protects
    const guard = new THREE.Mesh(new THREE.RingGeometry(e.r * 1.2, e.r * 1.32, 32), new THREE.MeshBasicMaterial({ color: hdr(0x8ff0c8, 1.4), transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
    guard.rotation.x = -Math.PI / 2; guard.position.y = -0.15; guard.visible = false;
    g.add(guard);
    v.extra.guard = guard;
    g.scale.setScalar(0.01);
    this.scene.add(g);
    return v;
  }

  dropView(d) {
    const color = { spread: 0x7ee8ff, pierce: 0xd2b8ff, rapid: 0xf2c46b, shield: 0x8ff0c8 }[d.kind];
    const m = new THREE.Mesh(OCTA, new THREE.MeshStandardMaterial({ color, emissive: new THREE.Color(color), emissiveIntensity: 1.3, metalness: 0.3, roughness: 0.3 }));
    m.scale.setScalar(0.42);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.62, 32), new THREE.MeshBasicMaterial({ color: hdr(color, 1.5), transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2;
    const g = new THREE.Group();
    g.add(m, halo);
    this.scene.add(g);
    return { g, m };
  }

  /** Mirror the rules state: create, move and retire views; draw tells. */
  sync(st, dt) {
    this.state = st;
    const seen = new Set();
    for (const e of st.enemies) {
      seen.add(e.id);
      let v = this.views.get(e.id);
      if (v && v.kind !== e.kind) { this.dropView_(e.id, v); v = null; }
      if (!v) { v = this.makeView(e); this.views.set(e.id, v); }
      v.last = { x: e.x, y: e.y, r: e.r, kind: e.kind, boss: e.boss };
      v.born = Math.min(1, v.born + dt * 4);
      const s = v.born < 1 ? 1 - (1 - v.born) ** 3 : 1;
      v.g.scale.setScalar(Math.max(0.01, s));
      const bob = e.minor ? 0 : Math.sin(this.clock.elapsedTime * 3 + e.id) * 0.06;
      v.g.position.copy(W(e.x, e.y, 0.1 + bob));
      // heading: towards the ship, except the spinners and mines, which turn on the spot
      const toward = Math.atan2(-e.y, -e.x);
      if (e.kind === 'spinner' || e.kind === 'mine') v.g.rotation.y += dt * (e.kind === 'mine' ? 1.5 : 6);
      else if (e.kind === 'segment') v.g.rotation.y = toward;
      else v.g.rotation.y = toward;
      // hit flash, charge glow
      v.flash = Math.max(0, v.flash - dt * 6);
      const charging = e.mem.mode === 'charge' || e.mem.mode === 'lock';
      const pulse = charging ? 0.8 + 0.8 * Math.sin(this.clock.elapsedTime * 30) : 0;
      if (v.mat.emissive) {
        v.mat.emissiveIntensity = 0.25 + v.flash * 2.5 + pulse;
        if (v.flash > 0.01) v.mat.emissive.setRGB(1, 1, 1); else v.mat.emissive.set(FAMILY[familyOf(e.kind)][0]);
      }
      v.extra.guard.visible = Boolean(e.shielded);
      if (v.extra.bubble) v.extra.bubble.material.opacity = 0.25 + 0.1 * Math.sin(this.clock.elapsedTime * 3);
      if (v.extra.hatch) v.extra.hatch.material.color.copy(hdr(0xffd9a0, e.mem.open ? 3 : 0.35));
      if (v.extra.plates) {
        v.extra.plates.position.copy(W(e.x, e.y, 0.35));
        v.extra.plates.rotation.y = e.mem.rot ?? 0;
      }
      if (v.extra.ghost) {
        const nx = e.mem.next;
        v.extra.ghost.visible = Boolean(nx);
        if (nx) { v.extra.ghost.position.copy(W(nx.x, nx.y, 0.1)); v.extra.ghost.rotation.y = Math.atan2(-nx.y, -nx.x); v.extra.ghost.material.opacity = 0.2 + 0.25 * Math.abs(Math.sin(this.clock.elapsedTime * 16)); }
      }
      // a lancer's lock: a red line to the ship
      if (e.kind === 'lancer') this.lockLine(e.id, e.mem.mode === 'lock' ? e : null);
    }
    for (const [id, v] of this.views) if (!seen.has(id)) this.dropView_(id, v);

    // laser pulses
    const shots = st.shots;
    while (this.shotPool.length < shots.length) {
      const m = new THREE.Mesh(this.shotMesh.geo, this.shotMesh.mat);
      this.scene.add(m);
      this.shotPool.push(m);
    }
    this.shotPool.forEach((m, i) => {
      const s = shots[i];
      m.visible = Boolean(s);
      if (!s) return;
      m.position.copy(W(s.x, s.y, 0.3));
      m.rotation.y = s.a;
    });

    // drops
    this.drops ??= new Map();
    const ds = new Set();
    for (const d of st.drops) {
      ds.add(d.id);
      let v = this.drops.get(d.id);
      if (!v) { v = this.dropView(d); this.drops.set(d.id, v); }
      v.g.position.copy(W(d.x, d.y, 0.4));
      v.m.rotation.y += dt * 2.5;
      v.g.visible = d.life > 2 || Math.sin(this.clock.elapsedTime * 20) > 0;
    }
    for (const [id, v] of this.drops) if (!ds.has(id)) { this.scene.remove(v.g); this.drops.delete(id); }

    // the ship
    const sh = st.ship;
    this.ship.visible = st.phase !== 'over' && (sh.invuln <= 0 || Math.sin(this.clock.elapsedTime * 40) > -0.2);
    this.shieldBubble.visible = sh.shield;
    this.engine.scale.x = 0.28 + 0.06 * Math.sin(this.clock.elapsedTime * 40);
    const rapid = st.power.rapid > 0, spread = st.power.spread > 0;
    this.sight.material.opacity = spread ? 0.32 : 0.22;
    this.notch.material.color.copy(hdr(rapid ? 0xf2c46b : LASER, 2.2));
  }

  /** Take an enemy's view off the field. */
  dropView_(id, v) {
    this.scene.remove(v.g);
    if (v.extra.plates) this.scene.remove(v.extra.plates);
    if (v.extra.ghost) this.scene.remove(v.extra.ghost);
    this.lockLine(id, null);
    this.views.delete(id);
  }

  /** A new game: clear everything the last one left on the field. */
  reset() {
    for (const [id, v] of [...this.views]) this.dropView_(id, v);
    for (const [, v] of this.drops ?? []) this.scene.remove(v.g);
    this.drops?.clear();
    for (const m of this.shotPool) m.visible = false;
  }

  lockLine(id, e) {
    let line = this.lockLines.get(id);
    if (!e) { if (line) { this.scene.remove(line); this.lockLines.delete(id); } return; }
    if (!line) {
      line = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.08), new THREE.MeshBasicMaterial({ color: hdr(0xff4a50, 2.2), transparent: true, opacity: 0.8, depthWrite: false }));
      line.rotation.order = 'YXZ';
      this.scene.add(line);
      this.lockLines.set(id, line);
    }
    const r = Math.hypot(e.x, e.y);
    line.scale.x = r - SHIP_R;
    line.position.copy(W(e.x / 2, e.y / 2, 0.05));
    line.rotation.set(-Math.PI / 2, Math.atan2(e.y, e.x), 0);
    line.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(this.clock.elapsedTime * 18));
  }

  // ---------- effects from events ----------

  hitFx(id) {
    const v = this.views.get(id);
    if (v) v.flash = 1;
  }

  /** A burst of glowing sparks and an expanding ring. `size` ~ the enemy radius. */
  burst(x, y, color, size = 0.6, count = 40) {
    const n = Math.round(count * (0.6 + size)), pos = new Float32Array(n * 3), vel = [];
    const p0 = W(x, y, 0.3);
    for (let i = 0; i < n; i++) {
      pos.set([p0.x, p0.y, p0.z], i * 3);
      const a = Math.random() * Math.PI * 2, up = Math.random() * 0.8, sp = (2 + Math.random() * 6) * (0.6 + size);
      vel.push([Math.cos(a) * sp, up * sp * 0.5, Math.sin(a) * sp]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: hdr(color, 2.5), size: 0.3 + size * 0.12, map: DOT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.scene.add(pts);
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 40), new THREE.MeshBasicMaterial({ color: hdr(color, 2), transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.copy(p0);
    this.scene.add(ringMesh);
    this.fxList.push({ pts, vel, ring: ringMesh, t: 0, life: 0.7 + size * 0.4, size });
  }

  /** A little spark where a pulse bounced off armour. */
  spark(x, y, color = 0xede6d8) { this.burst(x, y, color, 0.05, 10); }

  /** A shock ring out from the ship (EMP). */
  shock() {
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 64), new THREE.MeshBasicMaterial({ color: hdr(LASER, 2.5), transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    ringMesh.rotation.x = -Math.PI / 2; ringMesh.position.y = 0.2;
    this.scene.add(ringMesh);
    this.fxList.push({ ring: ringMesh, t: 0, life: 0.9, size: 14, shock: true });
    this.flare(0.8, 0.8);
  }

  explode(id, x, y, kind, big = false) {
    const fam = familyOf(kind);
    const color = FAMILY[fam][1];
    const r = this.views.get(id)?.last?.r ?? 0.6;
    this.burst(x, y, color, big ? 2.5 : r, big ? 90 : 40);
    this.burst(x, y, 0xffe6b0, r * 0.5, 16);
    if (big || r >= 1) { this.flare(big ? 1 : 0.45, big ? 1.6 : 0.5); this.shake = Math.max(this.shake, big ? 0.35 : 0.1); }
  }

  // ---------- frame ----------

  update(dt) {
    this.onFrame?.(dt);
    this.stars.rotation.y += dt * 0.004;
    for (const f of this.fxList) {
      f.t += dt;
      const k = f.t / f.life;
      if (f.pts) {
        const a = f.pts.geometry.attributes.position;
        for (let i = 0; i < f.vel.length; i++) {
          const v = f.vel[i];
          v[0] *= Math.exp(-3 * dt); v[2] *= Math.exp(-3 * dt); v[1] -= 4 * dt;
          a.setXYZ(i, a.getX(i) + v[0] * dt, Math.max(-0.25, a.getY(i) + v[1] * dt), a.getZ(i) + v[2] * dt);
        }
        a.needsUpdate = true;
        f.pts.material.opacity = Math.max(0, 1 - k);
      }
      if (f.ring) {
        const s = f.shock ? 1 + k * f.size : 0.3 + k * (1.5 + f.size * 2);
        f.ring.scale.setScalar(s);
        f.ring.material.opacity = Math.max(0, 1 - k) * (f.shock ? 1 : 0.8);
      }
    }
    this.fxList = this.fxList.filter((f) => {
      if (f.t < f.life) return true;
      if (f.pts) { this.scene.remove(f.pts); f.pts.geometry.dispose(); f.pts.material.dispose(); }
      if (f.ring) { this.scene.remove(f.ring); f.ring.geometry.dispose(); f.ring.material.dispose(); }
      return false;
    });
  }

  draw() {
    // bloom always on for the lasers and cores; flares push it higher for a moment
    this.bloom.strength = 0.55 + 1.1 * this.fx;
    this.composer.render();
  }

  // the dial replaces the 3D hand: no hand model over the arena
  handAnchor() { return null; }
  setHand(frame, x, y) { if (frame) this.pointer = { x, y }; this.hand.hide(); }

  /** Logic point under a screen position (for mouse aiming). */
  logicAt(x, y) {
    const p = this.pointOnPlane(x, y, 0);
    return p ? { x: p.x, y: -p.z } : null;
  }

  /** Screen position of a logic point. */
  screenOf(x, y, h = 0) { return this.toScreen(x, h, -y); }
}

export { damp };
