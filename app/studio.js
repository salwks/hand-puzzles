// Photo-studio lighting and a pale desk, shared by the scenes that show glossy plastic pieces
// (주차장 탈출, 레이저 미로). A studio HDRI (Poly Haven "Studio Small 09", CC0) lights the scene and
// is what the clear coat reflects; the stage's lamp stays only as a faint key for soft contact
// shadows. Neutral tone mapping keeps colours clean (ACES flattened them to haze), and no fog.
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export function studioLight(stage, { lampScale = 4.6, envIntensity = 0.75 } = {}) {
  const key = stage.keyLight;
  key.shadow.mapSize.set(2048, 2048);
  stage.setLampScale(lampScale);
  key.intensity *= 0.3;
  key.position.set(-1.6, 11, 2.4); // nearly overhead: short shadows that don't hide the next piece
  key.target.position.set(0.3, 0, 0);
  key.angle = 0.75;
  key.color.set(0xffffff);
  key.penumbra = 1;
  stage.lights.rim.intensity = 0;
  stage.lights.bounce.intensity = 0;
  stage.renderer.toneMapping = THREE.NeutralToneMapping;
  stage.renderer.toneMappingExposure = 1.0;
  stage.scene.fog = null;
  stage.scene.environmentIntensity = envIntensity;
  new RGBELoader().load('assets/hdri/studio_small_09_1k.hdr', (hdr) => {
    const pmrem = new THREE.PMREMGenerator(stage.renderer);
    stage.scene.environment = pmrem.fromEquirectangular(hdr).texture;
    stage.scene.environmentRotation = new THREE.Euler(0, 0.9, 0); // softboxes up and to the left, like the lamp
    hdr.dispose();
    pmrem.dispose();
  });
}

/**
 * The pieces sit on a pale matte desk, as in photos of the real games. The desk is lightest in
 * the middle and darkens towards the edges of the view, so the HUD in the corners stays readable.
 */
export function lightDesk(stage, { centre = '#d9d3c8', mid = '#cfc8bb' } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(512, 512, 0, 512, 512, 512);
  // the plane is 90 units across: the light patch is ~14 units wide, fading out by ~40
  grd.addColorStop(0, centre); grd.addColorStop(0.1, mid); grd.addColorStop(0.2, '#6f6a62');
  grd.addColorStop(0.32, '#1c1a17'); grd.addColorStop(0.45, '#0d0c0a'); grd.addColorStop(1, '#0d0c0a');
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  stage.table.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, envMapIntensity: 0.4 });
  stage.table.position.y = -0.002;
}
