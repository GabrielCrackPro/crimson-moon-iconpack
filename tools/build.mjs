import sharp from "sharp";
import { mkdir, writeFile, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { APPS, componentsFor } from "../src/apps.mjs";
import { iconSVG, foregroundSVG, backgroundSVG, monochromeSVG } from "../src/render.mjs";
import { PACK_ICON_SVG, PACK_BG_SVG, PACK_FG_SVG, PACK_MONO_SVG } from "../src/pack-icon.mjs";
import { PACK_ICON } from "../src/apps.mjs";
import { initialsGlyph, initialsId } from "../src/letters.mjs";
import { loadMonogramState } from "./lib/monograms.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const RES = path.join(ROOT, "android/app/src/main/res");

// Optional: exact launcher components dumped from a real device by
// tools/sync-components.mjs. These win over the curated guesses below.
async function loadDeviceComponents() {
  try {
    return JSON.parse(await readFile(path.join(ROOT, "src/device-components.json"), "utf8"));
  } catch {
    return {};
  }
}

// Monogram fallbacks for installed apps the pack does not cover, produced by
// tools/monogram.mjs --uncovered, with per-app initials overrides applied.
async function loadMonograms() {
  try {
    return (await loadMonogramState(ROOT)).merged;
  } catch (e) {
    console.warn(`monograms.json: ${e.message}`);
    return {};
  }
}
const DENSITIES = [
  ["mdpi", 1],
  ["hdpi", 1.5],
  ["xhdpi", 2],
  ["xxhdpi", 3],
  ["xxxhdpi", 4],
];

const write = async (p, data) => {
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(p, data);
};

const png = async (svg, size, out) => {
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: false })
    .toFile(out);
};

// The themed layer is one colour plus alpha, so a 16-entry palette is visually
// indistinguishable from truecolour and about a third of the size — which
// matters when there are 760 of them.
const pngMono = async (svg, size, out) => {
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true, colours: 16, dither: 0, effort: 10 })
    .toFile(out);
};

// Android 13+ reads the themed layer from an adaptive icon declared with the
// v33 qualifier; older launchers keep resolving the v26 icon, which has no
// <monochrome> child to trip over.
const adaptiveXml = (bg, fg, mono) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/${bg}"/>
    <foreground android:drawable="@drawable/${fg}"/>${
      mono ? `
    <monochrome android:drawable="@drawable/${mono}"/>` : ""
    }
</adaptive-icon>
`;

async function main() {
  // clean generated dirs
  for (const d of ["icons/svg", "icons/foreground", "icons/monochrome", "icons/png", "store"]) {
    await rm(path.join(ROOT, d), { recursive: true, force: true });
  }
  for (const [d] of DENSITIES) {
    await rm(path.join(RES, `drawable-${d}`), { recursive: true, force: true });
    await rm(path.join(RES, `mipmap-${d}`), { recursive: true, force: true });
  }
  for (const v of ["mipmap-anydpi-v26", "mipmap-anydpi-v33"]) {
    await rm(path.join(RES, v), { recursive: true, force: true });
  }

  const names = [];
  const glyphFor = new Map();
  for (const a of APPS) {
    if (!names.includes(a.id)) {
      names.push(a.id);
      glyphFor.set(a.id, a.glyph);
    }
  }
  names.push(PACK_ICON);
  glyphFor.set(PACK_ICON, "generic");

  // One drawable per distinct set of initials; several packages can share it.
  const monograms = await loadMonograms();
  const monoFor = new Map();
  for (const value of Object.values(monograms)) {
    const id = initialsId(value.initials);
    if (!monoFor.has(id)) monoFor.set(id, initialsGlyph(value.initials));
  }
  for (const [id, glyph] of monoFor) {
    names.push(id);
    glyphFor.set(id, glyph);
  }

  for (const name of names) {
    const glyph = glyphFor.get(name);
    const svg = iconSVG(glyph, 512);
    const foreground = foregroundSVG(glyph, 432);
    const monochrome = monochromeSVG(glyph, 432);
    await write(path.join(ROOT, `icons/svg/${name}.svg`), svg);
    await write(path.join(ROOT, `icons/foreground/${name}.svg`), foreground);
    await write(path.join(ROOT, `icons/monochrome/${name}.svg`), monochrome);

    for (const [d, s] of DENSITIES) {
      const px = Math.round(48 * s);
      await png(svg, px, path.join(RES, `drawable-${d}/${name}.png`));
      await png(svg, px, path.join(ROOT, `icons/png/${d}/${name}.png`));
      await png(foreground, Math.round(108 * s), path.join(RES, `drawable-${d}/${name}_fg.png`));
      await pngMono(monochrome, Math.round(108 * s), path.join(RES, `drawable-${d}/${name}_mono.png`));
    }
  }

  // Shared adaptive background layer (one file per density).
  for (const [d, s] of DENSITIES) {
    await png(backgroundSVG(432), Math.round(108 * s), path.join(RES, `drawable-${d}/pack_bg.png`));
  }

  // Adaptive icon XML for every launcher entry, with the themed layer where the
  // platform can use it.
  for (const name of names) {
    const args = ["pack_bg", name + "_fg", name + "_mono"];
    await write(path.join(RES, `mipmap-anydpi-v26/${name}.xml`), adaptiveXml(...args.slice(0, 2)));
    await write(path.join(RES, `mipmap-anydpi-v33/${name}.xml`), adaptiveXml(...args));
  }

  // Pack app icon (mipmap) + store asset.
  for (const [d, s] of DENSITIES) {
    const px = Math.round(48 * s);
    await png(PACK_ICON_SVG, px, path.join(RES, `mipmap-${d}/ic_launcher.png`));
    await png(PACK_ICON_SVG, px, path.join(RES, `mipmap-${d}/ic_launcher_round.png`));
    await png(PACK_FG_SVG, Math.round(108 * s), path.join(RES, `drawable-${d}/pack_icon_fg.png`));
    await png(PACK_BG_SVG, Math.round(108 * s), path.join(RES, `drawable-${d}/pack_icon_bg.png`));
    await pngMono(PACK_MONO_SVG, Math.round(108 * s), path.join(RES, `drawable-${d}/pack_icon_mono.png`));
  }
  for (const n of ["ic_launcher", "ic_launcher_round"]) {
    const args = ["pack_icon_bg", "pack_icon_fg", "pack_icon_mono"];
    await write(path.join(RES, `mipmap-anydpi-v26/${n}.xml`), adaptiveXml(...args.slice(0, 2)));
    await write(path.join(RES, `mipmap-anydpi-v33/${n}.xml`), adaptiveXml(...args));
  }
  await png(PACK_ICON_SVG, 512, path.join(ROOT, "store/icon-512.png"));
  await png(PACK_ICON_SVG, 1024, path.join(ROOT, "store/icon-1024.png"));
  await write(path.join(ROOT, "store/pack-icon.svg"), PACK_ICON_SVG);

  // appfilter.xml — component mapping used by Nova, Lawnchair, ADW, Apex…
  let appfilter = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n`;
  let drawableXml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n`;
  for (const name of names) {
    drawableXml += `    <item drawable="${name}"/>\n`;
  }
  drawableXml += `</resources>\n`;
  const deviceComponents = await loadDeviceComponents();
  for (const a of APPS) {
    // A package listed both as "pkg/Activity" and as a bare package can
    // resolve to the same component; keep one entry per component per icon.
    const seen = new Set();
    const emit = (pkg, cls) => {
      const key = `${pkg}/${cls}`;
      if (seen.has(key)) return;
      seen.add(key);
      appfilter += `    <item component="ComponentInfo{${key}}" drawable="${a.id}"/>\n`;
    };

    // Device-reported activities first, so exact matches are what launchers hit.
    for (const entry of a.pkgs) {
      const pkg = entry.split("/")[0];
      for (const act of deviceComponents[pkg] ?? []) emit(pkg, act);
    }
    for (const c of componentsFor(a.pkgs)) emit(c.pkg, c.cls);
  }

  // Monogram fallbacks map to the component the device actually reported.
  for (const [pkg, value] of Object.entries(monograms)) {
    const id = initialsId(value.initials);
    const component = String(value.component ?? `${pkg}/${pkg}.MainActivity`);
    appfilter += `    <item component="ComponentInfo{${component}}" drawable="${id}"/>\n`;
  }
  appfilter += `</resources>\n`;
  await write(path.join(RES, "xml/appfilter.xml"), appfilter);
  await write(path.join(RES, "xml/drawable.xml"), drawableXml);
  await write(path.join(ROOT, "appfilter.xml"), appfilter);

  // Basic resources.
  await write(
    path.join(RES, "values/strings.xml"),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Crimson Moon</string>
    <string name="app_desc">Crimson Moon — a neon-noir icon pack: black plates, a bleeding moon and sakura light.</string>
</resources>
`,
  );
  await write(
    path.join(RES, "values/colors.xml"),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ink">#FF050306</color>
    <color name="crimson">#FFFF2F5D</color>
    <color name="deep_crimson">#FFA30A26</color>
    <color name="sakura">#FFFF7E9D</color>
</resources>
`,
  );
  await write(
    path.join(RES, "values/styles.xml"),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.Material.NoActionBar">
        <item name="android:windowBackground">@color/ink</item>
        <item name="android:statusBarColor">@color/ink</item>
        <item name="android:navigationBarColor">@color/ink</item>
        <item name="android:colorAccent">@color/crimson</item>
    </style>
</resources>
`,
  );

  // Preview page.
  const hasLetters = await stat(path.join(ROOT, "letters/png/xxxhdpi/a.png")).then(
    () => true,
    () => false,
  );
  await write(path.join(ROOT, "preview/index.html"), previewHtml(names, hasLetters));

  console.log(`Generated ${names.length} icons × 5 densities.`);
}

function previewHtml(names, hasLetters) {
  const byId = Object.fromEntries(APPS.map((a) => [a.id, a]));
  const home = [
    "phone", "messages", "contacts", "browser", "mail",
    "camera", "photos", "play", "youtube", "maps",
    "calendar", "clock", "calculator", "settings", "spotify",
    "whatsapp", "instagram", "telegram", "netflix", "files",
  ];
  const dock = ["phone", "messages", "browser", "camera"];
  const icon = (id, cls = "") =>
    `<div class="app ${cls}"><img src="../icons/png/xxxhdpi/${id}.png" alt="${byId[id]?.label ?? id}"><span>${byId[id]?.label ?? id}</span></div>`;

  const sheet = APPS.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)
    .map(
      (a) => `<figure class="tile">
        <img src="../icons/png/xxxhdpi/${a.id}.png" alt="${a.label}">
        <figcaption>${a.label}<em>${a.id}</em></figcaption>
      </figure>`,
    )
    .join("\n");

  // Material You's own palette: a pastel container with the accent's on-colour
  // glyph, which is what a launcher swaps the plate for.
  const accent = [
    ["#f2b8c6", "#3a0a18"],
    ["#d6b4ff", "#2a1140"],
    ["#ffd9a0", "#3d2409"],
    ["#a8e6cf", "#08291f"],
    ["#bcd4ff", "#0d2142"],
    ["#ffc2b4", "#3a1109"],
  ];
  const themed = ["phone", "messages", "camera", "spotify", "maps", "calendar", "files", "play", "browser"];
  const themedTiles = [
    ...themed.map((id) => ({ id, label: byId[id]?.label ?? id })),
    { id: "pack_icon", label: "Crimson Moon" },
  ]
    .map((t, i) => {
      const [bg, glyph] = accent[i % accent.length];
      const file = t.id === "pack_icon" ? "pack_icon_mono" : t.id + "_mono";
      return `<figure>
        <span class="tint" style="--accent:${bg};--inkGlyph:${glyph}">
          <i style="--src:url(../android/app/src/main/res/drawable-xxxhdpi/${file}.png)"></i>
        </span>
        <figcaption>${t.label}</figcaption>
      </figure>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Crimson Moon — icon pack</title>
<style>
  :root{
    --ink:#050306; --plate:#0d0409; --crimson:#ff2f5d; --sakura:#ff7e9d; --deep:#a30a26;
    --hair:rgba(255,63,107,.18); --text:#f6e7ec; --dim:rgba(246,231,236,.5);
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--ink);color:var(--text);
    font:14px/1.5 "Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
    -webkit-font-smoothing:antialiased;}
  .wrap{max-width:1180px;margin:0 auto;padding:64px 28px 96px}
  header{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;flex-wrap:wrap;margin-bottom:56px}
  .kicker{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--crimson);margin:0 0 14px}
  h1{font-size:clamp(34px,5vw,58px);line-height:.98;margin:0;font-weight:600;letter-spacing:-.03em}
  h1 span{display:block;color:var(--deep);font-weight:300;font-style:italic;letter-spacing:-.01em}
  .lede{max-width:34ch;color:var(--dim);margin:0;font-size:13.5px}
  .layout{display:grid;grid-template-columns:minmax(0,390px) 1fr;gap:56px;align-items:start;min-width:0}
  .layout>*{min-width:0}
  @media (max-width:900px){
    .wrap{padding:40px 18px 64px}
    .layout{grid-template-columns:1fr;gap:36px}
    .panel{padding:20px 16px 24px}
  }
  /* phone */
  .phone{position:relative;width:100%;max-width:390px;aspect-ratio:390/844;border-radius:52px;
    border:1px solid rgba(255,63,107,.28);overflow:hidden;
    box-shadow:0 60px 120px -40px rgba(255,47,93,.35),0 0 0 9px #0a0507,0 0 0 10px rgba(255,63,107,.14);
    background:#000 url("./wallpaper.png") center/cover no-repeat;}
  .phone::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,3,6,.72),rgba(5,3,6,.2) 34%,rgba(5,3,6,.34))}
  .notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:104px;height:24px;background:#040205;border-radius:14px;z-index:3}
  .screen{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;padding:46px 18px 22px}
  .status{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,225,232,.8);padding:0 10px 18px}
  .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px 6px;flex:1;align-content:start}
  .app{display:flex;flex-direction:column;align-items:center;gap:5px}
  .app img{width:54px;height:54px}
  .app span{font-size:9px;letter-spacing:.01em;color:rgba(255,232,238,.78);text-shadow:0 1px 3px #000;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .dock{display:flex;justify-content:space-around;align-items:center;gap:12px;
    margin-top:14px;padding:12px 8px;border-radius:26px;background:rgba(10,4,8,.52);
    border:1px solid rgba(255,63,107,.16)}
  .dock .app span{display:none}
  .dock img{width:46px;height:46px}
  @media (max-width:440px){
    .screen{padding:40px 12px 16px}
    .grid{gap:12px 4px}
    .app img{width:42px;height:42px}
    .app span{font-size:8px}
    .dock img{width:38px;height:38px}
    .dock{border-radius:20px;padding:10px 6px}
  }
  /* sheet */
  .panel{border:1px solid var(--hair);border-radius:18px;padding:26px 26px 30px;
    background:linear-gradient(160deg,rgba(255,47,93,.06),rgba(5,3,6,0) 42%)}
  .panel h2{margin:0 0 4px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--sakura);font-weight:600}
  .panel p.sub{margin:0 0 24px;color:var(--dim);font-size:12.5px}
  .tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:18px 10px}
  .tile{margin:0;text-align:center}
  .tile img{width:76px;height:76px}
  figcaption{font-size:10.5px;color:rgba(246,231,236,.72);margin-top:2px;display:flex;flex-direction:column}
  figcaption em{font-style:normal;font-size:9px;color:rgba(246,231,236,.32);letter-spacing:.06em}
  .mono{display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:10px}
  .mono img{width:100%;max-width:76px;justify-self:center}
  .sizes{display:flex;flex-wrap:wrap;gap:24px 34px;align-items:flex-end;margin:22px 0 6px}
  .sizes div{text-align:center;font-size:10px;color:var(--dim)}
  .sizes img{display:block;margin:0 auto 8px;image-rendering:auto}
  /* themed icons: the alpha-only layer, painted with a wallpaper accent */
  .themed{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:20px 10px}
  .themed figure{margin:0;text-align:center}
  .themed figcaption{margin-top:6px}
  /* A launcher scales the 108 dp layer so its central 72 dp fills the icon, so
     the mask box is 150% of the circle and the circle clips it. Showing the
     layer at 100% would draw the glyph two-thirds of its real size. */
  .themed .tint{display:block;position:relative;overflow:hidden;width:56px;height:56px;margin:0 auto;
    border-radius:50%;background:var(--accent)}
  .themed .tint i{position:absolute;left:-25%;top:-25%;width:150%;height:150%;background:var(--inkGlyph);
    -webkit-mask:var(--src) center/100% 100% no-repeat;mask:var(--src) center/100% 100% no-repeat}
  footer{margin-top:40px;color:rgba(246,231,236,.3);font-size:11px;letter-spacing:.02em}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <p class="kicker">Icon pack · ${APPS.length} apps · Android</p>
      <h1>Crimson Moon<span>neon-noir home screen set</span></h1>
    </div>
    <p class="lede">Black plates, a bleeding moon bloom, and sakura-crimson monoline strokes.
    Drawn as vectors, rendered at every launcher density.</p>
  </header>

  <div class="layout">
    <div class="phone">
      <div class="notch"></div>
      <div class="screen">
        <div class="status"><span>9:41</span><span>▾ ▮ ▰</span></div>
        <div class="grid">
          ${home.map((id) => icon(id)).join("\n          ")}
        </div>
        <div class="dock">${dock.map((id) => icon(id)).join("")}</div>
      </div>
    </div>

    <div>
      <section class="panel">
        <h2>The set</h2>
        <p class="sub">Every plate shares the same bloom and glow — so third-party apps still read as one family.</p>
        <div class="tiles">
${sheet}
        </div>
      </section>

      ${
        hasLetters
          ? `<section class="panel" style="margin-top:22px">
        <h2>Fallbacks</h2>
        <p class="sub">An app the pack doesn't cover gets its initials on the same plate — no glyph needed.</p>
        <div class="tiles mono">
${[..."abcdefghijklmnopqrstuvwxyz", ..."0123456789"]
  .map((ch) => `          <img src="../letters/png/xxxhdpi/${ch}.png" alt="monogram ${ch.toUpperCase()}">`)
  .join("\n")}
        </div>
      </section>`
          : ""
      }

      <section class="panel" style="margin-top:22px">
        <h2>Themed icons</h2>
        <p class="sub">On Android 13+ the launcher drops the plate and paints this alpha-only layer with your
        wallpaper's accent — the same glyph, no bloom. Shown here over six accents.</p>
        <div class="themed">
${themedTiles}
        </div>
      </section>

      <section class="panel" style="margin-top:22px">
        <h2>Scale check</h2>
        <p class="sub">One glyph at launcher sizes. Strokes are tuned to survive mdpi.</p>
        <div class="sizes">
          <div><img src="../icons/png/mdpi/messages.png" width="48" height="48" alt="48dp">48</div>
          <div><img src="../icons/png/xhdpi/messages.png" width="96" height="96" alt="96dp">96</div>
          <div><img src="../icons/png/xxhdpi/messages.png" width="144" height="144" alt="144dp">144</div>
          <div><img src="../icons/png/xxxhdpi/messages.png" width="192" height="192" alt="192dp">192</div>
        </div>
      </section>
    </div>
  </div>
  <footer>Crimson Moon · generated from vector sources · style inspired by “Nezuko bajo la luna carmesí”</footer>
</div>
</body>
</html>`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
