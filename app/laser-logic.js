// 레이저 미로 (Laser Maze) rules engine: a 5×5 board, one laser, and tokens that bend, split or
// catch its beam. A puzzle gives some tokens already on the board (a few with their direction
// left open), tokens to add, and how many targets must light. Solved when exactly that many
// targets are lit, every token is touched by the beam, no beam hits a token's blocked side, and
// no beam leaves the board. Traces beams, solves any puzzle (beam-driven search, so it can also
// count solutions), and generates puzzles with one solution for each level. Pure.
//
// Directions: 0 = north (row − 1), 1 = east, 2 = south, 3 = west; a beam's direction is the way
// it travels. A token's orientation o turns it o quarter turns clockwise from its base pose:
//   laser     fires north.
//   target    target face north; mirror on the "\" diagonal facing south-west; east side blocked.
//   double    two-sided mirror on the "\" diagonal (o = 1 is "/").
//   splitter  "\" half-mirror: reflects like the double mirror and lets the beam straight through.
//   check     checkpoint: the beam must pass straight through north–south; its sides are blocked.
//   block     cell blocker: takes up a square, the beam passes over it.

export const N = 5;
export const DR = [-1, 0, 1, 0];
export const DC = [0, 1, 0, -1];
export const TYPES = ['laser', 'target', 'double', 'splitter', 'check', 'block'];
/** How many distinct orientations each token has. */
export const TURNS = { laser: 4, target: 4, double: 2, splitter: 2, check: 2, block: 1 };
/** The pieces in the box. */
export const INVENTORY = { laser: 1, target: 5, double: 1, splitter: 2, check: 1, block: 1 };

const BAD = 'bad';   // the beam hit a blocked side: this arrangement is wrong
const LIT = 'lit';   // the beam hit a target face and stops there

/**
 * What a token does to a beam travelling in direction d: an array of outgoing directions
 * (empty = the beam stops quietly), LIT (a target face was hit) or BAD (a blocked side).
 */
export function react(type, o, d) {
  const l = (d - o + 4) % 4; // the beam's direction in the token's own frame
  const out = (dirs) => dirs.map((x) => (x + o) % 4);
  const mirror = [3, 2, 1, 0]; // "\": north→west, east→south, south→east, west→north
  switch (type) {
    case 'laser': return l === 2 ? [] : BAD; // back into its own muzzle stops; anywhere else is a wrong hit
    case 'target': return l === 0 ? out([3]) : l === 1 ? out([2]) : l === 2 ? LIT : BAD;
    case 'double': return out([mirror[l]]);
    case 'splitter': return out([mirror[l], l]);
    case 'check': return l === 0 || l === 2 ? out([l]) : BAD;
    case 'block': return [d];
    default: throw new Error(`unknown token ${type}`);
  }
}

const inside = (r, c) => r >= 0 && r < N && c >= 0 && c < N;

/**
 * Follow the beam over a board of placed tokens [{ type, r, c, o }] (tokens with r === null are
 * off the board). Returns
 *   steps    [{ r, c, d }]: every square the beam enters, with the direction it enters in
 *   ends     [{ r, c, d, kind }]: where a beam stops — 'target', 'bad' (blocked side), 'off' (left
 *            the board from r, c), 'laser' (back into the laser), 'absorbed'
 *   touched  Set of token indices the beam reached;  lit  Set of target indices lit
 *   bad      true if any beam hit a blocked side;  off  true if any beam left the board
 */
export function trace(tokens) {
  const grid = new Array(N * N).fill(-1);
  tokens.forEach((t, i) => { if (t.r !== null && t.r !== undefined) grid[t.r * N + t.c] = i; });
  const laser = tokens.findIndex((t) => t.type === 'laser' && t.r !== null && t.r !== undefined);
  const res = { steps: [], ends: [], touched: new Set(), lit: new Set(), bad: false, off: false };
  if (laser < 0) return res;
  res.touched.add(laser);
  const seen = new Uint8Array(N * N * 4);
  const L = tokens[laser];
  const beams = [[L.r, L.c, L.o]];
  while (beams.length) {
    const [r0, c0, d] = beams.pop();
    const r = r0 + DR[d], c = c0 + DC[d];
    if (!inside(r, c)) { res.ends.push({ r: r0, c: c0, d, kind: 'off' }); res.off = true; continue; }
    const k = (r * N + c) * 4 + d;
    if (seen[k]) continue; // a loop through a splitter: already followed from here
    seen[k] = 1;
    res.steps.push({ r, c, d });
    const i = grid[r * N + c];
    if (i < 0) { beams.push([r, c, d]); continue; }
    const t = tokens[i];
    res.touched.add(i);
    const out = react(t.type, t.o, d);
    if (out === BAD) { res.bad = true; res.ends.push({ r, c, d, kind: 'bad' }); continue; }
    if (out === LIT) { res.lit.add(i); res.ends.push({ r, c, d, kind: 'target' }); continue; }
    if (!out.length) { res.ends.push({ r, c, d, kind: t.type === 'laser' ? 'laser' : 'absorbed' }); continue; }
    for (const nd of out) beams.push([r, c, nd]);
  }
  return res;
}

/**
 * Judge an arrangement against its puzzle: { solved, lit, need, untouched: [token indices],
 * bad, off, unplaced, mustMissing, trace }.
 */
export function judge(puzzle, tokens) {
  const tr = trace(tokens);
  const unplaced = tokens.filter((t) => t.r === null || t.r === undefined).length;
  const untouched = [];
  tokens.forEach((t, i) => { if (t.r !== null && t.r !== undefined && t.type !== 'block' && !tr.touched.has(i)) untouched.push(i); });
  const mustMissing = tokens.filter((t, i) => t.must && !tr.lit.has(i)).length;
  const lit = tr.lit.size;
  const solved = !unplaced && !untouched.length && !tr.bad && !tr.off && !mustMissing && lit === puzzle.targets;
  return { solved, lit, need: puzzle.targets, untouched, bad: tr.bad, off: tr.off, unplaced, mustMissing, trace: tr };
}

// ---------- solving ----------

/**
 * Every way to finish a puzzle, up to `limit`: each solution is the full list of tokens
 * [{ type, r, c, o }] in the puzzle's order (fixed tokens first, then the ones added).
 *
 * The search follows the beam: added tokens only matter where the beam goes (an untouched token
 * is not allowed), so at each empty square the beam enters it either passes over — and that
 * square is then closed, or the beam's earlier path would change — or one of the unused tokens
 * goes there in each of its orientations. Fixed tokens with an open direction branch the same way
 * when the beam first reaches them. `targets: null` accepts any number of lit targets (used by the
 * generator); `rnd` shuffles the choices for random solutions; `maxNodes` bounds the work.
 */
export function solveAll(puzzle, { limit = 2, rnd = null, maxNodes = 2e6 } = {}) {
  const fixed = puzzle.fixed;
  const cell = new Array(N * N).fill(null);
  const tokens = fixed.map((f) => ({ type: f.type, r: f.r, c: f.c, o: f.o ?? null, must: Boolean(f.must), fixed: true }));
  tokens.forEach((t, i) => { cell[t.r * N + t.c] = i; });
  const pool = {};
  for (const t of puzzle.add) pool[t] = (pool[t] ?? 0) + 1;
  const extra = [];            // indices of added tokens, as they're placed
  const closed = new Uint8Array(N * N);
  const touched = new Uint16Array(N * N);
  const hits = new Uint16Array(N * N);
  const seen = new Uint8Array(N * N * 4);
  const want = puzzle.targets;
  let lit = 0, nodes = 0, poolLeft = puzzle.add.length;
  const sols = [];
  const shuffle = (a) => { if (rnd) for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const orients = (type) => shuffle([...Array(TURNS[type]).keys()]);

  function finish() {
    if (poolLeft) return;
    if (want === null ? lit < 1 : lit !== want) return;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.r === null) continue;
      if (t.type !== 'block' && !touched[t.r * N + t.c]) return;
      if (t.must && !hits[t.r * N + t.c]) return;
    }
    sols.push(tokens.filter((t) => t.r !== null).map(({ type, r, c, o, must }) => ({ type, r, c, o, ...(must ? { must } : {}) })));
  }

  // beams: a stack of [r, c, d] = a beam leaving square (r, c) in direction d
  function step(beams) {
    if (sols.length >= limit) return;
    if (++nodes > maxNodes) throw new Error('search limit');
    if (!beams.length) { finish(); return; }
    const [r0, c0, d] = beams[beams.length - 1];
    const rest = beams.slice(0, -1);
    const r = r0 + DR[d], c = c0 + DC[d];
    if (!inside(r, c)) return; // a beam may not leave the board
    const at = r * N + c, k = at * 4 + d;
    if (seen[k]) { step(rest); return; }
    seen[k] = 1;
    const i = cell[at];
    if (i === null) {
      const options = shuffle(['pass', ...Object.keys(pool).filter((t) => pool[t] > 0)]);
      for (const opt of options) {
        if (opt === 'pass') {
          closed[at]++;
          step([...rest, [r, c, d]]);
          closed[at]--;
        } else if (!closed[at]) {
          pool[opt]--; poolLeft--;
          const t = { type: opt, r, c, o: null, fixed: false };
          const ti = tokens.push(t) - 1;
          cell[at] = ti;
          for (const o of orients(opt)) { t.o = o; hit(t, at, r, c, d, rest); if (sols.length >= limit) break; }
          cell[at] = null; tokens.pop();
          pool[opt]++; poolLeft++;
        }
        if (sols.length >= limit) break;
      }
    } else {
      const t = tokens[i];
      if (t.o === null) {
        for (const o of orients(t.type)) { t.o = o; hit(t, at, r, c, d, rest); if (sols.length >= limit) break; }
        t.o = null;
      } else hit(t, at, r, c, d, rest);
    }
    seen[k] = 0;
  }

  function hit(t, at, r, c, d, rest) {
    const out = react(t.type, t.o, d);
    if (out === BAD) return;
    touched[at]++;
    if (out === LIT) {
      if (!hits[at]++) lit++;
      if (want === null || lit <= want) step(rest);
      if (!--hits[at]) lit--;
    } else step([...rest, ...out.map((nd) => [r, c, nd])]);
    touched[at]--;
  }

  const li = tokens.findIndex((t) => t.type === 'laser');
  if (li < 0) return { solutions: [], nodes };
  const L = tokens[li];
  touched[L.r * N + L.c]++;
  try {
    for (const o of L.o === null ? orients('laser') : [L.o]) {
      const was = L.o;
      L.o = o;
      step([[L.r, L.c, o]]);
      L.o = was;
      if (sols.length >= limit) break;
    }
  } catch (e) {
    if (e.message !== 'search limit') throw e;
    return { solutions: sols, nodes, aborted: true };
  }
  return { solutions: sols, nodes };
}

/** One solution (token list) or null. */
export const solve = (puzzle) => solveAll(puzzle, { limit: 1 }).solutions[0] ?? null;

/** 0, 1 or 2 (= more than one). */
export const countSolutions = (puzzle) => solveAll(puzzle, { limit: 2 }).solutions.length;

// ---------- puzzles ----------

/**
 * Levels, named like the game's. `pieces` = tokens besides the laser, `add` = how many of them the
 * player places, `hide` = fixed tokens whose direction is left for the player.
 */
export const LEVELS = [
  { name: '입문', pieces: [3, 4], add: [1, 2], hide: [0, 0] },
  { name: '초급', pieces: [4, 6], add: [2, 3], hide: [0, 1] },
  { name: '중급', pieces: [5, 7], add: [3, 4], hide: [1, 2] },
  { name: '고급', pieces: [6, 9], add: [4, 5], hide: [1, 3] },
];

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const between = (rnd, [a, b]) => a + Math.floor(rnd() * (b - a + 1));
const pick = (rnd, a) => a[Math.floor(rnd() * a.length)];

/**
 * Puzzle n of a level (1-based level), always the same for the same numbers:
 * { level, n, id, targets, fixed: [{ type, r, c, o|null, must? }], add: [type], solution }.
 * Made by laying a random working arrangement with the search itself, then taking tokens off
 * the board and hiding directions until the puzzle is as hard as the level asks — keeping only
 * versions with exactly one solution.
 */
export function puzzle(level, n) {
  const L = LEVELS[level - 1];
  for (let attempt = 0; ; attempt++) {
    const rnd = rng((level * 7919 + n * 104729 + attempt * 15485863) ^ 0x5bd1e995);
    const p = tryMake(L, rnd);
    if (p) return { level, n, id: `L${level}-${n + 1}`, ...p };
  }
}

function tryMake(L, rnd) {
  // the tokens this layout uses, drawn from the box
  const want = between(rnd, L.pieces);
  const bag = [];
  for (const [t, k] of Object.entries(INVENTORY)) if (t !== 'laser' && t !== 'block') for (let i = 0; i < k; i++) bag.push(t);
  const chosen = [];
  while (chosen.length < want - (rnd() < 0.4 ? 1 : 0) && bag.length) chosen.push(bag.splice(Math.floor(rnd() * bag.length), 1)[0]);
  if (!chosen.includes('target')) chosen[0] = 'target';
  const laser = { type: 'laser', r: Math.floor(rnd() * N), c: Math.floor(rnd() * N), o: Math.floor(rnd() * 4) };
  const lay = solveAll({ targets: null, fixed: [laser], add: chosen }, { limit: 1, rnd, maxNodes: 20000 });
  const sol = lay.solutions[0];
  if (!sol) return null;
  const tr = trace(sol);
  const targets = tr.lit.size;
  // boring layouts: the beam must bounce off at least two tokens on its way
  if (sol.filter((t, i) => t.type !== 'laser' && !tr.lit.has(i)).length < 2) return null;

  // a cell blocker on a square the beam crosses, sometimes: it closes off a tempting spot
  const tokens = sol.slice();
  if (tokens.length < want + 1) {
    const free = tr.steps.filter((s) => !tokens.some((t) => t.r === s.r && t.c === s.c));
    if (free.length) { const s = pick(rnd, free); tokens.push({ type: 'block', r: s.r, c: s.c, o: 0 }); }
  }

  // take tokens off the board (never the laser or the blocker) and hide some directions
  const movable = shuffleWith(rnd, tokens.map((_, i) => i).filter((i) => tokens[i].type !== 'laser' && tokens[i].type !== 'block'));
  let addN = Math.min(between(rnd, L.add), movable.length);
  let hideN = between(rnd, L.hide);
  const make = () => {
    const off = new Set(movable.slice(0, addN));
    const stay = tokens.map((t, i) => i).filter((i) => !off.has(i));
    const hideable = stay.filter((i) => TURNS[tokens[i].type] > 1);
    const hidden = new Set(shuffleWith(rng(addN * 31 + hideN), hideable).slice(0, hideN));
    return {
      targets,
      fixed: stay.map((i) => ({ ...tokens[i], o: hidden.has(i) ? null : tokens[i].o })),
      add: [...off].map((i) => tokens[i].type).sort(),
    };
  };
  // too many answers: give back a little until only one remains
  while (addN > 0 || hideN > 0) {
    const p = make();
    const res = solveAll(p, { limit: 2, maxNodes: 400000 });
    if (!res.aborted && res.solutions.length === 1) {
      if (addN < L.add[0] || hideN < L.hide[0]) return null; // too easy for this level: lay another
      return { ...p, solution: res.solutions[0] };
    }
    if (hideN > 0) hideN--; else addN--;
  }
  return null;
}

function shuffleWith(rnd, a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- a game in progress ----------

/**
 * { p, tokens: [{ type, r, c, o, fixed, turnable, must }] } — fixed tokens sit where the puzzle
 * put them (turnable if their direction was left open, starting pointed north); the tokens to
 * add start off the board (r = c = null).
 */
export function newGame(p) {
  const tokens = [
    ...p.fixed.map((f) => ({ type: f.type, r: f.r, c: f.c, o: f.o ?? 0, fixed: true, turnable: f.o === null || f.o === undefined, must: Boolean(f.must) })),
    ...p.add.map((type) => ({ type, r: null, c: null, o: 0, fixed: false, turnable: true, must: false })),
  ];
  return { p, tokens, moves: 0 };
}

export const tokenAt = (g, r, c) => g.tokens.findIndex((t) => t.r === r && t.c === c);

/** Put token i on square (r, c) — only a token of the player's, onto an empty square. */
export function place(g, i, r, c) {
  const t = g.tokens[i];
  if (!t || t.fixed || !inside(r, c)) return false;
  const j = tokenAt(g, r, c);
  if (j >= 0 && j !== i) return false;
  if (t.r === r && t.c === c) return false;
  t.r = r; t.c = c;
  g.moves++;
  return true;
}

/** Take a placed token of the player's back off the board. */
export function lift(g, i) {
  const t = g.tokens[i];
  if (!t || t.fixed || t.r === null) return false;
  t.r = null; t.c = null;
  return true;
}

/** Turn token i by `by` quarter turns (clockwise positive), if the player may turn it. */
export function turn(g, i, by = 1) {
  const t = g.tokens[i];
  if (!t || !t.turnable || TURNS[t.type] === 1) return false;
  const k = TURNS[t.type];
  t.o = (((t.o + by) % k) + k) % k;
  g.moves++;
  return true;
}

export const status = (g) => judge(g.p, g.tokens);

/**
 * A hint: one of the player's tokens that is wrong (or not placed yet), and where and how it goes
 * in the solution: { i, r, c, o } — or null if everything already matches.
 */
export function hint(g) {
  const sol = g.p.solution;
  const used = new Set();
  // fixed tokens whose direction is wrong come first: they're the quickest fix
  for (let i = 0; i < g.tokens.length; i++) {
    const t = g.tokens[i];
    if (!t.fixed || !t.turnable) continue;
    const s = sol.find((x) => x.r === t.r && x.c === t.c);
    if (s && !sameTurn(t.type, s.o, t.o)) return { i, r: s.r, c: s.c, o: s.o };
  }
  const wanted = sol.filter((s) => !g.tokens.some((t) => t.fixed && t.r === s.r && t.c === s.c));
  const right = (t, s) => t.type === s.type && t.r === s.r && t.c === s.c && sameTurn(t.type, s.o, t.o);
  g.tokens.forEach((t, i) => {
    if (t.fixed) return;
    const k = wanted.findIndex((s, j) => !used.has(j) && right(t, s));
    if (k >= 0) used.add(k);
  });
  for (let i = 0; i < g.tokens.length; i++) {
    const t = g.tokens[i];
    if (t.fixed || wanted.some((s, j) => used.has(j) && right(t, s))) continue;
    const k = wanted.findIndex((s, j) => !used.has(j) && s.type === t.type);
    if (k >= 0) return { i, r: wanted[k].r, c: wanted[k].c, o: wanted[k].o };
  }
  return null;
}

const sameTurn = (type, a, b) => a % TURNS[type] === b % TURNS[type];
