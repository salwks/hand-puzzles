// 도미노 미로 (Domino Maze) rules engine: a 6×6 board, a start domino, and a chain to build so
// that pushing the start knocks the targets down in order (I, then II, then III) and every
// domino on the board falls. Inspired by ThinkFun's Domino Maze; the exact rules here are ours:
//
//   Directions are the 8 compass points, 0 = north (row − 1), clockwise in 45° steps.
//   A falling piece knocks whatever stands on the square next to it in the way it falls.
//   domino   has an arrow and falls only that way. Knocked from behind or from up to 45° off
//            its arrow, it falls (so a chain can bend 45° per domino); hit from the side or the
//            front it holds, and the chain stops there.
//   start    the domino the player pushes; a domino otherwise.
//   target   I, II, III: knocked from any side, it falls straight on the way it was hit.
//   pivot    turns the chain a quarter: clockwise (o = 0) or anticlockwise (o = 1).
//   block    a blocker or a wall: the chain stops against it.
//
// Solved when every target has fallen, in order, every domino (the start included) has fallen,
// every pivot has been turned, and every domino the puzzle gave has been placed. Runs a push step by step (with times, for
// the animation), solves any puzzle (following the chain), and generates puzzles with one
// solution for each level. Pure.

export const N = 6;
export const DR = [-1, -1, 0, 1, 1, 1, 0, -1];
export const DC = [0, 1, 1, 1, 0, -1, -1, -1];
/** Ticks a fall takes: straight 2, diagonal 3 (≈ 2√2), for the animation's timing. */
export const FALL = (d) => (d % 2 ? 3 : 2);
/** How many directions each piece can be turned to. */
export const TURNS = { start: 8, domino: 8, target: 1, pivot: 2, block: 1 };

const MUST = new Set(['start', 'domino', 'pivot']);
const inside = (r, c) => r >= 0 && r < N && c >= 0 && c < N;
const turnDiff = (a, b) => { const d = (((a - b) % 8) + 8) % 8; return Math.min(d, 8 - d); };

/**
 * What a standing piece does when a piece falling in direction d lands on it:
 * the direction it falls in, or null if it holds.
 */
export function knock(t, d) {
  switch (t.type) {
    case 'start':
    case 'domino': return turnDiff(t.o, d) <= 1 ? t.o : null;
    case 'target': return d;
    case 'pivot': return (d + (t.o ? 6 : 2)) % 8;
    default: return null;
  }
}

/**
 * Push the start domino over a board of pieces [{ type, r, c, o, k }] (r === null = not on the
 * board; k = target number 1..3). Returns
 *   falls    [{ i, t, d }]: each piece that falls, when (ticks) and which way, in order
 *   order    target numbers in the order they fell
 *   end      { r, c, d, why }: where the chain stopped — 'edge', 'empty', 'held' (a piece that
 *            didn't fall), 'block', 'fallen'
 *   standing indices of dominoes still standing (or pivots never turned) afterwards
 */
export function run(tokens) {
  const grid = new Array(N * N).fill(-1);
  tokens.forEach((t, i) => { if (t.r !== null && t.r !== undefined) grid[t.r * N + t.c] = i; });
  const s = tokens.findIndex((t) => t.type === 'start' && t.r !== null && t.r !== undefined);
  const res = { falls: [], order: [], end: null, standing: [] };
  if (s < 0) return res;
  const down = new Set([s]);
  let i = s, d = tokens[s].o, t = 0;
  res.falls.push({ i, t, d });
  for (;;) {
    const p = tokens[i], r = p.r + DR[d], c = p.c + DC[d];
    t += FALL(d);
    if (!inside(r, c)) { res.end = { r: p.r, c: p.c, d, why: 'edge' }; break; }
    const j = grid[r * N + c];
    if (j < 0) { res.end = { r, c, d, why: 'empty' }; break; }
    if (down.has(j)) { res.end = { r, c, d, why: 'fallen' }; break; }
    const q = tokens[j];
    const nd = knock(q, d);
    if (nd === null) { res.end = { r, c, d, why: q.type === 'block' ? 'block' : 'held' }; break; }
    down.add(j);
    if (q.type === 'target') res.order.push(q.k);
    res.falls.push({ i: j, t, d: nd });
    i = j; d = nd;
  }
  // pieces the chain should have used but didn't: dominoes still up, pivots never turned
  tokens.forEach((q, k) => { if (MUST.has(q.type) && q.r !== null && q.r !== undefined && !down.has(k)) res.standing.push(k); });
  return res;
}

/** Judge an arrangement: { solved, order, targets, standing, unplaced, wrongOrder, run }. */
export function judge(puzzle, tokens) {
  const rr = run(tokens);
  const targets = tokens.filter((t) => t.type === 'target').length;
  const unplaced = tokens.filter((t) => t.r === null || t.r === undefined).length;
  const wrongOrder = rr.order.some((k, i) => k !== i + 1);
  const solved = !unplaced && !rr.standing.length && !wrongOrder && rr.order.length === targets;
  return { solved, order: rr.order, targets, standing: rr.standing, unplaced, wrongOrder, run: rr };
}

// ---------- solving ----------

/**
 * Every way to finish a puzzle, up to `limit`, as full piece lists (fixed pieces first, then the
 * dominoes placed). The chain is a single line, so the search just follows it: at an empty
 * square it either stops there or a domino is placed, turned within 45° of the fall; a fixed
 * domino whose direction is left open is tried in the directions that let it fall (any other
 * leaves it standing, which is never allowed); same for an open pivot.
 * `puzzle.dominoes` = how many dominoes the player places. `targets: null` in the generator.
 */
export function solveAll(puzzle, { limit = 2, rnd = null, maxNodes = 1e6 } = {}) {
  const tokens = puzzle.fixed.map((f) => ({ ...f, o: f.o ?? null }));
  const grid = new Array(N * N).fill(-1);
  tokens.forEach((t, i) => { grid[t.r * N + t.c] = i; });
  const nTargets = tokens.filter((t) => t.type === 'target').length;
  const nDominoes = tokens.filter((t) => MUST.has(t.type)).length; // everything that must be knocked
  const s = tokens.findIndex((t) => t.type === 'start');
  const sols = [];
  let nodes = 0, pool = puzzle.dominoes;
  const down = new Uint8Array(tokens.length + 64);
  const shuffle = (a) => { if (rnd) for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // the chain is falling from piece i in direction d; `fell` dominoes and `next` target so far
  function go(i, d, fell, next) {
    if (sols.length >= limit) return;
    if (++nodes > maxNodes) throw new Error('search limit');
    const p = tokens[i], r = p.r + DR[d], c = p.c + DC[d];
    const stop = () => {
      if (pool === 0 && fell === nDominoes + puzzle.dominoes && next > nTargets) {
        sols.push(tokens.map(({ type, r: tr, c: tc, o, k }) => ({ type, r: tr, c: tc, o, ...(k ? { k } : {}) })));
      }
    };
    if (!inside(r, c)) { stop(); return; }
    const j = grid[r * N + c];
    if (j < 0) {
      for (const opt of shuffle(['stop', 'place'])) {
        if (opt === 'stop') stop();
        else if (pool > 0) {
          pool--;
          const k = tokens.push({ type: 'domino', r, c, o: 0 }) - 1;
          grid[r * N + c] = k;
          down[k] = 1;
          for (const o of shuffle([(d + 7) % 8, d, (d + 1) % 8])) { tokens[k].o = o; go(k, o, fell + 1, next); if (sols.length >= limit) break; }
          down[k] = 0;
          grid[r * N + c] = -1;
          tokens.pop();
          pool++;
        }
        if (sols.length >= limit) return;
      }
      return;
    }
    if (down[j]) { stop(); return; }
    const q = tokens[j];
    const opens = q.o === null ? (q.type === 'pivot' ? [0, 1] : [(d + 7) % 8, d, (d + 1) % 8]) : [q.o];
    for (const o of shuffle(opens.slice())) {
      const was = q.o;
      q.o = o;
      const nd = knock(q, d);
      if (nd === null) { q.o = was; stop(); continue; } // it holds: the chain ends here
      if (q.type === 'target' && q.k !== next) { q.o = was; continue; } // out of order
      down[j] = 1;
      go(j, nd, fell + (MUST.has(q.type) ? 1 : 0), next + (q.type === 'target' ? 1 : 0));
      down[j] = 0;
      q.o = was;
      if (sols.length >= limit) return;
    }
  }

  if (s < 0) return { solutions: [], nodes };
  const S = tokens[s];
  try {
    for (const o of S.o === null ? shuffle([0, 1, 2, 3, 4, 5, 6, 7]) : [S.o]) {
      const was = S.o;
      S.o = o;
      down[s] = 1;
      go(s, o, 1, 1);
      down[s] = 0;
      S.o = was;
      if (sols.length >= limit) break;
    }
  } catch (e) {
    if (e.message !== 'search limit') throw e;
    return { solutions: sols, nodes, aborted: true };
  }
  return { solutions: sols, nodes };
}

export const solve = (p) => solveAll(p, { limit: 1 }).solutions[0] ?? null;
export const countSolutions = (p) => solveAll(p, { limit: 2 }).solutions.length;

// ---------- puzzles ----------

/**
 * Levels. `chain` = dominoes in the finished chain besides the start, `place` = how many of them
 * the player puts down, `open` = fixed pieces whose direction is left to the player,
 * `targets`, `pivots`, `blocks` = how many of each the layout has.
 */
export const LEVELS = [
  { name: '입문', chain: [4, 6], place: [2, 3], open: [0, 0], targets: [1, 2], pivots: [0, 0], blocks: [1, 2] },
  { name: '초급', chain: [6, 8], place: [3, 4], open: [0, 1], targets: [2, 2], pivots: [0, 1], blocks: [1, 3] },
  { name: '중급', chain: [8, 11], place: [4, 6], open: [1, 2], targets: [2, 3], pivots: [1, 1], blocks: [2, 3] },
  { name: '고급', chain: [10, 14], place: [6, 8], open: [1, 3], targets: [3, 3], pivots: [1, 2], blocks: [2, 4] },
];

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const between = (rnd, [a, b]) => a + Math.floor(rnd() * (b - a + 1));
function shuffleWith(rnd, a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/**
 * Puzzle n of a level (1-based), always the same for the same numbers:
 * { level, n, id, dominoes, fixed: [{ type, r, c, o|null, k? }], solution }.
 * Lays a random chain that works, then takes dominoes off and hides directions until the level's
 * difficulty is reached, keeping only versions with exactly one solution.
 */
export function puzzle(level, n) {
  const L = LEVELS[level - 1];
  for (let attempt = 0; ; attempt++) {
    const rnd = rng((level * 7919 + n * 104729 + attempt * 15485863) ^ 0x2c1b3c6d);
    const p = tryMake(L, rnd);
    if (p) return { level, n, id: `D${level}-${n + 1}`, ...p };
  }
}

/** A random working chain: [{ type, r, c, o, k? }], start first. */
function layChain(L, rnd) {
  const len = between(rnd, L.chain), nT = between(rnd, L.targets), nP = between(rnd, L.pivots);
  const total = 1 + len + nT + nP;
  const used = new Set();
  const r0 = Math.floor(rnd() * N), c0 = Math.floor(rnd() * N);
  let d = Math.floor(rnd() * 8);
  const chain = [{ type: 'start', r: r0, c: c0, o: d }];
  used.add(r0 * N + c0);
  // which positions along the chain hold targets and pivots (never right after the start)
  const slots = shuffleWith(rnd, [...Array(total - 2).keys()].map((x) => x + 2)).slice(0, nT + nP).sort((a, b) => a - b);
  const kinds = new Map();
  shuffleWith(rnd, [...Array(nT).fill('target'), ...Array(nP).fill('pivot')]).forEach((k, i) => kinds.set(slots[i], k));
  let k = 1;
  for (let step = 1; step < total; step++) {
    const prev = chain[chain.length - 1];
    const r = prev.r + DR[d], c = prev.c + DC[d];
    if (!inside(r, c) || used.has(r * N + c)) return null;
    used.add(r * N + c);
    const kind = kinds.get(step) ?? 'domino';
    if (kind === 'target') { chain.push({ type: 'target', r, c, o: 0, k: k++ }); continue; }
    if (kind === 'pivot') { const o = rnd() < 0.5 ? 0 : 1; chain.push({ type: 'pivot', r, c, o }); d = (d + (o ? 6 : 2)) % 8; continue; }
    // a domino: mostly straight on, sometimes a 45° bend; prefer a direction that stays on the board
    const opts = shuffleWith(rnd, [d, d, d, (d + 1) % 8, (d + 7) % 8]);
    const ok = opts.filter((o) => inside(r + DR[o], c + DC[o]) && !used.has((r + DR[o]) * N + c + DC[o]));
    const o = step === total - 1 ? opts[0] : ok[0] ?? opts[0];
    chain.push({ type: 'domino', r, c, o });
    d = o;
  }
  return chain;
}

function tryMake(L, rnd) {
  const chain = layChain(L, rnd);
  if (!chain) return null;
  // the chain must end cleanly: the last piece falls onto an empty square or off the board
  if (!judge({}, chain).solved) return null;
  // blockers near the chain: they shut off tempting detours
  const used = new Set(chain.map((t) => t.r * N + t.c));
  const near = [];
  for (const t of chain) for (let d = 0; d < 8; d++) {
    const r = t.r + DR[d], c = t.c + DC[d];
    if (inside(r, c) && !used.has(r * N + c) && !near.some((q) => q.r === r && q.c === c)) near.push({ r, c });
  }
  const blocks = shuffleWith(rnd, near).slice(0, between(rnd, L.blocks)).map((q) => ({ type: 'block', r: q.r, c: q.c, o: 0 }));
  const all = [...chain, ...blocks];
  if (!judge({}, all).solved) return null;

  // take dominoes off (never the start) and hide some directions
  const dominoes = shuffleWith(rnd, all.map((_, i) => i).filter((i) => all[i].type === 'domino'));
  let place = Math.min(between(rnd, L.place), dominoes.length);
  let open = between(rnd, L.open);
  const make = () => {
    const off = new Set(dominoes.slice(0, place));
    const stay = all.map((_, i) => i).filter((i) => !off.has(i));
    const openable = stay.filter((i) => all[i].type === 'domino' || all[i].type === 'pivot' || all[i].type === 'start');
    const hidden = new Set(shuffleWith(rng(place * 31 + open * 7 + 3), openable).slice(0, open));
    return { dominoes: place, fixed: stay.map((i) => ({ ...all[i], o: hidden.has(i) ? null : all[i].o })) };
  };
  while (place > 0 || open > 0) {
    const p = make();
    const res = solveAll(p, { limit: 2, maxNodes: 300000 });
    if (!res.aborted && res.solutions.length === 1) {
      if (place < L.place[0] || open < L.open[0]) return null; // too easy for this level: lay another
      return { ...p, solution: res.solutions[0] };
    }
    if (open > 0) open--; else place--;
  }
  return null;
}

// ---------- a game in progress ----------

/**
 * { p, tokens: [{ type, r, c, o, k, fixed, turnable }], moves } — the puzzle's pieces where it put
 * them (turnable if their direction was left open, starting pointed north / clockwise), then the
 * dominoes to place, off the board.
 */
export function newGame(p) {
  const tokens = [
    ...p.fixed.map((f) => ({ type: f.type, r: f.r, c: f.c, o: f.o ?? 0, k: f.k, fixed: true, turnable: f.o === null || f.o === undefined })),
    ...Array.from({ length: p.dominoes }, () => ({ type: 'domino', r: null, c: null, o: 0, fixed: false, turnable: true })),
  ];
  return { p, tokens, moves: 0 };
}

export const tokenAt = (g, r, c) => g.tokens.findIndex((t) => t.r === r && t.c === c);

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

export function lift(g, i) {
  const t = g.tokens[i];
  if (!t || t.fixed || t.r === null) return false;
  t.r = null; t.c = null;
  return true;
}

/** Turn piece i by `by` steps (45° for a domino; a pivot just switches its hand). */
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
 * A hint: one piece that is wrong or not placed yet, and where and how it goes in the solution:
 * { i, r, c, o } — or null when everything matches.
 */
export function hint(g) {
  const sol = g.p.solution;
  for (let i = 0; i < g.tokens.length; i++) {
    const t = g.tokens[i];
    if (!t.fixed || !t.turnable) continue;
    const s = sol.find((x) => x.r === t.r && x.c === t.c);
    if (s && s.o !== t.o) return { i, r: s.r, c: s.c, o: s.o };
  }
  const wanted = sol.filter((s) => s.type === 'domino' && !g.tokens.some((t) => t.fixed && t.r === s.r && t.c === s.c));
  const right = (t, s) => t.r === s.r && t.c === s.c && t.o === s.o;
  const done = new Set();
  g.tokens.forEach((t, i) => { if (!t.fixed) { const k = wanted.findIndex((s, j) => !done.has(j) && right(t, s)); if (k >= 0) done.add(k); } });
  for (let i = 0; i < g.tokens.length; i++) {
    const t = g.tokens[i];
    if (t.fixed || wanted.some((s, j) => done.has(j) && right(t, s))) continue;
    const k = wanted.findIndex((_, j) => !done.has(j));
    if (k >= 0) return { i, r: wanted[k].r, c: wanted[k].c, o: wanted[k].o };
  }
  return null;
}
