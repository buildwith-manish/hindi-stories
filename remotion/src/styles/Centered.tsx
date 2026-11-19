import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate} from 'remotion';
import {useF} from '../time';
import {K} from '../timing';
import type {StoryLine, Timeline} from '../types';
import {devanagari, serif, serifItalic} from '../fonts';
import {useSafe} from '../platform';

const normalise = (w: string) => w.toLowerCase().replace(/[^a-z0-9ऀ-ॿ']/gi, '');

const Line: React.FC<{line: StoryLine; duration: number; isLast: boolean}> = ({line, duration, isLast}) => {
  const frame = useF();
  const dur = duration / K;
  const safe = useSafe();
  const words = line.caption.split(' ');
  const marked = new Set((line.highlight ?? []).map(normalise));

  const outP = interpolate(frame, [dur - 14, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const tracking = interpolate(frame, [0, 48], [0.035, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const float = Math.sin(frame / 40) * 4;
  const subIn = interpolate(frame, [14 + words.length * 3, 30 + words.length * 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 120,
        paddingRight: 120,
        paddingBottom: safe.bottom,
        opacity: 1 - outP,
        transform: `translateY(${float - outP * 20}px) scale(${line.hook ? interpolate(frame, [0, 22], [1.07, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : 1})`,
        filter: `blur(${outP * 6}px)`,
      }}
    >
      <div
        style={{
          fontFamily: isLast ? serifItalic : serif,
          fontWeight: line.hook ? 700 : isLast ? 400 : 500,
          fontSize: line.hook ? 88 : isLast ? 84 : 72,
          lineHeight: 1.28,
          textAlign: 'center',
          textWrap: 'balance',
          color: isLast ? '#FFD9A0' : '#FBE8C8',
          textShadow: '0 2px 5px rgba(0,0,0,0.65), 0 6px 34px rgba(0,0,0,0.75)',
          // Settle in by scaling, not by animating letter-spacing: changing the spacing changes the width,
          // so long captions re-wrapped (3 lines -> 2 lines) in the middle of the animation.
          transform: `scale(${1 + tracking})`,
        }}
      >
        {words.map((w, i) => {
          const start = i * (line.hook ? 2 : 3);
          const p = interpolate(frame, [start, start + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const isMarked = marked.has(normalise(w));
          const lineStart = start + 16;
          const draw = isMarked
            ? interpolate(frame, [lineStart, lineStart + 16], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              })
            : 0;
          return (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                opacity: p,
                transform: `translateY(${(1 - p) * 22}px)`,
                filter: `blur(${(1 - p) * 8}px)`,
                marginRight: '0.28em',
                color: isMarked ? '#FFD27A' : undefined,
                textShadow: isMarked
                  ? `0 0 ${14 * draw}px rgba(255,190,100,${0.3 * draw}), 0 2px 5px rgba(0,0,0,0.65), 0 6px 34px rgba(0,0,0,0.75)`
                  : undefined,
              }}
            >
              {w}
              {isMarked ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -6,
                    height: 5,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #F5762E, #FFD27A)',
                    transformOrigin: 'left center',
                    transform: `scaleX(${draw})`,
                  }}
                />
              ) : null}
            </span>
          );
        })}
      </div>
      {line.sub ? (
        <div
          style={{
            marginTop: 34,
            fontFamily: devanagari,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.5,
            textAlign: 'center',
            textWrap: 'balance',
            color: isLast ? '#FAE0B4' : '#F6DDB8',
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 12}px)`,
            textShadow: '0 2px 4px rgba(0,0,0,0.75), 0 4px 22px rgba(0,0,0,0.8)',
          }}
        >
          {/^[(（]/.test(line.sub.trim()) ? line.sub : `(${line.sub})`}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Centered: React.FC<{lines: StoryLine[]; timeline: Timeline}> = ({lines, timeline}) => (
  <>
    {lines.map((line, i) => (
      <Sequence key={i} from={timeline.lines[i].from} durationInFrames={timeline.lines[i].duration}>
        <Line line={line} duration={timeline.lines[i].duration} isLast={i === lines.length - 1} />
      </Sequence>
    ))}
  </>
);
