# Ankahi Ghar Ki — Remotion template

One template, many stories. Each story is a small JSON file in `stories/`.

## Setup (once)
```
npm install
```

## Preview
```
npm run studio
```

## Make a video
1. Copy `stories/001-papa-bus-pass.json` to a new file and change the lines.
2. (Optional) Get the voice text: `npm run voice -- stories/002-your-story.json`, paste it into your TTS tool, and save the mp3 in `public/audio/`.
3. Add `"audio": "audio/002.mp3"` to the JSON. Caption timing then follows the voice length.
4. Render: `npm run render -- stories/002-your-story.json` makes two videos:
   - `out/<id>-youtube.mp4` for YouTube Shorts
   - `out/<id>-reels.mp4` for Instagram Reels and Facebook Reels

Only one platform: add `--only=youtube` or `--only=meta`.
Render several at once: `npm run render -- stories/002.json stories/003.json`
In `npm run studio` you will see two compositions, `StoryYouTube` and `StoryMeta`.

## Story fields
| Field | What it does |
|---|---|
| `style` | `centered` (words fade in over a glowing background) or `letter` (typed on handwritten paper) |
| `tint` | `warm` (default), `cool`, `gold` |
| `lines[].voice` | What the voice reads (for TTS) |
| `lines[].caption` | What appears on screen |
| `lines[].sub` | Optional small second line (centered style), e.g. Devanagari |
| `scene` | `"sunrise"`: an illustrated dawn that brightens and rises across the story. Leave out for the plain glowing background |
| `lines[].highlight` | Words to emphasise, e.g. `["never"]`: they turn gold and get an underline drawn under them (centered style) |
| `lines[].image` | A picture in `public/` shown behind that line, crossfading with a slow camera move. Works with AI-generated or stock images |
| `lines[].seconds` | Force how long a line stays; set on every line for exact sync |
| `title` | Letter style only, e.g. `"Dear Papa,"` |
| `audio`, `music`, `musicVolume` | Files inside `public/` |
| `background` | Optional image inside `public/`, shown softly behind the text |
| `endCards` | A separate end card per platform: `{"youtube": {line, sub, cta}, "meta": {line, sub, cta}}`. `line` is the ask, `sub` the Hindi line, `cta` the button text. Anything left out falls back to `endLine` / `endSub` / `endFollow` |
| `endLine` | Fallback end-card line, used when `endCards` has nothing for that platform |
| `finalHold` | Extra seconds on the last line (the pause). Default 1.2 |

## Look and feel
Every video gets film grain, a drifting warm light leak, floating dust and a soft vignette (`src/components/Cinematic.tsx`). The flame on the end card flickers. To tune the mood, edit the colours in `src/scenes/Sunrise.tsx` or the tints in `src/components/Background.tsx`.

## Notes
- Fonts (Lora, Caveat, Noto Serif Devanagari) are bundled in `public/fonts`, so rendering works offline.
- Hindi caption: add `"sub": "हिंदी लाइन"` to any line (centered style). It shows smaller under the English line, in brackets (added automatically).
- If Remotion can't download its browser, set `CHROME_PATH` to your Chrome's path.
- Text sits in the Shorts-safe area: clear of the bottom caption area and the right-hand buttons.

## Hook, camera moves, sound (added in v5)
- `"hook": true` on the first line gives it bigger, bolder text and a faster reveal. Open with the most curious line of the story.
- Per-line image options: `"motion": {"kind": "push|pull|drift", "focus": [x, y], "from": 1.1, "to": 1.3}` (focus is 0..1; the camera moves toward / away from that point), `"flicker": true` (lamp light), `"glow": [x, y]` (pulsing sun glow), `"imageOpacity": 0.85`.
- Tip: put the interesting part of a picture away from the middle, or choose `focus` so it moves out of the caption band.
- `"sfx": [{"src": "audio/sfx/chime.mp3", "line": "end", "at": 0.05, "volume": 0.5}]` plays a sound with a line (0 = first line) or the end card. Because cues follow the line start, they stay in sync when the voiceover changes the timing.
- End card: `endLine` (CTA), `endSub` (Hindi, bracketed automatically), `endFollow` (button-style line).
- `python3 scripts/make-audio.py` regenerates the original music + sound effects in `public/audio/` (no licences needed). Sounds: music-warm-01, hit, drawer-slide, coin-clink, paper-rustle, whoosh-air, bus-distant, birds-dawn, warm-swell, chime.
- With a voiceover, keep `musicVolume` around 0.15 to 0.2 so the voice stays clear.

## Two end cards, two safe areas (added in v6.1)
- **YouTube Shorts** (`EndCardYouTube.tsx`): 3.0s. Asks for a *comment* (comment icon + question), then a red *Subscribe* button with a bell that rings. Short on purpose: Shorts loop, so a long tail costs watch time.
- **Instagram / Facebook Reels** (`EndCardMeta.tsx`): 3.8s. Asks to *send it to the person* (Send and Save chips), then a *Follow* button. Reels spread through shares and saves.
- `src/platform.tsx` holds the safe margins for each app (`SAFE`). Reels reserve more room at the top (header bar) and bottom (username, caption, audio), so captions and the channel mark sit a little higher on that version.
- The lead-in before the first line is now 0.25s (was 0.7s), so the hook is on screen right away.
- Use different wording in `endCards.youtube` and `endCards.meta`: the same question works for both only by accident.
