// Shared parser for launcher-component dumps.
//
// Accepted lines:
//   com.whatsapp/com.whatsapp.Main                        (adb query-activities --brief)
//   com.whatsapp/.Main                                    (relative class, normalised)
//   com.spotify.music/...MainActivity filter 4a2b1c       (dumpsys, trailing text ignored)
//   package:com.spotify.music                             (pm list packages — no activity)

const PKG = /^[A-Za-z][\w.]*$/;

function normaliseClass(pkg, cls) {
  if (cls.startsWith(".")) return pkg + cls;
  if (!cls.includes(".")) return `${pkg}.${cls}`;
  return cls;
}

export function parseLine(raw) {
  const line = raw.trim();
  if (!line || line.startsWith("#") || line.startsWith("//")) return null;

  if (line.startsWith("package:")) {
    const pkg = line.slice("package:".length).trim();
    return PKG.test(pkg) ? { pkg, cls: null } : null;
  }

  const slash = /^([A-Za-z][\w.]*)\/([\w.$]+)/.exec(line);
  if (slash) {
    const [, pkg, cls] = slash;
    if (!PKG.test(pkg)) return null;
    return { pkg, cls: normaliseClass(pkg, cls) };
  }

  return null;
}

/** @returns {Map<string, string[]>} package -> launcher activities */
export function parseDump(text) {
  const device = new Map();
  for (const line of text.split(/\r?\n/)) {
    const hit = parseLine(line);
    if (!hit) continue;
    const list = device.get(hit.pkg) ?? [];
    if (hit.cls && !list.includes(hit.cls)) list.push(hit.cls);
    device.set(hit.pkg, list);
  }
  return device;
}
