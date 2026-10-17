// Turn a launcher-component dump from a real device into exact appfilter
// entries, and report which pack apps are installed, which need a corrected
// activity, and which installed apps the pack does not cover yet.
//
//   node tools/sync-components.mjs [path-to-dump]
//
// Accepted line formats:
//   com.whatsapp/com.whatsapp.Main            (adb query-activities --brief)
//   com.whatsapp/.Main                        (relative class, normalised)
//   com.spotify.music/com.spotify.music.MainActivity filter ...   (dumpsys)
//   package:com.spotify.music                 (pm list packages — no activity)
//
// Writes src/device-components.json, which tools/build.mjs prefers over the
// curated guesses in src/apps.mjs.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { APPS } from "../src/apps.mjs";
import { parseDump } from "./lib/dump.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "device-components.txt");
const outPath = path.join(ROOT, "src/device-components.json");

let raw;
try {
  raw = await readFile(inputPath, "utf8");
} catch {
  console.error(`No dump found at ${inputPath}\n`);
  console.error("Get one from your phone with USB debugging enabled:\n");
  console.error(
    '  adb shell cmd package query-activities --brief -a android.intent.action.MAIN \\\n    -c android.intent.category.LAUNCHER > device-components.txt\n',
  );
  console.error("Or export the launcher activities from an app like App Inspector");
  console.error("and save the file next to README.md. Formats accepted are listed");
  console.error("at the top of tools/sync-components.mjs.");
  process.exit(1);
}

const device = parseDump(raw);
const parsed = [...device.values()].reduce((n, acts) => n + Math.max(1, acts.length), 0);

if (device.size === 0) {
  console.error(`No components recognised in ${inputPath}.`);
  console.error("Expected lines like com.whatsapp/com.whatsapp.Main");
  process.exit(1);
}

const pkgOf = (entry) => entry.split("/")[0];
const curated = (app) =>
  app.pkgs.filter((p) => p.includes("/")).map((p) => {
    const [pkg, cls] = p.split("/");
    return `${pkg}/${cls}`;
  });

const covered = [];
const corrections = [];
const notInstalled = [];
const matches = new Map(); // pkg -> activities from device

for (const app of APPS) {
  // A package can appear twice ("pkg/Activity" plus a bare "pkg").
  const pkgs = [...new Set(app.pkgs.map(pkgOf))];
  const present = pkgs.filter((p) => device.has(p));
  if (present.length === 0) {
    notInstalled.push(app);
    continue;
  }

  const have = new Set(curated(app));
  const exact = [];
  const fixed = [];
  let packageOnly = false;

  for (const pkg of present) {
    const acts = device.get(pkg);
    if (acts.length === 0) {
      packageOnly = true;
      continue;
    }
    matches.set(pkg, acts);
    for (const act of acts) {
      const component = `${pkg}/${act}`;
      if (have.has(component)) exact.push(component);
      else fixed.push(component);
    }
  }

  covered.push(app);
  if (fixed.length) corrections.push({ app, fixed });
  else if (packageOnly && !exact.length) corrections.push({ app, fixed: [], packageOnly: true });
}

const allPkgs = new Set(APPS.flatMap((a) => a.pkgs.map(pkgOf)));
const uncovered = [...device.keys()].filter((p) => !allPkgs.has(p)).sort();

const out = {};
for (const [pkg, acts] of matches) {
  if (acts.length) out[pkg] = acts;
}
await writeFile(outPath, JSON.stringify(out, null, 2) + "\n");

const pad = (s, n) => s.padEnd(n);
const fixedCount = corrections.filter((c) => c.fixed.length).length;
const packageOnlyCount = corrections.filter((c) => c.packageOnly).length;
const exactCount = covered.length - fixedCount - packageOnlyCount;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

console.log(`Parsed ${parsed} lines covering ${device.size} packages.`);
console.log(`Pack coverage: ${covered.length}/${APPS.length} apps installed.\n`);
console.log(`  ${plural(exactCount, "already matches", "already match")} a curated activity`);
console.log(`  ${plural(fixedCount, "needs", "need")} a corrected activity`);
console.log(`  ${plural(packageOnlyCount, "reports", "report")} no activity (package only, kept curated guess)`);
console.log(`  ${plural(notInstalled.length, "app is", "apps are")} not installed on this device\n`);

if (corrections.some((c) => c.fixed.length)) {
  console.log("Activities taken from the device:");
  for (const { app, fixed } of corrections) {
    for (const c of fixed) console.log(`  ${pad(app.id, 12)} ${c}`);
  }
  console.log("");
}

if (uncovered.length) {
  console.log(`Installed apps the pack does not cover (${uncovered.length}):`);
  for (const p of uncovered.slice(0, 20)) console.log(`  ${p}`);
  if (uncovered.length > 20) console.log(`  … and ${uncovered.length - 20} more`);
  console.log("");
}

console.log(`Wrote ${path.relative(ROOT, outPath)} — rebuild with: npm run build && npm run check`);
