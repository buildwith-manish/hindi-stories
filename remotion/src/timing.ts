import type {Platform, StoryInput, Timeline} from './types';

/** Output frame rate. */
export const FPS = 60;
/** The frame rate all motion constants (sine speeds, fade lengths, drift speeds) were authored at. */
export const BASE_FPS = 30;
/** Scale between output frames and authored frames: 2 at 60 fps. */
export const K = FPS / BASE_FPS;
/** Short lead-in: the hook is on screen almost at once, so a viewer can't swipe away before it starts. */
export const INTRO_S = 0.25;
/** YouTube's card is short: Shorts loop, and a long tail drags down how much of the video people watch. */
export const END_CARD_S: Record<Platform, number> = {youtube: 2.0, meta: 3.0};

const words = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

/** Reading time for a caption: roughly 0.32s per word plus a beat. */
export const autoSeconds = (caption: string) =>
  Math.min(5, Math.max(2.2, 1.2 + words(caption) * 0.32));

/**
 * Builds the frame timeline.
 * - If every line has `seconds`, those are used exactly.
 * - If a voiceover length is known, line lengths are shared out by word count so the
 *   captions roughly follow the voice. Set `seconds` on any line to tune the sync.
 */
export const buildTimeline = (story: StoryInput, audioSeconds?: number, platform: Platform = 'youtube'): Timeline => {
  const n = story.lines.length;
  const allManual = story.lines.every((l) => l.seconds !== undefined);

  let secs = story.lines.map((l) => l.seconds ?? autoSeconds(l.caption));

  if (audioSeconds && !allManual) {
    const weights = story.lines.map((l) => words(l.voice ?? l.caption) + 2);
    const total = weights.reduce((a, b) => a + b, 0);
    secs = weights.map((w) => (w / total) * (audioSeconds + 0.3));
  }

  secs[n - 1] += story.finalHold ?? 1.2;

  const intro = Math.round(INTRO_S * FPS);
  let cursor = intro;
  const lines = secs.map((s) => {
    const duration = Math.max(1, Math.round(s * FPS));
    const entry = {from: cursor, duration};
    cursor += duration;
    return entry;
  });

  const endCardEnd = cursor + Math.round(END_CARD_S[platform] * FPS);
  const thumbFrames = story.thumbnail ? Math.round((story.thumbnail.seconds ?? 1) * FPS) : 0;

  return {
    lines,
    audioFrom: intro,
    endFrom: cursor,
    thumbFrom: thumbFrames > 0 ? endCardEnd : undefined,
    total: endCardEnd + thumbFrames,
  };
};
