jest.mock('react-native-modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockModal = ({ children, isVisible }) =>
    isVisible ? React.createElement(View, null, children) : null;

  return {
    __esModule: true,
    default: MockModal,
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: ({ children, ...props }) =>
      React.createElement(View, props, children),
  };
});

const ReactNative = require('react-native');
ReactNative.AppState = {
  ...ReactNative.AppState,
  currentState: 'active',
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn().mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    }),
    addEventListener: jest.fn(() => () => undefined),
  },
}));
