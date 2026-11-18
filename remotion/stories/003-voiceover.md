# Short #3 voiceover — "Maa har raat 2 baje uthti thi"

Same words as the captions in `003-maa-2-baje.json`, same order as the images. Do not change the words, or the captions will no longer match the voice.

## ElevenLabs settings
- Model: **Eleven v3** (reads the [emotion tags]).
- Voice: the same narrator voice as Short #2, for series consistency (a male narrator, since the story says "main sochta tha").
- Stability: **Creative**. Speed: **1.0**.
- Generate 3 to 4 takes and keep the best. Take extra takes of line 6.
- Export WAV with **no silence at the start** (the voice begins on frame 1).

## Script (paste as one block)

```
[hushed, low, a little mysterious] माँ हर रात 2 बजे उठती थी।

[casual, a little naive, light] मैं सोचता था, वो पानी पीने उठती है।

[tired, flat, weary] फिर मुझे नाइट शिफ्ट मिली। [short pause] घर लौटने में रोज़ देर होती।

[slower, curious, almost whispering] रोज़ रात 2 बजे, रसोई की बत्ती जलती मिलती... [pause] और एक गिलास गरम पानी, भाप उठती हुई।

[hushed, realizing] माँ सो रही होती थी... [pause] पर पानी अभी भी गरम था।

[voice breaking, whispering] वो पानी पीने नहीं उठती थी... [long pause] [softly, barely audible] वो मेरा इंतज़ार करती थी।
```

## Line-by-line guide

| # | Image | Emotion | Target | Delivery note |
|---|---|---|---|---|
| 1 | Mother sitting up in the dark | hushed, mysterious | about 2.6 s | Start instantly, low and quiet. Plant the question. |
| 2 | Mother walking toward the kitchen light | casual, naive | about 2.8 s | Lighter and a little faster. You really believe this. |
| 3 | Son in the night lane | tired, flat | about 4.2 s | Weary, almost no energy. Contrast with line 2. |
| 4 | Steaming glass under the bulb | slow, curious | about 5.0 s | Slow down. Lift slightly on "भाप उठती हुई". The mystery builds. |
| 5 | Mother pretending to sleep | hushed, realizing | about 3.6 s | The turn. A tiny pause before "पर पानी अभी भी गरम था". |
| 6 | The chair by the door | breaking, whisper | about 4.2 s | Voice cracks on "इंतज़ार". Let the last word fade. |

Total voice about 22 s. The ending works because lines 2 and 3 are plain and flat, and the last line is the first moment of real emotion.

## Plain version (no tags)
1. माँ हर रात 2 बजे उठती थी।
2. मैं सोचता था, वो पानी पीने उठती है।
3. फिर मुझे नाइट शिफ्ट मिली। घर लौटने में रोज़ देर होती।
4. रोज़ रात 2 बजे, रसोई की बत्ती जलती मिलती... और एक गिलास गरम पानी, भाप उठती हुई।
5. माँ सो रही होती थी... पर पानी अभी भी गरम था।
6. वो पानी पीने नहीं उठती थी... वो मेरा इंतज़ार करती थी।

## Hinglish (as in the JSON `voice` fields)
1. Maa har raat 2 baje uthti thi.
2. Main sochta tha, woh paani peene uthti hai.
3. Phir mujhe night shift mili. Ghar lautne mein roz der hoti.
4. Roz raat 2 baje, rasoi ki batti jalti milti... aur ek glass garam paani, bhaap uthti hui.
5. Maa so rahi hoti thi... par paani abhi bhi garam tha.
6. Woh paani peene nahi uthti thi... woh mera intezaar karti thi.

## Note on the story
Lines 2, 4, 5 and 6 share one idea: water. First we think she gets up to drink it (line 2). Then we see it waiting for him, hot (lines 4 and 5). The last line turns it around: she was never getting water for herself, she was waiting for him.
