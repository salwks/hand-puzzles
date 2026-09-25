// 궤도 방어 sound: recorded sci-fi effects (Kenney "Sci-fi Sounds" and "Digital Audio", CC0,
// assets/sfx/orbit/) played through Web Audio — each call picks a take and nudges its pitch
// and level so rapid fire never sounds like one sample on repeat. A low engine hum loops under
// play. Shares the site's mute switch.
import { isMuted } from './sound.js';

const BANKS = {
  laser: 5, bullet: 5, hit: 5, explode: 5, boom: 2, shield: 2, emp: 1, empty: 1, pickup: 3,
  charge: 2, lock: 1, blink: 5, wave: 1, alarm: 1, phase: 1, start: 1, win: 1, over: 1, hum: 1,
};

let ctx = null, out = null, humGain = null, humSrc = null;
const buffers = {};
const last = {};

export function unlockOrbitSound() {
  if (ctx) { ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  out = ctx.createGain();
  out.gain.value = 0.85;
  out.connect(comp).connect(ctx.destination);
  for (const [bank, n] of Object.entries(BANKS)) {
    for (let i = 0; i < n; i++) {
      const name = n > 1 ? `${bank}${i}` : bank;
      fetch(`assets/sfx/orbit/${name}.m4a`)
        .then((r) => r.arrayBuffer())
        .then((b) => ctx.decodeAudioData(b))
        .then((buf) => { (buffers[bank] ??= []).push(buf); if (bank === 'hum' && humWanted) hum(true); })
        .catch(() => {});
    }
  }
}

/** Pan for a logic x position (the arena spans about ±12). */
export const panOf = (x) => Math.max(-0.8, Math.min(0.8, x / 14));

/**
 * Play a take from a bank. `gap` (seconds) drops calls that come too soon after the last one,
 * so a wave of hits doesn't pile up into a roar.
 */
function play(bank, { vol = 1, pan = 0, rate = 1, delay = 0, jitter = 0.06, gap = 0 } = {}) {
  if (!ctx || isMuted()) return;
  const takes = buffers[bank];
  if (!takes?.length) return;
  const now = ctx.currentTime;
  if (gap && now - (last[bank] ?? -1) < gap) return;
  last[bank] = now;
  const src = ctx.createBufferSource();
  src.buffer = takes[Math.floor(Math.random() * takes.length)];
  src.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * jitter);
  const g = ctx.createGain();
  g.gain.value = vol * (1 - Math.random() * jitter);
  let node = src.connect(g);
  if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; node = node.connect(p); }
  node.connect(out);
  src.start(now + delay);
}

let humWanted = false;
/** The ship's engine, a quiet loop under play. */
function hum(on) {
  humWanted = on;
  if (!ctx) return;
  if (on && !humSrc && buffers.hum?.length) {
    humGain = ctx.createGain();
    humGain.gain.value = 0;
    humGain.gain.linearRampToValueAtTime(isMuted() ? 0 : 0.16, ctx.currentTime + 1.5);
    humSrc = ctx.createBufferSource();
    humSrc.buffer = buffers.hum[0];
    humSrc.loop = true;
    humSrc.connect(humGain).connect(out);
    humSrc.start();
  } else if (!on && humSrc) {
    const s = humSrc;
    humGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => s.stop(), 900);
    humSrc = null;
  }
}

export const orbitSfx = {
  laser(rapid = false) { play('laser', { vol: 0.16, rate: rapid ? 1.2 : 1, jitter: 0.08, gap: 0.05 }); },
  hit(x = 0) { play('hit', { vol: 0.14, pan: panOf(x), rate: 1.5, gap: 0.04 }); },
  deflect(x = 0) { play('hit', { vol: 0.3, pan: panOf(x), rate: 2.2, gap: 0.06 }); },
  explode(x = 0, size = 0.6) {
    if (size >= 1) play('boom', { vol: 0.45 + 0.15 * Math.min(1, size - 1), pan: panOf(x), rate: 1.1 });
    play('explode', { vol: 0.35 + 0.25 * Math.min(1, size), pan: panOf(x), rate: 1.25 - 0.3 * Math.min(1, size), gap: 0.03 });
  },
  bossBoom() {
    play('boom', { vol: 0.9, rate: 0.8 });
    for (let i = 0; i < 4; i++) play('explode', { vol: 0.6, delay: 0.15 + i * 0.18, pan: (Math.random() - 0.5) * 1.2, rate: 0.8 + Math.random() * 0.3 });
  },
  hurt() { play('boom', { vol: 0.7, rate: 1.4 }); play('explode', { vol: 0.5, rate: 0.9 }); },
  shieldBreak() { play('shield', { vol: 0.5, rate: 1.2 }); },
  emp() { play('emp', { vol: 0.7 }); play('boom', { vol: 0.5, rate: 0.7, delay: 0.05 }); },
  empty() { play('empty', { vol: 0.3 }); },
  pickup() { play('pickup', { vol: 0.35 }); },
  charge(x = 0) { play('charge', { vol: 0.28, pan: panOf(x), gap: 0.1 }); },
  lock(x = 0) { play('lock', { vol: 0.25, pan: panOf(x), gap: 0.2 }); },
  blink(x = 0) { play('blink', { vol: 0.25, pan: panOf(x), gap: 0.1 }); },
  bullet(x = 0) { play('bullet', { vol: 0.12, pan: panOf(x), rate: 0.8, gap: 0.06 }); },
  wave() { play('wave', { vol: 0.3 }); },
  alarm() { play('alarm', { vol: 0.4 }); play('alarm', { vol: 0.35, delay: 1.35 }); },
  phase() { play('phase', { vol: 0.4 }); play('boom', { vol: 0.35, rate: 0.6 }); },
  start() { play('start', { vol: 0.45 }); hum(true); },
  win() { hum(false); play('win', { vol: 0.5 }); play('win', { vol: 0.35, delay: 0.5, rate: 1.26, jitter: 0 }); play('win', { vol: 0.35, delay: 1.0, rate: 1.5, jitter: 0 }); },
  over() { hum(false); play('boom', { vol: 0.8, rate: 0.7 }); play('over', { vol: 0.5, delay: 0.4, rate: 0.8 }); },
  pause(on) { if (humGain && ctx) humGain.gain.linearRampToValueAtTime(on || isMuted() ? 0 : 0.16, ctx.currentTime + 0.3); },
  mute(on) { if (humGain && ctx) humGain.gain.linearRampToValueAtTime(on ? 0 : 0.16, ctx.currentTime + 0.1); },
};
