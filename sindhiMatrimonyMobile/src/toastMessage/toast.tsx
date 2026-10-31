import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import fontFamily from '../components/fontFamily';

// ======================================================
// 🎨 STATIC TOAST TYPES & STYLES (Zero Dynamic Allocations)
// ======================================================
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '90%',
    alignSelf: 'center',

    // Optimized elevation & shadow (Hardware accelerated)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  bgSuccess: {
    backgroundColor: '#4CAF50',
  },
  bgError: {
    backgroundColor: '#F44336',
  },
  bgWarning: {
    backgroundColor: '#FF9800',
  },
  bgInfo: {
    backgroundColor: '#2196F3',
  },

  message: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: fontFamily.Inter18Medium || fontFamily.Inter18Regular,
    includeFontPadding: false,
  },
});

const TYPE_STYLE_MAP = Object.freeze({
  success: styles.bgSuccess,
  error: styles.bgError,
  warning: styles.bgWarning,
  info: styles.bgInfo,
});

// ======================================================
// 🚀 MEMOIZED CUSTOM TOAST UI
// Uses GPU hardware layer caching to avoid raster recalculation
// ======================================================
interface CustomToastProps {
  text1?: string;
  text2?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  props?: {
    type?: 'success' | 'error' | 'warning' | 'info';
  };
}

const CustomToast = memo<CustomToastProps>(
  ({ text1, text2, type, props }) => {
    const toastType = type || props?.type || 'info';
    const message = text2 || text1 || '';
    const bgStyle = TYPE_STYLE_MAP[toastType] || styles.bgInfo;

    return (
      <View
        style={[styles.container, bgStyle]}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
      >
        <Text style={styles.message} numberOfLines={3} ellipsizeMode="tail">
          {message}
        </Text>
      </View>
    );
  },
  (prev, next) =>
    (prev.text2 || prev.text1) === (next.text2 || next.text1) &&
    (prev.type || prev.props?.type) === (next.type || next.props?.type),
);

// ======================================================
// 🚀 STATIC TOAST CONFIG
// ======================================================
export const toastConfig = Object.freeze({
  success: (props: any) => <CustomToast {...props} type="success" />,
  error: (props: any) => <CustomToast {...props} type="error" />,
  info: (props: any) => <CustomToast {...props} type="info" />,
  warning: (props: any) => <CustomToast {...props} type="warning" />,
});

// ======================================================
// 🚀 HIGH PERFORMANCE SHOW FUNCTION
// requestAnimationFrame prevents UI thread hitching & frame drops
// ======================================================
export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  position?: 'top' | 'bottom';
  duration?: number;
  topOffset?: number;
  bottomOffset?: number;
  onPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

let pendingRafId: number | null = null;

export const showToast = (
  optionsOrMessage: ToastOptions | string,
  typeFallback: 'success' | 'error' | 'warning' | 'info' = 'info',
) => {
  const config =
    typeof optionsOrMessage === 'string'
      ? { message: optionsOrMessage, type: typeFallback }
      : optionsOrMessage;

  if (!config || !config.message) return;

  const {
    type = 'info',
    message,
    position = 'bottom',
    duration = type === 'error' ? 3500 : 2500,
    topOffset = 50,
    bottomOffset = 25,
    onPress,
    onShow,
    onHide,
  } = config;

  // Cancel any pending unexecuted frame to avoid queue thrashing
  if (pendingRafId !== null) {
    cancelAnimationFrame(pendingRafId);
  }

  // Defer to the next frame to prevent colliding with active touch/click/navigation events
  pendingRafId = requestAnimationFrame(() => {
    pendingRafId = null;
    Toast.show({
      type,
      text2: message,
      position,
      visibilityTime: duration,
      autoHide: true,
      swipeable: true,
      topOffset,
      bottomOffset,
      onPress,
      onShow,
      onHide,
    });
  });
};

export const hideToast = () => {
  if (pendingRafId !== null) {
    cancelAnimationFrame(pendingRafId);
    pendingRafId = null;
  }
  Toast.hide();
};

// ======================================================
// 🚀 GLOBAL TOAST API
// ======================================================
export const toast = {
  show: (config: ToastOptions) => showToast(config),

  success: (message: string, options?: Partial<ToastOptions>) =>
    showToast({
      type: 'success',
      message,
      ...options,
    }),

  error: (message: string, options?: Partial<ToastOptions>) =>
    showToast({
      type: 'error',
      message,
      duration: 3500,
      ...options,
    }),

  info: (message: string, options?: Partial<ToastOptions>) =>
    showToast({
      type: 'info',
      message,
      ...options,
    }),

  warning: (message: string, options?: Partial<ToastOptions>) =>
    showToast({
      type: 'warning',
      message,
      ...options,
    }),

  hide: hideToast,
};

// ======================================================
// 🚀 MEMOIZED TOAST PROVIDER (Mount Once In App/Routes)
// ======================================================
export const ToastProvider = memo(() => {
  return (
    <Toast
      config={toastConfig}
      topOffset={50}
      bottomOffset={25}
    />
  );
});

export default toast;