// 주차장 탈출: the 3D board, modelled on the real puzzle — a pale grey plastic tray with a
// raised tile for every cell, a rounded rim with the exit cut into the right of the third row, a
// challenge card in the drawer at the front, and glossy moulded plastic cars (hood, windscreen,
// roof, boot) and trucks (cab and ribbed box). A picked-up car lifts and a rail lights the cells
// it can reach; the red car drives out through the exit when the puzzle is solved.
// Cell (r, c) sits at world (c − 2.5, ·, r − 2.5): row 0 is the far side.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Stage, NO_GLOW, applyGlow, damp, easeInOutCubic, easeOutCubic, clamp } from './stage.js';
import { N, EXIT_ROW } from './parking-logic.js';

const TOP = 0.16;        // tile surface height
const LIFT = 0.28;       // how high a held car rides
// the real set's colours: only the escape car is red
const CAR_COLORS = [0x8fd46a, 0xf08a24, 0x2bc3c9, 0xf28fb8, 0x1f3f9e, 0x7b4fc2, 0xc6d12b, 0x2a2a2e, 0xe8d3a8, 0x5c7a2c, 0x7a4a2a];
const TRUCK_COLORS = [0xf2c21b, 0x8a5ad0, 0x2f63d8, 0x22a58f];
const RED = 0xd8231c;
const X = (c) => c - (N - 1) / 2;
const Z = (r) => r - (N - 1) / 2;

// ---------- plastics ----------

const trayPlastic = () => new THREE.MeshPhysicalMaterial({ color: 0xd4d7d6, roughness: 0.42, clearcoat: 0.25, clearcoatRoughness: 0.3 });
const tilePlastic = () => new THREE.MeshPhysicalMaterial({ color: 0xe2e4e2, roughness: 0.38, clearcoat: 0.3, clearcoatRoughness: 0.25 });
const carPlastic = (color) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.08, envMapIntensity: 1.1 });

function rounded(w, h, d, mat, radius = 0.05) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, radius), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// a soft dark blot under each car: the contact shadow that grounds it
const BLOT = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,0.9)'); grd.addColorStop(0.55, 'rgba(0,0,0,0.5)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();

// ---------- moulded vehicles ----------

/**
 * A car body from its side profile, extruded across its width with rounded edges: bumper,
 * hood, windscreen, roof, rear window, boot. Built along +x (the front), y up.
 */
function carBodyGeometry(L, W) {
  const h = L / 2, s = new THREE.Shape();
  const pts = [
    [-h, 0.07], [h, 0.07], [h, 0.24], [h - 0.1, 0.3], [0.3, 0.31], [0.06, 0.5],
    [-0.36, 0.5], [-0.58, 0.31], [-h + 0.08, 0.3], [-h, 0.24],
  ];
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  const bevel = 0.05;
  const g = new THREE.ExtrudeGeometry(s, { depth: W - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 4 });
  g.translate(0, 0, -(W - 2 * bevel) / 2);
  return g;
}

class Car {
  constructor(car, i) {
    this.id = car.id;
    this.len = car.len;
    this.horiz = car.horiz;
    this.root = new THREE.Group();
    this.glow = NO_GLOW;
    this.offset = 0;
    this.blot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: BLOT, transparent: true, depthWrite: false, opacity: 0.5 }));
    this.blot.rotation.x = -Math.PI / 2;
    this.blot.scale.set(car.horiz ? car.len + 0.2 : 1.1, car.horiz ? 1.1 : car.len + 0.2, 1);
    this.blot.renderOrder = 1;

    const truck = car.len === 3;
    const color = car.id === 'A' ? RED : truck ? TRUCK_COLORS[i % TRUCK_COLORS.length] : CAR_COLORS[i % CAR_COLORS.length];
    this.paint = carPlastic(color);
    this.mats = [this.paint];
    const L = car.len - 0.12, W = 0.8;
    const parts = [];
    // moulded-in details are just darker plastic of the same colour
    const shade = carPlastic(new THREE.Color(color).multiplyScalar(0.55));
    this.mats.push(shade);
    if (truck) {
      // cab up front…
      const cab = new THREE.Mesh(carBodyGeometry(0.95, W), this.paint);
      cab.scale.set(1, 1.05, 1);
      cab.position.x = L / 2 - 0.475;
      parts.push(cab);
      // …and a tall box behind it, ribbed along its sides and top
      const boxL = L - 0.98, box = rounded(boxL, 0.5, W, this.paint, 0.06);
      box.position.set(-L / 2 + boxL / 2, 0.33, 0);
      parts.push(box);
      for (let k = 1; k < 7; k++) {
        const rib = rounded(0.035, 0.52, W + 0.025, shade, 0.012);
        rib.position.set(-L / 2 + (k * boxL) / 7, 0.33, 0);
        parts.push(rib);
      }
      const chassis = rounded(L, 0.1, W * 0.94, shade, 0.03);
      chassis.position.y = 0.1;
      parts.push(chassis);
    } else {
      parts.push(new THREE.Mesh(carBodyGeometry(L, W), this.paint));
    }
    // wheel arches: dark discs set into the sides
    const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, W + 0.02, 20);
    wheelGeo.rotateX(Math.PI / 2);
    const tyre = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.7 });
    const ax = L / 2 - (truck ? 0.3 : 0.32);
    for (const sx of truck ? [-1, -0.45, 1] : [-1, 1]) {
      const w = new THREE.Mesh(wheelGeo, tyre);
      w.position.set(sx * ax, 0.1, 0);
      parts.push(w);
    }
    for (const m of parts) { m.castShadow = true; m.receiveShadow = true; m.userData.car = car.id; this.root.add(m); }
    if (!car.horiz) this.root.rotation.y = -Math.PI / 2; // +x → +z (down the board)
  }
}

/** The challenge card in the drawer: the puzzle's layout, like the printed cards of the real set. */
function cardTexture(pos, label, best) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 360;
  const g = c.getContext('2d');
  g.fillStyle = '#f7f6f1'; g.fillRect(0, 0, 512, 360);
  g.fillStyle = '#d8231c'; g.fillRect(0, 0, 512, 54);
  g.fillStyle = '#fff'; g.font = 'bold 30px sans-serif'; g.fillText('주차장 탈출', 22, 38);
  g.font = 'bold 26px sans-serif'; g.textAlign = 'right'; g.fillText(label, 490, 38); g.textAlign = 'left';
  const S = 44, ox = 124, oy = 72;
  g.fillStyle = '#c9ccca'; g.fillRect(ox - 8, oy - 8, S * 6 + 16, S * 6 + 16);
  g.fillStyle = '#e6e8e6';
  for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) g.fillRect(ox + q * S + 2, oy + r * S + 2, S - 4, S - 4);
  pos.cars.forEach((car, i) => {
    const truck = car.len === 3;
    const col = car.id === 'A' ? RED : truck ? TRUCK_COLORS[i % TRUCK_COLORS.length] : CAR_COLORS[i % CAR_COLORS.length];
    g.fillStyle = '#' + new THREE.Color(col).getHexString();
    const w = car.horiz ? car.len : 1, h = car.horiz ? 1 : car.len;
    g.beginPath(); g.roundRect(ox + car.c * S + 4, oy + car.r * S + 4, w * S - 8, h * S - 8, 8); g.fill();
  });
  g.fillStyle = '#9a9d9b';
  g.beginPath(); g.moveTo(ox + 6 * S + 10, oy + 2.5 * S - 10); g.lineTo(ox + 6 * S + 26, oy + 2.5 * S); g.lineTo(ox + 6 * S + 10, oy + 2.5 * S + 10); g.fill();
  g.fillStyle = '#555'; g.font = '20px sans-serif'; g.fillText(`최소 ${best}수`, 22, 340);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export class ParkingScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.cars = new Map();
    this.held = null;
    this.hoverId = null;
    this.buildBoard();
    this.softenLight();
    this.lightDesk();
    this.start();
  }

  /**
   * Studio lighting: a photo-studio HDRI (Poly Haven "Studio Small 09", CC0) lights the scene
   * and is what the clear coat reflects — its softboxes give the long highlights on the paint.
   * The table lamp stays only as a faint key for soft contact shadows; the stage's rim and
   * bounce lights go.
   */
  softenLight() {
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.setLampScale(4.6);
    this.keyLight.intensity *= 0.3;
    this.keyLight.position.set(-1.6, 11, 2.4); // nearly overhead: short shadows that don't hide the next car
    this.keyLight.target.position.set(0.3, 0, 0);
    this.keyLight.angle = 0.75;
    this.keyLight.color.set(0xffffff);
    this.keyLight.penumbra = 1;
    this.lights.rim.intensity = 0;
    this.lights.bounce.intensity = 0;
    // Neutral tone mapping keeps the paint's colour and contrast (ACES flattened it to haze), no
    // fog in a studio, and a little less ambient so the key's shadows give the cars their shape
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.scene.fog = null;
    this.scene.environmentIntensity = 0.75;
    new RGBELoader().load('assets/hdri/studio_small_09_1k.hdr', (hdr) => {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromEquirectangular(hdr).texture;
      this.scene.environmentRotation = new THREE.Euler(0, 0.9, 0); // softboxes up and to the left, like the lamp
      hdr.dispose();
      pmrem.dispose();
    });
  }

  /**
   * The tray sits on a pale matte desk, as in photos of the real game. The desk is lightest under
   * the tray and darkens towards the edges of the view, so the HUD in the corners stays readable.
   */
  lightDesk() {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(512, 512, 0, 512, 512, 512);
    // the plane is 90 units across: the light patch is ~14 units wide, fading out by ~40
    grd.addColorStop(0, '#d9d3c8'); grd.addColorStop(0.1, '#cfc8bb'); grd.addColorStop(0.2, '#6f6a62');
    grd.addColorStop(0.32, '#1c1a17'); grd.addColorStop(0.45, '#0d0c0a'); grd.addColorStop(1, '#0d0c0a');
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.table.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, envMapIntensity: 0.4 });
    this.table.position.y = -0.002;
  }

  buildBoard() {
    const g = new THREE.Group();
    const tray = trayPlastic(), tile = tilePlastic();
    // the tray floor, a raised tile for every cell, and the rounded rim with the exit
    const floor = rounded(N + 0.2, 0.1, N + 0.2, tray, 0.03);
    floor.position.y = 0.05;
    g.add(floor);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const t = rounded(0.9, 0.07, 0.9, tile, 0.025);
      t.position.set(X(c), TOP - 0.035, Z(r));
      g.add(t);
    }
    const R = 0.38, H = N / 2 + R / 2 + 0.05, RH = 0.34;
    const rim = (w, d, x, z) => { const m = rounded(w, RH, d, tray, 0.08); m.position.set(x, RH / 2, z); g.add(m); };
    rim(N + 2 * R + 0.1, R, 0, -H);
    rim(N + 2 * R + 0.1, R, 0, H);
    rim(R, N + 0.1, -H, 0);
    const gapTop = Z(EXIT_ROW) - 0.52, gapBottom = Z(EXIT_ROW) + 0.52;
    rim(R, gapTop + N / 2 + 0.05, H, (-N / 2 - 0.05 + gapTop) / 2);
    rim(R, N / 2 + 0.05 - gapBottom, H, (gapBottom + N / 2 + 0.05) / 2);
    // the exit: a short ramp out through the gap
    const ramp = rounded(1.1, 0.1, 1.04, tray, 0.03);
    ramp.position.set(N / 2 + 0.5, 0.05, Z(EXIT_ROW));
    g.add(ramp);
    // the drawer at the front with this puzzle's card in it
    const drawer = rounded(3.2, 0.14, 1.25, tray, 0.05);
    drawer.position.set(0, 0.07, H + 0.95);
    g.add(drawer);
    this.card = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.04), new THREE.MeshStandardMaterial({ roughness: 0.6 }));
    this.card.rotation.x = -Math.PI / 2 + 0.55; // leaning back in its slot
    this.card.position.set(0, 0.5, H + 0.9);
    this.card.scale.setScalar(0.52);
    this.card.castShadow = true;
    g.add(this.card);
    this.scene.add(g);
    this.board = g;
    // the rail under a held car
    this.rail = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.3), new THREE.MeshBasicMaterial({ color: 0xe0b45a, transparent: true, opacity: 0.45, depthWrite: false }));
    this.rail.rotation.x = -Math.PI / 2; this.rail.visible = false;
    this.scene.add(this.rail);
    // hint arrow
    const arrowTex = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 32; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(4, 10); x.lineTo(40, 10); x.lineTo(40, 2); x.lineTo(60, 16); x.lineTo(40, 30); x.lineTo(40, 22); x.lineTo(4, 22); x.fill(); return new THREE.CanvasTexture(c); })();
    this.hintArrow = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), new THREE.MeshBasicMaterial({ color: 0x2fae7f, transparent: true, opacity: 0.8, depthWrite: false, map: arrowTex }));
    this.hintArrow.rotation.x = -Math.PI / 2; this.hintArrow.visible = false;
    this.scene.add(this.hintArrow);
    this.bollards = [];
  }

  /** Print this puzzle on the card in the drawer. */
  setCard(pos, label, best) {
    this.card.material.map?.dispose();
    this.card.material.map = cardTexture(pos, label, best);
    this.card.material.needsUpdate = true;
  }

  // ---------- a position ----------

  /** Build the cars (and bollards) for a position. */
  setPosition(pos) {
    for (const c of this.cars.values()) { this.scene.remove(c.root); this.scene.remove(c.blot); }
    this.cars.clear();
    for (const b of this.bollards) this.scene.remove(b);
    this.bollards = [];
    pos.cars.forEach((car, i) => {
      const o = new Car(car, i);
      this.cars.set(car.id, o);
      this.scene.add(o.root, o.blot);
    });
    for (const [r, c] of pos.walls) {
      const b = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.42, 20), new THREE.MeshPhysicalMaterial({ color: 0x55585c, roughness: 0.35, clearcoat: 0.5 }));
      post.position.y = TOP + 0.21;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.07, 20), new THREE.MeshStandardMaterial({ color: 0xd6a23e, roughness: 0.4 }));
      cap.position.y = TOP + 0.44;
      for (const m of [post, cap]) { m.castShadow = true; b.add(m); }
      b.position.set(X(c), 0, Z(r));
      this.scene.add(b);
      this.bollards.push(b);
    }
    this.sync(pos, true);
  }

  /** Where a car's centre sits for its grid place. */
  carCentre(car, extra = 0) {
    const along = (car.horiz ? car.c : car.r) + extra + (car.len - 1) / 2;
    return car.horiz ? new THREE.Vector3(X(along), TOP, Z(car.r)) : new THREE.Vector3(X(car.c), TOP, Z(along));
  }

  /** Move every car to its place in pos (gliding unless instant). */
  sync(pos, instant = false, dur = 0.22) {
    for (const car of pos.cars) {
      const o = this.cars.get(car.id);
      if (!o || o === this.held?.o) continue;
      const to = this.carCentre(car);
      if (instant || o.root.position.distanceTo(to) < 1e-3) { o.root.position.copy(to); continue; }
      const from = o.root.position.clone();
      this.tween({ dur, update: (k) => o.root.position.lerpVectors(from, to, dur > 0.3 ? easeInOutCubic(k) : easeOutCubic(k)) });
    }
  }

  // ---------- holding ----------

  /** Pick a car up: it lifts and its rail lights up over [back, fwd] cells. */
  hold(car, range) {
    const o = this.cars.get(car.id);
    this.held = { o, car, range, offset: 0 };
    const along = (car.horiz ? car.c : car.r);
    const a = along - range.back, b = along + car.len - 1 + range.fwd;
    const mid = (a + b) / 2, len = b - a + 1;
    this.rail.scale.set(len - 0.1, 1, 1);
    this.rail.rotation.set(-Math.PI / 2, 0, car.horiz ? 0 : Math.PI / 2);
    this.rail.position.set(car.horiz ? X(mid) : X(car.c), TOP + 0.004, car.horiz ? Z(car.r) : Z(mid));
    this.rail.visible = true;
    this.clearHint();
  }

  /** Slide the held car to a live offset (cells, fractional), already clamped to its range. */
  dragTo(offset) {
    const h = this.held;
    if (!h) return;
    // near a cell boundary it pulls in, like a magnet
    const near = Math.round(offset);
    h.offset = Math.abs(offset - near) < 0.18 ? near + (offset - near) * 0.4 : offset;
  }

  /** Put the held car down; returns the whole-cell move it ended on. */
  release() {
    const h = this.held;
    if (!h) return 0;
    this.held = null;
    this.rail.visible = false;
    const d = Math.round(h.offset);
    const o = h.o, from = o.root.position.clone(), to = this.carCentre(h.car, d);
    this.tween({ dur: 0.18, update: (k) => { o.root.position.lerpVectors(from, to, easeOutCubic(k)); } });
    return d;
  }

  // ---------- hints, solving ----------

  showHint(car, d) {
    const along = (car.horiz ? car.c : car.r) + (d > 0 ? car.len - 1 + 0.9 : -0.9);
    const p = car.horiz ? new THREE.Vector3(X(along), TOP + 0.02, Z(car.r)) : new THREE.Vector3(X(car.c), TOP + 0.02, Z(along));
    this.hintArrow.position.copy(p);
    const dir = car.horiz ? (d > 0 ? 0 : Math.PI) : (d > 0 ? -Math.PI / 2 : Math.PI / 2);
    this.hintArrow.rotation.set(-Math.PI / 2, 0, dir);
    this.hintArrow.visible = true;
    this.setGlow(car.id, { color: 0x2fae7f, intensity: 0.5, pulse: true });
  }
  clearHint() { this.hintArrow.visible = false; for (const o of this.cars.values()) if (o.glow.color === 0x2fae7f) o.glow = NO_GLOW; }

  setGlow(id, glow) { const o = this.cars.get(id); if (o) o.glow = glow ?? NO_GLOW; }

  /** The red car drives out through the exit and off the tray. */
  driveOut(done) {
    const o = this.cars.get('A');
    const from = o.root.position.clone(), to = from.clone().add(new THREE.Vector3(3.2, 0, 0));
    this.tween({ dur: 0.9, update: (k) => { o.root.position.lerpVectors(from, to, k * k); }, done });
    this.flare(0.3, 1.2);
  }

  // ---------- pointer ----------

  /** The car under a screen point: the mesh hit, else the nearest car centre with a tall upward reach. */
  carAt(x, y, ids) {
    this.ray(x, y);
    const meshes = ids.map((id) => this.cars.get(id)?.root).filter(Boolean);
    const hit = this.raycaster.intersectObjects(meshes, true)[0];
    if (hit) return hit.object.userData.car;
    let best = null, bd = 1;
    for (const id of ids) {
      const o = this.cars.get(id);
      const p = o.root.position, s = this.toScreen(p.x, p.y + 0.3, p.z);
      const dy = y - s.y;
      const d = Math.hypot((x - s.x) / 80, dy / (dy < 0 ? 140 : 80));
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  }

  /** Table point (world x, z) under a screen position, at the held car's height. */
  planeAt(x, y) {
    const p = this.pointOnPlane(x, y, TOP + LIFT + 0.2);
    return p ? { x: p.x, z: p.z } : null;
  }

  // ---------- camera ----------

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(60);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const hw = N / 2 + 1.6, hd = N / 2 + 0.6;
    // a tall window: fill more of its width, and aim above the board so it sits low, in the
    // space under the HUD instead of behind it
    const tall = aspect < 0.9;
    const dist = Math.max(hw / (tanV * aspect * (tall ? 0.94 : 0.8)), (hd * Math.sin(el) + 0.8) / (tanV * 0.7), 8);
    const lift = tall ? dist * tanV * 0.28 : 0;
    this.camera.position.set(0.5, Math.sin(el) * dist, Math.cos(el) * dist + 0.2 - lift);
    this.camera.lookAt(0.5, 0, 0.35 - lift);
  }

  // ---------- frame ----------

  update(dt, wave) {
    const h = this.held;
    if (h) {
      const to = this.carCentre(h.car, h.offset);
      to.y += LIFT;
      h.o.root.position.lerp(to, damp(24, dt));
    }
    for (const o of this.cars.values()) {
      for (const m of o.mats) if (m.emissive) applyGlow(m, o.glow, wave, 0.6);
      const p = o.root.position;
      o.blot.position.set(p.x, TOP + 0.003, p.z);
      o.blot.material.opacity = 0.55 * clamp(1 - (p.y - TOP) / 0.35, 0.25, 1);
    }
    if (this.hintArrow.visible) this.hintArrow.material.opacity = 0.55 + 0.3 * wave;
  }

  handAnchor() {
    if (this.held) { const p = this.held.o.root.position; return new THREE.Vector3(p.x, p.y + 0.6, p.z); }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, 1.0);
  }
  handGlow() { return this.held ? { color: 0x3f7fe6, intensity: 0.16 } : this.hoverId ? { color: 0xe0a83a, intensity: 0.14 } : NO_GLOW; }
}
