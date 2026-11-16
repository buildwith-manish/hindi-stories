// Usage: npm run render -- stories/001-papa-bus-pass.json [more.json ...] [--only=youtube|meta] [--concurrency=4]
// Renders each story twice (1080x1920, H.264), once per platform:
//   out/<id>-youtube.mp4   YouTube Shorts (comment + Subscribe end card)
//   out/<id>-reels.mp4     Instagram Reels / Facebook Reels (Send + Save + Follow end card)
import {spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1];
// Browser tabs rendering frames at once inside ONE render (Remotion joins them itself, no seams).
const concurrency = args.find((a) => a.startsWith('--concurrency='))?.split('=')[1] ?? process.env.RENDER_CONCURRENCY ?? '4';
if (!/^[1-9][0-9]*$/.test(concurrency)) {
  console.error('--concurrency must be a whole number, e.g. --concurrency=4');
  process.exit(1);
}

if (files.length === 0 || (only && !['youtube', 'meta'].includes(only))) {
  console.error('Usage: npm run render -- stories/001-papa-bus-pass.json [more.json ...] [--only=youtube|meta] [--concurrency=4]');
  process.exit(1);
}

const TARGETS = [
  {platform: 'youtube', composition: 'StoryYouTube', suffix: 'youtube'},
  {platform: 'meta', composition: 'StoryMeta', suffix: 'reels'},
].filter((t) => !only || t.platform === only);

mkdirSync('out/.props', {recursive: true});

for (const file of files) {
  const story = JSON.parse(readFileSync(file, 'utf8'));
  for (const t of TARGETS) {
    const propsFile = path.join('out', '.props', `${story.id}-${t.suffix}.json`);
    writeFileSync(propsFile, JSON.stringify({...story, platform: t.platform}));
    const output = path.join('out', `${story.id}-${t.suffix}.mp4`);
    const cmd = ['remotion', 'render', 'src/index.ts', t.composition, output, `--props=${propsFile}`, '--crf=12', '--x264-preset=slow', '--pixel-format=yuv420p', '--audio-bitrate=320k', `--concurrency=${concurrency}`];
    if (process.env.CHROME_PATH) cmd.push(`--browser-executable=${process.env.CHROME_PATH}`);
    console.log(`\nRendering ${file} (${t.platform}) -> ${output}`);
    const r = spawnSync('npx', cmd, {stdio: 'inherit', shell: process.platform === 'win32'});
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}
