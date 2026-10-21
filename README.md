# ShopSphere

A complete production-ready e-commerce mobile application built with React Native and Expo.

![ShopSphere](https://placehold.co/800x400/6366f1/ffffff?text=ShopSphere)

## Overview

ShopSphere is a cross-platform e-commerce app that supports iOS, Android, and Web from a single codebase. It features a full shopping experience including authentication, product browsing, search, cart management, checkout, order tracking, user profiles, push notifications, and more.

### Key Features

- **Cross-Platform**: Runs on iOS, Android, and Web via Expo
- **Authentication**: Email/password, social login (Google, Facebook, Apple), phone OTP, and biometric auth
- **Product Browsing**: Categories, search, product details with images, variants, and reviews
- **Shopping Cart**: Full cart management with coupon support
- **Checkout**: Multi-step checkout with Stripe payment integration
- **Orders**: Order history, details, and real-time tracking
- **AR & Camera**: Barcode scanning and AR product visualization
- **Push Notifications**: Order updates, promotions, and delivery notifications
- **Theming**: Light, dark, and system theme modes with smooth transitions
- **Offline Support**: Persistent storage with MMKV
- **State Management**: React Context for auth/theme/wishlist/notifications, Zustand, React Query
- **Data Fetching**: React Query for server state with caching and retries
- **Type Safety**: Full TypeScript support across the codebase
- **Animations**: Reanimated 2 for smooth native animations
- **Error Handling**: Global error boundaries and error recovery
- **Accessibility**: WCAG-compliant components and helpers

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Expo](https://expo.dev) (SDK 51) |
| Language | TypeScript |
| UI | React Native (0.74), Tailwind CSS / NativeWind |
| Navigation | React Navigation (Native Stack + Bottom Tabs + Drawer) |
| State Management | React Context, Zustand, React Query |
| Storage | React Native MMKV |
| Backend | Supabase (planned) |
| Payments | Stripe (planned) |
| Animations | React Native Reanimated, Lottie |
| Maps | React Native Maps (planned) |
| Camera | Expo Camera |
| Notifications | Expo Notifications |
| Image Processing | TensorFlow.js (planned) |
| Barcode Scanning | React Native Vision Camera (planned) |
| Testing | Jest, Detox, React Testing Library |
| Linting | ESLint |
| Styling | NativeWind (Tailwind CSS) |

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Xcode (for iOS development)
- Android Studio (for Android development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/shopsphere/shopsphere-app.git
cd shopsphere-app

# Install dependencies
npm install

# Start the Metro bundler
npm start

# Run on specific platforms
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

For detailed setup instructions, see [Getting Started Guide](docs/GETTING_STARTED.md).

## Project Structure

```
ShopSphere/
├── App.tsx                    # App entry point - providers and root navigator
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── metro.config.js            # Metro bundler configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── babel.config.js            # Babel configuration
├── web/                       # Web-specific entry point
│   ├── index.html
│   └── index.js
├── assets/                    # Static assets (images, icons, sounds)
└── src/                       # Source code
    ├── components/            # Reusable components
    │   ├── common/            # Shared UI components
    │   ├── custom/            # Custom components
    │   ├── navigation/        # Navigation-related components
    │   └── notifications/     # Push notification system
    ├── navigation/            # Navigation configuration
    │   └── AppNavigator.tsx   # Root navigator (stack + tabs + drawer)
    ├── screens/               # Screen components
    │   ├── auth/              # Authentication screens
    │   ├── cart/              # Cart screen
    │   ├── checkout/          # Checkout flow
    │   ├── orders/            # Order management
    │   ├── profile/           # User profile & settings
    │   ├── HomeScreen.tsx
    │   ├── OnboardingScreen.tsx
    │   ├── SplashScreen.tsx
    │   ├── CategoriesScreen.tsx
    │   ├── SearchScreen.tsx
    │   ├── ProductDetailsScreen.tsx
    │   ├── CameraScreen.tsx
    │   ├── ARViewerScreen.tsx
    │   ├── WishlistScreen.tsx
    │   ├── ProductReviewsScreen.tsx
    │   ├── NotificationCenterScreen.tsx
    │   ├── ProductComparisonScreen.tsx
    │   └── VisualSearchScreen.tsx
    ├── store/                 # State management
    │   ├── AuthProvider.tsx   # Authentication context
    │   ├── WishlistProvider.tsx # Wishlist context
    │   └── InAppNotificationProvider.tsx # In-app notifications context
    ├── styles/                # Styling
    │   └── ThemeProvider.tsx  # Theme context and configuration
    ├── types/                 # TypeScript type definitions
    │   └── index.ts
    └── utils/                 # Utility functions
        └── accessibility.ts
```

For detailed architecture information, see [Architecture Guide](docs/ARCHITECTURE.md).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Metro bundler |
| `npm run android` | Run on Android (requires emulator/device) |
| `npm run ios` | Run on iOS (requires simulator/device) |
| `npm run web` | Run on web |
| `npm run build` | Build all platforms with EAS |
| `npm run build:android` | Build Android APK/AAB |
| `npm run build:ios` | Build iOS IPA |
| `npm run build:web` | Build web bundle |
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Detox end-to-end tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run type-check` | Run TypeScript type checking |
| `npm run storybook` | Start Storybook for component development |

## Navigation Flow

```
Root Stack Navigator
├── Splash Screen (2s delay)
├── Onboarding (first launch only)
├── Auth Stack (when not authenticated)
│   ├── SignIn
│   ├── SignUp
│   ├── ForgotPassword
│   ├── OTPVerification
│   └── BiometricSetup
└── Main Drawer (when authenticated)
    └── Main Tab Navigator
        ├── Home (with product carousel, categories)
        ├── Categories
        ├── Cart
        ├── Orders
        │   ├── Orders List
        │   ├── Order Details
        │   └── Order Tracking
        └── Profile
            ├── Settings
            └── (other profile screens)
    Plus stack screens:
    ├── ProductDetails
    ├── Search
    ├── Camera
    ├── ARViewer
    ├── Checkout
    ├── Wishlist
    ├── ProductReviews
    ├── NotificationCenter
    ├── AddressBook
    ├── PaymentMethods
    ├── ProductComparison
    ├── LanguageSelector
    └── VisualSearch
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# API Configuration
API_URL=https://api.shopsphere.com
API_TIMEOUT=10000

# Feature Flags
ENABLE_AR=true
ENABLE_AI_RECOMMENDATIONS=true
ENABLE_BIOMETRICS=true
```

## Documentation

- [Getting Started Guide](docs/GETTING_STARTED.md) - Setup and installation
- [Architecture Guide](docs/ARCHITECTURE.md) - Project architecture and design decisions
- [Development Guide](docs/DEVELOPMENT.md) - Coding standards and contribution guidelines
- [Deployment Guide](docs/DEPLOYMENT.md) - Building and releasing the app
- [Component Library](docs/COMPONENTS.md) - Component and screen reference

## License

MIT - See [package.json](package.json) for details.

## Links

- [Repository](https://github.com/shopsphere/shopsphere-app.git)
- [Homepage](https://shopsphere.com)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
