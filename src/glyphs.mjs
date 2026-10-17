// Glyph geometry on a 24x24 grid.
// Style: monoline, 2.15 stroke, round joins, no fills except explicit "solid" marks.

const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const R = (x, y, w, h, rx = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
const P = (d) => `<path d="${d}"/>`;
const L = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
const DOt = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="solid"/>`;

// Programmatic gear so the teeth are mathematically even.
function gear() {
  const cx = 12, cy = 12, teeth = 8, rOut = 9.4, rIn = 7.3;
  const step = (Math.PI * 2) / teeth;
  const tooth = step * 0.155;
  const gap = step * 0.30;
  const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2;
    const [x1, y1] = pt(a - tooth, rOut);
    const [x2, y2] = pt(a + tooth, rOut);
    const [x3, y3] = pt(a + gap, rIn);
    const [x4, y4] = pt(a + step - gap, rIn);
    const [x5, y5] = pt(a + step - tooth, rOut);
    d += i === 0 ? `M${x1} ${y1}` : "";
    d += `L${x2} ${y2}L${x3} ${y3}`;
    d += `A${rIn} ${rIn} 0 0 1 ${x4} ${y4}`;
    d += `L${x5} ${y5}`;
  }
  return P(d + "Z") + C(cx, cy, 2.65);
}

// Petal used by the Photos pinwheel: quarter-petal rotated four times.
const petal = (rot) =>
  `<g transform="rotate(${rot} 12 12)"><path d="M12 12c0-4.8 2.3-7.2 6.6-7.2.5 4.2-2.1 7.2-6.6 7.2Z"/></g>`;

// The OpenAI knot reduces to a six-lobed ring: hexagon corners with the sides
// bowing outward between them.
function knot() {
  const cx = 12, cy = 12, rCorner = 6.2, rLobe = 11.6;
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a0 = (i * Math.PI) / 3 - Math.PI / 2;
    const a1 = ((i + 1) * Math.PI) / 3 - Math.PI / 2;
    const am = (a0 + a1) / 2;
    const x0 = cx + Math.cos(a0) * rCorner;
    const y0 = cy + Math.sin(a0) * rCorner;
    const x1 = cx + Math.cos(a1) * rCorner;
    const y1 = cy + Math.sin(a1) * rCorner;
    const bx = cx + Math.cos(am) * rLobe;
    const by = cy + Math.sin(am) * rLobe;
    d += `${i === 0 ? "M" : "L"}${x0.toFixed(1)} ${y0.toFixed(1)}Q${bx.toFixed(1)} ${by.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return P(`${d}Z`);
}

const sunRays = () => {
  const out = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r1 = 6.4, r2 = 9.2;
    out.push(
      L(
        12 + Math.cos(a) * r1,
        12 + Math.sin(a) * r1,
        12 + Math.cos(a) * r2,
        12 + Math.sin(a) * r2,
      ),
    );
  }
  return out.join("");
};

// One fan blade, rotated three times around the hub.
const blade = (rot) =>
  `<g transform="rotate(${rot} 12 12)"><path d="M12 9.6c-.5-2.7.7-4.6 2.5-4.6s2.9 1.5 2.5 3.4"/></g>`;

// Six-fold snowflake, used by the air-conditioner app.
function flake() {
  const out = [];
  const cx = 12, cy = 12;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const r1 = 2.6, r2 = 8.6, rb = 5.2;
    out.push(L(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2));
    for (const s of [-1, 1]) {
      const b = a + s * 0.95;
      const bx = cx + Math.cos(a) * rb, by = cy + Math.sin(a) * rb;
      out.push(L(bx, by, bx + Math.cos(b) * 2.7, by + Math.sin(b) * 2.7));
    }
  }
  return out.join("");
}

export const GLYPHS = {
  phone: [
    P(
      "M5.6 3.5h2.9a1 1 0 0 1 1 .8l.8 3.4a1 1 0 0 1-.4 1L8.1 10a12.4 12.4 0 0 0 5.9 5.9l1.3-1.8a1 1 0 0 1 1-.4l3.4.8a1 1 0 0 1 .8 1v2.9a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3.6 5.7a2 2 0 0 1 2-2.2Z",
    ),
  ],
  messages: [
    P(
      "M4.2 4.6h15.6a1.7 1.7 0 0 1 1.7 1.7v8.6a1.7 1.7 0 0 1-1.7 1.7h-8.5L6 20.4v-3.8H4.2a1.7 1.7 0 0 1-1.7-1.7V6.3a1.7 1.7 0 0 1 1.7-1.7Z",
    ),
    L(8, 9, 16, 9),
    L(8, 12.4, 12.6, 12.4),
  ],
  contacts: [C(12, 8.7, 3.6), P("M4.7 20.4c0-3.8 3.2-6.2 7.3-6.2s7.3 2.4 7.3 6.2")],
  camera: [
    P(
      "M3.2 8.9A2.4 2.4 0 0 1 5.6 6.5h2l1.4-2.2h6L16.4 6.5h2a2.4 2.4 0 0 1 2.4 2.4v7.2a2.4 2.4 0 0 1-2.4 2.4H5.6a2.4 2.4 0 0 1-2.4-2.4Z",
    ),
    C(12, 12.6, 3.6),
  ],
  photos: [petal(0), petal(90), petal(180), petal(270), C(12, 12, 1.25)],
  image: [
    R(3.2, 4.2, 17.6, 15.4, 2.6),
    C(8.5, 9.4, 1.7),
    P("M3.6 17.4 9.6 11.6l4.1 4.1 2.6-2.4 3.7 4.1"),
  ],
  // Google Calendar: the 31 of its tile.
  calendar: [
    P("M5.4 7.4h4.2L7.4 11.2h1.3a2.9 2.9 0 0 1 0 5.8 2.9 2.9 0 0 1-2.4-1.3"),
    P("M14.6 7.6 16.6 6v10.8"),
  ],
  clock: [C(12, 12, 8.7), P("M12 6.9v5.4l3.6 2.1")],
  // Google Calculator: the four keys of its tile, each with its operator.
  calculator: [
    C(8, 8, 3.9),
    L(6.2, 8, 9.8, 8),
    C(16, 8, 3.9),
    L(14.6, 6.6, 17.4, 9.4),
    L(17.4, 6.6, 14.6, 9.4),
    C(8, 16, 3.9),
    L(6.2, 16, 9.8, 16),
    L(8, 14.2, 8, 17.8),
    C(16, 16, 3.9),
    L(14.2, 14.6, 17.8, 14.6),
    L(14.2, 17.4, 17.8, 17.4),
  ],
  settings: [gear()],
  play: [
    P("M4.6 3.6 19.3 11.4a.7.7 0 0 1 0 1.2L4.6 20.4a.7.7 0 0 1-1.1-.6V4.2a.7.7 0 0 1 1.1-.6Z"),
    L(4.4, 4.9, 14.2, 12),
  ],
  youtube: [R(2.4, 5.5, 19.2, 13, 4.2), P("M10.4 9.5 15 12l-4.6 2.5Z")],
  pin: [
    P("M12 21.2c3.9-4.1 6.4-7.2 6.4-10.1a6.4 6.4 0 1 0-12.8 0c0 2.9 2.5 6 6.4 10.1Z"),
    C(12, 11.1, 2.5),
  ],
  spotify: [
    C(12, 12, 8.7),
    P("M7 9.2c3.3-1.1 6.8-.8 9.7 1"),
    P("M7.8 12.6c2.6-.9 5.4-.6 7.6.8"),
    P("M8.7 15.8c1.9-.7 4-.5 5.7.6"),
  ],
  music: [
    P("M9.8 17.4V6.4l9.2-2.2v11.2"),
    C(7.4, 17.4, 2.4),
    C(16.6, 15.2, 2.4),
  ],
  mic: [
    R(9.2, 2.8, 5.6, 11.2, 2.8),
    P("M5.6 11.6a6.4 6.4 0 0 0 12.8 0"),
    L(12, 18, 12, 21.2),
    L(9.2, 21.2, 14.8, 21.2),
  ],
  whatsapp: [
    P(
      "M12 3.6a8.4 8.4 0 0 0-7.2 12.7L3.6 20.4l4.2-1.1A8.4 8.4 0 1 0 12 3.6Z",
    ),
    P("M9 8.4c.2-.5.6-.6 1-.5l1 2c.1.3 0 .6-.2.8l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.6c.2-.2.5-.3.8-.2l2 1c.1.4 0 .8-.5 1-1.9 1-4 .3-5.6-1.3s-2.3-3.8-1.4-5.7Z"),
  ],
  instagram: [R(3.3, 3.3, 17.4, 17.4, 5.2), C(12, 12, 4.2), DOt(16.7, 7.3, 1)],
  facebook: [
    {
      solid: true,
      d: "M13.4 21v-7.5h2.7l.4-3.1h-3.1V8.5c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.8-.1-1.7-.2-2.7-.2-2.6 0-4.4 1.6-4.4 4.5v1.9H7v3.1h2.6V21Z",
    },
  ],
  tiktok: [
    P("M13.5 3.4v11.2a3.6 3.6 0 1 1-3.6-3.6c.5 0 1 .1 1.4.3"),
    P("M13.5 6.3c.5 2.6 2.4 4.5 5.1 4.7"),
  ],
  x: [P("M4.4 4.2 19.6 19.8"), P("M19.6 4.2 9.7 15.2")],
  telegram: [
    P("M21.3 3.7 2.9 10.7l5.9 2.2 1.6 6.4 3.1-3.8 4.6 3.1Z"),
    P("M8.8 12.9 21.3 3.7"),
  ],
  netflix: [L(8.3, 3.4, 8.3, 20.6), L(15.7, 3.4, 15.7, 20.6), L(8.3, 3.4, 15.7, 20.6)],
  // Google Drive: rounded triangle with its inverted triangular aperture.
  drive: [P("M12 4.2 20.2 18.6H3.8Z"), P("M8.6 11.2H15.4L12 15.6Z")],
  note: [
    R(4.5, 2.8, 15, 18.4, 2.4),
    L(7.9, 7.5, 16.1, 7.5),
    L(7.9, 11.1, 16.1, 11.1),
    L(7.9, 14.7, 12.2, 14.7),
  ],
  folder: [
    P(
      "M3 7.4a2.4 2.4 0 0 1 2.4-2.4h3.3l2 2.6h7.9A2.4 2.4 0 0 1 21 10v7.6a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 17.6Z",
    ),
  ],
  wallet: [R(2.7, 5.3, 18.6, 13.4, 2.6), L(2.7, 10.1, 21.3, 10.1), L(6.9, 14.8, 10.1, 14.8)],
  slack: [L(9.2, 3.4, 7.1, 20.6), L(16.9, 3.4, 14.8, 20.6), L(3.4, 9.2, 20.6, 7.1), L(3.4, 16.9, 20.6, 14.8)],
  people: [
    C(9.3, 8.4, 3.3),
    P("M3.3 20.4c0-3.6 2.7-5.9 6-5.9s6 2.3 6 5.9"),
    C(17.4, 9.2, 2.4),
    P("M17 14.4c2.4.2 4.1 1.9 4.1 4.4"),
  ],
  linkedin: [
    R(3.2, 3.2, 17.6, 17.6, 3.4),
    L(8, 10.6, 8, 16.9),
    C(8, 8.9, 0.55),
    P("M12.2 16.9v-6.3"),
    P("M12.2 13.3c0-1.8 1-2.9 2.6-2.9s2.6 1.1 2.6 2.9v3.6"),
  ],
  // Pinterest: the P inside its circle.
  pinterest: [C(12, 12, 8.8), P("M10.4 17.6V7.2h2.4a3.1 3.1 0 0 1 0 6.2h-2.4")],
  twitch: [
    P("M4.4 3.6h15.2v10.2l-4 4h-3.4l-2.8 2.8H7.6v-2.8H4.4Z"),
    L(9.2, 7.3, 9.2, 11.3),
    L(14.8, 7.3, 14.8, 11.3),
  ],
  terminal: [
    R(2.8, 4.2, 18.4, 15.6, 2.6),
    P("M6.9 9.3 9.9 12l-3 2.7"),
    L(12.6, 15.2, 17, 15.2),
  ],
  code: [P("M8.3 7.4 3.6 12l4.7 4.6"), P("M15.7 7.4 20.4 12l-4.7 4.6"), L(13.7, 4.5, 10.3, 19.5)],
  moon: [
    P("M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.7 8.7 0 1 0 10.8 10.8Z"),
  ],
  flower: [
    petal(0),
    petal(90),
    petal(180),
    petal(270),
    C(12, 12, 1.25),
  ],
  // ---------------------------------------------------------------- suite
  docs: [
    P("M6.2 3.4h7.2l4.8 4.8v12.4H6.2Z"),
    P("M13.4 3.4v4.8h4.8"),
    L(8.8, 12.6, 16.2, 12.6),
    L(8.8, 16.2, 13.6, 16.2),
  ],
  sheets: [
    R(3.4, 4.2, 17.2, 15.6, 2.2),
    L(3.4, 9.4, 20.6, 9.4),
    L(3.4, 14.4, 20.6, 14.4),
    L(9.2, 9.4, 9.2, 19.8),
    L(14.8, 9.4, 14.8, 19.8),
  ],
  slides: [
    R(3, 4, 18, 12, 1.8),
    L(12, 16, 12, 20),
    L(8.4, 20.8, 15.6, 20.8),
    P("M7.4 12.4 10.2 9.4l2.4 2 3.6-4.2"),
  ],
  // Google Meet: the camera of the icon — body, lens wedge, aperture dot.
  meet: [R(3.4, 7.8, 11.2, 8.4, 2.6), P("M14.6 9.4 20.6 12 14.6 14.6Z"), DOt(6.6, 12, 1.05)],
  // Google Tasks: the tick inside its disc.
  tasks: [C(12, 12, 8.6), P("M8.1 12.1 10.9 14.9 16.2 9.2")],
  // Google News: the G and the three rules of its icon.
  news: [
    P("M13.6 7.4a6 6 0 1 0 0 9.2V12h-4"),
    L(16.8, 7.6, 20.8, 7.6),
    L(16.8, 11.4, 20.8, 11.4),
    L(16.8, 15.2, 20.8, 15.2),
  ],
  earth: [
    C(12, 12, 8.7),
    P("M12 3.3c3.3 2.6 3.3 14.8 0 17.4"),
    P("M12 3.3c-3.3 2.6-3.3 14.8 0 17.4"),
    L(3.6, 9.2, 20.4, 9.2),
    L(3.6, 14.8, 20.4, 14.8),
  ],
  books: [
    P(
      "M12 6.8C9.5 5.2 6.8 4.8 3.6 5.2v12.6c3.2-.4 5.9.1 8.4 1.7 2.5-1.6 5.2-2.1 8.4-1.7V5.2c-3.2-.4-5.9 0-8.4 1.6Z",
    ),
    L(12, 6.8, 12, 19.5),
  ],
  games: [
    P(
      "M7.6 7.4h8.8a5.3 5.3 0 0 1 5.1 6.5l-.8 3.1a2.3 2.3 0 0 1-4.1.7L14.8 16H9.2l-1.8 1.7a2.3 2.3 0 0 1-4.1-.7l-.8-3.1a5.3 5.3 0 0 1 5.1-6.5Z",
    ),
    L(8.1, 10.6, 8.1, 13.4),
    L(6.7, 12, 9.5, 12),
    DOt(15.4, 11.2, 0.85),
    DOt(17.4, 13.2, 0.85),
  ],
  recorder: [
    L(4.6, 10.4, 4.6, 13.6),
    L(7.4, 7.6, 7.4, 16.4),
    L(10.2, 9.6, 10.2, 14.4),
    L(13, 5.8, 13, 18.2),
    L(15.8, 9.2, 15.8, 14.8),
    L(18.6, 11, 18.6, 13),
  ],
  notion: [
    R(3.4, 3.4, 17.2, 17.2, 3.6),
    L(8.6, 16.6, 8.6, 7.4),
    L(8.6, 7.4, 15.4, 16.6),
    L(15.4, 16.6, 15.4, 7.4),
  ],
  trello: [
    R(3.4, 3.6, 17.2, 16.8, 2.2),
    R(6.2, 6.4, 4.8, 9.6, 1.1),
    R(12.8, 6.4, 4.8, 5.6, 1.1),
  ],
  // CapCut: the two inward chevrons that make the mark, and its centre gap.
  capcut: [P("M4.4 6.2 10.4 12 4.4 17.8"), P("M19.6 6.2 13.6 12 19.6 17.8")],
  // Adobe Lightroom: the Lr of the icon.
  lightroom: [
    P("M5.6 5.4V18.6h5.2"),
    L(13.6, 18.6, 13.6, 10.6),
    P("M13.6 13.6c.5-2 1.6-3.1 3.3-3.1"),
  ],
  discord: [
    P(
      "M7.4 6.4a14.4 14.4 0 0 1 9.2 0c2 2.5 3.4 6.4 3.6 10.2-2 1.4-4 2.2-6 2.6l-1-1.8a12.4 12.4 0 0 1-4.4 0l-1 1.8c-2-.4-4-1.2-6-2.6.2-3.8 1.6-7.7 3.6-10.2Z",
    ),
    DOt(9.7, 12.2, 1.25),
    DOt(14.3, 12.2, 1.25),
  ],
  reddit: [
    C(12, 13.4, 7.1),
    P("M12.6 6.6c.4-1.7 1.8-2.6 3.2-2.4"),
    C(16.4, 3.6, 1.15),
    DOt(9.4, 12.8, 1.25),
    DOt(14.6, 12.8, 1.25),
  ],
  snapchat: [
    P(
      "M12 3.4c-2.9 0-4.9 2-4.9 5.1v2.1c-.5.4-1.3.7-2.2.8.5 1.4 1.6 1.7 2.3 2-.6 1.6-1.8 2.8-3.3 3.4 1.6 1.1 3.2 1.2 4.4 1.2.3 1 1.3 1.9 3.7 1.9s3.4-.9 3.7-1.9c1.2 0 2.8-.1 4.4-1.2-1.5-.6-2.7-1.8-3.3-3.4.7-.3 1.8-.6 2.3-2-.9-.1-1.7-.4-2.2-.8V8.5c0-3.1-2-5.1-4.9-5.1Z",
    ),
  ],
  signal: [
    P(
      "M12 3.4a8.6 8.6 0 0 0-8.6 8.6c0 3 1.5 5.6 3.8 7.1V22l3.3-1.7c.5.1 1 .2 1.5.2a8.6 8.6 0 0 0 0-17.1Z",
    ),
    R(9.6, 11.8, 4.8, 4.2, 1),
    P("M10.6 11.8v-1.4a1.4 1.4 0 0 1 2.8 0v1.4"),
  ],
  messenger: [
    P(
      "M12 3.4c-5 0-9 3.5-9 8 0 2.6 1.3 4.8 3.4 6.3V22l3.1-1.7c.8.2 1.6.3 2.5.3 5 0 9-3.5 9-8s-4-8-9-8Z",
    ),
    P("M12.9 8.2 9.2 13.2h2.7l-.7 2.8 3.8-5h-2.8Z"),
  ],
  firefox: [
    P(
      "M12 3.4c.6 3.4 3.2 4.8 4.6 7 1.5 2.3 1.6 5.4-.4 7.4-2 2-5.6 2-7.6 0-2.2-2.2-2-5.8.6-8.2 1.1-1 2.4-1.7 2.8-6.2Z",
    ),
    P(
      "M12 12.2c.3 1.6 1.4 2.2 2 3.2.7 1.2.6 2.6-.4 3.6-1 1-2.7 1-3.6 0-1-1.1-.9-2.8.4-3.9.6-.5 1.3-.9 1.6-2.9Z",
    ),
  ],
  brave: [
    P(
      "M12 3.4 20.4 6.6v5.9c0 4.6-3.4 7.1-8.4 8.9-5-1.8-8.4-4.3-8.4-8.9V6.6Z",
    ),
  ],
  // Amazon Kindle: the seated reader of the icon, tablet in hand.
  kindle: [
    C(8.4, 6.2, 2.2),
    P("M6.9 8.5c-1.4 1.6-2.1 3.4-2.1 5.3"),
    P("M3.6 12.9c2.8-1.6 5.6-1.6 8.4 0 2.8-1.6 5.6-1.6 8.4 0v3.4c-2.8-1.6-5.6-1.6-8.4 0-2.8-1.6-5.6-1.6-8.4 0Z"),
  ],
  // Disney+: the D of the script wordmark with its +, the way the icon locks up.
  disney: [
    L(5.4, 6.2, 5.4, 18.2),
    P("M5.4 6.2h3.2c3.4 0 5.8 2.5 5.8 6s-2.4 6-5.8 6H5.4"),
    L(17, 12, 20.6, 12),
    L(18.8, 10.2, 18.8, 13.8),
  ],
  // Prime Video: the play mark over the smile that signs the wordmark.
  prime: [P("M7 6.6 17.4 11.4 7 16.2Z"), P("M6.4 19.4c3.9 1.4 8.4 1.2 11.4-.6")],
  // Coinbase: the disc with the straight channel that opens its C.
  coin: [C(12, 12, 8.6), L(20.6, 10.9, 12.6, 10.9), L(20.6, 13.1, 12.6, 13.1)],

  // Uber: the u of its wordmark.
  uber: [P("M7.4 6.6v6.2c0 2.4 1.9 4.3 4.3 4.3s4.3-1.9 4.3-4.3V6.6")],
  minecraft: [
    P("M12 3.2 20.8 8 12 12.8 3.2 8Z"),
    L(3.2, 8, 3.2, 16),
    L(20.8, 8, 20.8, 16),
    L(12, 12.8, 12, 20.8),
    L(3.2, 16, 12, 20.8),
    L(20.8, 16, 12, 20.8),
  ],
  pokemon: [
    C(12, 12, 8.7),
    L(3.4, 12, 8.9, 12),
    L(15.1, 12, 20.6, 12),
    C(12, 12, 3),
  ],

  // ------------------------------------------------- phone apps (2026 pass)
  search: [C(10.4, 10.4, 6.6), P("M15.1 15.1 20.6 20.6")],
  assistant: [
    R(9.6, 3.6, 4.8, 9.6, 2.4),
    P("M7.2 11.4a4.8 4.8 0 0 0 9.6 0"),
    L(12, 16.2, 12, 19.4),
    P("M3.4 8.6a9.4 9.4 0 0 0 0 6.8"),
    P("M20.6 8.6a9.4 9.4 0 0 1 0 6.8"),
  ],
  gemini: [
    P(
      "M12 2.9c.9 4.7 3.5 7.3 8.2 8.2-4.7.9-7.3 3.5-8.2 8.2-.9-4.7-3.5-7.3-8.2-8.2 4.7-.9 7.3-3.5 8.2-8.2Z",
    ),
  ],
  authenticator: [
    C(8.6, 8.6, 3.4),
    P("M11 11 19.4 19.4"),
    L(16.4, 16.4, 18.4, 14.4),
    L(18.9, 18.9, 20.6, 17.2),
  ],
  lock: [
    R(5.2, 10.4, 13.6, 10.2, 2.2),
    P("M8.4 10.4V7.8a3.6 3.6 0 0 1 7.2 0v2.6"),
    DOt(12, 15.4, 1.15),
  ],
  security: [
    P("M12 3.4 20 6.2v6.2c0 4.6-3.4 7.6-8 8.8-4.6-1.2-8-4.2-8-8.8V6.2Z"),
    P("M8.8 12.2 11.4 14.8 15.6 9.8"),
  ],
  // ChatGPT: the OpenAI knot as its six-lobed ring.
  chatgpt: [knot()],
  // Chollometro: the flame of its mark.
  chollo: [
    P("M12 3.4c.4 2.4 1.6 4 3.4 5.6 1.6 1.4 2.6 3 2.6 5.2 0 3.4-2.7 6.2-6 6.2s-6-2.8-6-6.2c0-2.4 1.2-4.6 3.4-6.6"),
    P("M12 20.4c1.8 0 3.2-1.4 3.2-3.2 0-1.6-1-2.6-3.2-4.4-2.2 1.8-3.2 2.8-3.2 4.4 0 1.8 1.4 3.2 3.2 3.2Z"),
  ],
  download: [
    L(12, 3.6, 12, 14.2),
    P("M7.8 10.2 12 14.4l4.2-4.2"),
    P("M4.4 15.6v2.6a2.2 2.2 0 0 0 2.2 2.2h10.8a2.2 2.2 0 0 0 2.2-2.2v-2.6"),
  ],
  downloader: [
    R(3.4, 4.2, 17.2, 15.6, 2.6),
    L(12, 7.8, 12, 15.2),
    P("M8.9 12.1 12 15.2l3.1-3.1"),
  ],
  scan: [
    P("M3.6 8.6V5.6a2 2 0 0 1 2-2h3"),
    P("M15.4 3.6h3a2 2 0 0 1 2 2v3"),
    P("M20.4 15.4v3a2 2 0 0 1-2 2h-3"),
    P("M8.6 20.4h-3a2 2 0 0 1-2-2v-3"),
    L(3.8, 12, 20.2, 12),
  ],
  wallpaper: [R(6.2, 2.8, 11.6, 18.4, 2.6), C(12, 9.6, 2.7), P("M8.8 17.8h6.4")],
  cloud: [
    P("M7.6 16.4a4.2 4.2 0 0 1-.4-8.3 5.6 5.6 0 0 1 10.7 1.5 3.3 3.3 0 0 1-.6 6.6H7.6Z"),
    L(9.6, 19.8, 14.4, 19.8),
    L(10.9, 22.2, 13.1, 22.2),
  ],
  tv: [
    R(2.8, 6.6, 18.4, 11.8, 2.4),
    L(9, 3.4, 12, 6.6),
    L(15, 3.4, 12, 6.6),
    P("M10.6 9.8 15 12.4l-4.4 2.8Z"),
  ],
  // Streaming service: a broadcast arcing down into a screen.
  pluto: [
    R(3.4, 8.4, 17.2, 10.8, 2.4),
    P("M10.6 11.6 14.4 13.9l-3.8 2.3Z"),
    P("M7.4 5.6a7.4 7.4 0 0 1 9.2 0"),
    P("M9.9 3.2a3.8 3.8 0 0 1 4.2 0"),
  ],
  // The four PlayStation button shapes.
  snowflake: [flake()],
  home: [
    P("M3.6 11.2 12 3.8l8.4 7.4"),
    P("M5.8 12.8v6.2a1.6 1.6 0 0 0 1.6 1.6h9.2a1.6 1.6 0 0 0 1.6-1.6v-6.2"),
    P("M9.6 20.6v-5.2h4.8v5.2"),
  ],
  kick: [
    R(3.4, 3.4, 17.2, 17.2, 4.4),
    L(9.4, 7.6, 9.4, 16.4),
    P("M15.8 7.6 10.4 12l5.4 4.4"),
  ],
  widget: [
    R(3.4, 3.6, 7, 7, 1.6),
    R(13.6, 3.6, 7, 7, 1.6),
    R(3.4, 13.6, 7, 7, 1.6),
    L(13.4, 17.1, 20.6, 17.1),
    L(13.4, 20.6, 20.6, 20.6),
  ],
  remote: [
    R(6.6, 2.8, 10.8, 18.4, 2.6),
    DOt(12, 7.2, 1.3),
    DOt(9.4, 11.6, 0.9),
    DOt(14.6, 11.6, 0.9),
    DOt(9.4, 14.8, 0.9),
    DOt(14.6, 14.8, 0.9),
    DOt(12, 18, 0.9),
  ],
  player: [
    R(2.8, 5.4, 18.4, 12.6, 2.6),
    P("M10.4 9.4 14.8 12l-4.4 2.6Z"),
    L(8.8, 20.8, 15.2, 20.8),
  ],
  support: [
    P(
      "M4.4 4.6h15.2a1.7 1.7 0 0 1 1.7 1.7v8a1.7 1.7 0 0 1-1.7 1.7h-8.7L6.2 20.4v-4.4H4.4a1.7 1.7 0 0 1-1.7-1.7v-8a1.7 1.7 0 0 1 1.7-1.7Z",
    ),
    DOt(12, 8.1, 1),
    L(12, 10.7, 12, 13.9),
  ],
  headphones: [
    P("M4.6 15.2v-2.4a7.4 7.4 0 0 1 14.8 0v2.4"),
    R(2.7, 13.8, 4.6, 6.4, 2.1),
    R(16.7, 13.8, 4.6, 6.4, 2.1),
  ],
  split: [
    L(4.6, 8.4, 12.6, 8.4),
    P("M9.6 5.4 12.6 8.4 9.6 11.4"),
    L(19.4, 15.6, 11.4, 15.6),
    P("M14.4 12.6 11.4 15.6 14.4 18.6"),
  ],
  // Steam: rim, hub and the piston rod of the mark.
  steam: [
    C(12, 12, 8.8),
    C(13.6, 10.4, 2.6),
    L(11.7, 12.3, 6.6, 16.4),
    C(5.4, 17.6, 1.8),
  ],
  cone: [
    P("M12 3.6 17.4 16.2H6.6Z"),
    L(4.6, 16.2, 19.4, 16.2),
    L(4.2, 20.4, 19.8, 20.4),
    L(8.9, 11.4, 15.1, 11.4),
  ],
  // MotoGP, the "rider" M of the 2024 MGP monogram (also the app icon): a
  // forward-leaning arm, a narrow crest, a deep rounded valley on the baseline,
  // a second crest and a vertical stem. The monogram's GP half needs ~9 units of
  // height to keep its counters open at this stroke weight, so the mark is
  // carried by its M — the pack's lettermark convention (Nova's N, Arcticons' A).
  motogp: [
    P("M3.2 16.3 9.4 7.8 10.7 13.9Q11.6 16.4 13.1 15L20.7 7.8V16.3"),
  ],
  // Formula 1, the 2017 mark: two nested hooks (swept arm + bar) and the
  // leaning 1. The official mark is 120x30 with 1.8-unit white gaps, which
  // collapse at this stroke weight, so the gaps are opened up to 1.6 and the
  // whole mark is brought to a 2:1 ratio to stay legible at launcher size.
  f1: [
    P("M3.2 17.2 9.2 8.1h8.5"),
    P("M4.8 17.2 9.9 12.1h5.4"),
    P("M15.6 17.2 20.7 6.6"),
  ],
  watch: [
    R(7, 6.4, 10, 11.2, 2.6),
    P("M9.6 6.4V3.6h4.8v2.8"),
    P("M9.6 17.6v2.8h4.8v-2.8"),
    C(12, 12, 2.4),
  ],
  duck: [
    C(11.4, 10.2, 5.6),
    P("M16.8 8.6h3.6a1.3 1.3 0 0 1 0 2.6h-3.6"),
    DOt(13.2, 8.4, 0.95),
    P("M4.8 20.4c1.3-.9 2.7-.9 4 0s2.7.9 4 0 2.7-.9 4 0 2.7.9 4 0"),
  ],
  needle: [
    C(12, 12, 8.6),
    L(12, 3.4, 12, 6.2),
    L(12, 17.8, 12, 20.6),
    L(3.4, 12, 6.2, 12),
    L(17.8, 12, 20.6, 12),
    P("M14.8 9.2 11.2 11.2 9.2 14.8 12.8 12.8Z"),
  ],
  remoteplay: [
    R(2.8, 4.6, 18.4, 12, 2.6),
    P("M10.4 8.2 14.6 10.6l-4.2 2.4Z"),
    L(9, 20.6, 15, 20.6),
    L(12, 16.6, 12, 20.6),
  ],

  // ------------------------------------------- phone apps reported by device
  // Find My Device: the official mark is a handset inside location rings.
  devicelocator: [
    R(7.8, 3.2, 8.4, 14.6, 2.3),
    L(10.9, 15.2, 13.1, 15.2),
    P("M4.4 8.4a9.6 9.6 0 0 0-1.7 5.7"),
    P("M19.6 8.4a9.6 9.6 0 0 1 1.7 5.7"),
    P("M5.8 19.4c1.7-1 3.9-1.6 6.2-1.6s4.5.6 6.2 1.6"),
  ],
  // Safety Hub: a shield carrying a figure, like Google's own mark.
  safety: [
    P("M12 3.4 20 6.2v6.2c0 4.6-3.4 7.6-8 8.8-4.6-1.2-8-4.2-8-8.8V6.2Z"),
    C(12, 10.2, 1.9),
    P("M8.8 16.8c.5-1.8 1.8-2.7 3.2-2.7s2.7.9 3.2 2.7"),
  ],
  // Nova Launcher: the brand is its N.
  nova: [P("M7.4 18.8V5.2l9.2 13.6V5.2")],
  // Xiaomi Home: house with the smart-home waves.
  smarthome: [
    P("M3.6 11.4 12 4l8.4 7.4"),
    P("M5.8 13v5.8a1.6 1.6 0 0 0 1.6 1.6h9.2a1.6 1.6 0 0 0 1.6-1.6V13"),
    P("M9.2 16.4a4 4 0 0 1 5.6 0"),
    P("M10.9 18.3a1.7 1.7 0 0 1 2.2 0"),
  ],
  // App store: a shopfront awning.
  store: [
    P("M3.4 9.2 5 4.6h14l1.6 4.6"),
    P("M3.4 9.2a2.87 2.87 0 0 0 5.73 0 2.87 2.87 0 0 0 5.73 0 2.87 2.87 0 0 0 5.73 0"),
    P("M5.4 11.8v6.2a1.6 1.6 0 0 0 1.6 1.6h10a1.6 1.6 0 0 0 1.6-1.6v-6.2"),
    L(9.8, 19.6, 9.8, 15.2),
    L(14.2, 19.6, 14.2, 15.2),
  ],
  // Themes: a painter's palette.
  palette: [
    P(
      "M12 3.4c4.9 0 8.6 3.4 8.6 7.6 0 2.7-2.1 4.6-4.8 4.6h-1.3c-1.3 0-2.3 1-2.3 2.2 0 .8.4 1.3.4 2.1 0 1-.9 1.7-2.2 1.7-4.9 0-8.6-4.2-8.6-9.4S7.1 3.4 12 3.4Z",
    ),
    DOt(8.6, 9.4, 1),
    DOt(12.6, 7.6, 1),
    DOt(16.2, 10.2, 1),
  ],
  // Mi Mover: two handsets and a two-way arrow.
  mimover: [
    R(2.8, 6.2, 6.2, 12.4, 1.8),
    R(15, 6.2, 6.2, 12.4, 1.8),
    L(9.8, 12.4, 14.2, 12.4),
    P("M12.6 10.7 14.4 12.4 12.6 14.1"),
    P("M11.4 10.7 9.6 12.4 11.4 14.1"),
  ],
  // Shizuku: the mark is a drop (雫).
  droplet: [
    P("M12 3.4c3.4 4.1 5.6 6.8 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-2.8 2.2-5.5 5.6-9.6Z"),
  ],
  arcticons: [P("M6.2 18.8 12 5.2l5.8 13.6"), L(8.6, 14.2, 15.4, 14.2)],
  bus: [
    R(4.2, 3.8, 15.6, 13.2, 2.4),
    L(4.2, 9.2, 19.8, 9.2),
    L(4.2, 13.2, 19.8, 13.2),
    C(8, 19.2, 1.5),
    C(16, 19.2, 1.5),
  ],
  fan: [C(12, 12, 2.4), blade(0), blade(120), blade(240)],
  medical: [C(12, 12, 8.6), L(12, 7.6, 12, 16.4), L(7.6, 12, 16.4, 12)],
  receipt: [
    P("M5.6 3.6h12.8v16.8l-2.1-1.5-2.1 1.5-2.2-1.5-2.1 1.5-2.1-1.5-2.2 1.5Z"),
    L(8.4, 8.2, 15.6, 8.2),
    L(8.4, 11.8, 15.6, 11.8),
    L(8.4, 15.4, 13, 15.4),
  ],
  badge: [
    R(3.2, 5.4, 17.6, 13.2, 2.2),
    C(8.4, 10.4, 2),
    P("M5.2 15.8c.6-1.7 1.8-2.6 3.2-2.6s2.6.9 3.2 2.6"),
    L(14.2, 10, 18.4, 10),
    L(14.2, 13.4, 18.4, 13.4),
  ],
  umbrella: [
    P("M3.4 12.6a8.6 8.6 0 0 1 17.2 0Z"),
    L(12, 3.2, 12, 4),
    P("M12 12.6v5.4a2.6 2.6 0 0 0 5.2 0"),
  ],
  card: [
    R(2.8, 5.6, 18.4, 12.8, 2.4),
    L(2.8, 10.2, 21.2, 10.2),
    R(5.6, 12.4, 3.6, 2.8, 0.7),
    L(12.4, 15.4, 18, 15.4),
  ],
  vpn: [
    P("M12 3.4 19.4 6.2v6.2c0 4.4-3.2 7.2-7.4 8.4-4.2-1.2-7.4-4-7.4-8.4V6.2Z"),
    DOt(12, 11, 1.35),
    L(12, 12.4, 12, 15.6),
  ],
  radar: [
    DOt(12, 12, 1.2),
    P("M12 5.4a6.6 6.6 0 0 1 6.6 6.6"),
    P("M12 2.4a9.6 9.6 0 0 1 9.6 9.6"),
    L(12, 12, 18.4, 5.6),
  ],
  // App vault: the panel that slides in from the left edge.
  minusscreen: [
    R(3.2, 4.4, 17.6, 15.2, 2.4),
    P("M10 8.8 6.8 12l3.2 3.2"),
    L(12.8, 10, 17.4, 10),
    L(12.8, 14, 17.4, 14),
  ],
  carrier: [
    L(4.6, 19.6, 4.6, 15.6),
    L(9.6, 19.6, 9.6, 11.6),
    L(14.6, 19.6, 14.6, 7.6),
    L(19.4, 19.6, 19.4, 3.6),
  ],

  // ---------------------------------------------------------------------
  // Brand marks drawn from each app's own store icon (refs/<id>.png).
  // Nothing here is invented: every drawing is a monoline adaptation of the
  // official mark, with a note saying what was simplified and why.
  // ---------------------------------------------------------------------
  // Chrome: hub, rim and the three spokes to 12, 4 and 8 o'clock.
  chrome: [
    C(12, 12, 8.8),
    C(12, 12, 3.3),
    L(12, 8.7, 12, 3.2),
    L(14.86, 13.65, 19.42, 16.4),
    L(9.14, 13.65, 4.58, 16.4),
  ],
  // Gmail: the M envelope — two verticals and the flap V.
  gmail: [L(4.6, 18.2, 4.6, 6.6), L(19.4, 18.2, 19.4, 6.6), P("M4.6 6.6 12 13.4 19.4 6.6")],
  // Amazon: the a-to-z smile with its arrowhead.
  amazon: [
    P("M4.5 13.4c3.1 3.6 10.7 4.1 14.4.1"),
    P("M16.4 11.2 19.4 13.3l-3 1.4"),
  ],
  // Google Keep: bulb over its screw base.
  bulb: [
    P("M12 3.4a5.7 5.7 0 0 1 3.4 10.3c-.5.4-.8 1-.8 1.6v.5H9.4v-.5c0-.6-.3-1.2-.8-1.6A5.7 5.7 0 0 1 12 3.4Z"),
    L(9.8, 18.4, 14.2, 18.4),
    L(10.7, 20.8, 13.3, 20.8),
  ],
  // GitHub: the octocat silhouette, filled, from the official 16x16 mark.
  github: [
    {
      solid: true,
      t: "translate(2.8 2.8) scale(1.15)",
      d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z",
    },
  ],
  // Microsoft Teams: the two figures of the icon — the large one in front,
  // the smaller one stepping in behind its shoulder.
  teams: [
    C(9.2, 7.4, 2.6),
    P("M4.2 19v-2.2c0-2.5 2.2-4.4 5-4.4s5 1.9 5 4.4V19"),
    C(16.6, 8.8, 1.8),
    P("M14.4 19v-1.7c0-1.7.8-3.2 2-4.1"),
  ],
  // Outlook: its envelope beside the O of the wordmark.
  outlook: [
    R(3.2, 7.6, 11.4, 8.8, 1.8),
    P("M3.2 9.4 8.9 13.6 14.6 9.4"),
    C(18.6, 12, 2.6),
  ],
  // Zoom: the z of the wordmark.
  zoom: [P("M6.6 6.6h10.8L6.6 17.4h10.8")],
  // Banco Sabadell: the BS of its wordmark.
  sabadell: [
    L(4.4, 6.4, 4.4, 17.8),
    P("M4.4 6.4h3a2.7 2.7 0 0 1 0 5.4h-3"),
    P("M4.4 11.8h3.4a3 3 0 0 1 0 6H4.4"),
    P("M19.6 7.7c-.8-.9-2-1.4-3.2-1.4-1.9 0-3.3 1.2-3.3 2.8 0 3.5 6.6 1.9 6.6 5.4 0 1.7-1.5 3-3.6 3-1.4 0-2.6-.5-3.4-1.3"),
  ],
  // Chase: the octagon with its diamond aperture.
  chase: [
    P("M12 2.6 18.64 5.36 21.4 12 18.64 18.64 12 21.4 5.36 18.64 2.6 12 5.36 5.36Z"),
    P("M12 7 17 12 12 17 7 12Z"),
  ],
  // Robinhood: the quill of the mark.
  robinhood: [
    P("M19.6 4.4c-5.2.5-9.5 2.5-12 6.1-1.6 2.3-2.4 5-2.7 8 3-.3 5.9-1 8.2-2.7 3.6-2.4 5.8-6.5 6.5-11.4Z"),
    P("M6.1 18.2c2.4-3.8 5.7-7.2 9.5-10.2"),
  ],
  // Google Weather: the sun behind its cloud.
  weather: [
    C(9.4, 7.6, 3),
    L(9.4, 3.2, 9.4, 4.4),
    L(13.5, 4.8, 12.8, 5.9),
    L(5.3, 4.8, 6, 5.9),
    P("M10.4 18.8a3.3 3.3 0 0 1-.3-6.6 4.5 4.5 0 0 1 8.6 1.2 2.7 2.7 0 0 1-.6 5.4H10.4Z"),
  ],
  // Xiaomi Weather: same idea, its own arrangement — cloud in front, sun high.
  miweather: [
    C(16.6, 7.2, 2.4),
    L(16.6, 3.2, 16.6, 4.3),
    L(20.3, 5.2, 19.7, 6.2),
    P("M6 18.6a3.6 3.6 0 0 1-.4-7.1 4.8 4.8 0 0 1 9.2 1.3 2.9 2.9 0 0 1-.6 5.8H6Z"),
  ],

  // HP: the hp badge. Both HP apps carry this same mark on their listing.
  hp: [
    C(12, 12, 8.8),
    P("M9 16.6V8.2"),
    P("M9 11.6c.6-1 1.5-1.6 2.6-1.6 1.5 0 2.6 1.1 2.6 2.6v4"),
  ],
  // daily.dev: its two-part mark — the diamond and the chevron beside it.
  dailydot: [
    P("M7.4 12 11.2 8.2 15 12 11.2 15.8Z"),
    P("M14.4 9.4 17.6 12l-3.2 2.6"),
  ],
  // El País: the serif E of the masthead.
  elpais: [
    L(6.4, 5.2, 6.4, 18.8),
    L(6.4, 5.2, 16.4, 5.2),
    L(6.4, 12, 14, 12),
    L(6.4, 18.8, 16.4, 18.8),
    L(4.6, 5.2, 8.2, 5.2),
    L(4.6, 18.8, 8.2, 18.8),
  ],
  // KWGT: the K of its icon.
  kwgt: [L(7.6, 4.6, 7.6, 19.4), P("M16.8 4.6 8.6 12l8.2 7.4")],
  // PlayStation App: the PS monogram.
  psapp: [
    L(11.4, 4.6, 11.4, 13.6),
    P("M11.4 4.6h2.8a2.8 2.8 0 0 1 0 5.6h-2.8"),
    P("M5 17.6h10.4a2.6 2.6 0 0 0 2.5-1.7"),
    P("M5 17.6c0-1.4 1-2.4 2.6-2.4h3.8"),
  ],
  // Samsung Health: the figure of the icon, arms out mid-stride.
  health: [
    C(12.2, 5.4, 2.1),
    P("M13.6 7.4c-.4 1.6-.2 3 .6 4.4"),
    P("M7.8 11.4c1.6-.6 3.2-.6 4.8 0l2.4 1"),
    P("M14.6 10.6l3.6-1.6"),
    P("M8.4 13.2c1.4 1.6 2.2 3.4 2.4 5.6"),
    P("M13.6 13.6c-.4 1.8 0 3.5 1.2 5.2"),
  ],
  // Uber Eats: the initials of the wordmark on its own tile.
  ubereats: [
    P("M5.4 9v3.4c0 1.4 1.1 2.5 2.5 2.5S10.4 13.8 10.4 12.4V9"),
    P("M13 14.8V9"),
    P("M13 11.4c.5-.9 1.3-1.4 2.3-1.4 1.4 0 2.4 1 2.4 2.4v2.4"),
  ],
  // Zoho People: the hexagon with its three dots.
  zoho: [
    P("M12 2.8 19.6 7.2v9.6L12 21.2 4.4 16.8V7.2Z"),
    C(12, 7.6, 1.3),
    C(8.6, 14, 1.3),
    C(15.4, 14, 1.3),
  ],
  // Mi Store: the mi of the wordmark.
  mistore: [
    P("M5 15.6V9l3.4 3.4L11.8 9v6.6"),
    L(15, 15.6, 15, 9),
    L(18.6, 15.6, 18.6, 9),
    L(18.6, 9.4, 15, 9.4),
  ],
  // YouTube Music: the ring with its play mark.
  ytmusic: [C(12, 12, 8.8), P("M10.1 8.5 15.7 12 10.1 15.5Z")],
  // Mi Browser: the ringed planet of its icon.
  planet: [
    C(11.6, 10.6, 5.6),
    P("M3.9 14.6c0 1.6 3.4 2.9 7.7 2.9s7.7-1.3 7.7-2.9-3.4-2.9-7.7-2.9-7.7 1.3-7.7 2.9Z"),
  ],
  // Mi Community: the rabbit of the Xiaomi community mark.
  bunny: [
    C(12, 14.2, 5.4),
    P("M9.6 9.9c-1.4-2.6-1.5-5.4 0-6 1.5-.6 2.6 2 2.9 5.4"),
    P("M14.4 9.1c.3-3.4 1.4-6 2.9-5.4 1.5.6 1.4 3.4 0 6"),
  ],
  // TDTChannels: the set with its rabbit-ear aerial.
  tdt: [
    R(3.6, 9.6, 16.8, 10.4, 2.2),
    L(12, 9.6, 7.8, 4.4),
    L(12, 9.6, 16.2, 4.4),
  ],
  // Xiaomi Game Center: a flat d-pad, distinct from Play Games' controller.
  gamepad: [
    R(2.8, 8.4, 18.4, 7.2, 3.6),
    L(6.2, 12, 9, 12),
    L(7.6, 10.6, 7.6, 13.4),
    DOt(16.6, 10.8, 0.9),
    DOt(14.4, 13.2, 0.9),
  ],
  // Meulify: the m of its mark.
  meulify: [
    P("M5.2 17.6V10c0-1.6 1.3-2.9 2.9-2.9S11 8.4 11 10v7.6"),
    P("M11 17.6V10c0-1.6 1.3-2.9 2.9-2.9s2.9 1.3 2.9 2.9v7.6"),
  ],
  // V380: the webcam of its icon.
  webcam: [C(12, 10, 5.7), C(12, 10, 2.2), L(12, 15.7, 12, 19.4), L(8.6, 19.4, 15.4, 19.4)],
  // MIUI File Manager: a folder with the page inside standing up out of it.
  mifolder: [
    R(8.2, 6.6, 7.6, 7.4, 1.2),
    P("M3.2 9.2a2.2 2.2 0 0 1 2.2-2.2h3l1.9 2.4h7.5a2.2 2.2 0 0 1 2.2 2.2v7.6a2.2 2.2 0 0 1-2.2 2.2H5.4a2.2 2.2 0 0 1-2.2-2.2Z"),
  ],
  // Auesa Pay (Movilidad Elche): its bus in the speech bubble.
  elx: [
    P("M3.6 6.2a2.2 2.2 0 0 1 2.2-2.2h12.4a2.2 2.2 0 0 1 2.2 2.2v8.6a2.2 2.2 0 0 1-2.2 2.2h-6.4l-4.6 3.6v-3.6H5.8a2.2 2.2 0 0 1-2.2-2.2Z"),
    R(7.4, 7.6, 9.2, 6.4, 1.4),
    C(9.2, 15, 0.9),
    C(14.8, 15, 0.9),
  ],

  // LocalSend: its ring of dashes.
  localsend: [
    P("M12 3.4a8.6 8.6 0 0 1 4.3 16"),
    P("M10.4 20.4a8.6 8.6 0 0 1-4.6-13.2"),
    P("M8.2 4.8a8.6 8.6 0 0 1 3-1.3"),
    C(12, 12, 3.4),
  ],
  // Life360: the nested rings.
  life: [C(12, 12, 8.6), C(12, 12, 5.4), C(12, 12, 2.3)],

  // pack fallback: crescent moon over a petal
  generic: [
    P("M19 14.6A7.6 7.6 0 0 1 9.4 5a7.7 7.7 0 1 0 9.6 9.6Z"),
    P("M8.6 17.8c1.4-1.4 2.2-3.4 2.2-5.6"),
  ],
};

export const GLYPH_IDS = Object.keys(GLYPHS);
