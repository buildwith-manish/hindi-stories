import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {StoryLine, Timeline} from '../types';

const OVERLAP = 12;

const Shot: React.FC<{line: StoryLine; duration: number; index: number}> = ({line, duration, index}) => {
  const frame = useCurrentFrame();
  const peak = line.imageOpacity ?? 0.88;
  const opacity = interpolate(frame, [0, OVERLAP, duration - OVERLAP, duration], [0, peak, peak, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  const m = line.motion ?? {};
  const kind = m.kind ?? 'push';
  const [fx, fy] = m.focus ?? [0.5, 0.5];
  const from = m.from ?? (kind === 'pull' ? 1.24 : 1.04);
  const to = m.to ?? (kind === 'pull' ? 1.05 : 1.22);
  const t = interpolate(frame, [0, duration], [0, 1], {easing: Easing.inOut(Easing.sin)});
  const scale = from + (to - from) * t;
  // drift: glide sideways while holding a steady zoom
  const dir = index % 2 === 0 ? 1 : -1;
  const tx = kind === 'drift' ? (t - 0.5) * 90 * dir : 0;
  const ty = kind === 'drift' ? -(t - 0.5) * 30 : 0;

  const flick = line.flicker
    ? 1 + 0.022 * Math.sin(frame / 3.1) + 0.015 * Math.sin(frame / 1.7 + 2) + 0.012 * Math.sin(frame / 7.3)
    : 1;
  const glowA = 0.1 + 0.04 * Math.sin(frame / 16);

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile(line.image as string)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: `${fx * 100}% ${fy * 100}%`,
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            filter: `brightness(${flick}) saturate(1.05)`,
          }}
        />
        {line.mist ? (
          <AbsoluteFill style={{mixBlendMode: 'screen', overflow: 'hidden'}}>
            {[0, 1, 2].map((i) => {
              const x = ((frame * (0.7 + i * 0.35) + i * 760) % 2300) - 1150;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: 980 + i * 190,
                    width: 1150,
                    height: 380,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(255,214,170,0.11), transparent 70%)',
                    filter: 'blur(28px)',
                  }}
                />
              );
            })}
          </AbsoluteFill>
        ) : null}
        {line.glow ? (
          <AbsoluteFill
            style={{
              mixBlendMode: 'screen',
              background: `radial-gradient(circle at ${line.glow[0] * 100}% ${line.glow[1] * 100}%, rgba(255,190,100,${glowA}) 0%, rgba(255,150,70,${glowA * 0.4}) 22%, transparent 48%)`,
            }}
          />
        ) : null}
      </AbsoluteFill>
      {/* keeps the caption readable: darker top and bottom, a soft shade behind the text band */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(20,6,14,0.55) 0%, rgba(20,6,14,0.30) 22%, rgba(20,6,14,0.40) 46%, rgba(20,6,14,0.32) 70%, rgba(20,6,14,0.82) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Optional pictures behind individual lines: crossfade with an eased camera move. */
export const ImageLayer: React.FC<{lines: StoryLine[]; timeline: Timeline}> = ({lines, timeline}) => (
  <>
    {lines.map((line, i) =>
      line.image ? (
        <Sequence
          key={i}
          from={Math.max(0, timeline.lines[i].from - OVERLAP)}
          durationInFrames={timeline.lines[i].duration + OVERLAP * 2}
        >
          <Shot line={line} duration={timeline.lines[i].duration + OVERLAP * 2} index={i} />
        </Sequence>
      ) : null,
    )}
  </>
);
