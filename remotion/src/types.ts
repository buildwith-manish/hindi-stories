export type StyleName = 'centered' | 'letter';
export type Tint = 'warm' | 'cool' | 'gold';
export type SceneName = 'sunrise';
/** youtube = YouTube Shorts. meta = Instagram Reels + Facebook Reels (same safe areas, same end card). */
export type Platform = 'youtube' | 'meta';

/** Words on the end card for one platform. */
export type EndCardCopy = {
  /** Main call to action (the question or the ask). */
  line: string;
  /** Smaller line under it (shown in brackets), e.g. Hindi. */
  sub?: string;
  /** Text on the button-style pill: Subscribe (YouTube) or Follow (Instagram/Facebook). */
  cta?: string;
};

export type Motion = {
  /** push = slow zoom in, pull = slow zoom out, drift = gentle sideways glide */
  kind?: 'push' | 'pull' | 'drift';
  /** Point (0..1, 0..1) of the picture the camera moves toward / away from. Default centre. */
  focus?: [number, number];
  /** Start / end zoom (1 = fills the frame). */
  from?: number;
  to?: number;
};

export type SfxCue = {
  /** Sound file inside public/, e.g. "audio/sfx/chime.mp3" */
  src: string;
  /** Line number (0 = first line) it plays with, or "end" for the end card. */
  line: number | 'end';
  /** Seconds after that line starts. Default 0 */
  at?: number;
  volume?: number;
};

export type StoryLine = {
  /** Opening hook: bigger, bolder text with a faster reveal. */
  hook?: boolean;
  /** Camera move for this line's image. */
  motion?: Motion;
  /** Slow drifting mist over this line's image. */
  mist?: boolean;
  /** Warm lamp-like flicker on this line's image. */
  flicker?: boolean;
  /** Soft pulsing glow at this point (0..1, 0..1) of the picture, e.g. the sun. */
  glow?: [number, number];
  /** How bright this line's image is (0..1). Default 0.85 */
  imageOpacity?: number;
  /** Text the voice reads (use this for TTS). Falls back to caption. */
  voice?: string;
  /** Text shown on screen. */
  caption: string;
  /** Optional small second line under the caption (e.g. Devanagari). Centered style only. */
  sub?: string;
  /** Words to emphasise (gold glow + a drawn underline). Centered style only. */
  highlight?: string[];
  /** Optional picture inside public/ shown behind this line with a slow camera move. */
  image?: string;
  /** Force how long this line stays on screen. Leave out to auto-time. */
  seconds?: number;
};

/** The cover image: two big lines over the picture, shown as the very last frames of the video and exported as a PNG. */
export type ThumbnailCopy = {
  /** Top line, e.g. "Papa never told me." */
  line1: string;
  /** Bottom line, e.g. "His old bus pass did." */
  line2: string;
  /** Words of line2 shown in gold with an underline. */
  highlight?: string[];
  /** Small Devanagari line under it. */
  sub?: string;
  /** Picture inside public/. Optional: with no picture the cover is text on a dark background */
  image?: string;
  /** Point (0..1, 0..1) of the picture to keep in the centre. */
  focus?: [number, number];
  /** How long the cover stays on the last frames of the video (0 = leave it out). Default 1. */
  seconds?: number;
};

export type StoryInput = {
  id: string;
  style: StyleName;
  tint?: Tint;
  /** Animated illustrated backdrop. Leave out for the plain glowing background. */
  scene?: SceneName;
  /** Letter style only: the salutation at the top, e.g. "Dear Papa," */
  title?: string;
  lines: StoryLine[];
  /** Voiceover file inside public/, e.g. "audio/002.wav" */
  audio?: string;
  /** Background music file inside public/ */
  music?: string;
  musicVolume?: number;
  /** Music level while the voice is speaking, as a share of musicVolume (0.5 = half). Needs voiceSpans. */
  musicDuck?: number;
  /** Same for sound effects (1 = no ducking). */
  sfxDuck?: number;
  /** When the voice is speaking, in seconds from the start of the voiceover file: [[start, end], ...] */
  voiceSpans?: [number, number][];
  /** Voiceover volume, 0-1. Default 1. */
  voiceVolume?: number;
  /** Optional background image inside public/ (shown softly behind the text) */
  background?: string;
  /** A separate end card for each platform. Anything left out falls back to endLine / endSub / endFollow. */
  endCards?: {youtube?: EndCardCopy; meta?: EndCardCopy};
  /** Call-to-action on the end card (used when endCards has nothing for the platform) */
  endLine?: string;
  /** Smaller line under it (shown in brackets), e.g. Hindi */
  endSub?: string;
  /** Soft button-style line, e.g. "Follow for the next unsaid story" */
  endFollow?: string;
  /** Sound effects placed on lines or the end card */
  sfx?: SfxCue[];
  /** Extra seconds to hold the final line (the emotional pause). Default 1.2 */
  finalHold?: number;
  /** Cover image shown at the very end (so it can be picked as the thumbnail) and exported as a PNG. */
  thumbnail?: ThumbnailCopy;
};

export type Timeline = {
  lines: {from: number; duration: number}[];
  audioFrom: number;
  endFrom: number;
  /** First frame of the cover image, if the story has one. */
  thumbFrom?: number;
  total: number;
};

export type StoryProps = StoryInput & {timeline?: Timeline; platform?: Platform};
