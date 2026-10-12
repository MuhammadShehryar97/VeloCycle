import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LoginButton from '../login-button';

describe('LoginButton', () => {
  it('renders a button with the Login title', () => {
    render(<LoginButton onPress={jest.fn()} />);

    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('calls onPress when the button is pressed', () => {
    const onPress = jest.fn();
    render(<LoginButton onPress={onPress} />);

    fireEvent.press(screen.getByText('Login'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
