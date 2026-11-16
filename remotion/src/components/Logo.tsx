import React from 'react';

/** The Ankahi Ghar Ki mark: a house with a small flame (diya) inside. */
export const LogoMark: React.FC<{size: number; idPrefix?: string; glow?: boolean; flicker?: number}> = ({
  size,
  idPrefix = 'lm',
  glow = true,
  flicker,
}) => {
  const s = flicker === undefined ? 1 : 1 + 0.045 * Math.sin(flicker / 3.1) + 0.025 * Math.sin(flicker / 1.7);
  const sway = flicker === undefined ? 0 : Math.sin(flicker / 5.3) * 2.2;
  return (
  <svg width={size} height={size} viewBox="0 0 800 800" style={{display: 'block', overflow: 'visible'}}>
    <defs>
      <radialGradient id={`${idPrefix}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFB347" stopOpacity="0.75" />
        <stop offset="0.55" stopColor="#F5762E" stopOpacity="0.22" />
        <stop offset="1" stopColor="#F5762E" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${idPrefix}-flame`} x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#FFD27A" />
        <stop offset="1" stopColor="#F5762E" />
      </linearGradient>
    </defs>
    {glow ? <circle cx="400" cy="500" r="230" fill={`url(#${idPrefix}-glow)`} /> : null}
    <g fill="none" stroke="#FBE8C8" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round">
      <path d="M252 418 V548 Q252 574 278 574 H522 Q548 574 548 548 V418" />
      <path d="M200 432 L400 246 L600 432" />
    </g>
    <g transform={`translate(${400 + sway} 566) scale(${1 - (s - 1) * 0.5} ${s}) translate(-400 -566)`}>
      <path
        d="M400 408 C437 452 463 484 463 518 C463 548 436 566 400 566 C364 566 337 548 337 518 C337 484 363 452 400 408 Z"
        fill={`url(#${idPrefix}-flame)`}
      />
      <path
        d="M400 478 C418 500 430 515 430 534 C430 551 416 560 400 560 C384 560 370 551 370 534 C370 515 382 500 400 478 Z"
        fill="#FFF3D6"
        opacity="0.92"
      />
    </g>
  </svg>
  );
};
