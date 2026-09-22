// Solitaire chess scene: the 4x4 board and pieces with grab/carry/drop physics.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildPiece } from './pieces.js';
import { woodMaps, lacqueredWood, contactShadow } from './materials.js';
import { Stage, COLOR, NO_GLOW, applyGlow, clamp, damp, easeOutCubic, easeInQuad, easeOutBounce } from './stage.js';

const SIZE = 4;
const LIFT = 0.6; // how high a held piece is carried above the board
const HOVER = 1.3; // height of the pinch point when the hand is empty
const GRAB_BELOW_TOP = 0.1; // pieces are held just below their top
const REACH = 2.7; // held pieces can't be carried further than this from the centre

const PIECE_COLOR = new THREE.Color(0xe2d0aa);
const tint = new THREE.Color();

const sqX = (sq) => (sq % SIZE) - 1.5;
const sqZ = (sq) => Math.floor(sq / SIZE) - 1.5;

class PieceObj {
  constructor(type, sq) {
    const { body, material, height } = buildPiece(type);
    this.material = material;
    this.grabH = height - GRAB_BELOW_TOP;
    this.sq = sq;
    // root sits at the piece's base; pivot sits at the grab point so a held piece swings from it.
    this.root = new THREE.Group();
    this.pivot = new THREE.Group();
    this.pivot.position.y = this.grabH;
    body.position.y = -this.grabH;
    this.pivot.add(body);
    this.root.add(this.pivot);
    this.contact = contactShadow(0.46);
    this.root.add(this.contact);
    this.root.position.set(sqX(sq), 0, sqZ(sq));
    this.tilt = { x: 0, z: 0, vx: 0, vz: 0, tx: 0, tz: 0 };
    this.busy = 0; // running tweens that own the root transform
    this.glow = NO_GLOW;
  }

  updateSwing(dt) {
    const t = this.tilt;
    const K = 110, C = 8; // underdamped: the piece swings a little before settling
    t.vx += (-K * (t.x - t.tx) - C * t.vx) * dt;
    t.vz += (-K * (t.z - t.tz) - C * t.vz) * dt;
    t.x += t.vx * dt;
    t.z += t.vz * dt;
    this.pivot.rotation.set(t.x, 0, t.z);

    // The contact shadow stays on the board while the piece rises: wider and fainter with height.
    const lift = Math.max(0, this.root.position.y);
    this.contact.position.y = 0.003 - this.root.position.y;
    this.contact.scale.setScalar(1 + lift * 0.9);
    this.contact.material.opacity = 1 / (1 + lift * 3.5);
  }
}

export class Scene3D extends Stage {
  constructor(canvas) {
    super(canvas);
    this.buildBoard();
    this.buildMarkers();
    this.pieces = new Map(); // id -> PieceObj
    this.held = null; // { obj, lift }
    this.start();
  }

  // ---------- static scene ----------

  buildBoard() {
    const maple = woodMaps('#d2bd94', '#8a6a3c', 7, { pores: 90 });
    const walnut = woodMaps('#5d3c29', '#1f0f07', 13);
    // Slightly undersized, softly bevelled tiles: the hairline seams and the bevel highlights
    // are what make it read as inlaid wood rather than a printed checkerboard.
    const tile = new RoundedBoxGeometry(0.992, 0.12, 0.992, 3, 0.012);
    this.tiles = [];
    for (let sq = 0; sq < SIZE * SIZE; sq++) {
      const isDark = (Math.floor(sq / SIZE) + sq) % 2 === 1;
      const material = lacqueredWood(isDark ? walnut : maple, {
        offset: [((sq * 37) % 10) / 10, ((sq * 53) % 10) / 10],
        roughness: isDark ? 0.42 : 0.48,
      });
      const mesh = new THREE.Mesh(tile, material);
      mesh.rotation.y = (sq * 7) % 2 ? Math.PI / 2 : 0; // alternate grain direction, as in real boards
      mesh.position.set(sqX(sq), -0.06, sqZ(sq));
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.userData.glow = NO_GLOW;
      this.tiles.push(mesh);
      this.scene.add(mesh);
    }

    // Ebony frame with a thin brass line inlaid around the playing field.
    const ebony = woodMaps('#1a1410', '#030201', 29, { pores: 60, highlights: false });
    const frame = new THREE.Mesh(
      new RoundedBoxGeometry(4.9, 0.2, 4.9, 4, 0.035),
      lacqueredWood(ebony, { repeat: 2.2, roughness: 0.55, clearcoat: 0.25 }), // satin, not gloss: gloss turns black wood grey
    );
    frame.position.y = -0.115;
    frame.receiveShadow = true;
    frame.castShadow = true;
    this.scene.add(frame);

    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a65c, metalness: 1, roughness: 0.24 });
    const inlayAt = 2.17, inlayLength = inlayAt * 2 + 0.03;
    for (const [w, d, x, z] of [[inlayLength, 0.03, 0, inlayAt], [inlayLength, 0.03, 0, -inlayAt],
      [0.03, inlayLength, inlayAt, 0], [0.03, inlayLength, -inlayAt, 0]]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(w, 0.006, d), brass);
      strip.position.set(x, -0.013, z);
      strip.receiveShadow = true;
      this.scene.add(strip);
    }
  }

  buildMarkers() {
    const ringGeo = new THREE.RingGeometry(0.35, 0.46, 56);
    const discGeo = new THREE.CircleGeometry(0.46, 56);
    const make = (geo, y) => {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        transparent: true, depthWrite: false, toneMapped: false,
      }));
      m.rotation.x = -Math.PI / 2;
      m.position.y = y;
      m.visible = false;
      this.scene.add(m);
      return m;
    };
    this.markers = [];
    for (let sq = 0; sq < SIZE * SIZE; sq++) {
      const ring = make(ringGeo, 0.006);
      const disc = make(discGeo, 0.004);
      ring.position.x = disc.position.x = sqX(sq);
      ring.position.z = disc.position.z = sqZ(sq);
      this.markers.push({ ring, disc, pulse: false });
    }
  }

  /**
   * marks: { origin, targets: [], over, hover, hoverMovable, hintFrom, hintTo } (square indices or null).
   * Every state is shown three ways at once — the piece glows, its tile glows, and a ring
   * is drawn — so it reads clearly even when the hand covers part of the square.
   */
  setMarks({ origin = null, targets = [], over = null, hover = null, hoverMovable = true,
    hintFrom = null, hintTo = null } = {}) {
    const glows = [];
    for (let sq = 0; sq < SIZE * SIZE; sq++) {
      let glow = NO_GLOW, ring = null, fill = 0;
      if (sq === hintFrom || sq === hintTo) {
        glow = { color: COLOR.hint, intensity: 0.55, pulse: sq === hintTo };
        ring = COLOR.hint;
      }
      if (sq === hover) {
        glow = hoverMovable
          ? { color: COLOR.hover, intensity: 0.75, pulse: true }
          : { color: COLOR.stuck, intensity: 0.3, pulse: false };
        ring = glow.color;
        fill = hoverMovable ? 0.35 : 0.15;
      }
      if (sq === origin) {
        glow = { color: COLOR.held, intensity: 0.7, pulse: false };
        ring = COLOR.held;
        fill = 0.3;
      }
      if (targets.includes(sq)) {
        const aimed = sq === over;
        glow = { color: COLOR.target, intensity: aimed ? 1.1 : 0.35, pulse: aimed };
        ring = COLOR.target;
        fill = aimed ? 0.6 : 0.15;
      }
      glows.push(glow);
      this.tiles[sq].userData.glow = glow;
      const m = this.markers[sq];
      m.ring.visible = ring !== null;
      m.disc.visible = fill > 0;
      if (ring !== null) {
        m.ring.material.color.set(ring);
        m.ring.material.opacity = 0.95;
        m.disc.material.color.set(ring);
        m.disc.material.opacity = fill;
      }
      m.pulse = glow.pulse;
    }
    for (const obj of this.pieces.values()) obj.glow = obj.busy && obj !== this.held?.obj ? NO_GLOW : glows[obj.sq];
    this.hoverState = hover === null ? null : hoverMovable;
  }

  frameCamera(aspect) {
    // Far enough that the board clears the HUD above it and the dock below it; further on narrow screens.
    const dist = 11.8 * Math.max(1, 1.25 / aspect);
    this.camera.position.set(0, 0.76, 0.65).normalize().multiplyScalar(dist);
    this.camera.lookAt(0, 0.1, 0.5); // aim slightly in front of the board: it sits a little above screen centre
  }

  /** Screen position of a square's centre (used by tests and UI). */
  squareToScreen(sq, height = 0) {
    return this.toScreen(sqX(sq), height, sqZ(sq));
  }

  /** Which piece is under the screen position: the mesh hit first, else the nearest piece. */
  pick(x, y, snap) {
    const ray = this.ray(x, y);
    const roots = [...this.pieces.values()].filter((o) => !o.busy).map((o) => o.root);
    const hit = this.raycaster.intersectObjects(roots, true)[0];
    if (hit) {
      for (const [id, obj] of this.pieces) {
        let n = hit.object;
        while (n && n !== obj.root) n = n.parent;
        if (n) return id;
      }
    }
    const free = [...this.pieces.entries()].filter(([, obj]) => !obj.busy);
    const sq = this.aimedSquare(x, y, HOVER, free.map(([, obj]) => obj.sq), snap);
    return sq === null ? null : free.find(([, obj]) => obj.sq === sq)[0];
  }

  /**
   * Which of `squares` the player is aiming at. Something floating above the board (the
   * hand, a carried piece) lines up on screen with a square further back than the one
   * directly beneath it, and session logs show players use both readings: "directly
   * below" and "what it covers on screen". So every square along the line of sight
   * counts, from the point at `topHeight` down to where the ray meets the board.
   */
  aimedSquare(x, y, topHeight, squares, snap) {
    const top = this.pointOnPlane(x, y, topHeight);
    const ground = this.pointOnPlane(x, y, 0);
    if (!top || !ground) return null;
    const ax = top.x, az = top.z, bx = ground.x - ax, bz = ground.z - az;
    const len2 = bx * bx + bz * bz || 1e-9;
    let best = null, bestScore = Infinity;
    for (const sq of squares) {
      const px = sqX(sq) - ax, pz = sqZ(sq) - az;
      const k = clamp((px * bx + pz * bz) / len2, 0, 1);
      const d = Math.hypot(px - bx * k, pz - bz * k);
      if (d > snap) continue;
      // Between two candidates on the line, prefer the one nearer the "directly below" end.
      const score = d + 0.2 * k;
      if (score < bestScore) { best = sq; bestScore = score; }
    }
    return best;
  }

  /** Line of sight in board cell coords, for the session log: [top cx, cy, ground cx, cy]. */
  aimDebug(x, y) {
    const top = this.pointOnPlane(x, y, this.held ? LIFT + this.held.obj.grabH : HOVER);
    const ground = this.pointOnPlane(x, y, 0);
    if (!top || !ground) return null;
    return [top.x + 2, top.z + 2, ground.x + 2, ground.z + 2].map((v) => Math.round(v * 100) / 100);
  }

  // ---------- pieces ----------

  /** Reconcile 3D objects with game state. `from` = origin square of the move just played. */
  sync(pieces, { spawn = false, from = null } = {}) {
    const alive = new Map(pieces.map((p) => [p.id, p]));
    const mover = from === null ? null : pieces.find((p) => this.pieces.get(p.id)?.sq === from);

    for (const [id, obj] of this.pieces) {
      if (alive.has(id)) continue;
      this.pieces.delete(id);
      this.knockOut(obj, mover ? from : null);
    }

    pieces.forEach((p, i) => {
      let obj = this.pieces.get(p.id);
      if (!obj) {
        obj = new PieceObj(p.type, p.sq);
        this.pieces.set(p.id, obj);
        this.scene.add(obj.root);
        if (spawn) this.dropIn(obj, i * 0.07);
        else this.popIn(obj);
      } else if (obj.sq !== p.sq || (this.held?.obj !== obj && !obj.busy && obj.root.position.y > 0.001)) {
        obj.sq = p.sq;
        this.settle(obj);
      }
    });
  }

  clear() {
    this.held = null;
    for (const obj of this.pieces.values()) this.scene.remove(obj.root);
    this.pieces.clear();
    this.tweens = [];
  }

  dropIn(obj, delay) {
    obj.busy++;
    obj.root.position.y = 3.2;
    obj.root.visible = false;
    this.tween({
      dur: 0.55, delay,
      update: (k) => { obj.root.visible = true; obj.root.position.y = 3.2 * (1 - easeOutBounce(k)); },
      done: () => { obj.busy--; },
    });
  }

  popIn(obj) {
    obj.busy++;
    this.tween({
      dur: 0.25,
      update: (k) => obj.root.scale.setScalar(0.3 + 0.7 * easeOutCubic(k)),
      done: () => { obj.busy--; },
    });
  }

  /** Move a piece from wherever it is (in the air or on another square) down onto obj.sq. */
  settle(obj) {
    const start = obj.root.position.clone();
    const end = new THREE.Vector3(sqX(obj.sq), 0, sqZ(obj.sq));
    const airborne = start.y > 0.05;
    const hop = airborne ? 0 : 0.5; // pieces moved by undo hop over in an arc
    obj.busy++;
    obj.tilt.tx = obj.tilt.tz = 0;
    this.tween({
      dur: airborne ? 0.24 : 0.32,
      update: (k) => {
        const e = easeOutCubic(k);
        obj.root.position.x = start.x + (end.x - start.x) * e;
        obj.root.position.z = start.z + (end.z - start.z) * e;
        obj.root.position.y = start.y * (1 - easeInQuad(k)) + Math.sin(Math.PI * k) * hop;
      },
      done: () => {
        // a small bounce sells the weight of the landing
        this.tween({
          dur: 0.14,
          update: (k) => { obj.root.position.y = Math.sin(Math.PI * k) * 0.035; },
          done: () => { obj.root.position.y = 0; obj.busy--; },
        });
      },
    });
  }

  /** Captured piece: knocked over in the mover's direction of travel, then fades out. */
  knockOut(obj, fromSq) {
    obj.busy++;
    const away = new THREE.Vector3(1, 0, 0);
    if (fromSq !== null) away.set(sqX(obj.sq) - sqX(fromSq), 0, sqZ(obj.sq) - sqZ(fromSq)).normalize();
    const axis = new THREE.Vector3(away.z, 0, -away.x);
    const start = obj.root.position.clone();
    obj.material.transparent = true;
    obj.contact.visible = false;
    this.tween({
      dur: 0.45, delay: fromSq !== null ? 0.16 : 0,
      update: (k) => {
        const e = easeOutCubic(k);
        obj.root.quaternion.setFromAxisAngle(axis, e * 1.45);
        obj.root.position.copy(start).addScaledVector(away, e * 0.65);
        obj.root.position.y = Math.sin(Math.PI * Math.min(1, k * 1.6)) * 0.18;
        obj.material.opacity = 1 - easeInQuad(k);
      },
      done: () => this.scene.remove(obj.root),
    });
  }

  grab(id, x, y) {
    const obj = this.pieces.get(id);
    if (!obj || obj.busy) return false;
    this.held = { obj, lift: 0 };
    this.pointer = { x, y };
    return true;
  }

  /** Update the carry position; returns which of `targets` the held piece is aimed at (or null). */
  moveHeld(x, y, targets, snap) {
    this.pointer = { x, y };
    if (!this.held) return null;
    return this.aimedSquare(x, y, LIFT + this.held.obj.grabH, targets, snap);
  }

  heldTarget() {
    const { obj } = this.held;
    const p = this.pointOnPlane(this.pointer.x, this.pointer.y, LIFT + obj.grabH);
    if (!p) return null;
    p.x = clamp(p.x, -REACH, REACH);
    p.z = clamp(p.z, -REACH, REACH);
    return p;
  }

  /** Let go of the held piece. The caller then syncs state; if nothing changed it settles back. */
  release() {
    const obj = this.held?.obj;
    this.held = null;
    return obj ?? null;
  }

  // ---------- per-frame hooks ----------

  update(dt, wave) {
    if (this.held) {
      const { obj } = this.held;
      this.held.lift += (LIFT - this.held.lift) * damp(11, dt);
      const target = this.heldTarget();
      if (target) {
        const pos = obj.root.position;
        const k = damp(24, dt);
        const vx = ((target.x - pos.x) * k) / dt;
        const vz = ((target.z - pos.z) * k) / dt;
        pos.x += vx * dt;
        pos.z += vz * dt;
        // Hanging from the pinch point, the body lags behind the motion.
        obj.tilt.tz = clamp(-vx * 0.075, -0.5, 0.5);
        obj.tilt.tx = clamp(vz * 0.075, -0.5, 0.5);
      }
      obj.root.position.y = this.held.lift;
    }
    for (const obj of this.pieces.values()) {
      if (obj !== this.held?.obj) obj.tilt.tx = obj.tilt.tz = 0;
      obj.updateSwing(dt);
    }

    for (const m of this.markers) m.ring.scale.setScalar(m.pulse ? 1 + wave * 0.06 : 1);
    for (const obj of this.pieces.values()) {
      // Ivory + emissive just washes out to white, so the piece's own colour is dyed as well.
      const g = obj.glow;
      const mix = g.intensity ? Math.min(0.92, 0.6 + g.intensity * 0.3) * (g.pulse ? 0.85 + 0.15 * wave : 1) : 0;
      obj.material.color.copy(PIECE_COLOR).lerp(tint.set(g.color), mix);
      applyGlow(obj.material, g, wave, 0.5);
    }
    for (const tile of this.tiles) applyGlow(tile.material, tile.userData.glow, wave, 0.45);
  }

  /** The pinch point rides on the held piece's grab point, or hovers above the board. */
  handAnchor() {
    if (!this.held) return this.pointOnPlane(this.pointer.x, this.pointer.y, HOVER);
    const anchor = this.heldTarget();
    if (anchor) anchor.y = this.held.lift + this.held.obj.grabH;
    return anchor;
  }

  /** Blue while holding, amber when a pinch would grab something. */
  handGlow() {
    if (this.held) return { color: COLOR.held, intensity: 0.16 };
    return this.hoverState ? { color: COLOR.hover, intensity: 0.14 } : NO_GLOW;
  }
}
