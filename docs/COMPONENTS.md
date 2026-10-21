# Component and Screen Library

Reference documentation for all UI components and application screens in ShopSphere.

## Navigation Components (`src/components/navigation/`)

### CustomHeader

Customizable header component used across stack screens.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Header title text |
| `onBackPress` | `() => void` | `undefined` | Callback for back button press |
| `onMenuPress` | `() => void` | `undefined` | Callback for menu button press |
| `onSearchPress` | `() => void` | `undefined` | Callback for search button press |
| `onCartPress` | `() => void` | `undefined` | Callback for cart button press |
| `showBack` | `boolean` | `false` | Show back button |
| `showMenu` | `boolean` | `false` | Show menu drawer toggle |
| `showSearch` | `boolean` | `false` | Show search icon |
| `showCart` | `boolean` | `false` | Show cart icon |
| `rightComponent` | `React.ReactNode` | `undefined` | Custom component in the right section |

**Usage:**

```tsx
<CustomHeader
  title="Product Details"
  onBackPress={() => navigation.goBack()}
  showBack={true}
/>

<CustomHeader
  title="ShopSphere"
  onMenuPress={() => navigation.openDrawer()}
  showMenu={true}
  showSearch={true}
  onSearchPress={() => navigation.navigate('Search')}
/>
```

---

### TabBarIcon

Renders emoji-based icons for bottom tab bar items.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `route` | `string` | Route name to determine icon |
| `focused` | `boolean` | Whether the tab is currently active |
| `color` | `string` | Icon color from theme |
| `size` | `number` | Icon size |

**Icons by route:**

| Route | Focused | Unfocused |
|-------|---------|-----------|
| Home | 🏠 | 🏡 |
| Categories | 📂 | 📁 |
| Cart | 🛒 | 🛍️ |
| Orders | 📦 | 📮 |
| Profile | 👤 | 👥 |

---

### DrawerContent

Custom drawer menu content with user profile header.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `navigation` | `any` | Navigation object from React Navigation |

**Menu Items:**

| Item | Icon | Screen |
|------|------|--------|
| Home | 🏠 | `Main` |
| Categories | 📂 | `Categories` |
| Orders | 📦 | `Orders` |
| Wishlist | ❤️ | `Wishlist` |
| Settings | ⚙️ | `Settings` |
| Help & Support | 💬 | `Support` |
| About | ℹ️ | `About` |

Includes a logout button at the bottom.

---

## Common Components (`src/components/common/`)

| Component | File | Description |
|-----------|------|-------------|
| CouponInput | CouponInput.tsx | Coupon code input component |
| EmptyState | EmptyState.tsx | Empty state display component |
| ErrorBoundary | ErrorBoundary.tsx | React error boundary that catches render errors and displays a fallback UI |
| FavoriteButton | FavoriteButton.tsx | Animated heart icon toggle for wishlist |
| FlashSaleCountdown | FlashSaleCountdown.tsx | Flash sale countdown timer |
| NotificationBadge | NotificationBadge.tsx | Notification badge component |
| PullToRefresh | PullToRefresh.tsx | Pull to refresh functionality |
| RecentlyViewed | RecentlyViewed.tsx | Recently viewed products section |
| ShareButton | ShareButton.tsx | Social sharing button |
| Skeleton | Skeleton.tsx | Loading skeleton component |
| StarRating | StarRating.tsx | Star rating display/input |
| VariantSelector | VariantSelector.tsx | Product variant selector |
| ZoomableImage | ZoomableImage.tsx | Zoomable image component |

### ErrorBoundary

React error boundary that catches render errors and displays a fallback UI.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components to render |
| `fallback` | `ReactNode` | `undefined` | Custom fallback UI |

**Exports:**

- `ErrorBoundary` - Component class
- `withErrorBoundary(Component, fallback?)` - HOC wrapper
- `useErrorHandler()` - Hook for imperative error handling

**Usage:**

```tsx
// As wrapper
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// As HOC
export default withErrorBoundary(MyScreen);

// As hook
const { handleError } = useErrorHandler();
```

---

## Notification Components (`src/components/notifications/`)

### NotificationProvider

Context provider that manages Expo push notifications.

**Exports:**

- `NotificationProvider` - Provider component
- `useNotifications()` - Hook to access notification methods
- `notificationHelpers` - Helper functions for common notification types

**Available Methods:**

| Method | Description |
|--------|-------------|
| `requestPermissions()` | Request push notification permissions |
| `scheduleNotification(notification)` | Schedule a local notification |
| `cancelNotification(id)` | Cancel a scheduled notification |
| `getBadgeCount()` | Get current app badge count |
| `setBadgeCount(count)` | Set app badge count |
| `clearBadgeCount()` | Reset badge count to 0 |
| `sendPushNotification(data)` | Send a push notification |

**Notification Helpers:**

| Helper | Description |
|--------|-------------|
| `orderConfirmation(orderId)` | Notify order confirmed (currently logs to console) |
| `orderShipped(orderId, trackingNumber)` | Notify order shipped (currently logs to console) |
| `orderDelivered(orderId)` | Notify order delivered (currently logs to console) |
| `promotionAlert(promotionId, title, description)` | Promotion notification (currently logs to console) |
| `priceDrop(productId, oldPrice, newPrice)` | Price drop alert (currently logs to console) |
| `backInStock(productId, productName)` | Back-in-stock notification (currently logs to console) |

---

## State Management

### AuthProvider (`src/store/AuthProvider.tsx`)

Provides authentication state and methods throughout the app.

**Context Value (`AuthContextType`):**

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `token` | `string \| null` | JWT access token |
| `refreshToken` | `string \| null` | Refresh token |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Loading state for async operations |

**Methods:**

| Method | Parameters | Description |
|--------|-----------|-------------|
| `login` | `LoginCredentials` | Login with email and password |
| `signup` | `SignupData` | Register a new account |
| `logout` | - | Clear auth state and log out |
| `socialLogin` | `'google' \| 'facebook' \| 'apple'` | Login with social provider |
| `phoneLogin` | `phone: string` | Send OTP to phone |
| `verifyOTP` | `phone: string, code: string` | Verify OTP code |
| `setupBiometric` | - | Set up biometric authentication |
| `updateProfile` | `Partial<User>` | Update user profile |
| `refreshAuthToken` | - | Refresh expired JWT token |

**Storage (MMKV `auth-storage`):**
- `token` - JWT token
- `refreshToken` - Refresh token
- `user` - Serialized user object

---

### ThemeProvider (`src/styles/ThemeProvider.tsx`)

Manages app theme (light, dark, system) with persistence.

**Context Value (`ThemeContextType`):**

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `Theme` | Current theme object |
| `themeMode` | `ThemeMode` | `'light' \| 'dark' \| 'system'` |
| `setThemeMode` | `(mode: ThemeMode) => void` | Change theme mode |
| `isDark` | `boolean` | Whether dark mode is active |
| `colors` | `Theme['colors']` | Color palette |
| `spacing` | `Theme['spacing']` | Spacing tokens |
| `fonts` | `Theme['fonts']` | Font families |

**Theme Colors:**

| Color Name | Light | Dark |
|-----------|-------|------|
| `primary` | `#6366f1` | `#818cf8` |
| `secondary` | `#a855f7` | `#c084fc` |
| `accent` | `#ef4444` | `#f87171` |
| `background` | `#ffffff` | `#111827` |
| `surface` | `#f9fafb` | `#1f2937` |
| `text` | `#111827` | `#f9fafb` |
| `textSecondary` | `#6b7280` | `#d1d5db` |
| `textTertiary` | `#9ca3af` | `#9ca3af` |
| `border` | `#e5e7eb` | `#374151` |
| `error` | `#ef4444` | `#f87171` |
| `success` | `#10b981` | `#34d399` |
| `warning` | `#f59e0b` | `#fbbf24` |
| `info` | `#3b82f6` | `#60a5fa` |

**Storage (MMKV `theme-storage`):**
- `themeMode` - Current theme mode

---

### WishlistProvider (`src/store/WishlistProvider.tsx`)

Manages wishlist state with persistence.

**Context Value (`WishlistContextType`):**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `Product[]` | Wishlist items |
| `isInWishlist` | `(productId: string) => boolean` | Check if product is in wishlist |
| `toggleWishlist` | `(product: Product) => void` | Toggle product in wishlist |
| `addToWishlist` | `(product: Product) => void` | Add product to wishlist |
| `removeFromWishlist` | `(productId: string) => void` | Remove product from wishlist |
| `clearWishlist` | `() => void` | Clear all wishlist items |
| `count` | `number` | Number of items in wishlist |

**Storage (MMKV `wishlist-storage`):**
- `wishlist_items` - Serialized wishlist items

---

### InAppNotificationProvider (`src/store/InAppNotificationProvider.tsx`)

Manages in-app notifications with persistence.

**Context Value (`NotificationContextType`):**

| Property | Type | Description |
|----------|------|-------------|
| `notifications` | `Notification[]` | In-app notifications |
| `unreadCount` | `number` | Number of unread notifications |
| `addNotification` | `(notification: Omit<Notification, 'id' \| 'timestamp' \| 'isRead'>) => void` | Add notification |
| `markAsRead` | `(id: string) => void` | Mark notification as read |
| `markAllAsRead` | `() => void` | Mark all notifications as read |
| `removeNotification` | `(id: string) => void` | Remove notification |
| `clearAll` | `() => void` | Clear all notifications |

**Storage (MMKV `notification-storage`):**
- `notifications` - Serialized notifications

---

## Screens

### Auth Flow

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `SignInScreen` | `src/screens/auth/SignInScreen.tsx` | Full | Email/password, social login (Google, Facebook, Apple), phone login, form validation |
| `SignUpScreen` | `src/screens/auth/SignUpScreen.tsx` | Stub | Registration screen placeholder |
| `ForgotPasswordScreen` | `src/screens/auth/ForgotPasswordScreen.tsx` | Stub | Password reset placeholder |
| `OTPVerificationScreen` | `src/screens/auth/OTPVerificationScreen.tsx` | Stub | Phone OTP verification placeholder |
| `BiometricSetupScreen` | `src/screens/auth/BiometricSetupScreen.tsx` | Full | Biometric authentication setup with toggle |

### Main App Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `SplashScreen` | `src/screens/SplashScreen.tsx` | Full | Animated splash with logo fade/scale |
| `OnboardingScreen` | `src/screens/OnboardingScreen.tsx` | Full | 4-slide carousel with animated page indicators |
| `HomeScreen` | `src/screens/HomeScreen.tsx` | Full | Hero header, categories grid, featured and trending product carousels with pull-to-refresh |
| `CategoriesScreen` | `src/screens/CategoriesScreen.tsx` | Stub | Category browsing placeholder |
| `SearchScreen` | `src/screens/SearchScreen.tsx` | Stub | Product search placeholder |

### Product Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `ProductDetailsScreen` | `src/screens/ProductDetailsScreen.tsx` | Stub | Product detail view placeholder |
| `CameraScreen` | `src/screens/CameraScreen.tsx` | Stub | Barcode scanning placeholder |
| `ARViewerScreen` | `src/screens/ARViewerScreen.tsx` | Stub | AR product visualization placeholder |
| `ProductReviewsScreen` | `src/screens/ProductReviewsScreen.tsx` | Full | Product reviews screen |

### Commerce Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `CartScreen` | `src/screens/cart/CartScreen.tsx` | Stub | Shopping cart placeholder |
| `CheckoutScreen` | `src/screens/checkout/CheckoutScreen.tsx` | Stub | Checkout flow placeholder |
| `WishlistScreen` | `src/screens/WishlistScreen.tsx` | Full | Wishlist with grid layout, empty state, clear all functionality |

### Order Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `OrdersScreen` | `src/screens/orders/OrdersScreen.tsx` | Stub | Order history placeholder |
| `OrderDetailsScreen` | `src/screens/orders/OrderDetailsScreen.tsx` | Stub | Order details placeholder |
| `OrderTrackingScreen` | `src/screens/orders/OrderTrackingScreen.tsx` | Stub | Delivery tracking placeholder |

### Profile Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `ProfileScreen` | `src/screens/profile/ProfileScreen.tsx` | Stub | User profile placeholder |
| `SettingsScreen` | `src/screens/profile/SettingsScreen.tsx` | Stub | App settings placeholder |
| `AddressBookScreen` | `src/screens/profile/AddressBookScreen.tsx` | Full | Address management |
| `PaymentMethodsScreen` | `src/screens/profile/PaymentMethodsScreen.tsx` | Full | Payment method management |
| `LanguageSelectorScreen` | `src/screens/profile/LanguageSelectorScreen.tsx` | Full | Language selection |

### Additional Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| `NotificationCenterScreen` | `src/screens/NotificationCenterScreen.tsx` | Full | In-app notifications with filters |
| `ProductComparisonScreen` | `src/screens/ProductComparisonScreen.tsx` | Full | Product comparison |
| `VisualSearchScreen` | `src/screens/VisualSearchScreen.tsx` | Full | Visual search |

---

## Navigation Structure

```
Root Stack
├── Splash (2s delay, no header)
├── Onboarding (first launch, no header)
├── Auth Stack (when not authenticated, no header)
│   ├── SignIn
│   ├── SignUp
│   ├── ForgotPassword
│   ├── OTPVerification
│   └── BiometricSetup
└── Main Drawer (when authenticated)
    └── Main (Tab Navigator)
        ├── Home
        ├── Categories
        ├── Cart
        ├── Orders
        └── Profile
    Plus: ProductDetails, Search, Camera, ARViewer, Checkout, OrderDetails, OrderTracking, Wishlist, ProductReviews, NotificationCenter, AddressBook, PaymentMethods, ProductComparison, LanguageSelector, VisualSearch, Settings
```

### Route Parameters

Defined in `src/types/index.ts`:

```typescript
// Root stack params
type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
  Profile: undefined;
  Settings: undefined;
  Search: undefined;
  Camera: undefined;
  ARViewer: undefined;
};

// Auth stack params
type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { phone: string };
  BiometricSetup: undefined;
};

// Main tab params
type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};
```

---

## Utility Modules

| Module | File | Description |
|--------|------|-------------|
| accessibility | src/utils/accessibility.ts | WCAG 2.1 helpers for accessibility |
