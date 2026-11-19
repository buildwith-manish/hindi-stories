import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {StoryProps} from './types';
import {FPS, K, buildTimeline} from './timing';
import {Background} from './components/Background';
import {EndCardYouTube} from './components/EndCardYouTube';
import {EndCardMeta} from './components/EndCardMeta';
import {PlatformProvider, SAFE, resolveEndCopy} from './platform';
import {LogoMark} from './components/Logo';
import {ThumbnailFrame} from './components/ThumbnailFrame';
import {Centered} from './styles/Centered';
import {Cinematic} from './components/Cinematic';
import {ImageLayer} from './components/ImageLayer';
import {Sunrise} from './scenes/Sunrise';
import {Letter} from './styles/Letter';
import {serif} from './fonts';

/**
 * How loud background sound should be at `seconds` into the voiceover: 1 away from the voice,
 * `floor` while it speaks. Eases down just before a phrase and back up just after it.
 */
const duckFactor = (seconds: number, spans: [number, number][] | undefined, floor: number) => {
  if (!spans || spans.length === 0 || floor >= 1) return 1;
  const ATTACK = 0.15;
  const RELEASE = 0.45;
  let dist = Infinity;
  for (const [a, b] of spans) {
    const d = seconds < a ? (a - seconds) * (RELEASE / ATTACK) : seconds > b ? seconds - b : 0;
    if (d < dist) dist = d;
  }
  const x = Math.min(1, dist / RELEASE);
  const eased = x * x * (3 - 2 * x);
  return floor + (1 - floor) * eased;
};

export const Story: React.FC<StoryProps> = (props) => {
  const {durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const platform = props.platform ?? 'youtube';
  const timeline = props.timeline ?? buildTimeline(props, undefined, platform);
  const endCopy = resolveEndCopy(props, platform);
  const endCardFrames = (timeline.thumbFrom ?? timeline.total) - timeline.endFrom;
  const musicVolume = props.musicVolume ?? 0.16;
  const musicDuck = props.musicDuck ?? 1;
  const sfxDuck = props.sfxDuck ?? 1;
  const duckAt = (absFrame: number, floor: number) =>
    duckFactor((absFrame - timeline.audioFrom) / FPS, props.voiceSpans, floor);

  return (
    <PlatformProvider value={platform}>
    <AbsoluteFill style={{backgroundColor: '#2F0A17'}}>
      {props.scene === 'sunrise' ? (
        <Sunrise timeline={timeline} />
      ) : (
        <Background tint={props.tint ?? 'warm'} image={props.background} />
      )}

      <ImageLayer lines={props.lines} timeline={timeline} />
      <Cinematic />

      {props.style !== 'letter' ? (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 95% 24% at 50% 39%, rgba(12,4,12,0.62) 0%, rgba(12,4,12,0.38) 55%, transparent 100%)',
            opacity: interpolate(frame, [timeline.endFrom - 8 * K, timeline.endFrom + 6 * K], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        />
      ) : null}

      {props.style === 'letter' ? (
        <Letter lines={props.lines} timeline={timeline} title={props.title} />
      ) : (
        <Centered lines={props.lines} timeline={timeline} />
      )}

      {/* small channel mark, kept clear of the Shorts buttons and caption area */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: SAFE[platform].top,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: 0.85,
        }}
      >
        <LogoMark size={84} idPrefix="wm" glow={false} />
        <span style={{fontFamily: serif, fontWeight: 700, fontSize: 34, color: '#FBE8C8', letterSpacing: 0.5}}>
          Ankahi Ghar Ki
        </span>
      </div>

      {/* calm the picture behind the end card so its text stays readable */}
      <AbsoluteFill
        style={{
          backgroundColor: '#14060E',
          opacity: interpolate(frame, [timeline.endFrom - 6 * K, timeline.endFrom + 22 * K], [0, 0.74], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      <Sequence from={timeline.endFrom} durationInFrames={endCardFrames}>
        {platform === 'meta' ? <EndCardMeta copy={endCopy} /> : <EndCardYouTube copy={endCopy} />}
      </Sequence>

      {props.thumbnail && timeline.thumbFrom !== undefined ? (
        <Sequence from={timeline.thumbFrom} durationInFrames={timeline.total - timeline.thumbFrom}>
          <AbsoluteFill
            style={{
              opacity: interpolate(frame - timeline.thumbFrom, [0, 6 * K], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <ThumbnailFrame copy={props.thumbnail} />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {props.audio ? (
        <Sequence from={timeline.audioFrom}>
          <Audio src={staticFile(props.audio)} volume={props.voiceVolume ?? 1} />
        </Sequence>
      ) : null}

      {(props.sfx ?? []).map((cue, i) => {
        const base = cue.line === 'end' ? timeline.endFrom : timeline.lines[cue.line]?.from ?? 0;
        const start = Math.max(0, base + Math.round((cue.at ?? 0) * FPS));
        const vol = cue.volume ?? 0.5;
        return (
          <Sequence key={`sfx-${i}`} from={start}>
            <Audio
              src={staticFile(cue.src)}
              volume={(f) => vol * duckAt(start + f, sfxDuck) * Math.min(1, Math.max(0, (durationInFrames - (start + f)) / (24 * K)))}
            />
          </Sequence>
        );
      })}

      {props.music ? (
        <Audio
          src={staticFile(props.music)}
          loop
          // Without this, a render restarts the volume curve (fade-in and ducking) every time the music loops;
          // the preview doesn't, which is why the mix only went wrong in the rendered video.
          loopVolumeCurveBehavior="extend"
          volume={(f) =>
            duckAt(f, musicDuck) *
            interpolate(f, [0, 30 * K, durationInFrames - 45 * K, durationInFrames], [0, musicVolume, musicVolume, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}
    </AbsoluteFill>
    </PlatformProvider>
  );
};
