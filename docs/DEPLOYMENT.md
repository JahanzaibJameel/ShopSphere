# Deployment Guide

How to build, test, and deploy ShopSphere to production.

## Overview

ShopSphere uses [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/) for building and submitting apps to app stores. It also supports web deployment with a standard export.

## Prerequisites

1. **Expo CLI** installed globally:
   ```bash
   npm install -g expo-cli
   ```

2. **EAS CLI** installed globally:
   ```bash
   npm install -g eas-cli
   ```

3. **Expo Account** - Log in via:
   ```bash
   eas login
   ```

4. **Apple Developer Account** - Required for iOS builds ($99/year)
5. **Google Play Developer Account** - Required for Android builds ($25 one-time fee)
6. **Environment variables** - See `.env` configuration in [Getting Started](GETTING_STARTED.md)

## Build Configuration (eas.json)

Create an `eas.json` file in the project root:

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

### Build Profiles

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| `development` | Internal testing with Expo Go | Internal testing |
| `preview` | Internal distribution builds | Internal testing |
| `production` | App Store / Play Store release | Production |

## Android Builds

### Development Build

```bash
eas build -p android --profile development
```

### Production Build (App Bundle)

```bash
eas build -p android --profile production
```

### Local Android Build (without EAS)

```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore keystore.jks -alias key -keyalg RSA -keysize 2048 -validity 10000

# Build locally
eas build -p android --profile production --local
```

### App Signing

- Upload `.aab` files to Google Play Console
- Google Play App Signing is recommended for security

## iOS Builds

### Production Build

```bash
eas build -p ios --profile production
```

### Requirements

1. **Apple ID** with a paid Developer Account
2. **App ID** created in [Apple Developer Portal](https://developer.apple.com/account/)
   - Enable required capabilities: Push Notifications, Sign in with Apple, In-App Purchase
3. **Provisioning Profile** - Use automatic provisioning or create manually

### iOS App Store Submission

```bash
eas submit -p ios --profile production
```

## Web Deployment

### Production Build

```bash
npx expo export --platform web
```

This generates static files in the `dist/` directory.

### Deploy to Vercel

```json
// vercel.json
{
  "rewrites": [
    { "source": "/_expo/(.*)", "destination": "/_expo/$1" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

Deploy with:
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --dir=dist
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npx expo export --platform web
firebase deploy
```

## EAS Submit

### Submit to Google Play Store

```bash
eas submit -p android --profile production
```

### Submit to Apple App Store

```bash
eas submit -p ios --profile production
```

## OTA Updates

ShopSphere is configured for [Over-the-Air Updates](https://docs.expo.dev/distribution/performing-over-the-air-updates/):

### Publish an Update

```bash
eas update --branch production --message "Bug fixes and improvements"
```

### Branches

| Branch | Purpose |
|--------|---------|
| `production` | Live app updates |
| `staging` | Staging/QA builds |
| `preview` | Feature branch previews |

### Update Channel Mapping

Set up channels in `app.json`:

```json
"updates": {
  "url": "https://u.expo.dev/your-project-id"
}
```

## Environment-Specific Configuration

### app.json Configuration

```json
{
  "expo": {
    "name": "ShopSphere",
    "slug": "shopsphere",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.shopsphere.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.shopsphere.app",
      "versionCode": 1
    }
  }
}
```

### Versioning Strategy

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **PATCH**: Bug fixes (e.g., `1.0.1`)
- **MINOR**: New features, backward compatible (e.g., `1.1.0`)
- **MAJOR**: Breaking changes (e.g., `2.0.0`)

Increment via:

```bash
eas version:set --version 1.0.1
```

## Testing Before Deployment

### Automated Checks

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Unit tests
npm test

# E2E tests
npm run test:e2e
```

### Manual QA Checklist

- [ ] App launches without crashes
- [ ] Authentication flow works (sign in, sign up, social login)
- [ ] Product browsing and search
- [ ] Cart add/remove/update
- [ ] Checkout flow (with test cards)
- [ ] Order placement and tracking
- [ ] Notifications (permission + scheduling)
- [ ] Theme switching (light/dark/system)
- [ ] Offline behavior (data persistence)
- [ ] Camera and AR features
- [ ] Error boundaries (graceful failure)

## Monitoring and Analytics

### Sentry (Error Tracking)

The app includes `sentry-expo` for error monitoring. Configure in `App.tsx`:

```typescript
import * as Sentry from 'sentry-expo';
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInDev: true,
  // ... other config
});
```

### App Store Connect

Monitor:
- Crash reports
- User reviews
- Performance metrics
- App Store analytics

## Rollback Procedure

If a production release has critical issues:

### Rollback EAS Build

1. Go to [EAS Dashboard](https://expo.dev/)
2. Navigate to your app
3. Find the build to roll back to
4. Download and re-submit that build

### Rollback OTA Update

```bash
eas update:rollback --branch production
```

## CI/CD

For automated builds, set up GitHub Actions:

```yaml
# .github/workflows/build.yml
name: Build
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
```

## Support

For deployment issues:
- [Expo Discord](https://discord.gg/6dpakas)
- [EAS Documentation](https://docs.expo.dev/build/introduction/)
- [Apple Developer Support](https://developer.apple.com/support/)
- [Google Play Developer Support](https://developer.android.com/distribute/best-practices/launch/)
