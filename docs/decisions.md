# Build decisions

- Start: 10 October 2026, approximately 09:37 IST. Ten-hour delivery target: 19:37 IST; plan's hard submission target: 20:30 IST.
- Retain Works Registry / app.worksregistry.demo, Capacitor 8, Android-only APK and companion static web build.
- Kotlin/Compose and React Native/Expo rejected: both require screen/map rewrites; Expo cloud builds may queue and Android map setup adds dependencies.
- Local Node 24 is available. Java, adb and the Android SDK are absent. CI is the primary APK route; do not spend the feature budget installing Android Studio.
- Use a restrained civic palette: warm paper, deep green, amber for schedule concerns, red for clashes. Public Sans bundled locally for offline use.
- The 30-day telecom counter is illustrative, not a statement of legal entitlement. Moratorium is a configurable default with unverified scope.
- No backend, real authentication, scraping, service worker or PWA.

- Proposed hosting substitution: GitHub Pages instead of Vercel/Netlify, avoiding a second account for the identical static build.

- Installed APK phase gates use a GitHub-hosted Android emulator since this machine has no Android SDK or connected device. Physical phone and TalkBack checks will remain explicitly unverified unless a device becomes available.
