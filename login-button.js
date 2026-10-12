import React from 'react';
import { Button } from 'react-native';

const LoginButton = ({ onPress }) => {
  return (
    <Button
      title="Login"
      onPress={onPress}
    />
  );
};

export default LoginButton;