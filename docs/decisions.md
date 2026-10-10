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

- OSM obtained from the VK Maps public Overpass endpoint after other endpoints failed. Retain the central 400 segments around Thiruvanmiyur for mobile rendering. Geometry remains ODbL, attributed in map and About.
- Validation fixtures are stored in fixtures.json separately from the 128 visible registry works. Each constructed case explicitly names its fixture work ids; isolated rule tests cannot be polluted by random background works. The combined hero scenario is checked separately against the visible registry.

- R2 checks excavation types cut, pipeline, cable and drain. Relay/resurface protection is handled by R1; inspection is excluded. Missing project ids do not establish a same-project exemption.
- Joint scheduling preserves the longer inclusive calendar-day duration. A flexible window may advance to the calendar moratorium expiry; only independently validated suggestions are exposed. Resurfacing sequence windows must start after the excavation ends.

- Network plugin adds ACCESS_NETWORK_STATE as well as INTERNET. Both are normal Android permissions and are disclosed accurately; no location permission is requested.
- Native back uses actual router history index, with a direct-project fallback to the street root, avoiding a false exit when a judge opens a deep link.
- On phones, selected permit details move above the pending list, keeping review actions reachable immediately.
