/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setupBackgroundMessageHandler, setupNotifeeBackgroundHandler } from './src/firebase';

// Register background handlers early for headless JS workers
setupBackgroundMessageHandler();
setupNotifeeBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
