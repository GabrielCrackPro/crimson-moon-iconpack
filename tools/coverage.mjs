// Coverage report: how a real phone lines up with the pack.
//
// Mirrors the classification the Android screen does (PackInfo.java), so the
// logic can be tested without a device:
//   matched    — the device component itself is in appfilter.xml
//   mismatched — the pack themes that package, but not that component
//   missing    — no icon for that package at all
//
//   node tools/coverage.mjs device-components.sample.txt
//   node tools/coverage.mjs --export device-components.sample.txt   (just the lines)

import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseDump } from "./lib/dump.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

export async function loadMappings() {
  const xml = await readFile(path.join(ROOT, "appfilter.xml"), "utf8");
  const byComponent = new Map();
  const byPackage = new Map();
  for (const m of xml.matchAll(/<item component="ComponentInfo\{([^}]+)\}" drawable="([^"]+)"/g)) {
    const [, component, drawable] = m;
    byComponent.set(component, drawable);
    const pkg = component.split("/")[0];
    if (!byPackage.has(pkg)) byPackage.set(pkg, drawable);
  }
  return { byComponent, byPackage };
}

/** @returns {{matched: object[], mismatched: object[], missing: object[]}} */
export function classify(device, byComponent, byPackage) {
  const matched = [];
  const mismatched = [];
  const missing = [];
  for (const [pkg, activities] of device) {
    for (const cls of activities) {
      const component = `${pkg}/${cls}`;
      const exact = byComponent.get(component);
      if (exact) {
        matched.push({ pkg, component, drawable: exact });
        continue;
      }
      const drawable = byPackage.get(pkg);
      if (drawable) mismatched.push({ pkg, component, drawable });
      else missing.push({ pkg, component });
    }
  }
  return { matched, mismatched, missing };
}

function exportText({ mismatched, missing }) {
  const out = [];
  out.push("# Crimson Moon — components this build does not match.");
  out.push("# Save as a file, then run: node tools/sync-components.mjs <file>");
  if (mismatched.length) out.push("#\n# The pack has an icon for these apps; the component differs:");
  for (const e of mismatched) out.push(`#   ${e.pkg} -> ${e.drawable}`);
  for (const e of mismatched) out.push(e.component);
  if (missing.length) out.push("#\n# No icon in the pack for these apps yet:");
  for (const e of missing) out.push(`#   ${e.pkg}`);
  for (const e of missing) out.push(e.component);
  return out.join("\n") + "\n";
}

async function main() {
  const args = process.argv.slice(2);
  const asExport = args.includes("--export");
  const file = args.find((a) => !a.startsWith("--"));
  if (!file) {
    console.error("usage: node tools/coverage.mjs [--export] <device-dump.txt>");
    process.exit(2);
  }

  const { byComponent, byPackage } = await loadMappings();
  const device = parseDump(await readFile(file, "utf8"));
  const buckets = classify(device, byComponent, byPackage);

  if (asExport) {
    process.stdout.write(exportText(buckets));
    return;
  }

  console.log(`appfilter: ${byComponent.size} components, ${byPackage.size} packages`);
  console.log(`device:    ${device.size} packages in ${path.basename(file)}`);
  console.log(`  matched    ${buckets.matched.length}`);
  console.log(`  mismatched ${buckets.mismatched.length}`);
  console.log(`  missing    ${buckets.missing.length}`);

  if (buckets.mismatched.length) {
    console.log("\nmismatched — the pack themes these, but not this component:");
    for (const e of buckets.mismatched) console.log(`  ${e.pkg}\n    device: ${e.component}\n    icon:   ${e.drawable}`);
  }
  if (buckets.missing.length) {
    console.log("\nmissing — no icon for these yet:");
    for (const e of buckets.missing) console.log(`  ${e.pkg}\n    device: ${e.component}`);
  }
  console.log("\nadd the export with: node tools/sync-components.mjs <file>");
}

if (import.meta.filename === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
