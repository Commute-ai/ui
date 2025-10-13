### Miscellaneous tips

If something doesn't seem to work out and you get stuck in some sort of loop doing it over and over again, ponder for a while and suggest changes to AGENT.md

Remember to double check the compatible dependencies before suggesting a change

### App wide practices

This section outlines the established coding conventions and practices to maintain consistency and quality across the project.

#### **Styling**

- **NativeWind**: The project uses NativeWind for styling. This allows using Tailwind CSS utility classes directly on components via the `className` prop.
- **Utility-First Approach**: We follow a utility-first approach. Instead of writing custom CSS, we build complex components from a constrained set of primitive utilities.
- **No `StyleSheet.create`**: We avoid using `StyleSheet.create`. All styling should be done using `className`.
- **Merging and Conditional Classes**: `clsx` and `tailwind-merge` are available for conditionally applying and merging class names. `class-variance-authority` can be used for creating variants of components.

#### **Linting and Formatting**

- **ESLint**: The project uses a comprehensive ESLint setup to enforce code quality and consistency. The configuration (`.eslintrc.js`) extends from `eslint:recommended`, `plugin:react/recommended`, and `plugin:@typescript-eslint/recommended`.
- **Plugins**: It utilizes plugins for React (`react`), React Hooks (`react-hooks`), React Native (`react-native`), and TypeScript (`@typescript-eslint`).
- **Key Rules**:
    - `react-hooks/rules-of-hooks`: Enforces the rules of hooks (`error`).
    - `react-hooks/exhaustive-deps`: Warns about missing dependencies in `useEffect` and `useCallback` (`warn`).
    - `react-native/no-inline-styles`: Discourages inline styles (`warn`).
    - `@typescript-eslint/no-unused-vars`: Warns about unused variables (`warn`).
- **Prettier**: Prettier is used for automated code formatting to ensure a consistent code style across the entire codebase. The project includes a Prettier configuration file to define specific formatting rules.

#### **State Management**

- **React Context**: The project utilizes React Context for managing global state, specifically for authentication through `AuthContext` (`src/context/AuthContext.tsx`).
- **`AuthContext`**: This context is the single source of truth for authentication and user data. It handles:
    - **User State**: Storing the current user object and `isSignedIn` status.
    - **Session Management**: Providing `signIn`, `signUp`, and `signOut` methods.
    - **Token Persistence**: Automatically storing and retrieving the authentication token using `expo-secure-store` on native and `localStorage` on web.
    - **Data Fetching**: Initializing the user's session by fetching the user object from the API if a valid token is found.
- **Component-Level State**: For component-specific state, React Hooks (`useState`) are used.

#### **Navigation**

- **Expo Router**: The project uses Expo Router for file-system based routing. This allows for creating new routes by simply adding files to the `src/app` directory.
- **Stack Navigator**: The root layout (`src/app/_layout.tsx`) uses a `Stack` navigator from `expo-router` to manage the navigation hierarchy.
- **Protected Routes**: Authentication-aware routing is implemented using `Stack.Protected` to separate routes accessible only to authenticated or unauthenticated users.

#### **API Communication**

- **Centralized API Client**: A centralized `ApiClient` class (`src/lib/api/client.ts`) is used for all API communication. This client handles requests, headers, and errors. It's instantiated with a base URL from `@/lib/config`.
- **Modular API Structure**: The API is organized into modules. The main example is the `authApi` module (`src/lib/api/auth.ts`).
    - **`authApi` Module**: This module encapsulates all authentication-related endpoints:
        - `login(username, password)`: Authenticates a user using `application/x-www-form-urlencoded`.
        - `register(newUser)`: Creates a new user.
        - `logout(token)`: Logs out the user, requires an `Authorization` header.
        - `getCurrentUser(token)`: Fetches the current user's data, requires an `Authorization` header.
- **Zod Validation**: The client and API modules use `zod` for request and response schema validation (e.g., `AuthResponseSchema`, `UserSchema`). This ensures type safety. If validation fails, an `ApiError` is thrown.
- **Error Handling**: The `ApiClient` includes robust error handling:
    - Distinguishes between network errors and HTTP error responses.
    - Parses various error formats from the server, including FastAPI validation errors.
    - Throws a custom `ApiError` with a user-friendly message and an `ApiErrorCode`.
- **Authorization**: For protected endpoints, the API modules are responsible for adding the `Authorization: Bearer ${token}` header to requests.
- **Convenience Methods**: The base `apiClient` provides convenience methods (`get`, `post`, etc.) that are used by the API modules.

#### **Testing**

- **Frameworks**: The project uses Jest as the test runner and `@testing-library/react-native` for rendering components and hooks in a test environment.
- **Test Structure**: Test files are located in the `src/__tests__` directory, with a folder structure that mirrors the `src` directory. Test files use `*.tsx` extensions.
- **Mocking**: Dependencies such as API services (`@/lib/api/auth`) and native modules (`expo-secure-store`) are mocked using `jest.mock` to isolate tests and control their behavior.
- **Hook and Context Testing**: Hooks and Contexts are tested using the `renderHook` utility from `@testing-library/react-native`, often in conjunction with a wrapper component (like `AuthProvider`).
- **Component Testing**: Components are tested using `render` to mount them and `fireEvent` to simulate user interactions. Assertions are made about the component's output using `waitFor` to handle asynchronous updates.
- **Asynchronous Code**: Asynchronous operations are tested using `async/await`, and the `waitFor` and `act` utilities are used to manage state updates and side effects.

By adhering to these practices, we can ensure a high-quality, consistent, and maintainable codebase. Please suggest changes to these practices, if they change in the codebase or new practices are made.
