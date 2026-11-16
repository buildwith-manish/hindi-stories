import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Tint} from '../types';

const TINTS: Record<Tint, {top: string; bottom: string; accent: string}> = {
  warm: {top: '#6E1F32', bottom: '#2F0A17', accent: '#FFB347'},
  cool: {top: '#1D3C5E', bottom: '#0A1A2C', accent: '#9CD0EE'},
  gold: {top: '#7A4A12', bottom: '#2E1A06', accent: '#FFD27A'},
};

const BOKEH_COUNT = 14;

export const Background: React.FC<{tint: Tint; image?: string}> = ({tint, image}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, height} = useVideoConfig();
  const c = TINTS[tint];

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const breathe = 0.22 + 0.06 * Math.sin(frame / 38);

  return (
    <AbsoluteFill style={{backgroundColor: c.bottom}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <AbsoluteFill style={{background: `linear-gradient(165deg, ${c.top} 0%, ${c.bottom} 100%)`}} />
        {image ? (
          <>
            <Img
              src={staticFile(image)}
              style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4}}
            />
            <AbsoluteFill style={{background: `linear-gradient(180deg, ${c.bottom}99 0%, ${c.bottom}CC 100%)`}} />
          </>
        ) : null}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 34% at 50% 40%, ${c.accent}, transparent 70%)`,
            opacity: breathe,
          }}
        />
        {Array.from({length: BOKEH_COUNT}).map((_, i) => {
          const size = 90 + random(`b-size-${i}`) * 220;
          const x = random(`b-x-${i}`) * 1080;
          const speed = 0.25 + random(`b-speed-${i}`) * 0.5;
          const startY = random(`b-y-${i}`) * (height + 400);
          const y = ((startY - frame * speed) % (height + 400)) - 200;
          const twinkle = 0.55 + 0.45 * Math.sin(frame / (30 + random(`b-t-${i}`) * 40) + i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${c.accent}55 0%, ${c.accent}00 70%)`,
                opacity: 0.45 * twinkle,
              }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)'}}
      />
    </AbsoluteFill>
  );
};
