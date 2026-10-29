# Subakarya Mobile App (Flutter WebView)

This is the mobile companion application for the **Subakarya Event Management Platform** (`https://subakarya-eventmanagement.vercel.app/`).

## Features

- **Subakarya Brand Theme**: Wine Red (`#7F011F`), Light Sand (`#F5EBD0`), and Surface Warm (`#FFFCF6`).
- **Splash & Loading Screen**: Branded animated loader with Subakarya emblem and tagline *EVENTS MADE EFFORTLESS*.
- **High-Performance WebView**: Powered by `webview_flutter` with JavaScript enabled, localStorage session persistence, and cookies.
- **Hardware Back Button Handling**: Navigates backwards through the WebView history before popping or minimizing the app.
- **External Link Interception**: Automatically detects and handles external schemes (`tel:`, `mailto:`, `sms:`) using `url_launcher`.
- **Offline / Error State with Retry**: Shows a clean connection problem screen with a dedicated "Retry Connection" button if the website cannot be reached.
- **Android Ready**: Configured with internet permissions, hardware acceleration, cleartext traffic allowance, and keyboard resizing (`adjustResize`).

---

## Directory Structure

```text
Evenet-management/
├── src/                    # React Web Application
├── public/                 # Web assets & Subakarya logos
├── flutter_app/            # Flutter Mobile Project
│   ├── assets/
│   │   └── subakarya-logo.png
│   ├── lib/
│   │   └── main.dart       # WebView controller, splash screen & error handling
│   ├── android/            # Native Android platform code & manifest
│   ├── test/
│   │   └── widget_test.dart
│   ├── pubspec.yaml
│   └── README.md
```

---

## Setup and Run Instructions

### Prerequisites
1. **Flutter SDK**: 3.41+ (Dart 3.11+)
2. **Android Studio / Android SDK**: Platform 34+ / Build-Tools
3. Connected Android device or Emulator

### 1. Install Dependencies
```bash
cd flutter_app
flutter pub get
```

### 2. Analyze Code
```bash
flutter analyze
```

### 3. Run on Device / Emulator
```bash
flutter run
```

### 4. Build Android APK
- **Debug APK**:
  ```bash
  flutter build apk --debug
  ```
  Output: `flutter_app/build/app/outputs/flutter-apk/app-debug.apk`

- **Release APK**:
  ```bash
  flutter build apk --release
  ```
  Output: `flutter_app/build/app/outputs/flutter-apk/app-release.apk`
