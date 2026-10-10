# Design review and final QA

Method: two independent Impeccable assessments: /root/critique_design (A) and /root/critique_evidence (B). A completed before B findings entered the synthesis.

Assessment A: authored civic-atlas interface, 29/40 Nielsen heuristic score. Material findings: short-height cascade hid records; related-work evidence needed identity and segment context; flags had no selection action.

Assessment B: deterministic detector ran once over src/ using the installed Impeccable launcher: zero findings. Browser observations confirmed stable 1280x720 layout and standard 48px controls. Additional findings: marker hit areas were 32px and short-phone title clipping. Browser evaluation is read-only, so no injected overlay or detector live server was used. Temporary tabs closed.

Fix pass, in the plan's critique/adapt/harden/polish/audit order:
- Correct short-height cascade; preserve portrait/offline vertical layout and landscape list height.
- Compact short-phone sheet and remove repeated street names from list titles.
- Add named 48px map-marker hit areas, pointer and keyboard street selection; search remains the accessible alternative to canvas polylines.
- Identify requested street/segment and link related works by title.
- Keep selected-line status color; selection uses line weight.
- Add reset-dialog focus containment and malformed local-state recovery.
- Add missing-file reload checks and an accurate source caveat for the illustrative telecom counter.
- Keep device-local share links honest, and retain OSM/synthetic-source attribution distinctions.

Functional CI evidence before this fix pass: run 38027373282 passed 91 unit tests, four responsive web sizes, installed APK flows, hardware back, offline cold launch and stored-state persistence. A final capture and reviewer verdict follow these fixes.

Limits: no physical phone, TalkBack or real mobile-data network was available. Emulator portrait/landscape and browser keyboard/semantic checks do not certify physical-device accessibility or performance. No real-world benefit claims are made.

Questions skipped: user delegated routine decisions and requested hands-free delivery; fixed concrete findings within the locked scope.

## Recapture correction
The first finish review returned `recapture`: the 360px Android screenshot was clipped after dynamic density resizing. The test now restarts the app after each size change, checks the exact CSS viewport width and navigation bounds, and captures settled output. Run 38038034970 attempt 1 was interrupted by a Pixel Launcher ANR overlay before those checks; this is recorded as an emulator failure, not a passing app check. A failed-job rerun is pending.

The build was plan-led and extended an incumbent civic-atlas direction. No concept-roll seed or five-block contract was created before implementation. The finish reviewer correctly treated those inputs as missing. This is an explicit process departure, recorded rather than repaired with a retrospective invented seed. The durable product and interface authority is PRODUCT.md plus the shipped-code-derived DESIGN.md.
