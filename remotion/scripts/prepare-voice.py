#!/usr/bin/env python3
"""Tightens a voiceover and sets its loudness. Does NOT change any word.

  python3 scripts/prepare-voice.py in.mp3 public/audio/003.wav 0.6,0.5,0.39,...

- finds the silent gaps (>= 0.18 s below -38 dB),
- shortens each gap to the target given (a gap already shorter is left alone),
- gently compresses (ratio 2.2:1) so whispers stay audible next to louder phrases,
- normalises to -15.4 LUFS integrated, true peak <= -1.5 dBTP (same level as Short #1),
- writes 44.1 kHz mono 16-bit WAV and prints speech spans (seconds, in the NEW file).
Needs: numpy, ffmpeg."""
import json, re, subprocess, sys, wave
import numpy as np

SR = 44100
src, dst = sys.argv[1], sys.argv[2]
targets = [float(v) for v in sys.argv[3].split(',')] if len(sys.argv) > 3 else []

raw = '/tmp/_vo_raw.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', str(SR), raw], check=True)
w = wave.open(raw)
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
total = len(x) / SR

log = subprocess.run(['ffmpeg', '-hide_banner', '-i', raw, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
starts = [float(v) for v in re.findall(r'silence_start: ([\d.]+)', log)]
ends = [float(v) for v in re.findall(r'silence_end: ([\d.]+)', log)]
gaps = [(a, b) for a, b in zip(starts, ends)]          # inner gaps only (file starts and ends in speech)

# leading silence: the voice must start on the very first frame
env = np.sqrt(np.convolve(x ** 2, np.ones(441) / 441, mode='same'))
onset = float(np.argmax(env > 10 ** (-45 / 20))) / SR
lead = max(0.0, onset - 0.03)
keep, cursor, removed = [], lead, ([(0.0, lead)] if lead > 0.005 else [])   # removed: (orig_start, orig_end)
for i, (a, b) in enumerate(gaps):
    d = b - a
    t = targets[i] if i < len(targets) else d
    if d > t + 0.02:
        cut_a, cut_b = a + t / 2, b - t / 2
        keep.append((cursor, cut_a)); cursor = cut_b; removed.append((cut_a, cut_b))
keep.append((cursor, total))

xf = int(0.008 * SR)
out = None
for a, b in keep:
    seg = x[int(a * SR):int(b * SR)]
    if out is None: out = seg.copy()
    else:
        n = min(xf, len(seg), len(out)); ramp = np.linspace(0, 1, n)
        out[-n:] = out[-n:] * (1 - ramp) + seg[:n] * ramp
        out = np.concatenate([out, seg[n:]])
out = np.concatenate([out, np.zeros(int(0.3 * SR))])    # small tail so the last word is never clipped
fi = int(0.006 * SR); out[:fi] *= np.linspace(0, 1, fi)

tmp = '/tmp/_vo_tight.wav'
with wave.open(tmp, 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())

I, TP, LRA = -15.4, -1.5, 11
COMP = 'acompressor=threshold=-24dB:ratio=2.2:attack=10:release=150:makeup=3dB'
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', f'{COMP},loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
j = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
flt = (f"{COMP},loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
       f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', flt, '-ar', str(SR), '-ac', '1', '-c:a', 'pcm_s16le', dst], check=True)

def new_t(t):
    return t - sum(min(b, t) - a for a, b in removed if t > a)

spans, prev = [], 0.0
bounds = [0.0] + [v for g in gaps for v in g] + [total]
for k in range(0, len(bounds), 2):
    spans.append((round(new_t(bounds[k]), 2), round(new_t(bounds[k + 1]), 2)))
print('speech spans in new file:', spans)
print('duration: %.2f s -> %.2f s' % (total, len(out) / SR))
