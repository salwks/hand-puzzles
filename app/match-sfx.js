// 성냥개비 sound: real match recordings (BigSoundBank, CC0 — assets/sfx/match/LICENSE.txt).
// A strike (scrape and flare) when the answer lights up, a failed scrape for a wrong board, and
// a small fire crackling while the heads burn. Shares the site's mute switch.
import { isMuted } from './sound.js';

const FILES = { strike: ['strike0', 'strike1', 'strike2'], scrape: ['scrape'], fire: ['fire'] };
let ctx = null, out = null, fireSrc = null, fireGain = null;
const buffers = {};

export function unlockMatchSound() {
  if (ctx) { ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  out = ctx.createGain();
  out.gain.value = 0.9;
  out.connect(ctx.destination);
  for (const [bank, names] of Object.entries(FILES)) {
    for (const name of names) {
      fetch(`assets/sfx/match/${name}.m4a`)
        .then((r) => r.arrayBuffer())
        .then((b) => ctx.decodeAudioData(b))
        .then((buf) => { (buffers[bank] ??= []).push(buf); })
        .catch(() => {});
    }
  }
}

function play(bank, { vol = 1, rate = 1, delay = 0 } = {}) {
  if (!ctx || isMuted() || !buffers[bank]?.length) return null;
  const src = ctx.createBufferSource();
  src.buffer = buffers[bank][Math.floor(Math.random() * buffers[bank].length)];
  src.playbackRate.value = rate * (1 + (Math.random() - 0.5) * 0.06);
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(g).connect(out);
  src.start(ctx.currentTime + delay);
  return { src, g };
}

export const matchSfx = {
  /** A match struck: the scrape and the flare. */
  strike(delay = 0) { play('strike', { vol: 0.9, delay }); },
  /** A failed strike: the board isn't right. */
  scrape() { play('scrape', { vol: 0.7, rate: 0.95 }); },
  /** The heads burning: fades in, crackles for `secs`, fades out. */
  burn(secs = 3) {
    if (!ctx || isMuted() || !buffers.fire?.length) return;
    this.stopBurn(0.05);
    const t = ctx.currentTime;
    fireGain = ctx.createGain();
    fireGain.gain.setValueAtTime(0.0001, t);
    fireGain.gain.linearRampToValueAtTime(0.55, t + 0.5);
    fireGain.gain.setValueAtTime(0.55, t + secs);
    fireGain.gain.linearRampToValueAtTime(0.0001, t + secs + 1.2);
    fireSrc = ctx.createBufferSource();
    fireSrc.buffer = buffers.fire[0];
    fireSrc.loop = true;
    fireSrc.connect(fireGain).connect(out);
    fireSrc.start(t + 0.15);
    fireSrc.stop(t + secs + 1.3);
  },
  stopBurn(fade = 0.3) {
    if (!fireSrc || !ctx) return;
    const t = ctx.currentTime;
    fireGain.gain.cancelScheduledValues(t);
    fireGain.gain.setValueAtTime(fireGain.gain.value, t);
    fireGain.gain.linearRampToValueAtTime(0.0001, t + fade);
    fireSrc.stop(t + fade + 0.05);
    fireSrc = null;
  },
};
