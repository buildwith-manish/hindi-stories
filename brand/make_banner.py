"""Generates banner SVGs. Usage: python3 make_banner.py   (writes banner.svg + banner-daily.svg)
Safe area for all devices: x 406..1641, y 407..745 (canvas 2048x1152)."""
import random
random.seed(7)

def build(tagline, out):
    stars = ''.join(
        f'<circle cx="{random.randint(30,2018)}" cy="{random.randint(20,520)}" r="{random.choice([1.4,1.8,2.4])}" fill="#FBE8C8" opacity="{random.choice([.25,.4,.55])}"/>'
        for _ in range(70))
    dust = ''.join(
        f'<circle cx="{random.randint(60,1990)}" cy="{random.randint(560,900)}" r="{random.choice([2,3,4])}" fill="#FFD27A" opacity="{random.choice([.12,.2,.28])}"/>'
        for _ in range(26))
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1152" width="2048" height="1152">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#220712"/><stop offset="0.45" stop-color="#4E1428"/>
      <stop offset="0.7" stop-color="#8A3630"/><stop offset="0.8" stop-color="#D9733A"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFC56B" stop-opacity="0.85"/><stop offset="0.5" stop-color="#F5762E" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#F5762E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flame" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset="1" stop-color="#F5762E"/></linearGradient>
    <radialGradient id="win" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFD27A" stop-opacity="0.9"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></radialGradient>
  </defs>
  <rect width="2048" height="1152" fill="url(#sky)"/>
  {stars}
  <circle cx="620" cy="800" r="560" fill="url(#sun)"/>
  <!-- hills: low in the middle (under the text), rising at the sides -->
  <path d="M0 760 C260 700 520 780 860 830 S1500 800 1780 720 S2048 730 2048 730 V1152 H0Z" fill="#5A1A33"/>
  <path d="M0 840 C300 800 620 860 980 880 S1560 860 1840 800 S2048 810 2048 810 V1152 H0Z" fill="#3A0F25"/>
  <path d="M0 930 C340 900 720 950 1080 955 S1640 940 2048 900 V1152 H0Z" fill="#240819"/>
  <!-- the little house with a lit window (same as the videos) -->
  <g transform="translate(1700 742)">
    <rect x="-46" y="-62" width="92" height="62" fill="#1A0612"/>
    <path d="M-62 -60 L0 -112 L62 -60Z" fill="#1A0612"/>
    <circle cx="0" cy="-34" r="34" fill="url(#win)"/>
    <rect x="-9" y="-44" width="18" height="20" rx="2" fill="#FFD27A"/>
  </g>
  <g fill="none" stroke="#2A0A18" stroke-width="3" stroke-linecap="round">
    <path d="M1180 330 q14 -12 28 0 q14 -12 28 0"/><path d="M1290 290 q10 -9 20 0 q10 -9 20 0"/>
  </g>
  {dust}
  <rect width="2048" height="1152" fill="url(#vig)"/>

  <!-- ===== lockup (everything inside x 406..1641, y 407..745) ===== -->
  <g transform="translate(436 588) scale(0.56) translate(-200 -340)">
    <g fill="none" stroke="#FBE8C8" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
      <path d="M252 418 V548 Q252 574 278 574 H522 Q548 574 548 548 V418"/><path d="M200 432 L400 246 L600 432"/>
    </g>
    <path d="M400 408 C437 452 463 484 463 518 C463 548 436 566 400 566 C364 566 337 548 337 518 C337 484 363 452 400 408 Z" fill="url(#flame)"/>
    <path d="M400 478 C418 500 430 515 430 534 C430 551 416 560 400 560 C384 560 370 551 370 534 C370 515 382 500 400 478 Z" fill="#FFF3D6" opacity="0.92"/>
  </g>
  <text id="name" x="700" y="578" font-family="Lora" font-weight="700" font-size="122" fill="#FBE8C8" letter-spacing="1">Ankahi Ghar Ki</text>
  <text id="tag" x="704" y="654" font-family="Lora" font-style="italic" font-weight="400" font-size="58" fill="#FFE2B0">{tagline}</text>
  <text id="hi" x="704" y="722" font-family="Noto Serif Devanagari" font-weight="500" font-size="42" fill="#F0C890" opacity="0.9">अनकही घर की</text>
</svg>
'''
    open(out, 'w', encoding='utf-8').write(svg)

build('Jo kabhi kaha nahi.', 'banner.svg')
build('A new unsaid story, every day.', 'banner-daily.svg')
