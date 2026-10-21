import React, { memo, useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// ======================================================
// 🎨 STATIC TOAST TYPES & STYLES (Zero Dynamic Allocations)
// ======================================================

// Inline CSS styles for hardware acceleration & zero dependency footprint
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderRadius: '12px',
    maxWidth: '90%',
    width: 'max-content',
    minWidth: '220px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    pointerEvents: 'auto',
    cursor: 'pointer',
    userSelect: 'none',
    boxSizing: 'border-box',
    transform: 'translateZ(0)', // Hardware layer promotion
    willChange: 'transform, opacity',
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
    fontSize: '14px',
    textAlign: 'center',
    lineHeight: '20px',
    fontWeight: 500,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    wordBreak: 'break-word',
    flex: 1,
  },
};

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
export interface CustomToastProps {
  text1?: string;
  text2?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  props?: {
    type?: 'success' | 'error' | 'warning' | 'info';
  };
  onPress?: () => void;
  onClose?: () => void;
}

export const CustomToast = memo<CustomToastProps>(
  ({ text1, text2, type, props, onPress, onClose }) => {
    const toastType = type || props?.type || 'info';
    const message = text2 || text1 || '';
    const bgStyle = TYPE_STYLE_MAP[toastType] || styles.bgInfo;

    const renderIcon = () => {
      switch (toastType) {
        case 'success':
          return <CheckCircle2 className="w-4 h-4 text-white shrink-0" />;
        case 'error':
          return <AlertCircle className="w-4 h-4 text-white shrink-0" />;
        case 'warning':
          return <AlertTriangle className="w-4 h-4 text-white shrink-0" />;
        case 'info':
        default:
          return <Info className="w-4 h-4 text-white shrink-0" />;
      }
    };

    return (
      <div
        style={{ ...styles.container, ...bgStyle }}
        onClick={onPress}
        role="alert"
        aria-live="polite"
      >
        {renderIcon()}
        <span style={styles.message}>
          {message}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white/80 hover:text-white transition-opacity p-0.5 rounded-full hover:bg-black/10 focus:outline-none ml-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
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
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type?: ToastType;
  message: string;
  position?: 'top' | 'bottom';
  duration?: number;
  topOffset?: number;
  bottomOffset?: number;
  onPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

export interface ActiveToastInternal extends ToastOptions {
  id: string;
  isVisible: boolean;
}

type ToastSubscriber = (toast: ActiveToastInternal | null) => void;
let globalSubscriber: ToastSubscriber | null = null;
let currentActiveToast: ActiveToastInternal | null = null;
let autoHideTimerId: any = null;
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

  // Clear previous autoHide timer
  if (autoHideTimerId !== null) {
    clearTimeout(autoHideTimerId);
    autoHideTimerId = null;
  }

  // Defer to the next frame to prevent colliding with active touch/click/navigation events
  pendingRafId = requestAnimationFrame(() => {
    pendingRafId = null;

    const toastData: ActiveToastInternal = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      position,
      duration,
      topOffset,
      bottomOffset,
      onPress,
      onShow,
      onHide,
      isVisible: true,
    };

    currentActiveToast = toastData;
    if (globalSubscriber) {
      globalSubscriber(toastData);
    }

    if (onShow) {
      try {
        onShow();
      } catch (err) {
        console.error('Toast onShow error:', err);
      }
    }

    // Schedule auto-hide
    autoHideTimerId = setTimeout(() => {
      hideToast();
    }, duration);
  });
};

export const hideToast = () => {
  if (pendingRafId !== null) {
    cancelAnimationFrame(pendingRafId);
    pendingRafId = null;
  }
  if (autoHideTimerId !== null) {
    clearTimeout(autoHideTimerId);
    autoHideTimerId = null;
  }

  if (currentActiveToast) {
    const onHideCb = currentActiveToast.onHide;
    currentActiveToast = null;
    if (globalSubscriber) {
      globalSubscriber(null);
    }
    if (onHideCb) {
      try {
        onHideCb();
      } catch (err) {
        console.error('Toast onHide error:', err);
      }
    }
  }
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
export interface ToastProviderProps {
  config?: Record<string, (props: any) => React.ReactNode>;
  topOffset?: number;
  bottomOffset?: number;
}

export const ToastProvider = memo<ToastProviderProps>(({
  config = toastConfig,
  topOffset = 50,
  bottomOffset = 25,
}) => {
  const [activeToast, setActiveToast] = useState<ActiveToastInternal | null>(null);

  useEffect(() => {
    globalSubscriber = (t) => {
      setActiveToast(t);
    };
    return () => {
      globalSubscriber = null;
    };
  }, []);

  if (!activeToast) return null;

  const resolvedTop = activeToast.topOffset ?? topOffset;
  const resolvedBottom = activeToast.bottomOffset ?? bottomOffset;
  const isTop = activeToast.position === 'top';

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 999999,
    ...(isTop ? { top: `${resolvedTop}px` } : { bottom: `${resolvedBottom}px` }),
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    pointerEvents: 'none',
  };

  const handlePress = () => {
    if (activeToast.onPress) {
      activeToast.onPress();
    }
    hideToast();
  };

  const renderComponent = () => {
    const toastType = activeToast.type || 'info';
    const Renderer = config[toastType] || config.info;

    if (Renderer) {
      return Renderer({
        text1: activeToast.message,
        text2: activeToast.message,
        type: toastType,
        props: { type: toastType },
        onPress: handlePress,
        onClose: hideToast,
      });
    }

    return (
      <CustomToast
        text1={activeToast.message}
        text2={activeToast.message}
        type={toastType}
        onPress={handlePress}
        onClose={hideToast}
      />
    );
  };

  return (
    <div style={containerStyle} aria-live="polite">
      {renderComponent()}
    </div>
  );
});

export default toast;
