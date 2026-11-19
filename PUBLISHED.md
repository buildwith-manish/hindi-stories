# Published Shorts — Ankahi Ghar Ki

Log of every video uploaded, with the git tag that pins the exact project state (story JSON, voiceover, images, music) it was rendered from. To re-render an old Short: `git checkout short-001`.

## Short #1 — Papa's bus pass  (`short-001`)

| | |
|---|---|
| Story file | `remotion/stories/001-papa-bus-pass.json` |
| On-screen hook | "Papa never told me. His old bus pass did." |
| YouTube title | starts "He never missed a single day…" (full title: add here) |
| Length | 0:32 |
| Published | 16 Nov 2026, about 21:00 IST |
| Format | 1080x1920, 60 fps, H.264 CRF 16 |
| Voiceover | `remotion/public/audio/001.wav` (Hindi, ElevenLabs, -15.4 LUFS, trimmed to 25.5 s) |
| Music | `remotion/public/audio/music-warm-01.mp3` (volume 0.12, ducked under voice) |
| Git tag | `short-001` (commit `e9c6e75`) |

**Results after about 18 hours (YouTube Studio, 17 Nov 2026):**
- Views: 1,117
- Watch time: 2.4 hours
- Subscribers: +3
- Likes: 16
- Stayed to watch: 44.8%; swiped away: 55.2%
- Average view duration: 0:14

**Takeaways:** about 55% swiped away at the start and the 0:14 average means most viewers left around the middle. Next videos: faster hook (voice from frame 1), shorter (about 20 s), stronger payoff, end card about 1.5 s.

**Where the Short #1 files are now:** removed from `main` to keep it clean for Short #2, but nothing is lost. The story JSON, `001.wav` voiceover, the three images and its sound effects (bus-distant, drawer-slide, coin-clink, paper-rustle) all live in the `short-001` tag. Restore any of them with `git checkout short-001 -- <path>`, or re-render the whole video from `git checkout short-001`.

**Rule:** name each voiceover `002.wav`, `003.wav` and so on. Never overwrite an old one.

## Short #2 — Maa said she wasn't hungry  (`short-002`)

| | |
|---|---|
| Story file | `remotion/stories/002-maa-not-hungry.json` |
| On-screen hook | "Maa always said she wasn't hungry." |
| Format | 1080x1920, 60 fps, H.264 CRF 16; about 26 s (YouTube) |
| Voiceover | `remotion/public/audio/002.wav` (processed: pauses tightened, -15.7 LUFS); original in `voiceover-originals/002-original.mp3` |
| Images | 7 files `002-01` to `002-07`, upscaled to 1620x2880 |
| Git tag | `short-002` (commit `36563a0`) |

**Result after about 18 hours (reported):** 8 views. Likely a reach/visibility problem rather than only the story; check the Reach tab (impressions) and the video's restrictions in YouTube Studio.

**Where the Short #2 files are now:** removed from `main` to keep it clean for Short #3. All of them live in the `short-002` tag. Restore with `git checkout short-002 -- <path>`.

## Short #3 — Maa har raat 2 baje uthti thi  (`short-003`)

| | |
|---|---|
| Story file | `remotion/stories/003-maa-2-baje.json` |
| On-screen hook | "Maa woke up at 2 AM every night." |
| Format | 1080x1920, 60 fps, H.264 CRF 16; about 29 s (YouTube), about 30 s (Reels) |
| Voiceover | `remotion/public/audio/003.wav` (processed, -15.4 LUFS); original in `voiceover-originals/003-original.mp3` |
| Images | 7 files `003-01` to `003-07` (768x1344), thumbnail copy "Maa woke at 2 AM. / I thought it was water." |
| Git tag | `short-003` (commit `046eb98`) |
| Posted | scheduled 18 Nov 2026, 20:00 IST on YouTube, Instagram and Facebook |

**Where the Short #3 files are now:** removed from `main` to keep it clean for Short #4. All of them live in the `short-003` tag. Restore with `git checkout short-003 -- <path>`.

## Short #4 — Papa har Sunday meri purani cycle saaf karte the  (in progress)

| | |
|---|---|
| Story file | `remotion/stories/004-papa-cycle.json` (script, captions, sound effects, end cards, thumbnail copy ready; gold morning tint) |
| Scripts | `004-voiceover.md` (emotion tags, male narrator) and `004-image-prompts.md` (7 images) in `remotion/stories/` |
| Images | 7 files in `remotion/public/images/` (572x1024, except `004-06` at 1536x2752); upscale to 1620x2880 with the same filenames |
| Still needed | voiceover `004.wav`, then sync, render and upload |
| Git tag | add `short-004` when uploaded |
