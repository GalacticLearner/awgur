# Release signing

The release signing key is a private PKCS#12 keystore, alias works, protected by a generated password. Neither the key nor passwords are tracked in Git. A protected backup is retained outside the repository.

Gradle uses ANDROID_KEYSTORE_PATH and ANDROID_KEYSTORE_PASSWORD. GitHub Actions reads private repository secrets ANDROID_KEYSTORE_BASE64 and ANDROID_KEYSTORE_PASSWORD and decodes the key only into the temporary runner directory. The release job builds assembleRelease, verifies with apksigner, computes SHA-256, and installs on an API 35 emulator.

Release and debug web assets are hash-compared. The extensive app-flow checks use the debug variant for WebView inspection; the signed release is separately installed and captured online and offline. Release WebView debugging stays disabled.

If signing does not pass its time box, retain the last tagged debug-signed APK for evaluation. Do not ship an unsigned APK.
