#!/usr/bin/env python3
"""Synthesises the channel's original music bed + sound effects (no downloads, no licences).
Run:  python3 scripts/make-audio.py      Output goes to public/audio/ and public/audio/sfx/
Needs: numpy, scipy, ffmpeg."""
import os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
os.makedirs(os.path.join(OUT, 'sfx'), exist_ok=True)


def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, fc, o=4): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=4): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=3): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(d * SR))
def gauss(t, c, s): return np.exp(-0.5 * ((t - c) / s) ** 2)


def fade(x, a=0.01, b=0.05):
    n = len(x); x = x.copy()
    na, nb = min(n, int(a * SR)), min(n, int(b * SR))
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x


def reverb_ir(rt=2.5, damp=5000):
    n = int(rt * SR); t = np.arange(n) / SR
    irs = []
    for _ in range(2):
        ir = rng.standard_normal(n) * np.exp(-t * 6.9 / rt)
        ir = lp(ir, damp, 2) * np.minimum(1, t / 0.012)
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    return irs


def reverb(x, rt=2.5, wet=0.3, damp=5000, circular=False):
    """x mono -> stereo. circular=True folds the tail back so loops are seamless."""
    irs = reverb_ir(rt, damp); N = len(x); outs = []
    for ir in irs:
        y = fftconvolve(x, ir)
        if circular:
            z = y[:N].copy(); tail = y[N:]
            while len(tail):
                m = min(N, len(tail)); z[:m] += tail[:m]; tail = tail[m:]
            y = z
        else:
            y = np.pad(y, (0, 0))
        outs.append(y)
    L = max(len(o) for o in outs)
    outs = [np.pad(o, (0, L - len(o))) for o in outs]
    dry = np.pad(x, (0, L - N))
    return np.stack([dry * (1 - wet) + outs[0] * wet * 2.2, dry * (1 - wet) + outs[1] * wet * 2.2])


def stereo(x): return np.stack([x, x])


def save(name, y, peak=0.9, mp3=True, folder=''):
    if y.ndim == 1: y = stereo(y)
    y = y / (np.max(np.abs(y)) + 1e-9) * peak
    d = os.path.join(OUT, folder); os.makedirs(d, exist_ok=True)
    wav = os.path.join(d, name + '.wav')
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y.T * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k',
                    os.path.join(d, name + '.mp3')], check=True)
    os.remove(wav)
    print('wrote', os.path.join(folder, name + '.mp3'), f'{y.shape[1] / SR:.1f}s')


def add_wrap(buf, sig, start):
    n = len(buf); idx = (int(start * SR) + np.arange(len(sig))) % n
    np.add.at(buf, idx, sig)


# ───────────────────────── music: warm 24 s loop (D major, 60 bpm) ─────────────────────────
def music():
    N = 24 * SR; BAR = 4
    chords = [  # (bass+pad notes, arpeggio notes)
        ([146.83, 185.0, 220.0, 293.66], [293.66, 440.0, 740.0, 440.0]),   # D
        ([123.47, 146.83, 185.0, 246.94], [246.94, 293.66, 370.0, 587.33]),  # Bm
        ([98.0, 123.47, 146.83, 196.0], [196.0, 293.66, 493.88, 293.66]),   # G
        ([146.83, 185.0, 220.0, 293.66], [293.66, 440.0, 740.0, 440.0]),   # D
        ([110.0, 164.81, 220.0, 277.18], [220.0, 329.63, 440.0, 554.37]),   # A
        ([98.0, 123.47, 146.83, 196.0], [196.0, 293.66, 493.88, 293.66]),   # G
    ]
    pad = np.zeros(N)
    for b, (notes, _) in enumerate(chords):
        L = BAR + 2.4; t = tt(L)
        env = np.minimum(1, t / 1.4) * np.where(t > BAR, np.exp(-(t - BAR) * 2.2), 1.0)
        sig = np.zeros_like(t)
        for f in notes:
            for det in (-0.0035, 0.0, 0.0035):
                ff = f * (1 + det)
                for h, a in ((1, 1), (2, 0.5), (3, 0.28), (4, 0.15), (5, 0.08)):
                    sig += a * np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28))
        add_wrap(pad, lp(sig, 1100, 2) * env * 0.035, b * BAR)

    drone = np.zeros(N)  # tanpura: Pa Sa Sa Sa(low)
    for k, f in enumerate([220.0, 293.66, 293.66, 146.83] * 4):
        t = tt(3.2); s = np.zeros_like(t)
        for h in range(1, 14):
            s += (1 / h ** 0.9) * np.sin(2 * np.pi * f * h * t + h) * np.exp(-t * (0.9 + 0.35 * h))
        s += 0.05 * bp(noise(3.2), 3000, 5000) * np.exp(-t * 6)
        add_wrap(drone, lp(s, 3500, 2) * 0.11, k * 1.5)

    flute = np.zeros(N)
    mel = [(0.5, 2.1, 440.0), (2.6, 1.3, 493.88), (4.3, 2.4, 587.33), (6.8, 1.1, 493.88), (8.5, 2.0, 493.88),
           (10.5, 1.3, 440.0), (12.5, 2.0, 370.0), (14.5, 1.3, 440.0), (16.5, 2.3, 659.26), (18.8, 1.1, 587.33),
           (20.5, 2.0, 493.88), (22.5, 1.0, 440.0)]
    for st, d, f in mel:
        L = d + 0.9; t = tt(L)
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.1 * t) * np.minimum(1, np.maximum(0, t - 0.35) / 0.5)
        ph = 2 * np.pi * np.cumsum(f * vib) / SR
        s = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.07 * np.sin(3 * ph)
        s += 0.06 * bp(noise(L), 2200, 4200) * np.minimum(1, t / 0.2)
        env = np.minimum(1, t / 0.28) * np.where(t > d, np.exp(-(t - d) * 5), 1.0)
        add_wrap(flute, s * env * 0.12, st)

    arp = np.zeros(N)
    for b, (_, notes) in enumerate(chords):
        for i, f in enumerate(notes):
            t = tt(2.6); s = np.zeros_like(t)
            for h, a, dec in ((1, 1, 1.5), (2, 0.35, 2.4), (3, 0.14, 3.5), (4, 0.06, 5)):
                s += a * np.sin(2 * np.pi * f * h * t) * np.exp(-t * dec)
            s *= np.minimum(1, t / 0.006)
            add_wrap(arp, lp(s, 4500, 2) * 0.10 * (0.8 + 0.2 * (i % 2)), b * BAR + i * 1.0 + 0.02)

    dry = pad + drone
    wet_in = flute + arp
    y_dry = stereo(dry)
    y_wet = reverb(wet_in, rt=3.2, wet=0.42, circular=True)
    y = y_dry * 1.0 + y_wet
    y = np.stack([lp(y[0], 9500, 2), lp(y[1], 9500, 2)])
    save('music-warm-01', y, peak=0.85)


# ───────────────────────────────────── sound effects ─────────────────────────────────────
def sfx_hit():
    t = tt(1.6)
    f = 42 + 55 * np.exp(-t * 14)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.2)
    s += 0.5 * lp(noise(1.6), 260, 3) * np.exp(-t * 18)
    s += 0.12 * bp(noise(1.6), 1500, 5000) * np.exp(-t * 30)
    save('hit', reverb(s, rt=1.6, wet=0.25), folder='sfx')


def sfx_drawer():
    d = 1.4; t = tt(d)
    rub = lp(noise(d), 700, 3) + 0.4 * bp(noise(d), 120, 300)
    bumps = np.abs(lp(noise(d), 28, 2)); bumps /= bumps.max()
    env = np.sin(np.pi * np.clip(t / 1.05, 0, 1)) ** 1.5 * (0.55 + 0.45 * bumps)
    s = rub * env * 0.8
    thunk = np.sin(2 * np.pi * 118 * t) * np.exp(-np.clip(t - 1.05, 0, None) * 28) * (t > 1.05)
    thunk += 0.3 * lp(noise(d), 400, 3) * np.exp(-np.clip(t - 1.05, 0, None) * 40) * (t > 1.05)
    save('drawer-slide', reverb(s + 0.6 * thunk, rt=0.7, wet=0.15), folder='sfx')


def sfx_coin():
    d = 1.6; out = np.zeros(int(d * SR))
    for off, base, amp in ((0.0, 1.0, 1.0), (0.11, 1.12, 0.75), (0.26, 0.93, 0.5)):
        t = tt(d - off); s = np.zeros_like(t)
        for fr, a, tau in ((2637, 1.0, 0.32), (3951, 0.6, 0.22), (5420, 0.35, 0.14), (7130, 0.2, 0.09)):
            s += a * np.sin(2 * np.pi * fr * base * t) * np.exp(-t / tau)
        s *= np.minimum(1, t / 0.0015)
        i = int(off * SR); out[i:i + len(s)] += s * amp
    save('coin-clink', reverb(hp(out, 900, 2), rt=0.9, wet=0.22), folder='sfx')


def sfx_paper():
    d = 1.1; t = tt(d)
    n = bp(noise(d), 1800, 7500, 2)
    am = np.abs(lp(noise(d), 40, 2)); am /= am.max()
    env = (gauss(t, 0.3, 0.12) * 0.9 + gauss(t, 0.62, 0.1) * 0.6) * (0.35 + 0.65 * am)
    save('paper-rustle', reverb(n * env, rt=0.5, wet=0.12), folder='sfx')


def sfx_whoosh():
    d = 1.5; t = tt(d); s = np.zeros_like(t)
    for (a, b), c, w in (((250, 700), 0.45, 0.22), ((600, 1600), 0.58, 0.2), ((1400, 3800), 0.7, 0.18)):
        s += bp(noise(d), a, b) * gauss(t, c, w)
    save('whoosh-air', reverb(s, rt=1.2, wet=0.25), folder='sfx')


def sfx_bus():
    d = 5.0; t = tt(d)
    f = 62 + 14 * np.tanh((t - 2.4) * -0.9)           # slight pitch fall as it passes
    eng = sum(np.sin(2 * np.pi * np.cumsum(f * h) / SR) * a for h, a in ((1, 1), (2, 0.6), (3, 0.35), (4, 0.2)))
    rumble = lp(noise(d), 160, 3)
    hiss = bp(noise(d), 900, 2600, 2) * 0.12
    env = gauss(t, 2.4, 0.95)
    s = (eng * 0.5 + rumble * 1.4 + hiss) * env
    s = lp(s, 700 + 900 * gauss(t, 2.4, 1.0).mean(), 2)
    save('bus-distant', reverb(s, rt=1.8, wet=0.35, damp=2500), folder='sfx')


def chirp(t, t0, f0, f1, d, amp):
    u = (t - t0) / d; m = (u >= 0) & (u <= 1)
    f = f0 + (f1 - f0) * np.clip(u, 0, 1) ** 1.3
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.where(m, np.sin(ph) * np.sin(np.pi * np.clip(u, 0, 1)) ** 1.5 * amp, 0)


def sfx_birds():
    d = 4.0; t = tt(d); s = np.zeros_like(t)
    for t0 in (0.1, 0.32, 0.54):                       # bird 1: "tee-tee-tee"
        s += chirp(t, t0, 4300, 5200, 0.14, 0.9)
    for t0, f in ((1.3, 3300), (1.52, 3600), (1.72, 3000), (1.98, 3900)):  # bird 2: warbles
        s += chirp(t, t0, f, f + 700, 0.16, 0.7)
    for t0 in (2.7, 2.95):                              # bird 3: two soft notes
        s += chirp(t, t0, 2600, 3400, 0.22, 0.6)
    save('birds-dawn', reverb(s * 0.5, rt=1.8, wet=0.4, damp=7000), peak=0.7, folder='sfx')


def sfx_swell():
    d = 5.0; t = tt(d); s = np.zeros_like(t)
    for f in (146.83, 220.0, 293.66, 370.0, 440.0):
        for h, a in ((1, 1), (2, 0.4), (3, 0.15)):
            s += a * np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28))
    env = gauss(t, 2.1, 1.05)
    save('warm-swell', reverb(lp(s, 1500, 2) * env, rt=2.4, wet=0.35), folder='sfx')


def sfx_chime():
    d = 4.0; out = np.zeros(int(d * SR))
    for off, f in ((0.0, 587.33), (0.28, 880.0), (0.56, 1479.98)):
        t = tt(d - off); s = np.zeros_like(t)
        for r, a, tau in ((1, 1, 1.6), (2.76, 0.35, 0.8), (5.4, 0.12, 0.4)):
            s += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / tau)
        s *= np.minimum(1, t / 0.004)
        i = int(off * SR); out[i:i + len(s)] += s
    save('chime', reverb(out, rt=2.4, wet=0.35), folder='sfx')


if __name__ == '__main__':
    music(); sfx_hit(); sfx_drawer(); sfx_coin(); sfx_paper(); sfx_whoosh(); sfx_bus(); sfx_birds(); sfx_swell(); sfx_chime()
