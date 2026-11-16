import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useF} from '../time';
import {LogoMark} from './Logo';
import {BookmarkIcon, PlusIcon, SendIcon} from './Icons';
import {devanagari, serif, serifItalic} from '../fonts';
import {useSafe} from '../platform';
import type {EndCardCopy} from '../types';

const Chip: React.FC<{icon: React.ReactNode; label: string}> = ({icon, label}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 30px 12px 24px',
      borderRadius: 50,
      border: '2px solid rgba(251,232,200,0.55)',
      background: 'rgba(251,232,200,0.08)',
      fontFamily: serif,
      fontWeight: 500,
      fontSize: 34,
      color: '#FBE8C8',
    }}
  >
    {icon}
    {label}
  </div>
);

/**
 * Instagram Reels + Facebook Reels end card.
 * These feeds spread through shares and saves, so the ask is "send this to them", then Follow.
 * Held a little longer than the YouTube card, with extra bottom margin for the Reels caption area.
 */
export const EndCardMeta: React.FC<{copy: EndCardCopy}> = ({copy}) => {
  const frame = useF();
  const safe = useSafe();
  const ease = Easing.out(Easing.cubic);
  const step = (from: number, to: number) =>
    interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const a = step(0, 22);
  const b = step(14, 36);
  const c = step(28, 50);
  const d = step(42, 64);
  const e = step(54, 76);
  const f = step(66, 88);
  const pulse = 1 + 0.025 * Math.sin(frame / 9);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: safe.bottom - 60,
        paddingRight: safe.right,
        paddingLeft: 60,
      }}
    >
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
        <LogoMark size={250} idPrefix="end-meta" flicker={frame} />
      </div>
      <div
        style={{
          opacity: b,
          transform: `translateY(${(1 - b) * 20}px)`,
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 72,
          color: '#FBE8C8',
          marginTop: -16,
          letterSpacing: 1,
        }}
      >
        Ankahi Ghar Ki
      </div>
      <div
        style={{
          opacity: c,
          transform: `translateY(${(1 - c) * 20}px)`,
          fontFamily: serifItalic,
          fontSize: 48,
          color: '#FFD9A0',
          marginTop: 34,
          textAlign: 'center',
          maxWidth: 780,
          lineHeight: 1.35,
        }}
      >
        {copy.line}
      </div>
      {copy.sub ? (
        <div
          style={{
            opacity: d * 0.9,
            transform: `translateY(${(1 - d) * 14}px)`,
            fontFamily: devanagari,
            fontSize: 36,
            color: '#E8C99A',
            marginTop: 16,
            textAlign: 'center',
            maxWidth: 780,
            lineHeight: 1.5,
          }}
        >
          {/^[(（]/.test(copy.sub.trim()) ? copy.sub : `(${copy.sub})`}
        </div>
      ) : null}

      <div style={{opacity: e, transform: `translateY(${(1 - e) * 14}px)`, display: 'flex', gap: 22, marginTop: 38}}>
        <Chip icon={<SendIcon size={36} />} label="Send" />
        <Chip icon={<BookmarkIcon size={36} />} label="Save" />
      </div>

      {copy.cta ? (
        <div
          style={{
            opacity: f,
            transform: `translateY(${(1 - f) * 14}px) scale(${pulse})`,
            marginTop: 34,
            padding: '16px 40px 16px 32px',
            borderRadius: 60,
            border: '2px solid rgba(255,190,110,0.75)',
            background: 'rgba(245,118,46,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 38,
            color: '#FFD9A0',
            letterSpacing: 0.5,
            boxShadow: '0 0 40px rgba(245,118,46,0.25)',
          }}
        >
          <PlusIcon size={40} strokeWidth={2.4} />
          {copy.cta}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
