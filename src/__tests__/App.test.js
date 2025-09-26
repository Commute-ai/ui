import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

describe('App', () => {
  it('renders the initial instruction text', () => {
    const { getByText } = render(<App />);
    expect(getByText('Open up App.js to start working on your app!')).toBeTruthy();
  });

  it('renders the custom text', () => {
    const { getByText } = render(<App />);
    expect(getByText('YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE COMMUUUTTEEE AAIIII')).toBeTruthy();
  });
});
