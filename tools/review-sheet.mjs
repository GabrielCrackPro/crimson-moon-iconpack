// Build a review sheet: the official icon next to the pack's current drawing.
//
//   node tools/review-sheet.mjs            # all apps -> preview/_review.html
//   node tools/review-sheet.mjs spotify f1 # only these ids
//
// Served from the repo root (npm run serve), then open
// http://127.0.0.1:4321/preview/_review.html
// Reference images live in refs/ and are gitignored working material.

import { readFile, writeFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { APPS } from "../src/apps.mjs";
import { iconSVG } from "../src/render.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const flags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const big = flags.includes("--big");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const index = JSON.parse(await readFile(path.join(ROOT, "refs/index.json"), "utf8"));

const apps = APPS.filter((a) => !only.length || only.includes(a.id));
const card = (a) => {
  const ref = fs.existsSync(path.join(ROOT, `refs/${a.id}.png`))
    ? `<img class="ref" src="../refs/${a.id}.png" alt="">`
    : `<div class="ref miss">no<br>reference</div>`;
  const shared = APPS.filter((x) => x.glyph === a.glyph && x.id !== a.id).map((x) => x.label);
  return `<div class="card">
  <div class="pair">${ref}<div class="now">${iconSVG(a.glyph, 108)}</div></div>
  <div class="meta"><b>${a.label}</b><span>${a.id} · ${a.glyph}</span>${
    shared.length ? `<i>shares art with ${shared.join(", ")}</i>` : ""
  }</div>
  <div class="src">${index[a.id]?.ok ? index[a.id].title.replace(/ - Apps on Google Play$/, "") : index[a.id]?.error ?? ""}</div>
</div>`;
};

await writeFile(
  path.join(ROOT, "preview/_review.html"),
  `<!doctype html><meta charset=utf-8><title>icon review</title>
<style>
 :root{color-scheme:dark}
 body{margin:0;background:#141018;color:#e8dfe6;font:13px/1.4 system-ui;padding:18px}
 h1{font:600 13px/1 ui-monospace;letter-spacing:.2em;text-transform:uppercase;color:#ff6f8f;margin:0 0 4px}
 p.note{color:#9c8ea0;margin:0 0 16px}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(${big ? 420 : 168}px,1fr));gap:14px;align-items:start}
 .card{overflow:hidden}
 .card{background:#1d1722;border:1px solid #3a2b3c;border-radius:12px;padding:10px}
 .pair{display:flex;align-items:center;gap:8px}
 .ref,.now{width:${big ? 190 : 74}px;height:${big ? 190 : 74}px;border-radius:12px;flex:0 0 auto}
 .ref{object-fit:contain;background:#fff}
 .miss{background:#2a1f2c;color:#9c8ea0;font:9px/1.2 ui-monospace;display:grid;place-items:center;text-align:center}
 .meta{display:flex;flex-direction:column;margin-top:8px;font-size:11px;line-height:1.35}
 .meta b{font-size:12px}
 .meta span{color:#9c8ea0;font-family:ui-monospace;font-size:10px}
 .meta i{color:#d98aa0;font-style:normal;font-size:10px;margin-top:2px}
 .src{color:#7d7080;font-size:10px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style>
<h1>icon review — official icon vs current drawing</h1>
<p class="note">${apps.length} apps · left: the app's own icon from its store listing · right: what the pack ships now</p>
<div class="grid">${apps.map(card).join("")}</div>`,  // eslint-disable-line
);
console.log(`wrote preview/_review.html for ${apps.length} apps`);
