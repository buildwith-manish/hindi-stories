import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {StoryProps} from './types';
import {FPS, buildTimeline} from './timing';
import {Background} from './components/Background';
import {EndCardYouTube} from './components/EndCardYouTube';
import {EndCardMeta} from './components/EndCardMeta';
import {PlatformProvider, SAFE, resolveEndCopy} from './platform';
import {LogoMark} from './components/Logo';
import {Centered} from './styles/Centered';
import {Cinematic} from './components/Cinematic';
import {ImageLayer} from './components/ImageLayer';
import {Sunrise} from './scenes/Sunrise';
import {Letter} from './styles/Letter';
import {serif} from './fonts';

export const Story: React.FC<StoryProps> = (props) => {
  const {durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const platform = props.platform ?? 'youtube';
  const timeline = props.timeline ?? buildTimeline(props, undefined, platform);
  const endCopy = resolveEndCopy(props, platform);
  const endCardFrames = timeline.total - timeline.endFrom;
  const musicVolume = props.musicVolume ?? 0.16;

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
            opacity: interpolate(frame, [timeline.endFrom - 8, timeline.endFrom + 6], [1, 0], {
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
          opacity: interpolate(frame, [timeline.endFrom - 6, timeline.endFrom + 22], [0, 0.74], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      <Sequence from={timeline.endFrom} durationInFrames={endCardFrames}>
        {platform === 'meta' ? <EndCardMeta copy={endCopy} /> : <EndCardYouTube copy={endCopy} />}
      </Sequence>

      {props.audio ? (
        <Sequence from={timeline.audioFrom}>
          <Audio src={staticFile(props.audio)} />
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
              volume={(f) => vol * Math.min(1, Math.max(0, (durationInFrames - (start + f)) / 24))}
            />
          </Sequence>
        );
      })}

      {props.music ? (
        <Audio
          src={staticFile(props.music)}
          loop
          volume={(f) =>
            interpolate(f, [0, 30, durationInFrames - 45, durationInFrames], [0, musicVolume, musicVolume, 0], {
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
