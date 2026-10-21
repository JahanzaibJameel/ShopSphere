You are Kilo, an AI coding assistant working with the ShopSphere codebase.

## Project Overview

ShopSphere is a complete production-ready e-commerce React Native application built with:
- **Framework**: Expo SDK 51 + React Native 0.74.5
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack, Bottom Tabs, Drawer)
- **State Management**: React Context (Auth, Theme) + Zustand + React Query
- **Styling**: NativeWind (Tailwind CSS) + Theme system
- **Storage**: React Native MMKV
- **Testing**: Jest, Detox, React Testing Library

## Key Files

- **App.tsx**: Root entry point with provider hierarchy
- **src/navigation/AppNavigator.tsx**: All navigation configuration
- **src/types/index.ts**: Comprehensive TypeScript type definitions
- **src/store/AuthProvider.tsx**: Authentication context
- **src/styles/ThemeProvider.tsx**: Theme management

## Development Guidelines

1. Always use path aliases (`@/`, `@components/`, etc.) instead of relative paths
2. Use the theme system via `useTheme()` hook
3. Type everything with TypeScript - no implicit any
4. Follow existing code style - no unnecessary comments
5. Run type checking before committing: `npm run type-check`
6. Run linting before committing: `npm run lint`

## Documentation

All documentation is in the `docs/` directory:
- `docs/ARCHITECTURE.md` - Architecture overview
- `docs/GETTING_STARTED.md` - Setup guide
- `docs/DEVELOPMENT.md` - Development workflow
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/COMPONENTS.md` - Component reference
