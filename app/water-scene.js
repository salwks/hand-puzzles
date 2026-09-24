// A glass aquarium full of water on the table. The surface and the water's cut faces behind
// the glass are displaced by the simulation each frame and drawn with physically based
// transmission (refraction, depth tint, reflections); foam is laced onto the surface where
// the sim carries it; light focused by the waves plays on the tiled floor as caustics.
// Spray flies off steep crests, bubbles rise where a hand churns, and a toy surfer rides it all.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Stage, NO_GLOW, damp } from './stage.js';
import { WaterSim } from './water-sim.js';

export const W = 4, D = 2.4; // inner width (x) and depth (z) of the tank
export const WL = 0.6; // rest water level above the tank floor
const TANK_H = 1.05, GLASS = 0.03;
const NX = 160, NZ = 96;

// ---------- textures ----------

/** Tileable bubbly lace for the foam: soft rings of many sizes. */
function foamTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, 256, 256);
  for (let n = 0; n < 420; n++) {
    const x = Math.random() * 256, y = Math.random() * 256, r = 2 + Math.random() ** 2 * 16;
    for (const [ox, oy] of [[0, 0], [256, 0], [-256, 0], [0, 256], [0, -256]]) {
      const grd = g.createRadialGradient(x + ox, y + oy, r * 0.55, x + ox, y + oy, r);
      grd.addColorStop(0, 'rgba(255,255,255,0.05)');
      grd.addColorStop(0.75, `rgba(255,255,255,${0.35 + Math.random() * 0.4})`);
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Pale pool tiles with grout, so the caustics have something to dance on. */
function tileTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  const n = 8, s = 512 / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const l = 86 + Math.random() * 6;
      g.fillStyle = `hsl(${188 + Math.random() * 8}, 32%, ${l}%)`;
      g.fillRect(i * s, j * s, s, s);
    }
  }
  g.strokeStyle = 'rgba(120,140,140,0.55)';
  g.lineWidth = 4;
  for (let i = 0; i <= n; i++) {
    g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, 512); g.stroke();
    g.beginPath(); g.moveTo(0, i * s); g.lineTo(512, i * s); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(W / 0.9, D / 0.9);
  t.anisotropy = 8;
  return t;
}

/**
 * Wind-chop detail: a tileable height field of many small crossing waves, turned into a
 * normal map. Laid over the simulated swell it makes the water read as a large body.
 */
function chopTexture() {
  const N = 256;
  const hgt = new Float32Array(N * N);
  const waves = [];
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, f = 2 + Math.floor(Math.random() ** 1.6 * 22);
    waves.push([Math.round(Math.cos(a) * f), Math.round(Math.sin(a) * f), Math.random() * 6.28, 1 / f]);
  }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let v = 0;
    for (const [kx, ky, ph, amp] of waves) v += Math.sin((kx * x + ky * y) / N * 6.2832 + ph) * amp;
    hgt[y * N + x] = v;
  }
  const c = document.createElement('canvas');
  c.width = c.height = N;
  const img = c.getContext('2d').createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = hgt[y * N + ((x + 1) % N)] - hgt[y * N + ((x + N - 1) % N)];
    const dy = hgt[((y + 1) % N) * N + x] - hgt[((y + N - 1) % N) * N + x];
    const k = (y * N + x) * 4;
    img.data[k] = 128 + Math.max(-127, Math.min(127, -dx * 60));
    img.data[k + 1] = 128 + Math.max(-127, Math.min(127, -dy * 60));
    img.data[k + 2] = 255; img.data[k + 3] = 255;
  }
  c.getContext('2d').putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const SIM_UNIFORMS = `
uniform sampler2D hTex;
uniform vec2 uSize;
uniform vec2 uTexel;
uniform float uDx;
`;

export class WaterScene extends Stage {
  constructor(canvas) {
    super(canvas);
    this.sim = new WaterSim(NX, NZ, W, D);
    this.bloomThreshold = 1.4;
    this.hData = new Uint16Array(NX * NZ * 4);
    this.hTex = new THREE.DataTexture(this.hData, NX, NZ, THREE.RGBAFormat, THREE.HalfFloatType);
    this.hTex.magFilter = this.hTex.minFilter = THREE.LinearFilter;
    this.hTex.needsUpdate = true;
    this.foamTex = foamTexture();
    this.uniforms = {
      hTex: { value: this.hTex },
      foamTex: { value: this.foamTex },
      chopTex: { value: chopTexture() },
      uSize: { value: new THREE.Vector2(W, D) },
      uTexel: { value: new THREE.Vector2(1 / NX, 1 / NZ) },
      uDx: { value: W / NX },
      uTime: { value: 0 },
    };
    this.dip = { active: false, x: 0, z: 0, vx: 0, vz: 0, px: null, pz: null };
    // water and glass reflect a lit room (the stage's own environment is kept dim for the table)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.roomEnv = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.buildRoom();
    this.buildTank();
    this.buildWater();
    this.buildFloor();
    this.buildSpray();
    this.buildBubbles();
    this.buildSurfer();
    this.setLampScale(3.2);
    this.scene.environmentIntensity = 0.55;
    this.hand.setSize(0.45); // a hand in scale with a pool-sized body of water
    this.start();
  }

  buildRoom() {
    const fill = new THREE.DirectionalLight(0xffe9cc, 0.6);
    fill.position.set(6, 5, 4);
    const front = new THREE.DirectionalLight(0xfff4e4, 0.35);
    front.position.set(0, 3, 9);
    const back = new THREE.DirectionalLight(0xbfd8ee, 0.45);
    back.position.set(-2, 4, -8);
    this.scene.add(fill, front, back, new THREE.HemisphereLight(0x6a7480, 0x2c2a26, 0.5));
  }

  buildTank() {
    const tank = new THREE.Group();
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xe6f4f1, transparent: true, opacity: 0.1, roughness: 0.03, metalness: 0,
      clearcoat: 1, clearcoatRoughness: 0.02, envMap: this.roomEnv, envMapIntensity: 0.9, depthWrite: false,
    });
    const pane = (w, h, d, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glass);
      m.position.set(x, y, z);
      m.renderOrder = 2;
      tank.add(m);
    };
    const hw = W / 2 + GLASS / 2, hd = D / 2 + GLASS / 2;
    pane(W + GLASS * 2, TANK_H, GLASS, 0, TANK_H / 2, hd);
    pane(W + GLASS * 2, TANK_H, GLASS, 0, TANK_H / 2, -hd);
    pane(GLASS, TANK_H, D, hw, TANK_H / 2, 0);
    pane(GLASS, TANK_H, D, -hw, TANK_H / 2, 0);
    // black trim: a base and a top rim, like a real aquarium
    // transparent (fully opaque) keeps the trim out of the water's refraction pass: no ghost bar in the surface
    const trim = new THREE.MeshPhysicalMaterial({ color: 0x111416, roughness: 0.35, clearcoat: 0.6, transparent: true, opacity: 1 });
    const base = new THREE.Mesh(new RoundedBoxGeometry(W + 0.16, 0.12, D + 0.16, 3, 0.02), trim);
    base.position.y = -0.06;
    base.castShadow = base.receiveShadow = true;
    tank.add(base);
    for (const [w, d, x, z] of [[W + 0.16, 0.08, 0, D / 2 + 0.04], [W + 0.16, 0.08, 0, -D / 2 - 0.04], [0.08, D + 0.16, W / 2 + 0.04, 0], [0.08, D + 0.16, -W / 2 - 0.04, 0]]) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), trim);
      r.position.set(x, TANK_H, z); // no shadow: a rim's shadow across the floor reads as a stripe in the water
      tank.add(r);
    }
    // silicone seams on the vertical edges
    const seam = new THREE.MeshStandardMaterial({ color: 0x2c3a38, roughness: 0.6, transparent: true, opacity: 0.55 });
    for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.03, TANK_H, 0.03), seam);
      m.position.set(x * (W / 2 + 0.005), TANK_H / 2, z * (D / 2 + 0.005));
      tank.add(m);
    }
    const bg = document.createElement('canvas');
    bg.width = 4; bg.height = 256;
    const g = bg.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#9fd3de'); grd.addColorStop(0.55, '#3f8fa6'); grd.addColorStop(1, '#173b4f');
    g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
    const bgTex = new THREE.CanvasTexture(bg);
    bgTex.colorSpace = THREE.SRGBColorSpace;
    const backing = new THREE.Mesh(new THREE.PlaneGeometry(W + GLASS * 2, TANK_H), new THREE.MeshStandardMaterial({ map: bgTex, roughness: 0.9 }));
    backing.position.set(0, TANK_H / 2, -D / 2 - GLASS - 0.004);
    tank.add(backing);
    this.scene.add(tank);
  }

  waterMaterial({ thickness, surface }) {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 1, roughness: 0.035, metalness: 0, ior: 1.333,
      thickness, attenuationColor: new THREE.Color(0x1f8a96), attenuationDistance: 0.85,
      specularIntensity: 1, envMapIntensity: 1.0, envMap: this.roomEnv,
    });
    const U = this.uniforms;
    m.customProgramCacheKey = () => (surface ? 'water-surface' : 'water-face');
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, U);
      shader.vertexShader = SIM_UNIFORMS + 'varying vec2 vWUv;\nattribute float aTop;\n' + shader.vertexShader;
      shader.fragmentShader = SIM_UNIFORMS + 'uniform sampler2D foamTex;\nuniform sampler2D chopTex;\nuniform float uTime;\nvarying vec2 vWUv;\n' + shader.fragmentShader;
      if (surface) {
        // small chop riding on the swell, stronger where the water is rough
        shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
          #include <normal_fragment_maps>
          {
            float hC = texture2D(hTex, vWUv).r;
            float rough = clamp(abs(texture2D(hTex, vWUv + vec2(uTexel.x * 2.0, 0.0)).r - texture2D(hTex, vWUv - vec2(uTexel.x * 2.0, 0.0)).r)
                              + abs(texture2D(hTex, vWUv + vec2(0.0, uTexel.y * 2.0)).r - texture2D(hTex, vWUv - vec2(0.0, uTexel.y * 2.0)).r), 0.0, 0.06) / 0.06;
            vec2 c1 = texture2D(chopTex, vWUv * vec2(3.0, 1.8) + vec2(uTime * 0.012, uTime * 0.007)).xy * 2.0 - 1.0;
            vec2 c2 = texture2D(chopTex, vWUv * vec2(7.0, 4.2) - vec2(uTime * 0.009, -uTime * 0.013)).xy * 2.0 - 1.0;
            vec2 chop = (c1 * 0.6 + c2 * 0.4) * (0.08 + 0.55 * rough + 0.25 * texture2D(hTex, vWUv).g);
            normal = normalize(normal + (viewMatrix * vec4(chop.x, 0.0, chop.y, 0.0)).xyz);
          }`);
        shader.vertexShader = shader.vertexShader
          .replace('#include <beginnormal_vertex>', `
            vec2 wuv = vec2(position.x / uSize.x + 0.5, position.z / uSize.y + 0.5);
            vWUv = wuv;
            float hL = texture2D(hTex, wuv - vec2(uTexel.x, 0.0)).r;
            float hR = texture2D(hTex, wuv + vec2(uTexel.x, 0.0)).r;
            float hD = texture2D(hTex, wuv - vec2(0.0, uTexel.y)).r;
            float hU = texture2D(hTex, wuv + vec2(0.0, uTexel.y)).r;
            vec3 objectNormal = normalize(vec3(-(hR - hL) / (2.0 * uDx), 1.0, -(hU - hD) / (2.0 * uDx)));`)
          .replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed.y += texture2D(hTex, vWUv).r;');
        // foam: lace where the sim has foam, solid where it's thick
        shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
          float fr = texture2D(hTex, vWUv).g;
          float n1 = texture2D(foamTex, vWUv * vec2(9.0, 5.4) + vec2(uTime * 0.004, 0.0)).r;
          float n2 = texture2D(foamTex, vWUv * vec2(21.0, 12.6) - vec2(0.0, uTime * 0.006)).r;
          float lace = n1 * 0.65 + n2 * 0.5;
          float cover = clamp(fr * 2.4, 0.0, 1.0);
          float fa = smoothstep(1.0 - cover, 1.15 - cover * 0.55, lace) * min(1.0, fr * 6.0);
          outgoingLight = mix(outgoingLight, vec3(0.9, 0.95, 0.96), clamp(fa, 0.0, 0.95));
          #include <opaque_fragment>`);
      } else {
        // a cut face behind the glass: its top edge follows the surface
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
          #include <begin_vertex>
          vWUv = vec2(position.x / uSize.x + 0.5, position.z / uSize.y + 0.5);
          if (aTop > 0.5) transformed.y += texture2D(hTex, clamp(vWUv, uTexel * 0.5, 1.0 - uTexel * 0.5)).r;`);
      }
    };
    return m;
  }

  /**
   * The water seen side-on through the glass: see-through and tinted, deeper blue-green
   * towards the bottom, with a bright line where the surface meets the glass.
   */
  faceMaterial() {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0x1f7f8c, transparent: true, opacity: 0.5, roughness: 0.05, metalness: 0,
      depthWrite: false, envMapIntensity: 0.4, side: THREE.DoubleSide,
    });
    const U = this.uniforms;
    m.customProgramCacheKey = () => 'water-face';
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, U);
      shader.vertexShader = SIM_UNIFORMS + 'attribute float aTop;\nvarying float vDepth;\nvarying float vTop;\n' + shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        vec2 fuv = clamp(vec2(position.x / uSize.x + 0.5, position.z / uSize.y + 0.5), uTexel * 0.5, 1.0 - uTexel * 0.5);
        float surf = ${WL.toFixed(3)} + texture2D(hTex, fuv).r;
        if (aTop > 0.5) transformed.y = surf;
        vDepth = surf - transformed.y;
        vTop = aTop;`);
      shader.fragmentShader = 'varying float vDepth;\nvarying float vTop;\n' + shader.fragmentShader.replace('#include <opaque_fragment>', `
        // the body of water side-on: its own colour, bright teal under the surface darkening
        // with depth (the room's reflections would otherwise wash it out to grey)
        float deep = clamp(vDepth / ${WL.toFixed(3)}, 0.0, 1.0);
        outgoingLight = mix(vec3(0.14, 0.5, 0.56), vec3(0.015, 0.13, 0.19), pow(deep, 0.7)) + outgoingLight * 0.08;
        diffuseColor.a = mix(0.55, 0.9, deep);
        // the meniscus: a thin bright line along the waterline
        float edge = smoothstep(0.02, 0.0, vDepth);
        outgoingLight += vec3(0.7, 0.85, 0.9) * edge * 0.8;
        diffuseColor.a = max(diffuseColor.a, edge * 0.9);
        #include <opaque_fragment>`);
    };
    return m;
  }

  buildWater() {
    const geo = new THREE.PlaneGeometry(W, D, NX - 1, NZ - 1);
    geo.rotateX(-Math.PI / 2);
    this.surface = new THREE.Mesh(geo, this.waterMaterial({ thickness: 0.6, surface: true }));
    this.surface.position.y = WL;
    this.surface.receiveShadow = true;
    // the water's faces against the glass: front, left and right
    const face = (a, b, n) => { // a,b: end points of the bottom edge (x,z), n: segments
      const pos = [], top = [], nor = [], idx = [];
      const nx = b[1] - a[1], nz = a[0] - b[0], len = Math.hypot(nx, nz);
      for (let i = 0; i <= n; i++) {
        const x = a[0] + (b[0] - a[0]) * i / n, z = a[1] + (b[1] - a[1]) * i / n;
        pos.push(x, 0.002, z, x, WL, z);
        top.push(0, 1);
        nor.push(nx / len, 0, nz / len, nx / len, 0, nz / len);
        if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('aTop', new THREE.Float32BufferAttribute(top, 1));
      g.setIndex(idx);
      return g;
    };
    const e = 0.004; // just inside the glass
    const faceMat = this.faceMaterial();
    const front = new THREE.Mesh(face([-W / 2 + e, D / 2 - e], [W / 2 - e, D / 2 - e], NX), faceMat);
    const left = new THREE.Mesh(face([-W / 2 + e, -D / 2 + e], [-W / 2 + e, D / 2 - e], NZ), faceMat);
    const right = new THREE.Mesh(face([W / 2 - e, D / 2 - e], [W / 2 - e, -D / 2 + e], NZ), faceMat);
    for (const m of [front, left, right]) m.renderOrder = 1;
    this.scene.add(this.surface, front, left, right);
  }

  buildFloor() {
    const mat = new THREE.MeshStandardMaterial({ map: tileTexture(), roughness: 0.55 });
    const U = this.uniforms;
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, U);
      shader.vertexShader = 'varying vec3 vWp;\n' + shader.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      // Caustics: where the surface curves like a lens it gathers light onto the floor
      // below (bright), where it spreads it the floor dims. The sample point is shifted
      // along the lamp's slant, as the light arrives at an angle.
      shader.fragmentShader = SIM_UNIFORMS + 'varying vec3 vWp;\n' + shader.fragmentShader.replace('#include <opaque_fragment>', `
        vec2 cuv = vec2(vWp.x / uSize.x + 0.5, vWp.z / uSize.y + 0.5) + vec2(-0.035, 0.02);
        vec2 t2 = uTexel * 2.0;
        float c0 = texture2D(hTex, cuv).r;
        float lap = texture2D(hTex, cuv + vec2(t2.x, 0.0)).r + texture2D(hTex, cuv - vec2(t2.x, 0.0)).r
                  + texture2D(hTex, cuv + vec2(0.0, t2.y)).r + texture2D(hTex, cuv - vec2(0.0, t2.y)).r - 4.0 * c0;
        vec2 t1 = uTexel;
        float lap1 = texture2D(hTex, cuv + vec2(t1.x, 0.0)).r + texture2D(hTex, cuv - vec2(t1.x, 0.0)).r
                  + texture2D(hTex, cuv + vec2(0.0, t1.y)).r + texture2D(hTex, cuv - vec2(0.0, t1.y)).r - 4.0 * c0;
        float caust = clamp(1.0 - lap * 42.0 - lap1 * 70.0, 0.25, 3.2);
        outgoingLight *= mix(1.0, caust, 0.8) * vec3(0.82, 0.95, 1.0);
        #include <opaque_fragment>`);
    };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.001;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  // ---------- spray and bubbles ----------

  buildSpray() {
    const N = 900;
    this.spray = { n: N, pos: new Float32Array(N * 3), vel: new Float32Array(N * 3), life: new Float32Array(N), next: 0 };
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.spray.pos, 3));
    const dot = document.createElement('canvas');
    dot.width = dot.height = 32;
    const g = dot.getContext('2d');
    const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.5, 'rgba(230,248,255,0.8)');
    grd.addColorStop(1, 'rgba(230,248,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 32, 32);
    const mat = new THREE.PointsMaterial({ size: 0.035, map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false, color: 0xeaf8ff });
    this.sprayPts = new THREE.Points(geo, mat);
    this.sprayPts.frustumCulled = false;
    this.scene.add(this.sprayPts);
    this.spray.pos.fill(-99);
  }

  emitSpray(x, y, z, vx, vy, vz) {
    const s = this.spray, i = s.next;
    s.next = (i + 1) % s.n;
    s.pos.set([x, y, z], i * 3);
    s.vel.set([vx, vy, vz], i * 3);
    s.life[i] = 1;
  }

  buildBubbles() {
    const N = 220;
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0, emissive: 0x9fd6e0, emissiveIntensity: 0.15, clearcoat: 1 });
    this.bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), mat, N);
    this.bubbles.frustumCulled = false;
    this.bub = { n: N, p: new Float32Array(N * 3), r: new Float32Array(N), alive: new Uint8Array(N), next: 0, phase: new Float32Array(N) };
    const m = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < N; i++) this.bubbles.setMatrixAt(i, m);
    this.scene.add(this.bubbles);
  }

  emitBubble(x, y, z) {
    const b = this.bub, i = b.next;
    b.next = (i + 1) % b.n;
    b.p.set([x, y, z], i * 3);
    b.r[i] = 0.006 + Math.random() ** 2 * 0.02;
    b.alive[i] = 1;
    b.phase[i] = Math.random() * 6;
  }

  // ---------- the surfer ----------

  buildSurfer() {
    // transparent (at full opacity) keeps the toy out of the water's refraction pass, so the
    // surface doesn't show a displaced ghost of it; it's drawn over the water instead
    const toy = (color, rough = 0.35) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 0.8, clearcoatRoughness: 0.2, transparent: true, opacity: 1 });
    const g = new THREE.Group();
    // a capsule lying along x, squashed flat: the board
    const board = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.26, 6, 16), toy(0xf2c94c));
    board.rotation.z = Math.PI / 2;
    const boardWrap = new THREE.Group();
    boardWrap.add(board);
    boardWrap.scale.set(1, 0.22, 1);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.004, 0.012), toy(0xd94f3d));
    stripe.position.y = 0.013;
    const skin = toy(0xe8b48a, 0.5), suit = toy(0x1f5f8b), shorts = toy(0xd94f3d);
    const limb = (r, len, mat) => new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat);
    const legL = limb(0.012, 0.06, suit); legL.position.set(-0.035, 0.05, 0); legL.rotation.z = 0.35;
    const legR = limb(0.012, 0.06, suit); legR.position.set(0.035, 0.05, 0); legR.rotation.z = -0.35;
    const hips = limb(0.02, 0.02, shorts); hips.position.set(0, 0.095, 0); hips.rotation.z = Math.PI / 2;
    const torso = limb(0.022, 0.05, suit); torso.position.set(0.01, 0.14, 0); torso.rotation.z = -0.15;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), skin); head.position.set(0.02, 0.2, 0);
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.023, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), toy(0x3a2416)); hair.position.copy(head.position);
    const armL = limb(0.009, 0.07, skin); armL.position.set(-0.05, 0.15, 0); armL.rotation.z = 1.2;
    const armR = limb(0.009, 0.07, skin); armR.position.set(0.07, 0.16, 0); armR.rotation.z = -1.1;
    const rider = new THREE.Group();
    rider.add(legL, legR, hips, torso, head, hair, armL, armR);
    rider.rotation.y = Math.PI / 2; // stands sideways on the board, facing its right
    g.add(boardWrap, stripe, rider);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    g.scale.setScalar(0.62);
    this.surfer = { g, rider, x: -0.8, z: 0.2, y: WL, vx: 0, vz: 0, yaw: 0, n: new THREE.Vector3(0, 1, 0), wobble: 0 };
    g.position.set(this.surfer.x, WL, this.surfer.z);
    this.scene.add(g);
  }

  updateSurfer(dt) {
    const s = this.surfer, sim = this.sim;
    const [sx, sz] = sim.slopeAt(s.x, s.z);
    const [fu, fv] = sim.flowAt(s.x, s.z);
    // slides down the face of a wave, and is carried along by the water
    const G = 2.6, drag = 2.0;
    s.vx += (-G * sx + (fu - s.vx) * drag) * dt;
    s.vz += (-G * sz + (fv - s.vz) * drag) * dt;
    s.x += s.vx * dt;
    s.z += s.vz * dt;
    const mx = W / 2 - 0.2, mz = D / 2 - 0.12;
    if (Math.abs(s.x) > mx) { s.x = Math.sign(s.x) * mx; s.vx *= -0.35; }
    if (Math.abs(s.z) > mz) { s.z = Math.sign(s.z) * mz; s.vz *= -0.35; }
    // bobs on the surface, tilted to it
    const h = sim.heightAt(s.x, s.z);
    s.y += (WL + h + 0.012 - s.y) * damp(18, dt);
    s.n.lerp(new THREE.Vector3(-sx, 1, -sz).normalize(), damp(10, dt));
    const speed = Math.hypot(s.vx, s.vz);
    if (speed > 0.06) {
      const want = Math.atan2(-s.vz, s.vx);
      let d = want - s.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      s.yaw += d * Math.min(1, dt * 2.5 * Math.min(1, speed * 2));
    }
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), s.n);
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.yaw));
    s.g.quaternion.slerp(q, damp(12, dt));
    s.g.position.set(s.x, s.y, s.z);
    // the rider leans into the ride and wobbles when it gets rough
    s.wobble += dt * (3 + speed * 6);
    s.rider.rotation.x = Math.sin(s.wobble) * Math.min(0.25, Math.hypot(sx, sz) * 0.8);
    // a board moving through water leaves a wake
    if (speed > 0.1) sim.stirrers.push({ x: s.x, z: s.z, vx: s.vx, vz: s.vz, r: 0.1, strength: 0.25, foam: speed > 0.55 ? (speed - 0.55) * 2 : 0 });
  }

  // ---------- hand / pointer in the water ----------

  /**
   * Screen position → a point in the water. Seen almost side-on, a ray to the surface would
   * swing front-to-back on the slightest vertical move, so the screen maps straight onto the
   * tank instead: across the screen is across the tank, down the screen is front-to-back.
   */
  waterPoint(x, y) {
    const l = this.toScreen(-W / 2, WL, 0), r = this.toScreen(W / 2, WL, 0);
    const u = (x - l.x) / (r.x - l.x);
    if (u < -0.05 || u > 1.05) return null;
    const v = Math.min(1, Math.max(0, (y / window.innerHeight - 0.22) / 0.6));
    return new THREE.Vector3((Math.min(1, Math.max(0, u)) - 0.5) * (W - 0.1), WL, (v - 0.5) * (D - 0.1));
  }

  /** Called every frame with the pointer/hand state: in water or not, and where on screen. */
  setStir(active, x, y) {
    const h = this.dip;
    const p = active ? this.waterPoint(x, y) : null;
    if (!p) { h.active = false; h.px = null; return; }
    if (!h.active) { // plunging in
      this.sim.poke(p.x, p.z, 0.16, -0.035);
      this.sim.addFoam(p.x, p.z, 0.14, 0.5);
      for (let i = 0; i < 18; i++) this.emitSpray(p.x, WL + 0.02, p.z, (Math.random() - 0.5) * 0.8, 0.6 + Math.random() * 1.1, (Math.random() - 0.5) * 0.8);
      h.vx = h.vz = 0;
    }
    h.active = true;
    h.x = p.x; h.z = p.z;
  }

  update(dt, wave) {
    const sim = this.sim, h = this.dip;
    this.uniforms.uTime.value += dt;
    // the hand drags the water it moves through; fast strokes churn foam and bubbles
    if (h.active) {
      if (h.px !== null) {
        const k = damp(14, dt);
        h.vx += (Math.max(-2.5, Math.min(2.5, (h.x - h.px) / Math.max(dt, 1e-3))) - h.vx) * k;
        h.vz += (Math.max(-2.5, Math.min(2.5, (h.z - h.pz) / Math.max(dt, 1e-3))) - h.vz) * k;
      }
      h.px = h.x; h.pz = h.z;
      const speed = Math.hypot(h.vx, h.vz);
      sim.stirrers.push({ x: h.x, z: h.z, vx: h.vx, vz: h.vz, r: 0.15, strength: 0.55, foam: speed > 0.35 ? (speed - 0.35) * 9 : 0 });
      if (speed > 0.5 && Math.random() < speed * 0.9) this.emitBubble(h.x + (Math.random() - 0.5) * 0.2, WL - 0.05 - Math.random() * 0.25, h.z + (Math.random() - 0.5) * 0.2);
      if (speed > 1.6 && Math.random() < 0.6) {
        this.emitSpray(h.x, WL + 0.03, h.z, h.vx * 0.5 + (Math.random() - 0.5) * 0.6, 0.8 + Math.random() * speed * 0.5, h.vz * 0.5 + (Math.random() - 0.5) * 0.6);
      }
    }
    this.updateSurfer(dt);
    sim.update(dt);

    // spray off steep crests
    for (const s of sim.spraySpots(8)) {
      if (Math.random() > 0.7) continue;
      const [fu, fv] = sim.flowAt(s.x, s.z);
      const y = WL + sim.heightAt(s.x, s.z);
      for (let k = 0; k < 3; k++) this.emitSpray(s.x, y, s.z, fu * 0.6 + (Math.random() - 0.5) * 0.4, 0.4 + Math.random() * s.s * 0.8, fv * 0.6 + (Math.random() - 0.5) * 0.4);
    }
    const sp = this.spray;
    for (let i = 0; i < sp.n; i++) {
      if (sp.life[i] <= 0) continue;
      const k = i * 3;
      sp.vel[k + 1] -= 4.2 * dt;
      sp.pos[k] += sp.vel[k] * dt; sp.pos[k + 1] += sp.vel[k + 1] * dt; sp.pos[k + 2] += sp.vel[k + 2] * dt;
      const x = sp.pos[k], z = sp.pos[k + 2];
      const inside = Math.abs(x) < W / 2 && Math.abs(z) < D / 2;
      const surf = inside ? WL + sim.heightAt(x, z) : 0;
      if (sp.vel[k + 1] < 0 && sp.pos[k + 1] < surf) { // lands: a tiny ring and a fleck of foam
        if (inside) { sim.poke(x, z, 0.04, -0.003); sim.addFoam(x, z, 0.03, 0.08); }
        sp.life[i] = 0;
        sp.pos[k + 1] = -99;
      }
    }
    this.sprayPts.geometry.attributes.position.needsUpdate = true;

    // bubbles wobble up and pop at the surface
    const b = this.bub, m = new THREE.Matrix4();
    for (let i = 0; i < b.n; i++) {
      if (!b.alive[i]) continue;
      const k = i * 3;
      b.phase[i] += dt * 9;
      b.p[k + 1] += (0.25 + b.r[i] * 18) * dt;
      b.p[k] += Math.sin(b.phase[i]) * 0.03 * dt;
      const [fu, fv] = sim.flowAt(b.p[k], b.p[k + 2]);
      b.p[k] += fu * dt * 0.8; b.p[k + 2] += fv * dt * 0.8;
      const top = WL + sim.heightAt(b.p[k], b.p[k + 2]);
      if (b.p[k + 1] > top - b.r[i]) {
        b.alive[i] = 0;
        sim.addFoam(b.p[k], b.p[k + 2], 0.03, 0.05);
        m.makeScale(0, 0, 0);
      } else m.makeScale(b.r[i], b.r[i], b.r[i]).setPosition(b.p[k], b.p[k + 1], b.p[k + 2]);
      this.bubbles.setMatrixAt(i, m);
    }
    this.bubbles.instanceMatrix.needsUpdate = true;

    // hand the sim's height + foam to the GPU
    const d = this.hData, H = sim.h, F = sim.foam, toHalf = THREE.DataUtils.toHalfFloat;
    for (let i = 0, n = NX * NZ; i < n; i++) { d[i * 4] = toHalf(H[i]); d[i * 4 + 1] = toHalf(F[i]); }
    this.hTex.needsUpdate = true;
    void wave;
  }

  frameCamera(aspect) {
    const el = THREE.MathUtils.degToRad(10); // nearly level with the tank, just above the waterline
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const forWidth = (W / 2 + 0.9) / (tanV * aspect);
    const forHeight = 1.5 / tanV;
    const dist = Math.max(forWidth, forHeight);
    this.camera.position.set(0, 0.62 + Math.sin(el) * dist, Math.cos(el) * dist);
    this.camera.lookAt(0, 0.62, 0);
  }

  handAnchor() {
    if (!this.dip.active) return this.pointOnPlane(this.pointer.x, this.pointer.y, WL + 0.3);
    return new THREE.Vector3(this.dip.x, WL + 0.02, this.dip.z);
  }

  handGlow() { return NO_GLOW; }
}
