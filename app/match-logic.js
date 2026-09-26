// 성냥개비 (Matchsticks) rules engine: equation puzzles in seven-segment digits and + − × =,
// and shape puzzles on square and triangle lattices. Generates puzzles from a seed, finds every
// answer by exhaustive search (so a puzzle is only offered when it's solvable in exactly the
// stated number of moves, with few answers), rates difficulty, checks a player's board and gives
// hints. Pure: no DOM; the same seed always makes the same puzzle.

// ---------- randomness ----------

/** A seeded generator (mulberry32). */
export function rng(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.int = (n) => Math.floor(next() * n);
  next.pick = (a) => a[Math.floor(next() * a.length)];
  return next;
}

const popcount = (m) => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
const bitsOf = (m) => { const out = []; for (let i = 0; m; i++, m >>= 1) if (m & 1) out.push(i); return out; };

// ---------- equations: glyphs ----------

// Seven segments, bit order a b c d e f g: a top, b top-right, c bottom-right, d bottom,
// e bottom-left, f top-left, g middle.
export const SEGMENTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const seg = (s) => [...s].reduce((m, ch) => m | (1 << SEGMENTS.indexOf(ch)), 0);
export const DIGIT_MASK = [seg('abcdef'), seg('bc'), seg('abdeg'), seg('abcdg'), seg('bcfg'), seg('acdfg'), seg('acdefg'), seg('abc'), seg('abcdefg'), seg('abcdfg')];
const DIGIT_OF = new Map(DIGIT_MASK.map((m, d) => [m, String(d)]));

// A symbol cell's slots: h middle horizontal, v vertical, t upper and b lower horizontal (for =),
// x and y the two diagonals (for ×).
export const SYMBOL_SLOTS = ['h', 'v', 't', 'b', 'x', 'y'];
const sym = (s) => [...s].reduce((m, ch) => m | (1 << SYMBOL_SLOTS.indexOf(ch)), 0);
export const SYMBOL_MASK = { '+': sym('hv'), '-': sym('h'), '=': sym('tb'), '*': sym('xy') };
const SYMBOL_OF = new Map(Object.entries(SYMBOL_MASK).map(([c, m]) => [m, c]));
export const PRETTY = { '-': '−', '*': '×' };

/** Cells of an equation written like '6+4=4' ('-' minus, '*' times). */
export function cellsOf(text) {
  return [...text].map((ch) => (/\d/.test(ch) ? { t: 'd', m: DIGIT_MASK[Number(ch)] } : { t: 's', m: SYMBOL_MASK[ch] }));
}
/** The text a row of cells reads as, with '?' for anything that isn't a glyph. */
export function textOf(cells) {
  return cells.map((c) => (c.t === 'd' ? DIGIT_OF.get(c.m) : SYMBOL_OF.get(c.m)) ?? '?').join('');
}
export const pretty = (text) => text.replace(/[-*]/g, (c) => PRETTY[c]).replace(/([+\-−×*=])/g, ' $1 ').replace(/\s+/g, ' ').trim();

/**
 * Read an equation: numbers (no leading zeros) and + − × between them, exactly one '='.
 * Returns { lhs, rhs, ok } with ok = both sides equal, or null if it doesn't read as one.
 */
export function evaluate(text) {
  if (text.includes('?')) return null;
  const sides = text.split('=');
  if (sides.length !== 2) return null;
  const vals = sides.map(side);
  if (vals.includes(null)) return null;
  return { lhs: vals[0], rhs: vals[1], ok: vals[0] === vals[1] };
}
function side(s) {
  const toks = s.match(/\d+|[+\-*]/g);
  if (!toks || toks.join('') !== s) return null;
  if (toks.length % 2 === 0) return null;
  for (let i = 0; i < toks.length; i++) {
    const num = i % 2 === 0;
    if (num !== /^\d+$/.test(toks[i])) return null;
    if (num && toks[i].length > 1 && toks[i][0] === '0') return null;
  }
  // × first, then + and − left to right
  const terms = [];
  let cur = Number(toks[0]);
  const ops = [];
  for (let i = 1; i < toks.length; i += 2) {
    const op = toks[i], n = Number(toks[i + 1]);
    if (op === '*') cur *= n;
    else { terms.push(cur); ops.push(op); cur = n; }
  }
  terms.push(cur);
  let v = terms[0];
  ops.forEach((op, i) => { v = op === '+' ? v + terms[i + 1] : v - terms[i + 1]; });
  return v;
}

// every glyph a cell of each type can become
const OPTIONS = {
  d: DIGIT_MASK.map((m) => m),
  s: Object.values(SYMBOL_MASK),
};

/**
 * Every board reachable from `cells` by the given change — mode 'move' (k sticks picked up and
 * put down elsewhere), 'remove' (k taken away) or 'add' (k new ones placed) — that passes
 * `keep(text)`. Each cell stays a digit or a symbol. Returns [{ cells, text, changed }].
 */
export function reach(cells, k, mode, keep) {
  const out = [];
  const pick = new Array(cells.length);
  const walk = (i, R, A, changed) => {
    if (R > k || A > k) return;
    if (mode === 'remove' && A) return;
    if (mode === 'add' && R) return;
    if (i === cells.length) {
      const need = mode === 'move' ? R === k && A === k : mode === 'remove' ? R === k : A === k;
      if (!need || !changed) return;
      const next = cells.map((c, j) => ({ t: c.t, m: pick[j] }));
      const text = textOf(next);
      if (keep(text)) out.push({ cells: next, text, changed: cells.map((c, j) => c.m !== pick[j]) });
      return;
    }
    const m0 = cells[i].m;
    for (const m of OPTIONS[cells[i].t]) {
      pick[i] = m;
      walk(i + 1, R + popcount(m0 & ~m), A + popcount(m & ~m0), changed || m !== m0);
    }
  };
  walk(0, 0, 0, false);
  return out;
}

const isTrue = (text) => evaluate(text)?.ok === true;
const isFalse = (text) => evaluate(text)?.ok === false;

/** All answers to an equation puzzle: true equations exactly k changes away. */
export function solveEquation(cells, k, mode) {
  return reach(cells, k, mode, isTrue);
}

// ---------- equation generation ----------

export const EQ_LEVELS = [
  { name: '한 개 옮기기', moves: [1], modes: ['move'], forms: ['a+b=c', 'a-b=c'], max: 9, maxAnswers: 2, opChange: false },
  { name: '연산자까지', moves: [1], modes: ['move'], forms: ['a+b=c', 'a-b=c', 'a*b=c'], max: 20, maxAnswers: 2, opChange: true },
  { name: '빼기 · 더하기', moves: [1, 2], modes: ['remove', 'add'], forms: ['a+b=c', 'a-b=c', 'a*b=c'], max: 60, maxAnswers: 2, opChange: true },
  { name: '두 개 옮기기', moves: [2], modes: ['move'], forms: ['a+b=c', 'a-b=c', 'a*b=c'], max: 99, maxAnswers: 1, opChange: true },
  { name: '세 개 옮기기', moves: [2, 3, 3], modes: ['move'], forms: ['a+b=c', 'a-b=c', 'a+b-c=d', 'a*b=c'], max: 99, maxAnswers: 1, opChange: true },
];

/** A true equation of the given form with every number between 0 and max. */
function trueEquation(r, form, max) {
  for (let tries = 0; tries < 200; tries++) {
    const n = () => r.int(Math.min(max, 99) + 1);
    let text;
    if (form === 'a+b=c') { const a = n(), b = n(); text = `${a}+${b}=${a + b}`; }
    else if (form === 'a-b=c') { const a = n(), b = r.int(a + 1); text = `${a}-${b}=${a - b}`; }
    else if (form === 'a*b=c') { const a = r.int(10), b = r.int(10); text = `${a}*${b}=${a * b}`; }
    else { const a = n(), b = n(), c = r.int(a + b + 1); text = `${a}+${b}-${c}=${a + b - c}`; }
    const nums = text.match(/\d+/g).map(Number);
    if (nums.every((x) => x <= max) && isTrue(text)) return text;
  }
  return null;
}

const INVERSE = { move: 'move', remove: 'add', add: 'remove' };

/**
 * An equation puzzle for a level: { kind: 'equation', level, seed, cells, text, moves, mode,
 * answers: [text], stars, … }. Deterministic in (seed, level); null only if nothing fits.
 */
export function makeEquation(seed, level = 1) {
  const L = EQ_LEVELS[Math.max(1, Math.min(EQ_LEVELS.length, level)) - 1];
  const r = rng(seed * 7919 + level);
  for (let tries = 0; tries < 400; tries++) {
    const truth = trueEquation(r, r.pick(L.forms), L.max);
    if (!truth) continue;
    const k = r.pick(L.moves), mode = r.pick(L.modes);
    // scramble: the reverse change from the truth, onto a board that reads as a false equation
    const scrambles = reach(cellsOf(truth), k, INVERSE[mode], isFalse);
    if (!scrambles.length) continue;
    const start = r.pick(scrambles);
    const answers = solveEquation(start.cells, k, mode);
    if (!answers.length || answers.length > L.maxAnswers) continue;
    // exactly k: nothing smaller already fixes it
    let shorter = false;
    for (let j = 1; j < k && !shorter; j++) shorter = solveEquation(start.cells, j, mode).length > 0;
    if (shorter) continue;
    const feats = features(start.cells, answers);
    if (!L.opChange && feats.symbolChange) continue;
    return {
      kind: 'equation', level, seed, id: `E${level}-${seed}`,
      cells: start.cells, text: start.text, moves: k, mode,
      answers: answers.map((a) => a.text), truth,
      stars: stars(k, feats, answers.length), ...feats,
    };
  }
  return null;
}

function features(cells, answers) {
  const a = answers[0];
  const changed = a.changed.filter(Boolean).length;
  const symbolChange = answers.every((x) => x.cells.some((c, i) => c.t === 's' && c.m !== cells[i].m));
  // a stick crossing from one glyph to another (not just rearranged inside one)
  const crossCell = a.cells.some((c, i) => popcount(c.m) !== popcount(cells[i].m));
  return { changedCells: changed, symbolChange, crossCell, digits: cells.filter((c) => c.t === 'd').length };
}
function stars(k, f, answers) {
  let s = k + (f.symbolChange ? 1 : 0) + (f.crossCell ? 0.5 : 0) + (f.digits > 4 ? 0.5 : 0) + (answers === 1 ? 0.5 : 0);
  return Math.max(1, Math.min(3, Math.round(s / 1.5)));
}

// ---------- shapes: lattices ----------

/**
 * A lattice: points, unit edges (the stick slots) and every shape that can be made of them.
 * 'square' — a w×h grid of unit squares; shapes are squares of every size.
 * 'triangle' — a w×h parallelogram of rhombi (two unit triangles each); shapes are the up- and
 * down-pointing triangles of every size.
 * Points carry drawing coordinates (x, y) in stick lengths.
 */
export function lattice(kind, w, h) {
  const pts = [], at = new Map();
  for (let v = 0; v <= h; v++) for (let u = 0; u <= w; u++) {
    const x = kind === 'square' ? u : u + v / 2, y = kind === 'square' ? v : (v * Math.sqrt(3)) / 2;
    at.set(`${u},${v}`, pts.length);
    pts.push({ u, v, x, y });
  }
  const slots = [], slotAt = new Map();
  const edge = (u1, v1, u2, v2) => {
    const a = at.get(`${u1},${v1}`), b = at.get(`${u2},${v2}`);
    if (a === undefined || b === undefined) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (slotAt.has(key)) return;
    slotAt.set(key, slots.length);
    slots.push({ a, b });
  };
  for (let v = 0; v <= h; v++) for (let u = 0; u <= w; u++) {
    edge(u, v, u + 1, v);
    edge(u, v, u, v + 1);
    if (kind === 'triangle') edge(u + 1, v, u, v + 1);
  }
  const slotOf = (u1, v1, u2, v2) => {
    const a = at.get(`${u1},${v1}`), b = at.get(`${u2},${v2}`);
    return slotAt.get(a < b ? `${a}-${b}` : `${b}-${a}`);
  };
  // a straight side of s unit sticks from (u,v) stepping (du,dv)
  const sideOf = (u, v, du, dv, s) => {
    const out = [];
    for (let i = 0; i < s; i++) {
      const e = slotOf(u + du * i, v + dv * i, u + du * (i + 1), v + dv * (i + 1));
      if (e === undefined) return null;
      out.push(e);
    }
    return out;
  };
  const shapes = [];
  const add = (type, size, sides) => { if (sides.every(Boolean)) shapes.push({ type, size, edges: sides.flat() }); };
  for (let s = 1; s <= Math.max(w, h); s++) for (let v = 0; v <= h - s; v++) for (let u = 0; u <= w - s; u++) {
    if (kind === 'square') add('square', s, [sideOf(u, v, 1, 0, s), sideOf(u, v + s, 1, 0, s), sideOf(u, v, 0, 1, s), sideOf(u + s, v, 0, 1, s)]);
    else {
      add('up', s, [sideOf(u, v, 1, 0, s), sideOf(u, v, 0, 1, s), sideOf(u + s, v, -1, 1, s)]);
      add('down', s, [sideOf(u + s, v, 0, 1, s), sideOf(u, v + s, 1, 0, s), sideOf(u + s, v, -1, 1, s)]);
    }
  }
  const byEdge = slots.map(() => []);
  shapes.forEach((sh, i) => { for (const e of sh.edges) byEdge[e].push(i); });
  return { kind, w, h, pts, slots, shapes, byEdge };
}

/** How many shapes a set of sticks makes, and how many sticks belong to none of them. */
export function countShapes(lat, on) {
  const whole = lat.shapes.map((sh) => sh.edges.every((e) => on[e]));
  let count = 0;
  for (const x of whole) if (x) count++;
  let loose = 0;
  for (let e = 0; e < on.length; e++) if (on[e] && !lat.byEdge[e].some((i) => whole[i])) loose++;
  return { count, loose };
}

/** k-combinations of a list, calling fn with a reused array. */
function combos(list, k, fn, start = 0, acc = []) {
  if (acc.length === k) { fn(acc); return; }
  for (let i = start; i <= list.length - (k - acc.length); i++) { acc.push(list[i]); combos(list, k, fn, i + 1, acc); acc.pop(); }
}

/** Per-lattice bitmasks (two 32-bit words, lattices up to 64 sticks) for fast counting. */
function masks(lat) {
  if (lat.masks) return lat.masks;
  const n = lat.shapes.length, lo = new Uint32Array(n), hi = new Uint32Array(n);
  lat.shapes.forEach((sh, i) => { for (const e of sh.edges) { if (e < 32) lo[i] |= 1 << e; else hi[i] |= 1 << (e - 32); } });
  lat.masks = { lo, hi };
  return lat.masks;
}
const bitLo = (e) => (e < 32 ? (1 << e) >>> 0 : 0);
const bitHi = (e) => (e < 32 ? 0 : (1 << (e - 32)) >>> 0);

/**
 * Every board k changes away (move / remove / add) with no loose sticks and at least one shape,
 * as { on, count, key } — key a string of the sticks, for comparing boards.
 */
export function reachShapes(lat, on0, k, mode) {
  if (lat.slots.length > 64) throw new Error('lattice too big');
  const { lo: SL, hi: SH } = masks(lat);
  const n = SL.length;
  const full = [], empty = [];
  let lo = 0, hi = 0;
  on0.forEach((x, i) => { (x ? full : empty).push(i); if (x) { lo |= bitLo(i); hi |= bitHi(i); } });
  lo >>>= 0; hi >>>= 0;
  const out = [];
  const visit = (L, H) => {
    let count = 0, ul = 0, uh = 0;
    for (let i = 0; i < n; i++) {
      const sl = SL[i], sh = SH[i];
      if (((L & sl) >>> 0) === sl && ((H & sh) >>> 0) === sh) { count++; ul |= sl; uh |= sh; }
    }
    if (!count || (L & ~ul) >>> 0 || (H & ~uh) >>> 0) return;
    const on = new Array(lat.slots.length);
    for (let e = 0; e < on.length; e++) on[e] = (e < 32 ? (L >>> e) & 1 : (H >>> (e - 32)) & 1);
    out.push({ on, count, key: on.join('') });
  };
  const takes = [];
  if (mode === 'add') takes.push([]);
  else combos(full, k, (t) => takes.push(t.slice()));
  for (const take of takes) {
    let L = lo, H = hi;
    for (const e of take) { L = (L & ~bitLo(e)) >>> 0; H = (H & ~bitHi(e)) >>> 0; }
    if (mode === 'remove') { visit(L, H); continue; }
    combos(empty, k, (put) => {
      let L2 = L, H2 = H;
      for (const e of put) { L2 = (L2 | bitLo(e)) >>> 0; H2 = (H2 | bitHi(e)) >>> 0; }
      visit(L2, H2);
    });
  }
  return out;
}
const keyOf = (on) => on.map((x) => (x ? 1 : 0)).join('');

// ---------- shape generation ----------

export const SHAPE_LEVELS = [
  { name: '빼서 맞추기', kind: 'square', size: [4, 3], cells: [4, 7], moves: [1, 2, 3], modes: ['remove'], maxAnswers: 2 },
  { name: '옮겨 맞추기', kind: 'square', size: [4, 3], cells: [4, 7], moves: [1, 2], modes: ['move'], maxAnswers: 2 },
  { name: '삼각형', kind: 'triangle', size: [4, 2], cells: [4, 8], moves: [1, 2], modes: ['remove', 'move'], maxAnswers: 2 },
  { name: '세 개 옮기기', kind: 'square', size: [4, 3], cells: [5, 8], moves: [2, 3, 3], modes: ['move'], maxAnswers: 1 },
  { name: '삼각형 · 세 개', kind: 'triangle', size: [4, 2], cells: [6, 9], moves: [2, 3, 3], modes: ['move'], maxAnswers: 1 },
];

/** A connected figure of n unit cells (squares, or triangles), as its set of sticks. */
function figure(r, lat, n) {
  const cells = lat.shapes.filter((s) => s.size === 1);
  const touching = (a, b) => a.edges.some((e) => b.edges.includes(e));
  const chosen = [r.pick(cells)];
  while (chosen.length < n) {
    const next = cells.filter((c) => !chosen.includes(c) && chosen.some((x) => touching(x, c)));
    if (!next.length) break;
    chosen.push(r.pick(next));
  }
  const on = new Array(lat.slots.length).fill(0);
  for (const c of chosen) for (const e of c.edges) on[e] = 1;
  return on;
}

const NOUN = { square: '정사각형', triangle: '삼각형' };

/**
 * A shape puzzle: { kind: 'shape', lattice, on, moves, mode, target, answers: [key], … } —
 * "move k sticks so there are exactly target squares (triangles), with no stick left over".
 * The target is picked from what exhaustive search says is reachable in exactly k changes and
 * no fewer, with at most a few different answers.
 */
export function makeShape(seed, level = 1) {
  const L = SHAPE_LEVELS[Math.max(1, Math.min(SHAPE_LEVELS.length, level)) - 1];
  const r = rng(seed * 104729 + level);
  const lat = lattice(L.kind, ...L.size);
  for (let tries = 0; tries < 60; tries++) {
    const on = figure(r, lat, L.cells[0] + r.int(L.cells[1] - L.cells[0] + 1));
    const now = countShapes(lat, on);
    if (now.loose) continue;
    const k = r.pick(L.moves), mode = r.pick(L.modes);
    if (mode === 'remove' && on.filter(Boolean).length <= k + 3) continue;
    const reached = reachShapes(lat, on, k, mode);
    // counts already reachable with fewer changes (or none) don't make a k-change puzzle
    const easier = new Set([now.count]);
    for (let j = 1; j < k; j++) for (const x of reachShapes(lat, on, j, mode)) easier.add(x.count);
    const byCount = new Map();
    for (const x of reached) if (!easier.has(x.count)) (byCount.get(x.count) ?? byCount.set(x.count, []).get(x.count)).push(x);
    const fits = [...byCount.entries()].filter(([, xs]) => xs.length <= L.maxAnswers);
    if (!fits.length) continue;
    const [target, answers] = r.pick(fits);
    return {
      kind: 'shape', level, seed, id: `S${level}-${seed}`,
      shape: L.kind, size: L.size, lattice: lat, on, moves: k, mode, target, now: now.count,
      answers: answers.map((a) => a.key),
      prompt: `성냥 ${k}개를 ${mode === 'remove' ? '빼서' : '옮겨'} ${NOUN[L.kind]} ${target}개를 만드세요`,
      stars: Math.max(1, Math.min(3, k + (L.kind === 'triangle' ? 1 : 0) - (mode === 'remove' ? 1 : 0))),
    };
  }
  return null;
}

// ---------- playing a puzzle ----------

/** Any puzzle: type 'equation' | 'shape', level 1..5. */
export function makePuzzle(seed, { type = 'equation', level = 1 } = {}) {
  return type === 'shape' ? makeShape(seed, level) : makeEquation(seed, level);
}

/** The prompt shown above an equation puzzle. */
export function promptOf(p) {
  if (p.kind === 'shape') return p.prompt;
  const verb = { move: '옮겨', remove: '빼서', add: '더해' }[p.mode];
  return `성냥 ${p.moves}개를 ${verb} 식을 참으로 만드세요`;
}

/**
 * How far a board is from where the puzzle started, in the puzzle's terms: sticks taken away and
 * sticks put down. For equations `board` is cells; for shapes, the on-array.
 */
export function changes(p, board) {
  let removed = 0, added = 0;
  if (p.kind === 'equation') p.cells.forEach((c, i) => { removed += popcount(c.m & ~board[i].m); added += popcount(board[i].m & ~c.m); });
  else p.on.forEach((x, i) => { if (x && !board[i]) removed++; if (!x && board[i]) added++; });
  return { removed, added };
}

/**
 * Judge a board: { done } once the stated number of changes is made; { solved } when the board is
 * one of the answers (for equations, any true equation reached in that many changes counts).
 */
export function check(p, board) {
  const { removed, added } = changes(p, board);
  const used = p.mode === 'add' ? added : removed;
  const done = used >= p.moves && (p.mode !== 'move' || added >= p.moves);
  let solved = false;
  if (p.kind === 'equation') {
    const text = textOf(board);
    solved = done && isTrue(text) && (p.mode !== 'move' || removed === added);
    return { done, solved, text, removed, added };
  }
  const c = countShapes(p.lattice, board);
  solved = done && !c.loose && c.count === p.target;
  return { done, solved, count: c.count, loose: c.loose, removed, added };
}

/**
 * Hints, weakest first: 1 — which glyphs (or roughly where) change; 2 — one stick to pick up.
 * For equations: { cells: [index] } then { from: [cell, slot] }; for shapes: { from: slot }.
 */
export function hint(p, step = 1) {
  if (p.kind === 'equation') {
    const target = cellsOf(p.answers[0]);
    const cells = target.map((c, i) => i).filter((i) => target[i].m !== p.cells[i].m);
    if (step === 1) return { cells };
    for (const i of cells) {
      const gone = p.cells[i].m & ~target[i].m;
      if (gone) return { from: [i, bitsOf(gone)[0]] };
    }
    return { cells };
  }
  const goal = [...p.answers[0]].map(Number);
  const from = p.on.findIndex((x, i) => x && !goal[i]);
  const to = p.on.findIndex((x, i) => !x && goal[i]);
  return step === 1 ? { area: [from, to].filter((x) => x >= 0) } : { from, to };
}
