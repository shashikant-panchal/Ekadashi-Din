# Android Build Setup Guide

This project is configured to build signed APK and AAB files without using EAS (Expo Application Services).

## Keystore Configuration

The keystore has been generated and configured. The keystore file is located at:

- `android/app/ekadashidin-release-key.keystore`

**Important:** The keystore file is already in the `android/` directory which is gitignored. Keep your keystore file safe and backed up!

### Current Keystore Details:

- **Alias:** `ekadashidin-key-alias`
- **Store Password:** `ekadashidin123`
- **Key Password:** `ekadashidin123`
- **Validity:** 10,000 days (~27 years)

## Building APK and AAB Files

### Build Release APK

```bash
npm run build:android:apk
```

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

### Build Release AAB (Android App Bundle)

```bash
npm run build:android:aab
```

The AAB will be generated at: `android/app/build/outputs/bundle/release/app-release.aab`

### Clean Build

```bash
npm run build:android:clean
```

## Configuration Files

### gradle.properties

Keystore configuration is stored in `android/gradle.properties`:

```
EKADASHIDIN_RELEASE_STORE_FILE=ekadashidin-release-key.keystore
EKADASHIDIN_RELEASE_KEY_ALIAS=ekadashidin-key-alias
EKADASHIDIN_RELEASE_STORE_PASSWORD=ekadashidin123
EKADASHIDIN_RELEASE_KEY_PASSWORD=ekadashidin123
```

### build.gradle

The `android/app/build.gradle` file has been configured with:

- Release signing config that uses the keystore
- Proper signing configuration for release builds

## Security Notes

1. **Never commit the keystore file to version control** - It's already in `.gitignore`
2. **Keep your keystore password secure** - Store it in a secure password manager
3. **Backup your keystore** - If you lose it, you won't be able to update your app on Google Play Store
4. **The current passwords are in plain text in gradle.properties** - For production, consider using environment variables or a secure credential store

## Changing Keystore Passwords

If you need to change the keystore passwords:

1. Update the passwords in `android/gradle.properties`
2. Or use environment variables by modifying `android/app/build.gradle` to read from environment variables instead

## Troubleshooting

### Build fails with "keystore not found"

- Ensure the keystore file exists at `android/app/ekadashidin-release-key.keystore`
- Check that the path in `gradle.properties` is correct

### Build fails with "password incorrect"

- Verify the passwords in `android/gradle.properties` match the keystore
- You can verify keystore info with: `keytool -list -v -keystore android/app/ekadashidin-release-key.keystore`

### Need to generate a new keystore

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/ekadashidin-release-key.keystore \
  -alias ekadashidin-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=EkadashiDin, OU=Mobile, O=EkadashiDin, L=City, ST=State, C=IN"
```

Then update the passwords in `android/gradle.properties`.
