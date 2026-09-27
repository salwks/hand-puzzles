// 주차장 탈출 (Parking Jam) rules engine: a 6×6 lot of cars and trucks that slide only along
// their own length; get the red car (A) to the exit on the right of its row. Reads boards in
// Michael Fogleman's 36-character format, knows how far each car can slide, applies moves,
// solves any position by breadth-first search (so hints and "minimum moves" are exact), and
// picks puzzles for a level from parking-db.js. A slide of any distance is one move. Pure.
import { LEVELS, PUZZLES } from './parking-db.js';

export { LEVELS };
export const N = 6;
export const EXIT_ROW = 2;

/**
 * A position from a 36-char board: { cars: [{ id, r, c, len, horiz }], walls: [[r, c]] }.
 * Cars are sorted by id so A (the red car) comes first.
 */
export function parse(board) {
  if (board.length !== N * N) throw new Error('board must be 36 characters');
  const cells = {};
  const walls = [];
  [...board].forEach((ch, i) => {
    if (ch === 'o' || ch === '.') return;
    if (ch === 'x') { walls.push([Math.floor(i / N), i % N]); return; }
    (cells[ch] ??= []).push(i);
  });
  const cars = Object.keys(cells).sort().map((id) => {
    const idx = cells[id];
    const horiz = idx[1] === idx[0] + 1;
    return { id, r: Math.floor(idx[0] / N), c: idx[0] % N, len: idx.length, horiz };
  });
  if (!cars.length || cars[0].id !== 'A' || !cars[0].horiz || cars[0].r !== EXIT_ROW) throw new Error('A must be the red car, across the exit row');
  return { cars, walls };
}

/** The 36-char board of a position. */
export function boardOf(pos) {
  const b = Array(N * N).fill('o');
  for (const [r, c] of pos.walls) b[r * N + c] = 'x';
  for (const car of pos.cars) for (let k = 0; k < car.len; k++) b[(car.r + (car.horiz ? 0 : k)) * N + car.c + (car.horiz ? k : 0)] = car.id;
  return b.join('');
}

const clone = (pos) => ({ cars: pos.cars.map((c) => ({ ...c })), walls: pos.walls });

function grid(pos, skip = -1) {
  const g = new Uint8Array(N * N);
  for (const [r, c] of pos.walls) g[r * N + c] = 1;
  pos.cars.forEach((car, i) => {
    if (i === skip) return;
    for (let k = 0; k < car.len; k++) g[(car.r + (car.horiz ? 0 : k)) * N + car.c + (car.horiz ? k : 0)] = 1;
  });
  return g;
}

/**
 * How far car i can slide: { back, fwd } — cells towards smaller (left/up) and larger
 * (right/down) coordinates. The drag in the UI is clamped to this range.
 */
export function range(pos, i) {
  const car = pos.cars[i], g = grid(pos, i);
  let back = 0, fwd = 0;
  if (car.horiz) {
    while (car.c - back - 1 >= 0 && !g[car.r * N + car.c - back - 1]) back++;
    while (car.c + car.len + fwd < N && !g[car.r * N + car.c + car.len + fwd]) fwd++;
  } else {
    while (car.r - back - 1 >= 0 && !g[(car.r - back - 1) * N + car.c]) back++;
    while (car.r + car.len + fwd < N && !g[(car.r + car.len + fwd) * N + car.c]) fwd++;
  }
  return { back, fwd };
}

/** Slide car i by d cells (negative: left/up). Returns a new position, or null if blocked. */
export function slide(pos, i, d) {
  if (!d) return null;
  const { back, fwd } = range(pos, i);
  if (d < -back || d > fwd) return null;
  const next = clone(pos);
  if (next.cars[i].horiz) next.cars[i].c += d; else next.cars[i].r += d;
  return next;
}

/** Solved when the red car's front reaches the exit (it can then drive straight out). */
export const solved = (pos) => pos.cars[0].c + pos.cars[0].len === N;

/** Every legal move: [{ car, d }]. */
export function moves(pos) {
  const out = [];
  pos.cars.forEach((car, i) => {
    const { back, fwd } = range(pos, i);
    for (let d = -back; d <= fwd; d++) if (d) out.push({ car: i, d });
  });
  return out;
}

// A compact state for search: each car's movable coordinate, one char per car.
const keyOf = (pos) => pos.cars.map((c) => (c.horiz ? c.c : c.r)).join('');

/**
 * The shortest solution from a position, as [{ car, d }], by breadth-first search over whole
 * slides (one slide = one move, however far). [] if already solved, null if impossible.
 */
export function solve(pos, { limit = 400000 } = {}) {
  if (solved(pos)) return [];
  const start = keyOf(pos);
  const prev = new Map([[start, null]]);
  let frontier = [pos];
  while (frontier.length) {
    const next = [];
    for (const p of frontier) {
      const k = keyOf(p);
      for (const m of moves(p)) {
        const q = slide(p, m.car, m.d);
        const qk = keyOf(q);
        if (prev.has(qk)) continue;
        prev.set(qk, { from: k, move: m });
        if (solved(q)) {
          const path = [];
          for (let at = qk; prev.get(at); at = prev.get(at).from) path.push(prev.get(at).move);
          return path.reverse();
        }
        if (prev.size > limit) return null;
        next.push(q);
      }
    }
    frontier = next;
  }
  return null;
}

/** The best next move, for a hint: { car, d } (car index, cells), or null if solved/stuck. */
export function hint(pos) {
  const path = solve(pos);
  return path?.length ? path[0] : null;
}

/** Stars for finishing in `used` moves when `best` was possible. */
export function stars(used, best) {
  if (used <= best) return 3;
  if (used <= Math.ceil(best * 1.5)) return 2;
  return 1;
}

// ---------- puzzles ----------

/** How many puzzles a level (1-based) holds. */
export const count = (level) => PUZZLES[level - 1]?.length ?? 0;

/**
 * Puzzle n of a level (wrapping), as { level, n, id, board, best, pos }. Levels are shuffled once
 * by a fixed seed so consecutive numbers mix the level's move counts.
 */
export function puzzle(level, n) {
  const list = order(level);
  const i = ((n % list.length) + list.length) % list.length;
  const [best, board] = list[i].split(' ');
  return { level, n: i, id: `P${level}-${i + 1}`, board, best: Number(best), pos: parse(board) };
}

const orders = new Map();
function order(level) {
  if (!orders.has(level)) {
    const list = PUZZLES[level - 1].slice();
    let s = 7 + level * 101;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    orders.set(level, list);
  }
  return orders.get(level);
}

/** A game in progress: the puzzle, the current position, the moves made, and undo. */
export function newGame(p) {
  return { p, pos: parse(p.board), history: [], used: 0 };
}
export function play(g, car, d) {
  const next = slide(g.pos, car, d);
  if (!next) return false;
  g.history.push(g.pos);
  g.pos = next;
  g.used++;
  return true;
}
/** Undo takes back the position but not the count: moves made are moves made. */
export function undo(g) {
  if (!g.history.length) return false;
  g.pos = g.history.pop();
  return true;
}
export function restart(g) {
  if (!g.history.length) return false;
  g.pos = parse(g.p.board);
  g.history = [];
  return true;
}
