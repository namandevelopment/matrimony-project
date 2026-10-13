import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { NetworkProvider } from '../src/utils/NetworkProvider';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn().mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
    }),
    addEventListener: jest.fn(() => () => undefined),
  },
}));

test('shows InternetModal when offline', async () => {
  let component: renderer.ReactTestRenderer;

  await act(async () => {
    component = renderer.create(
      <NetworkProvider>
        <Text>App content</Text>
      </NetworkProvider>,
    );
    await Promise.resolve();
  });

  const textNodes = component!.root.findAllByType(Text);
  const hasOfflineMessage = textNodes.some(node =>
    String(node.props.children).includes('No Internet Connection'),
  );

  expect(hasOfflineMessage).toBe(true);
});
