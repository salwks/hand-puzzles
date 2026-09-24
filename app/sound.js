// Recorded sound effects (Kenney, CC0) played through Web Audio: each call picks a random take
// and nudges its pitch and level, so repeated tile clacks never sound like the same sample.

const BANKS = {
  clack: 4, lift: 6, stack: 6, lay: 3, knock: 3,
  bell: 1, start: 1, win: 1, win2: 1, hit: 1, lose: 1, draw: 1, first: 1, over: 1,
};

let ctx = null, master = null, room = null;
const buffers = {};
let muted = false;
try { muted = localStorage.getItem('mj-muted') === '1'; } catch { /* storage blocked */ }

function files() {
  const out = [];
  for (const [bank, n] of Object.entries(BANKS)) {
    for (let i = 0; i < n; i++) out.push([bank, n > 1 ? `${bank}${i}` : bank]);
  }
  return out;
}

/** A short synthetic room reverb, so dry close-miked samples sit in the same room as the table. */
function makeRoom() {
  const len = Math.floor(ctx.sampleRate * 0.9);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2;
  }
  const conv = ctx.createConvolver();
  conv.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.16;
  conv.connect(wet).connect(master);
  return conv;
}

/** Browsers only allow audio after a user gesture: call from the start button's click. */
export function unlockSound() {
  if (ctx) { ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.9;
  master.connect(ctx.destination);
  room = makeRoom();
  for (const [bank, name] of files()) {
    fetch(`assets/sfx/${name}.m4a`)
      .then((r) => r.arrayBuffer())
      .then((b) => ctx.decodeAudioData(b))
      .then((buf) => { (buffers[bank] ??= []).push(buf); })
      .catch(() => {});
  }
}

/**
 * Play a random take from a bank. `pan` -1..1 places it at a seat, `rate` shifts pitch,
 * `delay` in seconds, `vol` 0..1.
 */
export function sfx(bank, { vol = 1, pan = 0, rate = 1, delay = 0, jitter = 0.06 } = {}) {
  if (!ctx || muted) return;
  const takes = buffers[bank];
  if (!takes?.length) return;
  const src = ctx.createBufferSource();
  src.buffer = takes[Math.floor(Math.random() * takes.length)];
  src.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * jitter);
  const g = ctx.createGain();
  g.gain.value = vol * (1 - Math.random() * jitter);
  const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  let node = src.connect(g);
  if (p) { p.pan.value = pan; node = node.connect(p); }
  node.connect(master);
  node.connect(room);
  src.start(ctx.currentTime + delay);
}

/** A run of clacks spread over `dur` seconds: shuffling, a hand toppling onto the table. */
export function clatter(dur, count, opts = {}) {
  for (let i = 0; i < count; i++) {
    const t = (i / count) * dur + Math.random() * (dur / count);
    sfx(Math.random() < 0.6 ? 'clack' : 'stack', { vol: 0.35 + Math.random() * 0.45, delay: t, ...opts, pan: (opts.pan ?? 0) + (Math.random() - 0.5) * 0.6 });
  }
}

export const isMuted = () => muted;
export function setMuted(on) {
  muted = on;
  try { localStorage.setItem('mj-muted', on ? '1' : '0'); } catch { /* storage blocked */ }
  if (master) master.gain.value = on ? 0 : 0.9;
}
