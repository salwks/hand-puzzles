// Procedural 3D chess pieces (1 unit = 1 board square). Each piece is a group of
// meshes sharing one material, so it can be faded as a whole when captured.
import * as THREE from 'three';
import { ivoryMaps } from './materials.js';

const SEGMENTS = 48;

const foot = (R) => [[0, 0], [R, 0], [R, 0.05], [R * 0.92, 0.08], [R * 0.8, 0.1], [R * 0.62, 0.14]];

const PROFILES = {
  P: [...foot(0.27), [0.13, 0.22], [0.09, 0.36], [0.085, 0.44], [0.16, 0.47], [0.16, 0.49], [0.07, 0.52], [0, 0.52]],
  R: [...foot(0.29), [0.17, 0.22], [0.15, 0.52], [0.2, 0.58], [0.22, 0.6], [0.22, 0.74], [0.15, 0.74], [0.15, 0.68], [0, 0.68]],
  B: [...foot(0.28), [0.12, 0.24], [0.085, 0.46], [0.08, 0.54], [0.17, 0.57], [0.17, 0.59], [0.08, 0.62], [0, 0.62]],
  Q: [...foot(0.3), [0.13, 0.26], [0.09, 0.52], [0.085, 0.66], [0.17, 0.69], [0.17, 0.71], [0.1, 0.74], [0.12, 0.84],
    [0.19, 0.94], [0.15, 0.94], [0.1, 0.88], [0, 0.88]],
  K: [...foot(0.31), [0.14, 0.28], [0.1, 0.56], [0.095, 0.7], [0.18, 0.73], [0.18, 0.75], [0.11, 0.78], [0.13, 0.88],
    [0.19, 0.98], [0.17, 1.0], [0, 1.02]],
  N: [...foot(0.29), [0.2, 0.19], [0.21, 0.23], [0.19, 0.26], [0, 0.26]],
};

export const HEIGHTS = { P: 0.74, R: 0.82, N: 0.95, B: 0.99, Q: 1.07, K: 1.22 };

const lathe = (profile) =>
  new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), SEGMENTS);

function sphere(r, y, scaleY = 1) {
  const g = new THREE.SphereGeometry(r, 32, 24);
  g.scale(1, scaleY, 1);
  g.translate(0, y, 0);
  return g;
}

function box(w, h, d, x, y, z, rotY = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.rotateY(rotY);
  g.translate(x, y, z);
  return g;
}

function knightHead() {
  // Side silhouette (x = forward, y = up), extruded and bevelled.
  const s = new THREE.Shape();
  s.moveTo(-0.17, 0);
  s.lineTo(0.19, 0);
  s.quadraticCurveTo(0.2, 0.14, 0.1, 0.25); // chest
  s.quadraticCurveTo(0.06, 0.31, 0.1, 0.33); // throat
  s.lineTo(0.24, 0.27); // jaw
  s.quadraticCurveTo(0.31, 0.27, 0.3, 0.34); // muzzle
  s.lineTo(0.27, 0.4);
  s.quadraticCurveTo(0.2, 0.52, 0.1, 0.57); // forehead
  s.lineTo(0.09, 0.68); // ear
  s.lineTo(0.01, 0.6);
  s.quadraticCurveTo(-0.14, 0.56, -0.19, 0.36); // mane
  s.quadraticCurveTo(-0.22, 0.16, -0.17, 0);
  const depth = 0.1;
  const g = new THREE.ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 4, curveSegments: 16,
  });
  g.translate(0, 0.25, -depth / 2);
  g.rotateY(Math.PI * 0.85); // face away from the player, slightly turned
  return g;
}

function parts(type) {
  const list = [lathe(PROFILES[type])];
  switch (type) {
    case 'P':
      list.push(sphere(0.125, 0.61));
      break;
    case 'R':
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        list.push(box(0.12, 0.08, 0.075, Math.sin(a) * 0.185, 0.78, Math.cos(a) * 0.185, a));
      }
      break;
    case 'B':
      list.push(sphere(0.12, 0.76, 1.45), sphere(0.042, 0.95));
      break;
    case 'Q':
      list.push(sphere(0.115, 0.9, 0.8), sphere(0.045, 1.02));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const g = sphere(0.036, 0.955);
        g.translate(Math.sin(a) * 0.175, 0, Math.cos(a) * 0.175);
        list.push(g);
      }
      break;
    case 'K':
      list.push(box(0.055, 0.2, 0.055, 0, 1.11, 0), box(0.16, 0.055, 0.055, 0, 1.13, 0));
      break;
    case 'N':
      list.push(knightHead());
      break;
  }
  return list;
}

const cache = new Map();

/** @returns {{ body: THREE.Group, material: THREE.Material, height: number }} */
export function buildPiece(type) {
  if (!cache.has(type)) cache.set(type, parts(type));
  // Polished ivory: a soft, uneven sheen rather than a hard plastic highlight.
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xe2d0aa, ...ivoryMaps(), roughness: 0.55, metalness: 0,
    clearcoat: 0.55, clearcoatRoughness: 0.22, sheen: 0.25, sheenRoughness: 0.6, sheenColor: 0xfff1d6,
  });
  const body = new THREE.Group();
  for (const geometry of cache.get(type)) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    body.add(mesh);
  }
  return { body, material, height: HEIGHTS[type] };
}
