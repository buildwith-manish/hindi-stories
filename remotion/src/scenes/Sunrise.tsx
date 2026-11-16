import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import type {Timeline} from '../types';

const W = 1080;
const H = 1920;
const HORIZON = 1180;
const LAYER_W = 2100;

/** One rolling hill ridge. The same formula places the house on the ridge. */
const ridgeY = (x: number, baseY: number, amp: number, f: number, phase: number) =>
  baseY - amp * (0.55 * Math.sin(x * f + phase) + 0.3 * Math.sin(x * f * 2.3 + phase * 1.7) + 0.15 * Math.sin(x * f * 4.1 + phase * 0.6));

const ridgePath = (baseY: number, amp: number, f: number, phase: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= LAYER_W; x += 24) pts.push(`${x},${ridgeY(x, baseY, amp, f, phase).toFixed(1)}`);
  return `M0,${H} L${pts.join(' L')} L${LAYER_W},${H} Z`;
};

const FAR = {baseY: HORIZON + 10, amp: 70, f: 0.0042, phase: 1.2};
const MID = {baseY: HORIZON + 110, amp: 90, f: 0.0051, phase: 4.0};
const NEAR = {baseY: HORIZON + 250, amp: 100, f: 0.0038, phase: 0.4};

const HOUSE_X = 760;

const Bird: React.FC<{i: number; frame: number; alpha: number}> = ({i, frame, alpha}) => {
  const speed = 0.9 + random(`bird-s-${i}`) * 0.7;
  const x = ((random(`bird-x-${i}`) * 1400 + frame * speed) % 1500) - 200;
  const y = 930 + random(`bird-y-${i}`) * 140 + Math.sin(frame / 22 + i) * 14;
  const flap = 0.55 + 0.45 * Math.sin(frame / 3.2 + i * 2);
  const s = 0.8 + random(`bird-z-${i}`) * 0.7;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * flap})`} opacity={alpha}>
      <path d="M-18 0 Q-9 -12 0 0 Q9 -12 18 0" fill="none" stroke="#2A0C1A" strokeWidth="3.2" strokeLinecap="round" />
    </g>
  );
};

/**
 * A pre-dawn sky that brightens into sunrise across the story.
 * The sun is almost hidden at the start and has cleared the hills by the final line.
 */
export const Sunrise: React.FC<{timeline: Timeline}> = ({timeline}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, timeline.endFrom], [0, 1], {extrapolateRight: 'clamp'});

  const skyTop = interpolateColors(p, [0, 0.55, 1], ['#150B27', '#35122F', '#6A2140']);
  const skyHorizon = interpolateColors(p, [0, 0.5, 1], ['#3B0E1D', '#8E3A2C', '#C97A45']);
  const sunY = interpolate(p, [0, 0.2, 1], [1345, 1305, 1040]);
  const sunAlpha = interpolate(p, [0, 0.25, 1], [0.12, 0.35, 0.85]);
  const farC = interpolateColors(p, [0, 1], ['#2B1030', '#74293A']);
  const midC = interpolateColors(p, [0, 1], ['#210A22', '#4A1A2C']);
  const nearC = interpolateColors(p, [0, 1], ['#150616', '#240C16']);

  const starAlpha = interpolate(p, [0, 0.45], [0.9, 0], {extrapolateRight: 'clamp'});
  const birdAlpha = interpolate(p, [0.3, 0.55], [0, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const driftFar = -(frame * 0.12);
  const driftMid = -(frame * 0.3);
  const driftNear = -(frame * 0.55);
  const houseY = ridgeY(HOUSE_X, MID.baseY, MID.amp, MID.f, MID.phase);
  const windowGlow = 0.8 + 0.2 * Math.sin(frame / 5) + 0.08 * Math.sin(frame / 1.9);

  const rayRotate = frame * 0.04;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2={HORIZON / H}>
            <stop offset="0" stopColor={skyTop} />
            <stop offset="1" stopColor={skyHorizon} />
          </linearGradient>
          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.95" />
            <stop offset="0.25" stopColor="#FFB45E" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FF8A3C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunDisc" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF4D6" />
            <stop offset="1" stopColor="#FFC574" />
          </radialGradient>
          <radialGradient id="windowGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFD27A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#sky)" />
        <rect y={HORIZON - 1} width={W} height={H - HORIZON + 1} fill={farC} />

        {/* stars */}
        {Array.from({length: 46}).map((_, i) => {
          const tw = 0.5 + 0.5 * Math.sin(frame / (18 + random(`st-t-${i}`) * 30) + i);
          return (
            <circle
              key={i}
              cx={random(`st-x-${i}`) * W}
              cy={random(`st-y-${i}`) * 820}
              r={0.8 + random(`st-r-${i}`) * 1.8}
              fill="#FFE9C8"
              opacity={starAlpha * tw}
            />
          );
        })}

        {/* sun glow, rays, disc */}
        <circle cx={540} cy={sunY} r={430} fill="url(#sunGlow)" opacity={sunAlpha * 0.55} />
        <g transform={`rotate(${rayRotate} 540 ${sunY})`} opacity={interpolate(p, [0.2, 0.9], [0, 0.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
          {Array.from({length: 9}).map((_, i) => {
            const a = (i / 9) * 360;
            return (
              <path
                key={i}
                d={`M540 ${sunY} L ${540 - 70} ${sunY - 1500} L ${540 + 70} ${sunY - 1500} Z`}
                fill="#FFD9A0"
                transform={`rotate(${a} 540 ${sunY})`}
                opacity={0.55}
              />
            );
          })}
        </g>
        <circle cx={540} cy={sunY} r={118} fill="url(#sunDisc)" opacity={sunAlpha} />

        {/* far hills */}
        <g transform={`translate(${driftFar} 0)`}>
          <path d={ridgePath(FAR.baseY, FAR.amp, FAR.f, FAR.phase)} fill={farC} />
        </g>

        {/* birds */}
        {[0, 1, 2, 3].map((i) => (
          <Bird key={i} i={i} frame={frame} alpha={birdAlpha} />
        ))}

        {/* mid hills with a small house and a lit window */}
        <g transform={`translate(${driftMid} 0)`}>
          <path d={ridgePath(MID.baseY, MID.amp, MID.f, MID.phase)} fill={midC} />
          <g transform={`translate(${HOUSE_X} ${houseY + 6})`}>
            <path d="M-46 0 V-52 H46 V0 Z" fill="#1B0817" />
            <path d="M-58 -50 L0 -100 L58 -50 Z" fill="#1B0817" />
            <circle cx="-14" cy="-28" r="34" fill="url(#windowGlow)" opacity={windowGlow} />
            <rect x="-22" y="-38" width="16" height="20" rx="2" fill="#FFD27A" opacity={windowGlow} />
          </g>
        </g>

        {/* near hills */}
        <g transform={`translate(${driftNear} 0)`}>
          <path d={ridgePath(NEAR.baseY, NEAR.amp, NEAR.f, NEAR.phase)} fill={nearC} />
        </g>
      </svg>

      {/* keep the text area calm and readable */}
      <AbsoluteFill
        style={{background: 'linear-gradient(180deg, rgba(10,4,16,0.45) 0%, rgba(10,4,16,0.4) 28%, rgba(10,4,16,0.5) 46%, rgba(10,4,16,0.0) 68%)'}}
      />
    </AbsoluteFill>
  );
};
