module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@shopify/flash-list|react-native-modal|react-native-animatable|react-native-toast-message|react-native-size-matters|@react-navigation|react-native-linear-gradient)/)',
  ],
};
