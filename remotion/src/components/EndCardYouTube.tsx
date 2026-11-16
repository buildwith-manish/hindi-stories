import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useF} from '../time';
import {LogoMark} from './Logo';
import {BellIcon, CommentIcon} from './Icons';
import {devanagari, serif, serifItalic} from '../fonts';
import {useSafe} from '../platform';
import type {EndCardCopy} from '../types';

/**
 * YouTube Shorts end card.
 * Short and quick (Shorts loop, so it must not drag). The ask is a COMMENT, because comments
 * are what YouTube's Shorts feed rewards most, then a Subscribe button.
 */
export const EndCardYouTube: React.FC<{copy: EndCardCopy}> = ({copy}) => {
  const frame = useF();
  const safe = useSafe();
  const ease = Easing.out(Easing.cubic);
  const step = (from: number, to: number) =>
    interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const a = step(0, 16);
  const b = step(8, 24);
  const c = step(16, 34);
  const d = step(26, 42);
  const e = step(36, 54);
  const pulse = 1 + 0.02 * Math.sin(frame / 7);
  // the bell rings a few times once the button is on screen
  const ring = frame > 56 ? Math.sin((frame - 56) / 2.2) * 16 * Math.max(0, 1 - (frame - 56) / 36) : 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: safe.bottom - 40,
        paddingRight: safe.right,
        paddingLeft: 60,
      }}
    >
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 18}px)`}}>
        <LogoMark size={210} idPrefix="end-yt" flicker={frame} />
      </div>
      <div
        style={{
          opacity: b,
          transform: `translateY(${(1 - b) * 18}px)`,
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 66,
          color: '#FBE8C8',
          marginTop: -10,
          letterSpacing: 1,
        }}
      >
        Ankahi Ghar Ki
      </div>

      <div
        style={{
          opacity: c,
          transform: `translateY(${(1 - c) * 18}px)`,
          marginTop: 46,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 22,
          maxWidth: 820,
        }}
      >
        <div style={{color: '#FFD27A', marginTop: 8, flexShrink: 0}}>
          <CommentIcon size={58} strokeWidth={1.8} />
        </div>
        <div style={{fontFamily: serifItalic, fontSize: 48, color: '#FFD9A0', lineHeight: 1.32}}>{copy.line}</div>
      </div>

      {copy.sub ? (
        <div
          style={{
            opacity: d * 0.9,
            transform: `translateY(${(1 - d) * 12}px)`,
            fontFamily: devanagari,
            fontSize: 36,
            color: '#E8C99A',
            marginTop: 18,
            textAlign: 'center',
            maxWidth: 780,
            lineHeight: 1.5,
          }}
        >
          {/^[(（]/.test(copy.sub.trim()) ? copy.sub : `(${copy.sub})`}
        </div>
      ) : null}

      {copy.cta ? (
        <div
          style={{
            opacity: e,
            transform: `translateY(${(1 - e) * 14}px) scale(${pulse})`,
            marginTop: 52,
            padding: '18px 44px 18px 36px',
            borderRadius: 70,
            background: '#E62117',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 38,
            color: '#FFFFFF',
            boxShadow: '0 8px 36px rgba(230,33,23,0.38)',
          }}
        >
          <div style={{transform: `rotate(${ring}deg)`, transformOrigin: '50% 10%'}}>
            <BellIcon size={44} strokeWidth={2.2} />
          </div>
          {copy.cta}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
