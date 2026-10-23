import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { APPS } from "../src/apps.mjs";
import { initialsId } from "../src/letters.mjs";
import { loadMonogramState, INITIALS } from "./lib/monograms.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const RES = path.join(ROOT, "android/app/src/main/res");
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

const failures = [];
const fail = (msg) => failures.push(msg);
const ok = (msg) => console.log(`  ok  ${msg}`);

const ids = [...new Set(APPS.map((a) => a.id))];

// Optional monogram fallbacks: src/monograms.json maps a package to the
// initials it should show and the component reported by the device.
let monograms = {};
let monogramBase = {};
let overrides = {};
try {
  const state = await loadMonogramState(ROOT);
  monograms = state.merged;
  monogramBase = state.base;
  overrides = state.overrides;
} catch (e) {
  fail(`monogram files unreadable: ${e.message}`);
}
const monoIds = [...new Set(Object.values(monograms).map((v) => initialsId(v.initials)))];
const allIds = [...ids, "generic", ...monoIds];

// ---------------------------------------------------------------- XML checks
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith(".xml")) out.push(p);
  }
  return out;
}

const xmlFiles = await walk(RES);
xmlFiles.push(path.join(ROOT, "android/app/src/main/AndroidManifest.xml"));

for (const f of xmlFiles) {
  const src = await readFile(f, "utf8");
  const res = XMLValidator.validate(src);
  if (res !== true) fail(`malformed XML: ${path.relative(ROOT, f)} — ${res.err.msg}`);
}
ok(`${xmlFiles.length} XML files are well-formed`);

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
const appfilterSrc = await readFile(path.join(RES, "xml/appfilter.xml"), "utf8");
const appfilter = parser.parse(appfilterSrc).resources.item ?? [];
const drawableSrc = await readFile(path.join(RES, "xml/drawable.xml"), "utf8");
const drawableList = (parser.parse(drawableSrc).resources.item ?? []).map((i) => i.drawable);

// -------------------------------------------------- appfilter cross-checks
const seen = new Set();
for (const item of appfilter) {
  const component = item.component ?? "";
  const m = /^ComponentInfo\{(.+?)\/(.+)\}$/.exec(component);
  if (!m) fail(`bad component format: ${component}`);
  if (seen.has(component)) fail(`duplicate component: ${component}`);
  seen.add(component);
  if (!allIds.includes(item.drawable)) fail(`appfilter points at unknown drawable "${item.drawable}"`);
}
ok(`${appfilter.length} appfilter entries, all drawables known`);

for (const id of allIds) {
  if (!/^[a-z][a-z0-9_]*$/.test(id)) fail(`invalid Android resource name: "${id}"`);
}

// ------------------------------------------- optional device-derived entries
// src/device-components.json is written by tools/sync-components.mjs from a real
// phone. If it exists it must stay consistent with the app list, or the build
// would emit components pointing at icons that do not exist.
try {
  const dev = JSON.parse(await readFile(path.join(ROOT, "src/device-components.json"), "utf8"));
  const known = new Set(APPS.flatMap((a) => a.pkgs.map((p) => p.split("/")[0])));
  const unknownPkgs = Object.keys(dev).filter((p) => !known.has(p));
  if (unknownPkgs.length) fail(`device override covers unclaimed packages: ${unknownPkgs.join(", ")}`);
  for (const [pkg, acts] of Object.entries(dev)) {
    if (!Array.isArray(acts)) {
      fail(`device override entry ${pkg} must be an array of activities`);
      continue;
    }
    for (const act of acts) {
      // Deliberately not "must start with the package name": plenty of real
      // apps launch a class from another namespace (YouTube reports
      // com.google.android.apps.youtube.app.watchwhile.WatchWhileActivity from
      // package com.google.android.youtube). Cross-wiring is already impossible
      // because of the unclaimed-package check above.
      if (!/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)+$/.test(act)) {
        fail(`device activity is not a fully-qualified class: ${pkg}/${act}`);
      }
    }
  }
  ok(`device override: ${Object.keys(dev).length} packages pinned to real activities`);
} catch (e) {
  if (e.code !== "ENOENT") fail(`device override unreadable: ${e.message}`);
}

const missing = allIds.filter((id) => !drawableList.includes(id));
if (missing.length) fail(`drawable.xml missing: ${missing.join(", ")}`);  ok(`drawable.xml lists ${drawableList.length} icons`);

for (const [pkg, value] of Object.entries(monograms)) {
  if (!/^[A-Z0-9]{1,2}$/.test(String(value.initials))) fail(`monogram ${pkg}: bad initials "${value.initials}"`);
  const component = String(value.component ?? "");
  if (!component.startsWith(`${pkg}/`)) fail(`monogram ${pkg}: component "${component}" is outside the package`);
  if (!drawableList.includes(initialsId(value.initials))) fail(`monogram ${pkg}: drawable missing from drawable.xml`);
}
if (Object.keys(monograms).length) ok(`${Object.keys(monograms).length} monogram fallbacks (${monoIds.length} drawables)`);

// Initials overrides must be well-formed and must point at a real monogram,
// otherwise the correction is silently dead config.
for (const [pkg, value] of Object.entries(overrides)) {
  if (!INITIALS.test(String(value))) fail(`override ${pkg}: "${value}" is not 1-2 uppercase letters or digits`);
  if (!monogramBase[pkg]) fail(`override ${pkg}: no monogram for that package (run: node tools/monogram.mjs --uncovered)`);
}
if (Object.keys(overrides).length) ok(`${Object.keys(overrides).length} initials override(s) applied`);

// -------------------------------------------------------- file + size checks
const expected = new Map();
for (const id of allIds) {
  for (const [d, s] of Object.entries(DENSITIES)) {
    expected.set(`drawable-${d}/${id}.png`, Math.round(48 * s));
    expected.set(`drawable-${d}/${id}_fg.png`, Math.round(108 * s));
    expected.set(`drawable-${d}/${id}_mono.png`, Math.round(108 * s));
  }
  expected.set(`mipmap-anydpi-v26/${id}.xml`, null);
  expected.set(`mipmap-anydpi-v33/${id}.xml`, null);
}
for (const [d, s] of Object.entries(DENSITIES)) {
  expected.set(`mipmap-${d}/ic_launcher.png`, Math.round(48 * s));
  expected.set(`mipmap-${d}/ic_launcher_round.png`, Math.round(48 * s));
  expected.set(`drawable-${d}/pack_icon_fg.png`, Math.round(108 * s));
  expected.set(`drawable-${d}/pack_icon_bg.png`, Math.round(108 * s));
  expected.set(`drawable-${d}/pack_icon_mono.png`, Math.round(108 * s));
}

let pngChecked = 0;
for (const [rel, size] of expected) {
  const abs = path.join(RES, rel);
  try {
    await stat(abs);
  } catch {
    fail(`missing resource: ${rel}`);
    continue;
  }
  if (size === null) continue;

  const img = sharp(abs);
  const meta = await img.metadata();
  if (meta.width !== size || meta.height !== size)
    fail(`${rel}: expected ${size}×${size}, got ${meta.width}×${meta.height}`);

  const isForeground = rel.includes("_fg") || rel.includes("pack_icon_fg");
  const isMonochrome = rel.includes("_mono") || rel.includes("pack_icon_mono");
  // Rounded corners are transparent by design, so sample the centre for opacity.
  const inset = Math.round(size * 0.2);
  const { data, info } = await sharp(abs)
    .extract({ left: inset, top: inset, width: size - inset * 2, height: size - inset * 2 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, a = 0;
  const px = info.width * info.height;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; a += data[i + 3];
  }
  r /= px; g /= px; b /= px; a /= px;
  const alphaMean = a;
  const colorMean = (r + g + b) / 3;
  if (isMonochrome) {
    // The launcher tints this layer by its alpha, so the only things that
    // matter are a non-empty silhouette and a pure-white mask: a stray tint
    // here would be composited into whatever accent the wallpaper picks.
    // Fully transparent pixels are skipped — their stored colour is arbitrary.
    const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let visible = 0;
    let tinted = 0;
    // A launcher shows the middle 72 of the 108 dp layer, so anything past 2/3
    // of the half-width is cropped by a circular mask. The coloured icons hide
    // that in the plate; a flat themed layer shows it as a sliced glyph.
    const centre = info.width / 2;
    let furthest = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 250) continue;
      visible++;
      if (data[i] < 248 || data[i + 1] < 248 || data[i + 2] < 248) tinted++;
      const fx = (i / 4) % info.width;
      const fy = Math.floor(i / 4 / info.width);
      const dist = Math.hypot(fx + 0.5 - centre, fy + 0.5 - centre) / centre;
      if (dist > furthest) furthest = dist;
    }
    if (furthest > 0.68)
      fail(`${rel}: themed layer reaches ${furthest.toFixed(2)} of the half-width — a circular mask crops it`);
    // Sparse glyphs are legitimate — Amazon's smile-and-arrow mark covers under
    // 2% of the canvas — so the floor only catches a genuinely blank layer
    // (the empty one measures 0.0%).
    const coverage = (visible / (info.width * info.height)) * 100;
    if (coverage < 0.5) fail(`${rel}: themed layer is empty (${coverage.toFixed(2)}% covered)`);
    if (coverage > 60) fail(`${rel}: themed layer covers ${coverage.toFixed(1)}% — no room to breathe`);
    if (tinted) fail(`${rel}: ${tinted} opaque pixels are not white`);
  } else if (isForeground) {
    const all = await sharp(abs).stats();
    if ((all.channels[3]?.mean ?? 255) < 3) fail(`${rel}: foreground layer looks empty`);
    if (colorMean < 12) fail(`${rel}: foreground pixels are too dark to read (${colorMean.toFixed(1)})`);
  } else {
    if (alphaMean < 254) fail(`${rel}: plate centre should be opaque (alpha ${alphaMean.toFixed(1)})`);
    if (colorMean > 90) fail(`${rel}: plate is too bright (mean ${colorMean.toFixed(1)})`);
  }
  pngChecked++;
}
ok(`${pngChecked} PNGs exist at the right size with visible content`);

// ------------------------------------------------------- store + preview files
// The themed layer is only reachable through the v33 adaptive icon: a v26 file
// that also declared it would break pre-Android-13 parsers, and a v33 file
// without it would silently leave themed icons untinted.
let themedChecked = 0;
for (const id of [...allIds, "ic_launcher", "ic_launcher_round"]) {
  for (const v of [26, 33]) {
    const rel = `mipmap-anydpi-v${v}/${id}.xml`;
    const src = await readFile(path.join(RES, rel), "utf8").catch(() => null);
    if (src === null) continue; // absence already reported by the file checks
    const mono = src.match(/<monochrome\s+android:drawable="@drawable\/([^"]+)"/)?.[1];
    if (v === 33 && !mono) fail(`${rel}: missing the <monochrome> layer`);
    if (v === 26 && mono) fail(`${rel}: <monochrome> needs the v33 qualifier`);
    // A themed layer that points at another app's mask would ship a wrong icon
    // that no amount of white-on-transparent checking would catch.
    const want = id.startsWith("ic_launcher") ? "pack_icon_mono" : `${id}_mono`;
    if (v === 33 && mono && mono !== want)
      fail(`${rel}: <monochrome> points at ${mono}, expected ${want}`);
    if (v === 33) themedChecked++;
  }
}
ok(`${themedChecked} adaptive icons carry a themed (monochrome) layer`);

for (const f of ["store/icon-512.png", "store/icon-1024.png", "preview/index.html", "preview/wallpaper.png"]) {
  try {
    await stat(path.join(ROOT, f));
  } catch {
    fail(`missing artifact: ${f}`);
  }
}
ok("store icons and preview page exist");

// ------------------------------------------------------- in-app UI wiring
// The screen is Kotlin + Compose that tools/build.mjs never touches, so these
// checks are the only thing standing between a typo and a black screen again.
const appDir = path.join(ROOT, "android/app/src/main");
const manifest = await readFile(path.join(appDir, "AndroidManifest.xml"), "utf8");

if (!/<activity[^>]*android:name="\.MainActivity"/.test(manifest)) {
  fail("AndroidManifest must launch .MainActivity, not a platform Activity (black screen)");
}
for (const action of [
  "android.intent.action.MAIN",
  "org.adw.launcher.THEMES",
  "com.novalauncher.THEME",
  "com.anddoes.launcher.THEME",
  "com.teslacoilsw.launcher.THEME",
  "app.lawnchair.ICONPACK",
  "ch.deletescape.lawnchair.ICONPACK",
]) {
  if (!manifest.includes(`android:name="${action}"`)) fail(`AndroidManifest lost the ${action} filter`);
}
if (!manifest.includes("QUERY_ALL_PACKAGES")) {
  fail("AndroidManifest needs QUERY_ALL_PACKAGES to list installed apps");
}
ok("manifest launches the real activity with every theme filter intact");

// Every @string/@color/@style/@drawable the UI asks for must actually exist.
const valuesDir = path.join(appDir, "res/values");
const defined = { string: new Set(), color: new Set(), style: new Set(), dimen: new Set() };
for (const file of await readdir(valuesDir)) {
  if (!file.endsWith(".xml")) continue;
  const xml = await readFile(path.join(valuesDir, file), "utf8");
  for (const kind of ["string", "color", "style", "dimen"]) {
    for (const m of xml.matchAll(new RegExp(`<${kind}[^>]*name="([a-zA-Z0-9_]+)"`, "g"))) {
      defined[kind].add(m[1]);
    }
  }
}
// Sources whose @resource references must resolve. The Compose screen replaced
// the XML layouts and shape drawables, so those directories are gone by design
// (an absent layout/drawable dir is simply scanned as empty).
const uiSources = [
  ...(await readdir(path.join(appDir, "res/layout")).catch(() => []))
    .map((f) => path.join(appDir, "res/layout", f)),
  ...(await readdir(path.join(appDir, "res/drawable")).catch(() => []))
    .filter((f) => f.startsWith("ui_"))
    .map((f) => path.join(appDir, "res/drawable", f)),
  ...(await readdir(path.join(appDir, "java/com/crimsonmoon/iconpack"))).map((f) =>
    path.join(appDir, "java/com/crimsonmoon/iconpack", f),
  ),
];
const uiDrawables = new Set(
  (await readdir(path.join(appDir, "res/drawable")).catch(() => [])).map((f) => f.replace(/\.xml$/, "")),
);
for (const file of uiSources) {
  const text = await readFile(file, "utf8");
  const rel = path.relative(ROOT, file);
  for (const [, kind, name] of text.matchAll(/@(string|color|style|dimen)\/([a-zA-Z0-9_]+)/g)) {
    if (!defined[kind].has(name)) fail(`${rel}: @${kind}/${name} is not defined`);
  }
  for (const [, name] of text.matchAll(/@drawable\/([a-zA-Z0-9_]+)/g)) {
    if (!uiDrawables.has(name)) fail(`${rel}: @drawable/${name} does not exist`);
  }
  // Skips android.R.* — the platform's own resources are not ours to define.
  for (const [, kind, name] of text.matchAll(/(?<!android\.)R\.(string|color|drawable)\.([a-zA-Z0-9_]+)/g)) {
    if (kind === "drawable") continue; // generated icon names resolve at runtime
    if (!defined[kind].has(name)) fail(`${rel}: R.${kind}.${name} is not defined`);
  }
}
ok("every UI resource reference resolves");

for (const f of [
  "android/app/src/main/java/com/crimsonmoon/iconpack/MainActivity.kt",
  "android/app/src/main/java/com/crimsonmoon/iconpack/AppScreen.kt",
  "android/app/src/main/java/com/crimsonmoon/iconpack/Theme.kt",
  "android/app/src/main/java/com/crimsonmoon/iconpack/CrimsonIcons.kt",
  "android/app/src/main/java/com/crimsonmoon/iconpack/PackInfo.kt",
  "android/app/src/main/java/com/crimsonmoon/iconpack/Launchers.kt",
]) {
  try {
    await stat(path.join(ROOT, f));
  } catch {
    fail(`missing UI file: ${f}`);
  }
}
ok("in-app UI sources present");

if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nAll checks passed: ${allIds.length} icons × ${Object.keys(DENSITIES).length} densities.`);
