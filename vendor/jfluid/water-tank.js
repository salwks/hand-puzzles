function j() {
  return {
    timeScale: 2,
    maxTimestepFPS: 60,
    iterationsPerFrame: 2,
    gravity: -10,
    collisionDamping: 0.95,
    smoothingRadius: 0.2,
    targetDensity: 630,
    pressureMultiplier: 288,
    nearPressureMultiplier: 2.16,
    viscosityStrength: 0.01,
    boundsSize: { x: 24, y: 10, z: 15 },
    showObstacle: !0,
    obstacleShape: "box",
    obstacleRadius: 0,
    obstacleSize: { x: 0, y: 0, z: 0 },
    obstacleCentre: { x: 0, y: -5, z: 0 },
    // y is the bottom of the obstacle (floor level)
    obstacleRotation: { x: 0, y: 0, z: 0 },
    obstacleColor: { r: 1, g: 0, b: 0 },
    obstacleAlpha: 0.8,
    interactionRadius: 2,
    interactionStrength: 50,
    particleRadius: 2.5,
    // In pixels, same as 2D
    // Unity Fluid Particles scene: particleSpawnDensity = 600
    spawnDensity: 600,
    initialVelocity: { x: 0, y: 0, z: 0 },
    jitterStr: 0.035,
    // Match Unity Fluid Particles scene spawn regions
    spawnRegions: [
      { position: { x: -8.3, y: -1.3, z: 3.65 }, size: { x: 7, y: 7, z: 7 } },
      { position: { x: -8.3, y: -1.3, z: -3.65 }, size: { x: 7, y: 7, z: 7 } }
    ]
  };
}
function K() {
  return {
    // Lighting (from basic demo defaults)
    dirToSun: { x: -0.83, y: 0.42, z: -0.36 },
    floorAmbient: 0.58,
    sceneExposure: 1.1,
    sunBrightness: 1,
    // Sky
    skyColorHorizon: { r: 1, g: 1, b: 1 },
    skyColorZenith: { r: 0.08, g: 0.37, b: 0.73 },
    skyColorGround: { r: 0.55, g: 0.5, b: 0.55 },
    sunPower: 500,
    // Floor
    floorSize: { x: 100, y: 1, z: 100 },
    floorCenter: { x: 0, y: -5.5, z: 0 },
    tileScale: 1,
    tileDarkFactor: -0.35,
    // HSV Value shift for checker pattern
    // Unity Fluid Raymarch scene colors
    tileCol1: { r: 0.20392157, g: 0.5176471, b: 0.7764706 },
    // Light Blue
    tileCol2: { r: 0.6081319, g: 0.36850303, b: 0.8584906 },
    // Purple
    tileCol3: { r: 0.3019758, g: 0.735849, b: 0.45801795 },
    // Green
    tileCol4: { r: 0.8018868, g: 0.6434483, b: 0.36690104 },
    // Yellow/Brown
    tileColVariation: { x: 0.33, y: 0, z: 0.47 },
    globalBrightness: 1,
    globalSaturation: 1
  };
}
function Q(r, e, n, i) {
  let t = e;
  r[t++] = n.dirToSun.x, r[t++] = n.dirToSun.y, r[t++] = n.dirToSun.z, r[t++] = n.floorAmbient, r[t++] = n.skyColorHorizon.r, r[t++] = n.skyColorHorizon.g, r[t++] = n.skyColorHorizon.b, r[t++] = n.sunPower, r[t++] = n.skyColorZenith.r, r[t++] = n.skyColorZenith.g, r[t++] = n.skyColorZenith.b, r[t++] = n.sceneExposure, r[t++] = n.skyColorGround.r, r[t++] = n.skyColorGround.g, r[t++] = n.skyColorGround.b, r[t++] = 0, r[t++] = n.floorSize.x, r[t++] = n.floorSize.y, r[t++] = n.floorSize.z, r[t++] = n.tileScale, r[t++] = n.floorCenter.x, r[t++] = n.floorCenter.y, r[t++] = n.floorCenter.z, r[t++] = n.tileDarkFactor, r[t++] = n.tileCol1.r, r[t++] = n.tileCol1.g, r[t++] = n.tileCol1.b, r[t++] = n.sunBrightness, r[t++] = n.tileCol2.r, r[t++] = n.tileCol2.g, r[t++] = n.tileCol2.b, r[t++] = n.globalBrightness, r[t++] = n.tileCol3.r, r[t++] = n.tileCol3.g, r[t++] = n.tileCol3.b, r[t++] = n.globalSaturation, r[t++] = n.tileCol4.r, r[t++] = n.tileCol4.g, r[t++] = n.tileCol4.b, r[t++] = 0, r[t++] = n.tileColVariation.x, r[t++] = n.tileColVariation.y, r[t++] = n.tileColVariation.z, r[t++] = 0;
  const a = i.showObstacle !== !1, o = (i.obstacleShape ?? "box") === "sphere";
  r[t++] = i.obstacleCentre.x, r[t++] = o ? i.obstacleCentre.y : i.obstacleCentre.y + i.obstacleSize.y * 0.5, r[t++] = i.obstacleCentre.z, r[t++] = 0;
  const c = i.obstacleRadius ?? 0, l = a ? o ? c : i.obstacleSize.x * 0.5 : 0, f = a ? o ? c : i.obstacleSize.y * 0.5 : 0, p = a ? o ? c : i.obstacleSize.z * 0.5 : 0;
  r[t++] = l, r[t++] = f, r[t++] = p, r[t++] = 0, r[t++] = i.obstacleRotation.x, r[t++] = i.obstacleRotation.y, r[t++] = i.obstacleRotation.z, r[t++] = a ? i.obstacleAlpha ?? 0.8 : 0;
  const u = i.obstacleColor ?? { r: 1, g: 0, b: 0 };
  r[t++] = u.r, r[t++] = u.g, r[t++] = u.b, r[t++] = o ? 1 : 0;
}
function $(r) {
  let e = r >>> 0;
  return () => (e = 1664525 * e + 1013904223 >>> 0, e / 4294967296);
}
function J(r, e) {
  const n = r.x * r.y * r.z, i = Math.ceil(n * e), t = Math.pow(i / n, 1 / 3);
  return {
    x: Math.max(1, Math.ceil(r.x * t)),
    y: Math.max(1, Math.ceil(r.y * t)),
    z: Math.max(1, Math.ceil(r.z * t))
  };
}
function ee(r, e) {
  const n = r.size, i = r.position, t = J(n, e), a = new Array(t.x * t.y * t.z);
  let s = 0;
  for (let o = 0; o < t.z; o += 1)
    for (let c = 0; c < t.y; c += 1)
      for (let l = 0; l < t.x; l += 1) {
        const f = t.x === 1 ? 0.5 : l / (t.x - 1), p = t.y === 1 ? 0.5 : c / (t.y - 1), u = t.z === 1 ? 0.5 : o / (t.z - 1), g = (f - 0.5) * n.x + i.x, P = (p - 0.5) * n.y + i.y, h = (u - 0.5) * n.z + i.z;
        a[s] = { x: g, y: P, z: h }, s += 1;
      }
  return a;
}
function ne(r) {
  const e = $(42), n = [];
  for (const s of r.spawnRegions) {
    const o = ee(s, r.spawnDensity);
    for (const c of o) {
      const l = (e() - 0.5) * r.jitterStr, f = (e() - 0.5) * r.jitterStr, p = (e() - 0.5) * r.jitterStr;
      n.push({
        x: c.x + l,
        y: c.y + f,
        z: c.z + p
      });
    }
  }
  const i = n.length, t = new Float32Array(i * 4), a = new Float32Array(i * 4);
  for (let s = 0; s < i; s += 1) {
    const o = s * 4;
    t[o] = n[s].x, t[o + 1] = n[s].y, t[o + 2] = n[s].z, t[o + 3] = 1, a[o] = r.initialVelocity.x, a[o + 1] = r.initialVelocity.y, a[o + 2] = r.initialVelocity.z, a[o + 3] = 0;
  }
  return { positions: t, velocities: a, count: i };
}
class M {
  /**
   * Beginner note:
   * These GPU buffers are the simulation's "state." Shaders read/write them
   * directly; the CPU only updates uniforms or recreates buffers on reset.
   */
  static DEFAULT_MAX_FOAM_PARTICLES = 128e4;
  // --- Core Particle Data (SoA) ---
  positions;
  predicted;
  velocities;
  densities;
  // --- Spatial Hashing / Sorting ---
  keys;
  indices;
  sortOffsets;
  // Linear Grid specific
  particleCellOffsets = null;
  // Standard specific
  spatialOffsets = null;
  sortedKeys = null;
  // --- Hierarchical Prefix Sum ---
  groupSumsL1;
  groupSumsL2;
  scanScratch;
  // --- Sorted Physical Data (Cache optimization) ---
  positionsSorted;
  predictedSorted;
  velocitiesSorted;
  // --- Rendering & Culling ---
  visibleIndices;
  indirectDraw;
  // --- Optional Foam System ---
  foamPositions = null;
  foamVelocities = null;
  foamCounter = null;
  maxFoamParticles;
  // --- Readback (Debug) ---
  velocityReadback;
  densityReadback;
  particleCount;
  device;
  constructor(e, n, i = {}) {
    this.device = e, this.particleCount = n.count;
    const {
      gridTotalCells: t,
      includeFoam: a,
      maxFoamParticles: s = M.DEFAULT_MAX_FOAM_PARTICLES
    } = i;
    if (this.positions = this.createBufferFromArray(
      n.positions,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.predicted = this.createBufferFromArray(
      new Float32Array(n.positions),
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.velocities = this.createBufferFromArray(
      n.velocities,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    ), this.densities = this.createEmptyBuffer(
      n.count * 2 * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    ), this.keys = this.createEmptyBuffer(
      n.count * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.indices = this.createEmptyBuffer(
      n.count * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), t !== void 0) {
      this.particleCellOffsets = this.createEmptyBuffer(
        n.count * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      ), this.sortOffsets = this.createEmptyBuffer(
        (t + 1) * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      );
      const o = Math.ceil((t + 1) / 512), c = Math.ceil(o / 512);
      this.groupSumsL1 = this.createEmptyBuffer(
        o * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      ), this.groupSumsL2 = this.createEmptyBuffer(
        c * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      );
    } else {
      this.sortOffsets = this.createEmptyBuffer(
        n.count * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      ), this.spatialOffsets = this.createEmptyBuffer(
        n.count * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      ), this.sortedKeys = this.createEmptyBuffer(
        n.count * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      );
      const o = Math.ceil(n.count / 512), c = Math.ceil(o / 512);
      this.groupSumsL1 = this.createEmptyBuffer(
        o * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      ), this.groupSumsL2 = this.createEmptyBuffer(
        c * 4,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      );
    }
    this.scanScratch = this.createEmptyBuffer(
      4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.positionsSorted = this.createEmptyBuffer(
      n.count * 16,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.predictedSorted = this.createEmptyBuffer(
      n.count * 16,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.velocitiesSorted = this.createEmptyBuffer(
      n.count * 16,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.visibleIndices = this.createEmptyBuffer(
      n.count * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.indirectDraw = this.createEmptyBuffer(
      16,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.INDIRECT
    ), a ? (this.foamPositions = this.createEmptyBuffer(
      s * 16,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.foamVelocities = this.createEmptyBuffer(
      s * 16,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.foamCounter = this.createEmptyBuffer(
      4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ), this.maxFoamParticles = s) : this.maxFoamParticles = 0, this.velocityReadback = e.createBuffer({
      size: n.count * 16,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    }), this.densityReadback = e.createBuffer({
      size: n.count * 8,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
  }
  createBufferFromArray(e, n) {
    const i = this.device.createBuffer({
      size: e.byteLength,
      usage: n,
      mappedAtCreation: !0
    });
    return (e instanceof Float32Array ? new Float32Array(i.getMappedRange()) : new Uint32Array(i.getMappedRange())).set(e), i.unmap(), i;
  }
  createEmptyBuffer(e, n) {
    return this.device.createBuffer({ size: e, usage: n });
  }
  destroy() {
    this.positions.destroy(), this.predicted.destroy(), this.velocities.destroy(), this.densities.destroy(), this.keys.destroy(), this.indices.destroy(), this.sortOffsets.destroy(), this.groupSumsL1.destroy(), this.groupSumsL2.destroy(), this.scanScratch.destroy(), this.positionsSorted.destroy(), this.predictedSorted.destroy(), this.velocitiesSorted.destroy(), this.visibleIndices.destroy(), this.indirectDraw.destroy(), this.velocityReadback.destroy(), this.densityReadback.destroy(), this.particleCellOffsets?.destroy(), this.spatialOffsets?.destroy(), this.sortedKeys?.destroy(), this.foamPositions?.destroy(), this.foamVelocities?.destroy(), this.foamCounter?.destroy();
  }
}
const te = `/**
 * ============================================================================
 * LINEAR GRID HASH KERNEL
 * ============================================================================
 *
 * Pipeline Stage: 2 of 8 (After external forces)
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Assigns each particle to a Linear Grid Index based on its predicted position.
 * This is the first step of the O(1) neighbor search acceleration.
 *
 * Linear Grid vs Spatial Hash:
 * ----------------------------
 * Instead of hashing (which has collisions), we use a deterministic mapping
 * from 3D cell coordinates to a 1D index:
 *
 *   index = x + width * (y + height * z)
 *
 * Requirements:
 * - Fixed simulation bounds (minBounds, maxBounds)
 * - Grid resolution calculated from bounds / radius
 * - Particles outside bounds are clamped to the nearest boundary cell
 *
 * Advantages:
 * - No hash collisions (two particles in different cells never share a key)
 * - Contiguous X-rows allow "Strip Optimization" in neighbor search
 * - Deterministic iteration order
 *
 * Output:
 * -------
 *   keys[i]    = grid index for particle i
 *   indices[i] = i (original particle index, preserved through sorting)
 * ============================================================================
 */

// Beginner note: keys[] are cell IDs used for sorting; indices[] keeps the original index.

/**
 * Hash Parameters Uniform Buffer
 *
 * Memory Layout (32 bytes, two vec4-sized rows):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    radius         - Grid cell size (= smoothing radius)
 *   4      4    particleCount  - Number of particles (as f32)
 *   8      4    minBoundsX     - Minimum X of simulation domain
 *  12      4    minBoundsY     - Minimum Y of simulation domain
 *  16      4    minBoundsZ     - Minimum Z of simulation domain
 *  20      4    gridResX       - Grid resolution along X axis
 *  24      4    gridResY       - Grid resolution along Y axis
 *  28      4    gridResZ       - Grid resolution along Z axis
 * ------
 * Total: 32 bytes
 */
struct HashParams {
  radius: f32,
  particleCount: f32,
  minBoundsX: f32,
  minBoundsY: f32,
  minBoundsZ: f32,
  gridResX: f32,
  gridResY: f32,
  gridResZ: f32,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Linear Grid Hash compute pass
//
//   Binding 0: predicted[]  - Predicted particle positions from external forces
//              Format: vec4<f32> per particle (xyz = position, w = 1.0)
//
//   Binding 1: keys[]       - Output linear grid indices (one u32 per particle)
//              These keys are deterministic (no collisions) and contiguous
//              along the X axis for strip optimisation in neighbor search
//
//   Binding 2: indices[]    - Output original particle indices (identity mapping)
//              Tracks which particle each key belongs to after sorting
//
//   Binding 3: params       - Uniform hash parameters (radius, bounds, resolution)
// ============================================================================

@group(0) @binding(0) var<storage, read> predicted: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> keys: array<u32>;
@group(0) @binding(2) var<storage, read_write> indices: array<u32>;
@group(0) @binding(3) var<uniform> params: HashParams;

/**
 * Converts a 3D world-space position to a linear grid index.
 *
 * Steps:
 *   1. Shift position into local space: pos - minBounds
 *   2. Divide by cell size (radius) to get cell coordinates
 *   3. Clamp to [0, gridRes - 1] on each axis (boundary safety)
 *   4. Linearise: index = x + width × (y + height × z)
 *
 * The clamp ensures particles slightly outside the domain are assigned to
 * the nearest boundary cell rather than producing out-of-range indices.
 *
 * @param pos - World-space position
 * @returns Linear grid index in [0, gridTotalCells - 1]
 */
fn getGridIndex(pos: vec3<f32>) -> u32 {
    let gridRes = vec3<u32>(u32(params.gridResX), u32(params.gridResY), u32(params.gridResZ));
    let minBounds = vec3<f32>(params.minBoundsX, params.minBoundsY, params.minBoundsZ);
    
    let localPos = pos - minBounds;
    
    // Clamp to valid grid range [0, gridRes-1]
    let cellX = u32(clamp(floor(localPos.x / params.radius), 0.0, f32(gridRes.x - 1u)));
    let cellY = u32(clamp(floor(localPos.y / params.radius), 0.0, f32(gridRes.y - 1u)));
    let cellZ = u32(clamp(floor(localPos.z / params.radius), 0.0, f32(gridRes.z - 1u)));
    
    // Linear index: x + width * (y + height * z)
    return cellX + gridRes.x * (cellY + gridRes.y * cellZ);
}

/**
 * Main Compute Kernel
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 * Each thread processes exactly one particle.
 *
 * Writes:
 *   keys[i]    = linear grid index for particle i
 *   indices[i] = i (identity mapping, preserved through sorting)
 */
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;

  // Convert float particle count to integer with rounding
  let count = u32(params.particleCount + 0.5);

  // Bounds check: one thread per particle
  if (index >= count) {
    return;
  }

  // Compute deterministic grid index from predicted position
  let pos = predicted[index].xyz;
  keys[index] = getGridIndex(pos);

  // Store identity mapping (will be rearranged by scatter)
  indices[index] = index;
}
`, Y = `/**
 * ============================================================================
 * COUNTING SORT KERNELS (LINEAR GRID)
 * ============================================================================
 *
 * Pipeline Stage: Part of Stage 3 (Counting Sort)
 * Entry Points: clearOffsets, countOffsets
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Prepares the histogram for the Linear Grid sort.
 *
 * Key Changes from Spatial Hash:
 * - We compute a "Rank" (local offset) for each particle within its cell
 *   using atomicAdd. This is stored in \`particleCellOffsets\`.
 * - This Rank + Start (from Prefix Sum) allows for a contention-free Scatter pass.
 *
 * ============================================================================
 */

// Beginner note: clearOffsets zeros the histogram, countOffsets fills it and
// records each particle’s local rank within its grid cell.

/**
 * Sort Parameters Uniform Buffer
 *
 * Memory Layout (16-byte aligned):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    particleCount   - Total number of particles
 *   4      4    gridTotalCells  - Total cells in the linear grid
 *   8      8    pad0            - Padding for 16-byte alignment
 * ------
 * Total: 16 bytes
 */
struct SortParams {
  particleCount: u32,
  gridTotalCells: u32,
  pad0: vec2<u32>,
};

// ============================================================================
// KERNEL 1: CLEAR OFFSETS
// ============================================================================
// Bind Group 0: Used exclusively by clearOffsets
//
//   Binding 0: sortOffsets[] - Histogram / prefix-sum buffer to clear
//              Size: (gridTotalCells + 1) elements
//              The extra "+1" element serves as a sentinel: after prefix sum,
//              sortOffsets[gridTotalCells] holds the total particle count,
//              which is the "end" index for the last occupied cell.
//
//   Binding 1: params        - Uniform with grid cell count
// ============================================================================

@group(0) @binding(0) var<storage, read_write> sortOffsets: array<atomic<u32>>;
@group(0) @binding(1) var<uniform> params: SortParams;

/**
 * Clear Offsets Kernel
 *
 * Zeros all histogram entries including the sentinel element.
 * Must run before countOffsets to ensure a clean histogram.
 *
 * Dispatch: ceil((gridTotalCells + 1) / 256) workgroups
 */
@compute @workgroup_size(256)
fn clearOffsets(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;

  // Bounds check: includes the sentinel at position gridTotalCells
  if (index > params.gridTotalCells) {
    return;
  }

  atomicStore(&sortOffsets[index], 0u);
}

// ============================================================================
// KERNEL 2: COUNT OFFSETS & COMPUTE RANK
// ============================================================================
// Bind Group 1: Used exclusively by countOffsets
// (Separate group number to allow different pipeline layout from clearOffsets)
//
//   Binding 0: keys[]                - Linear grid indices from hash_linear.wgsl
//   Binding 1: sortOffsetsCount[]    - Histogram buffer (aliased with sortOffsets)
//              Type: atomic<u32> for thread-safe increment
//   Binding 2: countParams           - Uniform with particle count
//   Binding 3: particleCellOffsets[] - Output: per-particle rank within its cell
//              The rank is the return value of atomicAdd (0-based offset)
// ============================================================================

@group(1) @binding(0) var<storage, read> keys: array<u32>;
@group(1) @binding(1) var<storage, read_write> sortOffsetsCount: array<atomic<u32>>;
@group(1) @binding(2) var<uniform> countParams: SortParams;
@group(1) @binding(3) var<storage, read_write> particleCellOffsets: array<u32>;

/**
 * Count Offsets & Compute Rank Kernel
 *
 * Builds a histogram of particles per grid cell AND simultaneously computes
 * each particle's local rank (offset) within its cell.
 *
 * The rank is the key difference from the spatial-hash variant: it enables
 * the scatter pass to compute destination indices without contention
 * (dest = start + rank), eliminating atomicAdd from the scatter.
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn countOffsets(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;

  // Bounds check: one thread per particle
  if (index >= countParams.particleCount) {
    return;
  }

  let key = keys[index];

  // atomicAdd returns the OLD value, which is the 0-based rank of this
  // particle among all particles in the same cell. Subsequent particles
  // in the same cell get incrementing ranks (1, 2, 3, ...).
  particleCellOffsets[index] = atomicAdd(&sortOffsetsCount[key], 1u);
}
`, ie = `/**
 * ============================================================================
 * PARALLEL PREFIX SUM (SCAN) SHADER - BLELLOCH ALGORITHM
 * ============================================================================
 *
 * Pipeline Stage: Part of Stage 3 (Counting Sort)
 * Entry Points: blockScan, blockCombine
 * Workgroup Size: 256 threads (processes 512 elements per workgroup)
 *
 * Purpose:
 * --------
 * Computes the exclusive prefix sum (scan) of the histogram array.
 * This transforms counts into starting offsets for each bucket:
 *
 *   Input:   [2, 1, 3, 2, 0, 1]  <- counts per bucket
 *   Output:  [0, 2, 3, 6, 8, 8]  <- starting index for each bucket
 *
 * The output tells us: "Bucket k starts at index offsets[k]"
 *
 * Blelloch Scan Algorithm:
 * ------------------------
 * The Blelloch scan is a work-efficient parallel algorithm with two phases:
 *
 * PHASE 1: UP-SWEEP (Reduction)
 * Build a balanced binary tree of partial sums from leaves to root.
 *
 *   Level 0:  [a₀] [a₁] [a₂] [a₃] [a₄] [a₅] [a₆] [a₇]  <- Input
 *              ↘↙     ↘↙     ↘↙     ↘↙
 *   Level 1:  [a₀][a₀₁]  [a₂][a₂₃]  [a₄][a₄₅]  [a₆][a₆₇]
 *                  ↘↙          ↘↙
 *   Level 2:  [a₀][a₀₁][a₂][a₀₋₃]    [a₄][a₄₅][a₆][a₄₋₇]
 *                        ↘↙
 *   Level 3:  [a₀][a₀₁][a₂][a₀₋₃][a₄][a₄₅][a₆][TOTAL]  <- Root has total
 *
 * PHASE 2: DOWN-SWEEP (Distribution)
 * Traverse down the tree, propagating partial sums:
 *
 *   1. Set root to identity (0 for addition)
 *   2. At each level, for each node:
 *      - Left child = parent
 *      - Right child = parent + old left child
 *
 *   Result: Exclusive prefix sum at each position
 *
 * Hierarchical Processing (3 Levels):
 * ------------------------------------
 * For arrays larger than 512 elements, we use a 3-level hierarchy:
 *
 *   Level 0 (L0): Process 512-element blocks, save block totals
 *   Level 1 (L1): Scan block totals (if > 512 blocks, do another level)
 *   Level 2 (L2): Scan L1 totals (handles up to 512³ = 134M elements)
 *   Combine: Add scanned block totals back to each block
 *
 *     ┌─────────────────────────────────────────────────────────────┐
 *     │                    Input Array (N elements)                 │
 *     └─────────────────────────────────────────────────────────────┘
 *            ↓ blockScan L0
 *     ┌─────┬─────┬─────┬─────┬─────┐
 *     │ B0  │ B1  │ B2  │ B3  │ ... │  Each block scanned, totals saved
 *     └─────┴─────┴─────┴─────┴─────┘
 *     └──────── groupSums L0 ────────┘
 *            ↓ blockScan L1
 *     ┌─────────────────────────────┐
 *     │ Scanned group sums (L1)     │
 *     └─────────────────────────────┘
 *            ↓ blockCombine L0
 *     ┌─────────────────────────────────────────────────────────────┐
 *     │    Final prefix sum (each block + its scanned group sum)    │
 *     └─────────────────────────────────────────────────────────────┘
 *
 * Performance:
 * ------------
 * - O(n) work complexity (same as sequential)
 * - O(log n) step complexity (parallel depth)
 * - Shared memory reduces global memory bandwidth
 * - Each thread handles 2 elements (coalesced access)
 *
 * ============================================================================
 */

// Beginner note: scan turns per-cell counts into start offsets so each cell
// knows where its particles live in the sorted arrays.

/**
 * Scan Parameters Uniform Buffer
 *
 * Memory Layout (16-byte aligned):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    count   - Number of elements to scan
 *   4     12    pad0    - Padding for 16-byte alignment
 * ------
 * Total: 16 bytes
 */
struct Params {
  count: u32,
  pad0: vec3<u32>,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Prefix sum compute pass
//
//   Binding 0: data[]       - Input/output array (in-place scan)
//              Size: 'count' elements
//              Contains histogram on input, offsets on output
//
//   Binding 1: groupSums[]  - Block total sums for hierarchical scan
//              Size: ceil(count / 512) elements
//              Written by blockScan, read by next level
//
//   Binding 2: params       - Uniform with element count
//
//   Binding 3: scannedGroupSums[] - (for blockCombine only)
//              The group sums AFTER they've been scanned
//              Used to add block offsets in the combine phase
// ============================================================================

@group(0) @binding(0) var<storage, read_write> data: array<u32>;
@group(0) @binding(1) var<storage, read_write> groupSums: array<u32>;
@group(0) @binding(2) var<uniform> params: Params;

/**
 * Workgroup Shared Memory
 *
 * Size: 512 elements (2 per thread × 256 threads)
 *
 * Used for:
 * - Loading data from global memory (coalesced)
 * - Performing the up-sweep and down-sweep in fast shared memory
 * - Avoiding global memory round-trips during the algorithm
 */
var<workgroup> temp: array<u32, 512>;

/**
 * Block Scan Kernel (Blelloch Algorithm)
 *
 * Performs an exclusive prefix sum on a block of 512 elements.
 * Each workgroup processes one block independently.
 *
 * Dispatch: ceil(count / 512) workgroups
 *
 * Input: data[] contains histogram counts
 * Output:
 *   - data[] contains local prefix sums within each block
 *   - groupSums[] contains the total sum of each block
 *
 * The local prefix sums will be adjusted by blockCombine to create
 * the global prefix sum.
 *
 * Example (block of 8 elements for clarity):
 *   Input:     [2, 1, 3, 2, 0, 1, 2, 1]
 *   After scan: [0, 2, 3, 6, 8, 8, 9, 11]  <- Local exclusive scan
 *   Block sum:  12 (saved to groupSums)
 */
@compute @workgroup_size(256)
fn blockScan(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>, @builtin(workgroup_id) group_id: vec3<u32>) {
    let tid = local_id.x;       // Thread ID within workgroup [0, 255]
    let gid = global_id.x;      // Global thread ID
    let groupIndex = group_id.x; // Which block/workgroup

    // Each thread loads 2 elements (coalesced memory access pattern)
    let idx1 = 2u * gid;
    let idx2 = 2u * gid + 1u;
    let n = params.count;

    // Load from global memory to shared memory
    // Pad with 0 for elements beyond array bounds (handles non-power-of-2 sizes)
    if (idx1 < n) { temp[2u * tid] = data[idx1]; } else { temp[2u * tid] = 0u; }
    if (idx2 < n) { temp[2u * tid + 1u] = data[idx2]; } else { temp[2u * tid + 1u] = 0u; }

    // Synchronize: all threads must finish loading before we start the algorithm
    workgroupBarrier();

    // ========================================================================
    // PHASE 1: UP-SWEEP (REDUCTION)
    // ========================================================================
    // Build a tree of partial sums. After this phase, temp[511] contains
    // the total sum of all 512 elements.
    //
    // Iteration pattern (for 512 elements):
    //   d=256: 256 threads, offset=1  -> pairs at distance 1
    //   d=128: 128 threads, offset=2  -> pairs at distance 2
    //   d=64:   64 threads, offset=4  -> pairs at distance 4
    //   ...
    //   d=1:     1 thread,  offset=256 -> final pair at distance 256
    //
    // Each iteration halves the active threads and doubles the stride.
    var offset = 1u;
    for (var d = 256u; d > 0u; d = d >> 1u) {
        workgroupBarrier();
        if (tid < d) {
            // Indices into the binary tree:
            // ai = left child, bi = right child (bi = ai's sibling)
            let ai = offset * (2u * tid + 1u) - 1u;
            let bi = offset * (2u * tid + 2u) - 1u;
            // Sum flows up: right child = left + right
            temp[bi] = temp[bi] + temp[ai];
        }
        offset = offset * 2u;
    }

    // ========================================================================
    // SAVE BLOCK SUM & CLEAR ROOT
    // ========================================================================
    // Only thread 0 performs these operations (single-threaded section)
    if (tid == 0u) {
        // Save the total sum of this block for the next level of the hierarchy
        // This will be scanned to compute block offsets
        if (groupIndex < arrayLength(&groupSums)) {
            groupSums[groupIndex] = temp[511u];
        }
        // Clear the last element to start the down-sweep
        // This is what makes it an EXCLUSIVE scan (first output is 0)
        temp[511u] = 0u;
    }

    // ========================================================================
    // PHASE 2: DOWN-SWEEP (DISTRIBUTION)
    // ========================================================================
    // Propagate partial sums down the tree to compute prefix sums.
    //
    // At each node:
    //   1. Save left child value (t)
    //   2. Left child = current (parent's prefix sum)
    //   3. Right child = current + t (includes left subtree)
    //
    // Iteration pattern (reverse of up-sweep):
    //   d=1:     1 thread,  offset=256
    //   d=2:     2 threads, offset=128
    //   d=4:     4 threads, offset=64
    //   ...
    //   d=256: 256 threads, offset=1
    for (var d = 1u; d < 512u; d = d * 2u) {
        offset = offset >> 1u;
        workgroupBarrier();
        if (tid < d) {
            let ai = offset * (2u * tid + 1u) - 1u;
            let bi = offset * (2u * tid + 2u) - 1u;
            // Swap and accumulate
            let t = temp[ai];
            temp[ai] = temp[bi];
            temp[bi] = temp[bi] + t;
        }
    }

    // Final sync before writing results
    workgroupBarrier();

    // Write results back to global memory
    if (idx1 < n) { data[idx1] = temp[2u * tid]; }
    if (idx2 < n) { data[idx2] = temp[2u * tid + 1u]; }
}

// Binding for the combine phase (scanned group sums from level above)
@group(0) @binding(3) var<storage, read> scannedGroupSums: array<u32>;

/**
 * Block Combine Kernel
 *
 * After blockScan completes on all blocks:
 *   - Each block has its local exclusive scan
 *   - groupSums contains the total of each block
 *   - scannedGroupSums contains the exclusive scan of block totals
 *
 * This kernel adds the block's base offset to all elements in that block,
 * converting local scans to global scans.
 *
 * Example:
 *   Block 0 local scan: [0, 2, 5, 8]   scannedGroupSums[0] = 0
 *   Block 1 local scan: [0, 1, 4, 6]   scannedGroupSums[1] = 10
 *
 *   After combine:
 *   Block 0: [0, 2, 5, 8]     (unchanged, base = 0)
 *   Block 1: [10, 11, 14, 16] (each element + 10)
 *
 * Dispatch: ceil(count / 512) workgroups
 */
@compute @workgroup_size(256)
fn blockCombine(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(workgroup_id) group_id: vec3<u32>) {
    let groupIndex = group_id.x;

    // Block 0 already has the correct values (its base offset is 0)
    if (groupIndex == 0u) { return; }

    // Get the cumulative offset for this block from the scanned group sums
    // This is the sum of all elements in blocks 0 through (groupIndex - 1)
    let groupAdd = scannedGroupSums[groupIndex];

    // Each thread processes 2 elements
    let idx1 = 2u * global_id.x;
    let idx2 = 2u * global_id.x + 1u;
    let n = params.count;

    // Add the block offset to convert local scan to global scan
    if (idx1 < n) { data[idx1] = data[idx1] + groupAdd; }
    if (idx2 < n) { data[idx2] = data[idx2] + groupAdd; }
}
`, re = `/**
 * ============================================================================
 * SUBGROUP-OPTIMIZED PARALLEL PREFIX SUM (SCAN) SHADER
 * ============================================================================
 *
 * Pipeline Stage: Part of Stage 3 (Counting Sort)
 * Entry Points: blockScan, blockCombine
 * Workgroup Size: 256 threads (processes 512 elements per workgroup)
 *
 * Purpose:
 * --------
 * Same as prefix_sum.wgsl but uses subgroup operations for massive speedup.
 * Subgroup operations execute in a single instruction across all lanes in
 * a subgroup (typically 32 lanes on NVIDIA, 64 on AMD).
 *
 * Key Optimization:
 * -----------------
 * The Blelloch algorithm requires O(log n) iterations for the up-sweep and
 * down-sweep phases. With subgroups, we can do the entire prefix sum within
 * a subgroup in ONE instruction using subgroupExclusiveAdd().
 *
 * Algorithm:
 * ----------
 * 1. Each thread loads 2 values (512 total per workgroup)
 * 2. For each value, use subgroupExclusiveAdd() for instant within-subgroup scan
 * 3. Last lane of each subgroup writes subgroup total to shared memory
 * 4. Sequential scan of subgroup totals (only ~8-16 values)
 * 5. Each thread adds its subgroup's base offset
 * 6. Write results back to global memory
 *
 * Performance:
 * ------------
 * - Reduces log(512) = 9 iterations to effectively 3-4 steps
 * - Eliminates most workgroupBarrier() calls
 * - Single instruction for 32/64 element prefix sums
 *
 * ============================================================================
 */

// Enable subgroup operations
enable subgroups;

/**
 * Scan Parameters Uniform Buffer
 */
struct Params {
  count: u32,
  pad0: vec3<u32>,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================

@group(0) @binding(0) var<storage, read_write> data: array<u32>;
@group(0) @binding(1) var<storage, read_write> groupSums: array<u32>;
@group(0) @binding(2) var<uniform> params: Params;

/**
 * Workgroup Shared Memory
 *
 * Layout:
 * - temp[0..511]: Working space for 512 elements
 * - subgroupTotals[0..15]: Totals from each subgroup (256 threads / subgroup_size)
 */
var<workgroup> temp: array<u32, 512>;
var<workgroup> subgroupTotals: array<u32, 16>;  // Max 16 subgroups for 256 threads

/**
 * Block Scan Kernel (Subgroup-Optimized)
 *
 * Uses subgroupExclusiveAdd for instant within-subgroup prefix sums,
 * then combines subgroup results using shared memory.
 */
@compute @workgroup_size(256)
fn blockScan(
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>,
    @builtin(workgroup_id) group_id: vec3<u32>,
    @builtin(subgroup_size) sg_size: u32,
    @builtin(subgroup_invocation_id) sg_lane: u32
) {
    let tid = local_id.x;
    let gid = global_id.x;
    let groupIndex = group_id.x;
    let n = params.count;

    // Calculate subgroup ID within workgroup
    let sg_id = tid / sg_size;
    let num_subgroups = 256u / sg_size;

    // ========================================================================
    // PHASE 1: LOAD DATA
    // ========================================================================
    // Each thread loads 2 elements
    let idx1 = 2u * gid;
    let idx2 = 2u * gid + 1u;

    var val1 = 0u;
    var val2 = 0u;
    if (idx1 < n) { val1 = data[idx1]; }
    if (idx2 < n) { val2 = data[idx2]; }

    // ========================================================================
    // PHASE 2: SUBGROUP PREFIX SUM (Single instruction!)
    // ========================================================================
    // Compute prefix sum within each subgroup for both values
    // We process as pairs: first do val1, then val1+val2 for the second element

    // For the first element of each thread's pair
    let prefix1 = subgroupExclusiveAdd(val1);

    // Get the total of val1 within this subgroup (needed for val2's offset)
    let total1_in_subgroup = subgroupAdd(val1);

    // For the second element, we need: prefix of all val1's + prefix of val2's in earlier threads
    // But since we're processing pairs, we handle this differently

    // Store to shared memory: each thread writes its pair
    temp[2u * tid] = val1;
    temp[2u * tid + 1u] = val2;

    workgroupBarrier();

    // ========================================================================
    // PHASE 3: SEQUENTIAL SCAN WITHIN SHARED MEMORY (Hybrid approach)
    // ========================================================================
    // Now we have 512 elements. We'll use subgroup operations on chunks.
    //
    // Approach: Each thread processes 2 elements using subgroup operations
    // Thread k handles elements at position (k*2) and (k*2+1)
    // Combined value for subgroup scan = val1 + val2

    let combined = val1 + val2;

    // Subgroup exclusive scan on combined values
    // This gives us the sum of all pairs BEFORE this thread within the subgroup
    let sg_prefix = subgroupExclusiveAdd(combined);

    // Get subgroup total (sum of all combined values in this subgroup)
    let sg_total = subgroupAdd(combined);

    // Last lane in each subgroup stores the subgroup total
    if (sg_lane == sg_size - 1u) {
        subgroupTotals[sg_id] = sg_total;
    }

    workgroupBarrier();

    // ========================================================================
    // PHASE 4: SCAN SUBGROUP TOTALS
    // ========================================================================
    // Only thread 0 scans the subgroup totals (sequential but tiny: 4-8 values)
    if (tid == 0u) {
        var running = 0u;
        for (var i = 0u; i < num_subgroups; i++) {
            let t = subgroupTotals[i];
            subgroupTotals[i] = running;
            running += t;
        }
        // Save block total for hierarchical scan
        if (groupIndex < arrayLength(&groupSums)) {
            groupSums[groupIndex] = running;
        }
    }

    workgroupBarrier();

    // ========================================================================
    // PHASE 5: COMPUTE FINAL VALUES
    // ========================================================================
    // Final prefix for each pair = subgroup base offset + within-subgroup prefix
    let base_offset = subgroupTotals[sg_id];
    let pair_prefix = base_offset + sg_prefix;

    // Write results:
    // First element's prefix = pair_prefix
    // Second element's prefix = pair_prefix + val1
    if (idx1 < n) { data[idx1] = pair_prefix; }
    if (idx2 < n) { data[idx2] = pair_prefix + val1; }
}

// Binding for the combine phase
@group(0) @binding(3) var<storage, read> scannedGroupSums: array<u32>;

/**
 * Block Combine Kernel
 *
 * Adds the scanned block offset to each element in the block.
 * Same as original - subgroup operations don't help here since
 * we're just adding a uniform value to all elements.
 */
@compute @workgroup_size(256)
fn blockCombine(
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(workgroup_id) group_id: vec3<u32>
) {
    let groupIndex = group_id.x;

    // Block 0 already has correct values
    if (groupIndex == 0u) { return; }

    let groupAdd = scannedGroupSums[groupIndex];
    let idx1 = 2u * global_id.x;
    let idx2 = 2u * global_id.x + 1u;
    let n = params.count;

    if (idx1 < n) { data[idx1] = data[idx1] + groupAdd; }
    if (idx2 < n) { data[idx2] = data[idx2] + groupAdd; }
}
`, ae = `/**
 * ============================================================================
 * CONTENTION-FREE SCATTER KERNEL
 * ============================================================================
 *
 * Pipeline Stage: Final step of Stage 3
 * Entry Point: scatter
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Places particles into their sorted positions.
 *
 * Optimization: "Rank + Start"
 * - Instead of atomicAdd on global memory (which causes high contention),
 *   we use the precomputed \`particleCellOffsets\` (Rank) and \`sortOffsets\` (Start).
 * - Destination = Start + Rank.
 * - This is 100% parallel and contention-free.
 *
 * ============================================================================
 */

// Beginner note: scatter computes each particle’s final sorted slot so
// neighbors in the same cell become contiguous in memory.

/**
 * Sort Parameters Uniform Buffer
 *
 * Memory Layout (16-byte aligned):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    particleCount   - Total number of particles
 *   4      4    gridTotalCells  - Total cells in the linear grid
 *   8      8    pad0            - Padding for 16-byte alignment
 * ------
 * Total: 16 bytes
 */
struct SortParams {
  particleCount: u32,
  gridTotalCells: u32,
  pad0: vec2<u32>,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Contention-free scatter compute pass
//
//   Binding 0: keys[]               - Linear grid indices from hash_linear.wgsl
//              Used to look up the cell's start offset
//
//   Binding 1: sortOffsets[]        - Prefix-sum result (cell start offsets)
//              Read-only via atomicLoad (no concurrent writes)
//
//   Binding 2: indices[]            - Output: sorted index mapping
//              indices[dest] = original particle index
//
//   Binding 3: params               - Uniform with particle count
//
//   Binding 4: particleCellOffsets[] - Per-particle rank within its cell
//              Computed by countOffsets in sort_linear.wgsl
// ============================================================================

@group(0) @binding(0) var<storage, read> keys: array<u32>;
@group(0) @binding(1) var<storage, read_write> sortOffsets: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read_write> indices: array<u32>;
@group(0) @binding(3) var<uniform> params: SortParams;
@group(0) @binding(4) var<storage, read> particleCellOffsets: array<u32>;

/**
 * Contention-Free Scatter Kernel
 *
 * Places each particle at its sorted position using:
 *   dest = start + rank
 *
 * Where:
 *   start = sortOffsets[key]           (from prefix sum — cell start index)
 *   rank  = particleCellOffsets[index] (from countOffsets — particle's local offset)
 *
 * This avoids the atomicAdd used in the spatial-hash scatter, making the
 * write pattern fully deterministic and contention-free. Each particle
 * writes to a unique destination with no synchronisation needed.
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn scatter(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;

  // Bounds check: one thread per particle
  if (index >= params.particleCount) {
    return;
  }

  let key = keys[index];

  // Read the cell's start offset (no mutation — just a load)
  let start = atomicLoad(&sortOffsets[key]);

  // Read the pre-computed rank of this particle within its cell
  let localOffset = particleCellOffsets[index];

  // Compute the unique destination: start of cell + particle's rank
  let dest = start + localOffset;

  // Write the original particle index to the sorted position
  indices[dest] = index;
}
`, q = `/**
 * ============================================================================
 * PARTICLE REORDERING KERNELS
 * ============================================================================
 *
 * Pipeline Stage: Stage 4 (After spatial hash sorting)
 * Entry Points: reorder, copyBack
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Physically rearranges particle data in memory to match the sorted order.
 * This is crucial for cache-efficient neighbor search.
 *
 * Why Physical Reordering Matters:
 * --------------------------------
 * Without reordering (using indirect lookup):
 *
 *   Memory Layout:        [P0] [P1] [P2] [P3] [P4] [P5] [P6] [P7]
 *   Sorted Indices:       [3, 7, 1, 5, 0, 2, 4, 6]
 *
 *   To access neighbors of particle in sorted position 0:
 *     Read P3 (memory addr 3) - CACHE MISS
 *     Read P7 (memory addr 7) - CACHE MISS (likely evicted P3's cache line)
 *     Read P1 (memory addr 1) - CACHE MISS
 *     ... random access pattern = terrible cache performance
 *
 * With physical reordering:
 *
 *   Original:             [P0] [P1] [P2] [P3] [P4] [P5] [P6] [P7]
 *   After Reorder:        [P3] [P7] [P1] [P5] [P0] [P2] [P4] [P6]
 *   (particles in same cell are now contiguous)
 *
 *   To access neighbors in cell 0:
 *     Read position 0 - CACHE MISS (loads cache line)
 *     Read position 1 - CACHE HIT (same cache line)
 *     Read position 2 - CACHE HIT (same or adjacent cache line)
 *     ... sequential access pattern = excellent cache performance
 *
 * Performance Impact:
 * -------------------
 *   - Random memory access: ~100-300 cycles per load (cache miss)
 *   - Sequential access: ~4-10 cycles per load (cache hit)
 *   - For neighbor search with ~50 neighbors, that's 5-30x speedup!
 *
 * Two-Kernel Design:
 * ------------------
 *   1. reorder: Copy from original → sorted buffers (gather)
 *   2. copyBack: Copy from sorted → original buffers (simple copy)
 *
 * Why not in-place?
 *   - Parallel in-place permutation is complex and requires synchronization
 *   - Double-buffering (sorted buffers) is simpler and equally fast
 *   - GPUs have plenty of memory bandwidth for the extra copy
 *
 * Data Flow:
 * ----------
 *   Before reorder:
 *     positions[]       = [P0, P1, P2, P3, P4, P5, P6, P7]  (original order)
 *     indices[]         = [3, 7, 1, 5, 0, 2, 4, 6]          (sorted order mapping)
 *
 *   After reorder:
 *     positionsSorted[] = [P3, P7, P1, P5, P0, P2, P4, P6]  (spatially sorted)
 *
 *   After copyBack:
 *     positions[]       = [P3, P7, P1, P5, P0, P2, P4, P6]  (for next frame)
 *
 * ============================================================================
 */

// Beginner note: reorder copies particle data into sorted buffers;
// copyBack writes sorted data back to the primary arrays.

/**
 * Reorder Parameters Uniform Buffer
 *
 * Memory Layout (16-byte aligned):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    particleCount   - Total number of particles to reorder
 *   4     12    pad0            - Padding for 16-byte alignment
 * ------
 * Total: 16 bytes
 */
struct SortParams {
  particleCount: u32,
  pad0: vec3<u32>,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Reorder/CopyBack compute pass
//
//   Binding 0: indices[]          - Sorted index mapping (from scatter.wgsl)
//              indices[i] = original particle index that belongs at sorted position i
//
//   Binding 1: positions[]        - Original particle positions (source for reorder)
//   Binding 2: velocities[]       - Original particle velocities
//   Binding 3: predicted[]        - Original predicted positions
//
//   Binding 4: positionsSorted[]  - Destination for reordered positions
//   Binding 5: velocitiesSorted[] - Destination for reordered velocities
//   Binding 6: predictedSorted[]  - Destination for reordered predicted positions
//
//   Binding 7: params             - Uniform with particle count
//
// Memory Layout per particle:
//   vec4<f32> = 16 bytes (xyz + padding/w component)
//   Total per particle: 48 bytes (3 vec4s)
// ============================================================================

@group(0) @binding(0) var<storage, read> indices: array<u32>;
@group(0) @binding(1) var<storage, read_write> positions: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> predicted: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> positionsSorted: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> velocitiesSorted: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> predictedSorted: array<vec4<f32>>;
@group(0) @binding(7) var<uniform> params: SortParams;

/**
 * Reorder Kernel (Gather Operation)
 *
 * Rearranges particle data from original order to sorted order.
 *
 * This is a "gather" operation:
 *   - Sequential writes to sorted buffer (good for coalescing)
 *   - Random reads from original buffer (unavoidable)
 *
 * Why gather instead of scatter?
 *   - GPU memory writes are more expensive to coalesce than reads
 *   - Sequential writes + random reads > random writes + sequential reads
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn reorder(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;

  // Bounds check
  if (i >= params.particleCount) { return; }

  // indices[i] tells us which original particle belongs at sorted position i
  // This is the mapping computed by the counting sort scatter phase
  let sortedIndex = indices[i];

  // Gather: Read from scattered location, write to contiguous location
  //
  // sortedIndex may be anywhere in [0, particleCount)
  // i is sequential across threads in a workgroup
  //
  // After this, particles in the same grid cell are contiguous in the
  // sorted buffers, enabling cache-efficient neighbor search
  positionsSorted[i] = positions[sortedIndex];
  velocitiesSorted[i] = velocities[sortedIndex];
  predictedSorted[i] = predicted[sortedIndex];
}

/**
 * CopyBack Kernel
 *
 * Copies sorted data back to the primary buffers for use in the next frame.
 *
 * Why copy back?
 *   - The simulation uses positions[], velocities[], predicted[] as primary buffers
 *   - Density, pressure, viscosity shaders read from these buffers
 *   - After reorder, the sorted data is in the "Sorted" buffers
 *   - This copy makes the sorted order the canonical order
 *
 * Alternative design (not used):
 *   - Swap buffer pointers instead of copying
 *   - More complex buffer management, minimal performance gain
 *   - Current approach is simpler and memory bandwidth is not the bottleneck
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn copyBack(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;

  // Bounds check
  if (i >= params.particleCount) { return; }

  // Simple linear copy (excellent memory coalescing)
  // Both reads and writes are sequential across threads
  positions[i] = positionsSorted[i];
  velocities[i] = velocitiesSorted[i];
  predicted[i] = predictedSorted[i];
}
`;
class se {
  /**
   * Beginner note:
   * This builds a sorted particle order so neighbor queries become fast.
   * Think of it as a GPU-side spatial index.
   */
  device;
  // Pipelines
  hashPipeline;
  clearOffsetsPipeline;
  countOffsetsPipeline;
  prefixScanPipeline;
  prefixCombinePipeline;
  scatterPipeline;
  reorderPipeline;
  copyBackPipeline;
  // Bind Groups
  hashBG;
  clearBG;
  countBG;
  scanL0BG;
  scanL1BG;
  scanL2BG;
  combineL1BG;
  combineL0BG;
  scatterBG;
  reorderBG;
  copyBackBG;
  constructor(e, n = !1) {
    this.device = e;
    const i = n ? re : ie;
    n && console.log("SpatialGrid: Using subgroup-optimized prefix sum"), this.hashPipeline = this.createPipeline(te, "main"), this.clearOffsetsPipeline = this.createPipeline(Y, "clearOffsets"), this.countOffsetsPipeline = this.createPipeline(Y, "countOffsets"), this.prefixScanPipeline = this.createPipeline(i, "blockScan"), this.prefixCombinePipeline = this.createPipeline(
      i,
      "blockCombine"
    ), this.scatterPipeline = this.createPipeline(ae, "scatter"), this.reorderPipeline = this.createPipeline(q, "reorder"), this.copyBackPipeline = this.createPipeline(q, "copyBack");
  }
  createPipeline(e, n) {
    return this.device.createComputePipeline({
      layout: "auto",
      compute: {
        module: this.device.createShaderModule({ code: e }),
        entryPoint: n
      }
    });
  }
  /**
   * (Re)creates bind groups when buffers change.
   */
  createBindGroups(e, n) {
    if (!e.particleCellOffsets)
      throw new Error(
        "SpatialGrid requires FluidBuffers allocated with gridTotalCells (Linear Grid mode)."
      );
    this.hashBG = this.device.createBindGroup({
      layout: this.hashPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.predicted } },
        { binding: 1, resource: { buffer: e.keys } },
        { binding: 2, resource: { buffer: e.indices } },
        { binding: 3, resource: { buffer: n.hash } }
      ]
    }), this.clearBG = this.device.createBindGroup({
      layout: this.clearOffsetsPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.sortOffsets } },
        { binding: 1, resource: { buffer: n.sort } }
      ]
    }), this.countBG = this.device.createBindGroup({
      layout: this.countOffsetsPipeline.getBindGroupLayout(1),
      entries: [
        { binding: 0, resource: { buffer: e.keys } },
        { binding: 1, resource: { buffer: e.sortOffsets } },
        { binding: 2, resource: { buffer: n.sort } },
        { binding: 3, resource: { buffer: e.particleCellOffsets } }
      ]
    }), this.scanL0BG = this.device.createBindGroup({
      layout: this.prefixScanPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.sortOffsets } },
        { binding: 1, resource: { buffer: e.groupSumsL1 } },
        { binding: 2, resource: { buffer: n.scanL0 } }
      ]
    }), this.scanL1BG = this.device.createBindGroup({
      layout: this.prefixScanPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.groupSumsL1 } },
        { binding: 1, resource: { buffer: e.groupSumsL2 } },
        { binding: 2, resource: { buffer: n.scanL1 } }
      ]
    }), this.scanL2BG = this.device.createBindGroup({
      layout: this.prefixScanPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.groupSumsL2 } },
        { binding: 1, resource: { buffer: e.scanScratch } },
        { binding: 2, resource: { buffer: n.scanL2 } }
      ]
    }), this.combineL1BG = this.device.createBindGroup({
      layout: this.prefixCombinePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.groupSumsL1 } },
        { binding: 2, resource: { buffer: n.scanL1 } },
        { binding: 3, resource: { buffer: e.groupSumsL2 } }
      ]
    }), this.combineL0BG = this.device.createBindGroup({
      layout: this.prefixCombinePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.sortOffsets } },
        { binding: 2, resource: { buffer: n.scanL0 } },
        { binding: 3, resource: { buffer: e.groupSumsL1 } }
      ]
    }), this.scatterBG = this.device.createBindGroup({
      layout: this.scatterPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.keys } },
        { binding: 1, resource: { buffer: e.sortOffsets } },
        { binding: 2, resource: { buffer: e.indices } },
        { binding: 3, resource: { buffer: n.sort } },
        { binding: 4, resource: { buffer: e.particleCellOffsets } }
      ]
    }), this.reorderBG = this.device.createBindGroup({
      layout: this.reorderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.indices } },
        { binding: 1, resource: { buffer: e.positions } },
        { binding: 2, resource: { buffer: e.velocities } },
        { binding: 3, resource: { buffer: e.predicted } },
        { binding: 4, resource: { buffer: e.positionsSorted } },
        { binding: 5, resource: { buffer: e.velocitiesSorted } },
        { binding: 6, resource: { buffer: e.predictedSorted } },
        { binding: 7, resource: { buffer: n.sort } }
      ]
    }), this.copyBackBG = this.device.createBindGroup({
      layout: this.copyBackPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 1, resource: { buffer: e.positions } },
        { binding: 2, resource: { buffer: e.velocities } },
        { binding: 3, resource: { buffer: e.predicted } },
        { binding: 4, resource: { buffer: e.positionsSorted } },
        { binding: 5, resource: { buffer: e.velocitiesSorted } },
        { binding: 6, resource: { buffer: e.predictedSorted } },
        { binding: 7, resource: { buffer: n.sort } }
      ]
    });
  }
  /**
   * Records the full spatial hashing and sorting pass into a compute pass encoder.
   */
  dispatch(e, n, i) {
    const t = Math.ceil(n / 256), a = Math.ceil((i + 1) / 512), s = Math.ceil(a / 512), o = Math.ceil(s / 512);
    e.setPipeline(this.hashPipeline), e.setBindGroup(0, this.hashBG), e.dispatchWorkgroups(t), e.setPipeline(this.clearOffsetsPipeline), e.setBindGroup(0, this.clearBG), e.dispatchWorkgroups(Math.ceil((i + 1) / 256)), e.setPipeline(this.countOffsetsPipeline), e.setBindGroup(1, this.countBG), e.dispatchWorkgroups(t), e.setPipeline(this.prefixScanPipeline), e.setBindGroup(0, this.scanL0BG), e.dispatchWorkgroups(a), a > 1 && (e.setBindGroup(0, this.scanL1BG), e.dispatchWorkgroups(s)), s > 1 && (e.setBindGroup(0, this.scanL2BG), e.dispatchWorkgroups(o)), e.setPipeline(this.prefixCombinePipeline), s > 1 && (e.setBindGroup(0, this.combineL1BG), e.dispatchWorkgroups(s)), a > 1 && (e.setBindGroup(0, this.combineL0BG), e.dispatchWorkgroups(a)), e.setPipeline(this.scatterPipeline), e.setBindGroup(0, this.scatterBG), e.dispatchWorkgroups(t), e.setPipeline(this.reorderPipeline), e.setBindGroup(0, this.reorderBG), e.dispatchWorkgroups(t), e.setPipeline(this.copyBackPipeline), e.setBindGroup(0, this.copyBackBG), e.dispatchWorkgroups(t);
  }
}
const oe = `/**
 * ============================================================================
 * EXTERNAL FORCES & PREDICTION SHADER
 * ============================================================================
 *
 * Pipeline Stage: 1 of 8 (First compute pass)
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * This shader kicks off each simulation frame by:
 *   1. Applying external forces (gravity, user interaction)
 *   2. Updating velocities based on accumulated acceleration
 *   3. Computing predicted positions for spatial hashing
 *
 * Position Based Dynamics (PBD) Prediction:
 * -----------------------------------------
 * Instead of using current positions for neighbor search, we predict where
 * particles WILL be at the end of the timestep. This improves stability:
 *
 *   predicted[i] = position[i] + velocity[i] * predictionFactor
 *
 * The prediction factor (1/120) is tuned to match typical simulation rates.
 * Using predicted positions ensures that pressure forces are calculated
 * based on the future configuration, preventing particles from "overshooting"
 * and penetrating each other.
 *
 * Interactive Force Model:
 * ------------------------
 * When the user clicks/drags, particles within 'interactionRadius' experience:
 *
 *   - Pull (positive strength): Attracted toward input point
 *   - Push (negative strength): Repelled from input point
 *
 * The force uses a smooth falloff from center (100%) to edge (0%):
 *
 *   centreT = 1 - (distance / radius)
 *   force = direction * centreT * interactionStrength
 *
 * A velocity damping term (-vel * centreT) is applied near the interaction
 * center to prevent particles from orbiting/exploding at the click point.
 *
 * Data Flow:
 * ----------
 *   Input:
 *     - positions[]     : Current particle positions (read-only)
 *     - velocities[]    : Current velocities (read-write)
 *     - params          : Simulation parameters
 *
 *   Output:
 *     - velocities[]    : Updated with acceleration * dt
 *     - predicted[]     : Predicted position for spatial hashing
 *
 * ============================================================================
 */

// Beginner note: one invocation = one particle. The compute grid is 1D (id.x).
// Uniforms are tiny per-frame constants; storage buffers hold all particles.

/**
 * Simulation Parameters Uniform Buffer
 *
 * Memory Layout (16-byte aligned for WebGPU):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    deltaTime           - Frame timestep in seconds
 *   4      4    gravity             - Gravity acceleration (typically -9.8)
 *   8      4    interactionRadius   - Mouse interaction sphere radius
 *  12      4    interactionStrength - Force magnitude (+ = pull, - = push)
 *  16     16    inputPoint          - 3D mouse position (vec4, w unused)
 * ------
 * Total: 32 bytes
 */
struct SimParams {
  deltaTime: f32,
  gravity: f32,
  interactionRadius: f32,
  interactionStrength: f32,
  inputPoint: vec4<f32>,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: External Forces compute pass
//
//   Binding 0: positions[]  - Current particle positions (read-only)
//              Format: vec4<f32> per particle, xyz = position, w = 1.0
//
//   Binding 1: velocities[] - Particle velocities (read-write)
//              Format: vec4<f32> per particle, xyz = velocity, w = 0.0
//
//   Binding 2: predicted[]  - Output predicted positions for spatial hashing
//              Format: vec4<f32> per particle, xyz = predicted pos, w = 1.0
//
//   Binding 3: params       - Uniform parameters for this pass
// ============================================================================

@group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> predicted: array<vec4<f32>>;
@group(0) @binding(3) var<uniform> params: SimParams;

/**
 * Main Compute Kernel
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 * Each thread processes exactly one particle.
 *
 * Algorithm:
 * 1. Early exit if thread index exceeds particle count
 * 2. Load current position and velocity
 * 3. Compute gravity acceleration (constant downward force)
 * 4. If user interaction is active:
 *    a. Check if particle is within interaction radius
 *    b. Compute smooth falloff factor (1 at center, 0 at edge)
 *    c. Apply interaction force toward/away from input point
 *    d. Apply velocity damping to prevent orbital instability
 *    e. Optionally reduce gravity (for "lifting" effect during pull)
 * 5. Integrate velocity: v_new = v_old + accel * dt
 * 6. Predict position: pred = pos + vel * (1/120)
 */
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;

  // Bounds check: Ensure we don't access beyond the buffer
  // Note: arrayLength() returns the number of elements, not bytes
  if (index >= arrayLength(&positions)) {
    return;
  }

  // Load current state
  // .xyz extracts the 3D vector, ignoring the w component
  let pos = positions[index].xyz;
  var vel = velocities[index].xyz;

  // ========================================================================
  // GRAVITY FORCE
  // ========================================================================
  // Constant downward acceleration (Y-axis is up in this coordinate system)
  // Typical value: -9.8 m/s² for Earth-like gravity
  let gravityAccel = vec3<f32>(0.0, params.gravity, 0.0);
  var finalAccel = gravityAccel;

  // ========================================================================
  // USER INTERACTION FORCE
  // ========================================================================
  // Only compute if user is actively interacting (strength != 0)
  // interactionStrength > 0 = pull toward cursor
  // interactionStrength < 0 = push away from cursor
  if (params.interactionStrength != 0.0) {
      // Vector from particle to input point
      let offset = params.inputPoint.xyz - pos;
      let sqrDst = dot(offset, offset);  // Squared distance (avoid sqrt when possible)
      let radius = params.interactionRadius;

      // Check if particle is within interaction sphere
      // Also check sqrDst > epsilon to avoid division by zero at exact center
      if (sqrDst < radius * radius && sqrDst > 0.000001) {
          let dst = sqrt(sqrDst);

          // Smooth falloff function:
          //   edgeT = 0 at center, 1 at edge
          //   centreT = 1 at center, 0 at edge
          // This creates a smooth force field that's strongest at the click point
          let edgeT = dst / radius;
          let centreT = 1.0 - edgeT;

          // Normalized direction toward input point
          let dirToCentre = offset / dst;

          // Reduce gravity influence when pulling (creates a "lifting" effect)
          // saturate() clamps to [0, 1] range
          // At strength=10, gravity is completely cancelled at the center
          let gravityWeight = 1.0 - (centreT * saturate(params.interactionStrength / 10.0));

          // Interaction acceleration: scales with distance falloff and strength
          let interactionAccel = dirToCentre * centreT * params.interactionStrength;

          // Final acceleration combines:
          //   1. Gravity (optionally reduced during pull)
          //   2. Interaction force (toward or away from cursor)
          //   3. Velocity damping (prevents particles from orbiting the cursor)
          // The damping term (-vel * centreT) is crucial for stable interaction
          finalAccel = gravityAccel * gravityWeight + interactionAccel - vel * centreT;
      }
  }

  // ========================================================================
  // VELOCITY INTEGRATION
  // ========================================================================
  // Semi-implicit Euler: v(t+dt) = v(t) + a(t) * dt
  // Position will be updated in the integrate shader after pressure/viscosity
  vel = vel + finalAccel * params.deltaTime;
  velocities[index] = vec4<f32>(vel, 0.0);

  // ========================================================================
  // POSITION PREDICTION (PBD)
  // ========================================================================
  // Predict where the particle will be at the end of this frame.
  // This predicted position is used for spatial hashing (neighbor search).
  //
  // Why 1/120?
  //   - Matches common simulation tick rates (120 Hz)
  //   - Provides a good balance between prediction accuracy and stability
  //   - Consistent with the Unity reference implementation
  //
  // Note: The actual position update uses the full deltaTime in integrate.wgsl
  let predictionFactor = 1.0 / 120.0;
  predicted[index] = vec4<f32>(pos + vel * predictionFactor, 1.0);
}
`, le = `/**
 * ============================================================================
 * DENSITY KERNEL (LINEAR GRID + STRIP OPTIMIZATION)
 * ============================================================================
 *
 * Pipeline Stage: Stage 5
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Computes fluid density using the Linear Grid for O(1) neighbor search.
 *
 * Optimization: Strip Processing
 * ------------------------------
 * Instead of checking 27 individual neighbor cells, we iterate over 3 Z-planes
 * and 3 Y-rows. Inside each Y-row, the X-cells are contiguous in the Linear Grid Index.
 *
 *   Row: [ Cell(x-1), Cell(x), Cell(x+1) ]
 *
 * Because indices are contiguous:
 *   Key(x-1) = K
 *   Key(x)   = K + 1
 *   Key(x+1) = K + 2
 *
 * We can fetch the particle range for the ENTIRE strip in one go:
 *   Start = sortOffsets[Key(x-1)]
 *   End   = sortOffsets[Key(x+1) + 1]
 *
 * This reduces 27 loop setups to 9, and eliminates the "if (key != target)" check
 * inside the inner loop, drastically reducing memory bandwidth.
 * ============================================================================
 */

// Beginner note: this pass reads predicted positions + sortOffsets and writes
// per-particle density/near-density for the pressure solver.

/**
 * Density Parameters Uniform Buffer
 *
 * Memory Layout (48 bytes):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    radius          - Smoothing radius h (= grid cell size)
 *   4      4    spikyPow2Scale  - Normalisation for (h-r)² kernel: 15/(2πh⁵)
 *   8      4    spikyPow3Scale  - Normalisation for (h-r)³ kernel: 15/(πh⁶)
 *  12      4    particleCountF  - Particle count as f32 (for GPU convenience)
 *  16     12    minBounds       - Minimum corner of simulation domain (xyz)
 *  28      4    pad0            - Padding
 *  32     12    gridRes         - Grid resolution per axis (xyz as f32)
 *  44      4    pad1            - Padding
 * ------
 * Total: 48 bytes
 */
struct DensityParams {
  radius: f32,
  spikyPow2Scale: f32,
  spikyPow3Scale: f32,
  particleCountF: f32,
  minBounds: vec3<f32>,
  pad0: f32,
  gridRes: vec3<f32>,
  pad1: f32,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Density compute pass (Linear Grid)
//
//   Binding 0: predicted[]   - Predicted particle positions (spatially sorted)
//              Used for distance calculations during neighbor iteration
//
//   Binding 1: sortOffsets[] - Cell start/end offsets from prefix sum
//              Used for strip-optimised neighbor lookup
//
//   Binding 2: densities[]   - Output: (density, nearDensity) per particle
//              vec2<f32>: x = standard density, y = near-density
//
//   Binding 3: params        - Uniform density parameters
// ============================================================================

@group(0) @binding(0) var<storage, read> predicted: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> sortOffsets: array<u32>;
@group(0) @binding(2) var<storage, read_write> densities: array<vec2<f32>>;
@group(0) @binding(3) var<uniform> params: DensityParams;

/**
 * Converts 3D integer cell coordinates to a linear grid index.
 *
 * Uses row-major linearisation: index = x + width × (y + height × z).
 * The caller must ensure coordinates are within [0, gridRes - 1].
 */
fn getGridIndex(x: i32, y: i32, z: i32) -> u32 {
    let gridRes = vec3<u32>(params.gridRes);
    return u32(x) + gridRes.x * (u32(y) + gridRes.y * u32(z));
}

/** Spiky² kernel: W(r,h) = (h-r)² × scale. Compact support: 0 for r ≥ h. */
fn spikyPow2(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst < radius) {
    let v = radius - dst;
    return v * v * scale;
  }
  return 0.0;
}

/** Spiky³ kernel: W(r,h) = (h-r)³ × scale. Sharper falloff for near-density. */
fn spikyPow3(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst < radius) {
    let v = radius - dst;
    return v * v * v * scale;
  }
  return 0.0;
}

/**
 * Main Density Compute Kernel (Strip-Optimised)
 *
 * For each particle, iterates over the 3×3 neighborhood of Y-Z rows.
 * Within each row, the X-cells are contiguous in the linear grid, so we
 * fetch the particle range for the entire 3-cell strip in one go:
 *   start = sortOffsets[getGridIndex(minX, y, z)]
 *   end   = sortOffsets[getGridIndex(maxX, y, z) + 1]
 *
 * This reduces 27 separate cell lookups to 9 strips and eliminates the
 * per-particle key comparison in the inner loop.
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  let count = u32(params.particleCountF + 0.5);

  if (i >= count) { return; }

  let pos = predicted[i].xyz;
  let gridRes = vec3<i32>(params.gridRes);

  let localPos = pos - params.minBounds;
  let cellX = i32(floor(localPos.x / params.radius));
  let cellY = i32(floor(localPos.y / params.radius));
  let cellZ = i32(floor(localPos.z / params.radius));
  
  let cx = clamp(cellX, 0, gridRes.x - 1);
  let cy = clamp(cellY, 0, gridRes.y - 1);
  let cz = clamp(cellZ, 0, gridRes.z - 1);

  var density = 0.0;
  var nearDensity = 0.0;
  let radiusSq = params.radius * params.radius;

  // Search ranges
  let minZ = max(0, cz - 1);
  let maxZ = min(gridRes.z - 1, cz + 1);
  let minY = max(0, cy - 1);
  let maxY = min(gridRes.y - 1, cy + 1);
  let minX = max(0, cx - 1);
  let maxX = min(gridRes.x - 1, cx + 1);

  // Strip Optimization Loop
  for (var z = minZ; z <= maxZ; z++) {
    for (var y = minY; y <= maxY; y++) {
      let startKey = getGridIndex(minX, y, z);
      let endKey = getGridIndex(maxX, y, z);
      
      let start = sortOffsets[startKey];
      let end = sortOffsets[endKey + 1u];

      for (var j = start; j < end; j++) {
          let neighborPos = predicted[j].xyz;
          let offset = neighborPos - pos;
          let dstSq = dot(offset, offset);

          if (dstSq <= radiusSq) {
              let dst = sqrt(dstSq);
              density = density + spikyPow2(dst, params.radius, params.spikyPow2Scale);
              nearDensity = nearDensity + spikyPow3(dst, params.radius, params.spikyPow3Scale);
          }
      }
    }
  }

  densities[i] = vec2<f32>(density, nearDensity);
}
`, ce = `/**
 * ============================================================================
 * DENSITY KERNEL (SHARED MEMORY OPTIMIZATION)
 * ============================================================================
 *
 * Pipeline Stage: Stage 5
 * Entry Point: main
 * Workgroup Size: 64 threads (optimized for mobile GPUs)
 *
 * Purpose:
 * --------
 * Computes fluid density using workgroup shared memory to reduce global
 * memory bandwidth. This is especially beneficial for mobile GPUs.
 *
 * Optimization Strategy:
 * ----------------------
 * Since particles are sorted by cell (from the spatial grid), particles in
 * the same workgroup tend to be spatially close. We exploit this by:
 *
 *   1. Computing a workgroup-wide bounding box of neighbor cells
 *   2. Collaboratively loading ALL potential neighbors into shared memory
 *   3. Each thread filters to its actual neighbors during computation
 *
 * This trades some extra distance checks for much faster memory access.
 *
 * Why this works:
 * ---------------
 * Sorted particles → nearby particles in same workgroup → overlapping neighbors
 * → shared memory is reused by multiple threads → reduced global memory reads
 *
 * Memory: ~8KB shared memory (512 × vec3 × 4 bytes = 6KB + overhead)
 *
 * ============================================================================
 */

const TILE_SIZE: u32 = 512u;
const WORKGROUP_SIZE: u32 = 64u;

struct DensityParams {
  radius: f32,
  spikyPow2Scale: f32,
  spikyPow3Scale: f32,
  particleCountF: f32,
  minBounds: vec3<f32>,
  pad0: f32,
  gridRes: vec3<f32>,
  pad1: f32,
};

@group(0) @binding(0) var<storage, read> predicted: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> sortOffsets: array<u32>;
@group(0) @binding(2) var<storage, read_write> densities: array<vec2<f32>>;
@group(0) @binding(3) var<uniform> params: DensityParams;

// Shared memory for neighbor positions
var<workgroup> sharedPositions: array<vec3<f32>, TILE_SIZE>;

// Workgroup-shared bounds (computed collaboratively)
var<workgroup> wgMinCell: vec3<i32>;
var<workgroup> wgMaxCell: vec3<i32>;
var<workgroup> wgNeighborStart: u32;
var<workgroup> wgNeighborEnd: u32;

// Atomics for workgroup reduction
var<workgroup> wgMinX: atomic<i32>;
var<workgroup> wgMinY: atomic<i32>;
var<workgroup> wgMinZ: atomic<i32>;
var<workgroup> wgMaxX: atomic<i32>;
var<workgroup> wgMaxY: atomic<i32>;
var<workgroup> wgMaxZ: atomic<i32>;

fn getGridIndex(x: i32, y: i32, z: i32) -> u32 {
  let gridRes = vec3<u32>(params.gridRes);
  return u32(x) + gridRes.x * (u32(y) + gridRes.y * u32(z));
}

fn spikyPow2(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst < radius) {
    let v = radius - dst;
    return v * v * scale;
  }
  return 0.0;
}

fn spikyPow3(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst < radius) {
    let v = radius - dst;
    return v * v * v * scale;
  }
  return 0.0;
}

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let particleIndex = globalId.x;
  let localIndex = localId.x;
  let particleCount = u32(params.particleCountF + 0.5);
  let gridRes = vec3<i32>(params.gridRes);

  let hasParticle = particleIndex < particleCount;

  // =========================================================================
  // PHASE 1: Compute workgroup-wide neighbor bounds
  // =========================================================================

  // Initialize atomics (thread 0 only)
  if (localIndex == 0u) {
    atomicStore(&wgMinX, gridRes.x);
    atomicStore(&wgMinY, gridRes.y);
    atomicStore(&wgMinZ, gridRes.z);
    atomicStore(&wgMaxX, -1);
    atomicStore(&wgMaxY, -1);
    atomicStore(&wgMaxZ, -1);
  }
  workgroupBarrier();

  // Each thread contributes its neighbor bounds
  var pos = vec3<f32>(0.0);
  var myCellX: i32 = 0;
  var myCellY: i32 = 0;
  var myCellZ: i32 = 0;

  if (hasParticle) {
    pos = predicted[particleIndex].xyz;
    let localPos = pos - params.minBounds;
    myCellX = clamp(i32(floor(localPos.x / params.radius)), 0, gridRes.x - 1);
    myCellY = clamp(i32(floor(localPos.y / params.radius)), 0, gridRes.y - 1);
    myCellZ = clamp(i32(floor(localPos.z / params.radius)), 0, gridRes.z - 1);

    // Neighbor range for this particle (3x3x3 neighborhood)
    let minX = max(0, myCellX - 1);
    let minY = max(0, myCellY - 1);
    let minZ = max(0, myCellZ - 1);
    let maxX = min(gridRes.x - 1, myCellX + 1);
    let maxY = min(gridRes.y - 1, myCellY + 1);
    let maxZ = min(gridRes.z - 1, myCellZ + 1);

    // Atomic min/max to find workgroup bounds
    atomicMin(&wgMinX, minX);
    atomicMin(&wgMinY, minY);
    atomicMin(&wgMinZ, minZ);
    atomicMax(&wgMaxX, maxX);
    atomicMax(&wgMaxY, maxY);
    atomicMax(&wgMaxZ, maxZ);
  }
  workgroupBarrier();

  // Thread 0 computes the neighbor range
  if (localIndex == 0u) {
    let minX = atomicLoad(&wgMinX);
    let minY = atomicLoad(&wgMinY);
    let minZ = atomicLoad(&wgMinZ);
    let maxX = atomicLoad(&wgMaxX);
    let maxY = atomicLoad(&wgMaxY);
    let maxZ = atomicLoad(&wgMaxZ);

    wgMinCell = vec3<i32>(minX, minY, minZ);
    wgMaxCell = vec3<i32>(maxX, maxY, maxZ);

    // Get particle index range for the bounding box
    if (maxX >= 0 && maxY >= 0 && maxZ >= 0) {
      let startKey = getGridIndex(minX, minY, minZ);
      let endKey = getGridIndex(maxX, maxY, maxZ);
      wgNeighborStart = sortOffsets[startKey];
      wgNeighborEnd = sortOffsets[endKey + 1u];
    } else {
      wgNeighborStart = 0u;
      wgNeighborEnd = 0u;
    }
  }
  workgroupBarrier();

  let rangeStart = wgNeighborStart;
  let rangeEnd = wgNeighborEnd;

  // =========================================================================
  // PHASE 2: Process neighbors in tiles using shared memory
  // =========================================================================

  var density = 0.0;
  var nearDensity = 0.0;
  let radiusSq = params.radius * params.radius;

  var tileStart = rangeStart;
  loop {
    if (tileStart >= rangeEnd) { break; }

    let tileEnd = min(tileStart + TILE_SIZE, rangeEnd);
    let tileCount = tileEnd - tileStart;

    // Collaborative loading: each thread loads multiple elements
    let loadsPerThread = (tileCount + WORKGROUP_SIZE - 1u) / WORKGROUP_SIZE;
    for (var l = 0u; l < loadsPerThread; l++) {
      let loadIdx = localIndex + l * WORKGROUP_SIZE;
      if (loadIdx < tileCount) {
        let globalIdx = tileStart + loadIdx;
        sharedPositions[loadIdx] = predicted[globalIdx].xyz;
      }
    }

    workgroupBarrier();

    // Each thread computes density from shared memory
    if (hasParticle) {
      for (var j = 0u; j < tileCount; j++) {
        let neighborPos = sharedPositions[j];
        let offset = neighborPos - pos;
        let dstSq = dot(offset, offset);

        if (dstSq <= radiusSq) {
          let dst = sqrt(dstSq);
          density += spikyPow2(dst, params.radius, params.spikyPow2Scale);
          nearDensity += spikyPow3(dst, params.radius, params.spikyPow3Scale);
        }
      }
    }

    workgroupBarrier();
    tileStart = tileEnd;
  }

  // =========================================================================
  // PHASE 3: Write results
  // =========================================================================

  if (hasParticle) {
    densities[particleIndex] = vec2<f32>(density, nearDensity);
  }
}
`, de = `/**
 * ============================================================================
 * PRESSURE KERNEL (LINEAR GRID + STRIP OPTIMIZATION)
 * ============================================================================
 *
 * Pipeline Stage: Stage 6 (Second SPH physics pass)
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Computes pressure forces using the Linear Grid for O(1) neighbor search,
 * with the strip optimisation for contiguous X-row iteration.
 *
 * This is the Linear Grid variant of pressure.wgsl. The physics are identical
 * (symmetric dual-pressure EOS), but neighbor iteration uses sortOffsets
 * with strip ranges instead of spatial hash key matching.
 *
 * See pressure.wgsl for detailed physics documentation (equation of state,
 * kernel gradient derivation, symmetric pressure averaging).
 * ============================================================================
 */

// Beginner note: pressure uses density to compute forces that repel particles.

/**
 * Pressure Parameters Uniform Buffer
 *
 * Memory Layout (64 bytes):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    dt                     - Sub-step timestep
 *   4      4    targetDensity          - Rest density ρ₀
 *   8      4    pressureMultiplier     - Stiffness k for standard pressure
 *  12      4    nearPressureMultiplier - Stiffness for near-pressure
 *  16      4    radius                 - Smoothing radius h
 *  20      4    spikyPow2DerivScale    - Gradient normalisation for Spiky² kernel
 *  24      4    spikyPow3DerivScale    - Gradient normalisation for Spiky³ kernel
 *  28      4    particleCountF         - Particle count as f32
 *  32     12    minBounds              - Minimum corner of simulation domain
 *  44      4    pad0                   - Padding
 *  48     12    gridRes                - Grid resolution per axis (f32)
 *  60      4    pad1                   - Padding
 * ------
 * Total: 64 bytes
 */
struct PressureParams {
  dt: f32,
  targetDensity: f32,
  pressureMultiplier: f32,
  nearPressureMultiplier: f32,
  radius: f32,
  spikyPow2DerivScale: f32,
  spikyPow3DerivScale: f32,
  particleCountF: f32,
  minBounds: vec3<f32>,
  pad0: f32,
  gridRes: vec3<f32>,
  pad1: f32,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Pressure compute pass (Linear Grid)
//
//   Binding 0: predicted[]   - Predicted positions (for neighbor distances)
//   Binding 1: velocities[]  - Velocities (updated with pressure acceleration)
//   Binding 2: densities[]   - Computed densities from density pass
//              vec2: x = density, y = near-density
//   Binding 3: sortOffsets[] - Cell start/end offsets for strip iteration
//   Binding 4: params        - Pressure parameters
// ============================================================================

@group(0) @binding(0) var<storage, read> predicted: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> densities: array<vec2<f32>>;
@group(0) @binding(3) var<storage, read> sortOffsets: array<u32>;
@group(0) @binding(4) var<uniform> params: PressureParams;

/**
 * Converts 3D integer cell coordinates to a linear grid index.
 * index = x + width × (y + height × z)
 */
fn getGridIndex(x: i32, y: i32, z: i32) -> u32 {
    let gridRes = vec3<u32>(params.gridRes);
    return u32(x) + gridRes.x * (u32(y) + gridRes.y * u32(z));
}

/** Gradient of Spiky² kernel: dW/dr = -(h-r) × scale. */
fn derivativeSpikyPow2(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst <= radius) {
    let v = radius - dst;
    return -v * scale;
  }
  return 0.0;
}

/** Gradient of Spiky³ kernel: dW/dr = -(h-r)² × scale. Stronger at close range. */
fn derivativeSpikyPow3(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst <= radius) {
    let v = radius - dst;
    return -v * v * scale;
  }
  return 0.0;
}

/**
 * Main Pressure Force Kernel (Strip-Optimised)
 *
 * For each particle:
 *   1. Compute pressure from EOS: P = k × (ρ - ρ₀)
 *   2. Iterate over 3×3 Y-Z row strips using sortOffsets ranges
 *   3. For each neighbor, compute symmetric averaged pressure force
 *   4. Update velocity: v += (force / density) × dt
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  let count = u32(params.particleCountF + 0.5);

  if (i >= count) { return; }

  let densityPair = densities[i];
  let density = densityPair.x;
  let nearDensity = densityPair.y;

  if (density <= 0.0) { return; }

  let pressure = (density - params.targetDensity) * params.pressureMultiplier;
  let nearPressure = params.nearPressureMultiplier * nearDensity;

  let pos = predicted[i].xyz;
  let gridRes = vec3<i32>(params.gridRes);
  let localPos = pos - params.minBounds;
  
  let cellX = i32(floor(localPos.x / params.radius));
  let cellY = i32(floor(localPos.y / params.radius));
  let cellZ = i32(floor(localPos.z / params.radius));
  
  let cx = clamp(cellX, 0, gridRes.x - 1);
  let cy = clamp(cellY, 0, gridRes.y - 1);
  let cz = clamp(cellZ, 0, gridRes.z - 1);

  let radiusSq = params.radius * params.radius;
  var force = vec3<f32>(0.0);

  let minZ = max(0, cz - 1);
  let maxZ = min(gridRes.z - 1, cz + 1);
  let minY = max(0, cy - 1);
  let maxY = min(gridRes.y - 1, cy + 1);
  let minX = max(0, cx - 1);
  let maxX = min(gridRes.x - 1, cx + 1);

  for (var z = minZ; z <= maxZ; z++) {
    for (var y = minY; y <= maxY; y++) {
      let startKey = getGridIndex(minX, y, z);
      let endKey = getGridIndex(maxX, y, z);
      let start = sortOffsets[startKey];
      let end = sortOffsets[endKey + 1u];

      for (var j = start; j < end; j++) {
            let neighborIndex = j;
            if (neighborIndex != i) {
                let neighborPos = predicted[neighborIndex].xyz;
                let offset = neighborPos - pos;
                let dstSq = dot(offset, offset);

                if (dstSq <= radiusSq) {
                    let dst = sqrt(dstSq);
                    let invDst = select(0.0, 1.0 / dst, dst > 0.0);
                    let dir = offset * invDst;

                    let nDens = densities[neighborIndex];
                    let nPressure = (nDens.x - params.targetDensity) * params.pressureMultiplier;
                    let nNearPressure = params.nearPressureMultiplier * nDens.y;

                    let sharedPressure = (pressure + nPressure) * 0.5;
                    let sharedNearPressure = (nearPressure + nNearPressure) * 0.5;

                    if (nDens.x > 0.0) {
                        let scale = derivativeSpikyPow2(dst, params.radius, params.spikyPow2DerivScale) * (sharedPressure / nDens.x);
                        force = force + dir * scale;
                    }
                    if (nDens.y > 0.0) {
                        let scale = derivativeSpikyPow3(dst, params.radius, params.spikyPow3DerivScale) * (sharedNearPressure / nDens.y);
                        force = force + dir * scale;
                    }
                }
            }
      }
    }
  }

  let accel = force / density;
  velocities[i] = vec4<f32>(velocities[i].xyz + accel * params.dt, 0.0);
}
`, ue = `/**
 * ============================================================================
 * PRESSURE KERNEL (SHARED MEMORY OPTIMIZATION)
 * ============================================================================
 *
 * Pipeline Stage: Stage 6
 * Entry Point: main
 * Workgroup Size: 64 threads (optimized for mobile GPUs)
 *
 * Purpose:
 * --------
 * Computes pressure forces using workgroup shared memory to reduce global
 * memory bandwidth. Uses the same collaborative loading strategy as the
 * density shader.
 *
 * ============================================================================
 */

const TILE_SIZE: u32 = 384u;  // Smaller than density since we store more data
const WORKGROUP_SIZE: u32 = 64u;

struct PressureParams {
  dt: f32,
  targetDensity: f32,
  pressureMultiplier: f32,
  nearPressureMultiplier: f32,
  radius: f32,
  spikyPow2DerivScale: f32,
  spikyPow3DerivScale: f32,
  particleCountF: f32,
  minBounds: vec3<f32>,
  pad0: f32,
  gridRes: vec3<f32>,
  pad1: f32,
};

// Neighbor data packed into shared memory
struct NeighborData {
  pos: vec3<f32>,
  density: f32,
  nearDensity: f32,
}

@group(0) @binding(0) var<storage, read> predicted: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> densities: array<vec2<f32>>;
@group(0) @binding(3) var<storage, read> sortOffsets: array<u32>;
@group(0) @binding(4) var<uniform> params: PressureParams;

// Shared memory for neighbor data
var<workgroup> sharedPos: array<vec3<f32>, TILE_SIZE>;
var<workgroup> sharedDensity: array<f32, TILE_SIZE>;
var<workgroup> sharedNearDensity: array<f32, TILE_SIZE>;

// Workgroup-shared bounds
var<workgroup> wgNeighborStart: u32;
var<workgroup> wgNeighborEnd: u32;

// Atomics for workgroup reduction
var<workgroup> wgMinX: atomic<i32>;
var<workgroup> wgMinY: atomic<i32>;
var<workgroup> wgMinZ: atomic<i32>;
var<workgroup> wgMaxX: atomic<i32>;
var<workgroup> wgMaxY: atomic<i32>;
var<workgroup> wgMaxZ: atomic<i32>;

fn getGridIndex(x: i32, y: i32, z: i32) -> u32 {
  let gridRes = vec3<u32>(params.gridRes);
  return u32(x) + gridRes.x * (u32(y) + gridRes.y * u32(z));
}

fn derivativeSpikyPow2(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst <= radius) {
    let v = radius - dst;
    return -v * scale;
  }
  return 0.0;
}

fn derivativeSpikyPow3(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst <= radius) {
    let v = radius - dst;
    return -v * v * scale;
  }
  return 0.0;
}

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>
) {
  let particleIndex = globalId.x;
  let localIndex = localId.x;
  let particleCount = u32(params.particleCountF + 0.5);
  let gridRes = vec3<i32>(params.gridRes);

  let hasParticle = particleIndex < particleCount;

  // =========================================================================
  // PHASE 1: Compute workgroup-wide neighbor bounds
  // =========================================================================

  if (localIndex == 0u) {
    atomicStore(&wgMinX, gridRes.x);
    atomicStore(&wgMinY, gridRes.y);
    atomicStore(&wgMinZ, gridRes.z);
    atomicStore(&wgMaxX, -1);
    atomicStore(&wgMaxY, -1);
    atomicStore(&wgMaxZ, -1);
  }
  workgroupBarrier();

  var pos = vec3<f32>(0.0);
  var myDensity = 0.0;
  var myNearDensity = 0.0;
  var myPressure = 0.0;
  var myNearPressure = 0.0;

  if (hasParticle) {
    pos = predicted[particleIndex].xyz;
    let densityPair = densities[particleIndex];
    myDensity = densityPair.x;
    myNearDensity = densityPair.y;

    if (myDensity > 0.0) {
      myPressure = (myDensity - params.targetDensity) * params.pressureMultiplier;
      myNearPressure = params.nearPressureMultiplier * myNearDensity;
    }

    let localPos = pos - params.minBounds;
    let cellX = clamp(i32(floor(localPos.x / params.radius)), 0, gridRes.x - 1);
    let cellY = clamp(i32(floor(localPos.y / params.radius)), 0, gridRes.y - 1);
    let cellZ = clamp(i32(floor(localPos.z / params.radius)), 0, gridRes.z - 1);

    let minX = max(0, cellX - 1);
    let minY = max(0, cellY - 1);
    let minZ = max(0, cellZ - 1);
    let maxX = min(gridRes.x - 1, cellX + 1);
    let maxY = min(gridRes.y - 1, cellY + 1);
    let maxZ = min(gridRes.z - 1, cellZ + 1);

    atomicMin(&wgMinX, minX);
    atomicMin(&wgMinY, minY);
    atomicMin(&wgMinZ, minZ);
    atomicMax(&wgMaxX, maxX);
    atomicMax(&wgMaxY, maxY);
    atomicMax(&wgMaxZ, maxZ);
  }
  workgroupBarrier();

  if (localIndex == 0u) {
    let minX = atomicLoad(&wgMinX);
    let minY = atomicLoad(&wgMinY);
    let minZ = atomicLoad(&wgMinZ);
    let maxX = atomicLoad(&wgMaxX);
    let maxY = atomicLoad(&wgMaxY);
    let maxZ = atomicLoad(&wgMaxZ);

    if (maxX >= 0 && maxY >= 0 && maxZ >= 0) {
      let startKey = getGridIndex(minX, minY, minZ);
      let endKey = getGridIndex(maxX, maxY, maxZ);
      wgNeighborStart = sortOffsets[startKey];
      wgNeighborEnd = sortOffsets[endKey + 1u];
    } else {
      wgNeighborStart = 0u;
      wgNeighborEnd = 0u;
    }
  }
  workgroupBarrier();

  // Skip if this particle has no density
  if (hasParticle && myDensity <= 0.0) {
    return;
  }

  let rangeStart = wgNeighborStart;
  let rangeEnd = wgNeighborEnd;

  // =========================================================================
  // PHASE 2: Process neighbors in tiles using shared memory
  // =========================================================================

  var force = vec3<f32>(0.0);
  let radiusSq = params.radius * params.radius;

  var tileStart = rangeStart;
  loop {
    if (tileStart >= rangeEnd) { break; }

    let tileEnd = min(tileStart + TILE_SIZE, rangeEnd);
    let tileCount = tileEnd - tileStart;

    // Collaborative loading
    let loadsPerThread = (tileCount + WORKGROUP_SIZE - 1u) / WORKGROUP_SIZE;
    for (var l = 0u; l < loadsPerThread; l++) {
      let loadIdx = localIndex + l * WORKGROUP_SIZE;
      if (loadIdx < tileCount) {
        let globalIdx = tileStart + loadIdx;
        sharedPos[loadIdx] = predicted[globalIdx].xyz;
        let d = densities[globalIdx];
        sharedDensity[loadIdx] = d.x;
        sharedNearDensity[loadIdx] = d.y;
      }
    }

    workgroupBarrier();

    // Compute pressure forces from shared memory
    if (hasParticle && myDensity > 0.0) {
      for (var j = 0u; j < tileCount; j++) {
        let neighborGlobalIdx = tileStart + j;
        if (neighborGlobalIdx != particleIndex) {
          let neighborPos = sharedPos[j];
          let offset = neighborPos - pos;
          let dstSq = dot(offset, offset);

          if (dstSq <= radiusSq && dstSq > 0.0) {
            let dst = sqrt(dstSq);
            let dir = offset / dst;

            let nDensity = sharedDensity[j];
            let nNearDensity = sharedNearDensity[j];

            if (nDensity > 0.0) {
              let nPressure = (nDensity - params.targetDensity) * params.pressureMultiplier;
              let nNearPressure = params.nearPressureMultiplier * nNearDensity;

              let sharedPressure = (myPressure + nPressure) * 0.5;
              let sharedNearPressure = (myNearPressure + nNearPressure) * 0.5;

              let scale1 = derivativeSpikyPow2(dst, params.radius, params.spikyPow2DerivScale) * (sharedPressure / nDensity);
              let scale2 = derivativeSpikyPow3(dst, params.radius, params.spikyPow3DerivScale) * (sharedNearPressure / nDensity);

              force += dir * (scale1 + scale2);
            }
          }
        }
      }
    }

    workgroupBarrier();
    tileStart = tileEnd;
  }

  // =========================================================================
  // PHASE 3: Update velocity
  // =========================================================================

  if (hasParticle && myDensity > 0.0) {
    let accel = force / myDensity;
    velocities[particleIndex] = vec4<f32>(velocities[particleIndex].xyz + accel * params.dt, 0.0);
  }
}
`, pe = `/**
 * ============================================================================
 * VISCOSITY KERNEL (LINEAR GRID + STRIP OPTIMIZATION)
 * ============================================================================
 *
 * Pipeline Stage: Stage 7 (Third SPH physics pass)
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Applies viscous damping using the Linear Grid for neighbor search, with
 * strip optimisation for contiguous X-row iteration.
 *
 * This is the Linear Grid variant of viscosity.wgsl. The physics are
 * identical (Poly6-weighted velocity averaging), but neighbor iteration
 * uses sortOffsets with strip ranges instead of spatial hash key matching.
 *
 * See viscosity.wgsl for detailed physics documentation (Poly6 kernel,
 * viscosity force formulation, numerical stability benefits).
 * ============================================================================
 */

// Beginner note: viscosity smooths velocity differences to reduce jitter.

/**
 * Viscosity Parameters Uniform Buffer
 *
 * Memory Layout (48 bytes):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    dt                - Sub-step timestep
 *   4      4    viscosityStrength - Viscosity coefficient μ
 *   8      4    radius            - Smoothing radius h
 *  12      4    poly6Scale        - Normalisation for Poly6 kernel: 315/(64πh⁹)
 *  16      4    particleCountF    - Particle count as f32
 *  20      4    minBoundsX        - Minimum X of simulation domain
 *  24      4    minBoundsY        - Minimum Y of simulation domain
 *  28      4    minBoundsZ        - Minimum Z of simulation domain
 *  32      4    gridResX          - Grid resolution along X axis
 *  36      4    gridResY          - Grid resolution along Y axis
 *  40      4    gridResZ          - Grid resolution along Z axis
 *  44      4    pad0              - Padding
 * ------
 * Total: 48 bytes
 */
struct ViscosityParams {
  dt: f32,
  viscosityStrength: f32,
  radius: f32,
  poly6Scale: f32,
  particleCountF: f32,
  minBoundsX: f32,
  minBoundsY: f32,
  minBoundsZ: f32,
  gridResX: f32,
  gridResY: f32,
  gridResZ: f32,
  pad0: f32,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Viscosity compute pass (Linear Grid)
//
//   Binding 0: predicted[]   - Predicted positions (for neighbor distances)
//   Binding 1: velocities[]  - Velocities (updated with viscosity damping)
//   Binding 2: sortOffsets[] - Cell start/end offsets for strip iteration
//   Binding 4: params        - Viscosity parameters (note: binding 3 skipped)
// ============================================================================

@group(0) @binding(0) var<storage, read> predicted: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> sortOffsets: array<u32>;
@group(0) @binding(4) var<uniform> params: ViscosityParams;

/**
 * Converts 3D integer cell coordinates to a linear grid index.
 * index = x + width × (y + height × z)
 */
fn getGridIndex(x: i32, y: i32, z: i32) -> u32 {
    let gridRes = vec3<u32>(u32(params.gridResX), u32(params.gridResY), u32(params.gridResZ));
    return u32(x) + gridRes.x * (u32(y) + gridRes.y * u32(z));
}

/** Poly6 kernel: W(r,h) = (h²-r²)³ × scale. Smooth, positive, max at r=0. */
fn smoothingKernelPoly6(dst: f32, radius: f32, scale: f32) -> f32 {
  if (dst < radius) {
    let v = radius * radius - dst * dst;
    return v * v * v * scale;
  }
  return 0.0;
}

/**
 * Main Viscosity Kernel (Strip-Optimised)
 *
 * For each particle, iterates over the 3×3 Y-Z row strips and computes
 * a Poly6-weighted velocity difference from each neighbor:
 *   force += (v_neighbor - v_self) × W(distance)
 *
 * Final update: v += force × viscosityStrength × dt
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 */
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  let count = u32(params.particleCountF + 0.5);

  if (i >= count) { return; }

  let pos = predicted[i].xyz;
  let vel = velocities[i].xyz;

  let gridRes = vec3<i32>(i32(params.gridResX), i32(params.gridResY), i32(params.gridResZ));
  let minBounds = vec3<f32>(params.minBoundsX, params.minBoundsY, params.minBoundsZ);
  let localPos = pos - minBounds;
  
  let cellX = i32(floor(localPos.x / params.radius));
  let cellY = i32(floor(localPos.y / params.radius));
  let cellZ = i32(floor(localPos.z / params.radius));
  
  let cx = clamp(cellX, 0, gridRes.x - 1);
  let cy = clamp(cellY, 0, gridRes.y - 1);
  let cz = clamp(cellZ, 0, gridRes.z - 1);

  let radiusSq = params.radius * params.radius;
  var force = vec3<f32>(0.0);

  let minZ = max(0, cz - 1);
  let maxZ = min(gridRes.z - 1, cz + 1);
  let minY = max(0, cy - 1);
  let maxY = min(gridRes.y - 1, cy + 1);
  let minX = max(0, cx - 1);
  let maxX = min(gridRes.x - 1, cx + 1);

  for (var z = minZ; z <= maxZ; z++) {
    for (var y = minY; y <= maxY; y++) {
      let startKey = getGridIndex(minX, y, z);
      let endKey = getGridIndex(maxX, y, z);
      let start = sortOffsets[startKey];
      let end = sortOffsets[endKey + 1u];

      for (var j = start; j < end; j++) {
            let neighborIndex = j;
            if (neighborIndex != i) {
                let neighborPos = predicted[neighborIndex].xyz;
                let offset = neighborPos - pos;
                let dstSq = dot(offset, offset);

                if (dstSq <= radiusSq) {
                    let dst = sqrt(dstSq);
                    let weight = smoothingKernelPoly6(dst, params.radius, params.poly6Scale);
                    let neighborVel = velocities[neighborIndex].xyz;
                    force = force + (neighborVel - vel) * weight;
                }
            }
      }
    }
  }

  velocities[i] = vec4<f32>(velocities[i].xyz + force * params.viscosityStrength * params.dt, 0.0);
}
`, fe = `/**
 * ============================================================================
 * INTEGRATION & COLLISION SHADER
 * ============================================================================
 *
 * Pipeline Stage: Stage 8 (Final compute pass)
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Updates particle positions based on velocity and handles boundary collisions.
 * This is the final step that commits all physics calculations to position.
 *
 * Time Integration:
 * -----------------
 * Uses simple Euler integration (also called Forward Euler):
 *
 *   position_new = position_old + velocity × dt
 *
 * While more sophisticated integrators exist (Verlet, RK4), Euler is sufficient
 * here because:
 *   1. SPH forces are already computed at predicted positions
 *   2. Timestep is small (typically 1/60 or 1/120 second)
 *   3. Pressure forces provide inherent stability
 *
 * Boundary Collision:
 * -------------------
 * The simulation domain is an axis-aligned box defined by [minBounds, maxBounds].
 *
 *     ┌─────────────────────┐  maxBounds
 *     │                     │
 *     │          ↑          │
 *     │          │          │
 *     │   ←──────┼──────→   │
 *     │          │          │
 *     │          ↓          │
 *     │                     │
 *     └─────────────────────┘  minBounds
 *
 * Collision response:
 *   1. Check if particle is outside [minBounds, maxBounds]
 *   2. If outside, clamp position to boundary
 *   3. Reflect velocity component: vel = -vel × damping
 *
 * Collision Damping:
 *   - 1.0 = perfectly elastic (no energy loss)
 *   - 0.5 = moderate damping (half velocity on bounce)
 *   - 0.0 = perfectly inelastic (stops on contact)
 *
 * Typical values: 0.7 - 0.95 for realistic fluid behavior.
 *
 * Coordinate System:
 * ------------------
 *   +Y = Up
 *   +X = Right
 *   +Z = Forward (out of screen)
 *
 * ============================================================================
 */

// Beginner note: this pass writes final positions (and clamps to bounds).

/**
 * Integration Parameters Uniform Buffer
 *
 * Memory Layout (16-byte aligned):
 * Offset  Size  Field
 * ------  ----  -----
 *   0      4    dt               - Timestep for position integration
 *   4      4    collisionDamping - Velocity multiplier on collision [0, 1]
 *   8      4    hasObstacle      - Flag for dynamic obstacle (unused currently)
 *  12      4    obstacleShape    - 0 = box, 1 = sphere
 *  16     12    minBounds        - Minimum corner of simulation box (x, y, z)
 *  28      4    pad1             - Padding
 *  32     12    maxBounds        - Maximum corner of simulation box (x, y, z)
 *  44      4    pad2             - Padding
 *  48     12    obstacleCenter   - Center of dynamic obstacle
 *  60      4    pad3             - Padding
 *  64     12    obstacleHalf     - Half-extents of obstacle
 *  76      4    pad4             - Padding
 *  80     12    obstacleRotation - Rotation in degrees (XYZ)
 *  92      4    pad5             - Padding
 * ------
 * Total: 96 bytes
 *
 * Note: obstacleRotation is in degrees to match GUI controls.
 */
struct IntegrateParams {
  dt: f32,
  collisionDamping: f32,
  hasObstacle: f32,
  obstacleShape: f32,
  minBounds: vec3<f32>,
  pad1: f32,
  maxBounds: vec3<f32>,
  pad2: f32,
  obstacleCenter: vec3<f32>,
  pad3: f32,
  obstacleHalf: vec3<f32>,
  pad4: f32,
  obstacleRotation: vec3<f32>,
  pad5: f32,
};

// ============================================================================
// BUFFER BINDINGS
// ============================================================================
// Group 0: Integration compute pass
//
//   Binding 0: positions[]  - Particle positions (read-write)
//              Updated with: pos_new = pos_old + vel × dt
//
//   Binding 1: velocities[] - Particle velocities (read-write)
//              Modified on collision: vel = -vel × damping
//
//   Binding 2: params       - Integration parameters
// ============================================================================

@group(0) @binding(0) var<storage, read_write> positions: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> params: IntegrateParams;

fn rotateX(v: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}

fn rotateY(v: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
}

fn rotateZ(v: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(v.x * c - v.y * s, v.x * s + v.y * c, v.z);
}

fn toRadians(v: vec3<f32>) -> vec3<f32> {
  return v * (3.14159265 / 180.0);
}

fn rotateLocalToWorld(v: vec3<f32>, rot: vec3<f32>) -> vec3<f32> {
  var r = v;
  r = rotateX(r, rot.x);
  r = rotateY(r, rot.y);
  r = rotateZ(r, rot.z);
  return r;
}

fn rotateWorldToLocal(v: vec3<f32>, rot: vec3<f32>) -> vec3<f32> {
  var r = v;
  r = rotateZ(r, -rot.z);
  r = rotateY(r, -rot.y);
  r = rotateX(r, -rot.x);
  return r;
}

/**
 * Main Integration Compute Kernel
 *
 * Updates positions and handles boundary collisions.
 *
 * Dispatch: ceil(particleCount / 256) workgroups
 * Each thread processes exactly one particle.
 *
 * Algorithm:
 * 1. Load current position and velocity
 * 2. Integrate: pos += vel × dt
 * 3. For each axis (X, Y, Z):
 *    a. Check if outside bounds
 *    b. If yes, clamp position and reflect velocity
 * 4. Store updated position and velocity
 */
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;

  // Bounds check using arrayLength for safety
  if (index >= arrayLength(&positions)) {
    return;
  }

  // Load current state
  var pos = positions[index].xyz;
  var vel = velocities[index].xyz;

  // ========================================================================
  // TIME INTEGRATION (Euler Method)
  // ========================================================================
  // p(t + dt) = p(t) + v(t) × dt
  //
  // At this point, velocity has been updated by:
  //   - External forces (gravity, interaction)
  //   - Pressure forces
  //   - Viscosity forces
  //
  // The integration commits all these changes to position.
  pos = pos + vel * params.dt;

  // ========================================================================
  // OBSTACLE COLLISION HANDLING (AABB)
  // ========================================================================
  // If enabled, check if particle is inside the obstacle box.
  // If so, push it out to the nearest face and reflect velocity.

  if (params.hasObstacle > 0.5) {
    let obsCenter = params.obstacleCenter;
    let obsHalf = params.obstacleHalf;
    let isSphere = params.obstacleShape > 0.5;

    if (isSphere) {
      let radius = obsHalf.x;
      let delta = pos - obsCenter;
      let dist = length(delta);
      if (dist < radius && radius > 0.0) {
        let normal = delta / max(dist, 1e-5);
        pos = obsCenter + normal * radius;
        let vn = dot(vel, normal);
        if (vn < 0.0) {
          vel = vel - (1.0 + params.collisionDamping) * vn * normal;
        }
      }
    } else {
      let rot = toRadians(params.obstacleRotation);

      // Calculate position relative to obstacle center
      var localPos = rotateWorldToLocal(pos - obsCenter, rot);

      // Check if inside obstacle (overlap on all axes)
      // We use a small epsilon for robustness, though strict inequality is fine
      if (abs(localPos.x) < obsHalf.x && 
          abs(localPos.y) < obsHalf.y && 
          abs(localPos.z) < obsHalf.z) {

          // Determine penetration depth on each axis
          // (Distance to the nearest face)
          let depthX = obsHalf.x - abs(localPos.x);
          let depthY = obsHalf.y - abs(localPos.y);
          let depthZ = obsHalf.z - abs(localPos.z);

          // Find the axis of least penetration (closest face)
          if (depthX < depthY && depthX < depthZ) {
              // ---- X-AXIS COLLISION ----
              // Snap to surface
              localPos.x = obsHalf.x * sign(localPos.x);
              let normal = rotateLocalToWorld(vec3<f32>(sign(localPos.x), 0.0, 0.0), rot);
              pos = obsCenter + rotateLocalToWorld(localPos, rot);
              let vn = dot(vel, normal);
              if (vn < 0.0) {
                vel = vel - (1.0 + params.collisionDamping) * vn * normal;
              }
          } else if (depthY < depthZ) {
              // ---- Y-AXIS COLLISION ----
              localPos.y = obsHalf.y * sign(localPos.y);
              let normal = rotateLocalToWorld(vec3<f32>(0.0, sign(localPos.y), 0.0), rot);
              pos = obsCenter + rotateLocalToWorld(localPos, rot);
              let vn = dot(vel, normal);
              if (vn < 0.0) {
                vel = vel - (1.0 + params.collisionDamping) * vn * normal;
              }
          } else {
              // ---- Z-AXIS COLLISION ----
              localPos.z = obsHalf.z * sign(localPos.z);
              let normal = rotateLocalToWorld(vec3<f32>(0.0, 0.0, sign(localPos.z)), rot);
              pos = obsCenter + rotateLocalToWorld(localPos, rot);
              let vn = dot(vel, normal);
              if (vn < 0.0) {
                vel = vel - (1.0 + params.collisionDamping) * vn * normal;
              }
          }
      }
    }
  }

  // ========================================================================
  // BOUNDARY COLLISION HANDLING
  // ========================================================================
  // For each axis, check if particle has crossed the boundary.
  //
  // Collision detection: check if pos is outside [minBounds, maxBounds]
  //
  // Collision response:
  //   1. Clamp position to boundary
  //   2. Reflect velocity: vel = -vel × damping

  // ---- X-AXIS COLLISION ----
  if (pos.x < params.minBounds.x) {
    pos.x = params.minBounds.x;
    vel.x = -vel.x * params.collisionDamping;
  } else if (pos.x > params.maxBounds.x) {
    pos.x = params.maxBounds.x;
    vel.x = -vel.x * params.collisionDamping;
  }

  // ---- Y-AXIS COLLISION ----
  if (pos.y < params.minBounds.y) {
    pos.y = params.minBounds.y;
    vel.y = -vel.y * params.collisionDamping;
  } else if (pos.y > params.maxBounds.y) {
    pos.y = params.maxBounds.y;
    vel.y = -vel.y * params.collisionDamping;
  }

  // ---- Z-AXIS COLLISION ----
  if (pos.z < params.minBounds.z) {
    pos.z = params.minBounds.z;
    vel.z = -vel.z * params.collisionDamping;
  } else if (pos.z > params.maxBounds.z) {
    pos.z = params.maxBounds.z;
    vel.z = -vel.z * params.collisionDamping;
  }

  // ========================================================================
  // WRITE BACK RESULTS
  // ========================================================================
  // Store updated position (w = 1.0 for homogeneous coordinates)
  // Store updated velocity (w = 0.0, velocity is a direction/rate)
  positions[index] = vec4<f32>(pos, 1.0);
  velocities[index] = vec4<f32>(vel, 0.0);
}
`;
class he {
  /**
   * Beginner note:
   * This class owns compute pipelines for the core SPH passes.
   * It does not manage buffers; it just dispatches pipelines in order.
   */
  device;
  // Physics Pipelines
  externalForcesPipeline;
  densityPipeline;
  pressurePipeline;
  viscosityPipeline;
  integratePipeline;
  // Bind Groups
  externalBG;
  densityBG;
  pressureBG;
  viscosityBG;
  integrateBG;
  // Workgroup size for density/pressure (64 for shared memory, 256 for standard)
  densityPressureWorkgroupSize;
  constructor(e, n = !1) {
    this.device = e;
    const i = n ? ce : le, t = n ? ue : de;
    this.densityPressureWorkgroupSize = n ? 64 : 256, n && console.log("FluidPhysics: Using shared memory optimized shaders"), this.externalForcesPipeline = this.createPipeline(
      oe,
      "main"
    ), this.densityPipeline = this.createPipeline(i, "main"), this.pressurePipeline = this.createPipeline(t, "main"), this.viscosityPipeline = this.createPipeline(pe, "main"), this.integratePipeline = this.createPipeline(fe, "main");
  }
  createPipeline(e, n) {
    return this.device.createComputePipeline({
      layout: "auto",
      compute: {
        module: this.device.createShaderModule({ code: e }),
        entryPoint: n
      }
    });
  }
  /**
   * (Re)creates bind groups when buffers change.
   */
  createBindGroups(e, n) {
    this.externalBG = this.device.createBindGroup({
      layout: this.externalForcesPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.positions } },
        { binding: 1, resource: { buffer: e.velocities } },
        { binding: 2, resource: { buffer: e.predicted } },
        { binding: 3, resource: { buffer: n.external } }
      ]
    }), this.densityBG = this.device.createBindGroup({
      layout: this.densityPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.predicted } },
        { binding: 1, resource: { buffer: e.sortOffsets } },
        { binding: 2, resource: { buffer: e.densities } },
        { binding: 3, resource: { buffer: n.density } }
      ]
    }), this.pressureBG = this.device.createBindGroup({
      layout: this.pressurePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.predicted } },
        { binding: 1, resource: { buffer: e.velocities } },
        { binding: 2, resource: { buffer: e.densities } },
        { binding: 3, resource: { buffer: e.sortOffsets } },
        { binding: 4, resource: { buffer: n.pressure } }
      ]
    }), this.viscosityBG = this.device.createBindGroup({
      layout: this.viscosityPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.predicted } },
        { binding: 1, resource: { buffer: e.velocities } },
        { binding: 2, resource: { buffer: e.sortOffsets } },
        { binding: 4, resource: { buffer: n.viscosity } }
      ]
    }), this.integrateBG = this.device.createBindGroup({
      layout: this.integratePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.positions } },
        { binding: 1, resource: { buffer: e.velocities } },
        { binding: 2, resource: { buffer: n.integrate } }
      ]
    });
  }
  /**
   * Executes a single simulation substep.
   */
  step(e, n, i, t, a = !0, s = !0) {
    const o = Math.ceil(i / 256), c = Math.ceil(
      i / this.densityPressureWorkgroupSize
    );
    e.setPipeline(this.externalForcesPipeline), e.setBindGroup(0, this.externalBG), e.dispatchWorkgroups(o), s && n.dispatch(e, i, t), e.setPipeline(this.densityPipeline), e.setBindGroup(0, this.densityBG), e.dispatchWorkgroups(c), e.setPipeline(this.pressurePipeline), e.setBindGroup(0, this.pressureBG), e.dispatchWorkgroups(c), a && (e.setPipeline(this.viscosityPipeline), e.setBindGroup(0, this.viscosityBG), e.dispatchWorkgroups(o)), e.setPipeline(this.integratePipeline), e.setBindGroup(0, this.integrateBG), e.dispatchWorkgroups(o);
  }
}
const me = `/**
 * ============================================================================
 * FOAM SPAWN COMPUTE SHADER (MATCHING UNITY)
 * ============================================================================
 *
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Spawns foam/spray particles using Unity's "Trapped Air" model.
 * 
 * Logic:
 * 1. Calculate 'weightedVelocityDifference' by searching neighbors.
 * 2. Calculate 'kineticEnergy' (speed squared).
 * 3. Spawn probability = trappedAirFactor * kineticEnergyFactor * dt.
 *
 * ============================================================================
 */

// Beginner note: foam particles are stored in a ring buffer using an atomic counter.

@group(0) @binding(0) var<storage, read> fluidPositions: array<vec4<f32>>; // Predicted
@group(0) @binding(1) var<storage, read> fluidVelocities: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> foamPositions: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> foamVelocities: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> foamCounter: atomic<u32>;
@group(0) @binding(6) var<uniform> params: FoamSpawnParams;
@group(0) @binding(7) var<storage, read> sortOffsets: array<u32>;

struct FoamSpawnParams {
  dt: f32,
  airRate: f32,
  airMin: f32,
  airMax: f32,
  kinMin: f32,
  kinMax: f32,
  maxFoam: u32,
  frameCount: u32,
  particleCount: u32,
  radius: f32,
  lifeMin: f32,
  lifeMax: f32,
  minBounds: vec3<f32>,
  pad1: f32,
  gridRes: vec3<f32>,
  bubbleScale: f32,
};

fn pcgHash(input: u32) -> u32 {
  var state = input * 747796405u + 2891336453u;
  var word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn randomFloat(seed: u32) -> f32 {
  return f32(pcgHash(seed)) / 4294967295.0;
}

fn remap01(val: f32, minVal: f32, maxVal: f32) -> f32 {
  return saturate((val - minVal) / (maxVal - minVal));
}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;
  if (index >= params.particleCount) { return; }

  let pos = fluidPositions[index].xyz;
  let vel = fluidVelocities[index].xyz;
  
  // ========================================================================
  // NEIGHBOR SEARCH (TRAPPED AIR CALCULATION)
  // ========================================================================
  var weightedVelocityDifference = 0.0;
  let radiusSq = params.radius * params.radius;

  let gridRes = vec3<i32>(i32(params.gridRes.x), i32(params.gridRes.y), i32(params.gridRes.z));
  let localPos = pos - params.minBounds;
  let cellX = i32(floor(localPos.x / params.radius));
  let cellY = i32(floor(localPos.y / params.radius));
  let cellZ = i32(floor(localPos.z / params.radius));

  for (var z = -1; z <= 1; z++) {
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        let cx = cellX + x;
        let cy = cellY + y;
        let cz = cellZ + z;

        if (cx >= 0 && cx < gridRes.x && cy >= 0 && cy < gridRes.y && cz >= 0 && cz < gridRes.z) {
           let key = u32(cx) + u32(gridRes.x) * (u32(cy) + u32(gridRes.y) * u32(cz));
           let start = sortOffsets[key];
           let end = sortOffsets[key + 1u];

           for (var j = start; j < end; j++) {
             if (j == index) { continue; }
             
             let fPos = fluidPositions[j].xyz;
             let offset = fPos - pos;
             let dstSq = dot(offset, offset);

             if (dstSq < radiusSq) {
               let dst = sqrt(dstSq);
               let dirToNeighbour = offset / dst;
               
               let relativeVelocity = vel - fluidVelocities[j].xyz;
               let relVelMag = length(relativeVelocity);
               let relVelDir = relativeVelocity / max(0.000001, relVelMag);
               
               // Unity: 1 - dot(relVelDir, -dirToNeighbour)
               let convergeWeight = 1.0 - dot(relVelDir, -dirToNeighbour);
               let influence = 1.0 - saturate(dst / params.radius);
               
               weightedVelocityDifference += relVelMag * convergeWeight * influence;
             }
           }
        }
      }
    }
  }

  // ========================================================================
  // SPAWN CALCULATION
  // ========================================================================
  let trappedAirFactor = params.airRate * remap01(weightedVelocityDifference, params.airMin, params.airMax);
  let kineticEnergyFactor = remap01(dot(vel, vel), params.kinMin, params.kinMax);
  let particleSpawnFactor = trappedAirFactor * kineticEnergyFactor * params.dt;

  let particleSpawnCount = i32(floor(particleSpawnFactor));
  let fractionalSpawnRemainder = particleSpawnFactor - f32(particleSpawnCount);

  let baseSeed = index * 1000u + params.frameCount;
  var actualSpawnCount = particleSpawnCount;
  if (randomFloat(baseSeed) < fractionalSpawnRemainder) {
    actualSpawnCount += 1;
  }

  if (actualSpawnCount <= 0) { return; }

  // Clamp spawn count to avoid massive bursts
  let count = min(actualSpawnCount, 10); 

  for (var i = 0; i < count; i++) {
    let slot = atomicAdd(&foamCounter, 1u) % params.maxFoam;
    
    let s = baseSeed + u32(i) * 7u;
    let r1 = randomFloat(s + 1u);
    let r2 = randomFloat(s + 2u);
    let r3 = randomFloat(s + 3u);
    
    // Unity uses a cylinder spawner based on velocity, let's approximate
    let spawnPos = pos + vel * params.dt * randomFloat(s + 4u);
    let foamVel = vel + vec3<f32>(randomFloat(s+5u)-0.5, randomFloat(s+6u), randomFloat(s+7u)-0.5) * 2.0;
    
    let lifetime = mix(params.lifeMin, params.lifeMax, randomFloat(s + 8u));
    let scale = (params.bubbleScale + 1.0) / 2.0;

    foamPositions[slot] = vec4<f32>(spawnPos, lifetime);
    foamVelocities[slot] = vec4<f32>(foamVel, scale);
  }
}
`, ge = `/**
 * ============================================================================
 * FOAM SPAWN COMPUTE SHADER - SUBGROUP OPTIMIZED
 * ============================================================================
 *
 * This version uses subgroup operations to reduce atomic contention.
 * Instead of every thread doing atomicAdd for each foam particle spawn,
 * threads within a subgroup coordinate:
 *   1. Each thread calculates its total spawn count
 *   2. subgroupExclusiveAdd gives local offset within subgroup
 *   3. Only lane 0 does the global atomicAdd for the whole subgroup
 *   4. subgroupBroadcastFirst shares the base offset with all lanes
 *
 * This significantly reduces atomic contention when many particles spawn foam.
 * ============================================================================
 */

enable subgroups;

@group(0) @binding(0) var<storage, read> fluidPositions: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> fluidVelocities: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> foamPositions: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> foamVelocities: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> foamCounter: atomic<u32>;
@group(0) @binding(6) var<uniform> params: FoamSpawnParams;
@group(0) @binding(7) var<storage, read> sortOffsets: array<u32>;

struct FoamSpawnParams {
  dt: f32,
  airRate: f32,
  airMin: f32,
  airMax: f32,
  kinMin: f32,
  kinMax: f32,
  maxFoam: u32,
  frameCount: u32,
  particleCount: u32,
  radius: f32,
  lifeMin: f32,
  lifeMax: f32,
  minBounds: vec3<f32>,
  pad1: f32,
  gridRes: vec3<f32>,
  bubbleScale: f32,
};

fn pcgHash(input: u32) -> u32 {
  var state = input * 747796405u + 2891336453u;
  var word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn randomFloat(seed: u32) -> f32 {
  return f32(pcgHash(seed)) / 4294967295.0;
}

fn remap01(val: f32, minVal: f32, maxVal: f32) -> f32 {
  return saturate((val - minVal) / (maxVal - minVal));
}

@compute @workgroup_size(256)
fn main(
  @builtin(global_invocation_id) id: vec3<u32>,
  @builtin(subgroup_size) sg_size: u32,
  @builtin(subgroup_invocation_id) sg_lane: u32
) {
  let index = id.x;
  let outOfBounds = index >= params.particleCount;

  // Even out-of-bounds threads must participate in subgroup operations
  var mySpawnCount: u32 = 0u;
  var baseSeed: u32 = 0u;
  var pos: vec3<f32>;
  var vel: vec3<f32>;

  if (!outOfBounds) {
    pos = fluidPositions[index].xyz;
    vel = fluidVelocities[index].xyz;

    // ========================================================================
    // NEIGHBOR SEARCH (TRAPPED AIR CALCULATION)
    // ========================================================================
    var weightedVelocityDifference = 0.0;
    let radiusSq = params.radius * params.radius;

    let gridRes = vec3<i32>(i32(params.gridRes.x), i32(params.gridRes.y), i32(params.gridRes.z));
    let localPos = pos - params.minBounds;
    let cellX = i32(floor(localPos.x / params.radius));
    let cellY = i32(floor(localPos.y / params.radius));
    let cellZ = i32(floor(localPos.z / params.radius));

    for (var z = -1; z <= 1; z++) {
      for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
          let cx = cellX + x;
          let cy = cellY + y;
          let cz = cellZ + z;

          if (cx >= 0 && cx < gridRes.x && cy >= 0 && cy < gridRes.y && cz >= 0 && cz < gridRes.z) {
             let key = u32(cx) + u32(gridRes.x) * (u32(cy) + u32(gridRes.y) * u32(cz));
             let start = sortOffsets[key];
             let end = sortOffsets[key + 1u];

             for (var j = start; j < end; j++) {
               if (j == index) { continue; }

               let fPos = fluidPositions[j].xyz;
               let offset = fPos - pos;
               let dstSq = dot(offset, offset);

               if (dstSq < radiusSq) {
                 let dst = sqrt(dstSq);
                 let dirToNeighbour = offset / dst;

                 let relativeVelocity = vel - fluidVelocities[j].xyz;
                 let relVelMag = length(relativeVelocity);
                 let relVelDir = relativeVelocity / max(0.000001, relVelMag);

                 let convergeWeight = 1.0 - dot(relVelDir, -dirToNeighbour);
                 let influence = 1.0 - saturate(dst / params.radius);

                 weightedVelocityDifference += relVelMag * convergeWeight * influence;
               }
             }
          }
        }
      }
    }

    // ========================================================================
    // SPAWN CALCULATION
    // ========================================================================
    let trappedAirFactor = params.airRate * remap01(weightedVelocityDifference, params.airMin, params.airMax);
    let kineticEnergyFactor = remap01(dot(vel, vel), params.kinMin, params.kinMax);
    let particleSpawnFactor = trappedAirFactor * kineticEnergyFactor * params.dt;

    let particleSpawnCount = i32(floor(particleSpawnFactor));
    let fractionalSpawnRemainder = particleSpawnFactor - f32(particleSpawnCount);

    baseSeed = index * 1000u + params.frameCount;
    var actualSpawnCount = particleSpawnCount;
    if (randomFloat(baseSeed) < fractionalSpawnRemainder) {
      actualSpawnCount += 1;
    }

    // Clamp spawn count to avoid massive bursts
    mySpawnCount = u32(clamp(actualSpawnCount, 0, 10));
  }

  // =========================================================================
  // SUBGROUP FOAM ALLOCATION
  // =========================================================================
  // Instead of each thread doing atomicAdd per foam particle, we use subgroup ops:
  // 1. Get exclusive prefix sum of spawn counts within subgroup
  // 2. Get total spawns for entire subgroup
  // 3. Only lane 0 does the global atomicAdd
  // 4. Broadcast result to all lanes using subgroupBroadcastFirst

  // Get my offset within the subgroup
  let localOffset = subgroupExclusiveAdd(mySpawnCount);

  // Get total foam particles for this subgroup
  let subgroupTotal = subgroupAdd(mySpawnCount);

  // Lane 0 does the global atomic allocation
  var subgroupBase: u32 = 0u;
  if (sg_lane == 0u) {
    if (subgroupTotal > 0u) {
      subgroupBase = atomicAdd(&foamCounter, subgroupTotal);
    }
  }

  // Broadcast the base index from lane 0 to all lanes
  subgroupBase = subgroupBroadcastFirst(subgroupBase);

  // Now each thread knows its global base slot: subgroupBase + localOffset
  let baseSlot = subgroupBase + localOffset;

  // Early exit if we have no foam to spawn
  if (mySpawnCount == 0u) {
    return;
  }

  // ========================================================================
  // SPAWN FOAM PARTICLES
  // ========================================================================
  for (var i: u32 = 0u; i < mySpawnCount; i++) {
    // Ring buffer index
    let slot = (baseSlot + i) % params.maxFoam;

    let s = baseSeed + i * 7u;

    // Unity uses a cylinder spawner based on velocity, let's approximate
    let spawnPos = pos + vel * params.dt * randomFloat(s + 4u);
    let foamVel = vel + vec3<f32>(randomFloat(s+5u)-0.5, randomFloat(s+6u), randomFloat(s+7u)-0.5) * 2.0;

    let lifetime = mix(params.lifeMin, params.lifeMax, randomFloat(s + 8u));
    let scale = (params.bubbleScale + 1.0) / 2.0;

    foamPositions[slot] = vec4<f32>(spawnPos, lifetime);
    foamVelocities[slot] = vec4<f32>(foamVel, scale);
  }
}
`, ye = `/**
 * ============================================================================
 * FOAM UPDATE COMPUTE SHADER (WITH FLUID ADVECTION)
 * ============================================================================
 *
 * Entry Point: main
 * Workgroup Size: 256 threads
 *
 * Purpose:
 * --------
 * Updates foam particle physics with classification:
 * 1. Foam: Advected by fluid velocity (stays on surface)
 * 2. Bubble: Buoyancy pushes it up + fluid advection
 * 3. Spray: Ballistic (gravity + drag)
 *
 * Uses neighbor search (Linear Grid) to determine particle type and
 * local fluid velocity.
 * ============================================================================
 */

// Beginner note: this pass advances foam particles and classifies them
// as foam/bubble/spray based on local neighbor counts.

struct FoamUpdateParams {
  dt: f32,
  gravity: f32,
  dragCoeff: f32,
  buoyancy: f32,
  maxBounds: vec3<f32>,
  radius: f32,
  minBounds: vec3<f32>,
  pad0: f32,
  gridRes: vec3<f32>,
  pad1: f32,
  minBubble: u32,
  maxSpray: u32,
  bubbleScale: f32,
  scaleChangeSpeed: f32,
};

@group(0) @binding(0) var<storage, read_write> foamPositions: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> foamVelocities: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> params: FoamUpdateParams;
@group(0) @binding(3) var<storage, read> fluidPositions: array<vec4<f32>>; // Predicted
@group(0) @binding(4) var<storage, read> fluidVelocities: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> sortOffsets: array<u32>;

/** Poly6 kernel: W(r,h) = (h²-r²)³ × scale. Using unscaled for weighting. */
fn poly6Weight(dst: f32, radius: f32) -> f32 {
  if (dst < radius) {
    let v = radius * radius - dst * dst;
    return v * v * v;
  }
  return 0.0;
}

fn getGridIndex(pos: vec3<f32>) -> u32 {
    let gridRes = vec3<u32>(u32(params.gridRes.x), u32(params.gridRes.y), u32(params.gridRes.z));
    let localPos = pos - params.minBounds;
    let cellX = u32(clamp(floor(localPos.x / params.radius), 0.0, f32(gridRes.x - 1u)));
    let cellY = u32(clamp(floor(localPos.y / params.radius), 0.0, f32(gridRes.y - 1u)));
    let cellZ = u32(clamp(floor(localPos.z / params.radius), 0.0, f32(gridRes.z - 1u)));
    return cellX + gridRes.x * (cellY + gridRes.y * cellZ);
}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;
  if (index >= arrayLength(&foamPositions)) { return; }

  var posData = foamPositions[index];
  var velData = foamVelocities[index];
  var lifetime = posData.w;

  if (lifetime <= 0.0) { return; }

  // Decrement lifetime (dissolve)
  lifetime -= params.dt;

  var pos = posData.xyz;
  var vel = velData.xyz;
  let scale = velData.w;

  // ========================================================================
  // NEIGHBOR SEARCH (FLUID COUPLING)
  // ========================================================================
  var velocitySum = vec3<f32>(0.0);
  var weightSum = 0.0;
  var neighbourCount = 0u;

  let radiusSq = params.radius * params.radius;
  
  // Grid lookup
  let gridRes = vec3<i32>(i32(params.gridRes.x), i32(params.gridRes.y), i32(params.gridRes.z));
  let localPos = pos - params.minBounds;
  let cellX = i32(floor(localPos.x / params.radius));
  let cellY = i32(floor(localPos.y / params.radius));
  let cellZ = i32(floor(localPos.z / params.radius));

  // 3x3x3 Search
  for (var z = -1; z <= 1; z++) {
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        let cx = cellX + x;
        let cy = cellY + y;
        let cz = cellZ + z;

        if (cx >= 0 && cx < gridRes.x && cy >= 0 && cy < gridRes.y && cz >= 0 && cz < gridRes.z) {
           let key = u32(cx) + u32(gridRes.x) * (u32(cy) + u32(gridRes.y) * u32(cz));
           let start = sortOffsets[key];
           let end = sortOffsets[key + 1u];

           for (var j = start; j < end; j++) {
             let fPos = fluidPositions[j].xyz;
             let offset = fPos - pos;
             let dstSq = dot(offset, offset);

             if (dstSq < radiusSq) {
               let dst = sqrt(dstSq);
               let weight = poly6Weight(dst, params.radius);
               
               velocitySum += fluidVelocities[j].xyz * weight;
               weightSum += weight;
               neighbourCount++;
             }
           }
        }
      }
    }
  }

  // ========================================================================
  // CLASSIFICATION & UPDATE
  // ========================================================================
  let isSpray = neighbourCount <= params.maxSpray;
  let isBubble = neighbourCount >= params.minBubble;
  let isFoam = !isSpray && !isBubble;

  if (isFoam) {
    // Foam: Advected by fluid
    if (weightSum > 0.0001) {
      vel = velocitySum / weightSum;
    }
  } else if (isBubble) {
    // Bubble: Buoyancy + Advection
    // Accelerate bubble to match fluid velocity
    if (weightSum > 0.0001) {
      let fluidVel = velocitySum / weightSum;
      let accelFluid = (fluidVel - vel) * 3.0; // Coupling strength
      let accelBuoyancy = vec3<f32>(0.0, -params.gravity * params.buoyancy, 0.0); // Upward
      vel += (accelFluid + accelBuoyancy) * params.dt;
    }
  } else {
    // Spray: Gravity + Drag
    vel.y += params.gravity * params.dt;
    vel *= (1.0 - params.dragCoeff * params.dt);
  }

  // Scale interpolation: bubbles shrink toward bubbleScale, foam/spray expand toward 1.0
  let targetScale = select(1.0, params.bubbleScale, isBubble);
  let newScale = mix(scale, targetScale, params.dt * params.scaleChangeSpeed);

  // Integrate
  pos += vel * params.dt;

  // Boundary
  let damping = 0.5;
  let minB = params.minBounds;
  let maxB = params.maxBounds;
  if (pos.x < minB.x) { pos.x = minB.x; vel.x *= -damping; }
  if (pos.x > maxB.x) { pos.x = maxB.x; vel.x *= -damping; }
  if (pos.y < minB.y) { pos.y = minB.y; vel.y *= -damping; }
  if (pos.y > maxB.y) { pos.y = maxB.y; vel.y *= -damping; }
  if (pos.z < minB.z) { pos.z = minB.z; vel.z *= -damping; }
  if (pos.z > maxB.z) { pos.z = maxB.z; vel.z *= -damping; }

  foamPositions[index] = vec4<f32>(pos, lifetime);
  foamVelocities[index] = vec4<f32>(vel, newScale);
}
`, ve = `/**
 * ============================================================================
 * FOAM CLEAR COUNTER COMPUTE SHADER
 * ============================================================================
 *
 * Entry Point: main
 * Workgroup Size: 1 thread
 *
 * Purpose:
 * --------
 * Resets the foam spawn counter to zero at the start of each frame,
 * before the foam spawn pass runs.
 *
 * ============================================================================
 */

@group(0) @binding(0) var<storage, read_write> foamCounter: atomic<u32>;

@compute @workgroup_size(1)
fn main() {
  atomicStore(&foamCounter, 0u);
}
`;
class be {
  /**
   * Beginner note:
   * This pipeline is a small, separate compute system that spawns and updates
   * foam particles using the same grid data as the SPH simulation.
   */
  device;
  foamClearCounter;
  foamSpawn;
  foamUpdate;
  foamClearCounterBindGroup;
  foamSpawnBindGroup;
  foamUpdateBindGroup;
  constructor(e, n = !1) {
    this.device = e;
    const i = n ? ge : me;
    n && console.log("FoamPipeline: Using subgroup-optimized foam spawn shader"), this.foamClearCounter = this.createPipeline(ve, "main"), this.foamSpawn = this.createPipeline(i, "main"), this.foamUpdate = this.createPipeline(ye, "main");
  }
  createPipeline(e, n) {
    return this.device.createComputePipeline({
      layout: "auto",
      compute: {
        module: this.device.createShaderModule({ code: e }),
        entryPoint: n
      }
    });
  }
  createBindGroups(e, n) {
    if (!e.foamPositions || !e.foamVelocities || !e.foamCounter)
      throw new Error(
        "FoamPipeline requires FluidBuffers created with includeFoam."
      );
    this.foamClearCounterBindGroup = this.device.createBindGroup({
      layout: this.foamClearCounter.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: e.foamCounter } }]
    }), this.foamSpawnBindGroup = this.device.createBindGroup({
      layout: this.foamSpawn.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.predicted } },
        { binding: 1, resource: { buffer: e.velocities } },
        { binding: 3, resource: { buffer: e.foamPositions } },
        { binding: 4, resource: { buffer: e.foamVelocities } },
        { binding: 5, resource: { buffer: e.foamCounter } },
        { binding: 6, resource: { buffer: n.spawn } },
        { binding: 7, resource: { buffer: e.sortOffsets } }
      ]
    }), this.foamUpdateBindGroup = this.device.createBindGroup({
      layout: this.foamUpdate.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: e.foamPositions } },
        { binding: 1, resource: { buffer: e.foamVelocities } },
        { binding: 2, resource: { buffer: n.update } },
        { binding: 3, resource: { buffer: e.predicted } },
        { binding: 4, resource: { buffer: e.velocities } },
        { binding: 5, resource: { buffer: e.sortOffsets } }
      ]
    });
  }
  dispatch(e, n, i, t = !1) {
    if (t) {
      const o = e.beginComputePass();
      o.setPipeline(this.foamClearCounter), o.setBindGroup(0, this.foamClearCounterBindGroup), o.dispatchWorkgroups(1), o.end();
    }
    const a = e.beginComputePass();
    a.setPipeline(this.foamSpawn), a.setBindGroup(0, this.foamSpawnBindGroup), a.dispatchWorkgroups(Math.ceil(n / 256)), a.end();
    const s = e.beginComputePass();
    s.setPipeline(this.foamUpdate), s.setBindGroup(0, this.foamUpdateBindGroup), s.dispatchWorkgroups(Math.ceil(i / 256)), s.end();
  }
}
function xe(r, e, n, i) {
  const t = 1 / Math.tan(r / 2), a = 1 / (n - i), s = new Float32Array(16);
  return s[0] = t / e, s[5] = t, s[10] = (i + n) * a, s[11] = -1, s[14] = 2 * i * n * a, s;
}
function Pe(r, e, n, i, t, a) {
  const s = 1 / (e - r), o = 1 / (i - n), c = 1 / (a - t), l = new Float32Array(16);
  return l[0] = 2 * s, l[5] = 2 * o, l[10] = c, l[12] = -(e + r) * s, l[13] = -(i + n) * o, l[14] = -t * c, l[15] = 1, l;
}
function Se(r) {
  const e = new Float32Array(16), n = r[0], i = r[1], t = r[2], a = r[3], s = r[4], o = r[5], c = r[6], l = r[7], f = r[8], p = r[9], u = r[10], g = r[11], P = r[12], h = r[13], b = r[14], m = r[15], d = n * o - i * s, w = n * c - t * s, G = n * l - a * s, T = i * c - t * o, z = i * l - a * o, v = t * l - a * c, S = f * h - p * P, B = f * b - u * P, x = f * m - g * P, R = p * b - u * h, k = p * m - g * h, C = u * m - g * b;
  let y = d * C - w * k + G * R + T * x - z * B + v * S;
  return y && (y = 1 / y, e[0] = (o * C - c * k + l * R) * y, e[1] = (t * k - i * C - a * R) * y, e[2] = (h * v - b * z + m * T) * y, e[3] = (u * z - p * v - g * T) * y, e[4] = (c * x - s * C - l * B) * y, e[5] = (n * C - t * x + a * B) * y, e[6] = (b * G - P * v - m * w) * y, e[7] = (f * v - u * G + g * w) * y, e[8] = (s * k - o * x + l * S) * y, e[9] = (i * x - n * k - a * S) * y, e[10] = (P * z - h * G + m * d) * y, e[11] = (p * G - f * z - g * d) * y, e[12] = (o * B - s * R - c * S) * y, e[13] = (n * R - i * B + t * S) * y, e[14] = (h * w - P * T - b * d) * y, e[15] = (f * T - p * w + u * d) * y), e;
}
function X(r, e, n) {
  const i = V(we(r, e)), t = V(W(n, i)), a = W(i, t), s = new Float32Array(16);
  return s[0] = t.x, s[1] = a.x, s[2] = i.x, s[3] = 0, s[4] = t.y, s[5] = a.y, s[6] = i.y, s[7] = 0, s[8] = t.z, s[9] = a.z, s[10] = i.z, s[11] = 0, s[12] = -_(t, r), s[13] = -_(a, r), s[14] = -_(i, r), s[15] = 1, s;
}
function Z(r, e) {
  const n = new Float32Array(16);
  for (let i = 0; i < 4; i++)
    for (let t = 0; t < 4; t++) {
      let a = 0;
      for (let s = 0; s < 4; s++)
        a += r[s * 4 + i] * e[t * 4 + s];
      n[t * 4 + i] = a;
    }
  return n;
}
function we(r, e) {
  return { x: r.x - e.x, y: r.y - e.y, z: r.z - e.z };
}
function V(r) {
  const e = Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z);
  return { x: r.x / e, y: r.y / e, z: r.z / e };
}
function W(r, e) {
  return {
    x: r.y * e.z - r.z * e.y,
    y: r.z * e.x - r.x * e.z,
    z: r.x * e.y - r.y * e.x
  };
}
function _(r, e) {
  return r.x * e.x + r.y * e.y + r.z * e.z;
}
function H(r, e) {
  return { x: r.x + e.x, y: r.y + e.y, z: r.z + e.z };
}
const Be = `/**
 * Depth Pass Shader (screen-space fluids)
 *
 * Beginner note: renders particle depth into a depth texture using billboards.
 */

struct Uniforms {
  viewProjection: mat4x4<f32>,
  canvasSize: vec2<f32>,
  particleRadius: f32,
  _pad: f32,
  nearFar: vec2<f32>,
};

@group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) depth: f32,
};

@vertex
fn vs_main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32
) -> VertexOutput {
  let pos = positions[instanceIndex].xyz;

  var quadPos = vec2<f32>(0.0, 0.0);
  switch (vertexIndex) {
    case 0u: { quadPos = vec2<f32>(-1.0, -1.0); }
    case 1u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 2u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 3u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 4u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 5u: { quadPos = vec2<f32>( 1.0,  1.0); }
    default: { quadPos = vec2<f32>(0.0, 0.0); }
  }

  let clipPos = uniforms.viewProjection * vec4<f32>(pos, 1.0);
  let radiusNdc = vec2<f32>(
    uniforms.particleRadius / uniforms.canvasSize.x * 2.0,
    uniforms.particleRadius / uniforms.canvasSize.y * 2.0
  );
  let offset = quadPos * radiusNdc * clipPos.w;

  var out: VertexOutput;
  out.position = clipPos + vec4<f32>(offset, 0.0, 0.0);
  out.uv = quadPos;
  out.depth = clipPos.z / clipPos.w;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) f32 {
  let d = length(in.uv);
  if (d > 1.0) {
    discard;
  }
  return clamp(in.depth, 0.0, 1.0);
}
`;
class Ce {
  device;
  pipeline;
  uniformBuffer;
  bindGroupLayout;
  bindGroup = null;
  constructor(e) {
    this.device = e, this.uniformBuffer = e.createBuffer({
      size: 96,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        }
      ]
    });
    const n = e.createShaderModule({ code: Be });
    this.pipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout]
      }),
      vertex: {
        module: n,
        entryPoint: "vs_main"
      },
      fragment: {
        module: n,
        entryPoint: "fs_main",
        targets: [{ format: "r16float" }]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none"
      },
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: !0,
        depthCompare: "less"
      }
    });
  }
  resize(e, n) {
  }
  createBindGroup(e) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: e.buffers.positions } },
        { binding: 1, resource: { buffer: this.uniformBuffer } }
      ]
    });
  }
  encode(e, n, i) {
    if (!n.depthTexture || !this.bindGroup)
      return;
    const t = new Float32Array(24);
    if (t.set(i.viewProjection), t[16] = i.canvasWidth, t[17] = i.canvasHeight, t[18] = i.particleRadius, t[19] = 0, t[20] = i.near, t[21] = i.far, this.device.queue.writeBuffer(this.uniformBuffer, 0, t), !n.smoothTextureA)
      return;
    const a = e.beginRenderPass({
      colorAttachments: [
        {
          view: n.smoothTextureA.createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: n.depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      }
    });
    a.setPipeline(this.pipeline), a.setBindGroup(0, this.bindGroup), a.draw(6, n.buffers.particleCount), a.end();
  }
}
const ze = `/**
 * Foam Render Shader
 *
 * Beginner note: draws foam particles as soft billboards into a foam texture.
 */

struct Uniforms {
  viewProjection: mat4x4<f32>,
  canvasSize: vec2<f32>,
  particleRadius: f32,
  pad0: f32,
};

@group(0) @binding(0) var<storage, read> foamPositions: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> foamVelocities: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) intensity: f32,
};

@vertex
fn vs_main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32
) -> VertexOutput {
  let posData = foamPositions[instanceIndex];
  let velData = foamVelocities[instanceIndex];

  let pos = posData.xyz;
  let lifetime = posData.w;
  let scale = velData.w;

  var out: VertexOutput;

  // Dead particles produce degenerate triangles (behind far plane)
  if (lifetime <= 0.0) {
    out.position = vec4<f32>(0.0, 0.0, 2.0, 1.0);
    out.uv = vec2<f32>(0.0, 0.0);
    out.intensity = 0.0;
    return out;
  }

  var quadPos = vec2<f32>(0.0, 0.0);
  switch (vertexIndex) {
    case 0u: { quadPos = vec2<f32>(-1.0, -1.0); }
    case 1u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 2u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 3u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 4u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 5u: { quadPos = vec2<f32>( 1.0,  1.0); }
    default: { quadPos = vec2<f32>(0.0, 0.0); }
  }

  // Fade out over last 2 seconds of lifetime
  let dissolveScale = saturate(lifetime / 2.0);

  let clipPos = uniforms.viewProjection * vec4<f32>(pos, 1.0);
  let billboardSize = uniforms.particleRadius * scale * dissolveScale;
  let radiusNdc = vec2<f32>(
    billboardSize / uniforms.canvasSize.x * 2.0,
    billboardSize / uniforms.canvasSize.y * 2.0
  );
  let offset = quadPos * radiusNdc * clipPos.w;

  out.position = clipPos + vec4<f32>(offset, 0.0, 0.0);
  out.uv = quadPos;
  out.intensity = dissolveScale;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) f32 {
  let d = length(in.uv);
  if (d > 1.0) {
    discard;
  }
  return in.intensity * (1.0 - d);
}
`;
class Ge {
  device;
  pipeline;
  bindGroupLayout;
  bindGroup = null;
  uniformBuffer;
  maxFoamParticles = 0;
  constructor(e) {
    this.device = e, this.uniformBuffer = e.createBuffer({
      size: 80,
      // mat4(64) + vec2(8) + f32(4) + pad(4) = 80
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" }
        }
      ]
    });
    const n = e.createShaderModule({ code: ze });
    this.pipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout]
      }),
      vertex: { module: n, entryPoint: "vs_main" },
      fragment: {
        module: n,
        entryPoint: "fs_main",
        targets: [
          {
            format: "r16float",
            blend: {
              color: { srcFactor: "one", dstFactor: "one" },
              alpha: { srcFactor: "one", dstFactor: "one" }
            }
          }
        ]
      },
      primitive: { topology: "triangle-list", cullMode: "none" },
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: !1,
        depthCompare: "less-equal"
      }
    });
  }
  createBindGroup(e, n, i) {
    this.maxFoamParticles = i, this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: e } },
        { binding: 1, resource: { buffer: n } },
        { binding: 2, resource: { buffer: this.uniformBuffer } }
      ]
    });
  }
  encode(e, n, i, t) {
    if (!this.bindGroup || this.maxFoamParticles === 0)
      return;
    const a = new Float32Array(20);
    a.set(i.viewProjection), a[16] = i.canvasWidth, a[17] = i.canvasHeight, a[18] = i.foamParticleRadius, a[19] = 0, this.device.queue.writeBuffer(this.uniformBuffer, 0, a);
    const s = e.beginRenderPass({
      colorAttachments: [
        {
          view: t.createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: n.depthTexture ? {
        view: n.depthTexture.createView(),
        depthLoadOp: "load",
        depthStoreOp: "store"
      } : void 0
    });
    s.setPipeline(this.pipeline), s.setBindGroup(0, this.bindGroup), s.draw(6, this.maxFoamParticles), s.end();
  }
}
const Te = `/**
 * Thickness Pass Shader
 *
 * Beginner note: accumulates particle thickness into a screen-space texture.
 */

struct Uniforms {
  viewProjection: mat4x4<f32>,
  canvasSize: vec2<f32>,
  particleRadius: f32,
  _pad: f32,
};

@group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32
) -> VertexOutput {
  let pos = positions[instanceIndex].xyz;

  var quadPos = vec2<f32>(0.0, 0.0);
  switch (vertexIndex) {
    case 0u: { quadPos = vec2<f32>(-1.0, -1.0); }
    case 1u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 2u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 3u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 4u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 5u: { quadPos = vec2<f32>( 1.0,  1.0); }
    default: { quadPos = vec2<f32>(0.0, 0.0); }
  }

  let clipPos = uniforms.viewProjection * vec4<f32>(pos, 1.0);
  let radiusNdc = vec2<f32>(
    uniforms.particleRadius / uniforms.canvasSize.x * 2.0,
    uniforms.particleRadius / uniforms.canvasSize.y * 2.0
  );
  let offset = quadPos * radiusNdc * clipPos.w;

  var out: VertexOutput;
  out.position = clipPos + vec4<f32>(offset, 0.0, 0.0);
  out.uv = quadPos;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) f32 {
  let d = length(in.uv);
  if (d > 1.0) {
    discard;
  }
  // Simple circular thickness contribution.
  let thickness = 1.0 - d;
  return thickness;
}
`;
class Re {
  device;
  pipeline;
  uniformBuffer;
  bindGroupLayout;
  bindGroup = null;
  constructor(e) {
    this.device = e, this.uniformBuffer = e.createBuffer({
      size: 80,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" }
        }
      ]
    });
    const n = e.createShaderModule({ code: Te });
    this.pipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout]
      }),
      vertex: {
        module: n,
        entryPoint: "vs_main"
      },
      fragment: {
        module: n,
        entryPoint: "fs_main",
        targets: [
          {
            format: "r16float",
            blend: {
              color: { srcFactor: "one", dstFactor: "one" },
              alpha: { srcFactor: "one", dstFactor: "one" }
            }
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none"
      },
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: !1,
        depthCompare: "less-equal"
      }
    });
  }
  resize(e, n) {
  }
  createBindGroup(e) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: e.buffers.positions } },
        { binding: 1, resource: { buffer: this.uniformBuffer } }
      ]
    });
  }
  encode(e, n, i) {
    if (!n.thicknessTexture || !n.depthTexture || !this.bindGroup)
      return;
    const t = new Float32Array(20);
    t.set(i.viewProjection), t[16] = i.canvasWidth, t[17] = i.canvasHeight, t[18] = i.particleRadius, t[19] = 0, this.device.queue.writeBuffer(this.uniformBuffer, 0, t);
    const a = e.beginRenderPass({
      colorAttachments: [
        {
          view: n.thicknessTexture.createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: n.depthTexture.createView(),
        depthLoadOp: "load",
        depthStoreOp: "store"
      }
    });
    a.setPipeline(this.pipeline), a.setBindGroup(0, this.bindGroup), a.draw(6, n.buffers.particleCount), a.end();
  }
}
const ke = `/**
 * Normal Pass Shader
 *
 * Beginner note: reconstructs surface normals from depth/thickness textures.
 */

struct FullscreenOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> FullscreenOut {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
  );

  var out: FullscreenOut;
  let p = pos[vertexIndex];
  out.position = vec4<f32>(p, 0.0, 1.0);
  out.uv = vec2<f32>(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  return out;
}

@group(0) @binding(0) var depthTex: texture_2d<f32>;
@group(0) @binding(1) var depthSampler: sampler;

@fragment
fn fs_main(in: FullscreenOut) -> @location(0) vec4<f32> {
  let dims = textureDimensions(depthTex);
  let texel = 1.0 / vec2<f32>(dims);

  let dC = textureSample(depthTex, depthSampler, in.uv).r;
  let dR = textureSample(depthTex, depthSampler, in.uv + vec2<f32>(texel.x, 0.0)).r;
  let dU = textureSample(depthTex, depthSampler, in.uv + vec2<f32>(0.0, texel.y)).r;

  let strength = 200.0;
  let dzdx = (dR - dC) * strength;
  let dzdy = (dU - dC) * strength;

  let n = normalize(vec3<f32>(-dzdx, -dzdy, 1.0));
  return vec4<f32>(n * 0.5 + 0.5, 1.0);
}
`;
class Ue {
  device;
  pipeline;
  bindGroupLayout;
  bindGroup = null;
  sampler;
  constructor(e) {
    this.device = e, this.sampler = e.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    }), this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} }
      ]
    });
    const n = e.createShaderModule({ code: ke });
    this.pipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout]
      }),
      vertex: { module: n, entryPoint: "vs_main" },
      fragment: {
        module: n,
        entryPoint: "fs_main",
        targets: [{ format: "rgba16float" }]
      },
      primitive: { topology: "triangle-list" }
    });
  }
  resize(e, n) {
    this.bindGroup = null;
  }
  createBindGroup(e) {
    if (!e.smoothTextureA) {
      this.bindGroup = null;
      return;
    }
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: e.smoothTextureA.createView() },
        { binding: 1, resource: this.sampler }
      ]
    });
  }
  encode(e, n, i) {
    if (!n.normalTexture || (this.bindGroup || this.createBindGroup(n), !this.bindGroup))
      return;
    const t = e.beginRenderPass({
      colorAttachments: [
        {
          view: n.normalTexture.createView(),
          clearValue: { r: 0.5, g: 0.5, b: 1, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });
    t.setPipeline(this.pipeline), t.setBindGroup(0, this.bindGroup), t.draw(6, 1), t.end();
  }
}
const De = `/**
 * Smooth Pass Shader (screen-space blur)
 *
 * Beginner note: applies a depth-aware blur to reduce particle noise.
 */

struct FullscreenOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> FullscreenOut {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
  );

  var out: FullscreenOut;
  let p = pos[vertexIndex];
  out.position = vec4<f32>(p, 0.0, 1.0);
  out.uv = vec2<f32>(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  return out;
}

@group(0) @binding(0) var srcTex: texture_2d<f32>;
@group(0) @binding(1) var depthTex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn bilateralWeight(dc: f32, dn: f32) -> f32 {
  let sigma = 0.02;
  let diff = dn - dc;
  return exp(- (diff * diff) / (sigma * sigma));
}

@fragment
fn fs_main(in: FullscreenOut) -> @location(0) f32 {
  let dims = textureDimensions(srcTex);
  let texel = 1.0 / vec2<f32>(dims);

  let depthCenter = textureSample(depthTex, samp, in.uv).r;

  var sum = 0.0;
  var wsum = 0.0;

  for (var y = -1; y <= 1; y = y + 1) {
    for (var x = -1; x <= 1; x = x + 1) {
      let offset = vec2<f32>(f32(x), f32(y)) * texel;
      let uv = in.uv + offset;
      let t = textureSample(srcTex, samp, uv).r;
      let d = textureSample(depthTex, samp, uv).r;
      let w = bilateralWeight(depthCenter, d);
      sum = sum + t * w;
      wsum = wsum + w;
    }
  }

  return select(0.0, sum / wsum, wsum > 0.0);
}
`;
class Oe {
  device;
  pipeline;
  bindGroupLayout;
  bindGroup = null;
  lastSource = null;
  lastDepth = null;
  sampler;
  constructor(e) {
    this.device = e, this.sampler = e.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    }), this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {} }
      ]
    });
    const n = e.createShaderModule({ code: De });
    this.pipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout]
      }),
      vertex: { module: n, entryPoint: "vs_main" },
      fragment: {
        module: n,
        entryPoint: "fs_main",
        targets: [{ format: "r16float" }]
      },
      primitive: { topology: "triangle-list" }
    });
  }
  resize(e, n) {
  }
  createBindGroup(e, n) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: e.createView() },
        { binding: 1, resource: n.createView() },
        { binding: 2, resource: this.sampler }
      ]
    }), this.lastSource = e, this.lastDepth = n;
  }
  encode(e, n, i, t, a, s) {
    if ((!this.bindGroup || this.lastSource !== t || this.lastDepth !== s) && this.createBindGroup(t, s), !this.bindGroup)
      return;
    const o = e.beginRenderPass({
      colorAttachments: [
        {
          view: a.createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });
    o.setPipeline(this.pipeline), o.setBindGroup(0, this.bindGroup), o.draw(6, 1), o.end();
  }
}
const Ee = `/**
 * Composite Shader (final screen-space shading)
 *
 * Beginner note: combines depth/thickness/normals/foam into final color.
 */

struct FullscreenOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

#include "../../../common/shaders/environment.wgsl"
#include "../../../common/shaders/shadow_common.wgsl"

struct RenderUniforms {
  inverseViewProjection: mat4x4<f32>,
  waterColor: vec3<f32>,
  pad0: f32,
  deepWaterColor: vec3<f32>,
  pad1: f32,
  foamColor: vec3<f32>,
  foamOpacity: f32,
  extinctionCoeff: vec3<f32>,
  extinctionMultiplier: f32,
  refractionStrength: f32,
  showFluidShadows: f32,
  pad2: f32,
  shadowParams: ShadowUniforms,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> FullscreenOut {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
  );

  var out: FullscreenOut;
  let p = pos[vertexIndex];
  out.position = vec4<f32>(p, 0.0, 1.0);
  out.uv = vec2<f32>(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  return out;
}

@group(0) @binding(0) var thicknessTex: texture_2d<f32>;
@group(0) @binding(1) var normalTex: texture_2d<f32>;
@group(0) @binding(2) var depthTex: texture_2d<f32>;
@group(0) @binding(3) var foamTex: texture_2d<f32>;
@group(0) @binding(4) var samp: sampler;
@group(0) @binding(5) var<uniform> renderUniforms: RenderUniforms;
@group(0) @binding(6) var<uniform> envUniforms: EnvironmentUniforms;
@group(0) @binding(7) var shadowTex: texture_2d<f32>;

@fragment
fn fs_main(in: FullscreenOut) -> @location(0) vec4<f32> {
  let thickness = textureSample(thicknessTex, samp, in.uv).r;
  let n = textureSample(normalTex, samp, in.uv).rgb * 2.0 - 1.0;
  let normal = normalize(n);

  let depth = textureSample(depthTex, samp, in.uv).r;
  let ndc = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
  var world = renderUniforms.inverseViewProjection * ndc;
  world = world / world.w;

  // Compute camera ray from near/far plane unprojection.
  let ndcNear = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 0.0, 1.0);
  var worldNear = renderUniforms.inverseViewProjection * ndcNear;
  worldNear = worldNear / worldNear.w;
  let ndcFar = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  var worldFar = renderUniforms.inverseViewProjection * ndcFar;
  worldFar = worldFar / worldFar.w;
  let rayDir = normalize(worldFar.xyz - worldNear.xyz);

  // Background using shared environment
  // We don't have camera pos explicitly, but worldNear is roughly it (on near plane)
  // For infinite sky/floor, origin matters. worldNear is correct.
  var bg = getEnvironmentColor(worldNear.xyz, rayDir, envUniforms);

  // Floor hit from environment to support debug visualization.
  let floorMin = envUniforms.floorCenter - 0.5 * envUniforms.floorSize;
  let floorMax = envUniforms.floorCenter + 0.5 * envUniforms.floorSize;
  let boxHit = envRayBoxIntersection(worldNear.xyz, rayDir, floorMin, floorMax);
  let floorHit = boxHit.y >= max(boxHit.x, 0.0);

  // Apply fluid shadow to floor
  let floorT = max(boxHit.x, 0.0);
  let floorHitPos = worldNear.xyz + rayDir * floorT;
  let shadowClip = renderUniforms.shadowParams.lightViewProjection * vec4<f32>(floorHitPos, 1.0);
  let shadowNdc = shadowClip.xy / shadowClip.w;
  let shadowUV = vec2<f32>(shadowNdc.x * 0.5 + 0.5, 1.0 - (shadowNdc.y * 0.5 + 0.5));
  let shadowVal = textureSample(shadowTex, samp, shadowUV).r;

  let lightDir = normalize(envUniforms.dirToSun);

  if (floorHit) {
    var shadowFactor = 1.0;

    // Fluid shadow from shadow texture
    let inBounds = shadowUV.x >= 0.0 && shadowUV.x <= 1.0 && shadowUV.y >= 0.0 && shadowUV.y <= 1.0;
    if (renderUniforms.showFluidShadows > 0.5 && inBounds && shadowVal > 0.0) {
      // Apply subtle shadow like raymarch demo
      // Very light shadows with high ambient floor
      let shadowAtten = exp(-shadowVal * 0.3);
      let ambientMin = 0.7; // High ambient = very subtle shadows
      shadowFactor = shadowAtten * (1.0 - ambientMin) + ambientMin;
    }

    // Obstacle shadow - cast ray from floor toward sun
    let obstacleShadowHit = getObstacleHit(floorHitPos, lightDir, envUniforms);
    if (obstacleShadowHit.x >= 0.0) {
      // Obstacle blocks light - apply shadow
      let obstacleAmbient = 0.5; // Obstacle shadow is a bit darker than fluid shadow
      shadowFactor = min(shadowFactor, obstacleAmbient);
    }

    bg = bg * shadowFactor;
  }

  let finalBg = bg;

  let base = renderUniforms.deepWaterColor;
  let shallow = renderUniforms.waterColor;

  let ndotl = max(dot(normal, lightDir), 0.0) * envUniforms.sunBrightness;

  let viewDir = normalize(worldNear.xyz - world.xyz); // From surface to camera
  let halfDir = normalize(lightDir + viewDir);
  let spec = pow(max(dot(normal, halfDir), 0.0), 64.0) * envUniforms.sunBrightness;
  let fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);

  let alpha = clamp(thickness * 4.0, 0.0, 1.0);

  let offset = normal.xy * renderUniforms.refractionStrength;
  let refractThickness = textureSample(thicknessTex, samp, in.uv + offset).r;

  // Beer-Lambert Law for absorption
  let absorption = exp(-refractThickness * renderUniforms.extinctionCoeff * renderUniforms.extinctionMultiplier);
  
  // Blend between shallow and deep color based on absorption
  let fluidColor = mix(base, shallow, absorption);
  
  let diffuse = fluidColor * (0.35 * envUniforms.floorAmbient + 0.65 * ndotl);
  let specular = vec3<f32>(0.9, 0.95, 1.0) * spec * (0.2 + 0.8 * fresnel);

  let refracted = mix(finalBg, fluidColor, 1.0 - absorption);

  // Obstacle shading
  let obsHit = getObstacleHit(worldNear.xyz, rayDir, envUniforms);
  let obsT = obsHit.x;
  
  let hasFluid = alpha > 0.001;
  let tFluid = select(1.0e9, dot(world.xyz - worldNear.xyz, rayDir), hasFluid);

  var color = mix(finalBg, diffuse + specular, alpha);
  color = mix(color, refracted, 0.4 * fresnel);
  let foam = textureSample(foamTex, samp, in.uv).r;
  color = mix(color, renderUniforms.foamColor, clamp(foam * renderUniforms.foamOpacity, 0.0, 1.0));

  if (obsT >= 0.0 && obsT < tFluid) {
    // Render obstacle on top
    let a = clamp(envUniforms.obstacleAlpha, 0.0, 1.0);
    // Obstacle lighting
    let ambient = envUniforms.floorAmbient;
    let sun = max(0.0, dot(obsHit.yzw, envUniforms.dirToSun)) * envUniforms.sunBrightness;

    let litShadowed = envUniforms.obstacleColor * (ambient + sun);

    color = mix(color, litShadowed, a);
  }

  let exposure = envUniforms.sceneExposure;
  return vec4<f32>(color * exposure, 1.0);
}
`, Ie = `/**
 * Simple wireframe shader for rendering bounding box edges.
 */

// Beginner note: vertices are provided by a CPU-built line list.

struct Uniforms {
  viewProjection: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) color: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>,
}

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = uniforms.viewProjection * vec4<f32>(input.position, 1.0);
  output.color = input.color;
  return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  return input.color;
}
`, Ae = `// =============================================================================
// Shared Environment Shader (Sky + Floor)
// =============================================================================

// Beginner note: utility functions here are reused by multiple renderers to
// shade the sky and ground consistently.

struct EnvironmentUniforms {
  dirToSun: vec3<f32>,
  floorAmbient: f32,
  
  skyColorHorizon: vec3<f32>,
  sunPower: f32,
  skyColorZenith: vec3<f32>,
  sceneExposure: f32,
  skyColorGround: vec3<f32>,
  pad2: f32,

  floorSize: vec3<f32>,
  tileScale: f32,
  floorCenter: vec3<f32>,
  tileDarkFactor: f32,

  tileCol1: vec3<f32>,
  sunBrightness: f32,
  tileCol2: vec3<f32>,
  globalBrightness: f32,
  tileCol3: vec3<f32>,
  globalSaturation: f32,
  tileCol4: vec3<f32>,
  pad3: f32,
  tileColVariation: vec3<f32>,
  pad4: f32,

  // Obstacle
  obstacleCenter: vec3<f32>,
  pad5: f32,
  obstacleHalfSize: vec3<f32>,
  pad6: f32,
  obstacleRotation: vec3<f32>,
  obstacleAlpha: f32,
  obstacleColor: vec3<f32>,
  obstacleShape: f32,
};

// =============================================================================
// Helpers
// =============================================================================

fn envRayBoxIntersection(origin: vec3<f32>, dir: vec3<f32>, boundsMin: vec3<f32>, boundsMax: vec3<f32>) -> vec2<f32> {
  let invDir = 1.0 / dir;
  let t0 = (boundsMin - origin) * invDir;
  let t1 = (boundsMax - origin) * invDir;
  let tmin = max(max(min(t0.x, t1.x), min(t0.y, t1.y)), min(t0.z, t1.z));
  let tmax = min(min(max(t0.x, t1.x), max(t0.y, t1.y)), max(t0.z, t1.z));
  return vec2<f32>(tmin, tmax);
}

fn envRaySphereIntersection(origin: vec3<f32>, dir: vec3<f32>, center: vec3<f32>, radius: f32) -> vec2<f32> {
  let oc = origin - center;
  let b = dot(oc, dir);
  let c = dot(oc, oc) - radius * radius;
  let h = b * b - c;
  if (h < 0.0) {
    return vec2<f32>(1e9, -1e9);
  }
  let s = sqrt(h);
  return vec2<f32>(-b - s, -b + s);
}

fn envRotateX(v: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}

fn envRotateY(v: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
}

fn envRotateZ(v: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(v.x * c - v.y * s, v.x * s + v.y * c, v.z);
}

fn envRotateWorldToLocal(v: vec3<f32>, rotDeg: vec3<f32>) -> vec3<f32> {
  let rot = rotDeg * (3.14159265 / 180.0);
  var r = v;
  r = envRotateZ(r, -rot.z);
  r = envRotateY(r, -rot.y);
  r = envRotateX(r, -rot.x);
  return r;
}

fn envRotateLocalToWorld(v: vec3<f32>, rotDeg: vec3<f32>) -> vec3<f32> {
  let rot = rotDeg * (3.14159265 / 180.0);
  var r = v;
  r = envRotateX(r, rot.x);
  r = envRotateY(r, rot.y);
  r = envRotateZ(r, rot.z);
  return r;
}

// =============================================================================
// Color Utils
// =============================================================================

fn envRgbToHsv(rgb: vec3<f32>) -> vec3<f32> {
  let K = vec4<f32>(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  let p = select(vec4<f32>(rgb.gb, K.xy), vec4<f32>(rgb.bg, K.wz), rgb.g < rgb.b);
  let q = select(vec4<f32>(rgb.r, p.yzx), vec4<f32>(p.xyw, rgb.r), rgb.r < p.x);
  let d = q.x - min(q.w, q.y);
  let e = 1.0e-10;
  return vec3<f32>(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

fn envHsvToRgb(hsv: vec3<f32>) -> vec3<f32> {
  let K = vec4<f32>(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  let p = abs(fract(hsv.xxx + K.xyz) * 6.0 - K.www);
  return hsv.z * mix(K.xxx, clamp(p - K.xxx, vec3<f32>(0.0), vec3<f32>(1.0)), hsv.y);
}

fn envTweakHsv(colRGB: vec3<f32>, shift: vec3<f32>) -> vec3<f32> {
  let hsv = envRgbToHsv(colRGB);
  return clamp(envHsvToRgb(hsv + shift), vec3<f32>(0.0), vec3<f32>(1.0));
}

fn envHashInt2(v: vec2<i32>) -> u32 {
  return u32(v.x) * 5023u + u32(v.y) * 96456u;
}

fn envRandomValue(state: ptr<function, u32>) -> f32 {
  *state = *state * 747796405u + 2891336453u;
  let word = ((*state >> ((*state >> 28u) + 4u)) ^ *state) * 277803737u;
  let res = (word >> 22u) ^ word;
  return f32(res) / 4294967295.0;
}

fn envRandomSNorm3(state: ptr<function, u32>) -> vec3<f32> {
  return vec3<f32>(
    envRandomValue(state) * 2.0 - 1.0,
    envRandomValue(state) * 2.0 - 1.0,
    envRandomValue(state) * 2.0 - 1.0
  );
}

fn envSrgbToLinear(col: vec3<f32>) -> vec3<f32> {
  let lo = col / 12.92;
  let hi = pow((col + vec3<f32>(0.055)) / 1.055, vec3<f32>(2.4));
  return select(hi, lo, col <= vec3<f32>(0.04045));
}

fn envModulo(x: f32, y: f32) -> f32 {
  return x - y * floor(x / y);
}

fn envLinearToSrgb(color: vec3<f32>) -> vec3<f32> {
  return pow(color, vec3<f32>(1.0 / 2.2));
}

fn getTileColor(hitPos: vec3<f32>, params: EnvironmentUniforms) -> vec3<f32> {
  // Rotate tile coordinates by 270 degrees (matching Unity/basic scene)
  let rotatedPos = vec2<f32>(-hitPos.z, hitPos.x);

  // Select base color based on quadrant
  var tileCol: vec3<f32>;
  if (rotatedPos.x < 0.0) {
    tileCol = params.tileCol1;
  } else {
    tileCol = params.tileCol2;
  }
  if (rotatedPos.y < 0.0) {
    if (rotatedPos.x < 0.0) {
      tileCol = params.tileCol3;
    } else {
      tileCol = params.tileCol4;
    }
  }

  // Apply gamma correction (linear to sRGB)
  tileCol = envLinearToSrgb(tileCol);

  // Calculate tile coordinates
  let tileCoord = floor(rotatedPos * params.tileScale);

  // Apply HSV variation per tile (multiply by 0.1 like Unity)
  if (any(params.tileColVariation != vec3<f32>(0.0))) {
    var rngState = envHashInt2(vec2<i32>(i32(tileCoord.x), i32(tileCoord.y)));
    let randomVariation = envRandomSNorm3(&rngState) * params.tileColVariation * 0.1;
    tileCol = envTweakHsv(tileCol, randomVariation);
  }

  // Checkerboard pattern
  let isDarkTile = envModulo(tileCoord.x, 2.0) == envModulo(tileCoord.y, 2.0);
  if (isDarkTile) {
    tileCol = envTweakHsv(tileCol, vec3<f32>(0.0, 0.0, params.tileDarkFactor));
  }
  
  return tileCol;
}

// =============================================================================
// Sampling
// =============================================================================

fn getSkyColor(dir: vec3<f32>, params: EnvironmentUniforms) -> vec3<f32> {
  // Sun disc
  let sun = pow(max(0.0, dot(dir, params.dirToSun)), params.sunPower);
  
  // Sky gradient
  let skyGradientT = pow(smoothstep(0.0, 0.4, dir.y), 0.35);
  let groundToSkyT = smoothstep(-0.01, 0.0, dir.y);
  let skyGradient = mix(params.skyColorHorizon, params.skyColorZenith, skyGradientT);

  var res = mix(params.skyColorGround, skyGradient, groundToSkyT);
  if (dir.y >= -0.01) {
    res = res + sun * params.sunBrightness;
  }
  return res;
}

fn getObstacleHit(origin: vec3<f32>, dir: vec3<f32>, params: EnvironmentUniforms) -> vec4<f32> {
  // Returns (t, normalX, normalY, normalZ)
  // t < 0 if no hit
  
  if (any(params.obstacleHalfSize <= vec3<f32>(0.0))) { return vec4<f32>(-1.0, 0.0, 0.0, 0.0); }

  if (params.obstacleShape > 0.5) {
    let radius = params.obstacleHalfSize.x;
    if (radius <= 0.0) { return vec4<f32>(-1.0, 0.0, 0.0, 0.0); }
    let hit = envRaySphereIntersection(origin, dir, params.obstacleCenter, radius);
    if (hit.y < max(hit.x, 0.0)) { return vec4<f32>(-1.0, 0.0, 0.0, 0.0); }
    let tEntry = select(hit.x, 0.0, hit.x < 0.0);
    let hitPos = origin + dir * tEntry;
    let normal = normalize(hitPos - params.obstacleCenter);
    return vec4<f32>(tEntry, normal.x, normal.y, normal.z);
  }
  
  let localOrigin = envRotateWorldToLocal(origin - params.obstacleCenter, params.obstacleRotation);
  let localDir = envRotateWorldToLocal(dir, params.obstacleRotation);
  
  let hit = envRayBoxIntersection(localOrigin, localDir, -params.obstacleHalfSize, params.obstacleHalfSize);
  
  if (hit.y < max(hit.x, 0.0)) { return vec4<f32>(-1.0, 0.0, 0.0, 0.0); }
  
  let tEntry = select(hit.x, 0.0, hit.x < 0.0);
  let localHitPos = localOrigin + localDir * tEntry;
  
  // Face normal
  let dist = params.obstacleHalfSize - abs(localHitPos);
  var localNormal = vec3<f32>(0.0, 0.0, 1.0);
  if (dist.x < dist.y && dist.x < dist.z) {
    localNormal = vec3<f32>(sign(localHitPos.x), 0.0, 0.0);
  } else if (dist.y < dist.z) {
    localNormal = vec3<f32>(0.0, sign(localHitPos.y), 0.0);
  } else {
    localNormal = vec3<f32>(0.0, 0.0, sign(localHitPos.z));
  }
  
  let worldNormal = normalize(envRotateLocalToWorld(localNormal, params.obstacleRotation));
  
  return vec4<f32>(tEntry, worldNormal.x, worldNormal.y, worldNormal.z);
}

// Sample environment without shadows
fn getEnvironmentColor(origin: vec3<f32>, dir: vec3<f32>, params: EnvironmentUniforms) -> vec3<f32> {
  // 1. Check Floor
  let floorMin = params.floorCenter - 0.5 * params.floorSize;
  let floorMax = params.floorCenter + 0.5 * params.floorSize;
  let floorHit = envRayBoxIntersection(origin, dir, floorMin, floorMax);
  let hasFloorHit = floorHit.y >= max(floorHit.x, 0.0);
  let floorT = select(floorHit.x, 0.0, floorHit.x < 0.0);

  var bgCol: vec3<f32>;
  var hitPos: vec3<f32>;

  if (hasFloorHit) {
    hitPos = origin + dir * floorT;

    let tileCol = getTileColor(hitPos, params);
    
    let ambient = clamp(params.floorAmbient, 0.0, 1.0);
    let sun = max(0.0, params.dirToSun.y) * params.sunBrightness;
    
    var finalColor = tileCol * (ambient + sun) * params.globalBrightness;

    let gray = dot(finalColor, vec3<f32>(0.299, 0.587, 0.114));
    finalColor = vec3<f32>(gray) + (finalColor - vec3<f32>(gray)) * params.globalSaturation;

    bgCol = finalColor;
  } else {
    bgCol = getSkyColor(dir, params);
  }

  // 2. Check Obstacle (blend over background)
  let obs = getObstacleHit(origin, dir, params);
  let obsT = obs.x;
  let obsNormal = obs.yzw;
  
  if (obsT >= 0.0 && (!hasFloorHit || obsT < floorT)) {
    let a = clamp(params.obstacleAlpha, 0.0, 1.0);
    let ambient = params.floorAmbient;
    let sun = max(0.0, dot(obsNormal, params.dirToSun)) * params.sunBrightness;
    let lit = params.obstacleColor * (ambient + sun);
    return mix(bgCol, lit, a);
  }

  return bgCol;
}
`, Me = `struct ShadowUniforms {
  lightViewProjection: mat4x4<f32>,
  shadowSoftness: f32,
  particleShadowRadius: f32,
  pad0: f32,
  pad1: f32,
};

// Beginner note: this shared struct is included by multiple shaders so the
// shadow map uniforms stay consistent across passes.
`;
function Fe(r, e) {
  let n = r;
  for (const [i, t] of Object.entries(e)) {
    const a = `#include "${i}"`;
    n = n.split(a).join(t);
  }
  return n;
}
class Le {
  device;
  compositePipeline;
  wireframePipeline;
  compositeBindGroupLayout;
  compositeBindGroup = null;
  wireframeBindGroup;
  sampler;
  uniformBuffer;
  envUniformBuffer;
  wireframeUniformBuffer;
  wireframeVertexBuffer;
  wireframeVertexData;
  constructor(e, n) {
    this.device = e, this.sampler = e.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    }), this.uniformBuffer = e.createBuffer({
      size: 224,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.envUniformBuffer = e.createBuffer({
      size: 240,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.compositeBindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
        {
          binding: 5,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        },
        {
          binding: 6,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        },
        {
          binding: 7,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        }
      ]
    });
    const i = Fe(Ee, {
      "../../../common/shaders/environment.wgsl": Ae,
      "../../../common/shaders/shadow_common.wgsl": Me
    }), t = e.createShaderModule({
      code: i
    });
    this.compositePipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.compositeBindGroupLayout]
      }),
      vertex: { module: t, entryPoint: "vs_main" },
      fragment: {
        module: t,
        entryPoint: "fs_main",
        targets: [{ format: n }]
      },
      primitive: { topology: "triangle-list" }
    });
    const a = e.createShaderModule({
      code: Ie
    });
    this.wireframePipeline = e.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: a,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 28,
            // 3 floats pos + 4 floats color = 7 floats = 28 bytes
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" },
              { shaderLocation: 1, offset: 12, format: "float32x4" }
            ]
          }
        ]
      },
      fragment: {
        module: a,
        entryPoint: "fs_main",
        targets: [{ format: n }]
      },
      primitive: { topology: "line-list" },
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: !0,
        depthCompare: "less"
      }
    }), this.wireframeUniformBuffer = e.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.wireframeVertexData = new Float32Array(168), this.wireframeVertexBuffer = e.createBuffer({
      size: this.wireframeVertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    }), this.wireframeBindGroup = e.createBindGroup({
      layout: this.wireframePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.wireframeUniformBuffer } }
      ]
    });
  }
  resize(e, n) {
    this.compositeBindGroup = null;
  }
  /**
   * Builds wireframe geometry for the simulation bounds.
   * Creates 12 edges (lines) representing the bounding box.
   */
  buildBoundsWireframe(e) {
    const n = e.boundsSize.x * 0.5, i = e.boundsSize.y * 0.5, t = e.boundsSize.z * 0.5, a = i - 5, s = e.boundsWireframeColor ?? { r: 1, g: 1, b: 1 }, o = [
      [-n, a - i, -t],
      // 0: back-bottom-left
      [+n, a - i, -t],
      // 1: back-bottom-right
      [+n, a + i, -t],
      // 2: back-top-right
      [-n, a + i, -t],
      // 3: back-top-left
      [-n, a - i, +t],
      // 4: front-bottom-left
      [+n, a - i, +t],
      // 5: front-bottom-right
      [+n, a + i, +t],
      // 6: front-top-right
      [-n, a + i, +t]
      // 7: front-top-left
    ], c = [
      // Bottom face edges
      [0, 1],
      [1, 5],
      [5, 4],
      [4, 0],
      // Top face edges
      [3, 2],
      [2, 6],
      [6, 7],
      [7, 3],
      // Vertical edges
      [0, 3],
      [1, 2],
      [5, 6],
      [4, 7]
    ];
    let l = 0;
    const f = (p) => {
      const u = o[p];
      this.wireframeVertexData[l++] = u[0], this.wireframeVertexData[l++] = u[1], this.wireframeVertexData[l++] = u[2], this.wireframeVertexData[l++] = s.r, this.wireframeVertexData[l++] = s.g, this.wireframeVertexData[l++] = s.b, this.wireframeVertexData[l++] = 1;
    };
    for (const [p, u] of c)
      f(p), f(u);
    return c.length * 2;
  }
  createCompositeBindGroup(e) {
    if (!e.smoothTextureB || !e.normalTexture || !e.smoothTextureA || !e.foamTexture || !e.shadowSmoothTexture) {
      this.compositeBindGroup = null;
      return;
    }
    this.compositeBindGroup = this.device.createBindGroup({
      layout: this.compositeBindGroupLayout,
      entries: [
        { binding: 0, resource: e.smoothTextureB.createView() },
        { binding: 1, resource: e.normalTexture.createView() },
        { binding: 2, resource: e.smoothTextureA.createView() },
        { binding: 3, resource: e.foamTexture.createView() },
        { binding: 4, resource: this.sampler },
        { binding: 5, resource: { buffer: this.uniformBuffer } },
        { binding: 6, resource: { buffer: this.envUniformBuffer } },
        { binding: 7, resource: e.shadowTexture.createView() }
      ]
    });
  }
  encode(e, n, i, t) {
    if (this.compositeBindGroup || this.createCompositeBindGroup(n), !this.compositeBindGroup)
      return;
    const a = new Float32Array(56);
    a.set(i.inverseViewProjection, 0), a[16] = i.waterColor.r, a[17] = i.waterColor.g, a[18] = i.waterColor.b, a[19] = 0, a[20] = i.deepWaterColor.r, a[21] = i.deepWaterColor.g, a[22] = i.deepWaterColor.b, a[23] = 0, a[24] = i.foamColor.r, a[25] = i.foamColor.g, a[26] = i.foamColor.b, a[27] = i.foamOpacity, a[28] = i.extinctionCoeff.x, a[29] = i.extinctionCoeff.y, a[30] = i.extinctionCoeff.z, a[31] = i.extinctionMultiplier, a[32] = i.refractionStrength, a[33] = i.showFluidShadows ? 1 : 0, a[34] = 0, a[35] = 0, i.shadowViewProjection && (a.set(i.shadowViewProjection, 36), a[52] = i.shadowSoftness, a[53] = 0, a[54] = 0, a[55] = 0), this.device.queue.writeBuffer(this.uniformBuffer, 0, a);
    const s = new Float32Array(60);
    Q(s, 0, i, {
      ...i,
      obstacleCentre: i.obstacleCentre,
      obstacleSize: {
        x: i.obstacleHalfSize.x * 2,
        y: i.obstacleHalfSize.y * 2,
        z: i.obstacleHalfSize.z * 2
      }
    }), this.device.queue.writeBuffer(this.envUniformBuffer, 0, s);
    const o = e.beginRenderPass({
      colorAttachments: [
        {
          view: t,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });
    if (o.setPipeline(this.compositePipeline), o.setBindGroup(0, this.compositeBindGroup), o.draw(6, 1), o.end(), i.showBoundsWireframe && n.depthTexture) {
      const c = this.buildBoundsWireframe(i);
      this.device.queue.writeBuffer(
        this.wireframeVertexBuffer,
        0,
        this.wireframeVertexData.buffer,
        this.wireframeVertexData.byteOffset,
        c * 7 * 4
      ), this.device.queue.writeBuffer(
        this.wireframeUniformBuffer,
        0,
        i.viewProjection.buffer,
        i.viewProjection.byteOffset,
        i.viewProjection.byteLength
      );
      const l = e.beginRenderPass({
        colorAttachments: [
          {
            view: t,
            loadOp: "load",
            // Keep the composite result
            storeOp: "store"
          }
        ],
        depthStencilAttachment: {
          view: n.depthTexture.createView(),
          depthLoadOp: "load",
          // Keep existing depth
          depthStoreOp: "store"
        }
      });
      l.setPipeline(this.wireframePipeline), l.setBindGroup(0, this.wireframeBindGroup), l.setVertexBuffer(0, this.wireframeVertexBuffer, 0), l.draw(c), l.end();
    }
  }
}
const _e = `// Debug shader - renders all particles as white dots to verify shadow pass works
// Beginner note: this bypasses shading and draws raw particle depth.

struct Uniforms {
  viewProjection: mat4x4<f32>,
  canvasSize: vec2<f32>,
  particleRadius: f32,
  _pad: f32,
};

@group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32
) -> VertexOutput {
  let pos = positions[instanceIndex].xyz;

  var quadPos = vec2<f32>(0.0, 0.0);
  switch (vertexIndex) {
    case 0u: { quadPos = vec2<f32>(-1.0, -1.0); }
    case 1u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 2u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 3u: { quadPos = vec2<f32>(-1.0,  1.0); }
    case 4u: { quadPos = vec2<f32>( 1.0, -1.0); }
    case 5u: { quadPos = vec2<f32>( 1.0,  1.0); }
    default: { quadPos = vec2<f32>(0.0, 0.0); }
  }

  let clipPos = uniforms.viewProjection * vec4<f32>(pos, 1.0);
  let ndc = clipPos.xyz / clipPos.w;

  let radiusNdc = vec2<f32>(0.02, 0.02);
  let offset = quadPos * radiusNdc;

  var out: VertexOutput;
  // Clamp Z to valid [0,1] range for WebGPU
  let z = clamp(ndc.z, 0.0, 1.0);
  out.position = vec4<f32>(ndc.xy + offset, z, 1.0);
  out.uv = quadPos;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) f32 {
  let d = length(in.uv);
  if (d > 1.0) {
    discard;
  }
  // Return a constant value for debugging
  return 1.0;
}
`;
class Ne {
  device;
  pipeline;
  uniformBuffer;
  bindGroupLayout;
  bindGroup = null;
  constructor(e) {
    this.device = e, this.uniformBuffer = e.createBuffer({
      size: 80,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "uniform" }
        }
      ]
    });
    const n = e.createShaderModule({ code: _e });
    this.pipeline = e.createRenderPipeline({
      layout: e.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout]
      }),
      vertex: {
        module: n,
        entryPoint: "vs_main"
      },
      fragment: {
        module: n,
        entryPoint: "fs_main",
        targets: [
          {
            format: "r16float",
            blend: {
              color: { srcFactor: "one", dstFactor: "one" },
              alpha: { srcFactor: "one", dstFactor: "one" }
            }
          }
        ]
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none"
      }
      // No depth test — accumulate all particles from the light's view
    });
  }
  createBindGroup(e) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: e.positions } },
        { binding: 1, resource: { buffer: this.uniformBuffer } }
      ]
    });
  }
  /**
   * Builds an orthographic view-projection matrix from the sun direction
   * that frames the simulation bounds.
   */
  buildShadowVP(e) {
    const n = V(e.dirToSun), i = { x: 0, y: -2.5, z: 0 }, t = 30, a = {
      x: i.x + n.x * t,
      y: i.y + n.y * t,
      z: i.z + n.z * t
    }, s = Math.abs(n.y) > 0.99 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }, o = X(a, i, s), c = e.boundsSize.x * 0.5 + 2, l = e.boundsSize.y * 0.5 + 2, f = e.boundsSize.z * 0.5 + 2, p = Math.max(c, l, f), u = Pe(
      -p,
      p,
      -p,
      p,
      t - p - 10,
      t + p + 10
    );
    return Z(u, o);
  }
  encode(e, n, i) {
    if (!n.shadowTexture || !this.bindGroup)
      return null;
    const t = this.buildShadowVP(i), a = n.shadowTexture.width, s = n.shadowTexture.height, o = Math.max(a, s) * 0.05, c = new Float32Array(20);
    c.set(t), c[16] = a, c[17] = s, c[18] = o, c[19] = 0, this.device.queue.writeBuffer(this.uniformBuffer, 0, c);
    const l = e.beginRenderPass({
      colorAttachments: [
        {
          view: n.shadowTexture.createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });
    return l.setPipeline(this.pipeline), l.setBindGroup(0, this.bindGroup), l.draw(6, n.buffers.particleCount), l.end(), t;
  }
}
class Ve {
  /**
   * Beginner note:
   * This renderer is a post-process pipeline. It renders particles into
   * intermediate textures (depth/thickness/foam), smooths them, then
   * composites a final shaded image.
   */
  device;
  canvas;
  config;
  width = 0;
  height = 0;
  depthTexture = null;
  thicknessTexture = null;
  normalTexture = null;
  smoothTextureA = null;
  smoothTextureB = null;
  foamTexture = null;
  shadowTexture = null;
  shadowSmoothTexture = null;
  buffers = null;
  depthPass;
  thicknessPass;
  normalPass;
  smoothPass;
  foamPass;
  compositePass;
  shadowPass;
  constructor(e, n, i, t) {
    this.device = e, this.canvas = n, this.config = t, this.depthPass = new Ce(e), this.thicknessPass = new Re(e), this.normalPass = new Ue(e), this.smoothPass = new Oe(e), this.foamPass = new Ge(e), this.compositePass = new Le(e, i), this.shadowPass = new Ne(e);
  }
  createBindGroups(e) {
    this.buffers = e;
    const n = {
      buffers: e,
      depthTexture: this.depthTexture,
      thicknessTexture: this.thicknessTexture,
      normalTexture: this.normalTexture,
      smoothTextureA: this.smoothTextureA,
      smoothTextureB: this.smoothTextureB,
      foamTexture: this.foamTexture,
      shadowTexture: this.shadowTexture,
      shadowSmoothTexture: this.shadowSmoothTexture
    };
    this.depthPass.createBindGroup(n), this.thicknessPass.createBindGroup(n), this.normalPass.createBindGroup(n), this.shadowPass.createBindGroup(e), e.foamPositions && e.foamVelocities && e.maxFoamParticles > 0 && this.foamPass.createBindGroup(
      e.foamPositions,
      e.foamVelocities,
      e.maxFoamParticles
    );
  }
  resize(e, n) {
    if (e === this.width && n === this.height)
      return;
    this.width = Math.max(1, Math.floor(e)), this.height = Math.max(1, Math.floor(n)), this.depthTexture = this.device.createTexture({
      size: { width: this.width, height: this.height },
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    const i = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;
    this.thicknessTexture = this.device.createTexture({
      size: { width: this.width, height: this.height },
      format: "r16float",
      usage: i
    }), this.normalTexture = this.device.createTexture({
      size: { width: this.width, height: this.height },
      format: "rgba16float",
      usage: i
    }), this.smoothTextureA = this.device.createTexture({
      size: { width: this.width, height: this.height },
      format: "r16float",
      usage: i
    }), this.smoothTextureB = this.device.createTexture({
      size: { width: this.width, height: this.height },
      format: "r16float",
      usage: i
    }), this.foamTexture = this.device.createTexture({
      size: { width: this.width, height: this.height },
      format: "r16float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    const t = Math.max(1, Math.floor(this.width / 4)), a = Math.max(1, Math.floor(this.height / 4));
    this.shadowTexture = this.device.createTexture({
      size: { width: t, height: a },
      format: "r16float",
      usage: i
    }), this.shadowSmoothTexture = this.device.createTexture({
      size: { width: t, height: a },
      format: "r16float",
      usage: i
    }), this.depthPass.resize(this.width, this.height), this.thicknessPass.resize(this.width, this.height), this.normalPass.resize(this.width, this.height), this.smoothPass.resize(this.width, this.height), this.compositePass.resize(this.width, this.height);
  }
  render(e, n, i, t) {
    if (!this.buffers)
      return;
    const a = t ?? this.config.boundsSize, s = this.canvas.width / this.canvas.height, o = 0.1, c = 100, l = xe(Math.PI / 3, s, o, c), f = Z(l, i), p = Se(f), u = window.devicePixelRatio || 1, g = this.config.showObstacle !== !1, P = this.config.obstacleShape ?? "box", h = P === "sphere", b = this.config.obstacleRadius ?? 0, m = {
      ...this.config,
      // Spread first to provide base EnvironmentConfig
      viewProjection: f,
      inverseViewProjection: p,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      particleRadius: this.config.particleRadius * u,
      // Override with DPR-scaled value
      foamParticleRadius: this.config.foamParticleRadius * u,
      near: o,
      far: c,
      // Calculate derived obstacleHalfSize
      obstacleHalfSize: {
        x: g ? h ? b : this.config.obstacleSize.x * 0.5 : 0,
        y: g ? h ? b : this.config.obstacleSize.y * 0.5 : 0,
        z: g ? h ? b : this.config.obstacleSize.z * 0.5 : 0
      },
      obstacleColor: this.config.obstacleColor ?? { r: 1, g: 0, b: 0 },
      obstacleAlpha: g ? this.config.obstacleAlpha ?? 0.8 : 0,
      obstacleShape: P,
      obstacleRadius: b,
      showBoundsWireframe: this.config.showBoundsWireframe,
      boundsWireframeColor: this.config.boundsWireframeColor,
      boundsSize: a,
      shadowViewProjection: null,
      shadowSoftness: this.config.shadowSoftness
    }, d = {
      buffers: this.buffers,
      depthTexture: this.depthTexture,
      thicknessTexture: this.thicknessTexture,
      normalTexture: this.normalTexture,
      smoothTextureA: this.smoothTextureA,
      smoothTextureB: this.smoothTextureB,
      foamTexture: this.foamTexture,
      shadowTexture: this.shadowTexture,
      shadowSmoothTexture: this.shadowSmoothTexture
    };
    if (this.depthPass.encode(e, d, m), this.thicknessPass.encode(e, d, m), d.foamTexture && this.foamPass.encode(e, d, m, d.foamTexture), this.config.showFluidShadows) {
      const w = this.shadowPass.encode(e, d, m);
      m.shadowViewProjection = w, d.shadowTexture && d.shadowSmoothTexture && this.smoothPass.encode(
        e,
        d,
        m,
        d.shadowTexture,
        d.shadowSmoothTexture,
        d.shadowTexture
        // bilateral depth ref = shadow itself
      );
    }
    d.thicknessTexture && d.smoothTextureA && d.smoothTextureB && (this.smoothPass.encode(
      e,
      d,
      m,
      d.thicknessTexture,
      d.smoothTextureB,
      d.smoothTextureA
    ), this.smoothPass.encode(
      e,
      d,
      m,
      d.smoothTextureB,
      d.thicknessTexture,
      d.smoothTextureA
    ), this.smoothPass.encode(
      e,
      d,
      m,
      d.thicknessTexture,
      d.smoothTextureB,
      d.smoothTextureA
    ), this.smoothPass.encode(
      e,
      d,
      m,
      d.smoothTextureB,
      d.thicknessTexture,
      d.smoothTextureA
    ), this.smoothPass.encode(
      e,
      d,
      m,
      d.thicknessTexture,
      d.smoothTextureB,
      d.smoothTextureA
    )), this.normalPass.encode(e, d, m), this.compositePass.encode(e, d, m, n);
  }
}
const Ye = `// =============================================================================
// Particle Picking Shader
// =============================================================================
// Finds the intersection of a ray with the fluid particles.

struct Ray {
  origin: vec3<f32>,
  pad0: f32,
  direction: vec3<f32>,
  pad1: f32,
};

struct PickingUniforms {
  ray: Ray,
  particleRadius: f32,
  particleCount: u32,
  pad0: f32,
  pad1: f32,
};

struct PickingResult {
  hitPos: vec3<f32>,
  hitDist: f32,
  particleIndex: i32, // -1 if no hit
  hit: u32,           // 1 if hit, 0 if no hit
  pad0: u32,
  pad1: u32,
};

@group(0) @binding(0) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(1) var<uniform> uniforms: PickingUniforms;
@group(0) @binding(2) var<storage, read_write> result: PickingResult;

/**
 * Finds the intersection of a ray and a sphere.
 * Returns the distance to the intersection point, or -1.0 if no hit.
 */
fn raySphereIntersection(rayOrigin: vec3<f32>, rayDir: vec3<f32>, sphereCenter: vec3<f32>, radius: f32) -> f32 {
  let oc = rayOrigin - sphereCenter;
  let b = dot(oc, rayDir);
  let c = dot(oc, oc) - radius * radius;
  let h = b * b - c;
  if (h < 0.0) { return -1.0; } // No intersection
  let h_sqrt = sqrt(h);
  let t = -b - h_sqrt;
  if (t < 0.0) { return -b + h_sqrt; } // If inside, use the exit point
  return t;
}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;
  if (index >= uniforms.particleCount) { return; }

  let pos = positions[index].xyz;
  let t = raySphereIntersection(uniforms.ray.origin, uniforms.ray.direction, pos, uniforms.particleRadius);

  if (t > 0.0) {
    // Note: This simple check has a race condition but is usually fine for picking.
    // For a single ray, we want the minimum t.
    if (t < result.hitDist) {
        result.hitDist = t;
        result.hitPos = uniforms.ray.origin + uniforms.ray.direction * t;
        result.particleIndex = i32(index);
        result.hit = 1u;
    }
  }
}

@compute @workgroup_size(1)
fn clear() {
  result.hitPos = vec3<f32>(0.0);
  result.hitDist = 1e10;
  result.particleIndex = -1;
  result.hit = 0u;
}`;
class qe {
  device;
  pipeline;
  clearPipeline;
  bindGroupLayout;
  uniformsBuffer;
  resultBuffer;
  readbackBuffer;
  bindGroup;
  constructor(e) {
    this.device = e;
    const n = e.createShaderModule({ code: Ye });
    this.bindGroupLayout = e.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" }
        }
      ]
    });
    const i = e.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout]
    });
    this.pipeline = e.createComputePipeline({
      layout: i,
      compute: { module: n, entryPoint: "main" }
    }), this.clearPipeline = e.createComputePipeline({
      layout: i,
      compute: { module: n, entryPoint: "clear" }
    }), this.uniformsBuffer = e.createBuffer({
      size: 48,
      // Ray(32) + radius(4) + count(4) + padding(8)
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    }), this.resultBuffer = e.createBuffer({
      size: 32,
      // hitPos(12) + hitDist(4) + index(4) + hit(4) + padding(8)
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    }), this.readbackBuffer = e.createBuffer({
      size: 32,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
  }
  createBindGroup(e) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: e } },
        { binding: 1, resource: { buffer: this.uniformsBuffer } },
        { binding: 2, resource: { buffer: this.resultBuffer } }
      ]
    });
  }
  dispatch(e, n, i, t, a) {
    const s = new Float32Array(12);
    s[0] = n.x, s[1] = n.y, s[2] = n.z, s[4] = i.x, s[5] = i.y, s[6] = i.z, s[8] = t, new Uint32Array(s.buffer)[9] = a, this.device.queue.writeBuffer(this.uniformsBuffer, 0, s);
    const o = e.beginComputePass();
    o.setPipeline(this.clearPipeline), o.setBindGroup(0, this.bindGroup), o.dispatchWorkgroups(1), o.end();
    const c = e.beginComputePass();
    c.setPipeline(this.pipeline), c.setBindGroup(0, this.bindGroup), c.dispatchWorkgroups(Math.ceil(a / 256)), c.end(), e.copyBufferToBuffer(
      this.resultBuffer,
      0,
      this.readbackBuffer,
      0,
      32
    );
  }
  async getResult() {
    await this.readbackBuffer.mapAsync(GPUMapMode.READ);
    const e = new Float32Array(this.readbackBuffer.getMappedRange()), n = new Uint32Array(e.buffer)[5] === 1;
    let i = null;
    return n && (i = {
      hitPos: { x: e[0], y: e[1], z: e[2] },
      hitDist: e[3],
      particleIndex: new Int32Array(e.buffer)[4],
      hit: !0
    }), this.readbackBuffer.unmap(), i;
  }
}
class We {
  /**
   * Beginner note:
   * This class records compute passes for SPH + foam, then hands particle
   * buffers to the screen-space renderer for post-processing.
   */
  device;
  context;
  canvas;
  config;
  // --- Subsystems (Modular) ---
  buffers;
  physics;
  grid;
  foam;
  renderer;
  pickingSystem;
  state;
  // --- Grid Configuration ---
  gridRes = { x: 0, y: 0, z: 0 };
  gridTotalCells = 0;
  // --- Interaction State ---
  isPicking = !1;
  interactionPos = { x: 0, y: 0, z: 0 };
  // --- Smooth Container Transition ---
  smoothBoundsSize = { x: 0, y: 0, z: 0 };
  // --- Uniform Buffers ---
  physicsUniforms;
  gridUniforms;
  foamUniforms;
  // --- CPU Staging Buffers ---
  computeData = new Float32Array(8);
  integrateData = new Float32Array(24);
  hashParamsData = new Float32Array(8);
  sortParamsData = new Uint32Array(8);
  scanParamsDataL0 = new Uint32Array(4);
  scanParamsDataL1 = new Uint32Array(4);
  scanParamsDataL2 = new Uint32Array(4);
  densityParamsData = new Float32Array(12);
  pressureParamsData = new Float32Array(16);
  viscosityParamsData = new Float32Array(12);
  foamSpawnData = new Float32Array(28);
  foamUpdateData = new Float32Array(28);
  foamFrameCount = 0;
  simTimer = 0;
  constructor(e, n, i, t, a, s = !1, o = !1) {
    this.device = e, this.context = n, this.canvas = i, this.config = t, this.physics = new he(e, o), this.grid = new se(e, s), this.foam = new be(e, s), this.renderer = new Ve(e, i, a, t), this.pickingSystem = new qe(e), this.physicsUniforms = {
      external: e.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      density: e.createBuffer({
        size: 48,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      pressure: e.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      viscosity: e.createBuffer({
        size: 48,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      integrate: e.createBuffer({
        size: 96,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
    }, this.gridUniforms = {
      hash: e.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      sort: e.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      scanL0: e.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      scanL1: e.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      scanL2: e.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
    }, this.foamUniforms = {
      spawn: e.createBuffer({
        size: 112,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }),
      update: e.createBuffer({
        size: 112,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      })
    }, this.reset();
  }
  get particleCount() {
    return this.buffers.particleCount;
  }
  get simulationState() {
    return this.state;
  }
  reset() {
    this.buffers && this.buffers.destroy(), this.simTimer = 0, this.foamFrameCount = 0;
    const { boundsSize: e, smoothingRadius: n } = this.config;
    this.smoothBoundsSize.x = e.x, this.smoothBoundsSize.y = e.y, this.smoothBoundsSize.z = e.z, this.gridRes = {
      x: Math.ceil(e.x / n),
      y: Math.ceil(e.y / n),
      z: Math.ceil(e.z / n)
    }, this.gridTotalCells = this.gridRes.x * this.gridRes.y * this.gridRes.z;
    const i = ne(this.config);
    this.state = this.createStateFromSpawn(i), this.buffers = new M(this.device, i, {
      gridTotalCells: this.gridTotalCells,
      includeFoam: !0,
      maxFoamParticles: M.DEFAULT_MAX_FOAM_PARTICLES
    }), this.physics.createBindGroups(this.buffers, this.physicsUniforms), this.grid.createBindGroups(this.buffers, this.gridUniforms), this.foam.createBindGroups(this.buffers, this.foamUniforms), this.renderer.createBindGroups(this.buffers), this.pickingSystem.createBindGroup(this.buffers.positions);
  }
  createStateFromSpawn(e) {
    return {
      positions: e.positions,
      predicted: new Float32Array(e.positions),
      velocities: e.velocities,
      densities: new Float32Array(e.count * 2),
      keys: new Uint32Array(e.count),
      sortedKeys: new Uint32Array(e.count),
      indices: new Uint32Array(e.count),
      sortOffsets: new Uint32Array(e.count),
      spatialOffsets: new Uint32Array(e.count),
      positionsSorted: new Float32Array(e.count * 4),
      predictedSorted: new Float32Array(e.count * 4),
      velocitiesSorted: new Float32Array(e.count * 4),
      count: e.count,
      input: { worldX: 0, worldY: 0, worldZ: 0, pull: !1, push: !1 }
    };
  }
  async step(e) {
    const { config: n, buffers: i, device: t } = this, a = 0.1;
    this.smoothBoundsSize.x += (n.boundsSize.x - this.smoothBoundsSize.x) * a, this.smoothBoundsSize.y += (n.boundsSize.y - this.smoothBoundsSize.y) * a, this.smoothBoundsSize.z += (n.boundsSize.z - this.smoothBoundsSize.z) * a;
    const s = n.maxTimestepFPS ? 1 / n.maxTimestepFPS : Number.POSITIVE_INFINITY, o = Math.min(e * n.timeScale, s);
    this.simTimer += o;
    const c = o / n.iterationsPerFrame;
    this.updateUniforms(c);
    const l = t.createCommandEncoder();
    let f = !1;
    !this.isPicking && this.state.input.rayOrigin && this.state.input.rayDir && (this.isPicking = !0, f = !0, this.pickingSystem.dispatch(
      l,
      this.state.input.rayOrigin,
      this.state.input.rayDir,
      n.smoothingRadius,
      i.particleCount
    ));
    const p = l.beginComputePass();
    for (let g = 0; g < n.iterationsPerFrame; g++)
      this.physics.step(
        p,
        this.grid,
        i.particleCount,
        this.gridTotalCells,
        n.viscosityStrength > 0
      );
    p.end(), this.dispatchFoam(o, l), t.queue.submit([l.finish()]), f && this.pickingSystem.getResult().then((g) => {
      if (g && g.hit) {
        let P = g.hitPos.x, h = g.hitPos.y, b = g.hitPos.z;
        this.state.input.pull && this.state.input.rayDir && (P += this.state.input.rayDir.x * 0.5, h += this.state.input.rayDir.y * 0.5, b += this.state.input.rayDir.z * 0.5), this.state.input.worldX = P, this.state.input.worldY = h, this.state.input.worldZ = b, this.state.input.isHoveringFluid = !0;
      } else
        this.state.input.isHoveringFluid = !1;
      this.isPicking = !1;
    });
    const u = 0.15;
    this.interactionPos.x += (this.state.input.worldX - this.interactionPos.x) * u, this.interactionPos.y += (this.state.input.worldY - this.interactionPos.y) * u, this.interactionPos.z += (this.state.input.worldZ - this.interactionPos.z) * u;
  }
  updateUniforms(e) {
    const { config: n, state: i, buffers: t, device: a } = this;
    let s = 0;
    i.input.push ? s = -n.interactionStrength : i.input.pull && (s = n.interactionStrength), this.computeData[0] = e, this.computeData[1] = n.gravity, this.computeData[2] = n.interactionRadius, this.computeData[3] = s, this.computeData[4] = this.interactionPos.x, this.computeData[5] = this.interactionPos.y, this.computeData[6] = this.interactionPos.z, this.computeData[7] = 0, a.queue.writeBuffer(
      this.physicsUniforms.external,
      0,
      this.computeData
    ), this.hashParamsData[0] = n.smoothingRadius, this.hashParamsData[1] = t.particleCount, this.hashParamsData[2] = -this.smoothBoundsSize.x * 0.5, this.hashParamsData[3] = -5, this.hashParamsData[4] = -this.smoothBoundsSize.z * 0.5, this.hashParamsData[5] = this.gridRes.x, this.hashParamsData[6] = this.gridRes.y, this.hashParamsData[7] = this.gridRes.z, a.queue.writeBuffer(this.gridUniforms.hash, 0, this.hashParamsData), this.sortParamsData[0] = t.particleCount, this.sortParamsData[1] = this.gridTotalCells, a.queue.writeBuffer(this.gridUniforms.sort, 0, this.sortParamsData);
    const o = Math.ceil((this.gridTotalCells + 1) / 512), c = Math.ceil(o / 512);
    this.scanParamsDataL0[0] = this.gridTotalCells + 1, this.scanParamsDataL1[0] = o, this.scanParamsDataL2[0] = c, a.queue.writeBuffer(
      this.gridUniforms.scanL0,
      0,
      this.scanParamsDataL0
    ), a.queue.writeBuffer(
      this.gridUniforms.scanL1,
      0,
      this.scanParamsDataL1
    ), a.queue.writeBuffer(
      this.gridUniforms.scanL2,
      0,
      this.scanParamsDataL2
    );
    const l = n.smoothingRadius, f = 15 / (2 * Math.PI * Math.pow(l, 5)), p = 15 / (Math.PI * Math.pow(l, 6));
    this.densityParamsData[0] = l, this.densityParamsData[1] = f, this.densityParamsData[2] = p, this.densityParamsData[3] = t.particleCount, this.densityParamsData[4] = -this.smoothBoundsSize.x * 0.5, this.densityParamsData[5] = -5, this.densityParamsData[6] = -this.smoothBoundsSize.z * 0.5, this.densityParamsData[7] = 0, this.densityParamsData[8] = this.gridRes.x, this.densityParamsData[9] = this.gridRes.y, this.densityParamsData[10] = this.gridRes.z, this.densityParamsData[11] = 0, a.queue.writeBuffer(
      this.physicsUniforms.density,
      0,
      this.densityParamsData
    );
    const u = 15 / (Math.PI * Math.pow(l, 5)), g = 45 / (Math.PI * Math.pow(l, 6));
    this.pressureParamsData[0] = e, this.pressureParamsData[1] = n.targetDensity, this.pressureParamsData[2] = n.pressureMultiplier, this.pressureParamsData[3] = n.nearPressureMultiplier, this.pressureParamsData[4] = l, this.pressureParamsData[5] = u, this.pressureParamsData[6] = g, this.pressureParamsData[7] = t.particleCount, this.pressureParamsData[8] = -this.smoothBoundsSize.x * 0.5, this.pressureParamsData[9] = -5, this.pressureParamsData[10] = -this.smoothBoundsSize.z * 0.5, this.pressureParamsData[11] = 0, this.pressureParamsData[12] = this.gridRes.x, this.pressureParamsData[13] = this.gridRes.y, this.pressureParamsData[14] = this.gridRes.z, this.pressureParamsData[15] = 0, a.queue.writeBuffer(
      this.physicsUniforms.pressure,
      0,
      this.pressureParamsData
    );
    const P = 315 / (64 * Math.PI * Math.pow(l, 9));
    this.viscosityParamsData[0] = e, this.viscosityParamsData[1] = n.viscosityStrength, this.viscosityParamsData[2] = l, this.viscosityParamsData[3] = P, this.viscosityParamsData[4] = t.particleCount, this.viscosityParamsData[5] = -this.smoothBoundsSize.x * 0.5, this.viscosityParamsData[6] = -5, this.viscosityParamsData[7] = -this.smoothBoundsSize.z * 0.5, this.viscosityParamsData[8] = this.gridRes.x, this.viscosityParamsData[9] = this.gridRes.y, this.viscosityParamsData[10] = this.gridRes.z, this.viscosityParamsData[11] = 0, a.queue.writeBuffer(
      this.physicsUniforms.viscosity,
      0,
      this.viscosityParamsData
    ), this.integrateData[0] = e, this.integrateData[1] = n.collisionDamping;
    const b = (n.obstacleShape ?? "box") === "sphere", m = n.obstacleRadius ?? 0, d = n.showObstacle !== !1 && (b ? m > 0 : n.obstacleSize.x > 0 && n.obstacleSize.y > 0 && n.obstacleSize.z > 0);
    this.integrateData[2] = d ? 1 : 0, this.integrateData[3] = b ? 1 : 0;
    const w = this.smoothBoundsSize, G = w.x * 0.5, T = w.z * 0.5, z = -5;
    this.integrateData[4] = -G, this.integrateData[5] = z, this.integrateData[6] = -T, this.integrateData[8] = G, this.integrateData[9] = z + w.y, this.integrateData[10] = T, this.integrateData[12] = n.obstacleCentre.x, this.integrateData[13] = b ? n.obstacleCentre.y : n.obstacleCentre.y + n.obstacleSize.y * 0.5, this.integrateData[14] = n.obstacleCentre.z;
    const v = b ? m : n.obstacleSize.x * 0.5, S = b ? m : n.obstacleSize.y * 0.5, B = b ? m : n.obstacleSize.z * 0.5;
    this.integrateData[16] = v, this.integrateData[17] = S, this.integrateData[18] = B, this.integrateData[20] = n.obstacleRotation.x, this.integrateData[21] = n.obstacleRotation.y, this.integrateData[22] = n.obstacleRotation.z, a.queue.writeBuffer(
      this.physicsUniforms.integrate,
      0,
      this.integrateData
    );
  }
  dispatchFoam(e, n) {
    const { buffers: i, config: t, device: a } = this, s = i.maxFoamParticles;
    this.foamFrameCount++;
    const o = t.spawnRateFadeInTime <= 0 ? 1 : Math.min(
      1,
      Math.max(
        0,
        (this.simTimer - t.spawnRateFadeStartTime) / t.spawnRateFadeInTime
      )
    );
    this.foamSpawnData[0] = e, this.foamSpawnData[1] = t.foamSpawnRate * o * o, this.foamSpawnData[2] = t.trappedAirVelocityMin, this.foamSpawnData[3] = t.trappedAirVelocityMax, this.foamSpawnData[4] = t.foamKineticEnergyMin, this.foamSpawnData[5] = t.foamKineticEnergyMax;
    const c = new Uint32Array(this.foamSpawnData.buffer);
    c[6] = s, c[7] = this.foamFrameCount, this.foamSpawnData[8] = i.particleCount, this.foamSpawnData[9] = t.smoothingRadius, this.foamSpawnData[10] = t.foamLifetimeMin, this.foamSpawnData[11] = t.foamLifetimeMax, this.foamSpawnData[12] = -this.smoothBoundsSize.x * 0.5, this.foamSpawnData[13] = -5, this.foamSpawnData[14] = -this.smoothBoundsSize.z * 0.5, this.foamSpawnData[16] = this.gridRes.x, this.foamSpawnData[17] = this.gridRes.y, this.foamSpawnData[18] = this.gridRes.z, this.foamSpawnData[19] = t.bubbleScale, a.queue.writeBuffer(this.foamUniforms.spawn, 0, this.foamSpawnData), this.foamUpdateData[0] = e, this.foamUpdateData[1] = t.gravity, this.foamUpdateData[2] = 0.04, this.foamUpdateData[3] = t.bubbleBuoyancy;
    const l = this.smoothBoundsSize.x * 0.5, f = this.smoothBoundsSize.z * 0.5, p = -5;
    this.foamUpdateData[4] = l, this.foamUpdateData[5] = p + this.smoothBoundsSize.y, this.foamUpdateData[6] = f, this.foamUpdateData[7] = t.smoothingRadius, this.foamUpdateData[8] = -l, this.foamUpdateData[9] = p, this.foamUpdateData[10] = -f, this.foamUpdateData[11] = 0, this.foamUpdateData[12] = this.gridRes.x, this.foamUpdateData[13] = this.gridRes.y, this.foamUpdateData[14] = this.gridRes.z, this.foamUpdateData[15] = 0;
    const u = new Uint32Array(this.foamUpdateData.buffer);
    u[16] = t.bubbleClassifyMinNeighbours, u[17] = t.sprayClassifyMaxNeighbours, this.foamUpdateData[18] = t.bubbleScale, this.foamUpdateData[19] = t.bubbleChangeScaleSpeed, a.queue.writeBuffer(this.foamUniforms.update, 0, this.foamUpdateData), this.foam.dispatch(n, i.particleCount, s, !1);
  }
  render(e) {
    this.renderer.resize(this.canvas.width, this.canvas.height);
    const n = this.device.createCommandEncoder();
    this.renderer.render(
      n,
      this.context.getCurrentTexture().createView(),
      e,
      this.smoothBoundsSize
    ), this.device.queue.submit([n.finish()]);
  }
}
class He {
  // ===========================================================================
  // Spherical Coordinate Parameters
  // ===========================================================================
  /**
   * Distance from camera to target point.
   * Controlled by zoom (mouse wheel).
   *
   * Default: 5.0 (typically overridden by application)
   */
  radius = 5;
  /**
   * Horizontal rotation angle (radians).
   * Rotation around the Y axis.
   *
   * - Positive values rotate counter-clockwise when viewed from above
   * - Unbounded (can wrap around multiple times)
   *
   * Default: 0.0 (looking from +Z direction)
   */
  theta = 0;
  /**
   * Vertical angle from the Y axis (radians).
   * Also known as the polar angle or inclination.
   *
   * - 0 = directly above, looking straight down
   * - π/2 = at horizon level
   * - π = directly below, looking straight up
   *
   * Clamped to avoid gimbal lock at poles.
   *
   * Default: π/2 (at horizon level)
   */
  phi = Math.PI / 2;
  /**
   * The point the camera looks at and orbits around.
   *
   * Default: (0, 0, 0) - scene origin
   */
  target = { x: 0, y: 0, z: 0 };
  // ===========================================================================
  // Zoom Constraints
  // ===========================================================================
  /**
   * Minimum allowed radius (closest zoom).
   * Prevents camera from going through the target.
   */
  minRadius = 2;
  /**
   * Maximum allowed radius (farthest zoom).
   * Prevents camera from going too far away.
   */
  maxRadius = 100;
  // ===========================================================================
  // Constructor
  // ===========================================================================
  /**
   * Creates a new orbit camera with default settings.
   *
   * The camera starts at:
   * - radius = 5 units from target
   * - theta = 0 (looking from +Z direction)
   * - phi = π/2 (at horizon level)
   * - target = (0, 0, 0)
   */
  constructor() {
  }
  // ===========================================================================
  // Camera Controls
  // ===========================================================================
  /**
   * Rotates the camera around the target.
   *
   * This is typically called in response to mouse drag events.
   * The deltas should be scaled appropriately (e.g., multiply mouse
   * pixel movement by a sensitivity factor like 0.005).
   *
   * @param dTheta - Change in horizontal angle (radians)
   * @param dPhi - Change in vertical angle (radians)
   */
  rotate(e, n) {
    this.theta += e, this.phi += n;
    const i = 1e-3;
    this.phi = Math.max(i, Math.min(Math.PI - i, this.phi));
  }
  /**
   * Zooms the camera in or out by adjusting the radius.
   *
   * Positive delta zooms out (increases radius).
   * Negative delta zooms in (decreases radius).
   *
   * This is typically called in response to mouse wheel events.
   * The delta should be scaled appropriately (e.g., multiply wheel
   * delta by 0.01).
   *
   * @param delta - Change in radius (positive = zoom out)
   */
  zoom(e) {
    this.radius += e, this.radius = Math.max(
      this.minRadius,
      Math.min(this.maxRadius, this.radius)
    );
  }
  // ===========================================================================
  // Matrix Generation
  // ===========================================================================
  /**
   * Computes the view matrix for rendering.
   *
   * The view matrix transforms world coordinates to view (camera) coordinates.
   * It is the inverse of the camera's world transformation.
   *
   * This getter computes the matrix fresh each time, so cache the result
   * if you need to use it multiple times per frame.
   *
   * @returns A 4x4 view matrix as Float32Array (column-major)
   */
  get viewMatrix() {
    const e = this.radius * Math.sin(this.phi) * Math.sin(this.theta), n = this.radius * Math.cos(this.phi), i = this.radius * Math.sin(this.phi) * Math.cos(this.theta), t = H(this.target, { x: e, y: n, z: i });
    return X(t, this.target, { x: 0, y: 1, z: 0 });
  }
  // ===========================================================================
  // Basis Vectors
  // ===========================================================================
  /**
   * Returns the camera's basis vectors in world space.
   *
   * These vectors describe the camera's orientation:
   * - **right**: Points to the camera's right (+X in view space)
   * - **up**: Points to the camera's up (+Y in view space)
   * - **forward**: Points toward the target (-Z in view space, into the screen)
   *
   * These are useful for:
   * - Converting screen coordinates to world rays (ray casting)
   * - Billboard rendering
   * - UI placement in 3D space
   *
   * The vectors are extracted from the view matrix, which stores them
   * in its rows (transposed rotation part).
   *
   * @returns Object containing right, up, and forward unit vectors
   */
  get basis() {
    const e = this.viewMatrix, n = { x: e[0], y: e[4], z: e[8] }, i = { x: e[1], y: e[5], z: e[9] }, t = { x: e[2], y: e[6], z: e[10] }, a = { x: -t.x, y: -t.y, z: -t.z };
    return { right: n, up: i, forward: a };
  }
  // ===========================================================================
  // Position Accessor
  // ===========================================================================
  /**
   * Returns the camera's position in world space.
   *
   * This is computed from the spherical coordinates (radius, theta, phi)
   * plus the target offset.
   *
   * @returns Camera position as a 3D vector
   */
  get position() {
    const e = this.radius * Math.sin(this.phi) * Math.sin(this.theta), n = this.radius * Math.cos(this.phi), i = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    return H(this.target, { x: e, y: n, z: i });
  }
}
function Xe() {
  const r = navigator.userAgent.toLowerCase(), n = [
    "android",
    "iphone",
    "ipad",
    "ipod",
    "mobile",
    "tablet"
  ].some(
    (a) => r.includes(a)
  ), i = "ontouchstart" in window || navigator.maxTouchPoints > 0, t = window.innerWidth < 1024;
  return n || i && t;
}
class N extends Error {
  constructor(e) {
    super(e), this.name = "WebGPUInitError";
  }
}
async function Ze(r) {
  if (!navigator.gpu)
    throw new N("WebGPU is not supported in this browser.");
  const e = await navigator.gpu.requestAdapter();
  if (!e)
    throw new N("Unable to acquire a WebGPU adapter.");
  const n = e.features.has("subgroups");
  n && console.log("WebGPU subgroups supported - enabling optimized prefix sum");
  const i = [];
  n && i.push("subgroups");
  const t = await e.requestDevice({
    requiredFeatures: i
  }), a = r.getContext("webgpu");
  if (!a)
    throw new N("Unable to create a WebGPU context.");
  const s = navigator.gpu.getPreferredCanvasFormat(), o = Xe();
  return o && console.log("Mobile device detected - enabling shared memory optimizations"), { device: t, context: a, format: s, supportsSubgroups: n, isMobile: o };
}
function je(r, e, n) {
  r.configure({
    device: e,
    format: n,
    alphaMode: "opaque"
  });
}
async function Ke(r, e = {}) {
  const n = e.size ?? { x: 11, y: 5.5, z: 6.5 }, i = e.depth ?? 2.6, t = -5, a = {
    ...j(),
    ...K(),
    boundsSize: { ...n },
    // one still pool filling the bottom of the tank, instead of the demo's falling blocks
    spawnRegions: [{ position: { x: 0, y: t + i / 2, z: 0 }, size: { x: n.x - 0.1, y: i, z: n.z - 0.1 } }],
    jitterStr: 0.02,
    showObstacle: !1,
    obstacleSize: { x: 0, y: 0, z: 0 },
    interactionRadius: 1.4,
    interactionStrength: 45,
    viscosityStrength: 0.01,
    iterationsPerFrame: 2,
    foamSpawnRate: 70,
    trappedAirVelocityMin: 5,
    trappedAirVelocityMax: 25,
    foamKineticEnergyMin: 15,
    foamKineticEnergyMax: 80,
    bubbleBuoyancy: 1.4,
    bubbleScale: 0.3,
    foamLifetimeMin: 10,
    foamLifetimeMax: 30,
    waterColor: { r: 0.3, g: 0.9, b: 0.8 },
    deepWaterColor: { r: 0.02, g: 0.15, b: 0.45 },
    foamColor: { r: 0.95, g: 0.98, b: 1 },
    foamOpacity: 2.5,
    sprayClassifyMaxNeighbours: 5,
    bubbleClassifyMinNeighbours: 15,
    foamParticleRadius: 1,
    spawnRateFadeInTime: 0.75,
    spawnRateFadeStartTime: 0.1,
    bubbleChangeScaleSpeed: 7,
    extinctionCoeff: { x: 2.12, y: 0.43, z: 0.3 },
    extinctionMultiplier: 0.9,
    // seen side-on through the whole tank; the demo's value turns it near black
    refractionStrength: 9.15,
    shadowSoftness: 2.5,
    showFluidShadows: !0,
    // the tank's edges
    showBoundsWireframe: !0,
    boundsWireframeColor: { r: 0.72, g: 0.66, b: 0.52 },
    obstacleColor: { r: 1, g: 0, b: 0 },
    obstacleAlpha: 1,
    // a dim room instead of the demo's bright sky and coloured checkerboard
    particleRadius: 6,
    skyColorHorizon: { r: 0.22, g: 0.2, b: 0.18 },
    skyColorZenith: { r: 0.05, g: 0.05, b: 0.06 },
    skyColorGround: { r: 0.1, g: 0.09, b: 0.08 },
    tileCol1: { r: 0.3, g: 0.22, b: 0.16 },
    tileCol2: { r: 0.3, g: 0.22, b: 0.16 },
    tileCol3: { r: 0.3, g: 0.22, b: 0.16 },
    tileCol4: { r: 0.3, g: 0.22, b: 0.16 },
    tileColVariation: { x: 0.02, y: 0, z: 0.08 },
    tileDarkFactor: -0.08,
    floorAmbient: 0.45
  }, { device: s, context: o, format: c, supportsSubgroups: l } = await Ze(r), f = () => {
    const v = Math.min(window.devicePixelRatio || 1, 1.5);
    r.width = Math.round(r.clientWidth * v), r.height = Math.round(r.clientHeight * v), je(o, s, c);
  };
  f();
  const p = new We(s, o, r, a, c, l), u = new He(), g = (e.elevation ?? 10) * Math.PI / 180;
  u.theta = 0, u.phi = Math.PI / 2 - g;
  const P = () => {
    const v = r.width / Math.max(1, r.height), S = Math.tan(Math.PI / 6);
    u.radius = Math.max(n.x / 2 * 1.2 / (S * v) + n.z / 2, n.y / 2 * 1.5 / S + n.z / 2);
  };
  P(), u.target = { x: 0, y: t + n.y * 0.42, z: 0 };
  const h = p.simulationState.input, b = (v, S, B) => {
    if (!B) {
      h.push = !1, h.pull = !1, h.rayOrigin = void 0, h.rayDir = void 0;
      return;
    }
    const x = r.getBoundingClientRect(), R = (v - x.left) / x.width * 2 - 1, k = -((S - x.top) / x.height * 2 - 1), C = Math.tan(Math.PI / 6), y = r.width / r.height, { right: D, up: O, forward: E } = u.basis, U = {
      x: E.x + D.x * R * y * C + O.x * k * C,
      y: E.y + D.y * R * y * C + O.y * k * C,
      z: E.z + D.z * R * y * C + O.z * k * C
    }, F = Math.hypot(U.x, U.y, U.z), I = { x: U.x / F, y: U.y / F, z: U.z / F }, A = u.position;
    h.rayOrigin = A, h.rayDir = I;
    const L = (0 - A.z) / I.z;
    L > 0 && (h.worldX = Math.max(-n.x / 2, Math.min(n.x / 2, A.x + I.x * L)), h.worldY = Math.max(t, Math.min(t + n.y, A.y + I.y * L)), h.worldZ = 0), h.push = B === "push", h.pull = B === "pull";
  }, m = (v, S, B) => {
    const x = u.viewMatrix, R = x[0] * v + x[4] * S + x[8] * B + x[12], k = x[1] * v + x[5] * S + x[9] * B + x[13], C = x[2] * v + x[6] * S + x[10] * B + x[14], y = 1 / Math.tan(Math.PI / 6), D = r.width / r.height, O = y / D * R / -C, E = y * k / -C, U = r.getBoundingClientRect();
    return { x: U.left + (O * 0.5 + 0.5) * U.width, y: U.top + (0.5 - E * 0.5) * U.height };
  };
  let d = 0, w = null, G = !1;
  const T = async (v) => {
    if (G) return;
    w === null && (w = v);
    const S = Math.min(0.033, (v - w) / 1e3);
    w = v, await p.step(S), p.render(u.viewMatrix), d = requestAnimationFrame(T);
  };
  d = requestAnimationFrame(T);
  const z = () => {
    f(), P();
  };
  return window.addEventListener("resize", z), {
    config: a,
    camera: u,
    particleCount: p.buffers?.particleCount ?? 0,
    setHand: b,
    reset: () => p.reset(),
    resize: z,
    project: m,
    destroy: () => {
      G = !0, cancelAnimationFrame(d), window.removeEventListener("resize", z);
    },
    advance: async (v) => {
      await p.step(v), p.render(u.viewMatrix);
    }
  };
}
export {
  Ke as createTank
};
