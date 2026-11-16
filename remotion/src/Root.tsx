import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Story} from './Story';
import {ThumbnailFrame} from './components/ThumbnailFrame';
import {FPS, buildTimeline} from './timing';
import type {StoryInput, StoryProps} from './types';
import story001 from '../stories/001-papa-bus-pass.json';

const calculateMetadata: CalculateMetadataFunction<StoryProps> = async ({props}) => {
  let audioSeconds: number | undefined;
  if (props.audio) {
    try {
      audioSeconds = await getAudioDurationInSeconds(staticFile(props.audio));
    } catch (e) {
      console.warn(`Could not read audio length for ${props.audio}; using automatic timing.`, e);
    }
  }
  const timeline = buildTimeline(props, audioSeconds, props.platform ?? 'youtube');
  return {durationInFrames: timeline.total, props: {...props, timeline}};
};

const base = story001 as StoryInput;

/** The cover on its own, for `remotion still`. */
const ThumbnailStill: React.FC<StoryProps> = ({thumbnail}) => (thumbnail ? <ThumbnailFrame copy={thumbnail} /> : null);

/** Same story, two versions: each has its own end card and its own safe areas. */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="StoryYouTube"
      component={Story}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={900}
      defaultProps={{...base, platform: 'youtube'} as StoryProps}
      calculateMetadata={calculateMetadata}
    />
    <Composition
      id="StoryMeta"
      component={Story}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={900}
      defaultProps={{...base, platform: 'meta'} as StoryProps}
      calculateMetadata={calculateMetadata}
    />
    <Composition
      id="Thumbnail"
      component={ThumbnailStill}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{...base} as StoryProps}
    />
  </>
);
