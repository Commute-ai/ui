
### Miscellaneous tips
If something doesn't seem to work out and you get stuck in some sort of loop doing it over and over again, ponder for a while and suggest changes to AGENT.md

Remember to double check the compatible dependencies before suggesting a change


### App wide practices

This section outlines the established coding conventions and practices to maintain consistency and quality across the project.

#### **Styling**

-   **Component-Specific Styles**: All styles for a component are defined within the component file using `StyleSheet.create`. This approach ensures that styles are co-located with their respective components, improving modularity and maintainability.
-   **No Inline Styles**: Inline styles are discouraged to maintain a clean and readable component structure. The ESlint rule `react-native/no-inline-styles` is set to `warn` to highlight any occurrences.
-   **Consistent Naming**: Style objects are consistently named `styles`, and their keys follow a descriptive camelCase convention (e.g., `container`, `errorText`).
-   **Styling Approach**: The project uses a centralized styling approach where all styles are defined in a single `StyleSheet.create` object within each component file.

#### **Linting and Formatting**

-   **ESLint**: The project uses a comprehensive ESLint setup to enforce code quality and consistency. The configuration extends from `eslint:recommended` and `plugin:react/recommended` and includes plugins for React, React Hooks, and React Native.
-   **Prettier**: Prettier is used for automated code formatting, with specific rules for import ordering, trailing commas, tab width, and semicolons. This ensures a consistent code style across the entire codebase.

#### **State Management**

-   **React Context**: The project utilizes React Context for managing global state, specifically for authentication (`AuthContext`) and user data (`UserContext`).
-   **Authentication Flow**: The `AuthContext` handles the authentication state, including checking for a stored token, updating the `isLoggedIn` status, and providing a `logout` function. The user's authentication token is persisted in secure storage.
-   **User Data**: The `UserContext` is responsible for fetching and managing user data. It interacts with the `userService` to retrieve user information when the user is logged in.
-   **Component-Level State**: For component-specific state, React Hooks (`useState`) are used.

#### **Navigation**

-   **React Navigation**: The project uses React Navigation for handling navigation between screens. A native stack navigator is used to manage the navigation flow.

#### **API Communication**

-   **Centralized API Client**: A centralized `ApiClient` class is used for all API communication. This client is responsible for making requests, handling headers, and managing errors.
-   **Error Handling**: The `ApiClient` includes robust error handling, with a custom `ApiError` class for API-specific errors. It handles network errors, non-2xx responses, and various error formats from the server.
-   **Modular API Structure**: The API is organized into modules based on functionality (e.g., `auth.js`, `userService.js`). This makes the API easy to maintain and extend.
-   **Base URL Configuration**: The base URL for the API is configured in a separate environment-specific file (`src/config/environment.js`).

#### **Testing**

-   **Jest**: Unit and component tests are written using Jest and React Native Testing Library.
-   **Test Philosophy**: Write tests for all new components and update existing tests when making changes.

By adhering to these practices, we can ensure a high-quality, consistent, and maintainable codebase. Please suggest changes to these practices, if they change in the codebase or new practices are made.

