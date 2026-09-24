/**
 * Embeddable water tank: jeantimex/fluid's 3D SPH simulation with its screen-space renderer
 * (refraction, Beer–Lambert absorption, foam/spray/bubbles, shadows), set up as a still,
 * half-full tank seen from just above the waterline, with a programmatic "hand" in place of
 * the demo's mouse controls. Built as a single ES module for the hand-puzzles site.
 */
import { createConfig } from '../sph/3d/common/config.ts';
import { createDefaultEnvironmentConfig } from '../sph/3d/common/environment.ts';
import { FluidSimulation } from '../sph/3d/webgpu_screen_space/fluid_simulation.ts';
import type { ScreenSpaceConfig } from '../sph/3d/webgpu_screen_space/types.ts';
import { OrbitCamera } from '../sph/3d/common/orbit_camera.ts';
import { initWebGPU, configureContext } from '../sph/3d/common/webgpu_utils.ts';

export interface TankOptions {
  /** Tank inner size in sim units. The physics is tuned for its own scale; keep volumes modest. */
  size?: { x: number; y: number; z: number };
  /** Water depth at rest. */
  depth?: number;
  /** Camera elevation above the horizon, degrees. */
  elevation?: number;
}

export interface Tank {
  config: ScreenSpaceConfig;
  camera: OrbitCamera;
  particleCount: number;
  /** A hand at a screen point: 'push' (open hand), 'pull' (pinch) or null (out of the water). */
  setHand(clientX: number, clientY: number, mode: 'push' | 'pull' | null): void;
  reset(): void;
  resize(): void;
  /** Where on screen a world point is (for overlays). */
  project(x: number, y: number, z: number): { x: number; y: number };
  destroy(): void;
  /** Step and draw one frame by hand (tests, or when the page's own loop is paused). */
  advance(dt: number): Promise<void>;
}

export async function createTank(canvas: HTMLCanvasElement, opts: TankOptions = {}): Promise<Tank> {
  const size = opts.size ?? { x: 11, y: 5.5, z: 6.5 };
  const depth = opts.depth ?? 2.6; // ≈110k particles: leaves GPU room for hand tracking
  const floorY = -5; // the sim's box sits on y = -5

  const config: ScreenSpaceConfig = {
    ...createConfig(),
    ...createDefaultEnvironmentConfig(),
    boundsSize: { ...size },
    // one still pool filling the bottom of the tank, instead of the demo's falling blocks
    spawnRegions: [{ position: { x: 0, y: floorY + depth / 2, z: 0 }, size: { x: size.x - 0.1, y: depth, z: size.z - 0.1 } }],
    jitterStr: 0.02,
    showObstacle: false,
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
    foamColor: { r: 0.95, g: 0.98, b: 1.0 },
    foamOpacity: 2.5,
    sprayClassifyMaxNeighbours: 5,
    bubbleClassifyMinNeighbours: 15,
    foamParticleRadius: 1.0,
    spawnRateFadeInTime: 0.75,
    spawnRateFadeStartTime: 0.1,
    bubbleChangeScaleSpeed: 7,

    extinctionCoeff: { x: 2.12, y: 0.43, z: 0.3 },
    extinctionMultiplier: 0.9, // seen side-on through the whole tank; the demo's value turns it near black
    refractionStrength: 9.15,
    shadowSoftness: 2.5,
    showFluidShadows: true,

    // the tank's edges
    showBoundsWireframe: true,
    boundsWireframeColor: { r: 0.72, g: 0.66, b: 0.52 },
    obstacleColor: { r: 1.0, g: 0.0, b: 0.0 },
    obstacleAlpha: 1.0,
    // a dim room instead of the demo's bright sky and coloured checkerboard
    particleRadius: 6,
    skyColorHorizon: { r: 0.22, g: 0.2, b: 0.18 },
    skyColorZenith: { r: 0.05, g: 0.05, b: 0.06 },
    skyColorGround: { r: 0.1, g: 0.09, b: 0.08 },
    tileCol1: { r: 0.3, g: 0.22, b: 0.16 },
    tileCol2: { r: 0.3, g: 0.22, b: 0.16 },
    tileCol3: { r: 0.3, g: 0.22, b: 0.16 },
    tileCol4: { r: 0.3, g: 0.22, b: 0.16 },
    tileColVariation: { x: 0.02, y: 0.0, z: 0.08 },
    tileDarkFactor: -0.08,
    floorAmbient: 0.45,
  } as ScreenSpaceConfig;

  const { device, context, format, supportsSubgroups } = await initWebGPU(canvas);
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    configureContext(context, device, format);
  };
  fit();

  const sim = new FluidSimulation(device, context, canvas, config, format, supportsSubgroups);

  // a fixed view from the front, just above the waterline, framing the tank
  const camera = new OrbitCamera();
  const el = ((opts.elevation ?? 10) * Math.PI) / 180;
  camera.theta = 0;
  camera.phi = Math.PI / 2 - el;
  const frame = () => {
    const aspect = canvas.width / Math.max(1, canvas.height);
    const tanH = Math.tan(Math.PI / 6);
    camera.radius = Math.max(((size.x / 2) * 1.2) / (tanH * aspect) + size.z / 2, ((size.y / 2) * 1.5) / tanH + size.z / 2);
  };
  frame();
  // aim at the middle of the tank rather than the world origin
  (camera as any).target = { x: 0, y: floorY + size.y * 0.42, z: 0 };

  const input = sim.simulationState.input;
  const setHand = (clientX: number, clientY: number, mode: 'push' | 'pull' | null) => {
    if (!mode) {
      input.push = false;
      input.pull = false;
      input.rayOrigin = undefined;
      input.rayDir = undefined;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
    const tanFov = Math.tan(Math.PI / 6);
    const aspect = canvas.width / canvas.height;
    const { right, up, forward } = camera.basis;
    const d = {
      x: forward.x + right.x * nx * aspect * tanFov + up.x * ny * tanFov,
      y: forward.y + right.y * nx * aspect * tanFov + up.y * ny * tanFov,
      z: forward.z + right.z * nx * aspect * tanFov + up.z * ny * tanFov,
    };
    const len = Math.hypot(d.x, d.y, d.z);
    const dir = { x: d.x / len, y: d.y / len, z: d.z / len };
    const o = camera.position;
    input.rayOrigin = o;
    input.rayDir = dir;
    // until the GPU pick lands, aim at where the ray crosses the tank's middle depth
    const t = (0 - o.z) / dir.z;
    if (t > 0) {
      input.worldX = Math.max(-size.x / 2, Math.min(size.x / 2, o.x + dir.x * t));
      input.worldY = Math.max(floorY, Math.min(floorY + size.y, o.y + dir.y * t));
      input.worldZ = 0;
    }
    input.push = mode === 'push';
    input.pull = mode === 'pull';
  };

  const project = (x: number, y: number, z: number) => {
    const v = camera.viewMatrix; // column-major 4×4
    const vx = v[0] * x + v[4] * y + v[8] * z + v[12];
    const vy = v[1] * x + v[5] * y + v[9] * z + v[13];
    const vz = v[2] * x + v[6] * y + v[10] * z + v[14];
    const f = 1 / Math.tan(Math.PI / 6);
    const aspect = canvas.width / canvas.height;
    const ndcX = (f / aspect) * vx / -vz, ndcY = f * vy / -vz;
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left + (ndcX * 0.5 + 0.5) * rect.width, y: rect.top + (0.5 - ndcY * 0.5) * rect.height };
  };

  let raf = 0, last: number | null = null, stopped = false;
  const loop = async (now: number) => {
    if (stopped) return;
    if (last === null) last = now;
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    await sim.step(dt);
    sim.render(camera.viewMatrix);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  const onResize = () => { fit(); frame(); };
  window.addEventListener('resize', onResize);

  return {
    config,
    camera,
    particleCount: (sim as any).buffers?.particleCount ?? 0,
    setHand,
    reset: () => sim.reset(),
    resize: onResize,
    project,
    destroy: () => { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); },
    advance: async (dt: number) => { await sim.step(dt); sim.render(camera.viewMatrix); },
  };
}
