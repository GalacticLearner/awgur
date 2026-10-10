# Delivery checks

## Phase 0
- Local Node 24.21; Java / adb / Android SDK absent. CI-only Android build.
- React scaffold: production build succeeded; local preview loaded.
- Hosted companion loaded without login at https://galacticlearner.github.io/awgur/.
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

## Phase 3 acceptance
CI 38027373282 passed engine checks, browser flows and installed APK flows. Checkpoint phase-3-green preserves that build.

## Phase 4 verification
Current source a235861 passed Android CI 38031265467 and hosted deployment 38031265476. Installed API 35 emulator passed 16 checks: resident and officer flows, all eight hero projects, new permit, persistent emergency/follow/delay state, hardware back including root exit, offline cold launch, small/large/landscape layouts, keyboard search and no JavaScript exceptions. Browser tests at 1440×900, 390×844, 360×640 and 412×915 passed the hero flow, persistence, overflow and keyboard-operable 48px markers. Missing-file recovery, malformed stored-state recovery and modal focus containment passed.

Signed release candidate cec4e36 passed run 38030978666. The signed APK installed and opened; its 30 bundled web files exactly matched the debug variant tested in that build. The settled airplane-mode capture visibly shows bundled streets, works and the offline banner. The five-second capture was still loading; the thirteen-second capture was ready. Therefore a sub-three-second complete cold launch is NOT established. The approximately 430ms debug first contentful paint is not a full-ready timing measurement.

Limits: no physical-phone, TalkBack, minimum-API or mobile-data/incognito test has been performed. Landscape evidence uses emulator viewport resizing. These remain unverified, not passed. Final public release download/install and finish review are pending.

## Phase 6 acceptance
Source a85c61b passed Android run 38041190697 and signed-release candidate run 38041193458. Installed API 35 app passed 17 flows, including finish forecast, insufficient history, R6 suggested start and recheck, original hero, hardware back, offline cold launch and persistence. Four browser sizes passed; a separate flag-off browser build reproduced the exact 128-work/six-permit baseline and hid all Clock Risk UI/findings. Local suite: 114 tests, including 20,000-trial coverage cases and both timezones. R1/R2/R3 and baseline metrics exactly match the frozen pre-feature snapshot.

The Clock Risk finish reviewer returned ship on the complete Phase 6 capture/source packet. The base reviewer requested settled ledger/permit-heading and expanded-sheet recaptures. Main recapture run 38041818160 stopped on a UiAutomation helper crash (PID2685, Bad file descriptor), not an awgur-process crash. Full device logs are retained; crash assertions now target the captured awgur PID.
