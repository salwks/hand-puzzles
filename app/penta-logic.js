// Pentomino packing puzzle: fill a ROWS x N rectangle with N given pentominoes.
// Cells are [x, z] on the board grid (x = column, z = row, z grows towards the player).
//
// A piece's pose is { rot: 0..3, flip: bool, x, z }: its pivot cell sits at (x, z), the
// base shape is mirrored first (x -> -x) if flipped, then turned rot quarter-turns. One
// quarter-turn maps (x, z) -> (z, -x), which is exactly a +90° rotation about the Y axis
// in three.js, so the 3D mesh and the grid logic can never disagree.

export const ROWS = 5;

// Base shapes, each listed relative to its pivot cell [0, 0] (a cell near the middle, so
// the piece turns roughly in place).
export const SHAPES = {
  F: [[0, 0], [0, -1], [1, -1], [-1, 0], [0, 1]],
  I: [[0, 0], [-2, 0], [-1, 0], [1, 0], [2, 0]],
  L: [[0, 0], [-1, 0], [-2, 0], [1, 0], [1, -1]],
  N: [[0, 0], [-1, 0], [-2, 0], [0, -1], [1, -1]],
  P: [[0, 0], [1, 0], [0, -1], [1, -1], [0, 1]],
  T: [[0, 0], [0, -1], [-1, -1], [1, -1], [0, 1]],
  U: [[0, 0], [-1, 0], [1, 0], [-1, -1], [1, -1]],
  V: [[0, 0], [1, 0], [2, 0], [0, -1], [0, -2]],
  W: [[0, 0], [-1, 0], [-1, -1], [0, 1], [1, 1]],
  X: [[0, 0], [0, -1], [0, 1], [-1, 0], [1, 0]],
  Y: [[0, 0], [-1, 0], [1, 0], [2, 0], [0, -1]],
  Z: [[0, 0], [0, -1], [-1, -1], [0, 1], [1, 1]],
};
export const NAMES = Object.keys(SHAPES);

/** Offsets of a piece's cells from its pivot, for a given orientation. */
export function orient(name, rot, flip) {
  return SHAPES[name].map(([x, z]) => {
    if (flip) x = -x;
    for (let i = 0; i < ((rot % 4) + 4) % 4; i++) [x, z] = [z, -x];
    return [x, z];
  });
}

/** Absolute board cells covered by a pose. */
export const cellsOf = (name, pose) => orient(name, pose.rot, pose.flip).map(([x, z]) => [x + pose.x, z + pose.z]);

const keyOf = (cells) => cells.map(([x, z]) => `${x},${z}`).sort().join(' ');

/** The distinct orientations of a shape (1 for X, 2 for I, 4 or 8 for the rest). */
function distinctOrientations(name) {
  const seen = new Set();
  const out = [];
  for (const flip of [false, true]) {
    for (let rot = 0; rot < 4; rot++) {
      const cells = orient(name, rot, flip);
      const minX = Math.min(...cells.map((c) => c[0])), minZ = Math.min(...cells.map((c) => c[1]));
      const key = keyOf(cells.map(([x, z]) => [x - minX, z - minZ]));
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ rot, flip, cells });
    }
  }
  return out;
}
const ORIENTATIONS = Object.fromEntries(NAMES.map((n) => [n, distinctOrientations(n)]));

/** Does this pose sit entirely on empty board cells? `occupied` is a Set of "x,z". */
export function fits(name, pose, cols, occupied) {
  return cellsOf(name, pose).every(([x, z]) => x >= 0 && x < cols && z >= 0 && z < ROWS && !occupied.has(`${x},${z}`));
}

/**
 * Exact-cover search. `placed` = [{ name, pose }] already on the board (kept where they
 * are); `free` = names still to place. Returns [{ name, pose }] for the free pieces, or null.
 */
export function solve(cols, free, placed = []) {
  const grid = new Uint8Array(cols * ROWS);
  for (const p of placed) {
    for (const [x, z] of cellsOf(p.name, p.pose)) {
      if (x < 0 || x >= cols || z < 0 || z >= ROWS || grid[z * cols + x]) return null;
      grid[z * cols + x] = 1;
    }
  }
  if (free.length * 5 !== grid.filter((v) => !v).length) return null;

  const used = new Array(free.length).fill(false);
  const result = [];
  // Always fill the first empty cell (column-major, so narrow dead ends show up early).
  const firstEmpty = () => {
    for (let x = 0; x < cols; x++) for (let z = 0; z < ROWS; z++) if (!grid[z * cols + x]) return [x, z];
    return null;
  };
  const search = () => {
    const hole = firstEmpty();
    if (!hole) return true;
    for (let i = 0; i < free.length; i++) {
      if (used[i]) continue;
      for (const o of ORIENTATIONS[free[i]]) {
        // Try each cell of the orientation as the one that lands on the hole.
        for (const [ax, az] of o.cells) {
          const pose = { rot: o.rot, flip: o.flip, x: hole[0] - ax, z: hole[1] - az };
          const cells = o.cells.map(([x, z]) => [x + pose.x, z + pose.z]);
          if (!cells.every(([x, z]) => x >= 0 && x < cols && z >= 0 && z < ROWS && !grid[z * cols + x])) continue;
          for (const [x, z] of cells) grid[z * cols + x] = 1;
          used[i] = true;
          result.push({ name: free[i], pose });
          if (search()) return true;
          result.pop();
          used[i] = false;
          for (const [x, z] of cells) grid[z * cols + x] = 0;
        }
      }
    }
    return false;
  };
  return search() ? result : null;
}

/** Picks `count` distinct pentominoes that can tile ROWS x count. */
export function generate(count, rng = Math.random) {
  count = Math.max(3, Math.min(NAMES.length, count));
  for (let attempt = 0; attempt < 4000; attempt++) {
    const bag = [...NAMES];
    const pick = [];
    while (pick.length < count) pick.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
    if (solve(count, pick)) return pick;
  }
  return ['L', 'P', 'V'].slice(0, count); // unreachable in practice; a known 5x3 set
}
