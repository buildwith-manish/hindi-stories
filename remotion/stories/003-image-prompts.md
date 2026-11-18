# Short #3 — image prompts ("Maa har raat 2 baje uthti thi")

Save each image into `remotion/public/images/` with EXACTLY these names. Vertical 9:16. Generate at the highest size your tool allows, then upscale to 1620 x 2880 (same filenames).

Make all 7 in the same session so the look stays consistent.

## Why this video looks different from Shorts #1 and #2 (but still the same series)
- #1 was dawn and a bus stop (warm gold). #2 was a kitchen in the evening (warm maroon).
- #3 is **night**: deep navy blue with ONE warm bulb as the only warm light. The mother, the film look, the fonts and the end card stay the same, so it is clearly "Ankahi Ghar Ki".
- New places: bedroom, dark corridor, night lane, doorway. No kitchen-stove or hands-on-plate shots, so nothing repeats.

## Shared style block (paste at the START of every prompt)
Cinematic vertical 9:16 photograph, shot on 35mm film, deep navy-blue night, a single warm tungsten bulb as the only warm light in the scene, deep shadows, fine film grain, muted palette of midnight blue, maroon and amber, shallow depth of field, authentic modest middle-class Indian home at 2 AM, quiet and emotional, no text, no watermark, no logos.

## The mother (repeat in shots 1, 2 and 5; same woman as Short #2)
An Indian mother in her mid-40s with grey streaks in black hair tied in a loose bun, a small red bindi, a faded cotton saree worn as simple nightwear with a thin shawl over her shoulders, thin glass bangles.
Reference: use `002-06-hands.jpg` from Short #2 as a character reference (strength about 0.7).

## The son (shot 3 only)
A young man in his late twenties in a plain shirt with a backpack, seen from behind. Same man as in Short #2's "years later" shot, if you want a reference (`002-04-years-later.jpg`).

## Composition rule
Captions sit in the middle of the screen. Keep the main subject in the LOWER third or UPPER third and leave the middle calm and dark. Shot 7 is only for the thumbnail, so its subject goes in the middle.

---

1. `003-01-bedside.jpg` — line 1 (hook)
The mother sitting up on the edge of a thin mattress in a dark small bedroom at night, seen from the side or behind in silhouette, shoulders slightly hunched, shawl over her shoulders. Cool moonlight from a small window on the left. A round wall clock on the far wall, softly out of focus, showing about 2:00. She fills the UPPER third; the lower two thirds are dark blanket and floor. Her face stays in shadow.

2. `003-02-corridor.jpg` — line 2
A long narrow dark corridor of a small Indian home at night. The mother, seen from behind in silhouette, walks slowly toward a doorway at the far end that glows warm amber from a kitchen bulb. Blue shadows along the walls. In the lower third foreground, a steel water glass and a steel jug on a low shelf, slightly out of focus.

3. `003-03-lane.jpg` — line 3
A young man in his late twenties, plain shirt, backpack, seen from behind, walking alone down a narrow empty lane at about 1:45 AM toward the door of a small house. One yellow streetlight, thin night mist, blue darkness. He is in the LOWER third; the upper half is dark walls and sky. He looks tired.

4. `003-04-covered-plate.jpg` — line 4 (the key image)
Inside a small kitchen at night. On a plain table, one steel plate covered by a second steel plate turned upside down, with a thin curl of steam escaping from the edge. A bare warm bulb hangs above, and a small steel glass of water stands beside the plate. The plate is in the LOWER third; the upper half is dark kitchen shelves. No people.

5. `003-05-pretending.jpg` — line 5
Seen through a half-open doorway (dark door-frame edges in the foreground), the mother lying on her side on a thin mattress on the floor in the next room, eyes closed, a thin blanket over her, one hand resting open near her face. Cool blue night light, with a thin warm strip of kitchen light reaching across the floor toward her. She is in the LOWER third.

6. `003-06-chair.jpg` — line 6 (last line)
A plain wooden chair placed right beside the front door inside a small home at night. A folded thin cotton shawl lies on the seat. A small warm bulb behind it casts a soft amber glow, and the door is slightly ajar, showing dark blue night outside. The chair is in the LOWER third; the upper half is dark. No people.

7. `003-07-thumbnail.jpg` — thumbnail only (not in the video)
Close-up, centered: a small round bedside alarm clock glowing softly with its hands at exactly 2:00 (hour hand on 2, minute hand on 12), on a dark bedside table. A thin line of warm amber light shows under a door in the background. Everything else is deep navy-black with plenty of empty dark space above and below for the title. No people. If the clock hands are wrong, regenerate.

---

## After the images are in
1. Upscale all 7 to 1620 x 2880 and keep the same filenames.
2. Record the voiceover (script in `003-voiceover.md`), then run `scripts/prepare-voice.py` or send it to me for syncing.
3. Add `"audio": "audio/003.wav"` to `003-maa-2-baje.json` after syncing.


---

## Final images used in the video (added after generation)
| File | What it shows |
|---|---|
| `003-01-bedside.jpg` | Mother sitting up on the bed in silhouette, wall clock behind |
| `003-02-corridor.jpg` | Mother walking in silhouette toward the warm doorway |
| `003-03-lane.jpg` | Young man with a backpack in the night lane |
| `003-04-hot-water.jpg` | Hanging bulb and a steaming glass of water (replaces the "covered plate" shot; lines 4 and 5 were rewritten to match) |
| `003-05-pretending.jpg` | Mother lying with eyes closed, seen through the doorway |
| `003-06-chair.jpg` | Empty chair with a shawl in the warm room |
| `003-07-thumbnail.jpg` | Alarm clock (thumbnail only). NOTE: the hands read about 10:05, not 2:00. Regenerate with "hour hand exactly on 2, minute hand straight up on 12" before using it with a "2 AM" title. |

All files are 768x1344 for now. Upscale to 1620x2880 with the same filenames before the final render.
