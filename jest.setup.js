/* eslint-env jest */

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const Mock = props => React.createElement(View, props, props.children);

  return {
    __esModule: true,
    default: Mock,
    Marker: Mock,
    Polygon: Mock,
    Polyline: Mock,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('react-native-geolocation-service', () => ({
  __esModule: true,
  default: {
    requestAuthorization: jest.fn(async () => 'granted'),
    watchPosition: jest.fn(() => 1),
    clearWatch: jest.fn(),
  },
  requestAuthorization: jest.fn(async () => 'granted'),
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn(),
}));

