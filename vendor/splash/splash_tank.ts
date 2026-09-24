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
  /** Where the cubemap/ folder is served from (ends with '/'). */
  base: string
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
}

export async function createTank(canvas: HTMLCanvasElement, opts: TankOptions): Promise<Tank> {
  const particleCount = opts.particles ?? 40000
  const box = opts.box ?? [72, 40, 40]
  const res = opts.resolution ?? 0.7

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) throw new Error('no WebGPU adapter')
  const device = await adapter.requestDevice()
  const context = canvas.getContext('webgpu') as GPUCanvasContext
  canvas.width = Math.round(res * canvas.clientWidth)
  canvas.height = Math.round(res * canvas.clientHeight)
  const format = navigator.gpu.getPreferredCanvasFormat()
  context.configure({ device, format })

  // environment cubemap for reflections
  const faces = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'].map((n) => `${opts.base}cubemap/${n}.png`)
  const bitmaps = await Promise.all(faces.map(async (src) => createImageBitmap(await (await fetch(src)).blob())))
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
  const view = { get clientWidth() { return canvas.clientWidth }, get clientHeight() { return canvas.clientHeight }, addEventListener() {} }
  const camera = new Camera(view as unknown as HTMLCanvasElement)
  const aim = () => {
    const distance = box[0] * 0.95
    camera.reset(distance, [box[0] / 2, box[1] * 0.28, box[2] / 2], fov, 0.7)
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
      camera.calcMouseVelocity(), 15, false, 0.4 * 0.8, true, dg)
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
    destroy: () => { stopped = true; cancelAnimationFrame(raf); device.destroy() },
  }
}
