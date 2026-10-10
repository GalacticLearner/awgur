# Delivery checks

## Phase 0
- Local Node 24.21; Java / adb / Android SDK absent. CI-only Android build.
- React scaffold: production build succeeded; local preview loaded.
- Hosted companion loaded without login at https://galacticlearner.github.io/works-registry/.
- Private plan, research context and original Word file excluded from Git tracking.
- Dependency audit: zero known vulnerabilities after patching development-tool transitive dependencies.
- Android CI: first run failed on obsolete SDK package `tools`; current SDK platform/build-tools explicitly selected.
- Emulator launch evidence pending. No physical phone has been tested.

- Initial emulator installed and visually launched the APK successfully. Basic UIAutomator did not expose WebView text, so the automatic content assertion is being replaced with direct rendered-content inspection through WebView debugging.

## Phase 0 acceptance
Corrected CI run 38024037508 passed APK compilation, installation and direct WebView rendered-content check on an API 35 emulator. Tagged phase-0-green. No real phone test.

## Phase 1 data
400 real OSM segments; 120 background + 8 hero works; 6 pending permits; 76 constructed scenarios with required category counts. Regeneration identical twice. References valid. Bundled data approximately 328 KB. Ground truth committed before rules are implemented. Native rebuild gate pending.

## Phase 1 acceptance
Latest data revision 71c1759 passed CI run 38024631694, including APK install and rendered-content launch. Tagged phase-1-green.

## Phase 2 engine
91 tests pass, including 76 constructed cases and date output checks under Asia/Kolkata and America/Los_Angeles. Pure engine imports no UI/native APIs. Validation reports R1 16 TP, R2 12 TP, R3 12 TP with no rule FP/FN on these isolated fixtures; 12/12 emitted R3 suggestions validate. Baseline errors are all listed in docs/validation.md. Combined hero has R1, R2 and a validated R3 that removes R1. Production build passes. Native gate pending.

## Phase 2 acceptance
CI run 38025053878 passed tests, validation, APK compile, install and launch. Tagged phase-2-green.

## Phase 3 screens
Browser resident project flow renders seeded timeline, delays and restoration. Combined officer flow displays R1/R2/R3; applying R3 shifts the request to 1–8 November and removes R1. Empty emergency reason blocks approval; a recorded reason appears on the public work page. All screens compile; native Share added. Local persistence and native back/offline flows are now covered by the installed-APK CI script; results pending.
