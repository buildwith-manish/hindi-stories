// Usage: npm run voice -- stories/004-papa-cycle.json
// Prints the voice text, one line per row, ready to paste into a text-to-speech tool.
import {readFileSync} from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npm run voice -- stories/004-papa-cycle.json');
  process.exit(1);
}
const story = JSON.parse(readFileSync(file, 'utf8'));
console.log(story.lines.map((l) => l.voice ?? l.caption).join('\n'));
