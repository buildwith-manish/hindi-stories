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

**Keep the voiceover:** `001.wav` is committed in the repo and pinned by the `short-001` tag, so it can never be lost by later edits. Name future voiceovers `002.wav`, `003.wav`, and so on. Never overwrite an old one.
