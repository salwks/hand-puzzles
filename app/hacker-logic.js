// 해커 (Hacker) rules engine: a coding puzzle in three phases, inspired by ThinkFun's Hacker (the
// exact rules here are ours). A 5×5 board holds an agent, a data file, an exit, a virus, maybe an
// alarm, some server racks (walls) and revolving platforms: 2×2 blocks that turn a quarter on their
// own at scheduled beats, carrying whatever stands on them. The program is a row of T slots; each
// slot is empty (the agent waits a beat) or holds a move tile (↑ → ↓ ←). Beat t: the agent runs
// slot t (a move into a wall or off the board does nothing), then the platforms due at t turn.
//
//   작성 (code)  place the given tiles (some are locked in place) so the agent picks up the data
//                file and reaches the exit, never touching the alarm or the virus.
//   해킹 (hack)  keep the tiles in the same order and only slide them left or right (the locked ones
//                stay) so that the agent walks into the virus instead.
//   방어 (fix)   link two tiles that run back to back in the working program, so no gap can open
//                between them: afterwards no sliding may reach the virus.
//
// Everything here is pure: simulation (with frames for the animation), solvers for each phase, a
// generator that makes puzzles in which every working program can be hacked and then fixed, and
// the game state.

export const N = 5;
export const DR = [-1, 0, 1, 0];
export const DC = [0, 1, 0, -1];
export const ARROWS = ['↑', '→', '↓', '←'];

const inside = (r, c) => r >= 0 && r < N && c >= 0 && c < N;
const key = (r, c) => r * N + c;

/** The four squares of a platform, in clockwise order from its top-left. */
export const ring = (p) => [[p.r, p.c], [p.r, p.c + 1], [p.r + 1, p.c + 1], [p.r + 1, p.c]];

/** Where a square lands when platform p turns (or itself if it isn't on p). */
function turnSquare(p, r, c) {
  const sq = ring(p);
  const i = sq.findIndex(([a, b]) => a === r && b === c);
  if (i < 0) return [r, c];
  return sq[(i + (p.dir === 'cw' ? 1 : 3)) % 4];
}

/**
 * A beat-by-beat runner for a puzzle: `start()` gives the state before the first beat and
 * `beat(state, t, d)` the state after beat t with move d (null = wait), without touching the old
 * state. A state is { ar, ac, items, got, ev, bumped, turned }; `ev` is set once the run has
 * ended: 'escaped', 'virus' or 'alarm'. With `ignoreData` (hacking) the data file doesn't matter.
 */
export function runner(p, { ignoreData = false } = {}) {
  const walls = new Set(p.walls.map(([r, c]) => key(r, c)));
  const start = () => {
    const items = {};
    for (const k of ['data', 'exit', 'virus', 'alarm']) if (p[k]) items[k] = p[k].slice();
    return { ar: p.agent[0], ac: p.agent[1], items, got: false, ev: null, bumped: false, turned: [] };
  };
  const check = (s) => {
    const at = (k) => s.items[k] && s.items[k][0] === s.ar && s.items[k][1] === s.ac;
    if (at('alarm')) return 'alarm';
    if (at('virus')) return 'virus';
    if (at('data')) s.got = true;
    if (at('exit') && (s.got || ignoreData)) return 'escaped';
    return null;
  };
  const beat = (prev, t, d) => {
    const s = { ...prev, items: { ...prev.items }, bumped: false, turned: [] };
    if (d !== null && d !== undefined) {
      const r = s.ar + DR[d], c = s.ac + DC[d];
      if (inside(r, c) && !walls.has(key(r, c))) { s.ar = r; s.ac = c; } else s.bumped = true;
    }
    s.ev = check(s);
    if (!s.ev) {
      p.platforms.forEach((pl, i) => {
        if (!pl.at.includes(t)) return;
        s.turned.push(i);
        [s.ar, s.ac] = turnSquare(pl, s.ar, s.ac);
        for (const k of Object.keys(s.items)) s.items[k] = turnSquare(pl, s.items[k][0], s.items[k][1]);
      });
      if (s.turned.length) s.ev = check(s);
    }
    return s;
  };
  return { start, beat };
}

/**
 * Run a program. `program` is an array of T slots, each null (wait) or a direction 0–3.
 * Returns { result, step, frames, visited } where result is
 *   'escaped'  reached the exit holding the data     'virus'  walked into the virus
 *   'alarm'    set off the alarm                     'lost'   the program ended elsewhere
 * frames: one per beat — { t, move, bumped, agent: [r,c], items: {data, exit, virus, alarm},
 * turned: [platform indices], got } — for the animation. The run stops at the first of
 * escaped / virus / alarm.
 */
export function simulate(p, program, opts = {}) {
  const { start, beat } = runner(p, opts);
  let s = start();
  const frames = [], visited = [[s.ar, s.ac]];
  for (let t = 0; t < program.length; t++) {
    s = beat(s, t, program[t]);
    visited.push([s.ar, s.ac]);
    frames.push({ t, move: program[t] ?? null, bumped: s.bumped, agent: [s.ar, s.ac], items: JSON.parse(JSON.stringify(s.items)), turned: s.turned, got: s.got });
    if (s.ev) return { result: s.ev, step: t, frames, visited };
  }
  return { result: 'lost', step: program.length - 1, frames, visited };
}

// ---------- the three phases ----------

/**
 * Every code-phase answer (up to `limit`): programs (arrays of T slots) that place all the given
 * tiles — `p.tiles` is the multiset of directions to place, `p.locked` [{ slot, dir }] are fixed —
 * and escape. Searched beat by beat, simulating as it goes.
 */
export function codeSolutions(p, { limit = 2 } = {}) {
  const T = p.T;
  const { start, beat } = runner(p);
  const lockedAt = new Map(p.locked.map((l) => [l.slot, l.dir]));
  const lastLocked = Math.max(-1, ...lockedAt.keys());
  const left = [0, 0, 0, 0];
  for (const d of p.tiles) left[d]++;
  let freeLeft = T - p.locked.length; // unlocked slots not yet decided
  let toPlace = p.tiles.length;
  const program = new Array(T).fill(null);
  const sols = [];
  // state = the run after beats 0..t-1
  function go(t, state) {
    if (sols.length >= limit) return;
    if (state.ev) {
      // ended early: an escape counts only once every tile has run
      if (state.ev === 'escaped' && toPlace === 0 && lastLocked < t) sols.push(program.slice());
      return;
    }
    if (t === T) return; // the program ran out without escaping
    if (lockedAt.has(t)) { program[t] = lockedAt.get(t); go(t + 1, beat(state, t, program[t])); program[t] = null; return; }
    freeLeft--;
    if (freeLeft >= toPlace) go(t + 1, beat(state, t, null)); // leave it empty: a wait
    for (let d = 0; d < 4; d++) {
      if (!left[d] || sols.length >= limit) continue;
      left[d]--; toPlace--;
      program[t] = d;
      go(t + 1, beat(state, t, d));
      program[t] = null;
      left[d]++; toPlace++;
    }
    freeLeft++;
  }
  go(0, start());
  return sols;
}

/**
 * All the timings of a program's tiles: the same tiles in the same order, locked tiles in their
 * slots, the rest anywhere between their neighbours. `links` = indices i such that tile i and tile
 * i+1 must stay back to back. Returns arrays of slot numbers, one per tile.
 */
export function timings(program, lockedSlots = [], links = []) {
  const tiles = [];
  program.forEach((d, s) => { if (d !== null) tiles.push({ d, s, locked: lockedSlots.includes(s) }); });
  const T = program.length, out = [];
  const slots = new Array(tiles.length);
  const linked = new Set(links);
  function go(i, from) {
    if (i === tiles.length) { out.push(slots.slice()); return; }
    const tl = tiles[i];
    const lo = i > 0 && linked.has(i - 1) ? slots[i - 1] + 1 : from;
    const hi = i > 0 && linked.has(i - 1) ? slots[i - 1] + 1 : T - (tiles.length - i);
    for (let s = lo; s <= hi; s++) {
      if (tl.locked && s !== tl.s) continue;
      slots[i] = s;
      go(i + 1, s + 1);
    }
  }
  go(0, 0);
  return { tiles, list: out };
}

const programOf = (T, tiles, slots) => { const pr = new Array(T).fill(null); tiles.forEach((tl, i) => { pr[slots[i]] = tl.d; }); return pr; };

/** Timings of the code answer that reach the virus (the hacks), given linked pairs. */
export function hacks(p, program, links = []) {
  const lockedSlots = p.locked.map((l) => l.slot);
  const { tiles, list } = timings(program, lockedSlots, links);
  return list.filter((slots) => simulate(p, programOf(p.T, tiles, slots), { ignoreData: true }).result === 'virus');
}

/** Link positions (pair index i = tiles i and i+1) that run back to back and stop every hack. */
export function fixes(p, program) {
  const { tiles } = timings(program, p.locked.map((l) => l.slot));
  const out = [];
  for (let i = 0; i + 1 < tiles.length; i++) {
    if (tiles[i + 1].s !== tiles[i].s + 1) continue;
    if (!hacks(p, program, [i]).length) out.push(i);
  }
  return out;
}

// ---------- puzzles ----------

/**
 * Levels: T = program slots, tiles = move tiles in the program, `free` = how many of them the
 * player places (the rest are locked in), platforms, walls, and whether there's an alarm.
 */
export const LEVELS = [
  { name: '입문', T: 6, tiles: [3, 4], free: [2, 3], platforms: [1, 1], walls: [1, 2], alarm: false },
  { name: '초급', T: 7, tiles: [4, 5], free: [3, 4], platforms: [1, 1], walls: [1, 3], alarm: true },
  { name: '중급', T: 8, tiles: [5, 6], free: [4, 5], platforms: [1, 2], walls: [2, 3], alarm: true },
  { name: '고급', T: 9, tiles: [6, 7], free: [4, 5], platforms: [2, 2], walls: [2, 4], alarm: true },
];

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const between = (rnd, [a, b]) => a + Math.floor(rnd() * (b - a + 1));
const pick = (rnd, a) => a[Math.floor(rnd() * a.length)];
function shuffleWith(rnd, a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];

/**
 * Puzzle n of a level (1-based), always the same for the same numbers. `program` is one working
 * answer (for hints); `answers` how many working programs there are — every one of them can be
 * hacked and fixed.
 */
export function puzzle(level, n) {
  const L = LEVELS[level - 1];
  for (let attempt = 0; ; attempt++) {
    const rnd = rng((level * 7919 + n * 104729 + attempt * 15485863) ^ 0x6a09e667);
    const p = tryMake(L, rnd);
    if (p) return { level, n, id: `H${level}-${n + 1}`, ...p };
  }
}

function tryMake(L, rnd) {
  const T = L.T;
  // platforms first (2×2, apart), then walls off them
  const platforms = [];
  const onPlatform = new Set();
  for (let k = 0, want = between(rnd, L.platforms); k < 20 && platforms.length < want; k++) {
    const pl = { r: Math.floor(rnd() * (N - 1)), c: Math.floor(rnd() * (N - 1)), dir: rnd() < 0.5 ? 'cw' : 'ccw', at: [] };
    if (ring(pl).some(([r, c]) => onPlatform.has(key(r, c)))) continue;
    // it turns at two to four beats: the timing of the program matters only where platforms turn
    pl.at = shuffleWith(rnd, [...Array(T).keys()]).slice(0, between(rnd, [2, 4])).sort((a, b) => a - b);
    platforms.push(pl);
    for (const [r, c] of ring(pl)) onPlatform.add(key(r, c));
  }
  const walls = [];
  const taken = new Set(onPlatform);
  for (let k = 0, want = between(rnd, L.walls); k < 30 && walls.length < want; k++) {
    const r = Math.floor(rnd() * N), c = Math.floor(rnd() * N);
    if (taken.has(key(r, c))) continue;
    walls.push([r, c]); taken.add(key(r, c));
  }
  const free = [...Array(N * N).keys()].filter((i) => !walls.some(([r, c]) => key(r, c) === i)).map((i) => [Math.floor(i / N), i % N]);
  // the agent usually starts on a platform or next to one: that's where timing matters
  const nearPlatform = free.filter(([r, c]) => [[0, 0], ...DR.map((dr, d) => [dr, DC[d]])].some(([dr, dc]) => onPlatform.has(key(r + dr, c + dc)) && inside(r + dr, c + dc)));
  const agent = pick(rnd, nearPlatform.length && rnd() < 0.8 ? nearPlatform : free);
  const base = { T, walls, platforms, agent };

  // a random program whose tiles all do something: each tile is chosen, beat by beat, among the
  // moves that don't run into a wall or off the board at that moment
  const nTiles = between(rnd, L.tiles);
  const slots = shuffleWith(rnd, [...Array(T).keys()]).slice(0, nTiles).sort((a, b) => a - b);
  const program = new Array(T).fill(null);
  const wallSet = new Set(walls.map(([r, c]) => key(r, c)));
  for (const s of slots) {
    const before = simulate({ ...base }, program.slice(0, s));
    const [r0, c0] = before.visited[before.visited.length - 1];
    const ok = shuffleWith(rnd, [0, 1, 2, 3]).filter((d) => inside(r0 + DR[d], c0 + DC[d]) && !wallSet.has(key(r0 + DR[d], c0 + DC[d])));
    if (!ok.length) return null;
    // the last move ends on solid ground if it can: the exit goes there
    const last = s === slots[slots.length - 1];
    program[s] = (last ? ok.find((d) => !onPlatform.has(key(r0 + DR[d], c0 + DC[d]))) : undefined) ?? ok[0];
  }
  // Items on a platform ride it, so where to put the exit and the data file is found by trying
  // every square: the exit where the run ends exactly on its last tile, the data file somewhere the
  // agent picks it up on the way there.
  const lastTile = slots[slots.length - 1];
  const squares = [...Array(N * N).keys()].map((q) => [Math.floor(q / N), q % N]).filter((q) => !same(q, agent) && !walls.some((w) => same(w, q)));
  const exits = squares.filter((x) => { const r = simulate({ ...base, exit: x }, program, { ignoreData: true }); return r.result === 'escaped' && r.step >= lastTile; });
  if (!exits.length) return null;
  const exit = pick(rnd, exits);
  const datas = squares.filter((d) => { if (same(d, exit)) return false; const r = simulate({ ...base, exit, data: d }, program); return r.result === 'escaped' && r.step >= lastTile; });
  if (!datas.length) return null;
  const data = pick(rnd, datas);
  const pz = { ...base, data, exit, virus: null, alarm: null };
  const check = simulate(pz, program);

  // the virus: a square some other timing reaches but the answer never touches. Every timing of
  // the tiles is run once (exit in place, no data needed); a square's hacks are the timings that
  // pass through it, and a link works if no hack keeps that pair back to back.
  const { tiles, list } = timings(program, []);
  const onPath = new Set(check.visited.map(([r, c]) => key(r, c)));
  const answerPairs = tiles.map((_, i) => i).filter((i) => i + 1 < tiles.length && tiles[i + 1].s === tiles[i].s + 1);
  const through = new Map(); // square → timings that pass it
  for (const sl of list) {
    const v = simulate({ ...pz, data: null }, programOf(T, tiles, sl), { ignoreData: true }).visited;
    for (const q of new Set(v.map(([r, c]) => key(r, c)))) {
      if (onPath.has(q) || onPlatform.has(q) || taken.has(q)) continue;
      if (!through.has(q)) through.set(q, []);
      through.get(q).push(sl);
    }
  }
  let chosen = null;
  for (const q of shuffleWith(rnd, [...through.keys()])) {
    const hs = through.get(q);
    const fx = answerPairs.filter((i) => hs.every((sl) => sl[i + 1] !== sl[i] + 1));
    if (fx.length && (!chosen || fx.length < chosen.n)) chosen = { virus: [Math.floor(q / N), q % N], n: fx.length };
    if (chosen?.n === 1) break;
  }
  if (!chosen || chosen.n > 3) return null;

  // an alarm on a tempting square next to the path
  let alarm = null;
  if (L.alarm) {
    const near = [];
    for (const [r, c] of check.visited) for (let d = 0; d < 4; d++) {
      const q = [r + DR[d], c + DC[d]];
      if (!inside(q[0], q[1]) || onPath.has(key(q[0], q[1])) || onPlatform.has(key(q[0], q[1])) || walls.some((w) => same(w, q)) || same(q, chosen.virus)) continue;
      near.push(q);
    }
    if (near.length) alarm = pick(rnd, near);
  }
  const full = { ...pz, virus: chosen.virus, alarm };
  if (simulate(full, program).result !== 'escaped') return null;

  // Lock tiles until the code phase is tight enough: any working program counts, but every one of
  // them (at most 20) must be hackable and fixable, since the later phases use the player's own
  // program. As few locks as the level allows.
  const order = shuffleWith(rnd, tiles.map((_, i) => i));
  const wantFree = between(rnd, L.free);
  for (let lockN = Math.max(0, tiles.length - wantFree); lockN <= tiles.length; lockN++) {
    const lockedIdx = new Set(order.slice(0, lockN));
    const locked = tiles.filter((_, i) => lockedIdx.has(i)).map((tl) => ({ slot: tl.s, dir: tl.d }));
    const give = tiles.filter((_, i) => !lockedIdx.has(i)).map((tl) => tl.d).sort();
    const pp = { ...full, locked, tiles: give };
    const sols = codeSolutions(pp, { limit: 21 });
    if (sols.length > 20) continue;
    if (!sols.every((pr) => hacks(pp, pr).length && fixes(pp, pr).length)) continue;
    if (give.length < L.free[0]) return null;
    return { ...pp, program, answers: sols.length };
  }
  return null;
}

// ---------- a game in progress ----------

/**
 * { p, phase: 'code' | 'hack' | 'fix' | 'done', slots: [tile index | null], tiles: [{ dir, locked }],
 *   link: pair index | null, runs } — the player's tiles start in the supply (slot null).
 */
export function newGame(p) {
  const tiles = [...p.locked.map((l) => ({ dir: l.dir, locked: true, slot: l.slot })), ...p.tiles.map((d) => ({ dir: d, locked: false, slot: null }))];
  return { p, phase: 'code', tiles, link: null, runs: 0 };
}

/** The program the tiles make now. */
export function currentProgram(g) {
  const pr = new Array(g.p.T).fill(null);
  for (const t of g.tiles) if (t.slot !== null) pr[t.slot] = t.dir;
  return pr;
}

const tileAt = (g, s) => g.tiles.findIndex((t) => t.slot === s);

/** The program the player got working in the code phase (the hack and fix phases start from it). */
export function codeProgram(g) {
  const pr = new Array(g.p.T).fill(null);
  g.tiles.forEach((t, i) => { const s = g.codeSlots?.[i]; if (s !== null && s !== undefined) pr[s] = t.dir; });
  return pr;
}

/** Code phase: put tile i in slot s (an empty, unlocked slot), or back in the supply (s = null). */
export function put(g, i, s) {
  const t = g.tiles[i];
  if (g.phase !== 'code' || !t || t.locked) return false;
  if (s === null) { if (t.slot === null) return false; t.slot = null; return true; }
  if (s < 0 || s >= g.p.T || t.slot === s) return false;
  const j = tileAt(g, s);
  if (j >= 0) return false;
  t.slot = s;
  return true;
}

/**
 * Hack phase: slide tile i to slot s — only along the row, never past another tile, never a
 * locked one.
 */
export function slide(g, i, s) {
  const t = g.tiles[i];
  if (g.phase !== 'hack' || !t || t.locked || t.slot === null || s === t.slot || s < 0 || s >= g.p.T) return false;
  const lo = Math.min(s, t.slot), hi = Math.max(s, t.slot);
  for (let k = lo; k <= hi; k++) if (k !== t.slot && tileAt(g, k) >= 0) return false;
  t.slot = s;
  return true;
}

/** How far tile i can slide in the hack phase: { lo, hi } slots. */
export function slideRange(g, i) {
  const t = g.tiles[i];
  let lo = t.slot, hi = t.slot;
  while (lo - 1 >= 0 && tileAt(g, lo - 1) < 0) lo--;
  while (hi + 1 < g.p.T && tileAt(g, hi + 1) < 0) hi++;
  return { lo, hi };
}

/** Run the current program for the phase: { ok, run }. */
export function tryRun(g) {
  const pr = currentProgram(g);
  g.runs++;
  if (g.phase === 'code') {
    const unplaced = g.tiles.filter((t) => t.slot === null).length;
    const run = simulate(g.p, pr);
    return { ok: !unplaced && run.result === 'escaped', unplaced, run };
  }
  if (g.phase === 'hack') {
    const run = simulate(g.p, pr, { ignoreData: true });
    return { ok: run.result === 'virus', run };
  }
  return { ok: false, run: simulate(g.p, pr) };
}

/** Move on after a phase is solved; the hack phase starts from the working program. */
export function advance(g) {
  if (g.phase === 'code') {
    g.phase = 'hack';
    g.codeSlots = g.tiles.map((t) => t.slot);
  } else if (g.phase === 'hack') {
    g.phase = 'fix';
    g.tiles.forEach((t, i) => { t.slot = g.codeSlots[i]; }); // back to the working program
  } else if (g.phase === 'fix') g.phase = 'done';
  return g.phase;
}

/**
 * The tile pairs that run back to back in the working program (each as [i, j] tile indices, in
 * program order) — the places a link can go.
 */
export function linkable(g) {
  const bySlot = g.tiles.map((t, i) => [t.slot, i]).filter(([s]) => s !== null).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (let k = 0; k + 1 < bySlot.length; k++) if (bySlot[k + 1][0] === bySlot[k][0] + 1) out.push({ pair: k, tiles: [bySlot[k][1], bySlot[k + 1][1]] });
  return out;
}

/** Fix phase: link pair k (in program order). Returns { ok, hacks } — ok if no hack remains. */
export function link(g, k) {
  if (g.phase !== 'fix') return { ok: false, hacks: 0 };
  g.link = k;
  const hs = hacks(g.p, currentProgram(g), [k]);
  return { ok: hs.length === 0, hacks: hs.length };
}

/** A hint for the phase: code → { tile, slot }; hack → a slot layout that works; fix → pair. */
export function hint(g) {
  if (g.phase === 'code') {
    const target = g.p.program, now = currentProgram(g);
    for (let s = 0; s < g.p.T; s++) {
      if (target[s] === null || now[s] === target[s]) continue;
      // a tile of the right direction that isn't already where it belongs
      const i = g.tiles.findIndex((t) => !t.locked && t.dir === target[s] && (t.slot === null || target[t.slot] !== t.dir));
      if (i >= 0) return { phase: 'code', tile: i, slot: s };
    }
    // everything wanted is placed; a tile in a slot that should be empty goes back
    const stray = g.tiles.findIndex((t) => !t.locked && t.slot !== null && target[t.slot] !== t.dir);
    return stray >= 0 ? { phase: 'code', tile: stray, slot: null } : null;
  }
  if (g.phase === 'hack') {
    const mine = codeProgram(g);
    const hs = hacks(g.p, mine);
    if (!hs.length) return null;
    const { tiles } = timings(mine, g.p.locked.map((l) => l.slot));
    // the hack closest to where the tiles are now
    const cur = g.tiles.map((t) => t.slot).filter((s) => s !== null).sort((a, b) => a - b);
    const best = hs.map((sl) => [sl.reduce((a, s, i) => a + Math.abs(s - cur[i]), 0), sl]).sort((a, b) => a[0] - b[0])[0][1];
    return { phase: 'hack', slots: best, order: tiles.map((tl) => tl.s) };
  }
  if (g.phase === 'fix') return { phase: 'fix', pair: fixes(g.p, currentProgram(g))[0] };
  return null;
}
