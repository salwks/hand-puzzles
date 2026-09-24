/**
 * Embeddable water tank from matsuoka-601/Splash (MIT): its MLS-MPM simulation (one substep a
 * frame) and screen-space fluid renderer with the narrow-range filter. Set up as a still pool
 * seen from just above the waterline, a fixed camera, and a programmatic hand that stirs the
 * water the way Splash's mouse does. Built as a single ES module for the hand-puzzles site.
 */
import { Camera, renderUniformsViews, renderUniformsValues } from '../camera'
import { mlsmpmParticleStructSize, MLSMPMSimulator } from '../mls-mpm/mls-mpm'
import { FluidRenderer } from '../render/fluidRender'

export interface TankOptions {
  particles?: number
  /** Box size in grid cells (x across, y up, z deep). */
  box?: [number, number, number]
  /** Camera elevation above the horizon, degrees. */
  elevation?: number
  /** Render resolution relative to the canvas's CSS size (Splash uses 0.7). */
  resolution?: number
}

export interface Tank {
  particleCount: number
  /** The hand over the water at a screen point, or out of it (null). */
  setHand(clientX: number | null, clientY?: number): void
  reset(): void
  advance(): void
  destroy(): void
  /** Screen position (client px) of a point in grid units — for drawing the tank's frame. */
  project(x: number, y: number, z: number): { x: number; y: number; behind: boolean }
  box: number[]
}

/** A bathroom around the tank: white tiles with grey grout on every wall, a plain ceiling. */
function tileFace(size: number, plain = false): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.fillStyle = plain ? '#ecebe7' : '#f1f1ee'
  g.fillRect(0, 0, size, size)
  if (plain) return c
  const n = 8, t = size / n
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = 236 + Math.round(Math.random() * 10) - ((i + j) % 2 ? 6 : 0)
    g.fillStyle = `rgb(${v},${v},${v - 2})`
    g.fillRect(i * t + 2, j * t + 2, t - 4, t - 4)
  }
  g.strokeStyle = '#b9bcbd'
  g.lineWidth = 4
  for (let i = 0; i <= n; i++) {
    g.beginPath(); g.moveTo(i * t, 0); g.lineTo(i * t, size); g.stroke()
    g.beginPath(); g.moveTo(0, i * t); g.lineTo(size, i * t); g.stroke()
  }
  return c
}

export async function createTank(canvas: HTMLCanvasElement, opts: TankOptions): Promise<Tank> {
  // the glass tank's proportions (4 : 1.05 : 2.4), with a little headroom for splashes,
  // filled to about three quarters of the rim
  const particleCount = opts.particles ?? 37000
  const box = opts.box ?? [72, 22, 43]
  const res = opts.resolution ?? 0.7

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) throw new Error('no WebGPU adapter')
  const device = await adapter.requestDevice()
  const context = canvas.getContext('webgpu') as GPUCanvasContext
  canvas.width = Math.round(res * canvas.clientWidth)
  canvas.height = Math.round(res * canvas.clientHeight)
  const format = navigator.gpu.getPreferredCanvasFormat()
  context.configure({ device, format })

  // environment cubemap for reflections: the tiled bathroom (order +X, -X, +Y, -Y, +Z, -Z)
  const bitmaps = await Promise.all([false, false, true, false, false, false].map((plain) => createImageBitmap(tileFace(512, plain))))
  const cubemap = device.createTexture({
    dimension: '2d', size: [bitmaps[0].width, bitmaps[0].height, 6], format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
  })
  bitmaps.forEach((b, i) => device.queue.copyExternalImageToTexture({ source: b }, { texture: cubemap, origin: [0, 0, i] }, [b.width, b.height]))
  const cubemapView = cubemap.createView({ dimension: 'cube' })

  const gridCount = box[0] * box[1] * box[2]
  const particleBuffer = device.createBuffer({ size: mlsmpmParticleStructSize * particleCount, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST })
  const posvelBuffer = device.createBuffer({ size: 32 * particleCount, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST })
  const renderUniformBuffer = device.createBuffer({ size: renderUniformsValues.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
  const initBoxSizeBuffer = device.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
  const depthMap = device.createTexture({ size: [canvas.width, canvas.height, 1], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING, format: 'r32float' })
  const depthMapView = depthMap.createView()
  // density grid: only used by Splash's particle/shadow mode, but the pipelines expect it
  const dg = [box[0], box[1], Math.ceil(box[2] / 128) * 128]
  const densityGridBuffer = device.createBuffer({ size: 4 * dg[0] * dg[1] * dg[2], usage: GPUBufferUsage.STORAGE })
  const castedDensityGridBuffer = device.createBuffer({ size: 2 * dg[0] * dg[1] * dg[2], usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC })
  const densityGridSizeBuffer = device.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
  device.queue.writeBuffer(densityGridSizeBuffer, 0, new Float32Array(dg))
  const densityGrid = device.createTexture({ size: [dg[2], dg[1], dg[0]], usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, format: 'r16float', dimension: '3d' })

  const fov = (60 * Math.PI) / 180
  const radius = 0.6, diameter = 2 * radius, fixedPoint = 1e7
  const sim = new MLSMPMSimulator(
    particleBuffer, posvelBuffer, renderUniformBuffer, densityGridBuffer, castedDensityGridBuffer,
    initBoxSizeBuffer, densityGridSizeBuffer, device, depthMapView, canvas, gridCount, particleCount, fixedPoint, diameter,
  )
  const renderer = new FluidRenderer(
    renderUniformBuffer, posvelBuffer, densityGridSizeBuffer, initBoxSizeBuffer, device,
    depthMapView, cubemapView, densityGrid.createView(), canvas, format, radius, fov, fixedPoint,
  )

  // Start from a still pool filling the floor, not Splash's collapsing block.
  ;(sim as any).initDambreak = function (initBox: number[], n: number) {
    const buf = new ArrayBuffer(mlsmpmParticleStructSize * this.maxParticleCount)
    const spacing = 0.9
    this.numParticles = 0
    for (let j = 3; j < initBox[1] - 3 && this.numParticles < n; j += spacing) {
      for (let i = 3; i < initBox[0] - 3 && this.numParticles < n; i += spacing) {
        for (let k = 3; k < initBox[2] - 3 && this.numParticles < n; k += spacing) {
          const o = mlsmpmParticleStructSize * this.numParticles
          new Float32Array(buf, o, 3).set([i + 0.3 * Math.random(), j + 0.3 * Math.random(), k + 0.3 * Math.random()])
          this.numParticles++
        }
      }
    }
    return buf
  }

  // Splash's camera, fed our own pointer instead of its drag-to-orbit mouse handlers.
  // (it reads width/height to turn pointer motion into a velocity: without them the stir is NaN)
  const view = {
    get clientWidth() { return canvas.clientWidth }, get clientHeight() { return canvas.clientHeight },
    get width() { return canvas.width }, get height() { return canvas.height },
    addEventListener() {},
  }
  const camera = new Camera(view as unknown as HTMLCanvasElement)
  const aim = () => {
    const distance = box[0] * 1.05
    camera.reset(distance, [box[0] / 2, box[1] * 0.42, box[2] / 2], fov, 0.7)
    camera.currentYtheta = -((opts.elevation ?? 10) * Math.PI) / 180
    camera.recalculateView()
  }
  sim.reset(box, particleCount)
  aim()

  let handIn = false
  camera.currentHoverX = camera.prevHoverX = -1e4
  camera.currentHoverY = camera.prevHoverY = -1e4
  const setHand = (x: number | null, y?: number) => {
    const r = canvas.getBoundingClientRect()
    if (x === null || y === undefined) {
      handIn = false
      camera.currentHoverX = camera.prevHoverX = -1e4 // far off: touches nothing
      camera.currentHoverY = camera.prevHoverY = -1e4
      return
    }
    if (!handIn) { camera.prevHoverX = x - r.left; camera.prevHoverY = y - r.top } // no jump on entry
    handIn = true
    camera.currentHoverX = x - r.left
    camera.currentHoverY = y - r.top
  }

  const frame = () => {
    renderUniformsViews.texelSize.set([1 / canvas.width, 1 / canvas.height])
    renderUniformsViews.sphereSize.set([diameter])
    device.queue.writeBuffer(renderUniformBuffer, 0, renderUniformsValues)
    const enc = device.createCommandEncoder()
    sim.execute(enc, [camera.currentHoverX / canvas.clientWidth, camera.currentHoverY / canvas.clientHeight],
      camera.calcMouseVelocity().map((v: number) => v * 0.6), 15, false, 0.4 * 0.8, true, dg) // a hand sweeps faster than a mouse hover: 60% of Splash's push
    renderer.execute(context, enc, sim.numParticles, false, [140 / 255, 220 / 255, 240 / 255], 0.7)
    device.queue.submit([enc.finish()])
    camera.setNewPrevMouseCoord()
  }

  let raf = 0, stopped = false
  const loop = () => { if (stopped) return; frame(); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)

  return {
    particleCount: sim.numParticles,
    setHand,
    reset: () => { sim.reset(box, particleCount); aim() },
    advance: frame,
    box,
    project: (x: number, y: number, z: number) => {
      const v = renderUniformsViews.viewMatrix, pm = renderUniformsViews.projectionMatrix
      const vx = v[0] * x + v[4] * y + v[8] * z + v[12], vy = v[1] * x + v[5] * y + v[9] * z + v[13]
      const vz = v[2] * x + v[6] * y + v[10] * z + v[14], vw = v[3] * x + v[7] * y + v[11] * z + v[15]
      const cx = pm[0] * vx + pm[4] * vy + pm[8] * vz + pm[12] * vw, cy = pm[1] * vx + pm[5] * vy + pm[9] * vz + pm[13] * vw
      const cw = pm[3] * vx + pm[7] * vy + pm[11] * vz + pm[15] * vw
      const r = canvas.getBoundingClientRect()
      return { x: r.left + (cx / cw * 0.5 + 0.5) * r.width, y: r.top + (0.5 - cy / cw * 0.5) * r.height, behind: cw <= 0 }
    },
    destroy: () => { stopped = true; cancelAnimationFrame(raf); device.destroy() },
  }
}
