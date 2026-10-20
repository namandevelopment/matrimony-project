import React, { memo, ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  AccessibilityRole,
} from 'react-native';
import COLORS from '../colors';
import fontFamily from '../fontFamily';
import CustomLucidIcons from '../CustomLucidIcons';

export interface LoadingButtonProps {
  title?: string;
  onPress?: () => void;
  loading?: boolean | (() => boolean) | any;
  disabled?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  loadingColor?: string;
  activeOpacity?: number;
  rightIcon?: string | ReactNode;
  leftIcon?: string | ReactNode;
  iconColor?: string;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  children?: ReactNode;
}

const LoadingButton = memo(
  ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'solid',
    style,
    textStyle,
    innerStyle,
    loadingColor,
    activeOpacity = 0.8,
    rightIcon,
    leftIcon,
    iconColor,
    iconSize = 16,
    iconStyle,
    accessibilityLabel,
    accessibilityRole = 'button',
    children,
  }: LoadingButtonProps) => {
    const isButtonLoading =
      typeof loading === 'function' ? Boolean(loading()) : Boolean(loading);

    const defaultLoadingColor =
      loadingColor ||
      (variant === 'outline' || variant === 'ghost'
        ? COLORS.themeColor
        : '#FFFFFF');

    const defaultIconColor =
      iconColor ||
      (variant === 'outline' || variant === 'ghost'
        ? COLORS.themeColor
        : '#FFFFFF');

    const getBaseButtonStyle = () => {
      switch (variant) {
        case 'outline':
          return styles.outlineButton;
        case 'ghost':
          return styles.ghostButton;
        case 'solid':
        default:
          return styles.button;
      }
    };

    const renderLeftIcon = () => {
      if (!leftIcon) return null;
      if (React.isValidElement(leftIcon)) return leftIcon;
      if (typeof leftIcon === 'string') {
        return (
          <CustomLucidIcons
            name={leftIcon}
            size={iconSize}
            color={defaultIconColor}
            style={[styles.defaultLeftIcon, iconStyle]}
          />
        );
      }
      return null;
    };

    const renderRightIcon = () => {
      if (!rightIcon) return null;
      if (React.isValidElement(rightIcon)) return rightIcon;
      if (typeof rightIcon === 'string') {
        return (
          <CustomLucidIcons
            name={rightIcon}
            size={iconSize}
            color={defaultIconColor}
            style={[styles.defaultRightIcon, iconStyle]}
          />
        );
      }
      return null;
    };

    return (
      <TouchableOpacity
        style={[
          getBaseButtonStyle(),
          disabled && styles.buttonDisabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || isButtonLoading}
        activeOpacity={activeOpacity}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel || title}
      >
        {isButtonLoading ? (
          <ActivityIndicator size="small" color={defaultLoadingColor} />
        ) : children ? (
          children
        ) : (
          <View style={[styles.innerContent, innerStyle]}>
            {renderLeftIcon()}
            {title ? (
              <Text
                style={[
                  styles.buttonText,
                  variant === 'outline' && styles.outlineButtonText,
                  variant === 'ghost' && styles.ghostButtonText,
                  textStyle,
                ]}
              >
                {title}
              </Text>
            ) : null}
            {renderRightIcon()}
          </View>
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
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: COLORS.themeColor,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    letterSpacing: 0.5,
  },
  outlineButtonText: {
    color: COLORS.themeColor,
  },
  ghostButtonText: {
    color: COLORS.themeColor,
  },
  defaultLeftIcon: {
    marginRight: 6,
  },
  defaultRightIcon: {
    marginLeft: 6,
  },
});

export default LoadingButton;
