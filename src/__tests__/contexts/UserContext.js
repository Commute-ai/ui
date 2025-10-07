import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { UserProvider, UserContext } from '../../contexts/UserContext';
import { AuthContext } from '../../contexts/AuthContext';
import { userService } from '../../api';
import { ApiError } from '../../api/client';

jest.mock('../../config/environment', () => ({
  __esModule: true,
  default: {
    apiUrl: 'http://dummy.api.url',
  },
}));
jest.mock('../../api');

describe('UserContext', () => {
  beforeEach(() => {
    userService.getMe.mockClear();
  });

  it('fetches user successfully', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    userService.getMe.mockResolvedValue(mockUser);

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(UserContext);
      return null;
    };

    render(
      <AuthContext.Provider
        value={{ isLoggedIn: true, token: 'fake-token', logout: jest.fn() }}
      >
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(contextValue.user).toEqual(mockUser);
      expect(contextValue.error).toBeNull();
      expect(contextValue.isLoading).toBe(false);
    });
  });

  it('handles 401 error when fetching user', async () => {
    const mockLogout = jest.fn();
    const errorMessage = 'Authentication failed. Please check your credentials.';

    userService.getMe.mockRejectedValue(
      new ApiError(errorMessage, 'UNAUTHORIZED', 401)
    );

    let contextValue;

    const TestComponent = () => {
      contextValue = React.useContext(UserContext);
      return null;
    };

    render(
      <AuthContext.Provider
        value={{ isLoggedIn: true, token: 'fake-token', logout: mockLogout }}
      >
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(contextValue.error).toBe(errorMessage);
      expect(contextValue.user).toBeNull();
      expect(mockLogout).not.toHaveBeenCalled();
    });
  });

  it('handles generic error when fetching user', async () => {
    const errorMessage = 'Something went wrong.';
    userService.getMe.mockRejectedValue(new Error(errorMessage));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(UserContext);
      return null;
    };

    render(
      <AuthContext.Provider
        value={{ isLoggedIn: true, token: 'fake-token', logout: jest.fn() }}
      >
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(contextValue.error).toBe(errorMessage);
      expect(contextValue.user).toBeNull();
      expect(contextValue.isLoading).toBe(false);
    });
  });

  it('does not fetch user if not logged in', async () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(UserContext);
      return null;
    };

    render(
      <AuthContext.Provider
        value={{ isLoggedIn: false, token: null, logout: jest.fn() }}
      >
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(userService.getMe).not.toHaveBeenCalled();
      expect(contextValue.user).toBeNull();
      expect(contextValue.isLoading).toBe(false);
      expect(contextValue.error).toBeNull();
    });
  });

  it('manages isLoading state correctly', async () => {
    userService.getMe.mockReturnValue(new Promise(() => {}));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(UserContext);
      return null;
    };

    render(
      <AuthContext.Provider
        value={{ isLoggedIn: true, token: 'fake-token', logout: jest.fn() }}
      >
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(contextValue.isLoading).toBe(true);
    });
  });
});
