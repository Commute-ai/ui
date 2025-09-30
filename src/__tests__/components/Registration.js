import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native'; // Added waitFor
import Registration from '../../../src/components/Registration'; // Adjusted path to component
import { Alert } from 'react-native'; // Import Alert

// Mock react-native's Alert module
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Ensure NativeModules exists and add a stub for DevMenu
  if (!RN.NativeModules) {
    RN.NativeModules = {};
  }
  RN.NativeModules.DevMenu = {
    // You can add jest.fn() for any methods that DevMenu might be expected to have
    // e.g., addListener: jest.fn(), removeListeners: jest.fn(), show: jest.fn(), etc.
    // For now, an empty object might be sufficient to resolve the "could not be found" error.
  };
  RN.NativeModules.SettingsManager = {
    settings: {
      AppleLocale: 'en-US',
      AppleLanguages: ['en-US'],
    },
    getConstants: () => ({ settings: RN.NativeModules.SettingsManager.settings }),
    setValues: jest.fn(),
    deleteValues: jest.fn(),
  };

  return {
    ...RN, // Spread the modified actualReactNative
    Alert: {
      ...(RN.Alert || {}), // Ensure RN.Alert exists before spreading
      alert: jest.fn(), // This is the mock function we'll be checking
    },
    // If your tests or component rely on other react-native APIs that are not automatically mocked,
    // you might need to mock them here or ensure jest.requireActual covers them.
  };
});

// Mock global fetch
global.fetch = jest.fn(); // Mock fetch globally

describe('Registration Component', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigation.navigate.mockClear();
    Alert.alert.mockClear(); // Clear the mocked Alert.alert
    global.fetch.mockClear(); // Clear fetch mock history and calls
    // Ensure any specific mock implementations are reset if necessary
    // For example, if a test uses mockResolvedValueOnce, it's specific to that call.
    // If a default mock implementation was set, it might need resetting here.
    // global.fetch.mockImplementation(() => Promise.reject(new Error('default mock not implemented')));
  });

  it('renders create account title, input fields, and buttons', () => {
    const { getByText, getByPlaceholderText } = render(<Registration navigation={mockNavigation} />);

    expect(getByText('Create Account')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    expect(getByText('Back to Login')).toBeTruthy();
  });

  it('navigates to Login screen on "Back to Login" press', () => {
    const { getByText } = render(<Registration navigation={mockNavigation} />);

    fireEvent.press(getByText('Back to Login'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('handles successful registration and navigates to Login', async () => {
    // Setup mock for successful fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ message: 'Registration successful' })), // The component parses this
    });

    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Registration successful!');
    });
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('shows an alert if passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'differentPassword');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', "Passwords don't match!");
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows specific alert for invalid email format from API', async () => {
    const errorResponse = {
      detail: [{ msg: "This is not a valid email address, it must have an @-sign." }]
    };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify(errorResponse)),
    });

    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalidemail');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Registration Failed', "The email address you entered is not valid. Please ensure it includes an '@' symbol and a domain (e.g., user@example.com).");
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('shows a generic issue alert for string detail from API', async () => {
    const errorResponse = {
      detail: "Some specific error occurred on the server."
    };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify(errorResponse)),
    });

    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Registration Failed', "Registration failed due to an issue with the provided data. Please try again.");
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('shows an alert if API error response is not valid JSON', async () => {
    const rawErrorText = "Internal Server Error - Not JSON";
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve(rawErrorText),
    });

    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Registration Failed', 'Could not understand the server\'s error message. The raw response for our developers is: ' + rawErrorText);
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('shows an alert for network request failed', async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network request failed")); // Simulate fetch throwing an error

    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Registration Error', 'Could not connect to the server. Please check your network connection.');
    });
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

});
