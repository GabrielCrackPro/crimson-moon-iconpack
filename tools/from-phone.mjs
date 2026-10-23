// Refresh the pack from the phone itself.
//
//   npm run from-phone                       # USB, or a device already on Wi-Fi adb
//   npm run from-phone -- 192.168.1.24:5555  # connect to a Wi-Fi endpoint first
//   npm run from-phone -- --pair 192.168.1.24:37123   # Android 11+ wireless pairing
//   npm run from-phone -- --no-build         # stop after monograms.json
//
// One command, four steps: dump the launcher components with adb, sync them
// into src/, give every installed app the pack does not cover a monogram
// fallback, then rebuild and re-check. Installing a new app on the phone and
// re-running this is the whole loop — there is nothing else to edit.
//
// adb is looked up on PATH, in the Android SDK, and finally downloaded into
// .tools/ (gitignored), so the only thing this cannot fetch is the phone.
// Everything it writes — device-components.txt, src/device-components.json,
// src/monograms.json — is gitignored local state; the curated pack is
// unaffected. See README "Match your own phone exactly".

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDump } from "./lib/dump.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS = path.join(ROOT, ".tools");
const DUMP = path.join(ROOT, "device-components.txt");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const pairTarget = flags.has("--pair") ? args[args.indexOf("--pair") + 1] : null;
const target = args.find((a, i) => !a.startsWith("--") && !(flags.has("--pair") && i === args.indexOf("--pair") + 1));

const die = (msg, ...hints) => {
  console.error(`\n${msg}`);
  for (const h of hints) console.error(`  ${h}`);
  process.exit(1);
};

// ------------------------------------------------------------------- adb
const ADB_EXE = process.platform === "win32" ? "adb.exe" : "adb";

function adbOnPath() {
  const probe = spawnSync("adb", ["version"], { stdio: "ignore" });
  return probe.status === 0;
}

function findAdb() {
  if (adbOnPath()) return "adb";
  const candidates = [
    process.env.ANDROID_HOME && path.join(process.env.ANDROID_HOME, "platform-tools", ADB_EXE),
    process.env.ANDROID_SDK_ROOT && path.join(process.env.ANDROID_SDK_ROOT, "platform-tools", ADB_EXE),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Android", "Sdk", "platform-tools", ADB_EXE),
    path.join(TOOLS, "platform-tools", ADB_EXE),
  ].filter(Boolean);
  return candidates.find(existsSync) ?? null;
}

/** Last resort: Google's own platform-tools zip, unpacked into .tools/. */
async function downloadAdb() {
  const zip = path.join(TOOLS, "platform-tools.zip");
  const url = {
    win32: "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
    darwin: "https://dl.google.com/android/repository/platform-tools-latest-darwin.zip",
  }[process.platform] ?? "https://dl.google.com/android/repository/platform-tools-latest-linux.zip";

  console.log(`adb not found — downloading platform-tools into .tools/ (${url.split("/").pop()})`);
  mkdirSync(TOOLS, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) die(`Download failed: HTTP ${res.status} from ${url}`, "Install platform-tools yourself and re-run.");
  const body = Buffer.from(await res.arrayBuffer());
  writeFileSync(zip, body);

  if (process.platform === "win32") {
    const ps = spawnSync(
      "powershell",
      ["-NoProfile", "-Command", `Expand-Archive -Force -Path "${zip}" -DestinationPath "${TOOLS}"`],
      { stdio: "inherit" },
    );
    if (ps.status !== 0) die("Could not unzip platform-tools with PowerShell.", `Unzip ${zip} into ${TOOLS} by hand.`);
  } else {
    const un = spawnSync("unzip", ["-o", "-q", zip, "-d", TOOLS], { stdio: "inherit" });
    if (un.status !== 0) die("Could not unzip platform-tools.", `Unzip ${zip} into ${TOOLS} by hand.`);
  }
  rmSync(zip, { force: true });

  const adb = path.join(TOOLS, "platform-tools", ADB_EXE);
  if (!existsSync(adb)) die(`Unzipped, but ${adb} is missing.`);
  if (process.platform !== "win32") spawnSync("chmod", ["+x", adb]);
  return adb;
}

const adbPath = findAdb() ?? (await downloadAdb());

/** Run adb; returns stdout. A failure prints adb's own words, not a stack. */
function adb(argv, { allowFail = false } = {}) {
  const r = spawnSync(adbPath, argv, { encoding: "utf8" });
  if (r.status !== 0 && !allowFail) {
    die(`adb ${argv.join(" ")} failed:`, (r.stderr || r.stdout || "").trim());
  }
  return r.stdout ?? "";
}

// --------------------------------------------------------------- the phone
if (pairTarget) {
  console.log(`Pairing with ${pairTarget} — the code is on the phone under Developer options › Wireless debugging.`);
  const out = adb(["pair", pairTarget], { allowFail: true });
  console.log(out.trim());
  if (!/successfully paired/i.test(out)) die(`Pairing with ${pairTarget} failed.`, "Check the pairing code and port; they change every session.");
}

let serial = null;
if (target) {
  if (/^[\w.-]+:\d+$/.test(target) && !target.startsWith("emulator-")) {
    const out = adb(["connect", target], { allowFail: true });
    console.log(out.trim());
    if (!/connected|already/i.test(out)) {
      die(`Could not connect to ${target}.`,
        "The phone and this machine must share a network; the port comes from Developer options › Wireless debugging › IP address & port.",
        "First-time Wi-Fi adb also needs: npm run from-phone -- --pair <ip:pairing-port>");
    }
  }
  serial = target;
} else {
  const lines = adb(["devices"]).split(/\r?\n/).slice(1).filter((l) => l.trim());
  const states = lines.map((l) => {
    const [s, state] = l.trim().split(/\s+/);
    return { s, state };
  });
  const ready = states.filter((d) => d.state === "device");
  const waiting = states.filter((d) => d.state === "unauthorized" || d.state === "offline");
  if (ready.length === 1) serial = ready[0].s;
  if (ready.length > 1) {
    die(`Several devices are connected: ${ready.map((d) => d.s).join(", ")}`,
      "Pass the one you mean: npm run from-phone -- <serial>");
  }
  if (!ready.length) {
    const hints = ["Enable Developer options › USB debugging, plug the phone in, and accept the RSA prompt."];
    if (waiting.length) hints.push(`Connected but not ready: ${waiting.map((d) => `${d.s} (${d.state})`).join(", ")}`);
    hints.push("Wi-Fi: npm run from-phone -- <ip:port>   (pair first with --pair on Android 11+)");
    die("No phone is available to adb.", ...hints);
  }
}

console.log(`\nPhone: ${serial}`);

// ------------------------------------------------------------------- dump
const raw = adb([
  "-s", serial, "shell",
  "cmd", "package", "query-activities", "--brief",
  "-a", "android.intent.action.MAIN",
  "-c", "android.intent.category.LAUNCHER",
]).replace(/\r/g, "");

const parsed = parseDump(raw);
if (!parsed.size) {
  die("adb answered, but no launcher components were recognised.",
    "Expected lines like com.whatsapp/com.whatsapp.Main — check the phone screen is unlocked and re-run.");
}

const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
const header = `# Launcher components from ${serial}, ${stamp} UTC, via npm run from-phone.\n`;
writeFileSync(DUMP, header + raw.split("\n").filter((l) => l.trim()).join("\n") + "\n");
console.log(`${parsed.size} packages dumped -> device-components.txt`);

// ------------------------------------------- sync + monograms + rebuild
const step = (script, ...scriptArgs) => {
  console.log(`\n> node tools/${script} ${scriptArgs.join(" ")}`.trim());
  const r = spawnSync(process.execPath, [path.join(ROOT, "tools", script), ...scriptArgs], {
    stdio: "inherit",
    cwd: ROOT,
  });
  if (r.status !== 0) die(`tools/${script} failed.`, "Its own output above says why.");
};

step("sync-components.mjs");
step("monogram.mjs", "--uncovered");
if (!flags.has("--no-build")) {
  step("build.mjs");
  step("check.mjs");
}

let monogramCount = 0;
try {
  monogramCount = Object.keys(JSON.parse(readFileSync(path.join(ROOT, "src/monograms.json"), "utf8"))).length;
} catch {
  /* no monograms is fine — nothing uncovered */
}
console.log(
  `\nDone. ${parsed.size} packages from the phone, ${monogramCount} monogram fallback${monogramCount === 1 ? "" : "s"}.` +
    (flags.has("--no-build") ? " Rebuild when ready: npm run build && npm run check" : ""),
);
console.log(
  "These icons live in this machine's build only (device state is gitignored);" +
    " the curated pack ships from CI. See README “Ship your own phone’s APK”.",
);
