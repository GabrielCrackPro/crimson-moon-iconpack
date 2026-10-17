// The pack's own launcher icon: a crimson moon behind a torii gate,
// with sakura petals drifting across the water reflection.
const petal = (x, y, r, s, o) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" opacity="${o}">
     <path d="M0 -16c6 7 8 15 5 21-1 3-3 5-5 5s-4-2-5-5c-3-6-1-14 5-21Z" fill="url(#petalGrad)"/>
   </g>`;

const ART = `
  <circle cx="258" cy="188" r="186" fill="url(#halo)"/>
  <circle cx="258" cy="188" r="132" fill="url(#moon)"/>

  <g fill="#050306">
    <path d="M74 288h364c9 0 11 7 5 12l-16 13c-3 2-7 3-11 3H101c-4 0-8-1-11-3l-16-13c-6-5-4-12 5-12Z"/>
    <rect x="138" y="340" width="236" height="16" rx="4"/>
    <rect x="239" y="306" width="34" height="34" rx="2"/>
    <path d="M166 316h26l16 164c1 9-4 14-11 14h-22c-7 0-13-5-12-14z"/>
    <path d="M320 316h26l14 164c1 9-5 14-12 14h-22c-7 0-12-5-11-14z"/>
  </g>

  <ellipse cx="256" cy="506" rx="220" ry="50" fill="url(#water)"/>
  <g stroke="#ff2f5d" stroke-linecap="round" opacity="0.55">
    <path d="M132 488c30-5 62-7 96-5" stroke-width="4.5"/>
    <path d="M304 484c34-2 66 0 96 5" stroke-width="3.5"/>
    <path d="M196 504c28-3 56-4 84-2" stroke-width="3"/>
  </g>

  ${petal(101, 103, 26, 1.9, 0.92)}
  ${petal(414, 128, -22, 1.55, 0.7)}
  ${petal(428, 372, 46, 1.5, 0.72)}
  ${petal(74, 340, -8, 1.15, 0.5)}
  ${petal(352, 58, 12, 0.9, 0.42)}`;

const DEFS = `
<defs>
  <radialGradient id="halo" cx="50%" cy="50%" r="50%">
    <stop offset="0.42" stop-color="#ff2f5d" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#ff2f5d" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="moon" cx="50%" cy="46%" r="58%">
    <stop offset="0" stop-color="#ff5a80"/>
    <stop offset="0.45" stop-color="#ff2f5d"/>
    <stop offset="0.86" stop-color="#b60e2f"/>
    <stop offset="1" stop-color="#6d0519"/>
  </radialGradient>
  <linearGradient id="petalGrad" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="#ffb4c8"/>
    <stop offset="1" stop-color="#ff3f6b"/>
  </linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ff2f5d" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#ff2f5d" stop-opacity="0"/>
  </linearGradient>
</defs>`;

export const PACK_BG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs>
  <radialGradient id="plate" cx="50%" cy="82%" r="80%">
    <stop offset="0" stop-color="#3a0a1a"/>
    <stop offset="0.45" stop-color="#12050b"/>
    <stop offset="1" stop-color="#030204"/>
  </radialGradient>
</defs>
<rect width="512" height="512" fill="url(#plate)"/>
<circle cx="292" cy="230" r="210" fill="#ff2f5d" opacity="0.06"/>
</svg>`;

export const PACK_FG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
${DEFS}
<g transform="translate(256 262) scale(0.72) translate(-256 -256)">${ART}</g>
</svg>`;

export const PACK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
${DEFS}
<defs>
  <radialGradient id="plate" cx="50%" cy="82%" r="80%">
    <stop offset="0" stop-color="#3a0a1a"/>
    <stop offset="0.45" stop-color="#12050b"/>
    <stop offset="1" stop-color="#030204"/>
  </radialGradient>
</defs>
<clipPath id="clip"><rect width="512" height="512" rx="112"/></clipPath>
<g clip-path="url(#clip)">
  <rect width="512" height="512" fill="url(#plate)"/>
  ${ART}
  <rect x="1.6" y="1.6" width="508.8" height="508.8" rx="110.4" fill="none"
        stroke="#ff3f6b" stroke-width="3" opacity="0.32"/>
</g>
</svg>`;
