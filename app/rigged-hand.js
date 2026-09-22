// Realistic hand: the WebXR "generic-hand" skinned mesh (MIT, @webxr-input-profiles/assets)
// posed from MediaPipe landmarks. MediaPipe gives joint positions only, so bone rotations
// are rebuilt: one rigid rotation for the palm, then each finger segment is swung from
// where the palm rotation leaves it to the direction its landmarks point in.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Finger chains: bone names paired with the MediaPipe landmark at each bone's joint.
const CHAINS = [
  { bones: ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'], lm: [1, 2, 3, 4] },
  ...['index', 'middle', 'ring', 'pinky'].map((finger, f) => ({
    bones: ['phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'].map((part) => `${finger}-finger-${part}`),
    lm: [5, 6, 7, 8].map((i) => i + f * 4),
  })),
];

const v = () => new THREE.Vector3();
const tmp = { a: v(), b: v(), n: v(), y: v(), dir: v(), from: v(), m: new THREE.Matrix4() };

/** Orthonormal frame of a palm from wrist, middle knuckle, index knuckle and pinky knuckle. */
function palmBasis(wrist, middle, index, pinky, out) {
  tmp.a.subVectors(middle, wrist).normalize();
  tmp.b.subVectors(index, pinky);
  tmp.n.crossVectors(tmp.a, tmp.b).normalize();
  tmp.y.crossVectors(tmp.n, tmp.a);
  return out.setFromRotationMatrix(tmp.m.makeBasis(tmp.a, tmp.y, tmp.n));
}

const KNUCKLE_TO_TIP = [[5, 8], [9, 12], [13, 16], [17, 20]];

/**
 * How far the fingers and thumb lean out of the palm plane, along the palm frame's normal.
 * They only ever lean towards the palm, so the sign of this value tells a left
 * hand from a right one without trusting MediaPipe's (mirror-dependent) label.
 */
function curl(points, basis) {
  tmp.n.set(0, 0, 1).applyQuaternion(basis);
  let sum = 0;
  for (const [knuckle, tip] of KNUCKLE_TO_TIP) sum += tmp.dir.subVectors(points[tip], points[knuckle]).normalize().dot(tmp.n);
  // The thumb always sits on the palm side too, and is the strongest cue when the fingers are straight.
  const thumb = tmp.dir.subVectors(points[4], points[0]).dot(tmp.n) / (points[9].distanceTo(points[0]) || 1);
  return sum / KNUCKLE_TO_TIP.length + thumb * 0.5;
}

class Rig {
  constructor(gltf, material) {
    this.root = gltf.scene;
    this.bones = new Map();
    this.root.traverse((node) => {
      if (node.isBone) this.bones.set(node.name, node);
      if (node.isSkinnedMesh) {
        node.material = material;
        node.castShadow = true;
        node.frustumCulled = false; // bones move far from the bind pose's bounds
      }
    });
    this.rest = new Map([...this.bones].map(([name, bone]) => [name, { p: bone.position.clone(), q: bone.quaternion.clone() }]));
    const rest = (name) => this.rest.get(name).p;
    this.palmLength = rest('middle-finger-phalanx-proximal').distanceTo(rest('wrist'));
    this.restBasisInv = palmBasis(rest('wrist'), rest('middle-finger-phalanx-proximal'),
      rest('index-finger-phalanx-proximal'), rest('pinky-finger-phalanx-proximal'), new THREE.Quaternion()).invert();
    const restPoints = [];
    restPoints[0] = rest('wrist');
    restPoints[4] = rest('thumb-tip');
    ['index', 'middle', 'ring', 'pinky'].forEach((finger, f) => {
      restPoints[5 + f * 4] = rest(`${finger}-finger-phalanx-proximal`);
      restPoints[8 + f * 4] = rest(`${finger}-finger-tip`);
    });
    this.restCurl = curl(restPoints, this.restBasisInv.clone().invert());
    this.chainBones = new Set(CHAINS.flatMap((c) => c.bones.slice(1)));
  }

  /** points: 21 landmark positions in any right-handed space whose axes match the rig's parent. */
  pose(points) {
    const palm = palmBasis(points[0], points[9], points[5], points[17], new THREE.Quaternion()).multiply(this.restBasisInv);
    const wristRest = this.rest.get('wrist').p;

    // Everything not further down a finger moves rigidly with the palm.
    for (const [name, bone] of this.bones) {
      if (this.chainBones.has(name)) continue;
      const rest = this.rest.get(name);
      bone.position.copy(rest.p).sub(wristRest).applyQuaternion(palm).add(wristRest);
      bone.quaternion.copy(palm).multiply(rest.q);
    }

    const swing = new THREE.Quaternion();
    for (const { bones, lm } of CHAINS) {
      for (let j = 0; j < 3; j++) {
        const bone = this.bones.get(bones[j]);
        const next = this.bones.get(bones[j + 1]);
        const restA = this.rest.get(bones[j]), restB = this.rest.get(bones[j + 1]);
        tmp.from.subVectors(restB.p, restA.p);
        const length = tmp.from.length();
        tmp.from.normalize().applyQuaternion(palm);
        tmp.dir.subVectors(points[lm[j + 1]], points[lm[j]]).normalize();
        swing.setFromUnitVectors(tmp.from, tmp.dir);
        bone.quaternion.copy(swing).multiply(palm).multiply(restA.q);
        // Keep the model's own segment lengths so the skin never stretches.
        next.position.copy(bone.position).addScaledVector(tmp.dir, length);
        if (j === 2) next.quaternion.copy(swing).multiply(palm).multiply(restB.q);
      }
    }
  }

  /** Midpoint of thumb and index tips, in rig units. */
  pinchPoint(out) {
    return out.addVectors(this.bones.get('thumb-tip').position, this.bones.get('index-finger-tip').position).multiplyScalar(0.5);
  }
}

export class RiggedHand {
  constructor(palmWorld) {
    this.palmWorld = palmWorld;
    this.group = new THREE.Group();
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xd9a183, roughness: 0.58, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xffc9b0,
      transparent: true, opacity: 0.93, // barely see-through: just enough to keep the piece colours readable
    });
    this.rigs = {};
    this.basis = new THREE.Quaternion();
    this.curl = 0;
    this.side = null; // decided from finger curl once it is unambiguous
    this.points = Array.from({ length: 21 }, v);
    const loader = new GLTFLoader();
    for (const side of ['left', 'right']) {
      loader.load(`assets/hand-${side}.glb`, (gltf) => {
        const rig = new Rig(gltf, this.material);
        rig.root.visible = false;
        this.group.add(rig.root);
        this.rigs[side] = rig;
      }, undefined, (err) => console.warn(`hand model (${side}) failed to load; using the simple hand`, err));
    }
  }

  ready(side) {
    return Boolean(this.rigs[side]);
  }

  hide() {
    this.curl = 0;
    this.side = null;
    for (const rig of Object.values(this.rigs)) rig.root.visible = false;
  }

  /** Picks the model whose fingers curl the same way as the tracked hand; `label` decides when flat. */
  resolveSide(points, label) {
    const c = curl(points, palmBasis(points[0], points[9], points[5], points[17], this.basis));
    this.curl += (c - this.curl) * 0.2;
    if (Math.abs(this.curl) > 0.12) {
      const match = Object.keys(this.rigs).find((side) => Math.sign(this.rigs[side].restCurl) === Math.sign(this.curl));
      if (match) this.side = match;
    }
    return this.rigs[this.side ?? label] ? (this.side ?? label) : label;
  }

  /** offsets: 21 world-space landmark offsets (any origin); anchor: where the pinch point goes. */
  update(offsets, anchor, label) {
    const side = this.resolveSide(offsets, label);
    const rig = this.rigs[side];
    const scale = this.palmWorld / rig.palmLength;
    offsets.forEach((o, i) => this.points[i].copy(o).divideScalar(scale));
    rig.pose(this.points);
    for (const [name, other] of Object.entries(this.rigs)) other.root.visible = name === side;
    this.group.scale.setScalar(scale);
    this.group.position.copy(anchor).addScaledVector(rig.pinchPoint(tmp.a), -scale);
  }
}
