import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import COLORS from './colors';
import fontFamily from './fontFamily';
import CustomLucidIcons from './CustomLucidIcons';

interface Props {
  phoneNumber?: string;
  text?: string;
  containerStyle?: any;
  activeOpacity?: number;
}

const LoginHelp: React.FC<Props> = ({
  phoneNumber = '+91 8144778866',
  text = 'Need help with login? Call',
  containerStyle,
  activeOpacity = 0.7,
}) => {
  const handleHelpCall = useCallback(() => {
    Linking.openURL(`tel:${phoneNumber.replace(/\s/g, '')}`).catch(() => {
      Alert.alert('Error', 'Unable to make the call.');
    });
  }, [phoneNumber]);

  return (
    <View style={[styles.helpContainer, containerStyle]}>
      <Text style={styles.helpText}>{text}</Text>

      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={styles.phoneRow}
        onPress={handleHelpCall}>
        <CustomLucidIcons
          name="phone"
          color={COLORS.themeColor}
          size={18}
        />
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(LoginHelp);

const styles = StyleSheet.create({
  helpContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#888',
    fontFamily: fontFamily.Inter18Regular,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
  },
});