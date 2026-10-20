import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Routes from './src/routes/Routes';
import { NetworkProvider } from './src/utils/NetworkProvider';
import { fcmService, processPendingNotificationRedirect } from './src/firebase';
import { GlobalAlertModal } from './src/customModals/GlobalAlertModal';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

const RootContent = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <NetworkProvider>

        <Routes />
        <GlobalAlertModal />

      </NetworkProvider>
    </SafeAreaView>
  );
};

function App() {
  useEffect(() => {
    // Initialize Firebase FCM & Notifee channels & listeners
    fcmService.initialize();

    // Check and process any pending notification redirects
    processPendingNotificationRedirect();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
