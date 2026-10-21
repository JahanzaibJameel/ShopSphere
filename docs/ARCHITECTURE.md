# Architecture

This document describes the architecture, design patterns, and technical decisions of ShopSphere.

## Overview

ShopSphere follows a layered architecture with clear separation of concerns:

```
App Layer (App.tsx)
  ├── Provider Layer (Context/State)
  └── Presentation Layer (Screens & Components)
      └── Navigation Layer (React Navigation)
```

### Architecture Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Unidirectional Data Flow**: Data flows down, events flow up
3. **Composition over Inheritance**: Components are composed rather than extended
4. **Single Source of Truth**: Centralized state management for auth and theme
5. **Type Safety**: Full TypeScript types across the codebase
6. **Reusability**: Components are designed to be reusable across screens

## Provider Layer

### App Entry Point (`App.tsx`)

The root component wraps the entire app in a hierarchy of providers:

```
ErrorBoundary
  └── SafeAreaProvider
      └── QueryClientProvider
          └── ThemeProvider
              └── AuthProvider
                  └── WishlistProvider
                      └── InAppNotificationProvider
                          └── NotificationProvider
                              └── AppNavigator
                              └── StatusBar
```

**Order matters** - each provider depends on those above it:
- `ErrorBoundary` catches all render errors
- `SafeAreaProvider` provides safe area insets
- `QueryClientProvider` enables React Query for server state
- `ThemeProvider` provides theme colors and settings
- `AuthProvider` manages authentication state
- `WishlistProvider` manages wishlist state with MMKV persistence
- `InAppNotificationProvider` manages in-app notifications with MMKV persistence
- `NotificationProvider` handles push notifications via Expo

### Authentication (`src/store/AuthProvider.tsx`)

- Uses **React Context** for state management
- Persists auth state to **MMKV** (native key-value storage)
- Provides auth methods: `login`, `signup`, `socialLogin`, `phoneLogin`, `verifyOTP`, `setupBiometric`, `updateProfile`, `refreshAuthToken`, `logout`
- Exposes `useAuth()` hook for consuming auth state
- Current implementation uses **mock data** - replace with real API calls

**Auth State Storage (MMKV `auth-storage` keys)**:
- `token` - JWT access token
- `refreshToken` - Refresh token for token rotation
- `user` - Serialized user object

### Theme (`src/styles/ThemeProvider.tsx`)

- Supports **light**, **dark**, and **system** theme modes
- Theme mode preference is persisted in MMKV (`theme-storage`)
- Theme includes: colors, spacing tokens, font families
- Exposes `useTheme()` hook for consuming theme
- Colors are fully themed for both light and dark modes

**Theme Storage (MMKV keys)**:
- `themeMode` - Current theme mode

### Notifications (`src/components/notifications/NotificationProvider.tsx`)

- Wraps app with Expo Notifications
- Requests notification permissions on mount
- Provides methods for scheduling, canceling, and managing notifications
- The `notificationHelpers` export provides helper functions for common notification types (order confirmations, shipping, delivery, promotions, price drops, back-in-stock), but these are currently stub implementations that log to console rather than scheduling actual notifications

### Wishlist (`src/store/WishlistProvider.tsx`)

- Uses **React Context** for state management
- Persists wishlist items to **MMKV** (`wishlist-storage`, key `wishlist_items`)
- Provides methods: `addToWishlist`, `removeFromWishlist`, `toggleWishlist`, `clearWishlist`, `isInWishlist`
- Exposes `useWishlist()` hook for consuming wishlist state

### In-App Notifications (`src/store/InAppNotificationProvider.tsx`)

- Uses **React Context** for state management
- Persists notifications to **MMKV** (`notification-storage`, key `notifications`)
- Provides methods: `addNotification`, `markAsRead`, `markAllAsRead`, `removeNotification`, `clearAll`
- Exposes `useInAppNotifications()` hook for consuming notification state
- Includes mock notification data seeded on first launch

## Navigation (`src/navigation/AppNavigator.tsx`)

Uses **React Navigation** with three navigator types:

### Root Stack Navigator
- Manages splash, onboarding, auth, and main flows
- Conditionally renders auth or main stack based on `isAuthenticated`
- Splash screen shows for 2 seconds on launch
- Onboarding shows on first launch (tracked via MMKV `app-storage` key `hasSeenOnboarding`)

### Auth Stack
- `SignIn` -> `SignUp` -> `ForgotPassword` -> `OTPVerification` -> `BiometricSetup`
- Headerless (`headerShown: false`)
- Slide-from-right animation

### Main Flow (Drawer > Tabs > Stack)

```
Drawer Navigator
└── Main (single drawer item)
    ├── Home Tab
    ├── Categories Tab
    ├── Cart Tab
    ├── Orders Tab
    └── Profile Tab
```

Additional stack screens accessible from the main flow (only rendered when authenticated):
- `ProductDetails`, `Search`, `Camera`, `ARViewer`, `Checkout`, `OrderDetails`, `OrderTracking`, `Wishlist`, `ProductReviews`, `NotificationCenter`, `AddressBook`, `PaymentMethods`, `ProductComparison`, `LanguageSelector`, `VisualSearch`, `Settings`

**Navigation Type Safety**: Param lists defined in `src/types/index.ts`
- `RootStackParamList`
- `AuthStackParamList`
- `MainTabParamList`

### Custom Navigation Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `TabBarIcon` | `components/navigation/TabBarIcon.tsx` | Renders emoji-based icons for tab bar |
| `CustomHeader` | `components/navigation/CustomHeader.tsx` | Custom header with back/menu/search/cart buttons |
| `DrawerContent` | `components/navigation/DrawerContent.tsx` | Custom drawer with user profile and menu items |

## Data Layer

### Server State Management (React Query)

- **QueryClient** configured with sensible defaults:
  - 3 retries for failed queries
  - 5-minute stale time
  - 10-minute garbage collection time
  - 1 retry for mutations
- Uses `@tanstack/react-query` for all server state
- Separated from client state (auth, theme, wishlist, notifications)

### Local Storage (MMKV)

MMKV instances used in the app:

| Instance | ID | Purpose |
|----------|-----|---------|
| Auth storage | `auth-storage` | Token, user data |
| Theme storage | `theme-storage` | Theme preferences |
| App storage | `app-storage` | Onboarding status (`hasSeenOnboarding`), app state |
| Wishlist storage | `wishlist-storage` | Wishlist items (`wishlist_items`) |
| Notification storage | `notification-storage` | In-app notifications (`notifications`) |
| Biometric storage | `biometric-storage` | Biometric enabled flag (`biometricEnabled`) |

MMKV is used instead of AsyncStorage for better performance.

## Data Models

All TypeScript types are defined in `src/types/index.ts`:

### Core Domain Models

| Model | Description |
|-------|-------------|
| `User` | User profile with preferences, addresses, payment methods |
| `Product` | Product with images, variants, inventory, ratings, SEO |
| `Category` | Product category with hierarchical support |
| `Brand` | Brand entity |
| `Cart` / `CartItem` | Shopping cart with subtotal, tax, shipping, discount |
| `Order` / `OrderItem` | Order with status, tracking, payment info |
| `Address` | Shipping/billing address |
| `PaymentMethod` | Payment method (card, PayPal, Apple Pay, Google Pay) |
| `Coupon` | Discount coupon with percentage/fixed types |
| `Review` | Product review with rating |
| `Notification` | Push notification data |
| `TrackingInfo` | Order tracking with events |

### API Models

| Model | Description |
|-------|-------------|
| `APIResponse<T>` | Standard API response wrapper |
| `PaginatedResponse<T>` | Paginated API response |
| `APIError` | Standardized error response |
| `SearchFilters` | Search/filter criteria |
| `SearchResult` | Search results with facets |

### Integration Models

| Model | Description |
|-------|-------------|
| `AIRecommendation` | AI-powered product recommendations |
| `VisualSearchResult` | Visual search results from camera |
| `ChatMessage` | AI chatbot messages |
| `AnalyticsEvent` | Analytics tracking event |
| `UserBehavior` | User behavior tracking |

## Screens

### Auth Screens (`src/screens/auth/`)

| Screen | Status | Description |
|--------|--------|-------------|
| `SignInScreen` | Fully implemented | Email/password + social login + phone login |
| `SignUpScreen` | Stub | Registration form placeholder |
| `ForgotPasswordScreen` | Stub | Password reset placeholder |
| `OTPVerificationScreen` | Stub | OTP verification placeholder |
| `BiometricSetupScreen` | Fully implemented | Biometric enrollment with toggle |

### Feature Screens

| Screen | Status | Description |
|--------|--------|-------------|
| `HomeScreen` | Fully implemented | Hero header, categories grid, featured/trending products |
| `OnboardingScreen` | Fully implemented | 4-slide carousel with animated dots |
| `SplashScreen` | Fully implemented | Animated logo with fade/scale |
| `CategoriesScreen` | Stub | Category browsing placeholder |
| `SearchScreen` | Stub | Product search placeholder |
| `ProductDetailsScreen` | Stub | Product details placeholder |
| `CameraScreen` | Stub | Barcode scanning placeholder |
| `ARViewerScreen` | Stub | AR product visualization placeholder |
| `CartScreen` | Stub | Shopping cart placeholder |
| `CheckoutScreen` | Stub | Checkout flow placeholder |
| `OrdersScreen` | Stub | Order history placeholder |
| `OrderDetailsScreen` | Stub | Order details placeholder |
| `OrderTrackingScreen` | Stub | Delivery tracking placeholder |
| `ProfileScreen` | Stub | User profile placeholder |
| `SettingsScreen` | Stub | App settings placeholder |

### Fully Implemented Additional Screens

| Screen | File | Description |
|--------|------|-------------|
| `WishlistScreen` | `src/screens/WishlistScreen.tsx` | Wishlist with grid layout, empty state, clear all |
| `ProductReviewsScreen` | `src/screens/ProductReviewsScreen.tsx` | Product reviews |
| `NotificationCenterScreen` | `src/screens/NotificationCenterScreen.tsx` | In-app notifications with filters |
| `AddressBookScreen` | `src/screens/profile/AddressBookScreen.tsx` | Address management |
| `PaymentMethodsScreen` | `src/screens/profile/PaymentMethodsScreen.tsx` | Payment method management |
| `ProductComparisonScreen` | `src/screens/ProductComparisonScreen.tsx` | Product comparison |
| `LanguageSelectorScreen` | `src/screens/profile/LanguageSelectorScreen.tsx` | Language selection |
| `VisualSearchScreen` | `src/screens/VisualSearchScreen.tsx` | Visual search |

## Styling

### Theme System

The app uses a custom theme system accessed via the `useTheme()` hook:

```typescript
const { colors, spacing, fonts, theme, themeMode, setThemeMode, isDark } = useTheme();
```

### Tailwind CSS

Tailwind is configured (`tailwind.config.js`) with custom color palette and NativeWind plugin, available for utility classes in components.

### Color Palette

| Color | Light | Dark |
|-------|-------|------|
| Primary | `#6366f1` | `#818cf8` |
| Secondary | `#a855f7` | `#c084fc` |
| Accent | `#ef4444` | `#f87171` |
| Background | `#ffffff` | `#111827` |
| Surface | `#f9fafb` | `#1f2937` |
| Text | `#111827` | `#f9fafb` |
| Text Secondary | `#6b7280` | `#d1d5db` |
| Text Tertiary | `#9ca3af` | `#9ca3af` |
| Border | `#e5e7eb` | `#374151` |
| Error | `#ef4444` | `#f87171` |
| Success | `#10b981` | `#34d399` |
| Warning | `#f59e0b` | `#fbbf24` |
| Info | `#3b82f6` | `#60a5fa` |

## Error Handling

### ErrorBoundary (`src/components/custom/ErrorBoundary.tsx`)

- Wraps the entire app at the root level
- Catches render errors and displays a fallback UI
- In development mode, shows detailed error information
- Provides retry functionality
- Logs errors with `console.error` for monitoring integration
- Uses default colors (not theme) to avoid context dependency issues

### ErrorBoundary HOCs and Hooks

- `withErrorBoundary()` - Higher-order component to wrap any screen
- `useErrorHandler()` - Hook for handling errors in functional components (returns `{ handleError }`)

## Alias Path Configuration

Path aliases are configured in both `tsconfig.json` and `metro.config.js`:

| Alias | Maps To |
|-------|---------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@screens/*` | `src/screens/*` |
| `@navigation/*` | `src/navigation/*` |
| `@store/*` | `src/store/*` |
| `@api/*` | `src/api/*` (not yet created) |
| `@hooks/*` | `src/hooks/*` (not yet created) |
| `@utils/*` | `src/utils/*` |
| `@types/*` | `src/types/*` |
| `@assets/*` | `src/assets/*` |
| `@styles/*` | `src/styles/*` |
| `@animations/*` | `src/animations/*` (not yet created) |

## Testing

### Test Infrastructure

| Framework | Purpose |
|-----------|---------|
| Jest | Unit and component testing |
| React Testing Library | Component testing utilities |
| Detox | End-to-end testing |
| @testing-library/jest-native | Native assertions for RTL |

No test files currently exist in the project.

## Monitoring

- Sentry integration planned via `sentry-expo` package
- ErrorBoundary logs errors for remote monitoring

## Future Considerations

The following features are in the type system but not yet fully implemented:

- **AI/ML Integration**: TensorFlow.js for visual search and recommendations
- **Backend API**: Supabase for data and authentication
- **Stripe Payments**: Payment processing with Stripe SDK
- **Maps**: Store locator and delivery tracking
- **Biometric Auth**: Using `react-native-biometrics` and `react-native-keychain` (currently uses mock implementation)
- **Storybook**: Component development environment
- **CI/CD**: EAS Build and GitHub Actions
