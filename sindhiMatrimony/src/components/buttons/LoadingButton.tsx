import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import COLORS from '../colors';
import fontFamily from '../fontFamily';

export interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean | (() => boolean) | any;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  activeOpacity?: number;
}

const LoadingButton = memo(
  ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
    loadingColor = '#FFFFFF',
    activeOpacity = 0.8,
  }: LoadingButtonProps) => {
    const isButtonLoading =
      typeof loading === 'function' ? Boolean(loading()) : Boolean(loading);

    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}
        disabled={disabled || isButtonLoading}
        activeOpacity={activeOpacity}
        accessibilityRole="button"
      >
        {isButtonLoading ? (
          <ActivityIndicator size="small" color={loadingColor} />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);

LoadingButton.displayName = 'LoadingButton';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.themeColor,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    letterSpacing: 0.5,
  },
});

export default LoadingButton;
