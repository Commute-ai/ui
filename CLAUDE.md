# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Commute.ai is a React Native mobile application built with Expo and TypeScript that provides intelligent commute planning. The app is currently at version 0.7.0 and uses Expo SDK 54.

## Development Commands

### Core Development

- `npm start` - Start Expo development server with cache cleared
- `npm run android` - Start development server for Android
- `npm run ios` - Start development server for iOS
- `npm run web` - Start development server for web

### Testing & Quality

- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint, TypeScript compiler, and Prettier checks
- `npm run format` - Format code with Prettier

### Building & Deployment

- `npm run prebuild` - Generate native code with Expo prebuild
- `npm run build:staging:android` - Build staging APK for Android
- `npm run build:production:android` - Build production APK for Android
- `npm run update:staging` - Deploy OTA update to staging
- `npm run update:production` - Deploy OTA update to production

## Architecture Overview

### File-based Routing

The app uses Expo Router for file-system based routing:

- `src/app/` - Route definitions
- `src/app/(tabs)/` - Tab navigation screens (index, routes, profile, settings)
- `src/app/_layout.tsx` - Root layout with authentication guards

### Authentication System

- **Context**: `AuthContext` provides global authentication state
- **Protected Routes**: Uses `Stack.Protected` to guard authenticated/unauthenticated routes
- **Token Storage**: Platform-specific secure storage (SecureStore on native, localStorage on web)
- **API Integration**: Automatic token injection via `ApiClient.setTokenProvider()`

### API Architecture

- **Centralized Client**: `ApiClient` class handles all HTTP communication with Zod validation
- **Modular Structure**: API endpoints organized in modules (e.g., `authApi`, routing API)
- **Error Handling**: Custom `ApiError` class with user-friendly messages and error codes
- **Configuration**: Environment-specific API URLs via `src/lib/config.ts`

### State Management

- **Global State**: React Context for authentication (`AuthContext`) and route search (`RouteSearchContext`)
- **Component State**: React hooks (`useState`) for local component state
- **Token Management**: Automatic token persistence and injection

### Styling System

- **NativeWind**: Tailwind CSS utilities via `className` prop
- **No StyleSheet.create**: All styling uses utility classes
- **Utilities**: `clsx`, `tailwind-merge`, and `class-variance-authority` for conditional classes
- **UI Components**: Reusable components in `src/components/ui/`

## Key Conventions

### Code Style

- TypeScript with strict type checking
- ESLint with React, React Native, and TypeScript plugins
- Prettier for code formatting
- No inline styles (enforced by ESLint)
- Comprehensive error handling with user-friendly messages

### Testing

- Jest with `@testing-library/react-native`
- Tests located in `src/__tests__/` with mirrored structure
- Mocking for API services and native modules
- `renderHook` for testing hooks and contexts

### File Organization

- `src/app/` - Expo Router pages
- `src/components/` - Reusable components
- `src/context/` - React contexts
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities and API clients
- `src/types/` - TypeScript type definitions

### Environment Configuration

- Development: Local API server (localhost:8000 or 10.0.2.2:8000)
- Staging: Internal distribution with APK builds
- Production: Production environment with APK builds
- Environment variables via `EXPO_PUBLIC_API_URL` and `APP_VARIANT`

## Core Features

### Authentication Flow

- Sign in/up with username and password
- JWT token-based authentication
- Automatic session persistence and restoration
- Platform-specific secure token storage

### Route Planning

- Place input with search functionality
- Itinerary generation and display
- Route search context for state management
- Integration with routing API

### User Management

- User preferences component
- Profile management
- Settings screen with preferences
