#!/usr/bin/env python3
"""Summarise a hand-tracking session log (logs/*.jsonl). Usage: analyze_log.py [file] (default: newest)."""
import glob
import json
import os
import statistics as st
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def pct(values, q):
    values = sorted(values)
    return values[min(len(values) - 1, int(q * len(values)))] if values else float('nan')


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else max(glob.glob(os.path.join(ROOT, 'logs', '*.jsonl')), key=os.path.getmtime)
    rows = [json.loads(line) for line in open(path) if line.strip()]
    frames = [r for r in rows if 'ev' not in r]
    events = [r for r in rows if 'ev' in r]
    print(f'{os.path.basename(path)}: {len(frames)} frames, {len(events)} events')
    for e in events:
        if e['ev'] in ('session', 'camera', 'tune'):
            print('  ', {k: v for k, v in e.items() if k != 'ua'})
    if len(frames) < 10:
        return

    dts = [b['t'] - a['t'] for a, b in zip(frames, frames[1:]) if b['t'] - a['t'] < 1000]
    print(f"\nframe rate: median {1000 / st.median(dts):.1f} fps, p95 gap {pct(dts, .95)} ms")

    seen = [f for f in frames if f['hand']]
    print(f"hand visible: {100 * len(seen) / len(frames):.0f}% of frames, tracking score p10 {pct([f['score'] for f in seen], .1):.2f}")
    gaps, start = [], None
    for f in frames:
        if not f['hand'] and start is None:
            start = (f['t'], f['pinching'])
        elif f['hand'] and start is not None:
            gaps.append((f['t'] - start[0], start[1]))
            start = None
    holding = [g for g, p in gaps if p]
    print(f"dropouts: {len(gaps)} (while holding: {len(holding)}, longest while holding {max(holding, default=0)} ms)")

    closed = [f['ratio'] for f in seen if f['pinching']]
    opened = [f['ratio'] for f in seen if not f['pinching']]
    if closed and opened:
        print(f"\npinch ratio   thresholds down {seen[-1]['down']} / up {seen[-1]['up']}")
        print(f"  while pinching: median {st.median(closed):.2f}  p90 {pct(closed, .9):.2f}  max {max(closed):.2f}")
        print(f"  while open:     median {st.median(opened):.2f}  p10 {pct(opened, .1):.2f}  min {min(opened):.2f}")

    # Every release: how fast was the hand, and did a re-grab follow right away (= accidental drop)?
    print('\nreleases (t, speed at release, peak ratio before, re-grab within 600ms = likely accidental):')
    for i in range(1, len(seen)):
        if seen[i - 1]['pinching'] and not seen[i]['pinching']:
            t = seen[i]['t']
            before = [f for f in seen[:i] if t - f['t'] < 400]
            regrab = any(f['pinching'] for f in seen[i:] if f['t'] - t < 600)
            print(f"  t={t}  speed {seen[i]['speed']:.2f}  peak speed {max((f['speed'] for f in before), default=0):.2f}"
                  f"  peak ratio {max((f['ratio'] for f in before), default=0):.2f}  {'ACCIDENTAL?' if regrab else ''}")

    # Jitter: cursor spread over windows where the palm is nearly still.
    still = [seen[i:i + 15] for i in range(0, len(seen) - 15, 15)]
    still = [w for w in still if max(f['speed'] for f in w) < 0.05]
    if still:
        jx = st.median(st.pstdev(f['x'] for f in w) for w in still)
        jr = st.median(st.pstdev(f['raw'] for f in w) for w in still)
        print(f"\nstill-hand jitter ({len(still)} windows): cursor x sd {jx:.4f} screen-widths, raw ratio sd {jr:.3f}")

    print('\ngame events:')
    for e in events:
        if e['ev'] in ('grab', 'drop', 'pinch-miss', 'lost-while-holding'):
            print('  ', e)


if __name__ == '__main__':
    main()
