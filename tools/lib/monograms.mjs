// Monogram state = generated entries (src/monograms.json, from a device dump)
// plus hand-written initials overrides (src/monogram-overrides.json).
// Overrides live in their own file so re-running --uncovered never loses them.

import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

export const BASE_FILE = "src/monograms.json";
export const OVERRIDES_FILE = "src/monogram-overrides.json";

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw new Error(`${path.relative(process.cwd(), file)}: ${e.message}`);
  }
}

/** @returns {{base: object, overrides: object, merged: object}} */
export async function loadMonogramState(root) {
  const base = (await readJson(path.join(root, BASE_FILE))) ?? {};
  const overrides = (await readJson(path.join(root, OVERRIDES_FILE))) ?? {};

  const merged = {};
  for (const [pkg, value] of Object.entries(base)) {
    const override = overrides[pkg];
    merged[pkg] = {
      ...value,
      generated: value.initials,
      initials: override ?? value.initials,
      override: override ?? null,
    };
  }
  return { base, overrides, merged };
}

export const INITIALS = /^[A-Z0-9]{1,2}$/;

export async function writeOverrides(root, overrides) {
  const file = path.join(root, OVERRIDES_FILE);
  const keys = Object.keys(overrides).sort();
  if (keys.length === 0) {
    await rm(file, { force: true });
    return;
  }
  const sorted = {};
  for (const key of keys) sorted[key] = overrides[key];
  await writeFile(file, JSON.stringify(sorted, null, 2) + "\n");
}
