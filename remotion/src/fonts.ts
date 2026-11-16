import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Fonts are bundled in public/fonts (Lora, Caveat, Noto Serif Devanagari — all SIL OFL).
 * No internet needed at render time.
 */
const files: [string, string, string, string][] = [
  ['Lora', 'fonts/lora-latin-500-normal.woff2', '500', 'normal'],
  ['Lora', 'fonts/lora-latin-700-normal.woff2', '700', 'normal'],
  ['Lora', 'fonts/lora-latin-400-italic.woff2', '400', 'italic'],
  ['Caveat', 'fonts/caveat-latin-500-normal.woff2', '500', 'normal'],
  ['Caveat', 'fonts/caveat-latin-700-normal.woff2', '700', 'normal'],
  ['Noto Serif Devanagari', 'fonts/noto-serif-devanagari-devanagari-400-normal.woff2', '400', 'normal'],
  ['Noto Serif Devanagari', 'fonts/noto-serif-devanagari-devanagari-500-normal.woff2', '500', 'normal'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading bundled fonts');
  Promise.all(
    files.map(([family, path, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(path)}) format('woff2')`, {weight, style});
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .catch((e) => console.error('Font load failed', e))
    .finally(() => continueRender(handle));
}

export const serif = "'Lora', Georgia, serif";
export const serifItalic = "'Lora', Georgia, serif";
export const handwriting = "'Caveat', 'Lora', cursive";
export const devanagari = "'Noto Serif Devanagari', serif";
