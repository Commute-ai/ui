# API Library Documentation

This directory contains the modular API client library for the Commute AI mobile application.

## Overview

The API library provides a clean, maintainable interface for all backend communication. It includes:

- **Environment Configuration**: Automatic backend URL selection based on build channel
- **API Client**: Centralized HTTP request handling with error management
- **Auth API**: Authentication-specific endpoints

## Architecture

```
src/
├── config/
│   └── environment.js      # Environment configuration based on EAS Update channel
├── api/
│   ├── client.js           # Core API client with HTTP methods
│   ├── auth.js             # Authentication API endpoints
│   └── index.js            # Module exports
```

## Usage

### Environment Configuration

The environment configuration automatically selects the appropriate backend URL based on the EAS Update channel:

```javascript
import config from './config/environment';

console.log(config.apiUrl); // Automatically set based on channel
```

**Channels:**
- `development`: Uses `http://localhost:8000/api/v1` (local development)
- `staging` or `preview`: Uses `https://backend.staging.commute.ai.ender.fi/api/v1`
- `production`: Uses `https://api.commute.ai/api/v1`
- No channel (default): Uses development URL

### API Client

The API client provides a clean interface for making HTTP requests:

```javascript
import { apiClient } from './api';

// GET request
const data = await apiClient.get('/users');

// POST request
const result = await apiClient.post('/users', { name: 'John' });

// PUT request
const updated = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE request
const deleted = await apiClient.delete('/users/1');
```

**Error Handling:**

The API client automatically converts server errors into user-friendly messages:

```javascript
try {
  await apiClient.post('/auth/register', { email, password });
} catch (error) {
  // error.message contains a user-friendly error message
  Alert.alert('Error', error.message);
}
```

### Authentication API

The auth API provides convenient methods for authentication:

```javascript
import { authApi } from './api';

// Register a new user
try {
  const response = await authApi.register(email, password);
  // Handle successful registration
} catch (error) {
  // Handle error
}

// Login
const response = await authApi.login(email, password);

// Logout
await authApi.logout();
```

### Component Integration Example

Here's how to use the API library in a component:

```javascript
import React from 'react';
import { Alert } from 'react-native';
import { authApi } from '../api';

export default function Registration({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleRegister = async () => {
    try {
      await authApi.register(email, password);
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  // ... rest of component
}
```

## Adding New API Endpoints

To add new API endpoints, create a new file in the `api` directory:

```javascript
// src/api/users.js
import apiClient from './client';

const usersApi = {
  async getProfile() {
    return apiClient.get('/users/profile');
  },

  async updateProfile(data) {
    return apiClient.put('/users/profile', data);
  },
};

export default usersApi;
```

Then export it from `src/api/index.js`:

```javascript
export { default as apiClient } from './client';
export { default as authApi } from './auth';
export { default as usersApi } from './users'; // Add new API
```

## Error Handling

The API client provides automatic error handling with user-friendly messages:

### Server Errors (4xx, 5xx)

The client parses server error responses and converts them to friendly messages:

- **Invalid email format**: "The email address you entered is not valid..."
- **Generic validation error**: "There was an issue with the information provided..."
- **Non-JSON error response**: Includes raw server response for debugging

### Network Errors

- **Network request failed**: "Could not connect to the server. Please check your network connection."

### Client Errors

- **Invalid JSON response**: "Received an invalid data format from the server."
- **Unexpected errors**: "An unexpected error occurred. Please try again."

All errors are logged to the console for debugging purposes.

## Testing

The API library includes comprehensive tests:

```bash
npm test
```

Tests cover:
- Environment configuration for all channels
- API client request methods (GET, POST, PUT, DELETE)
- Error handling scenarios
- Authentication API methods

## Configuration for Different Environments

### Local Development

When running locally with `expo start`, the app uses the development configuration (`http://localhost:8000/api/v1`).

### Staging Builds

When building for staging with:
```bash
npm run build:staging:android
```

The app uses the staging configuration defined in `eas.json` (channel: `staging`).

### Production Builds

When building for production with:
```bash
npm run build:production:android
```

The app uses the production configuration defined in `eas.json` (channel: `production`).

## Best Practices

1. **Always use the API library**: Don't make direct `fetch` calls. Use the API client for consistency.

2. **Handle errors properly**: Always wrap API calls in try-catch blocks and provide user feedback.

3. **Create domain-specific APIs**: Group related endpoints in separate files (e.g., `auth.js`, `users.js`).

4. **Keep the client generic**: The `client.js` should remain generic. Domain-specific logic goes in separate API files.

5. **Test your changes**: Add tests for new API endpoints to maintain code quality.

## Future Enhancements

Potential improvements for the API library:

- Add authentication token management
- Implement request/response interceptors
- Add request retry logic
- Implement request caching
- Add TypeScript types for better type safety
