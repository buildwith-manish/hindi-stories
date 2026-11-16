import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import type {ThumbnailCopy} from '../types';
import {devanagari, serif} from '../fonts';
import {LogoMark} from './Logo';

const normalise = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/gi, '');

/**
 * A still, designed cover: the object that carries the story (the bus pass) in a warm pool of light,
 * the hook split into two big lines, nothing else. Everything that matters sits in the middle 3:4
 * (y 240..1680), so it survives the crops of the Shorts picker, the Reels grid and the profile grid.
 * No animation on purpose: every frame of it is identical, so any frame can be picked as the cover.
 */
export const ThumbnailFrame: React.FC<{copy: ThumbnailCopy}> = ({copy}) => {
  const [fx, fy] = copy.focus ?? [0.47, 0.54];
  const marked = new Set((copy.highlight ?? []).map(normalise));
  const words2 = copy.line2.split(' ');

  return (
    <AbsoluteFill style={{backgroundColor: '#14060E'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile(copy.image ?? 'images/001-drawer.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.14)',
            transformOrigin: `${fx * 100}% ${fy * 100}%`,
            filter: 'brightness(1.08) contrast(1.08) saturate(1.1)',
          }}
        />
      </AbsoluteFill>

      {/* warm pool of light on the pass */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 46% 20% at ${fx * 100}% ${fy * 100}%, rgba(255,190,100,0.30), transparent 72%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* dark bands where the text sits, clear window in the middle for the picture */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(14,5,12,0.94) 0%, rgba(14,5,12,0.86) 15%, rgba(14,5,12,0.40) 29%, rgba(14,5,12,0) 40%, rgba(14,5,12,0) 60%, rgba(14,5,12,0.55) 70%, rgba(14,5,12,0.90) 80%, rgba(14,5,12,0.96) 100%)',
        }}
      />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(8,2,8,0.55) 100%)'}}
      />

      {/* line 1 */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 300,
          textAlign: 'center',
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 134,
          lineHeight: 1.12,
          color: '#FBE8C8',
          textShadow: '0 4px 10px rgba(0,0,0,0.7), 0 10px 50px rgba(0,0,0,0.8)',
        }}
      >
        {copy.line1}
      </div>

      {/* line 2 */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 1190,
          textAlign: 'center',
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 124,
          lineHeight: 1.14,
          color: '#FBE8C8',
          textShadow: '0 4px 10px rgba(0,0,0,0.7), 0 10px 50px rgba(0,0,0,0.8)',
        }}
      >
        {words2.map((w, i) => {
          const on = marked.has(normalise(w));
          return (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                marginRight: i === words2.length - 1 ? 0 : '0.26em',
                color: on ? '#FFC24D' : undefined,
                textShadow: on ? '0 0 38px rgba(255,170,60,0.75), 0 4px 10px rgba(0,0,0,0.7)' : undefined,
              }}
            >
              {w}
              {on ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -4,
                    height: 8,
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, rgba(255,194,77,0), #FFC24D 12%, #FFC24D 88%, rgba(255,194,77,0))',
                  }}
                />
              ) : null}
            </span>
          );
        })}
      </div>

      {copy.sub ? (
        <div
          style={{
            position: 'absolute',
            left: 90,
            right: 90,
            top: 1520,
            textAlign: 'center',
            fontFamily: devanagari,
            fontWeight: 500,
            fontSize: 56,
            lineHeight: 1.4,
            color: '#E9C9A0',
            opacity: 0.92,
            textShadow: '0 3px 14px rgba(0,0,0,0.8)',
          }}
        >
          {copy.sub}
        </div>
      ) : null}

      {/* channel mark */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 128, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: 0.9}}>
        <LogoMark size={84} idPrefix="th" glow={false} />
        <span style={{fontFamily: serif, fontWeight: 700, fontSize: 36, color: '#FBE8C8', letterSpacing: 0.5}}>Ankahi Ghar Ki</span>
      </div>
    </AbsoluteFill>
  );
};
