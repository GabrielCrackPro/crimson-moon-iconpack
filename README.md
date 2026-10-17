# Crimson Moon — Android icon pack

[![Build APK](https://github.com/GabrielCrackPro/crimson-moon-iconpack/actions/workflows/build-apk.yml/badge.svg)](https://github.com/GabrielCrackPro/crimson-moon-iconpack/actions/workflows/build-apk.yml)

A neon-noir icon pack built from the mood of *“Nezuko bajo la luna carmesí”*: near-black
plates, a crimson moon bloom, and sakura-crimson monoline glyphs.

151 icons + a `generic` fallback, drawn as vectors and rendered at every launcher density:
system essentials, the Google suite, Xiaomi/MIUI system apps, chat and social, browsers,
media, finance, tools, games and the Spanish apps a real phone turned out to carry.

Well-known apps carry a monoline redraw of their official mark rather than an invented
symbol — Nova's N, Google's locate rings, Shizuku's droplet, Arcticons' A, the 2017 F1
mark and the rider M of MotoGP's 2024 monogram. Where a wordmark is too wide or too fine
to survive a launcher icon at this stroke weight, the mark is carried by its letterform.
Everything in this repo is generated from `src/` — the SVGs and PNGs are build output.

Open [`preview/index.html`](preview/index.html) for a home-screen mockup and the full sheet
(`npm run serve`, then visit `http://127.0.0.1:4321/preview/index.html`).

## What's inside

| Path | What it is |
| --- | --- |
| `src/glyphs.mjs` | Glyph geometry (24×24 grid, monoline, stroke 2.15) |
| `src/apps.mjs` | App list: id, label, glyph, launcher components |
| `src/render.mjs` | Plate + bloom + glow composition, legacy and adaptive layers |
| `src/pack-icon.mjs` | The pack's own launcher icon (torii + moon, adaptive layers) |
| `tools/build.mjs` | Rasteriser + resource generator |
| `tools/check.mjs` | Validates the generated resources |
| `tools/fetch-refs.mjs` | Downloads each app's official icon into `refs/` for drawing |
| `tools/review-sheet.mjs` | Review page: official icon vs the current drawing |
| `icons/svg/` | 512 px SVG source of every icon |
| `icons/foreground/` | Adaptive foreground SVGs (108 dp canvas) |
| `icons/monochrome/` | Themed-icon mask SVGs (white on transparent) |
| `icons/png/<density>/` | 48 / 72 / 96 / 144 / 192 px PNGs |
| `store/` | 512 and 1024 px pack icon for the Play listing |
| `android/` | Gradle project: generated resources plus the app's own screen |
| `android/app/src/main/java/.../MainActivity.java` | Apply / browse / missing-icons screen |
| `android/app/src/main/res/values/ui.xml` | UI colours, strings and styles (survives regeneration) |
| `preview/index.html` | Home-screen mockup + full sheet |

## Rebuild the assets

```bash
npm install
npm run build     # regenerates icons/, store/, res/ and preview/
npm run check     # validates XML and cross-checks every resource reference
```

`res/` is fully regenerated on every build — don't hand-edit it.

## Build the APK

The module is resource-only: the manifest points at `android.app.Activity`, so no
Java/Kotlin is required. Replace it with your own apply-screen activity when you want
a real UI.

### From CI

| Workflow | Trigger | Output |
| --- | --- | --- |
| [`build-apk.yml`](.github/workflows/build-apk.yml) | every push to `main`, PRs | unsigned debug APK as the `crimson-moon-apk` artifact |
| [`release.yml`](.github/workflows/release.yml) | `v*` tag, or manual dispatch | signed APK + SHA-256 attached to a GitHub Release |

Both regenerate `res/`, run `npm run check`, then assemble with JDK 17 and Gradle 8.11.1.

### Cut a release

```bash
git tag -a v1.1.0 -m "Crimson Moon 1.1.0"
git push origin v1.1.0
```

The tag becomes the version: `v1.1.0` → `versionName 1.1.0`, `versionCode 10100`
(`major×10000 + minor×100 + patch`). The workflow fails if the tag is not
`vMAJOR.MINOR[.PATCH]`, if the versionCode exceeds the Play limit of 2100000000, or if
the packaged metadata disagrees with the tag. Before publishing it verifies the APK is
signed and that APK Signature Scheme v2 is intact, then uploads the APK plus its
SHA-256. Re-running against an existing tag replaces the assets.

### Signing

Release signing reads four repository secrets:

| Secret | Contents |
| --- | --- |
| `CM_KEYSTORE_BASE64` | `base64 -w0 keys/release.jks` |
| `CM_KEYSTORE_PASSWORD` | keystore password |
| `CM_KEY_ALIAS` | `crimsonmoon` |
| `CM_KEY_PASSWORD` | key password |

`keys/` is gitignored and holds the only other copy of the keystore. **Back it up** —
without it you cannot sign an update for an installed copy. To build a signed APK
locally, export `CM_KEYSTORE_PATH`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS` and
`CM_KEY_PASSWORD`, then run `gradle -p android assembleRelease`. Without them,
`assembleRelease` produces an unsigned APK and the release workflow's signature check
will reject it.

## The app's own screen

Installing the APK gives you a screen with three things:

1. **Apply** — it finds the launchers you actually have installed. Lawnchair and
   Niagara accept an apply intent, so those get a one-tap button; the rest open the
   launcher and print the exact settings path.
2. **Browse** — every icon in the pack, searchable by label or id.
3. **Coverage** — how the phone lines up with the pack, split two ways, each with
   **Show**, plus **Copy**/**Share** for the export.

That third panel is the important one. A launcher matches an icon by exact
`package/activity` component, so an icon that refuses to apply is one of two things:

| Bucket | Meaning | Fix |
| --- | --- | --- |
| **matched** | the device component is in `appfilter.xml` | nothing |
| **mismatched** | the pack themes that package, but not the component your phone reports | one line — the icon already exists |
| **missing** | no icon for that package yet | a new glyph |

Mismatches are the ones that look like "missing icons" but are really a moved launcher
activity after an app or ROM update: YouTube, for example, reports
`com.google.android.apps.youtube.app.watchwhile.WatchWhileActivity`, a class outside its
own package. The screen exports both buckets in the format the sync tool below reads,
and the build maps any device-reported component to the icon the package already uses.
Nothing leaves the phone unless you share it.

`src/apps.mjs` keeps a `DEVICE_ALIASES` block for exactly this: the launcher aliases a
real ROM declares (Nova's settings shortcut, Reddit's `launcher.default`, Discord's
`MainDefault`, YouTube's `Shell$HomeActivity`) folded into the entries they belong to, so
the shipped pack matches them without needing a local device file.

The same classification runs offline, on any dump:

```bash
npm run coverage device-components.txt             # matched / mismatched / missing
npm run coverage -- --export device-components.txt > to-fix.txt
npm run sync to-fix.txt && npm run build && npm run check
```

## Apply the pack

After installing the APK, open your launcher's icon-pack picker — or just tap **Apply**
on the pack's own screen:

- **Nova** → Settings → Look & feel → Icon style → *Crimson Moon*
- **Lawnchair** → Home screen settings → General → Icon pack
- **Smart Launcher** → Preferences → Theme → Icon pack

On a stock Pixel/Samsung launcher (no icon-pack support) use the PNGs in
`icons/png/xxxhdpi/` with a custom-icon assignment, or a launcher that reads
`appfilter.xml`.

## Adaptive icons

Every icon ships in three layers:

- foreground — the glyph, inside the 66 dp safe zone of a 108 dp canvas
- background — the plate and bloom, full bleed
- monochrome — the glyph alone, white on transparent, for themed icons

`res/mipmap-anydpi-v26/<icon>.xml` binds the first two, so launchers with any mask shape
(circle, squircle, teardrop) crop the same art correctly. Legacy PNGs remain for API < 26.

### Themed icons (Android 13+)

`res/mipmap-anydpi-v33/<icon>.xml` adds `<monochrome>`, so on Android 13 and up a launcher
that supports themed icons drops the plate and paints the glyph with the wallpaper's
deepest accent instead — which is also the only way the pack can follow a light theme.

```bash
npm run build && npm run check   # 153 adaptive icons, each with a themed layer
```

Four properties are load-bearing, and `npm run check` fails without any of them:

- the layer is a pure-white mask — the launcher keeps its alpha and discards its colour,
  so any tint baked in here would be composited into the accent
- the artwork stays inside two-thirds of the half-width. A launcher shows the middle 72
  of the 108 dp layer, and the coloured icons hide a crop in the plate; a flat mask shows
  it as a glyph sliced off along the circle.
- the layer it points at is that icon's own mask, not a neighbour's
- `<monochrome>` lives in the `v33` file only: pre-Android-13 parsers skip the tag today,
  but there is no reason to hand them something to trip over, and `check` fails if a `v26`
  icon grows one

The themed layer is quantised to a 16-entry palette (0.7 MB across all densities instead of
4 MB) because it has one colour; the glyph is drawn a hair heavier there (stroke 2.35, not
2.15) since the glow that widens the coloured icons is gone.

The pack's own app icon carries a themed layer too — the gate and its moon, without the
petals, which read as noise at 64 dp. It is the one mark drawn at its own scale: the
coloured gate is near-black on a near-black plate, so its feet can run to the mask edge
unnoticed, while the same silhouette painted in the accent would show the crop. The mask
is therefore fitted inside the safe circle, at roughly the size of the app glyphs.

See the layer tinted over six wallpaper accents in the preview's **Themed icons** panel;
it is drawn at the launcher's own zoom (the 108 dp layer scaled so its central 72 fills
the circle), so the glyph sizes there match what a phone shows.

## Match your own phone exactly

The curated entries in `src/apps.mjs` guess launch activities, and guesses are what
usually make one or two icons refuse to apply. The pack's own screen already reports the
exact components it is missing — **Show** to read them, **Copy** or **Share** to get the
list off the phone — so the adb route below is only needed for a full inventory.

```bash
# Or, with USB debugging on, phone connected and authorised
adb shell cmd package query-activities --brief \
  -a android.intent.action.MAIN -c android.intent.category.LAUNCHER > device-components.txt

npm run sync     # reports coverage and writes src/device-components.json
npm run build && npm run check
```

`npm run sync` prints four things: how many of the pack's apps are installed, how many
already match, which ones need a corrected activity (with the real component), and which
installed apps the pack does not cover yet. Device-reported components are emitted first
in `appfilter.xml`, so they win over the curated guesses.

No adb? Export the launcher activities from an app such as *App Inspector* and save the
output as `device-components.txt` — the same formats are accepted. A package-only list
(`pm list packages -3`) also works and still produces the coverage report. See
`device-components.sample.txt` for every accepted line format.

`device-components.json` is validated by `npm run check`: it fails if the file names a
package no icon claims, so stale device data can't silently rot the pack.

## Fallback monograms

Every app the pack does not cover can still match the plates. With a device dump in
place:

```bash
node tools/monogram.mjs --uncovered   # -> src/monograms.json
npm run build && npm run check
```

Each uncovered package gets the initials of its name segment (`com.foo.bar` → `B`) drawn
in the pack's monoline, mapped to the launcher activity from the dump — so the fallback
actually applies instead of just looking pretty. Nothing is added to the APK unless
`src/monograms.json` lists it.

One-off monograms, by label:

```bash
node tools/monogram.mjs "Bank of America"   # -> letters/ba.png, plus every density
node tools/monogram.mjs                     # full A-Z 0-9 set -> letters/
```

The full set is written to `letters/` as PNGs per density plus `sheet.png`, for launchers
where you assign an icon per app by hand. Initials come from the label, skipping filler
words, so `Bank of America` becomes `BA` and `Spotify` becomes `S`.

### Correcting an initial

Automatic initials come from the package name, which is sometimes wrong or unhelpful
(`com.foo.alt` → `A`). Fix one without touching code:

```bash
node tools/monogram.mjs --list                 # generated vs final, per app
node tools/monogram.mjs --set com.foo.alt AL   # 1-2 letters or digits
node tools/monogram.mjs --unset com.foo.alt
```

Many at once from a plain list — one `package INITIALS` per line, `#` for comments:

```bash
node tools/monogram.mjs --import corrections.txt
cat corrections.txt | npm run monogram -- --import -
```

Fields can be separated by spaces, tabs, `=`, `:` or `,`, so exported tables mostly just
work. The import is all-or-nothing: if any line is invalid nothing is written, and every
bad line is reported with its number.

Overrides live in `src/monogram-overrides.json`, separate from the generated
`src/monograms.json`, so re-running `--uncovered` never loses your corrections.
`npm run check` fails if an override is malformed or points at a package that no longer
has a monogram.

## Where the brand icons come from

No brand mark in this pack is invented. Every app's drawing starts from the icon on that
app's own store listing:

```bash
node tools/fetch-refs.mjs            # official icons -> refs/  (gitignored, never shipped)
node tools/fetch-refs.mjs --only spotify,f1
node tools/review-sheet.mjs          # reference beside the current drawing
npm run serve                        # then open preview/_review.html
```

The review sheet pairs each app's real icon with what the pack ships, and flags any two
apps that share one drawing. Working method: fetch, review the sheet, redraw the glyph
from the reference in the pack's monoline 24×24 style, re-review, then build.

Eighteen system apps have no store listing at all (`com.android.settings`, the MIUI apps,
the Play Store itself, and so on); those keep a symbol drawn from the platform's own icon,
and `refs/index.json` records the reason for every app without a reference.

## Add or change an app

1. Add the glyph to `src/glyphs.mjs` (24×24 grid) — or reuse an existing one.
2. Add an entry to `src/apps.mjs` with the package and launch activity.
3. `npm run build && npm run check`.

Launch activities differ between ROMs and app versions; list extra candidates in the
same entry, as the existing entries do.

## Notes

- Style is inspired by the wallpaper; no artwork from it is reproduced. The wallpaper is
  used only as the mockup background in `preview/`.
- Icon pack structure follows the de-facto standard (`appfilter.xml` + `drawable.xml` +
  resource names) used by Nova, Lawnchair, ADW, Apex and Go.
