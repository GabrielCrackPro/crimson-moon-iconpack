// Geometric monoline alphabet for monogram fallback icons.
// Same 24x24 grid and 2.15 stroke as the object glyphs: cap height 5..19,
// stroke terminals stay inside x 6.8..17.2 so a letter reads at 48 dp.

const P = (d) => `<path d="${d}"/>`;
const L = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;

export const LETTERS = {
  a: [P("M7.2 19 12 5l4.8 14"), L(8.9, 13.8, 15.1, 13.8)],
  b: [
    L(8.2, 5, 8.2, 19),
    P("M8.2 5h4.8a3.4 3.4 0 0 1 0 6.8H8.2"),
    P("M8.2 11.8h5.6a3.6 3.6 0 0 1 0 7.2H8.2"),
  ],
  c: [P("M16.2 7.2A6.4 6.4 0 1 0 16.2 16.8")],
  d: [L(8.4, 5, 8.4, 19), P("M8.4 5h3.6a7 7 0 0 1 0 14H8.4")],
  e: [
    L(16.8, 5, 8.4, 5),
    L(8.4, 5, 8.4, 19),
    L(8.4, 12, 15, 12),
    L(8.4, 19, 16.8, 19),
  ],
  f: [L(8.6, 5, 8.6, 19), L(8.6, 5, 16.8, 5), L(8.6, 12, 15.2, 12)],
  g: [P("M16.2 7.2A6.4 6.4 0 1 0 16.4 16.2V12.9h-3.8")],
  h: [L(8.2, 5, 8.2, 19), L(15.8, 5, 15.8, 19), L(8.2, 12, 15.8, 12)],
  i: [L(12, 5, 12, 19)],
  j: [P("M14.8 5v9.4a4.2 4.2 0 0 1-8.4 0")],
  k: [L(8.4, 5, 8.4, 19), P("M16.6 5 8.4 13.4"), P("M11.6 10.4 16.8 19")],
  l: [L(8.6, 5, 8.6, 19), L(8.6, 19, 16.4, 19)],
  m: [P("M7.4 19V5l4.6 7.6L16.6 5v14")],
  n: [P("M8.2 19V5l7.6 14V5")],
  o: [C(12, 12, 6.4)],
  p: [L(8.2, 19, 8.2, 5), P("M8.2 5h5.4a3.6 3.6 0 0 1 0 7.2H8.2")],
  q: [C(12, 12, 6.4), L(16.4, 16.4, 17.9, 19)],
  r: [
    L(8.2, 19, 8.2, 5),
    P("M8.2 5h5.2a3.5 3.5 0 0 1 0 7H8.2"),
    L(12.2, 12, 16.8, 19),
  ],
  s: [
    P(
      "M16.6 7.6c-1.4-1.8-3.8-2.6-5.8-2-2.2.6-3.4 2.4-2.8 4.2.7 2.2 3.6 2.4 5.8 3.2 2 .8 2.6 2.8 1.4 4.4-1.4 1.8-4.2 2-6.2 1-1-.6-1.8-1.4-2.2-2.4",
    ),
  ],
  t: [L(6.8, 5, 17.2, 5), L(12, 5, 12, 19)],
  u: [P("M7.8 5v8.6a4.2 4.2 0 0 0 8.4 0V5")],
  v: [P("M7 5l5 14 5-14")],
  w: [P("M6.4 5 9.2 19l2.8-8.6L14.8 19l2.8-14")],
  x: [L(7.6, 5, 16.4, 19), L(16.4, 5, 7.6, 19)],
  y: [P("M7.6 5 12 12.4 16.4 5"), L(12, 12.4, 12, 19)],
  z: [L(7.6, 5, 16.4, 5), L(16.4, 5, 7.6, 19), L(7.6, 19, 16.4, 19)],
  0: [P("M12 5c3.3 0 5.3 2.8 5.3 7s-2 7-5.3 7-5.3-2.8-5.3-7S8.7 5 12 5Z")],
  1: [P("M9.4 8.4 12.2 5v14")],
  2: [P("M7.4 8.8a4.7 4.7 0 0 1 9.2 1.2c0 3.8-9.2 5.4-9.2 9h9.4")],
  3: [
    P(
      "M7.8 7.4A4.8 4.8 0 0 1 16.4 9c0 2.2-2.2 3-4 3 2.4 0 4.6 1.2 4.6 3.6a4.8 4.8 0 0 1-9.2 1",
    ),
  ],
  4: [P("M14.8 19V5L7.2 14.8h9.6")],
  5: [
    P(
      "M16.2 5H8.8v5.4h3.4a4.4 4.4 0 0 1 0 8.6 4.8 4.8 0 0 1-4.2-1.8",
    ),
  ],
  6: [C(12, 14.4, 4.6), P("M16.2 6.4C13.4 3.6 8.6 5.2 8 12.1")],
  7: [L(7.4, 5, 16.6, 5), P("M16.6 5 10.2 19")],
  8: [C(12, 8.6, 3.4), C(12, 14.8, 4.2)],
  9: [C(12, 9.6, 4.6), P("M7.8 17.6C10.6 20.4 15.4 18.8 16 11.9")],
};

export const LETTER_CHARS = Object.keys(LETTERS);

const STOPWORDS = new Set([
  "of", "the", "and", "for", "a", "an", "de", "la", "le", "el", "y", "&",
]);

/**
 * Initials for an app label: "Bank of America" -> "BA",
 * "Spotify" -> "S", "2048" -> "2".
 */
export function initialsFor(label) {
  const words = String(label)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !STOPWORDS.has(w.toLowerCase()));

  const source = words.length ? words : [String(label)];
  const letters = source
    .slice(0, 2)
    .map((w) => [...w][0].toUpperCase())
    .filter((ch) => LETTERS[ch.toLowerCase()]);

  if (!letters.length) return "?";
  return letters.join("");
}

/**
 * Glyph array for one or two initials. Two letters are scaled to 62% and
 * pushed apart so they stay inside the same 24-unit box as a single glyph.
 */
export function initialsGlyph(initials) {
  const chars = [...String(initials).toUpperCase()].filter(
    (ch) => LETTERS[ch.toLowerCase()],
  );
  if (chars.length === 0) return LETTERS.o;
  if (chars.length === 1) return LETTERS[chars[0].toLowerCase()];

  const [first, second] = chars;
  const place = (dx, part) =>
    `<g transform="translate(${dx} 0) translate(12 12) scale(0.62) translate(-12 -12)">${part.join("")}</g>`;
  return [place(-4.2, LETTERS[first.toLowerCase()]), place(4.2, LETTERS[second.toLowerCase()])];
}

/** Resource-safe drawable name for a set of initials. */
export function initialsId(initials) {
  const clean = String(initials).toLowerCase().replace(/[^a-z0-9]/g, "");
  return `mono_${clean || "x"}`;
}
