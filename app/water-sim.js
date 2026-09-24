// Water in a tank: linearised shallow-water equations on a staggered (Arakawa C) grid, so
// the surface carries a real flow field — foam and floating things drift with the water,
// waves reflect off the glass and pile up where they meet. Plus a foam field that is born
// where water converges, where crests steepen and where a hand churns it, and is carried
// along by the flow until it thins out. Pure CPU: the grid is small (160×96), which keeps
// the GPU free for hand tracking and rendering.

export class WaterSim {
  /**
   * @param {number} nx cells across (x) @param {number} nz cells deep (z)
   * @param {number} width tank inner width @param {number} depth tank inner depth (z extent)
   */
  constructor(nx = 160, nz = 96, width = 4, depth = 2.4, { speed = 1.25 } = {}) {
    this.nx = nx; this.nz = nz;
    this.w = width; this.d = depth;
    this.dx = width / nx;
    // wave speed c = sqrt(g·H); split so the surface slope → acceleration feels right
    this.H = 0.6;
    this.g = (speed * speed) / this.H;
    this.h = new Float32Array(nx * nz); // surface height above rest
    this.u = new Float32Array((nx + 1) * nz); // x-velocity on vertical faces
    this.v = new Float32Array(nx * (nz + 1)); // z-velocity on horizontal faces
    this.foam = new Float32Array(nx * nz);
    this.foamTmp = new Float32Array(nx * nz);
    this.hTmp = new Float32Array(nx * nz);
    this.time = 0;
    this.stepDt = 1 / 240;
    this.acc = 0;
    this.stirrers = []; // things moving through the water this frame: {x, z, vx, vz, r, strength, foam}
  }

  idx(i, j) { return j * this.nx + i; }

  /** World (x,z) with the tank centred on the origin → fractional cell coordinates. */
  toCell(x, z) { return [(x + this.w / 2) / this.dx - 0.5, (z + this.d / 2) / this.dx - 0.5]; }

  sample(field, x, z) {
    const { nx, nz } = this;
    let [fi, fj] = this.toCell(x, z);
    fi = Math.min(nx - 1.001, Math.max(0, fi));
    fj = Math.min(nz - 1.001, Math.max(0, fj));
    const i = Math.floor(fi), j = Math.floor(fj), a = fi - i, b = fj - j;
    const k = j * nx + i;
    return (field[k] * (1 - a) + field[k + 1] * a) * (1 - b) + (field[k + nx] * (1 - a) + field[k + nx + 1] * a) * b;
  }

  heightAt(x, z) { return this.sample(this.h, x, z); }

  /** Surface slope (dh/dx, dh/dz) at a point. */
  slopeAt(x, z) {
    const e = this.dx;
    return [(this.heightAt(x + e, z) - this.heightAt(x - e, z)) / (2 * e), (this.heightAt(x, z + e) - this.heightAt(x, z - e)) / (2 * e)];
  }

  /** Water velocity at a point (face velocities averaged to the point). */
  flowAt(x, z) {
    const { nx, nz } = this;
    let [fi, fj] = this.toCell(x, z);
    const i = Math.min(nx - 1, Math.max(0, Math.round(fi))), j = Math.min(nz - 1, Math.max(0, Math.round(fj)));
    const u = 0.5 * (this.u[j * (nx + 1) + i] + this.u[j * (nx + 1) + i + 1]);
    const v = 0.5 * (this.v[j * nx + i] + this.v[(j + 1) * nx + i]);
    return [u, v];
  }

  /** A drop or a poke: a smooth dip (negative) or bump that rings outwards. */
  poke(x, z, radius, amount) {
    const { nx, nz, dx } = this;
    const [ci, cj] = this.toCell(x, z);
    const R = Math.ceil(radius / dx) + 1;
    for (let j = Math.max(0, Math.floor(cj - R)); j <= Math.min(nz - 1, Math.ceil(cj + R)); j++) {
      for (let i = Math.max(0, Math.floor(ci - R)); i <= Math.min(nx - 1, Math.ceil(ci + R)); i++) {
        const d = Math.hypot(i - ci, j - cj) * dx / radius;
        if (d < 1) this.h[j * nx + i] += amount * 0.5 * (1 + Math.cos(Math.PI * d));
      }
    }
  }

  addFoam(x, z, radius, amount) {
    const { nx, nz, dx } = this;
    const [ci, cj] = this.toCell(x, z);
    const R = Math.ceil(radius / dx);
    for (let j = Math.max(0, Math.floor(cj - R)); j <= Math.min(nz - 1, Math.ceil(cj + R)); j++) {
      for (let i = Math.max(0, Math.floor(ci - R)); i <= Math.min(nx - 1, Math.ceil(ci + R)); i++) {
        const d = Math.hypot(i - ci, j - cj) * dx / radius;
        if (d < 1) this.foam[j * nx + i] = Math.min(1.6, this.foam[j * nx + i] + amount * (1 - d * d));
      }
    }
  }

  calm() {
    this.h.fill(0); this.u.fill(0); this.v.fill(0); this.foam.fill(0);
  }

  /** Advance by a frame's dt in fixed sub-steps. */
  update(dt) {
    this.acc = Math.min(this.acc + dt, 0.05);
    while (this.acc >= this.stepDt) {
      this.step(this.stepDt);
      this.acc -= this.stepDt;
    }
    this.stirrers.length = 0;
  }

  step(dt) {
    const { nx, nz, dx, g, H, h, u, v } = this;
    const damp = Math.exp(-0.12 * dt); // gentle loss, so the tank settles over ~10 s
    // momentum: the slope pushes water downhill
    for (let j = 0; j < nz; j++) {
      const row = j * (nx + 1);
      for (let i = 1; i < nx; i++) u[row + i] = (u[row + i] - g * (h[j * nx + i] - h[j * nx + i - 1]) / dx * dt) * damp;
      u[row] = 0; u[row + nx] = 0; // glass walls
    }
    for (let j = 1; j < nz; j++) {
      for (let i = 0; i < nx; i++) v[j * nx + i] = (v[j * nx + i] - g * (h[j * nx + i] - h[(j - 1) * nx + i]) / dx * dt) * damp;
    }
    for (let i = 0; i < nx; i++) { v[i] = 0; v[nz * nx + i] = 0; }

    // hands and floating things drag the water they move through
    for (const s of this.stirrers) this.stir(s, dt);

    // continuity: water flowing in raises the surface
    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        const div = (u[j * (nx + 1) + i + 1] - u[j * (nx + 1) + i] + v[(j + 1) * nx + i] - v[j * nx + i]) / dx;
        h[j * nx + i] -= H * div * dt;
      }
    }
    // a touch of smoothing kills grid-scale ripples the scheme can't carry cleanly
    const t = this.hTmp;
    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        const k = j * nx + i;
        const l = i > 0 ? h[k - 1] : h[k], r = i < nx - 1 ? h[k + 1] : h[k];
        const d = j > 0 ? h[k - nx] : h[k], up = j < nz - 1 ? h[k + nx] : h[k];
        t[k] = h[k] + 0.02 * (l + r + d + up - 4 * h[k]);
      }
    }
    h.set(t);
    this.stepFoam(dt);
    this.time += dt;
  }

  stir({ x, z, vx, vz, r, strength = 1, foam = 0 }, dt) {
    const { nx, nz, dx, u, v } = this;
    const [ci, cj] = this.toCell(x, z);
    const R = Math.ceil(r / dx) + 1;
    const k = Math.min(1, 9 * strength * dt);
    for (let j = Math.max(0, Math.floor(cj - R)); j <= Math.min(nz - 1, Math.ceil(cj + R)); j++) {
      for (let i = Math.max(1, Math.floor(ci - R)); i <= Math.min(nx - 1, Math.ceil(ci + R)); i++) {
        const d = Math.hypot(i - 0.5 - ci, j - cj) * dx / r;
        if (d < 1) { const w = (1 - d * d); u[j * (nx + 1) + i] += (vx - u[j * (nx + 1) + i]) * k * w; }
      }
    }
    for (let j = Math.max(1, Math.floor(cj - R)); j <= Math.min(nz - 1, Math.ceil(cj + R)); j++) {
      for (let i = Math.max(0, Math.floor(ci - R)); i <= Math.min(nx - 1, Math.ceil(ci + R)); i++) {
        const d = Math.hypot(i - ci, j - 0.5 - cj) * dx / r;
        if (d < 1) { const w = (1 - d * d); v[j * nx + i] += (vz - v[j * nx + i]) * k * w; }
      }
    }
    if (foam > 0) this.addFoam(x, z, r * 1.1, foam * dt);
  }

  stepFoam(dt) {
    const { nx, nz, dx, h, u, v, foam } = this;
    const out = this.foamTmp;
    const decay = Math.exp(-dt / 2.6);
    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        const k = j * nx + i;
        // flow at the cell centre
        const uc = 0.5 * (u[j * (nx + 1) + i] + u[j * (nx + 1) + i + 1]);
        const vc = 0.5 * (v[j * nx + i] + v[(j + 1) * nx + i]);
        // semi-Lagrangian: foam here came from upstream
        let si = i - uc * dt / dx, sj = j - vc * dt / dx;
        si = Math.min(nx - 1.001, Math.max(0, si)); sj = Math.min(nz - 1.001, Math.max(0, sj));
        const i0 = Math.floor(si), j0 = Math.floor(sj), a = si - i0, b = sj - j0, k0 = j0 * nx + i0;
        let f = (foam[k0] * (1 - a) + foam[k0 + 1] * a) * (1 - b) + (foam[k0 + nx] * (1 - a) + foam[k0 + nx + 1] * a) * b;
        // birth: converging water (crests colliding, a wave slapping the glass)…
        const div = (u[j * (nx + 1) + i + 1] - u[j * (nx + 1) + i] + v[(j + 1) * nx + i] - v[j * nx + i]) / dx;
        if (div < -2.2) f += (-div - 2.2) * 0.6 * dt;
        // …and steep crests that would break
        const hl = i > 0 ? h[k - 1] : h[k], hr = i < nx - 1 ? h[k + 1] : h[k];
        const hd = j > 0 ? h[k - nx] : h[k], hu = j < nz - 1 ? h[k + nx] : h[k];
        const slope = Math.hypot(hr - hl, hu - hd) / (2 * dx);
        if (slope > 0.5 && h[k] > 0.03) f += (slope - 0.5) * 2.5 * dt;
        out[k] = Math.min(1.6, f * decay);
      }
    }
    foam.set(out);
  }

  /** Where water is steep enough to throw spray, for the renderer's droplets. */
  spraySpots(max = 6) {
    const { nx, nz, dx, h } = this;
    const spots = [];
    for (let n = 0; n < 40 && spots.length < max; n++) {
      const i = 1 + Math.floor(Math.random() * (nx - 2)), j = 1 + Math.floor(Math.random() * (nz - 2));
      const k = j * nx + i;
      const slope = Math.hypot(h[k + 1] - h[k - 1], h[k + nx] - h[k - nx]) / (2 * dx);
      if (slope > 0.45 && h[k] > 0.03) spots.push({ x: (i + 0.5) * dx - this.w / 2, z: (j + 0.5) * dx - this.d / 2, s: slope });
    }
    return spots;
  }
}
