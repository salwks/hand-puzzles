// Pentomino scene: a 5 x N inlaid board, lacquered pieces on the table in front of it,
// and the carry physics. A held piece turns and flips about the point it was pinched at,
// like a real piece between finger and thumb; where it would land is drawn on the board.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { woodMaps, lacqueredWood } from './materials.js';
import { Stage, COLOR, NO_GLOW, applyGlow, damp, easeOutCubic, easeInOutCubic } from './stage.js';
import { SHAPES, ROWS } from './penta-logic.js';

const THICK = 0.42; // piece thickness
const REST_Y = THICK / 2; // pieces are modelled around their mid-plane so a flip looks the same
const LIFT = 0.55; // carry height above rest
const HOVER = 1.1; // height of the empty hand's pinch point
const TRAY_GAP = 1.4; // table between the board and the first tray row
const ROW_DEPTH = 3.7; // depth of one tray row
// Steep view: the grid stays legible and a lifted piece shifts little against the board.
const ELEVATION = (60 * Math.PI) / 180;
const SELECT = 0xcdb27a; // selected piece (ready for the rotate / flip buttons)

// Muted lacquer colours, one per shape, tuned to sit with the ink-and-gold UI.
const PIECE_COLORS = {
  F: 0x8e2a20, I: 0x17426e, L: 0xa96f12, N: 0x1f5a3c, P: 0x56286a, T: 0xa54a1c,
  U: 0x0f6664, V: 0x85213f, W: 0x4c5c1e, X: 0xb8975a, Y: 0x2c3280, Z: 0x5f646d,
};

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const qYaw = new THREE.Quaternion();
const qFlip = new THREE.Quaternion();

/** Orientation of a piece: mirrored about its local Z axis first (a half-turn, as a hand flips it), then yawed. */
function orientation(yaw, flipAngle, out = new THREE.Quaternion()) {
  return out.copy(qYaw.setFromAxisAngle(Y_AXIS, yaw)).multiply(qFlip.setFromAxisAngle(Z_AXIS, flipAngle));
}

/** Outline of a polyomino (cells are unit squares centred on integer coords) as a closed loop of corners. */
function outline(cells) {
  const edges = new Map(); // "x,z" start corner -> [x, z] end corner, clockwise round each cell
  const key = (p) => `${p[0]},${p[1]}`;
  for (const [cx, cz] of cells) {
    const c = [[cx - 0.5, cz - 0.5], [cx + 0.5, cz - 0.5], [cx + 0.5, cz + 0.5], [cx - 0.5, cz + 0.5]];
    for (let i = 0; i < 4; i++) edges.set(`${key(c[i])}>${key(c[(i + 1) % 4])}`, [c[i], c[(i + 1) % 4]]);
  }
  const next = new Map();
  for (const [k, [a, b]] of edges) {
    if (edges.has(`${key(b)}>${key(a)}`)) continue; // shared with a neighbouring cell: interior
    next.set(key(a), b);
    void k;
  }
  const start = next.values().next().value;
  const loop = [];
  let p = start;
  do {
    loop.push(p);
    p = next.get(key(p));
  } while (key(p) !== key(start));
  return loop;
}

const geometryCache = new Map();
function pieceGeometry(name) {
  if (!geometryCache.has(name)) {
    const loop = outline(SHAPES[name]);
    const shape = new THREE.Shape(loop.map(([x, z]) => new THREE.Vector2(x, z)));
    const bevel = 0.045;
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: THICK - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel,
      bevelOffset: -0.065, bevelSegments: 3, // pulled in a hair, so neighbouring pieces show a seam
    });
    geometry.rotateX(Math.PI / 2); // shape plane -> XZ, thickness -> -Y
    geometry.translate(0, THICK / 2 - bevel, 0); // centre on the mid-plane
    geometryCache.set(name, geometry);
  }
  return geometryCache.get(name);
}

let tintWood = null;

class PieceObj {
  constructor(name) {
    this.name = name;
    tintWood ??= woodMaps('#e6e1d8', '#4a433a', 41, { pores: 70 }); // neutral grain that takes any lacquer colour
    this.material = lacqueredWood(tintWood, { repeat: 0.3, offset: [Math.random(), Math.random()], roughness: 0.45, clearcoat: 0.6 });
    this.baseColor = new THREE.Color(PIECE_COLORS[name]);
    this.material.color.copy(this.baseColor);
    this.root = new THREE.Mesh(pieceGeometry(name), this.material);
    this.root.castShadow = true;
    this.root.receiveShadow = true;
    this.yaw = 0;
    this.flipAngle = 0;
    this.busy = 0;
    this.glow = NO_GLOW;
  }

  applyOrientation() {
    orientation(this.yaw, this.flipAngle, this.root.quaternion);
  }
}

export class PentaScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.cols = 3;
    this.pieces = new Map(); // name -> PieceObj
    this.held = null;
    this.hoverName = null;
    this.selectedName = null;
    this.board = new THREE.Group();
    this.scene.add(this.board);
    this.ghost = this.cellPool(COLOR.hint, 0.012);
    this.hint = this.cellPool(SELECT, 0.014);
    this.extent = { width: 12, depth: 12 };
    this.start();
  }

  /** Five flat quads that can be laid over board cells. */
  cellPool(color, y) {
    const geometry = new THREE.PlaneGeometry(0.9, 0.9);
    const pool = [];
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false,
      }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = y;
      mesh.visible = false;
      this.scene.add(mesh);
      pool.push(mesh);
    }
    return pool;
  }

  // ---------- layout ----------

  gridToWorld(gx, gz) {
    return { x: gx - this.cols / 2 + 0.5, z: gz - ROWS / 2 + 0.5 + this.boardZ };
  }

  worldToGrid(wx, wz) {
    return { gx: wx + this.cols / 2 - 0.5, gz: wz - this.boardZ + ROWS / 2 - 0.5 };
  }

  /** True if a world point lies over the board (with a small margin). */
  overBoard(wx, wz, margin = 0.6) {
    const { gx, gz } = this.worldToGrid(wx, wz);
    return gx > -0.5 - margin && gx < this.cols - 0.5 + margin && gz > -0.5 - margin && gz < ROWS - 0.5 + margin;
  }

  /**
   * Builds the board for `cols` columns and lays the pieces out in rows on the table in front
   * of it. pieces: [{ name, rot, flip, width, depth }] (footprint in that orientation).
   * Returns the world pivot position chosen for each: { name: { x, z } }.
   */
  build(cols, pieces) {
    this.clear();
    this.cols = cols;

    // Split the pieces into 1–3 tray rows, whichever lets the camera sit closest for this window shape.
    const rowWidthOf = (row) => row.reduce((w, p) => w + p.width + 1, -1);
    const split = (count) => {
      const rows = Array.from({ length: count }, () => []);
      const target = rowWidthOf(pieces) / count;
      let r = 0;
      for (const p of pieces) {
        if (r < count - 1 && rows[r].length && rowWidthOf(rows[r]) + (p.width + 1) / 2 > target) r++;
        rows[r].push(p);
      }
      return rows.filter((row) => row.length);
    };
    const aspect = window.innerWidth / window.innerHeight;
    let best = null;
    for (let count = 1; count <= 3; count++) {
      const rows = split(count);
      const width = Math.max(cols + 1.2, ...rows.map(rowWidthOf));
      const depth = ROWS + TRAY_GAP + rows.length * ROW_DEPTH;
      const dist = this.distanceFor(width, depth, aspect);
      if (!best || dist < best.dist - 0.01) best = { rows, width, depth, dist };
    }
    const { rows } = best;
    const totalDepth = best.depth;
    const widest = best.width;
    this.boardZ = -totalDepth / 2 + ROWS / 2;
    this.extent = { width: widest, depth: totalDepth };

    this.buildBoard();

    const spots = {};
    rows.forEach((row, r) => {
      const width = row.reduce((w, p) => w + p.width + 1, -1);
      let x = -width / 2;
      const z = this.boardZ + ROWS / 2 + TRAY_GAP + ROW_DEPTH * (r + 0.5) - 0.3;
      for (const p of row) {
        // centre of the footprint -> pivot position
        spots[p.name] = { x: x + p.width / 2 - p.centerX, z: z - p.centerZ };
        x += p.width + 1;
      }
    });

    pieces.forEach((p, i) => {
      const obj = new PieceObj(p.name);
      obj.yaw = p.rot * (Math.PI / 2);
      obj.flipAngle = p.flip ? Math.PI : 0;
      obj.applyOrientation();
      obj.root.position.set(spots[p.name].x, REST_Y, spots[p.name].z);
      this.pieces.set(p.name, obj);
      this.scene.add(obj.root);
      // deal the pieces onto the table one after another
      obj.busy++;
      obj.root.visible = false;
      this.tween({
        dur: 0.5, delay: 0.15 + i * 0.08,
        update: (k) => {
          obj.root.visible = true;
          obj.root.position.y = REST_Y + 2.4 * (1 - easeOutCubic(k));
        },
        done: () => { obj.busy--; },
      });
    });

    this.setLampScale(Math.max(widest, totalDepth) / 2);
    this.resize();
    return spots;
  }

  buildBoard() {
    const { cols } = this;
    const maple = woodMaps('#d6c29a', '#8a6a3c', 7, { pores: 90 });
    const tile = new RoundedBoxGeometry(0.992, 0.12, 0.992, 3, 0.012);
    for (let gx = 0; gx < cols; gx++) {
      for (let gz = 0; gz < ROWS; gz++) {
        const i = gx * ROWS + gz;
        const mesh = new THREE.Mesh(tile, lacqueredWood(maple, {
          offset: [((i * 37) % 10) / 10, ((i * 53) % 10) / 10], roughness: 0.5, clearcoat: 0.55,
        }));
        mesh.rotation.y = (gx + gz) % 2 ? Math.PI / 2 : 0; // alternate the grain so the grid reads without colour
        const w = this.gridToWorld(gx, gz);
        mesh.position.set(w.x, -0.06, w.z);
        mesh.receiveShadow = true;
        this.board.add(mesh);
      }
    }
    const ebony = woodMaps('#1a1410', '#030201', 29, { pores: 60, highlights: false });
    const frame = new THREE.Mesh(
      new RoundedBoxGeometry(cols + 0.9, 0.2, ROWS + 0.9, 4, 0.035),
      lacqueredWood(ebony, { repeat: 2.2, roughness: 0.55, clearcoat: 0.25 }),
    );
    frame.position.set(0, -0.115, this.boardZ);
    frame.receiveShadow = true;
    frame.castShadow = true;
    this.board.add(frame);

    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a65c, metalness: 1, roughness: 0.24 });
    const hx = cols / 2 + 0.17, hz = ROWS / 2 + 0.17;
    for (const [w, d, x, z] of [[hx * 2 + 0.03, 0.03, 0, hz], [hx * 2 + 0.03, 0.03, 0, -hz],
      [0.03, hz * 2 + 0.03, hx, 0], [0.03, hz * 2 + 0.03, -hx, 0]]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(w, 0.006, d), brass);
      strip.position.set(x, -0.013, z + this.boardZ);
      strip.receiveShadow = true;
      this.board.add(strip);
    }
  }

  clear() {
    this.held = null;
    this.hoverName = this.selectedName = null;
    for (const obj of this.pieces.values()) this.scene.remove(obj.root);
    this.pieces.clear();
    this.board.clear();
    this.tweens = [];
    this.setCells(this.ghost, null);
    this.setCells(this.hint, null);
  }

  /** Camera distance at which a layout of this size fits the free part of the window. */
  distanceFor(width, depth, aspect) {
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const forWidth = ((width / 2 + 0.8) / (tanV * aspect)) * 1.1;
    // The HUD covers roughly the top 13% of the window and the two docks the bottom 25%.
    const forDepth = ((depth * Math.sin(ELEVATION)) / 2 + 0.9) / (tanV * 0.62);
    return Math.max(forWidth, forDepth, 9);
  }

  frameCamera(aspect) {
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const dist = this.distanceFor(this.extent.width, this.extent.depth, aspect);
    this.camera.position.set(0, Math.sin(ELEVATION) * dist, Math.cos(ELEVATION) * dist);
    // Aim in front of the layout's centre so it sits in the middle of the free area, not of the window.
    this.camera.lookAt(0, 0, (0.06 * 2 * dist * tanV) / Math.sin(ELEVATION));
  }

  // ---------- picking ----------

  cellToScreen(gx, gz, height = 0) {
    const w = this.gridToWorld(gx, gz);
    return this.toScreen(w.x, height, w.z);
  }

  /** Name of the piece under the screen position, or null. */
  pick(x, y) {
    this.ray(x, y);
    const roots = [...this.pieces.values()].filter((o) => !o.busy).map((o) => o.root);
    const hit = this.raycaster.intersectObjects(roots, false)[0];
    if (!hit) return null;
    for (const [name, obj] of this.pieces) if (obj.root === hit.object) return name;
    return null;
  }

  // ---------- carrying ----------

  /** Where the pointer's line of sight meets the plane pieces rest on. */
  pointerOnTable() {
    return this.pointOnPlane(this.pointer.x, this.pointer.y, REST_Y);
  }

  grab(name, x, y) {
    const obj = this.pieces.get(name);
    if (!obj || obj.busy) return false;
    this.pointer = { x, y };
    const p = this.pointerOnTable();
    if (!p) return false;
    // The pinch point, in the piece's own frame: the piece will turn and flip about it.
    const local = p.clone().sub(obj.root.position).setY(0)
      .applyQuaternion(orientation(obj.yaw, obj.flipAngle).invert());
    this.held = { obj, local, lift: 0, yawTarget: obj.yaw, flipTarget: obj.flipAngle };
    return true;
  }

  /** Continuous yaw (radians) and flip state (bool) the held piece should show. */
  setHeldPose(yaw, flipped) {
    if (!this.held) return;
    this.held.yawTarget = yaw;
    // Always turn the same way round, so repeated flips keep rolling rather than rocking back.
    const current = Math.round(this.held.flipTarget / Math.PI);
    if ((current % 2 !== 0) !== flipped) this.held.flipTarget = (current + 1) * Math.PI;
  }

  moveHeld(x, y) {
    this.pointer = { x, y };
  }

  /** World pivot position the held piece would have at a snapped orientation. */
  heldPivot(rot, flip) {
    const p = this.held && this.pointerOnTable();
    if (!p) return null;
    const offset = this.held.local.clone().applyQuaternion(orientation(rot * (Math.PI / 2), flip ? Math.PI : 0));
    return { x: p.x - offset.x, z: p.z - offset.z };
  }

  release() {
    const obj = this.held?.obj ?? null;
    this.held = null;
    return obj;
  }

  /** Animate a piece to a pose: { rot, flip, x, z } in world coords, resting on the table/board. */
  settle(name, pose, { hop = false } = {}) {
    const obj = this.pieces.get(name);
    if (!obj) return;
    const from = { pos: obj.root.position.clone(), yaw: obj.yaw, flip: obj.flipAngle };
    // nearest equivalent angles, so the piece never spins the long way round
    const yawTo = pose.rot * (Math.PI / 2) + Math.round((from.yaw - pose.rot * (Math.PI / 2)) / (Math.PI * 2)) * Math.PI * 2;
    const flipBase = pose.flip ? Math.PI : 0;
    const flipTo = flipBase + Math.round((from.flip - flipBase) / (Math.PI * 2)) * Math.PI * 2;
    const turning = Math.abs(flipTo - from.flip) > 0.01;
    const arc = hop || turning ? 0.7 : 0; // room to turn over without cutting through the table
    obj.busy++;
    this.tween({
      dur: hop || turning ? 0.38 : 0.2,
      update: (k) => {
        const e = easeInOutCubic(k);
        obj.root.position.x = from.pos.x + (pose.x - from.pos.x) * e;
        obj.root.position.z = from.pos.z + (pose.z - from.pos.z) * e;
        obj.root.position.y = from.pos.y + (REST_Y - from.pos.y) * e + Math.sin(Math.PI * k) * arc;
        obj.yaw = from.yaw + (yawTo - from.yaw) * e;
        obj.flipAngle = from.flip + (flipTo - from.flip) * e;
        obj.applyOrientation();
      },
      done: () => {
        obj.yaw = pose.rot * (Math.PI / 2);
        obj.flipAngle = flipBase;
        obj.applyOrientation();
        obj.root.position.set(pose.x, REST_Y, pose.z);
        obj.busy--;
      },
    });
  }

  // ---------- markings ----------

  setCells(pool, cells, color = null, opacity = 0.5) {
    pool.forEach((mesh, i) => {
      const cell = cells?.[i];
      mesh.visible = Boolean(cell);
      if (!cell) return;
      const w = this.gridToWorld(cell[0], cell[1]);
      mesh.position.x = w.x;
      mesh.position.z = w.z;
      if (color !== null) mesh.material.color.set(color);
      mesh.material.opacity = opacity;
    });
  }

  /** Footprint of where the held piece would land: green if it fits, ruby if it doesn't. */
  setGhost(cells, valid) {
    this.setCells(this.ghost, cells, valid ? COLOR.hint : COLOR.target, valid ? 0.55 : 0.45);
  }

  setHintCells(cells) {
    this.setCells(this.hint, cells, SELECT, 0.6);
    this.hintOn = Boolean(cells);
  }

  setHighlights({ hover = null, selected = null } = {}) {
    this.hoverName = hover;
    this.selectedName = selected;
  }

  // ---------- per-frame hooks ----------

  update(dt, wave) {
    if (this.held) {
      const h = this.held;
      const { obj } = h;
      h.lift += (LIFT - h.lift) * damp(11, dt);
      obj.yaw += (h.yawTarget - obj.yaw) * damp(18, dt);
      obj.flipAngle += (h.flipTarget - obj.flipAngle) * damp(9, dt);
      obj.applyOrientation();
      const p = this.pointerOnTable();
      if (p) {
        // keep the pinched point of the piece under the pointer while it turns and flips
        const offset = h.local.clone().applyQuaternion(obj.root.quaternion);
        const k = damp(26, dt);
        obj.root.position.x += (p.x - offset.x - obj.root.position.x) * k;
        obj.root.position.z += (p.z - offset.z - obj.root.position.z) * k;
      }
      // mid-flip the piece stands on edge: lift it clear of the table
      const onEdge = Math.abs(Math.sin(obj.flipAngle)) * 0.9;
      obj.root.position.y = REST_Y + h.lift + onEdge;
    }

    for (const [name, obj] of this.pieces) {
      let glow = NO_GLOW;
      if (name === this.selectedName) glow = { color: SELECT, intensity: 0.35, pulse: true };
      if (name === this.hoverName) glow = { color: COLOR.hover, intensity: 0.4, pulse: true };
      if (obj === this.held?.obj) glow = { color: COLOR.held, intensity: 0.22, pulse: false };
      applyGlow(obj.material, glow, wave);
    }
    if (this.hintOn) for (const mesh of this.hint) mesh.material.opacity = 0.45 + 0.2 * wave;
  }

  /** The hand holds the piece at the pinched point; empty, it hovers where the cursor points. */
  handAnchor() {
    if (!this.held) return this.pointOnPlane(this.pointer.x, this.pointer.y, HOVER);
    const { obj, local } = this.held;
    const offset = local.clone().applyQuaternion(obj.root.quaternion);
    return new THREE.Vector3(obj.root.position.x + offset.x, obj.root.position.y + THICK / 2 + 0.05,
      obj.root.position.z + offset.z);
  }

  handGlow() {
    if (this.held) return { color: COLOR.held, intensity: 0.16 };
    return this.hoverName ? { color: COLOR.hover, intensity: 0.14 } : NO_GLOW;
  }
}
