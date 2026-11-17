# Short #2 voiceover — "Maa said she wasn't hungry"

Matches `002-maa-not-hungry.json` line for line (same words as the captions, same order as the images). Do not change the words, or the captions will no longer match the voice. If you must change one, change it in the JSON too.

## ElevenLabs settings
- Model: **Eleven v3** (it reads the [emotion tags]).
- Voice: Hindi storytelling voice, warm and young-to-mid age (for example Setu, Akshay or Arun; for a daughter's view, Aarohi). Preview lines 1 and 6 before choosing.
- Stability: **Creative** (more expressive, obeys the tags). If it gets too wild or changes the words, switch to Natural.
- Speed: **1.0** (the first three lines are brisk on purpose; the slowing down comes from the tags).
- Generate 3 to 4 takes and keep the best. Line 6 matters most, so take extra takes of it.
- Export: WAV. **No silence at the start** (the voice must begin on the very first frame) and no more than 0.3 s of silence at the end.

## Script (paste as one block)

```
[warm, nostalgic, a gentle half-smile] माँ हमेशा कहती थी... [short pause] मुझे भूख नहीं है।

[matter-of-fact, quick, a touch of wonder] रोटियाँ चार बनती थीं। [pause] हम तीन थे।

[tender, playful, warm] वो पहले हमें खिलाती थी। [short pause] फिर कहती... [light and casual, imitating her] मैं बाद में खा लूँगी।

[long pause] [quieter, thoughtful, slower] मुझे सालों बाद समझ आया...

[voice cracking slightly, quiet] उसे भूख नहीं थी... [pause] [softly, breaking] उसे बस हमारा पेट भरना था।

[whispering, deeply emotional] माँ ने कभी कहा नहीं... [sighs] [barely audible, tender] पर मैंने सब सुन लिया।
```

## Line-by-line guide (so the voice follows the edit)

| # | Image on screen | Camera | Emotion | Target length | Delivery note |
|---|---|---|---|---|---|
| 1 | Mother at the stove | pulls back | warm, nostalgic, half-smile | about 3.2 s | Start instantly. Say it like a happy memory, not a sad one. This is the hook. |
| 2 | 3 plates and 4 rotis | pushes in | quick, matter-of-fact | about 3.0 s | Faster. Lift "चार", then drop and slow on "हम तीन थे". |
| 3 | Serving the children | sideways drift | tender, playful | about 4.6 s | Warmest line. Imitate her voice on "मैं बाद में खा लूँगी": light, casual, almost a smile. |
| 4 | Son in the doorway, years later | slow push | quiet, thoughtful | about 2.6 s | The turn. Energy drops here; slow and low, with a clear pause before it. |
| 5 | Mother eating alone | push, lamp flicker | cracking, quiet | about 4.0 s | Voice catches on "भूख नहीं थी". Slower on "उसे बस हमारा पेट भरना था". |
| 6 | Her hands on the plate | pulls back | whisper, emotional | about 4.0 s | Almost a whisper. Breathe out before "पर मैंने सब सुन लिया". Let the last word fade. |

Total voice: about 21 to 22 seconds, plus a 1.2 s hold on the last line. The video gets a 2 s end card on YouTube and 3 s on Reels.

## How it avoids sounding bored
Energy changes every line: bright (1) → quick (2) → warm and playful (3) → drops (4) → cracks (5) → whisper (6). Do not read it all at one calm pace. The quiet ending only lands because the first half is lively.

## Plain version (no tags, for reference)
1. माँ हमेशा कहती थी... मुझे भूख नहीं है।
2. रोटियाँ चार बनती थीं। हम तीन थे।
3. वो पहले हमें खिलाती थी। फिर कहती... मैं बाद में खा लूँगी।
4. मुझे सालों बाद समझ आया...
5. उसे भूख नहीं थी... उसे बस हमारा पेट भरना था।
6. माँ ने कभी कहा नहीं... पर मैंने सब सुन लिया।

## Hinglish (as in the JSON `voice` fields)
1. Maa hamesha kehti thi... mujhe bhookh nahi hai.
2. Rotiyan chaar banti thin. Hum teen the.
3. Woh pehle hamein khilati thi. Phir kehti... main baad mein kha loongi.
4. Mujhe saalon baad samajh aaya...
5. Usse bhookh nahi thi... usse bas hamara pet bharna tha.
6. Maa ne kabhi kaha nahi... par maine sab sun liya.

## After recording
Save as `remotion/public/audio/002.wav`, push, and ask for the sync step (audio line, per-line `seconds`, `voiceSpans`).
