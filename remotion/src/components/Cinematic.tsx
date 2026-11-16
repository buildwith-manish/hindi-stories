import React from 'react';
import {AbsoluteFill, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/** Film grain, a drifting warm light leak, fine floating dust and a soft vignette. */
export const Cinematic: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const gx = Math.floor(random(`gx-${frame}`) * 512);
  const gy = Math.floor(random(`gy-${frame}`) * 512);

  const leakX = interpolate(Math.sin(frame / 110), [-1, 1], [-8, 28]);
  const leakA = 0.05 + 0.025 * Math.sin(frame / 70);

  return (
    <>
      {/* warm light leak from the top-right corner */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 30% at ${70 + leakX}% 2%, rgba(255,170,90,${leakA}), transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* fine dust */}
      <AbsoluteFill style={{mixBlendMode: 'screen'}}>
        {Array.from({length: 34}).map((_, i) => {
          const size = 3 + random(`d-s-${i}`) * 6;
          const speed = 0.35 + random(`d-v-${i}`) * 0.6;
          const x0 = random(`d-x-${i}`) * width;
          const x = x0 + Math.sin(frame / (40 + random(`d-w-${i}`) * 50) + i) * 30;
          const y = height - ((random(`d-y-${i}`) * height + frame * speed) % (height + 40)) + 20;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / (24 + i) + i));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'rgba(255,226,170,0.9)',
                boxShadow: `0 0 ${size * 3}px rgba(255,200,120,0.7)`,
                opacity: 0.3 * tw,
                filter: `blur(${size > 6 ? 1.5 : 0.4}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* grain */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('grain.png')})`,
          backgroundSize: '512px 512px',
          backgroundPosition: `${gx}px ${gy}px`,
          mixBlendMode: 'overlay',
          opacity: 0.16,
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 46%, transparent 42%, rgba(0,0,0,0.5) 100%)'}}
      />
    </>
  );
};
