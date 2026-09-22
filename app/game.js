// Solitaire Chess rules, solver and puzzle generator.
// Board: array of 16 cells (row-major, row 0 = top), each null or one of 'KQRBNP'.
// Every move must capture. Pawns capture diagonally upward and never promote.

export const SIZE = 4;
export const CELLS = SIZE * SIZE;

const LIMITS = { K: 1, Q: 1, R: 2, B: 2, N: 2, P: 2 };
const ORTHO = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const KNIGHT = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
const PAWN = [[-1, -1], [-1, 1]];

const inside = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

/** Squares the piece on `from` can capture. */
export function captures(board, from) {
  const type = board[from];
  if (!type) return [];
  const r = Math.floor(from / SIZE);
  const c = from % SIZE;
  const out = [];

  const step = (dirs) => {
    for (const [dr, dc] of dirs) {
      const rr = r + dr, cc = c + dc;
      if (inside(rr, cc) && board[rr * SIZE + cc]) out.push(rr * SIZE + cc);
    }
  };
  const slide = (dirs) => {
    for (const [dr, dc] of dirs) {
      let rr = r + dr, cc = c + dc;
      while (inside(rr, cc)) {
        if (board[rr * SIZE + cc]) {
          out.push(rr * SIZE + cc);
          break;
        }
        rr += dr;
        cc += dc;
      }
    }
  };

  switch (type) {
    case 'K': step([...ORTHO, ...DIAG]); break;
    case 'Q': slide([...ORTHO, ...DIAG]); break;
    case 'R': slide(ORTHO); break;
    case 'B': slide(DIAG); break;
    case 'N': step(KNIGHT); break;
    case 'P': step(PAWN); break;
  }
  return out;
}

export function allMoves(board) {
  const moves = [];
  for (let i = 0; i < CELLS; i++) {
    for (const to of captures(board, i)) moves.push([i, to]);
  }
  return moves;
}

export function applyMove(board, [from, to]) {
  const next = board.slice();
  next[to] = next[from];
  next[from] = null;
  return next;
}

const keyOf = (board) => board.map((x) => x || '.').join('');
const countPieces = (board) => board.reduce((n, x) => n + (x ? 1 : 0), 0);

/** Returns a list of [from, to] moves that clears the board down to one piece, or null. */
export function solve(board, dead = new Set()) {
  if (countPieces(board) === 1) return [];
  const key = keyOf(board);
  if (dead.has(key)) return null;
  for (const move of allMoves(board)) {
    const rest = solve(applyMove(board, move), dead);
    if (rest) return [move, ...rest];
  }
  dead.add(key);
  return null;
}

/** Number of distinct winning move sequences (used to rank puzzle difficulty). */
export function countSolutions(board, memo = new Map()) {
  if (countPieces(board) === 1) return 1;
  const key = keyOf(board);
  if (memo.has(key)) return memo.get(key);
  let total = 0;
  for (const move of allMoves(board)) total += countSolutions(applyMove(board, move), memo);
  memo.set(key, total);
  return total;
}

function randomBoard(count, rng) {
  const board = new Array(CELLS).fill(null);
  const used = { K: 0, Q: 0, R: 0, B: 0, N: 0, P: 0 };
  const types = Object.keys(LIMITS);
  let placed = 0;
  while (placed < count) {
    const type = types[Math.floor(rng() * types.length)];
    if (used[type] >= LIMITS[type]) continue;
    const sq = Math.floor(rng() * CELLS);
    if (board[sq]) continue;
    if (type === 'P' && sq < SIZE) continue; // a pawn on the top row could never move
    board[sq] = type;
    used[type]++;
    placed++;
  }
  return board;
}

/**
 * Generates a solvable puzzle with `count` pieces. Samples several solvable
 * boards and keeps the one with the fewest solutions, so it isn't trivial.
 */
export function generate(count, rng = Math.random) {
  count = Math.max(2, Math.min(8, count));
  const wanted = count >= 6 ? 60 : 12; // big boards have many solutions; sample more to find tight ones
  let best = null;
  let found = 0;
  for (let attempt = 0; attempt < 6000 && found < wanted; attempt++) {
    const board = randomBoard(count, rng);
    if (!solve(board)) continue;
    found++;
    const solutions = countSolutions(board);
    if (!best || solutions < best.solutions) best = { board, solutions };
  }
  return best ? best.board : generate(count - 1, rng);
}
