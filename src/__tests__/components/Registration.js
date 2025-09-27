import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Registration from '../../../src/components/Registration'; // Adjusted path to component

// Mock the global alert function for tests
global.alert = jest.fn();

describe('Registration Component', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigation.navigate.mockClear();
    global.alert.mockClear();
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

  it('handles successful registration and navigates to Login', () => {
    const { getByPlaceholderText, getByText } = render(<Registration navigation={mockNavigation} />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    const registerButton = getByText('Register');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.press(registerButton);

    expect(global.alert).toHaveBeenCalledWith('Registration successful!');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  // We can add more specific tests for registration logic next.
});
