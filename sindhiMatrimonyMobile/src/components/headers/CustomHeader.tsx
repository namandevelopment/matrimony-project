import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  StatusBar,
  StatusBarStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../colors';
import fontFamily from '../fontFamily';
import CustomLucidIcons from '../CustomLucidIcons';

export interface CustomHeaderProps {
  /** Main title text */
  title?: string;

  /** Badge or indicator beside title */
  titleBadge?: React.ReactNode;

  /** Whether to show the back button */
  showBack?: boolean;

  /** Custom back icon name */
  backIcon?: string;

  /** Color of the back icon */
  backIconColor?: string;

  /** Size of the back icon */
  backIconSize?: number;

  /** Custom back button handler */
  onBackPress?: (navigation?: any) => void;

  /** Shorthand for onBackPress */
  onPress?: (navigation?: any) => void;

  /** Additional style for outer header */
  style?: StyleProp<ViewStyle>;

  /** Alias for style */
  containerStyle?: StyleProp<ViewStyle>;

  /** Style for inner header row */
  headerRowStyle?: StyleProp<ViewStyle>;

  /** Style for title */
  titleStyle?: StyleProp<TextStyle>;

  /** Title color */
  titleColor?: string;

  /** Header background color */
  backgroundColor?: string;

  /** Back button style */
  backButtonStyle?: StyleProp<ViewStyle>;

  /** Disable back button */
  disabled?: boolean;

  /** Show bottom border */
  showBottomBorder?: boolean;

  /** Alias for showBottomBorder */
  showBorderBottom?: boolean;

  /** Border color */
  borderBottomColor?: string;

  /** Border width */
  borderBottomWidth?: number;

  /** Center title */
  centerTitle?: boolean;

  /** Right-side component */
  rightComponent?: React.ReactNode;

  /** StatusBar background color */
  statusBarColor?: string;

  /** StatusBar style */
  statusBarStyle?: StatusBarStyle;

  /** Whether to render StatusBar */
  showStatusBar?: boolean;

  /** Children */
  children?: React.ReactNode;
}

const CustomHeader = ({
  title = '',
  titleBadge,
  showBack = true,
  backIcon = 'arrow-left',
  backIconColor,
  backIconSize = 24,
  onBackPress,
  onPress,
  style,
  containerStyle,
  headerRowStyle,
  titleStyle,
  titleColor,
  backgroundColor,
  backButtonStyle,
  disabled = false,
  showBottomBorder,
  showBorderBottom,
  borderBottomColor = '#E9E9E9',
  borderBottomWidth = 1,
  centerTitle = false,
  rightComponent,
  statusBarColor,
  statusBarStyle,
  showStatusBar,
  children,
}: CustomHeaderProps) => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (disabled) {
      return;
    }

    if (onPress) {
      onPress(navigation);
      return;
    }

    if (onBackPress) {
      onBackPress(navigation);
      return;
    }

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      try {
        navigation.navigate('Home');
      } catch {
        console.warn('CustomHeader: Cannot go back');
      }
    }
  };

  const isDarkBg = Boolean(
    backgroundColor &&
      backgroundColor !== 'transparent' &&
      backgroundColor !== '#FFFFFF' &&
      backgroundColor !== '#FFF'
  );

  const isBorderVisible =
    showBottomBorder !== undefined
      ? showBottomBorder
      : showBorderBottom !== undefined
        ? showBorderBottom
        : !isDarkBg &&
        (!backgroundColor ||
          backgroundColor === 'transparent' ||
          backgroundColor === '#FFFFFF');

  const resolvedBackIconColor =
    backIconColor ||
    (titleColor === '#FFFFFF' || titleColor === '#FFF' || isDarkBg
      ? '#FFFFFF'
      : '#1A1A1A');

  const resolvedTitleColor =
    titleColor || (isDarkBg ? '#FFFFFF' : COLORS.headerTitle || '#1A1A1A');

  const resolvedStatusBarColor = statusBarColor || backgroundColor || '#FFFFFF';

  const shouldRenderStatusBar =
    showStatusBar !== undefined
      ? showStatusBar
      : Boolean(statusBarColor || statusBarStyle || backgroundColor);

  return (
    <View
      style={[
        styles.header,
        backgroundColor ? { backgroundColor } : null,
        isBorderVisible && {
          borderBottomWidth,
          borderBottomColor,
        },
        style,
        containerStyle,
      ]}
    >
      {shouldRenderStatusBar && (
        <StatusBar
          backgroundColor={resolvedStatusBarColor}
          barStyle={
            statusBarStyle ||
            (isDarkBg ? 'light-content' : 'dark-content')
          }
        />
      )}

      <View
        style={[
          styles.headerRow,
          centerTitle && styles.centerRow,
          headerRowStyle,
        ]}
      >
        {showBack ? (
          <TouchableOpacity
            disabled={disabled}
            style={[styles.backButton, backButtonStyle]}
            onPress={handleBack}
            hitSlop={{
              top: 12,
              bottom: 12,
              left: 12,
              right: 12,
            }}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <CustomLucidIcons
              name={backIcon}
              color={resolvedBackIconColor}
              size={backIconSize}
            />
          </TouchableOpacity>
        ) : centerTitle ? (
          <View style={styles.placeholderBack} />
        ) : null}

        <View
          style={[
            styles.titleContainer,
            centerTitle && styles.centerTitleContainer,
          ]}
        >
          <View style={styles.titleRow}>
            {title ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.title,
                  { color: resolvedTitleColor },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            ) : null}
            {titleBadge}
          </View>

          {children}
        </View>

        {rightComponent ? (
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        ) : centerTitle && showBack ? (
          <View style={styles.placeholderBack} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  centerRow: {
    justifyContent: 'space-between',
  },

  backButton: {
    padding: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderBack: {
    width: 32,
    marginRight: 12,
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerTitleContainer: {
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    color: COLORS.headerTitle || '#1A1A1A',
    fontFamily: fontFamily.Inter18SemiBold,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default CustomHeader;