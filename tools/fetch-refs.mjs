// Fetch the official Play Store icon of every app in src/apps.mjs.
//
// These images are *drawing references* only: they are never shipped, never
// committed (refs/ is gitignored) and never bundled. Each glyph in src/ is a
// fresh monoline drawing made by looking at its reference, the same way the
// pack's own brand marks were made.
//
//   node tools/fetch-refs.mjs            # fetch what is missing
//   node tools/fetch-refs.mjs --force    # refetch everything
//   node tools/fetch-refs.mjs --only spotify,netflix
//
// Writes refs/<app-id>.png (512 px) and refs/index.json with the package,
// title and icon URL each one came from, plus the reason for any failure.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { APPS } from "../src/apps.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REFS = path.join(ROOT, "refs");
const INDEX = path.join(REFS, "index.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.indexOf("--only");
const only = onlyArg >= 0 ? new Set(args[onlyArg + 1].split(",")) : null;

const pkgOf = (app) => app.pkgs[0].split("/")[0];

async function get(url, as = "text") {
  const res = await fetch(url, {
    headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return as === "text" ? res.text() : Buffer.from(await res.arrayBuffer());
}

/** The page's own icon: og:image, or the first Google-hosted square asset. */
function iconUrl(html) {
  const og = html.match(
    /<meta[^>]+property="og:image"[^>]+content="(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"/,
  );
  if (og) return og[1];
  const any = html.match(
    /https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_\-]+=w\d+-h\d+/,
  );
  return any ? any[0] : null;
}

/** Ask Google's CDN for a square 512 px render of the icon. */
const at512 = (url) => `${url.split("=")[0]}=s512`;

async function fetchOne(app, retries = 2) {
  const pkg = pkgOf(app);
  const page = `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}&hl=en&gl=US`;
  try {
    const html = await get(page);
    const url = iconUrl(html);
    if (!url) throw new Error("no icon on the page");
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1] ?? "";
    const png = await get(at512(url), "buffer");
    await writeFile(path.join(REFS, `${app.id}.png`), png);
    return { ok: true, pkg, title, icon: at512(url), bytes: png.length };
  } catch (e) {
    if (retries > 0 && /HTTP 5|fetch failed|socket/i.test(e.message)) {
      await new Promise((r) => setTimeout(r, 1500));
      return fetchOne(app, retries - 1);
    }
    return { ok: false, pkg, error: e.message };
  }
}

/** Small worker pool so we do not hammer Play with 150 parallel requests. */
async function pool(items, size, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i]);
      }
    }),
  );
  return out;
}

const targets = APPS.filter((a) => !only || only.has(a.id));
const old = await readFile(INDEX, "utf8")
  .then(JSON.parse)
  .catch(() => ({}));

const todo = [];
for (const app of targets) {
  const png = path.join(REFS, `${app.id}.png`);
  const cached = !force && old[app.id]?.ok && (await readFile(png).catch(() => null));
  if (cached) continue;
  todo.push(app);
}

console.log(
  `${targets.length} apps · ${targets.length - todo.length} cached · fetching ${todo.length}`,
);
await mkdir(REFS, { recursive: true });

let done = 0;
const results = await pool(todo, 5, async (app) => {
  const r = await fetchOne(app);
  done++;
  const note = r.ok ? `${r.title.slice(0, 42)} · ${r.bytes} B` : r.error;
  console.log(`${r.ok ? "ok  " : "MISS"} ${app.id.padEnd(16)} ${note}${done % 20 === 0 ? `  [${done}/${todo.length}]` : ""}`);
  return [app.id, r];
});

for (const [id, r] of results) if (r) old[id] = r;
await writeFile(INDEX, `${JSON.stringify(old, null, 2)}\n`);

const okCount = Object.values(old).filter((v) => v.ok).length;
const miss = Object.entries(old).filter(([, v]) => !v.ok);
console.log(`\nreferences on disk: ${okCount}`);
if (miss.length) {
  console.log(`no Play listing (${miss.length}):`);
  for (const [id, v] of miss) console.log(`  ${id.padEnd(16)} ${v.pkg}  ${v.error}`);
}
