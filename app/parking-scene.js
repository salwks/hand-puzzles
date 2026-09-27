// 주차장 탈출: the 3D board. A 6×6 wooden parking tray on the lamp-lit table with a gap in its
// right rim (the exit, behind a striped barrier arm), lacquered toy cars and trucks, bollards for
// walls. A picked-up car lifts and a rail lights the cells it can reach; the red car drives out
// through the raised barrier when the puzzle is solved. Cell (r, c) sits at world
// (c − 2.5, ·, r − 2.5): row 0 is the far side.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Stage, NO_GLOW, applyGlow, damp, easeInOutCubic, easeOutCubic, clamp } from './stage.js';
import { N, EXIT_ROW } from './parking-logic.js';

const TOP = 0.12;        // board surface height
const LIFT = 0.28;       // how high a held car rides
// stains for the wooden cars: clear, saturated colours, none of them red (only the car to get
// out is red)
const STAINS = [0xe8b020, 0x2f6fd8, 0x2f9e6a, 0x7a52c8, 0x1e9bb0, 0xe07a1c, 0x5a6fa8, 0x9ab52a, 0xc2439a, 0x3b3f58];
const TRUCK_STAINS = [0x2f6fd8, 0x2f9e6a, 0xe8b020, 0x7a52c8];
const RED = 0xd8231c;
const X = (c) => c - (N - 1) / 2;
const Z = (r) => r - (N - 1) / 2;

// ---------- real wood (Poly Haven, CC0): colour, normal and roughness maps ----------

const texLoader = new THREE.TextureLoader();
function woodMaterial(name, { tint = 0xffffff, rough = 1, normal = 1, clearcoat = 0 } = {}) {
  const dir = 'assets/textures/wood/';
  const load = (m, srgb) => {
    const t = texLoader.load(`${dir}${name}_${m}_1k.jpg`);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return new THREE.MeshPhysicalMaterial({
    map: load('diff', true), normalMap: load('nor_gl', false), roughnessMap: load('rough', false),
    color: tint, roughness: rough, normalScale: new THREE.Vector2(normal, normal),
    clearcoat, clearcoatRoughness: 0.25,
  });
}

/**
 * A rounded wooden block whose texture keeps real-world scale on every face (the grain doesn't
 * stretch along a long rim): UVs are projected from the block's size, `scale` metres per repeat.
 */
function woodBlock(w, h, d, material, { radius = 0.03, scale = 2.2, grainAlongZ = false } = {}) {
  const g = new RoundedBoxGeometry(w, h, d, 3, radius);
  const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const ax = Math.abs(nor.getX(i)), ay = Math.abs(nor.getY(i)), az = Math.abs(nor.getZ(i));
    let u, v;
    if (ay >= ax && ay >= az) { u = grainAlongZ ? z : x; v = grainAlongZ ? x : z; }
    else if (ax >= az) { u = z; v = y; }
    else { u = x; v = y; }
    uv.setXY(i, u / scale + 0.37, v / scale + 0.61);
  }
  uv.needsUpdate = true;
  const m = new THREE.Mesh(g, material);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// a soft dark blot under each car: the contact shadow that grounds it (cheap ambient occlusion)
const BLOT = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,0.9)'); grd.addColorStop(0.55, 'rgba(0,0,0,0.5)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();

// ---------- wooden toy cars ----------

/** A grey version of the oak grain, for stains: tinting it gives a pure colour with the grain showing. */
let stainGrain = null;
function grainTexture() {
  if (stainGrain) return stainGrain;
  const img = new Image();
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  stainGrain = new THREE.CanvasTexture(c);
  stainGrain.colorSpace = THREE.SRGBColorSpace;
  stainGrain.wrapS = stainGrain.wrapT = THREE.RepeatWrapping;
  stainGrain.anisotropy = 8;
  img.onload = () => {
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0, 512, 512);
    const d = g.getImageData(0, 0, 512, 512), px = d.data;
    for (let k = 0; k < px.length; k += 4) {
      const l = (0.3 * px[k] + 0.59 * px[k + 1] + 0.11 * px[k + 2]) / 255;
      const v = Math.round(255 * (0.72 + 0.34 * (l - 0.55))); // light, with the grain kept faint
      px[k] = px[k + 1] = px[k + 2] = Math.max(0, Math.min(255, v));
    }
    g.putImageData(d, 0, 0);
    stainGrain.needsUpdate = true;
  };
  img.src = 'assets/textures/wood/oak_veneer_01_diff_1k.jpg';
  return stainGrain;
}
let woodNormal = null;
function oakNormal() {
  if (!woodNormal) {
    woodNormal = texLoader.load('assets/textures/wood/oak_veneer_01_nor_gl_1k.jpg');
    woodNormal.wrapS = woodNormal.wrapT = THREE.RepeatWrapping;
  }
  return woodNormal;
}
const stained = (color) => new THREE.MeshPhysicalMaterial({
  map: grainTexture(), normalMap: oakNormal(), normalScale: new THREE.Vector2(0.35, 0.35),
  color, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.35, // satin lacquer over the stain
});
let natural = null, darkWood = null;

class Car {
  constructor(car, i) {
    this.id = car.id;
    this.len = car.len;
    this.horiz = car.horiz;
    this.root = new THREE.Group();
    this.glow = NO_GLOW;
    this.offset = 0;
    this.blot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: BLOT, transparent: true, depthWrite: false, opacity: 0.55 }));
    this.blot.rotation.x = -Math.PI / 2;
    this.blot.scale.set(car.horiz ? car.len + 0.25 : 1.2, car.horiz ? 1.2 : car.len + 0.25, 1);
    this.blot.renderOrder = 1;

    // raw wood on the cars is oiled to a honey tone, so it stands apart from the pale floor
    natural ??= woodMaterial('oak_veneer_01', { tint: 0xc98f52, rough: 0.8, normal: 0.5, clearcoat: 0.3 });
    darkWood ??= woodMaterial('wood_table_001', { rough: 0.7, normal: 0.6, clearcoat: 0.3 });
    const truck = car.len === 3;
    const color = car.id === 'A' ? RED : truck ? TRUCK_STAINS[i % TRUCK_STAINS.length] : STAINS[i % STAINS.length];
    this.paint = stained(color);
    this.mats = [this.paint];

    const L = car.len - 0.16, W = 0.78, WHEEL = 0.12;
    const parts = [];
    const block = (w, h, d, mat, x, y, radius = 0.06) => { const m = woodBlock(w, h, d, mat, { radius, scale: 1.4 }); m.position.set(x, y, 0); parts.push(m); return m; };
    if (truck) {
      // painted cab up front, a natural wooden cargo box behind it on a painted chassis
      block(L, 0.16, W, this.paint, 0, WHEEL + 0.1);
      block(0.72, 0.3, W * 0.96, this.paint, L / 2 - 0.36, WHEEL + 0.33);
      block(0.26, 0.18, W * 0.8, natural, L / 2 - 0.5, WHEEL + 0.46, 0.05); // cab roof block, raw wood
      const load = stained(new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.45)); // the box in a lighter wash of the cab's colour
      this.mats.push(load);
      block(L - 0.84, 0.46, W * 0.98, load, -0.38, WHEEL + 0.41, 0.05);
    } else {
      // a stained body with rounded ends and a raw-wood cabin on top, set back a little
      block(L, 0.24, W, this.paint, 0, WHEEL + 0.14, 0.09);
      block(L * 0.5, 0.2, W * 0.86, natural, -L * 0.06, WHEEL + 0.35, 0.07);
    }
    // four turned wooden wheels on dowel axles
    const wheelGeo = new THREE.CylinderGeometry(WHEEL, WHEEL, 0.07, 24);
    wheelGeo.rotateX(Math.PI / 2);
    const capGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.09, 12);
    capGeo.rotateX(Math.PI / 2);
    const ax = L / 2 - (truck ? 0.34 : 0.26);
    for (const sx of truck ? [-1, 0, 1] : [-1, 1]) for (const sz of [-1, 1]) {
      const w = new THREE.Mesh(wheelGeo, darkWood);
      w.position.set(sx * ax, WHEEL, sz * (W / 2 + 0.02));
      const cap = new THREE.Mesh(capGeo, natural);
      cap.position.set(sx * ax, WHEEL, sz * (W / 2 + 0.04));
      parts.push(w, cap);
    }
    for (const m of parts) { m.castShadow = true; m.receiveShadow = true; m.userData.car = car.id; this.root.add(m); }
    if (!car.horiz) this.root.rotation.y = -Math.PI / 2; // +x → +z (down the board)
  }
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

  buildBoard() {
    const g = new THREE.Group();
    // the tray floor: light oak veneer, satin
    const oak = woodMaterial('oak_veneer_01', { rough: 0.9, normal: 0.6, clearcoat: 0.25 });
    const base = woodBlock(N + 0.1, TOP, N + 0.1, oak, { radius: 0.02, scale: 3.2 });
    base.position.y = TOP / 2;
    g.add(base);
    // shallow grooves between the cells, as routed into the veneer
    const grooveMat = new THREE.MeshStandardMaterial({ color: 0x3b2614, roughness: 0.9, transparent: true, opacity: 0.35 });
    for (let i = 1; i < N; i++) {
      const a = new THREE.Mesh(new THREE.PlaneGeometry(0.018, N), grooveMat);
      a.rotation.x = -Math.PI / 2; a.position.set(i - N / 2, TOP + 0.001, 0);
      const b = new THREE.Mesh(new THREE.PlaneGeometry(N, 0.018), grooveMat);
      b.rotation.x = -Math.PI / 2; b.position.set(0, TOP + 0.001, i - N / 2);
      a.receiveShadow = b.receiveShadow = true;
      g.add(a, b);
    }
    // the rim: darker varnished hardwood with rounded edges, and the exit gap on the right
    const walnut = woodMaterial('wood_table_001', { rough: 0.75, normal: 0.8, clearcoat: 0.6 });
    const rim = (w, d, x, z, alongZ) => { const m = woodBlock(w, 0.36, d, walnut, { radius: 0.05, scale: 2.4, grainAlongZ: alongZ }); m.position.set(x, 0.18, z); g.add(m); };
    const R = 0.34, H = N / 2 + R / 2;
    rim(N + 2 * R, R, 0, -H, false);
    rim(N + 2 * R, R, 0, H, false);
    rim(R, N, -H, 0, true);
    const gapTop = Z(EXIT_ROW) - 0.5, gapBottom = Z(EXIT_ROW) + 0.5;
    rim(R, gapTop + N / 2, H, (-N / 2 + gapTop) / 2, true);
    rim(R, N / 2 - gapBottom, H, (gapBottom + N / 2) / 2, true);
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
