// 주차장 탈출: the 3D board. A 6×6 wooden parking tray on the lamp-lit table with a gap in its
// right rim (the exit, behind a striped barrier arm), lacquered toy cars and trucks, bollards for
// walls. A picked-up car lifts and a rail lights the cells it can reach; the red car drives out
// through the raised barrier when the puzzle is solved. Cell (r, c) sits at world
// (c − 2.5, ·, r − 2.5): row 0 is the far side.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Stage, NO_GLOW, applyGlow, damp, easeInOutCubic, easeOutCubic, clamp } from './stage.js';
import { N, EXIT_ROW } from './parking-logic.js';

const TOP = 0.12;        // board surface height
const LIFT = 0.28;       // how high a held car rides
const COLORS = [0xe0a83a, 0x4a7fd6, 0x3f9f79, 0x8a6bd1, 0xd67f3e, 0x2f8fa6, 0xb8b04a, 0x6b8f3f, 0xa4577a, 0x5a6fa0, 0xc78f5a];
const TRUCKS = [0x6d5a8a, 0x3c6e8f, 0x8a6a3c, 0x4f7a5a];
// Kenney "Car Kit" (CC0): toy cars for two cells, trucks for three, a red one for A
const CAR_MODELS = ['sedan', 'taxi', 'police', 'suv', 'van', 'hatchback-sports', 'suv-luxury', 'truck', 'sedan'];
const TRUCK_MODELS = ['delivery', 'garbage-truck', 'firetruck', 'ambulance'];
const RED_MODEL = 'sedan-sports';
const MODEL_DIR = 'assets/models/cars/';
const X = (c) => c - (N - 1) / 2;
const Z = (r) => r - (N - 1) / 2;

function woodTexture(light, dark, lines = 60) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = light; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < lines; i++) {
    const y = Math.random() * 512;
    g.strokeStyle = dark; g.globalAlpha = 0.05 + Math.random() * 0.12; g.lineWidth = 1 + Math.random() * 3;
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 4);
    g.stroke();
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

class Car {
  constructor(car, i, models = null) {
    this.id = car.id;
    this.len = car.len;
    this.horiz = car.horiz;
    this.root = new THREE.Group();
    this.glow = NO_GLOW;
    this.offset = 0;
    const name = car.id === 'A' ? RED_MODEL : car.len === 3 ? TRUCK_MODELS[i % TRUCK_MODELS.length] : CAR_MODELS[i % CAR_MODELS.length];
    if (models?.[name]) { this.fromModel(models[name], car); return; }
    const red = car.id === 'A', truck = car.len === 3;
    const color = red ? 0xc9352f : truck ? TRUCKS[i % TRUCKS.length] : COLORS[i % COLORS.length];
    this.paint = new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.18 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.25, metalness: 0.2 });
    const L = car.len - 0.14, W = 0.8;
    // built along +x; the whole group turns for a vertical car
    const body = new THREE.Mesh(new RoundedBoxGeometry(L, 0.3, W, 3, 0.1), this.paint);
    body.position.y = 0.2;
    const parts = [body];
    if (truck) {
      const cab = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.28, W * 0.92, 3, 0.08), this.paint);
      cab.position.set(L / 2 - 0.4, 0.46, 0);
      const glass = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.2, W * 0.8, 2, 0.04), dark);
      glass.position.set(L / 2 - 0.1, 0.46, 0);
      const box = new THREE.Mesh(new RoundedBoxGeometry(L - 0.85, 0.42, W * 0.95, 3, 0.06), new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.6 }));
      box.position.set(-0.4, 0.5, 0);
      parts.push(cab, glass, box);
    } else {
      const cabin = new THREE.Mesh(new RoundedBoxGeometry(L * 0.55, 0.24, W * 0.84, 3, 0.09), dark);
      cabin.position.set(-0.05, 0.43, 0);
      const roof = new THREE.Mesh(new RoundedBoxGeometry(L * 0.4, 0.06, W * 0.76, 2, 0.03), this.paint);
      roof.position.set(-0.05, 0.56, 0);
      parts.push(cabin, roof);
    }
    // wheels peeking out under the body
    const wheelGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16);
    wheelGeo.rotateX(Math.PI / 2);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const w = new THREE.Mesh(wheelGeo, dark);
      w.position.set(sx * (L / 2 - 0.25), 0.1, sz * (W / 2 - 0.02));
      parts.push(w);
    }
    for (const m of parts) { m.castShadow = true; m.receiveShadow = true; m.userData.car = car.id; this.root.add(m); }
    this.body = body;
    this.mats = [this.paint];
    if (!car.horiz) this.root.rotation.y = -Math.PI / 2; // +x → +z (down the board)
  }

  /** A clone of a loaded model, turned to face +x and stretched to fill its cells. */
  fromModel(src, car) {
    const m = src.clone(true);
    this.mats = [];
    m.traverse((o) => {
      if (!o.isMesh) return;
      o.material = o.material.clone(); // each car glows on its own
      o.castShadow = true; o.receiveShadow = true;
      o.userData.car = car.id;
      this.mats.push(o.material);
    });
    // the kit's cars run along +z: turn them to +x, then fit length and width to the cells
    const holder = new THREE.Group();
    m.rotation.y = Math.PI / 2;
    holder.add(m);
    const box = new THREE.Box3().setFromObject(holder);
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const L = car.len - 0.1, W = 0.9;
    // tall vans and trucks are kept low, or from this angle they'd tower over the next row
    const sx = L / size.x, sz = W / size.z, sy = Math.min(Math.min(sx, sz) * 1.08, 0.72 / size.y);
    m.position.set(-c.x, -box.min.y, -c.z);
    holder.scale.set(sx, sy, sz);
    this.root.add(holder);
    this.paint = this.mats[0];
    // under the warm lamp the kit's red reads orange: push the red car redder
    if (car.id === 'A') for (const mat of this.mats) mat.color.setRGB(1.05, 0.48, 0.48);
    if (!car.horiz) this.root.rotation.y = -Math.PI / 2;
  }
}

/** Load the car models once; resolves to { name: scene } (empty if they can't be loaded). */
let modelsPromise = null;
export function loadCarModels() {
  if (modelsPromise) return modelsPromise;
  const loader = new GLTFLoader();
  const names = [...new Set([...CAR_MODELS, ...TRUCK_MODELS, RED_MODEL])];
  modelsPromise = Promise.all(names.map((n) => loader.loadAsync(`${MODEL_DIR}${n}.glb`).then((g) => [n, g.scene]).catch(() => [n, null])))
    .then((pairs) => Object.fromEntries(pairs.filter(([, s]) => s)));
  return modelsPromise;
}

export class ParkingScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.cars = new Map();
    this.held = null;
    this.hoverId = null;
    this.buildBoard();
    this.softenLight();
    this.start();
  }

  softenLight() {
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.scene.environmentIntensity = 0.5;
    const fill = new THREE.DirectionalLight(0xffe9cc, 0.6);
    fill.position.set(6, 5, 4);
    const front = new THREE.DirectionalLight(0xfff4e4, 0.3);
    front.position.set(0, 3, 9);
    this.scene.add(fill, front);
    this.setLampScale(4.6);
  }

  buildBoard() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(N + 0.1, TOP, N + 0.1), new THREE.MeshStandardMaterial({ map: woodTexture('#c99c63', '#6b4526'), roughness: 0.62 }));
    base.position.y = TOP / 2; base.receiveShadow = true; base.castShadow = true;
    g.add(base);
    // grooves between the cells
    const grooveMat = new THREE.MeshBasicMaterial({ color: 0x5a3a20, transparent: true, opacity: 0.45 });
    for (let i = 1; i < N; i++) {
      const a = new THREE.Mesh(new THREE.PlaneGeometry(0.025, N), grooveMat);
      a.rotation.x = -Math.PI / 2; a.position.set(i - N / 2, TOP + 0.001, 0);
      const b = new THREE.Mesh(new THREE.PlaneGeometry(N, 0.025), grooveMat);
      b.rotation.x = -Math.PI / 2; b.position.set(0, TOP + 0.001, i - N / 2);
      g.add(a, b);
    }
    // the rim, with the exit gap on the right of the exit row
    const rimMat = new THREE.MeshStandardMaterial({ map: woodTexture('#7a5031', '#3c2414', 40), roughness: 0.55 });
    const rim = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.36, d), rimMat); m.position.set(x, 0.18, z); m.castShadow = m.receiveShadow = true; g.add(m); };
    const R = 0.34, H = N / 2 + R / 2;
    rim(N + 2 * R, R, 0, -H);
    rim(N + 2 * R, R, 0, H);
    rim(R, N, -H, 0);
    const gapTop = Z(EXIT_ROW) - 0.5, gapBottom = Z(EXIT_ROW) + 0.5;
    rim(R, gapTop + N / 2, H, (-N / 2 + gapTop) / 2);
    rim(R, N / 2 - gapBottom, H, (gapBottom + N / 2) / 2);
    // the road out, and the barrier arm across it
    const road = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 1), new THREE.MeshStandardMaterial({ color: 0x3a3632, roughness: 0.9 }));
    road.position.set(H + 1.1, 0.02, Z(EXIT_ROW)); road.receiveShadow = true;
    g.add(road);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5 }));
    post.position.set(H + 0.35, 0.25, Z(EXIT_ROW) - 0.62); post.castShadow = true;
    g.add(post);
    const armTex = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 8; const x = c.getContext('2d'); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#f2efe8' : '#c9352f'; x.fillRect(i * 16, 0, 16, 8); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), new THREE.MeshStandardMaterial({ map: armTex, roughness: 0.4 }));
    arm.position.set(0, 0, 0.6); arm.castShadow = true;
    const pivot = new THREE.Group();
    pivot.position.set(H + 0.35, 0.46, Z(EXIT_ROW) - 0.62);
    pivot.add(arm);
    g.add(pivot);
    this.barrier = pivot;
    // exit arrow painted on the road
    const arrow = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.26), new THREE.MeshBasicMaterial({ color: 0xcdb27a, transparent: true, opacity: 0.55, map: (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 32; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(4, 10); x.lineTo(40, 10); x.lineTo(40, 2); x.lineTo(60, 16); x.lineTo(40, 30); x.lineTo(40, 22); x.lineTo(4, 22); x.fill(); return new THREE.CanvasTexture(c); })() }));
    arrow.rotation.x = -Math.PI / 2; arrow.position.set(H + 1.3, 0.045, Z(EXIT_ROW));
    g.add(arrow);
    this.scene.add(g);
    this.board = g;
    // the rail under a held car
    this.rail = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.34), new THREE.MeshBasicMaterial({ color: 0xe0b45a, transparent: true, opacity: 0.32, depthWrite: false }));
    this.rail.rotation.x = -Math.PI / 2; this.rail.visible = false;
    this.scene.add(this.rail);
    // hint arrow
    this.hintArrow = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), new THREE.MeshBasicMaterial({ color: 0x2fae7f, transparent: true, opacity: 0.8, depthWrite: false, map: arrow.material.map }));
    this.hintArrow.rotation.x = -Math.PI / 2; this.hintArrow.visible = false;
    this.scene.add(this.hintArrow);
    this.bollards = [];
  }

  // ---------- a position ----------

  /** Build the cars (and bollards) for a position. */
  setPosition(pos) {
    for (const c of this.cars.values()) this.scene.remove(c.root);
    this.cars.clear();
    for (const b of this.bollards) this.scene.remove(b);
    this.bollards = [];
    pos.cars.forEach((car, i) => {
      const o = new Car(car, i, this.models);
      this.cars.set(car.id, o);
      this.scene.add(o.root);
    });
    for (const [r, c] of pos.walls) {
      const b = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.42, 20), new THREE.MeshStandardMaterial({ color: 0x3a3129, roughness: 0.5 }));
      post.position.y = TOP + 0.21;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.07, 20), new THREE.MeshStandardMaterial({ color: 0xd6a23e, roughness: 0.4 }));
      cap.position.y = TOP + 0.44;
      for (const m of [post, cap]) { m.castShadow = true; b.add(m); }
      b.position.set(X(c), 0, Z(r));
      this.scene.add(b);
      this.bollards.push(b);
    }
    this.barrier.rotation.x = 0;
    this.sync(pos, true);
  }

  /** Where a car's centre sits for its grid place. */
  carCentre(car, extra = 0) {
    const along = (car.horiz ? car.c : car.r) + extra + (car.len - 1) / 2;
    return car.horiz ? new THREE.Vector3(X(along), TOP, Z(car.r)) : new THREE.Vector3(X(car.c), TOP, Z(along));
  }

  /** Move every car to its place in pos (gliding unless instant). */
  sync(pos, instant = false) {
    for (const car of pos.cars) {
      const o = this.cars.get(car.id);
      if (!o || o === this.held?.o) continue;
      const to = this.carCentre(car);
      if (instant || o.root.position.distanceTo(to) < 1e-3) { o.root.position.copy(to); continue; }
      const from = o.root.position.clone();
      this.tween({ dur: 0.22, update: (k) => o.root.position.lerpVectors(from, to, easeOutCubic(k)) });
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

  /** The red car drives out: the barrier lifts, the car rolls off down the road. */
  driveOut(done) {
    const o = this.cars.get('A');
    const bar = this.barrier;
    this.tween({ dur: 0.45, update: (k) => { bar.rotation.x = -easeInOutCubic(k) * 1.35; } });
    const from = o.root.position.clone(), to = from.clone().add(new THREE.Vector3(4.2, 0, 0));
    this.tween({ dur: 1.1, delay: 0.3, update: (k) => { o.root.position.lerpVectors(from, to, k * k); }, done });
    this.flare(0.35, 1.2);
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
    const dist = Math.max(hw / (tanV * aspect * 0.8), (hd * Math.sin(el) + 0.8) / (tanV * 0.7), 8);
    this.camera.position.set(0.5, Math.sin(el) * dist, Math.cos(el) * dist + 0.2);
    this.camera.lookAt(0.5, 0, 0.35);
  }

  // ---------- frame ----------

  update(dt, wave) {
    const h = this.held;
    if (h) {
      const to = this.carCentre(h.car, h.offset);
      to.y += LIFT;
      h.o.root.position.lerp(to, damp(24, dt));
    }
    for (const o of this.cars.values()) for (const m of o.mats) if (m.emissive) applyGlow(m, o.glow, wave, 0.6);
    if (this.hintArrow.visible) this.hintArrow.material.opacity = 0.55 + 0.3 * wave;
  }

  handAnchor() {
    if (this.held) { const p = this.held.o.root.position; return new THREE.Vector3(p.x, p.y + 0.6, p.z); }
    return this.pointOnPlane(this.pointer.x, this.pointer.y, 1.0);
  }
  handGlow() { return this.held ? { color: 0x3f7fe6, intensity: 0.16 } : this.hoverId ? { color: 0xe0a83a, intensity: 0.14 } : NO_GLOW; }
}
