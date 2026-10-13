import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastProvider } from '../utils/CustomToast';
import { navigationRef } from '../navigation/navigationService';
import { screens } from './screenConfig';
import { processPendingNotificationRedirect } from '../firebase';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

const defaultScreenOptions = {
  headerShown: false,
  animation: 'none' as const,
  gestureEnabled: true,
  freezeOnBlur: true,
  contentStyle: { backgroundColor: '#FFFFFF' },
};

const Routes = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <NavigationContainer
        ref={navigationRef}
        theme={navTheme}
        onReady={() => {
          processPendingNotificationRedirect();
        }}
      >
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={defaultScreenOptions}
        >
          {
            screens?.length > 0 && (
              <>
              {
                screens.map((screen: any) => (
                  <Stack.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                      lazy: true,
                      ...defaultScreenOptions,
                      ...screen.options,
                    }}
                  />
                ))
              }
              </>

            )}
        </Stack.Navigator>
      </NavigationContainer>

      <ToastProvider />
    </View>
  );
};

export default Routes;
