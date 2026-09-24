// Particle water on the GPU: MLS-MPM (moving least squares material point method) in WebGPU
// compute shaders. Tens of thousands of particles carry the water; each substep splats them
// onto a grid (mass and APIC momentum), adds pressure from an equation of state and a little
// viscosity, applies gravity, the tank walls and a hand pushing through, then gathers the grid
// back into the particles. Positions (plus speed, for whitewater) are read back each frame so
// the three.js scene can draw them; so is a height map of the surface and the surface flow,
// for the floating surfer and the caustics.
//
// Units: grid cells for length, "sim time" for time. Cells 0–1 and the last two are walls.

const WG = 64;

const SHADER = /* wgsl */ `
struct Particle { position: vec3f, v: vec3f, C: mat3x3f };
struct Cell { vx: atomic<i32>, vy: atomic<i32>, vz: atomic<i32>, mass: atomic<i32> };
struct Params {
  grid: vec4f,   // GX, GY, GZ, particle count
  sim: vec4f,    // dt, gravity, stiffness, rest density
  misc: vec4f,   // viscosity, fixed-point scale, hand active, surface band (cells)
  hand: vec4f,   // x, bottom y, z, radius   (cells)
  handV: vec4f,  // vx, vy, vz, _            (cells / sim time)
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> cells: array<Cell>;
@group(0) @binding(2) var<uniform> P: Params;
@group(0) @binding(3) var<storage, read_write> out: array<vec4f>;
@group(0) @binding(4) var<storage, read_write> heights: array<atomic<i32>>;    // this frame's max y × 1000
@group(0) @binding(5) var<storage, read> prevHeights: array<i32>;              // last frame's
@group(0) @binding(6) var<storage, read_write> colFlow: array<atomic<i32>>;    // vx, vz, count per column

fn enc(f: f32) -> i32 { return i32(f * P.misc.y); }
fn dec(i: i32) -> f32 { return f32(i) / P.misc.y; }
fn gdim() -> vec3i { return vec3i(P.grid.xyz); }
fn cellIndex(c: vec3i) -> i32 { let g = gdim(); return c.x * g.y * g.z + c.y * g.z + c.z; }
fn weights(d: vec3f) -> array<vec3f, 3> {
  return array<vec3f, 3>(0.5 * (0.5 - d) * (0.5 - d), 0.75 - d * d, 0.5 * (0.5 + d) * (0.5 + d));
}

@compute @workgroup_size(${WG})
fn clearGrid(@builtin(global_invocation_id) id: vec3u) {
  let g = gdim();
  if (id.x >= u32(g.x * g.y * g.z)) { return; }
  atomicStore(&cells[id.x].vx, 0); atomicStore(&cells[id.x].vy, 0);
  atomicStore(&cells[id.x].vz, 0); atomicStore(&cells[id.x].mass, 0);
}

@compute @workgroup_size(${WG})
fn clearColumns(@builtin(global_invocation_id) id: vec3u) {
  let g = gdim();
  if (id.x >= u32(g.x * g.z)) { return; }
  atomicStore(&heights[id.x], 0);
  atomicStore(&colFlow[id.x * 3u], 0); atomicStore(&colFlow[id.x * 3u + 1u], 0); atomicStore(&colFlow[id.x * 3u + 2u], 0);
}

@compute @workgroup_size(${WG})
fn p2g1(@builtin(global_invocation_id) id: vec3u) {
  if (id.x >= u32(P.grid.w)) { return; }
  let p = particles[id.x];
  let ci = vec3i(floor(p.position));
  var w = weights(p.position - vec3f(ci) - 0.5);
  for (var gx = 0; gx < 3; gx++) { for (var gy = 0; gy < 3; gy++) { for (var gz = 0; gz < 3; gz++) {
    let weight = w[gx].x * w[gy].y * w[gz].z;
    let c = ci + vec3i(gx - 1, gy - 1, gz - 1);
    let dist = (vec3f(c) - p.position) + 0.5;
    let q = p.C * dist;
    let vel = weight * (p.v + q);
    let k = cellIndex(c);
    atomicAdd(&cells[k].mass, enc(weight));
    atomicAdd(&cells[k].vx, enc(vel.x)); atomicAdd(&cells[k].vy, enc(vel.y)); atomicAdd(&cells[k].vz, enc(vel.z));
  }}}
}

@compute @workgroup_size(${WG})
fn p2g2(@builtin(global_invocation_id) id: vec3u) {
  if (id.x >= u32(P.grid.w)) { return; }
  let p = particles[id.x];
  let ci = vec3i(floor(p.position));
  var w = weights(p.position - vec3f(ci) - 0.5);
  var density = 0.0;
  for (var gx = 0; gx < 3; gx++) { for (var gy = 0; gy < 3; gy++) { for (var gz = 0; gz < 3; gz++) {
    let weight = w[gx].x * w[gy].y * w[gz].z;
    density += dec(atomicLoad(&cells[cellIndex(ci + vec3i(gx - 1, gy - 1, gz - 1))].mass)) * weight;
  }}}
  let volume = 1.0 / max(density, 1e-4);
  let pressure = max(0.0, P.sim.z * (pow(density / P.sim.w, 5.0) - 1.0)); // no tension: water doesn't cling like jelly
  var stress = mat3x3f(-pressure, 0.0, 0.0, 0.0, -pressure, 0.0, 0.0, 0.0, -pressure);
  let strain = p.C + transpose(p.C);
  stress += P.misc.x * strain;
  let eq16 = -volume * 4.0 * P.sim.x * stress;
  for (var gx = 0; gx < 3; gx++) { for (var gy = 0; gy < 3; gy++) { for (var gz = 0; gz < 3; gz++) {
    let weight = w[gx].x * w[gy].y * w[gz].z;
    let c = ci + vec3i(gx - 1, gy - 1, gz - 1);
    let dist = (vec3f(c) - p.position) + 0.5;
    let m = (eq16 * weight) * dist;
    let k = cellIndex(c);
    atomicAdd(&cells[k].vx, enc(m.x)); atomicAdd(&cells[k].vy, enc(m.y)); atomicAdd(&cells[k].vz, enc(m.z));
  }}}
}

@compute @workgroup_size(${WG})
fn updateGrid(@builtin(global_invocation_id) id: vec3u) {
  let g = gdim();
  if (id.x >= u32(g.x * g.y * g.z)) { return; }
  let mass = dec(atomicLoad(&cells[id.x].mass));
  if (mass <= 0.0) { return; }
  var v = vec3f(dec(atomicLoad(&cells[id.x].vx)), dec(atomicLoad(&cells[id.x].vy)), dec(atomicLoad(&cells[id.x].vz))) / mass;
  v.y += P.sim.y * P.sim.x;
  let x = i32(id.x) / (g.y * g.z);
  let y = (i32(id.x) / g.z) % g.y;
  let z = i32(id.x) % g.z;
  // a hand in the water: the cells it occupies move with it, and water is pushed out of it
  if (P.misc.z > 0.5) {
    let d = vec2f(f32(x) + 0.5 - P.hand.x, f32(z) + 0.5 - P.hand.z);
    let r = length(d);
    if (r < P.hand.w && f32(y) + 0.5 > P.hand.y) {
      let outward = select(vec2f(0.0), d / r, r > 1e-3);
      let push = (1.0 - r / P.hand.w) * 1.2;
      let goal = vec3f(P.handV.x + outward.x * push, v.y, P.handV.z + outward.y * push);
      v = mix(v, goal, 0.45 * (1.0 - r / P.hand.w) + 0.15);
    }
  }
  if (x < 2 || x > g.x - 3) { v.x = 0.0; }
  if (y < 2 || y > g.y - 3) { v.y = 0.0; }
  if (z < 2 || z > g.z - 3) { v.z = 0.0; }
  atomicStore(&cells[id.x].vx, enc(v.x)); atomicStore(&cells[id.x].vy, enc(v.y)); atomicStore(&cells[id.x].vz, enc(v.z));
}

@compute @workgroup_size(${WG})
fn g2p(@builtin(global_invocation_id) id: vec3u) {
  if (id.x >= u32(P.grid.w)) { return; }
  var p = particles[id.x];
  let ci = vec3i(floor(p.position));
  var w = weights(p.position - vec3f(ci) - 0.5);
  var B = mat3x3f(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
  var v = vec3f(0.0);
  for (var gx = 0; gx < 3; gx++) { for (var gy = 0; gy < 3; gy++) { for (var gz = 0; gz < 3; gz++) {
    let weight = w[gx].x * w[gy].y * w[gz].z;
    let c = ci + vec3i(gx - 1, gy - 1, gz - 1);
    let dist = (vec3f(c) - p.position) + 0.5;
    let k = cellIndex(c);
    let wv = weight * vec3f(dec(atomicLoad(&cells[k].vx)), dec(atomicLoad(&cells[k].vy)), dec(atomicLoad(&cells[k].vz)));
    v += wv;
    B += mat3x3f(wv * dist.x, wv * dist.y, wv * dist.z);
  }}}
  p.C = B * 4.0;
  p.v = v;
  p.position += v * P.sim.x;
  let g = vec3f(P.grid.xyz);
  // a stiff wall a cell in from the edge keeps particles off the boundary cells
  let lo = vec3f(1.0);
  let hi = g - 2.0;
  let next = p.position + v * P.sim.x * 3.0;
  let wallK = 0.12;
  if (next.x < lo.x + 1.0) { p.v.x += wallK * (lo.x + 1.0 - next.x); }
  if (next.x > hi.x - 1.0) { p.v.x += wallK * (hi.x - 1.0 - next.x); }
  if (next.y < lo.y + 1.0) { p.v.y += wallK * (lo.y + 1.0 - next.y); }
  if (next.z < lo.z + 1.0) { p.v.z += wallK * (lo.z + 1.0 - next.z); }
  if (next.z > hi.z - 1.0) { p.v.z += wallK * (hi.z - 1.0 - next.z); }
  p.position = clamp(p.position, lo, hi);
  particles[id.x] = p;
  out[id.x] = vec4f(p.position, length(p.v));
  // surface: the highest particle in each column, and the flow of the water near it
  let col = i32(p.position.x) * i32(P.grid.z) + i32(p.position.z);
  atomicMax(&heights[col], i32(p.position.y * 1000.0));
  if (p.position.y * 1000.0 > f32(prevHeights[col]) - P.misc.w * 1000.0) {
    atomicAdd(&colFlow[col * 3], i32(p.v.x * 10000.0));
    atomicAdd(&colFlow[col * 3 + 1], i32(p.v.z * 10000.0));
    atomicAdd(&colFlow[col * 3 + 2], 1);
  }
}
`;

export class FluidGPU {
  /**
   * @param {GPUDevice} device
   * @param {{grid: number[], fill: number[][], spacing?: number}} opts grid = [GX,GY,GZ];
   *   fill = [[x0,x1],[y0,y1],[z0,z1]] in cells: the box the water starts in.
   */
  constructor(device, { grid, fill, spacing = 0.62 }) {
    this.device = device;
    this.grid = grid;
    const [GX, GY, GZ] = grid;
    this.cellsCount = GX * GY * GZ;
    this.cols = GX * GZ;

    // seed particles on a jittered lattice
    const pos = [];
    for (let x = fill[0][0]; x < fill[0][1]; x += spacing) {
      for (let y = fill[1][0]; y < fill[1][1]; y += spacing) {
        for (let z = fill[2][0]; z < fill[2][1]; z += spacing) {
          pos.push(x + (Math.random() - 0.5) * 0.2 * spacing, y + (Math.random() - 0.5) * 0.2 * spacing, z + (Math.random() - 0.5) * 0.2 * spacing);
        }
      }
    }
    this.count = pos.length / 3;
    const PSTRIDE = 80 / 4; // floats per Particle (vec3 pads to 16 bytes; mat3x3 is 3 × 16)
    const pdata = new Float32Array(this.count * PSTRIDE);
    for (let i = 0; i < this.count; i++) pdata.set(pos.slice(i * 3, i * 3 + 3), i * PSTRIDE);
    this.initialParticles = pdata;

    const S = GPUBufferUsage;
    this.particleBuf = device.createBuffer({ size: pdata.byteLength, usage: S.STORAGE | S.COPY_DST });
    device.queue.writeBuffer(this.particleBuf, 0, pdata);
    this.cellBuf = device.createBuffer({ size: this.cellsCount * 16, usage: S.STORAGE });
    this.paramBuf = device.createBuffer({ size: 5 * 16, usage: S.UNIFORM | S.COPY_DST });
    this.outBuf = device.createBuffer({ size: this.count * 16, usage: S.STORAGE | S.COPY_SRC });
    this.heightBufs = [0, 1].map(() => device.createBuffer({ size: this.cols * 4, usage: S.STORAGE | S.COPY_SRC | S.COPY_DST }));
    this.flowBuf = device.createBuffer({ size: this.cols * 12, usage: S.STORAGE | S.COPY_SRC });
    this.readBytes = this.count * 16 + this.cols * 4 + this.cols * 12;
    this.staging = [0, 1].map(() => ({ buf: device.createBuffer({ size: this.readBytes, usage: S.MAP_READ | S.COPY_DST }), busy: false }));
    this.frameNo = 0;

    const module = device.createShaderModule({ code: SHADER });
    module.getCompilationInfo?.().then((info) => { for (const m of info.messages) if (m.type === 'error') console.error(`WGSL ${m.lineNum}:${m.linePos} ${m.message}`); });
    const layout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const pipe = (entryPoint) => device.createComputePipeline({ layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }), compute: { module, entryPoint } });
    this.pipes = Object.fromEntries(['clearGrid', 'clearColumns', 'p2g1', 'p2g2', 'updateGrid', 'g2p'].map((n) => [n, pipe(n)]));
    // two bind groups: they swap which height buffer is written and which is read
    this.bindGroups = [0, 1].map((k) => device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: this.particleBuf } },
        { binding: 1, resource: { buffer: this.cellBuf } },
        { binding: 2, resource: { buffer: this.paramBuf } },
        { binding: 3, resource: { buffer: this.outBuf } },
        { binding: 4, resource: { buffer: this.heightBufs[k] } },
        { binding: 5, resource: { buffer: this.heightBufs[1 - k] } },
        { binding: 6, resource: { buffer: this.flowBuf } },
      ],
    }));

    this.params = {
      dt: 0.15, gravity: -0.2, stiffness: 14, restDensity: 4, viscosity: 0.005, band: 1.6,
      hand: null, // {x, bottom, z, r, vx, vy, vz} in cells
    };
    this.latest = null; // {particles: Float32Array(count*4), heights: Int32Array, flow: Int32Array}
  }

  static async create(opts) {
    if (!navigator.gpu) return null;
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return null;
    const device = await adapter.requestDevice();
    return new FluidGPU(device, opts);
  }

  reset() {
    this.device.queue.writeBuffer(this.particleBuf, 0, this.initialParticles);
  }

  writeParams() {
    const p = this.params, [GX, GY, GZ] = this.grid, h = p.hand;
    const a = new Float32Array([
      GX, GY, GZ, this.count,
      p.dt, p.gravity, p.stiffness, p.restDensity,
      p.viscosity, 1e6, h ? 1 : 0, p.band,
      h ? h.x : 0, h ? h.bottom : 0, h ? h.z : 0, h ? h.r : 0,
      h ? h.vx : 0, h ? h.vy : 0, h ? h.vz : 0, 0,
    ]);
    this.device.queue.writeBuffer(this.paramBuf, 0, a);
  }

  /** Run `substeps` steps on the GPU and queue a read-back of the result. */
  step(substeps = 2) {
    const d = this.device;
    this.writeParams();
    const k = this.frameNo++ & 1;
    const bg = this.bindGroups[k];
    const enc = d.createCommandEncoder();
    const pass = enc.beginComputePass();
    const run = (name, n) => { pass.setPipeline(this.pipes[name]); pass.setBindGroup(0, bg); pass.dispatchWorkgroups(Math.ceil(n / WG)); };
    run('clearColumns', this.cols);
    for (let s = 0; s < substeps; s++) {
      run('clearGrid', this.cellsCount);
      run('p2g1', this.count);
      run('p2g2', this.count);
      run('updateGrid', this.cellsCount);
      run('g2p', this.count);
    }
    pass.end();
    // read back into whichever staging buffer is free; skip a frame if both are in flight
    const st = this.staging.find((s) => !s.busy);
    if (st) {
      enc.copyBufferToBuffer(this.outBuf, 0, st.buf, 0, this.count * 16);
      enc.copyBufferToBuffer(this.heightBufs[k], 0, st.buf, this.count * 16, this.cols * 4);
      enc.copyBufferToBuffer(this.flowBuf, 0, st.buf, this.count * 16 + this.cols * 4, this.cols * 12);
    }
    d.queue.submit([enc.finish()]);
    if (st) {
      st.busy = true;
      st.buf.mapAsync(GPUMapMode.READ).then(() => {
        const r = st.buf.getMappedRange();
        const copy = r.slice(0);
        st.buf.unmap();
        st.busy = false;
        this.latest = {
          particles: new Float32Array(copy, 0, this.count * 4),
          heights: new Int32Array(copy, this.count * 16, this.cols),
          flow: new Int32Array(copy, this.count * 16 + this.cols * 4, this.cols * 3),
        };
      }).catch(() => { st.busy = false; });
    }
  }
}
