import React, {createContext, useContext} from 'react';
import type {EndCardCopy, Platform, StoryInput} from './types';

/**
 * Where each app draws its own buttons and text on top of a 1080x1920 video.
 * Keep captions and logos clear of these margins (pixels from each edge).
 */
export const SAFE: Record<Platform, {top: number; bottom: number; right: number}> = {
  // Shorts: channel name + title at the bottom, like/comment/share on the right
  youtube: {top: 190, bottom: 380, right: 140},
  // Reels: header bar on top, username + caption + audio at the bottom (a little taller than Shorts)
  meta: {top: 250, bottom: 430, right: 130},
};

const PlatformContext = createContext<Platform>('youtube');
export const PlatformProvider = PlatformContext.Provider;
export const usePlatform = () => useContext(PlatformContext);
export const useSafe = () => SAFE[usePlatform()];

/** Picks the end card words for a platform, falling back to the older endLine / endSub / endFollow fields. */
export const resolveEndCopy = (story: StoryInput, platform: Platform): EndCardCopy => {
  const own = story.endCards?.[platform];
  return {
    line: own?.line ?? story.endLine ?? 'Tell us your story in the comments.',
    sub: own?.sub ?? story.endSub,
    cta: own?.cta ?? story.endFollow,
  };
};
