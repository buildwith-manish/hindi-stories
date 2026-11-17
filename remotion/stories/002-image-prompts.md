# Short #2 — image prompts (Maa said she wasn't hungry)

Save each image into `remotion/public/images/` with EXACTLY these names. Vertical 9:16, 1620x2880 if the tool allows (minimum 1440x2560; the camera zooms in, so more pixels = sharper).

Make all 7 in the same session/chat so the look and the mother stay consistent.

## Shared style block (paste at the START of every prompt)
Cinematic vertical 9:16 photograph, shot on 35mm film, warm tungsten lamp and soft window light, deep shadows, fine film grain, muted warm palette of maroon, amber and brown, shallow depth of field, authentic modest middle-class Indian home, quiet and emotional, no text, no watermark, no logos.

## The mother (repeat in shots 1, 3, 5, 6, 7 for consistency)
An Indian mother in her mid-40s, medium-brown skin, simple faded maroon-and-cream cotton saree, hair in a loose bun, thin glass bangles on both wrists, tired but gentle.

## Composition rule
The captions sit in the middle of the screen. Keep the main subject in the LOWER third or UPPER third and leave the middle calm and darker. (Shot 7 is the exception: it is the cover, so the subject goes in the middle.)

---

1. `002-01-stove.jpg` — line 1 (hook)
The mother seen from behind standing at a small gas stove at early dawn, head slightly bowed, pale morning light from a small window on the left, steam rising from a tawa. She fills the UPPER third of the frame; the lower two thirds are dark kitchen counter, steel utensils and soft shadow. No face visible.

2. `002-02-rotis.jpg` — line 2
Top-down view of a steel roti box (hot case) open with EXACTLY four rotis inside, placed in the LOWER third. Above it on a worn wooden floor mat, three empty steel plates (thalis) in a row. Warm lamp light, a little steam. If the roti count is wrong, regenerate until it is four.

3. `002-03-serving.jpg` — line 3
The mother's hands with glass bangles placing a roti onto a child's steel plate on a low dining mat on the floor. Three small children's hands reaching in from the lower left. Her own steel plate is empty and pushed aside. Her face is out of frame or softly blurred in the upper right. Warm lamp light from above. Subject in the LOWER third.

4. `002-04-years-later.jpg` — line 4
Years later. A young man in his late twenties in a plain shirt, seen from behind, standing alone in the doorway of the same small kitchen at night. Lit by one dim bulb, with a hint of cool blue from the window. An old dented steel plate sits on the counter in front of him. Quiet, reflective. Subject in the LOWER third, dark space above.

5. `002-05-alone.jpg` — line 5 (the emotional reveal)
Late night in a dark kitchen. The mother sits alone on the kitchen floor against the wall in side profile, eating the last leftover roti with a little pickle from a dented steel plate. One small warm bulb, everyone else asleep, her face tired but calm. She is in the LOWER half; the upper half is dark shadow with a hanging steel tawa.

6. `002-06-hands.jpg` — line 6 (last line)
Extreme close-up of the mother's weathered hands with thin glass bangles resting on an empty steel plate on a wooden table. Warm window light across the table, shallow depth of field, blurred kitchen behind, a last curl of steam fading. Hands in the LOWER third.

7. `002-07-cover.jpg` — cover (last second of the video + thumbnail)
A single dented steel plate in the CENTER of the frame holding one half-eaten roti and a tiny bit of pickle, on a dark wooden surface. A warm pool of light falls on the plate; everything else is deep, dark and clean. Lots of empty dark space above and below the plate (the title text goes there). No hands, no people.

---

## After the images are in
1. Voiceover: save as `remotion/public/audio/002.wav`, add `"audio": "audio/002.wav"` to `002-maa-not-hungry.json`.
2. `npm run studio`, check each line against the voice. If one is off, set `seconds` on that line.
3. `npm run render -- stories/002-maa-not-hungry.json`
