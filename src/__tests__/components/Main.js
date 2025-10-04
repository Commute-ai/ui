import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Main from '../../components/Main';
import storage from '../../utils/storage';

jest.mock('../../config/environment', () => ({
  __esModule: true,
  default: {
    apiUrl: 'http://dummy.api.url',
  },
}));

jest.mock('../../utils/storage', () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
}));

describe('Main component', () => {
  it('should allow a user to log out', async () => {
    // Mock that user is logged in
    storage.getToken.mockResolvedValue('fake-token');

    const { getByText, queryByText } = render(<Main />);

    // Wait for the component to finish loading and check for login status
    await waitFor(() => {
      expect(getByText('You are logged in!')).toBeTruthy();
    });

    // Find and press the logout button
    const logoutButton = getByText('Logout');
    fireEvent.press(logoutButton);

    // After pressing logout
    await waitFor(() => {
      // Check that token is removed
      expect(storage.removeToken).toHaveBeenCalledTimes(1);
    });

    // Check that the UI updates to show logged-out state
    await waitFor(() => {
      expect(queryByText('You are logged in!')).toBeNull();
      expect(getByText('You are not logged in.')).toBeTruthy();
    });
  });
});
