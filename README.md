# awgur

Demo Link: https://drive.google.com/file/d/19woCJZnw_F_VJ7q46ykXUBC4l4oZDdUR/view?usp=sharing

[Android APK release](https://github.com/GalacticLearner/awgur/releases/latest) · [Live website](https://galacticlearner.github.io/awgur/) · [Implementation and results](docs/clock-risk.md)



[![Android checks](https://github.com/GalacticLearner/awgur/actions/workflows/android.yml/badge.svg)](https://github.com/GalacticLearner/awgur/actions/workflows/android.yml)

A permit can clear a road’s protection window on planned dates and still be too early when resurfacing finishes late. awgur connects a public delay ledger to the next permit decision: ordinary clash checks plus **Clock Risk**, a slip-aware completion bound feeding the moratorium clock.

Android APK and the same React application hosted on GitHub Pages. No login or server setup.

## Contribution and evidence

Clash detection and public records are established ideas. The bounded addition here connects them to completion uncertainty: an explainable order statistic from the ledger’s history, a warning when planned dates clear too early, and a rechecked suggested start. It explicitly reports insufficient history. No model is fitted or ML library used; no claim of being first.

R1 checks configurable relay/resurfacing protection; R2 checks repeat excavation on the same or endpoint-connected segment; R3 proposes independently validated coordination windows. Emergency exceptions require a public reason. Residents see responsibility, planned/actual progress, delay reasons and restoration state.

The 400 Thiruvanmiyur street segments are OpenStreetMap geometry. All 230 works, six permits, people, assignments, contractors, dates, slips and follows are synthetic. The demo date is 10 October 2026. Roles are local personas; edits stay on the device.

The default 90% finite-sample marginal coverage guarantee requires exchangeable future and calibration slips in the selected reference class. It does not guarantee a particular street or season. [Method reference](https://arxiv.org/abs/2107.07511).

On the unretuned seed, leave-one-out finish coverage is **179/196 (91.3%)**. Across 63 completed relays/resurfacings, planned-date false-safe starts are **56/63**, versus **3/63** using the slip bound, with **11.9 mean additional waiting days** (median 12). These are synthetic mechanism checks, not Chennai outcomes or savings. [Full results and baseline errors](docs/validation.md).

## Install on Android

Download `awgur-1.0.0.apk` from the [public Release](https://github.com/GalacticLearner/awgur/releases/latest). Android 7.0 (API 24)+ and an up-to-date Android System WebView are required. Android only; everyone else uses the [website](https://galacticlearner.github.io/awgur/).

1. Open the APK; allow installation from that browser or file manager if Android asks.
2. Install and open awgur. This signed evaluation APK is distributed outside the Play Store; Android/Play Protect may display an installation notice.
3. Verify SHA-256 against the release’s `SHA256SUMS.txt` and the checksum below.

SHA-256 of `awgur-1.0.0.apk`:

```text
66cd4c17d3e3caebdc0dd9ddb83fc46e469c0e1ce304c15f626201c3b18b5588
```

Choose the named signed APK. `app-debug.apk`, when present, is the separate debug fallback. Package id `app.worksregistry.demo` is retained for compatibility. A debug-to-release signing change requires uninstalling the debug variant first, which clears its local demo edits.

## Judge path

Switch to Ravi → **Review → Post-relay service connection**. The cut clears the planned expiry but receives R6 against the finish bound. **Apply suggested start** preserves duration and reruns R1/R2/R6. Open the linked relay for the forecast; the overdue BSNL inspection on that street shows insufficiency. About contains results and limits.

The South Mada Street permit retains the combined R1/R2/R3 hero. Its validated window removes the targeted warning. All eight original hero projects remain available.

## Development and validation

Node 22+; use the lockfile for reproducible dependencies:

```sh
npm ci
npm run seed
npm run dev
npm test
npm run validate
npm run data:check
npm run build
```

`npm install` is an alternative to `npm ci`. `ENABLE_CLOCK_RISK` in `src/engine/params.ts` gates the addition. Disabled builds restore exact pre-feature data and hide forecasts, R6 and its backtest.

114 tests cover constructed fixtures, calendar/timezone boundaries, safe-start rejection and seeded 20,000-trial coverage cases. Original R1/R2/R3 metrics are unchanged. CI checks four web sizes, flag-off UI, installed Android flows, back, persistence and offline launch. Physical-phone, TalkBack, minimum-API and real mobile-network performance remain unverified. Emulator first paint is not full-ready cold-start timing.

## Android from source

Node 22+, JDK 21, Android Studio Otter or newer and SDK platform/build-tools 36, or use the GitHub Actions APK artifact:

```sh
npm ci
npm run android:apk
```

Debug output: `android/app/build/outputs/apk/debug/app-debug.apk`. `npm run android:sync` builds and copies fresh assets. [Build instructions](docs/android.md) · [Signing](docs/signing.md). Keys/passwords stay private. Release/debug web files are compared; release WebView debugging is disabled.

## Limits and research directions

Completed-only calibration excludes abandoned and still-running jobs. Monsoon, contractors and programmes may shift slips; padded planned dates can distort them. Next: real municipal histories, temporal holdouts, seasonal reference classes, and missed-risk versus waiting-cost evaluation.

The 12-month moratorium is a configurable default with unverified policy scope. Repeat, flexibility and restoration thresholds are demo assumptions. The illustrative 30-day telecom counter is not a legal entitlement; the checked 2024 DoT text describes a 67-day process. [Parameter evidence](docs/parameter-evidence.md).

Bundled Android data works offline; optional OSM tiles require internet and are never pre-cached. The website needs internet to load. No backend, authentication, PWA/service worker, coordinate snapping, tender parsing, location, OC4IDS export, traffic/pavement model or proven real-world saving.

## Disclosures and license

React, Vite, TypeScript, React Router, Leaflet, react-leaflet, Public Sans, Lucide, Vitest, tsx, Playwright, Capacitor 8; App, Network, Splash Screen, Share and System Bars integrations. Android System WebView; OpenStreetMap geometry/tiles, Overpass, GitHub Actions and GitHub Pages. Impeccable and the Codex coding agent supported development.

Code: [MIT](LICENSE). Geometry: [OpenStreetMap contributors, ODbL](https://www.openstreetmap.org/copyright). [Public Sans font license](public/licenses/PublicSans.txt). Supplied planning/research files and signing material stay outside the public source scope.

