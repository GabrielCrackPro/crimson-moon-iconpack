import { GLYPHS } from "./glyphs.mjs";

// Design tokens sampled from the wallpaper: near-black ink, crimson moon
// bloom, hot-pink sakura highlights.
export const TOKENS = {
  ink: "#050306",
  inkDeep: "#040205",
  plateGlow: "#3a0a1a",
  moon: "#ff2f5d",
  deepCrimson: "#a30a26",
  glyphTop: "#ff7e9d",
  glyphBottom: "#d90f3c",
  rim: "#ff3f6b",
};

const DEFS = (withPlate, radius = 24) => `
<defs>
  <clipPath id="plateClip"><rect width="108" height="108" rx="${radius}"/></clipPath>
  ${
    withPlate
      ? `<radialGradient id="plate" cx="50%" cy="86%" r="82%">
    <stop offset="0" stop-color="${TOKENS.plateGlow}"/>
    <stop offset="0.42" stop-color="#12050b"/>
    <stop offset="1" stop-color="${TOKENS.inkDeep}"/>
  </radialGradient>
  <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000000" stop-opacity="0.55"/>
    <stop offset="0.35" stop-color="#000000" stop-opacity="0"/>
  </linearGradient>`
      : ""
  }
  <radialGradient id="moon" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="${TOKENS.moon}" stop-opacity="0.8"/>
    <stop offset="0.6" stop-color="${TOKENS.deepCrimson}" stop-opacity="0.45"/>
    <stop offset="1" stop-color="${TOKENS.deepCrimson}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="bloom" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="${TOKENS.moon}" stop-opacity="0.55"/>
    <stop offset="0.6" stop-color="${TOKENS.moon}" stop-opacity="0.16"/>
    <stop offset="1" stop-color="${TOKENS.moon}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="glyph" gradientUnits="userSpaceOnUse" x1="4" y1="2" x2="20" y2="22">
    <stop offset="0" stop-color="${TOKENS.glyphTop}"/>
    <stop offset="0.55" stop-color="#ff3f6b"/>
    <stop offset="1" stop-color="${TOKENS.glyphBottom}"/>
  </linearGradient>
  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="1.0" result="b"/>
    <feMerge>
      <feMergeNode in="b"/>
      <feMergeNode in="b"/>
    </feMerge>
  </filter>
</defs>`;

// The wallpaper's moon, abstracted: a soft crimson bloom high in the frame
// with the water reflection answering it from the bottom edge.
const MOON = `
<g>
  <circle cx="62" cy="34" r="42" fill="url(#bloom)" opacity="0.92"/>
  <circle cx="62" cy="34" r="27" fill="url(#moon)" opacity="0.30"/>
  <ellipse cx="46" cy="98" rx="52" ry="26" fill="url(#bloom)" opacity="0.55"/>
</g>`;

function glyphBody(name) {
  const glyph = Array.isArray(name) ? name : GLYPHS[name];
  if (!glyph) throw new Error(`Unknown glyph: ${name}`);
  let solid = "";
  let stroked = "";
  for (const el of glyph) {
    if (typeof el === "string") stroked += el;
    else if (el.solid) solid += `<path d="${el.d}"/>`;
  }
  return { solid, stroked };
}

/**
 * Legacy launcher icon: full-bleed plate + moon + glyph.
 * @param {string} name glyph id
 * @param {number} size pixel size
 */
export function iconSVG(name, size = 512, { rounded = true } = {}) {
  const { solid, stroked } = glyphBody(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
${DEFS(true, rounded ? 24 : 0)}
<rect width="108" height="108" rx="${rounded ? 24 : 0}" fill="url(#plate)"/>
<g clip-path="url(#plateClip)">
  ${MOON}
</g>
<rect width="108" height="108" rx="${rounded ? 24 : 0}" fill="url(#topFade)"/>
<rect x="0.7" y="0.7" width="106.6" height="106.6" rx="${rounded ? 23.4 : 0}" fill="none" stroke="${TOKENS.rim}" stroke-width="1.1" opacity="${rounded ? 0.34 : 0}"/>
<g>
  <circle cx="54" cy="54" r="30" fill="url(#bloom)" opacity="0.85"/>
<g transform="translate(22 22) scale(2.65)">
  <g filter="url(#glow)" opacity="0.55">
    <g fill="none" stroke="url(#glyph)" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${stroked}</g>
    <g fill="url(#glyph)">${solid}</g>
  </g>
  <g fill="none" stroke="url(#glyph)" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${stroked}</g>
  <g fill="url(#glyph)">${solid}</g>
</g>
</g>
</svg>`;
}

/** Adaptive icon foreground layer: glyph + bloom only, 108dp canvas. */
export function foregroundSVG(name, size = 432) {
  const { solid, stroked } = glyphBody(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
${DEFS(false)}<circle cx="54" cy="54" r="34" fill="url(#bloom)" opacity="0.8"/>
<!-- 49 units wide: corner-safe inside the 72 dp circular mask, which crops the 108 dp layer -->
<g transform="translate(29.4 29.4) scale(2.05)">
    <g filter="url(#glow)" opacity="0.55">
      <g fill="none" stroke="url(#glyph)" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${stroked}</g>
      <g fill="url(#glyph)">${solid}</g>
    </g>
    <g fill="none" stroke="url(#glyph)" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${stroked}</g>
    <g fill="url(#glyph)">${solid}</g>
  </g>
</svg>`;
}

/** Adaptive icon background layer: plate + moon, no corners (launcher masks it). */
export function backgroundSVG(size = 432) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
${DEFS(true, 0)}
<rect width="108" height="108" fill="url(#plate)"/>
<g clip-path="url(#plateClip)">
  ${MOON}
</g>
<rect width="108" height="108" fill="url(#topFade)"/>
</svg>`;
}
