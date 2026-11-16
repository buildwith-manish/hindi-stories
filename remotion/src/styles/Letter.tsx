import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useF} from '../time';
import {K} from '../timing';
import type {StoryLine, Timeline} from '../types';
import {handwriting} from '../fonts';
import {useSafe} from '../platform';

/** A handwritten-style letter on paper. Lines are typed out one by one and stay on the page. */
export const Letter: React.FC<{lines: StoryLine[]; timeline: Timeline; title?: string}> = ({
  lines,
  timeline,
  title,
}) => {
  const frame = useF();
  const safe = useSafe();
  const paperIn = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const paperOut = interpolate(frame, [timeline.endFrom / K - 14, timeline.endFrom / K], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleStart = 6;
  const titleChars = title
    ? Math.floor(
        interpolate(frame, [titleStart, titleStart + 22], [0, title.length], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      )
    : 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: safe.bottom - 80,
        opacity: paperIn * paperOut,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 900,
          minHeight: 1020,
          padding: '90px 80px 80px',
          boxSizing: 'border-box',
          transform: `rotate(-1.4deg) translateY(${(1 - paperIn) * 40}px)`,
          background:
            'repeating-linear-gradient(180deg, transparent 0, transparent 79px, rgba(120,80,40,0.14) 79px, rgba(120,80,40,0.14) 81px), #F7EBD3',
          borderRadius: 10,
          boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -26,
            left: '50%',
            width: 190,
            height: 54,
            marginLeft: -95,
            transform: 'rotate(2deg)',
            background: 'rgba(255, 214, 140, 0.55)',
            borderRadius: 4,
          }}
        />
        {title ? (
          <div
            style={{
              fontFamily: handwriting,
              fontWeight: 700,
              fontSize: 84,
              color: '#7A2236',
              marginBottom: 20,
              lineHeight: 1.1,
              minHeight: 92,
            }}
          >
            {title.slice(0, titleChars)}
          </div>
        ) : null}
        {lines.map((line, i) => {
          const t = timeline.lines[i];
          const from = t.from / K;
          if (frame < from) return null;
          const typeFrames = Math.max(10, (t.duration / K) * 0.62);
          const chars = Math.floor(
            interpolate(frame - from, [0, typeFrames], [0, line.caption.length], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          );
          const last = i === lines.length - 1;
          return (
            <div
              key={i}
              style={{
                fontFamily: handwriting,
                fontWeight: last ? 700 : 500,
                fontSize: 62,
                lineHeight: '80px',
                color: last ? '#7A2236' : '#3A2A20',
                marginBottom: 6,
              }}
            >
              {line.caption.slice(0, chars)}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
