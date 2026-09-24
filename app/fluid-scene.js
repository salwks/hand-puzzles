// The tank filled with particle water (FluidGPU) instead of a surface sheet. The particles are
// drawn with screen-space fluid rendering: each is a sphere in a depth pass, the depth is
// smoothed with a bilateral filter so the spheres merge into one liquid surface, a second pass
// adds up thickness (and speed, for whitewater), and a composite pass shades it — normals from
// the smoothed depth, refraction of the scene behind, colour absorbed with thickness, Fresnel
// reflection and the lamp's highlight. The glass is drawn over the top afterwards.
import * as THREE from 'three';
import { WaterScene, W, D, WL } from './water-scene.js';
import { damp } from './stage.js';

export const GRID = [54, 17, 34]; // cells: 50 × 13 × 30 inside the walls
const DX = W / (GRID[0] - 4);
const toCells = (x, y, z) => [(x + W / 2) / DX + 2, y / DX + 2, (z + D / 2) / DX + 2];
/** The box the water starts in, in cells: the whole tank up to the rest level. */
export const FLUID_FILL = [[2, GRID[0] - 2], [2, 2 + WL / DX], [2, GRID[2] - 2]];

const FULLSCREEN_VS = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

export class FluidScene extends WaterScene {
  constructor(canvas, fluid) {
    super(canvas);
    this.fluid = fluid;
    this.simPerSecond = 24; // sim-time units per real second: sets how heavy/slow the water moves
    this.flowCells = { vx: new Float32Array(GRID[0] * GRID[2]), vz: new Float32Array(GRID[0] * GRID[2]) };
    // glass goes on its own layer so it can be drawn after the water
    this.scene.traverse((o) => { if (o.isMesh && o.material?.opacity === 0.1) o.layers.set(1); });
    this.buildFluidRender();
    this.resize();
  }

  buildWater() {} // no surface sheet: the particles are the water

  buildFluidRender() {
    const n = this.fluid.count;
    const geo = new THREE.BufferGeometry();
    this.particleAttr = new THREE.BufferAttribute(new Float32Array(n * 4), 4);
    this.particleAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.particleAttr);
    geo.setDrawRange(0, 0);
    const common = {
      uRadius: { value: DX * 1.05 },
      uScale: { value: 1 },
      uDx: { value: DX },
      uOrigin: { value: new THREE.Vector3(-W / 2, 0, -D / 2) },
    };
    const vs = `
      in vec4 position;
      uniform mat4 modelViewMatrix, projectionMatrix;
      uniform float uRadius, uScale, uDx;
      uniform vec3 uOrigin;
      out vec3 vView;
      out float vSpeed;
      void main() {
        vec3 w = (position.xyz - 2.0) * uDx + uOrigin;
        vec4 mv = modelViewMatrix * vec4(w, 1.0);
        vView = mv.xyz;
        vSpeed = position.w;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 2.0 * uRadius * uScale / -mv.z;
      }`;
    this.depthMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, uniforms: common, vertexShader: vs,
      fragmentShader: `
        precision highp float;
        uniform float uRadius;
        uniform mat4 projectionMatrix;
        in vec3 vView;
        out vec4 o;
        void main() {
          vec2 c = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(c, c);
          if (r2 > 1.0) discard;
          vec3 p = vView + vec3(0.0, 0.0, sqrt(1.0 - r2) * uRadius);
          vec4 clip = projectionMatrix * vec4(p, 1.0);
          gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;
          o = vec4(p.z, 0.0, 0.0, 1.0);
        }`,
    });
    this.thickMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, uniforms: { ...common, uFoam: { value: new THREE.Vector2(2.2, 5.0) } }, vertexShader: vs,
      transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
      fragmentShader: `
        precision highp float;
        uniform float uRadius;
        uniform vec2 uFoam;
        in vec3 vView;
        in float vSpeed;
        out vec4 o;
        void main() {
          vec2 c = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(c, c);
          if (r2 > 1.0) discard;
          float t = sqrt(1.0 - r2) * uRadius * 2.0;
          o = vec4(t, t * smoothstep(uFoam.x, uFoam.y, vSpeed), 0.0, 1.0);
        }`,
    });
    const pts = (mat) => { const p = new THREE.Points(geo, mat); p.frustumCulled = false; const s = new THREE.Scene(); s.add(p); return s; };
    this.depthScene = pts(this.depthMat);
    this.thickScene = pts(this.thickMat);
    this.particleGeo = geo;

    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)); return s; };
    this.blurMat = new THREE.ShaderMaterial({
      uniforms: { tDepth: { value: null }, uDir: { value: new THREE.Vector2() } },
      vertexShader: FULLSCREEN_VS,
      fragmentShader: `
        uniform sampler2D tDepth;
        uniform vec2 uDir;
        varying vec2 vUv;
        void main() {
          float d0 = texture2D(tDepth, vUv).r;
          if (d0 == 0.0) { gl_FragColor = vec4(0.0); return; }
          float sum = 0.0, wsum = 0.0;
          for (int i = -10; i <= 10; i++) {
            float d = texture2D(tDepth, vUv + uDir * float(i)).r;
            if (d == 0.0) continue;
            float ws = exp(-float(i * i) / 32.0);
            float dd = (d - d0) / 0.06;
            float w = ws * exp(-dd * dd);
            sum += d * w;
            wsum += w;
          }
          gl_FragColor = vec4(sum / wsum, 0.0, 0.0, 1.0);
        }`,
    });
    this.blurScene = quad(this.blurMat);

    this.compositeMat = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: null }, tSceneDepth: { value: null }, tFluid: { value: null }, tThick: { value: null },
        uProjInv: { value: new THREE.Matrix4() }, uProj: { value: new THREE.Matrix4() }, uViewInv: { value: new THREE.Matrix4() },
        uTexel: { value: new THREE.Vector2() }, uNear: { value: 0.1 }, uFar: { value: 80 },
        uLight: { value: new THREE.Vector3() },
      },
      depthTest: true, depthWrite: true, depthFunc: THREE.AlwaysDepth,
      vertexShader: FULLSCREEN_VS,
      fragmentShader: `
        #include <packing>
        uniform sampler2D tScene, tSceneDepth, tFluid, tThick;
        uniform mat4 uProjInv, uProj, uViewInv;
        uniform vec2 uTexel;
        uniform float uNear, uFar;
        uniform vec3 uLight;
        varying vec2 vUv;
        vec3 viewPos(vec2 uv, float z) {
          vec4 v = uProjInv * vec4(uv * 2.0 - 1.0, 0.0, 1.0);
          vec3 dir = v.xyz / v.w;
          return dir * (z / dir.z);
        }
        void main() {
          vec4 scene = texture2D(tScene, vUv);
          float sd = texture2D(tSceneDepth, vUv).x;
          float sz = perspectiveDepthToViewZ(sd, uNear, uFar);
          float fz = texture2D(tFluid, vUv).r;
          if (fz == 0.0 || fz < sz) {
            gl_FragColor = scene;
            gl_FragDepth = sd;
          } else {
            vec3 P = viewPos(vUv, fz);
            // surface normal from the smoothed depth: take the smaller step on each axis
            float zr = texture2D(tFluid, vUv + vec2(uTexel.x, 0.0)).r, zl = texture2D(tFluid, vUv - vec2(uTexel.x, 0.0)).r;
            float zu = texture2D(tFluid, vUv + vec2(0.0, uTexel.y)).r, zd = texture2D(tFluid, vUv - vec2(0.0, uTexel.y)).r;
            vec3 ddx = viewPos(vUv + vec2(uTexel.x, 0.0), zr == 0.0 ? fz : zr) - P;
            vec3 ddx2 = P - viewPos(vUv - vec2(uTexel.x, 0.0), zl == 0.0 ? fz : zl);
            if (zr == 0.0 || (zl != 0.0 && abs(ddx2.z) < abs(ddx.z))) ddx = ddx2;
            vec3 ddy = viewPos(vUv + vec2(0.0, uTexel.y), zu == 0.0 ? fz : zu) - P;
            vec3 ddy2 = P - viewPos(vUv - vec2(0.0, uTexel.y), zd == 0.0 ? fz : zd);
            if (zu == 0.0 || (zd != 0.0 && abs(ddy2.z) < abs(ddy.z))) ddy = ddy2;
            vec3 n = normalize(cross(ddx, ddy));
            vec3 V = normalize(-P);
            if (dot(n, V) < 0.0) n = -n;
            vec2 th = texture2D(tThick, vUv).rg;
            float t = th.r;
            float foam = th.y;
            float F = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
            // refraction: the scene behind, bent by the surface and dimmed/tinted by depth of water
            vec3 bg = texture2D(tScene, clamp(vUv + n.xy * min(t, 1.2) * 0.035, 0.001, 0.999)).rgb;
            vec3 T = exp(-t * vec3(1.35, 0.42, 0.33));
            vec3 refr = bg * T + vec3(0.02, 0.16, 0.2) * (1.0 - T);
            // reflection of a softly lit room, and the lamp's glint
            vec3 R = (uViewInv * vec4(reflect(-V, n), 0.0)).xyz;
            vec3 room = mix(vec3(0.04, 0.05, 0.06), vec3(0.7, 0.78, 0.84), smoothstep(-0.05, 0.7, R.y));
            float spec = pow(max(dot(reflect(-uLight, n), V), 0.0), 220.0) * 3.0;
            vec3 col = mix(refr, room, F) + spec;
            // whitewater: fast-moving water turns white
            float fa = clamp(foam * 3.0, 0.0, 0.92);
            col = mix(col, vec3(0.88, 0.93, 0.95) * (0.6 + 0.4 * max(dot(n, uLight), 0.0)), fa);
            gl_FragColor = vec4(col, 1.0);
            vec4 clip = uProj * vec4(P, 1.0);
            gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;
          }
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    this.compositeScene = quad(this.compositeMat);
  }

  resize() {
    super.resize();
    if (!this.compositeMat) return;
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const w = size.x, h = size.y, hw = Math.max(1, Math.round(w / 2)), hh = Math.max(1, Math.round(h / 2));
    for (const rt of [this.sceneRT, this.depthRT, this.thickRT, this.blurRT, this.blurRT2]) rt?.dispose();
    this.sceneRT = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthTexture: new THREE.DepthTexture(w, h, THREE.FloatType) });
    const fl = { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter };
    this.depthRT = new THREE.WebGLRenderTarget(hw, hh, { ...fl, depthBuffer: true });
    this.blurRT = new THREE.WebGLRenderTarget(hw, hh, { ...fl, depthBuffer: false });
    this.blurRT2 = new THREE.WebGLRenderTarget(hw, hh, { ...fl, depthBuffer: false });
    this.thickRT = new THREE.WebGLRenderTarget(hw, hh, { type: THREE.HalfFloatType, depthBuffer: false });
    const projScale = hh / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
    this.depthMat.uniforms.uScale.value = projScale;
    this.thickMat.uniforms.uScale.value = projScale;
    this.compositeMat.uniforms.uTexel.value.set(1 / hw, 1 / hh);
    this.halfSize = [hw, hh];
  }

  // ---------- simulation ----------

  setStir(active, x, y) {
    const h = this.dip;
    const p = active ? this.waterPoint(x, y) : null;
    if (!p) { h.active = false; h.px = null; return; }
    if (!h.active) h.vx = h.vz = 0;
    h.active = true;
    h.x = p.x; h.z = p.z;
  }

  update(dt, wave) {
    if (!this.fluid) return; // the base constructor starts the loop before we're set up
    const h = this.dip, f = this.fluid;
    this.uniforms.uTime.value += dt;
    const substeps = 3;
    const simDt = (this.simPerSecond * Math.min(dt, 1 / 30)) / substeps;
    f.params.dt = Math.min(0.2, simDt);
    if (h.active) {
      if (h.px !== null) {
        const k = damp(14, dt);
        h.vx += (Math.max(-2.5, Math.min(2.5, (h.x - h.px) / Math.max(dt, 1e-3))) - h.vx) * k;
        h.vz += (Math.max(-2.5, Math.min(2.5, (h.z - h.pz) / Math.max(dt, 1e-3))) - h.vz) * k;
      }
      h.px = h.x; h.pz = h.z;
      const [cx, , cz] = toCells(h.x, 0, h.z);
      const toSim = 1 / DX / this.simPerSecond; // world units/s → cells per sim time
      f.params.hand = { x: cx, bottom: toCells(0, WL - 0.4, 0)[1], z: cz, r: 0.24 / DX, vx: h.vx * toSim, vy: 0, vz: h.vz * toSim };
    } else f.params.hand = null;
    f.step(substeps);

    const L = f.latest;
    if (L) {
      this.particleAttr.array.set(L.particles);
      this.particleAttr.needsUpdate = true;
      this.particleGeo.setDrawRange(0, f.count);
      this.readSurface(L);
    }
    this.updateSurferFluid(dt);
    void wave;
  }

  /** Column heights and surface flow from the read-back → caustics texture + surfer. */
  readSurface(L) {
    const [GX, , GZ] = GRID;
    const heights = this.colHeights ??= new Float32Array(GX * GZ);
    for (let i = 0; i < GX * GZ; i++) {
      heights[i] = L.heights[i] > 0 ? (L.heights[i] / 1000 - 2) * DX + DX * 0.6 : WL;
      const c = L.flow[i * 3 + 2];
      const toWorld = DX * this.simPerSecond / 10000;
      this.flowCells.vx[i] = c ? (L.flow[i * 3] / c) * toWorld : 0;
      this.flowCells.vz[i] = c ? (L.flow[i * 3 + 1] / c) * toWorld : 0;
    }
    // resample onto the caustics texture grid (160 × 96)
    const d = this.hData, toHalf = THREE.DataUtils.toHalfFloat, NX = 160, NZ = 96;
    for (let j = 0; j < NZ; j++) {
      for (let i = 0; i < NX; i++) {
        const x = ((i + 0.5) / NX) * W - W / 2, z = ((j + 0.5) / NZ) * D - D / 2;
        d[(j * NX + i) * 4] = toHalf(this.surfaceAt(x, z) - WL);
      }
    }
    this.hTex.needsUpdate = true;
  }

  sampleCols(field, x, z) {
    const [GX, , GZ] = GRID;
    let [fx, , fz] = toCells(x, 0, z);
    fx = Math.min(GX - 3.001, Math.max(2, fx - 0.5)); fz = Math.min(GZ - 3.001, Math.max(2, fz - 0.5));
    const i = Math.floor(fx), j = Math.floor(fz), a = fx - i, b = fz - j;
    const at = (ii, jj) => field[ii * GZ + jj];
    return (at(i, j) * (1 - a) + at(i + 1, j) * a) * (1 - b) + (at(i, j + 1) * (1 - a) + at(i + 1, j + 1) * a) * b;
  }

  surfaceAt(x, z) { return this.colHeights ? this.sampleCols(this.colHeights, x, z) : WL; }

  updateSurferFluid(dt) {
    const s = this.surfer;
    const e = DX;
    const sx = (this.surfaceAt(s.x + e, s.z) - this.surfaceAt(s.x - e, s.z)) / (2 * e);
    const sz = (this.surfaceAt(s.x, s.z + e) - this.surfaceAt(s.x, s.z - e)) / (2 * e);
    const fu = this.sampleCols(this.flowCells.vx, s.x, s.z), fv = this.sampleCols(this.flowCells.vz, s.x, s.z);
    s.vx += (-2.2 * sx + (fu - s.vx) * 2.5) * dt;
    s.vz += (-2.2 * sz + (fv - s.vz) * 2.5) * dt;
    s.x += s.vx * dt; s.z += s.vz * dt;
    const mx = W / 2 - 0.2, mz = D / 2 - 0.12;
    if (Math.abs(s.x) > mx) { s.x = Math.sign(s.x) * mx; s.vx *= -0.35; }
    if (Math.abs(s.z) > mz) { s.z = Math.sign(s.z) * mz; s.vz *= -0.35; }
    s.y += (this.surfaceAt(s.x, s.z) + 0.005 - s.y) * damp(14, dt);
    s.n.lerp(new THREE.Vector3(-sx, 1, -sz).normalize(), damp(8, dt));
    const speed = Math.hypot(s.vx, s.vz);
    if (speed > 0.06) {
      let dd = Math.atan2(-s.vz, s.vx) - s.yaw;
      dd = Math.atan2(Math.sin(dd), Math.cos(dd));
      s.yaw += dd * Math.min(1, dt * 2.5 * Math.min(1, speed * 2));
    }
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), s.n);
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.yaw));
    s.g.quaternion.slerp(q, damp(12, dt));
    s.g.position.set(s.x, s.y, s.z);
    s.wobble += dt * (3 + speed * 6);
    s.rider.rotation.x = Math.sin(s.wobble) * Math.min(0.25, Math.hypot(sx, sz) * 0.8);
  }

  // ---------- drawing ----------

  draw() {
    const r = this.renderer, cam = this.camera;
    if (!this.sceneRT || !this.fluid.latest) { super.draw(); return; }
    const clear = r.getClearColor(new THREE.Color()), alpha = r.getClearAlpha();
    // 1. everything but the glass, into a texture (colour + depth)
    r.shadowMap.needsUpdate = true;
    cam.layers.set(0);
    r.setRenderTarget(this.sceneRT);
    r.clear();
    r.render(this.scene, cam);
    r.shadowMap.autoUpdate = false;
    // 2. particle spheres → nearest view-space depth
    r.setClearColor(0x000000, 0);
    r.setRenderTarget(this.depthRT);
    r.clear();
    r.render(this.depthScene, cam);
    // 3. thickness + whitewater
    r.setRenderTarget(this.thickRT);
    r.clear();
    r.render(this.thickScene, cam);
    // 4. smooth the depth so the spheres merge into one surface
    const [hw, hh] = this.halfSize;
    // two rounds of the separable filter: one leaves the sphere bumps showing
    let src = this.depthRT;
    for (let it = 0; it < 2; it++) {
      this.blurMat.uniforms.tDepth.value = src.texture;
      this.blurMat.uniforms.uDir.value.set(1 / hw, 0);
      r.setRenderTarget(this.blurRT);
      r.render(this.blurScene, this.quadCam);
      this.blurMat.uniforms.tDepth.value = this.blurRT.texture;
      this.blurMat.uniforms.uDir.value.set(0, 1 / hh);
      r.setRenderTarget(this.blurRT2);
      r.render(this.blurScene, this.quadCam);
      src = this.blurRT2;
    }
    // 5. shade the water over the scene, to the screen
    const u = this.compositeMat.uniforms;
    u.tScene.value = this.sceneRT.texture;
    u.tSceneDepth.value = this.sceneRT.depthTexture;
    u.tFluid.value = this.blurRT2.texture;
    u.tThick.value = this.thickRT.texture;
    u.uProjInv.value.copy(cam.projectionMatrixInverse);
    u.uProj.value.copy(cam.projectionMatrix);
    u.uViewInv.value.copy(cam.matrixWorld);
    u.uNear.value = cam.near; u.uFar.value = cam.far;
    u.uLight.value.copy(this.keyLight.position).sub(this.keyLight.target.position).normalize().transformDirection(cam.matrixWorldInverse);
    r.setClearColor(clear, alpha);
    r.setRenderTarget(null);
    r.clear();
    r.render(this.compositeScene, this.quadCam);
    // 6. the glass on top
    r.autoClear = false;
    cam.layers.set(1);
    r.render(this.scene, cam);
    cam.layers.set(0);
    r.autoClear = true;
    r.shadowMap.autoUpdate = true;
  }
}
