import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import COLORS from '../../components/colors';
import { IMAGES } from '../../components/images';
import { reset } from '../../navigation/navigationService';
import { processPendingNotificationRedirect } from '../../firebase';
import { Storage } from '../../storage/Storage';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      // 1. If notification was tapped, redirect to destination
      const hasNotificationRedirect = await processPendingNotificationRedirect();
      if (hasNotificationRedirect) {
        return;
      }

      // 2. Normal Auth Routing
      const token =
        Storage.getItemSync<string>('token') ||
        Storage.getItemSync<string>('accessToken') ||
        Storage.getItemSync<string>('user');

      if (token) {
        reset('BottomTab');
      } else {
        reset('LoginScreen');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <ImageBackground
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        imageStyle={{ resizeMode: 'cover', opacity: 0.5 }}
        source={IMAGES.splashscreen}
      ></ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
