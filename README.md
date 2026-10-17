# Crimson Moon — Android icon pack

[![Build APK](https://github.com/GabrielCrackPro/crimson-moon-iconpack/actions/workflows/build-apk.yml/badge.svg)](https://github.com/GabrielCrackPro/crimson-moon-iconpack/actions/workflows/build-apk.yml)

A neon-noir icon pack built from the mood of *“Nezuko bajo la luna carmesí”*: near-black
plates, a crimson moon bloom, and sakura-crimson monoline glyphs.

116 icons + a `generic` fallback, drawn as vectors and rendered at every launcher density:
system essentials, the Google suite, Xiaomi/MIUI system apps, chat and social, browsers,
media, finance, tools and games.
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
| `icons/svg/` | 512 px SVG source of every icon |
| `icons/foreground/` | Adaptive foreground SVGs (108 dp canvas) |
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
3. **Missing icons** — the number of apps on the phone the pack has no mapping for,
   with **Show**, **Copy** and **Share** for the list.

That third panel is the important one. A launcher matches an icon by exact
`package/activity` component, so "the icon didn't apply" always means "that component
is not in `appfilter.xml`". The screen diffs the two on the device and hands you the
exact missing components in the format the repo already reads — paste them into a file
and run the sync below. Nothing about that list leaves the phone unless you share it.

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

Every icon ships in two layers:

- foreground — the glyph, inside the 66 dp safe zone of a 108 dp canvas
- background — the plate and bloom, full bleed

`res/mipmap-anydpi-v26/<icon>.xml` binds them, so launchers with any mask shape
(circle, squircle, teardrop) crop the same art correctly. Legacy PNGs remain for API < 26.

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
