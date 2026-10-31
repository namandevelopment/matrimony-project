import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IMAGES } from './images';

const AuthImage = () => {
  return (
    <Image
      source={IMAGES.loginMobile}
      style={{
        height: 150,
        width: 150,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginBottom: 15,
      }}
    />
  );
};

export default AuthImage;

const styles = StyleSheet.create({});
