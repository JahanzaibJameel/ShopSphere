# Getting Started

This guide walks you through setting up and running ShopSphere locally.

## Prerequisites

### Required

- **Node.js** >= 18.0.0 ([download](https://nodejs.org/))
- **npm** >= 8.0.0 (bundled with Node.js)
- **Expo CLI** - Install globally with `npm install -g expo-cli`

### Platform-Specific Requirements

#### iOS Development
- **Xcode** (latest stable version from the Mac App Store)
- **CocoaPods** - `sudo gem install cocoapods` (or use `npx pod-install`)
- A Mac computer is required for iOS builds

#### Android Development
- **Android Studio** ([download](https://developer.android.com/studio))
- Android SDK with API 31+ (Android 12+)
- Set `ANDROID_HOME` environment variable

#### Web Development
- No additional requirements beyond Node.js

## Installation

```bash
# Clone the repository
git clone https://github.com/shopsphere/shopsphere-app.git
cd shopsphere-app

# Install dependencies
npm install
```

## Environment Configuration

### Create Environment Files

Copy the example and fill in your values:

```bash
touch .env
```

```env
# Supabase Configuration (for backend/auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration (for payments)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# API Configuration
API_URL=https://api.shopsphere.com
API_TIMEOUT=10000

# Feature Flags
ENABLE_AR=true
ENABLE_AI_RECOMMENDATIONS=true
ENABLE_BIOMETRICS=true
```

> **Note**: The app currently uses mock data for all operations. Environment variables are used for future integration with Supabase and Stripe.

### Configure EAS (Expo Application Services)

For building production apps, configure the `eas.json` file:

```bash
npm install -g eas-cli
eas login
```

Then create `eas.json` in the project root:

```json
{
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Running the App

### Development (Expo Go)

The fastest way to start developing:

```bash
# Start the Metro bundler
npm start
```

This opens the Expo Dev Menu. You can:
- Press `i` to launch iOS simulator
- Press `a` to launch Android emulator
- Press `w` to open the app in a web browser
- Scan the QR code with the Expo Go app on your physical device

### Running on Specific Platforms

```bash
npm run android   # Start Metro and open Android emulator
npm run ios       # Start Metro and open iOS simulator
npm run web       # Start the web dev server
```

### Production Builds

See [Deployment Guide](DEPLOYMENT.md) for production build instructions.

## Project Setup Verification

After installation, verify your setup:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Develop

1. Start the dev server: `npm start`
2. Use Expo Go on your device to test
3. Run type checking regularly: `npm run type-check`
4. Run linting: `npm run lint`

### 3. Test

```bash
# Unit tests
npm test

# Tests with coverage
npm run test:coverage

# End-to-end tests (requires emulators running)
npm run test:e2e
```

### 4. Commit

```bash
git add .
git commit -m "Your commit message"
```

See [Development Guide](DEVELOPMENT.md) for coding standards.

## Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
# Clear Metro cache
npx expo start -c
```

#### iOS build fails with CocoaPods errors
```bash
cd ios && pod install --repo-update && cd ..
```

#### Android emulator not detected
```bash
# List connected devices
adb devices

# Restart ADB
adb kill-server && adb start-server
```

#### TypeScript path alias errors
Ensure `metro.config.js` and `tsconfig.json` path aliases match. The current aliases are:
- `@/` -> `src/`
- `@components/` -> `src/components/`
- `@screens/` -> `src/screens/`
- `@navigation/` -> `src/navigation/`
- `@store/` -> `src/store/`
- `@api/` -> `src/api/`
- `@hooks/` -> `src/hooks/`
- `@utils/` -> `src/utils/`
- `@types/` -> `src/types/`
- `@assets/` -> `src/assets/`
- `@styles/` -> `src/styles/`
- `@animations/` -> `src/animations/`

#### Metro bundler port conflicts
```bash
# Specify a different port
npx expo start --port 8081
```

### Expo Go Specific

If the app doesn't load in Expo Go:
1. Ensure your device/emulator and development machine are on the same network
2. Try using a tunnel connection: `npx expo start --tunnel`
3. Clear the Expo Go cache in the Expo Go app settings

## Next Steps

- Read the [Architecture Guide](ARCHITECTURE.md) to understand the codebase
- Read the [Development Guide](DEVELOPMENT.md) for coding standards
- Read the [Component Library](COMPONENTS.md) for UI component reference
