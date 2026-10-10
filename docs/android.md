# Android build
Node 22+, JDK 21 and Android SDK 36 are required. Use Android Studio Otter or later, or GitHub Actions.

Run npm ci, then npm run android:apk. Output: android/app/build/outputs/apk/debug/app-debug.apk. npm run android:sync always builds and copies fresh assets.

Install with adb install -r <apk>. CI runs an emulator smoke test. Physical-device checks remain separately documented.

Debug WebView with chrome://inspect. For white screen check relative asset paths and cap sync. For source release 21 check JAVA_HOME. Map geometry is bundled and does not depend on raster tiles.

No keystore or password belongs in Git. Evaluation fallback is a debug-signed APK. Android-only; no Play Store or iOS release.
