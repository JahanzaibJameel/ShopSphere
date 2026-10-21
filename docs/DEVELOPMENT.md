# Development Guide

Coding standards, conventions, and best practices for contributing to ShopSphere.

## Coding Standards

### TypeScript

- **Strict mode is enabled** (`tsconfig.json`)
- Use `interface` for object shapes and types
- Use `type` for unions and complex type aliases
- Always specify return types on functions
- Use `React.FC` sparingly — prefer explicit props typing
- Use `as const` for string literal unions where appropriate
- `noUnusedLocals` is disabled

#### Example: Component Typing

```typescript
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

### ESLint

The project uses `eslint-config-expo` with additional plugins:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix

# Type checking
npm run type-check
```

**Rules enforced**:
- React Hooks rules (`eslint-plugin-react-hooks`)
- React best practices (`eslint-plugin-react`)
- TypeScript-aware linting (`@typescript-eslint`)

### Import Ordering

Use path aliases consistently:

```typescript
// 1. External libraries first
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

// 2. Internal aliases
import { Product } from '@/types';

// 3. Relative imports last (if needed)
```

## Component Guidelines

### Functional Components

Use arrow function components with named exports:

```typescript
export function ProductCard({ product }: { product: Product }) {
  // component body
}
```

### Styling

Use the `useTheme()` hook for all colors and theme values:

```typescript
const { colors } = useTheme();

<View style={[styles.container, { backgroundColor: colors.background }]}>
```

Define styles with `StyleSheet.create()` outside the component:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### Component Structure

1. Imports
2. Props interface
3. Component definition
4. Styles
5. Hooks and utilities at the end

### Error Boundaries

Wrap critical components with `ErrorBoundary` or the `withErrorBoundary` HOC:

```typescript
import { withErrorBoundary } from '@/components/custom/ErrorBoundary';

export default withErrorBoundary(MyScreen);
```

### State Management Decisions

| State Type | Use |
|------------|-----|
| Local UI state (toggles, inputs) | `useState` |
| Async server data | `@tanstack/react-query` |
| Auth state | `@/store/AuthProvider` (React Context + MMKV) |
| Theme state | `@/styles/ThemeProvider` (React Context + MMKV) |
| Wishlist state | `@/store/WishlistProvider` (React Context + MMKV) |
| Notifications state | `@/store/InAppNotificationProvider` (React Context + MMKV) |

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Components | `PascalCase` (e.g., `ProductCard`) |
| Hooks | `camelCase` prefixed with `use` (e.g., `useTheme`) |
| Constants | `UPPER_SNAKE_CASE` (e.g., `STORAGE_KEYS`) |
| Files | Match component name (e.g., `ProductCard.tsx`) |
| Props | `PascalCase` + `Props` suffix (e.g., `ProductCardProps`) |
| Screens | `*Screen` suffix (e.g., `HomeScreen.tsx`) |
| Context | `*Context` suffix (e.g., `AuthContext`) |

## File Structure Conventions

```
src/
├── components/
│   ├── common/          # Reusable generic components
│   ├── navigation/      # Navigation-specific components
│   ├── notifications/   # Notification system
│   └── custom/          # Custom components
│
├── screens/             # One file per screen
│   ├── auth/            # Auth flow screens
│   ├── cart/            # Cart screens
│   ├── checkout/        # Checkout flow screens
│   ├── orders/          # Order screens
│   ├── profile/         # Profile and settings screens
│   └── [screen].tsx     # Root-level screens
│
├── store/               # State management providers
├── styles/              # Theme and style configuration
├── types/               # All TypeScript types
├── utils/               # Utility functions
└── navigation/          # Navigation configuration
```

## Adding a New Screen

1. Create the screen file in the appropriate `screens/` subdirectory
2. Add it to the navigation configuration in `src/navigation/AppNavigator.tsx`
3. Define any route params in `src/types/index.ts`
4. Export the screen component

Example:

```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

export function NewScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        New Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
```

## Adding a New Component

1. Create the component file in `src/components/`
2. Define a props interface
3. Use `useTheme()` for styling
4. Export the component

## Adding New Types

Add all type definitions to `src/types/index.ts`. Group related types together.

## Testing

### Unit Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Start the app first
npm start

# Run Detox tests
npm run test:e2e
```

### Testing Best Practices

- Test component behavior, not implementation details
- Use `@testing-library/react-native` for rendering
- Mock external dependencies (API calls, MMKV)
- Write tests for: user flows, edge cases, error states

## Debugging

### React DevTools

Install the [React DevTools](https://react-devtools.dev/) browser extension or standalone app.

### Console Logging

The project uses `__DEV__` for development-only logging:

```typescript
if (__DEV__) {
  console.log('Debug info:', someValue);
}
```

### Error Boundaries

Use the error boundary to catch and log render errors:

```typescript
// In component
import { useErrorHandler } from '@/components/custom/ErrorBoundary';

const { handleError } = useErrorHandler();

try {
  // risky operation
} catch (error) {
  handleError(error);
}
```

## Git Workflow

### Branch Naming

| Type | Format |
|------|--------|
| Feature | `feature/JIRA-123-short-description` |
| Bug fix | `fix/JIRA-123-short-description` |
| Hotfix | `hotfix/JIRA-123-short-description` |
| Refactor | `refactor/short-description` |

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add phone login with OTP verification
fix(cart): resolve coupon discount calculation bug
chore(deps): update React Navigation to v7
```

### Pull Requests

1. Create a feature branch
2. Make your changes
3. Run all checks: `npm run lint && npm run type-check && npm test`
4. Create a PR with a clear description
5. Link any relevant issues

## Performance Optimization

- Use `React.memo` for components with expensive renders
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders
- Use `FlatList` instead of `ScrollView` for long lists
- Use `@shopify/flash-list` for very large lists
- Use `useCallback` for navigation handlers

## Security

- Never store secrets in source code
- Use `expo-secure-store` for sensitive data (though currently using MMKV)
- Validate all user input
- Use HTTPS for all API calls
- Implement proper error handling to avoid leaking internals
