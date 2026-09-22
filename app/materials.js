// Procedural PBR materials. Every surface gets a colour map plus a matching height
// (bump) and roughness variation, because flat colour under good lighting is what
// makes a render look like plastic.
import * as THREE from 'three';

function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}

function texture(c, srgb) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}

/**
 * Wood: long wavy grain lines, broad tonal bands and short dark pores. The same
 * strokes are drawn into a grey height map so the grain catches the light.
 */
export function woodMaps(base, grain, seed, { pores = 160, highlights = true } = {}) {
  const SIZE = 512;
  const [colorCanvas, color] = canvas(SIZE);
  const [heightCanvas, height] = canvas(SIZE);
  const rnd = seeded(seed);
  color.fillStyle = base;
  color.fillRect(0, 0, SIZE, SIZE);
  height.fillStyle = '#808080';
  height.fillRect(0, 0, SIZE, SIZE);

  // broad bands of slightly different tone (growth rings cut lengthwise)
  for (let i = 0; i < 9; i++) {
    const x = rnd() * SIZE, w = 30 + rnd() * 90;
    color.globalAlpha = 0.05 + rnd() * 0.08;
    // Pale bands suit blond and brown woods; on ebony they read as grey stripes, so it gets dark ones only.
    color.fillStyle = rnd() > 0.5 || !highlights ? grain : '#ffffff';
    color.fillRect(x, 0, w, SIZE);
  }

  const stroke = (ctx, x, drift, width, style, alpha) => {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, -4);
    ctx.bezierCurveTo(x + drift[0], SIZE / 3, x + drift[1], (SIZE * 2) / 3, x + drift[2], SIZE + 4);
    ctx.stroke();
  };
  for (let i = 0; i < 220; i++) {
    const x = rnd() * SIZE;
    const drift = [rnd() * 26 - 13, rnd() * 26 - 13, rnd() * 18 - 9];
    const width = 0.5 + rnd() * 2.4;
    const alpha = 0.04 + rnd() * 0.17;
    stroke(color, x, drift, width, grain, alpha);
    stroke(height, x, drift, width, '#303030', alpha * 1.6);
  }
  for (let i = 0; i < pores; i++) {
    const x = rnd() * SIZE, y = rnd() * SIZE, len = 4 + rnd() * 16;
    for (const [ctx, style, alpha] of [[color, grain, 0.35], [height, '#000000', 0.5]]) {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = style;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + rnd() * 1.5 - 0.75, y + len);
      ctx.stroke();
    }
  }
  return { map: texture(colorCanvas, true), bumpMap: texture(heightCanvas, false) };
}

/** Lacquered wood: the clearcoat gives the sharp varnish reflection over the softer grain. */
export function lacqueredWood(maps, { offset = [0, 0], repeat = 0.5, roughness = 0.5, clearcoat = 0.7 } = {}) {
  const map = maps.map.clone();
  const bumpMap = maps.bumpMap.clone();
  for (const t of [map, bumpMap]) {
    t.offset.set(...offset);
    t.repeat.set(repeat, repeat);
  }
  return new THREE.MeshPhysicalMaterial({
    map, bumpMap, bumpScale: 0.6, roughness, clearcoat, clearcoatRoughness: 0.12,
  });
}

let ivory = null;
/** Turned-ivory look: faint vertical grain (Schreger-like streaks) and an uneven polish. */
export function ivoryMaps() {
  if (ivory) return ivory;
  const SIZE = 256;
  const [colorCanvas, color] = canvas(SIZE);
  const [roughCanvas, rough] = canvas(SIZE);
  const rnd = seeded(91);
  color.fillStyle = '#ffffff';
  color.fillRect(0, 0, SIZE, SIZE);
  rough.fillStyle = '#9a9a9a';
  rough.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 140; i++) {
    const x = rnd() * SIZE, w = 0.6 + rnd() * 2.5;
    color.globalAlpha = 0.012 + rnd() * 0.028; // barely there: ivory is nearly uniform, unlike wood
    color.fillStyle = rnd() > 0.35 ? '#a88a55' : '#ffffff';
    color.fillRect(x, 0, w, SIZE);
    rough.globalAlpha = 0.08 + rnd() * 0.12;
    rough.fillStyle = rnd() > 0.5 ? '#ffffff' : '#404040';
    rough.fillRect(x, 0, w * 2, SIZE);
  }
  ivory = { map: texture(colorCanvas, true), roughnessMap: texture(roughCanvas, false) };
  return ivory;
}

/** Dark leather table top: fine pebbled grain, almost no sheen. */
export function leatherMaterial() {
  const SIZE = 256;
  const [heightCanvas, height] = canvas(SIZE);
  const rnd = seeded(5);
  height.fillStyle = '#808080';
  height.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 2600; i++) {
    height.globalAlpha = 0.15 + rnd() * 0.25;
    height.fillStyle = rnd() > 0.5 ? '#c8c8c8' : '#383838';
    height.beginPath();
    height.arc(rnd() * SIZE, rnd() * SIZE, 0.8 + rnd() * 2.2, 0, Math.PI * 2);
    height.fill();
  }
  const bumpMap = texture(heightCanvas, false);
  bumpMap.repeat.set(36, 36);
  return new THREE.MeshStandardMaterial({ color: 0x0b0907, roughness: 0.92, bumpMap, bumpScale: 0.5 });
}

let blob = null;
/**
 * Soft dark disc laid under each piece. Shadow maps can't resolve the tight, dark
 * occlusion where a base meets the board; this contact shadow is what grounds the piece.
 */
export function contactShadow(radius) {
  if (!blob) {
    const SIZE = 128;
    const [c, g] = canvas(SIZE);
    const gradient = g.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.55)');
    gradient.addColorStop(0.72, 'rgba(0,0,0,0.14)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gradient;
    g.fillRect(0, 0, SIZE, SIZE);
    blob = new THREE.CanvasTexture(c);
  }
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false, toneMapped: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = -1; // under the state rings
  return mesh;
}
