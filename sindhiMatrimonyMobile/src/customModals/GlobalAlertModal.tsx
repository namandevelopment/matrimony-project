import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';
import CustomLucidIcons from '../components/CustomLucidIcons';

// ─── Type Definitions ─────────────────────────────────────────────────────────

export type AlertModalVariant = 'info' | 'success' | 'warning' | 'danger' | 'default';

export interface AlertModalButton {
  text: string;
  onPress?: () => any | Promise<any>;
  style?: 'default' | 'cancel' | 'destructive' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}

export interface AlertModalProps {
  visible: boolean;
  onClose?: () => void;

  // Header & Copy
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  variant?: AlertModalVariant;

  // Custom Icon overrides
  iconName?: keyof typeof LucideIcons | string;
  iconColor?: string;
  iconBgColor?: string;
  iconEmoji?: string;
  hideIcon?: boolean;

  // Buttons configuration
  primaryButton?: AlertModalButton;
  secondaryButton?: AlertModalButton;
  buttons?: AlertModalButton[]; // Supports 1, 2, or 3 buttons
  buttonsDirection?: 'row' | 'column';

  // Body content extension
  children?: React.ReactNode;

  // Behavioral props
  closeOnBackdropPress?: boolean;
  preventDismissOnHardwareBack?: boolean;
  maxContentHeight?: number;
  testID?: string;
}

// ─── Variant Config Defaults ──────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
  AlertModalVariant,
  {
    iconName: string;
    iconColor: string;
    iconBgColor: string;
  }
> = {
  info: {
    iconName: 'Info',
    iconColor: '#2563EB',
    iconBgColor: '#EFF6FF',
  },
  success: {
    iconName: 'CheckCircle2',
    iconColor: '#059669',
    iconBgColor: '#ECFDF5',
  },
  warning: {
    iconName: 'AlertTriangle',
    iconColor: '#D97706',
    iconBgColor: '#FFFBEB',
  },
  danger: {
    iconName: 'AlertOctagon',
    iconColor: '#DC2626',
    iconBgColor: '#FEF2F2',
  },
  default: {
    iconName: 'HelpCircle',
    iconColor: COLORS.themeColor || '#DB2F3C',
    iconBgColor: '#FFF1F2',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const AlertModal: React.FC<AlertModalProps> = ({
  visible = false,
  onClose,
  title = 'Notice',
  message,
  variant = 'default',
  iconName,
  iconColor,
  iconBgColor,
  iconEmoji,
  hideIcon = false,
  primaryButton,
  secondaryButton,
  buttons,
  buttonsDirection,
  children,
  closeOnBackdropPress = true,
  preventDismissOnHardwareBack = false,
  maxContentHeight = 360,
  testID,
}) => {
  // ── Safe Close Handler ──────────────────────────────────────────────────────
  const handleSafeClose = useCallback(() => {
    try {
      onClose?.();
    } catch (err) {
      console.warn('[AlertModal] onClose error:', err);
    }
  }, [onClose]);

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress) {
      handleSafeClose();
    }
  }, [closeOnBackdropPress, handleSafeClose]);

  const handleRequestClose = useCallback(() => {
    if (!preventDismissOnHardwareBack) {
      handleSafeClose();
    }
  }, [preventDismissOnHardwareBack, handleSafeClose]);

  // ── Button Resolution ───────────────────────────────────────────────────────
  const resolvedButtons: AlertModalButton[] = useMemo(() => {
    if (Array.isArray(buttons) && buttons.length > 0) {
      return buttons;
    }

    const list: AlertModalButton[] = [];

    if (secondaryButton) {
      list.push(secondaryButton);
    }

    if (primaryButton) {
      list.push(primaryButton);
    } else if (list.length === 0) {
      // Default fallback single "OK" button
      list.push({
        text: 'OK',
        style: 'default',
        onPress: handleSafeClose,
      });
    }

    return list;
  }, [buttons, primaryButton, secondaryButton, handleSafeClose]);

  const isRowLayout =
    buttonsDirection === 'row' ||
    (!buttonsDirection && resolvedButtons.length === 2);

  // ── Icon Variant Resolution ─────────────────────────────────────────────────
  const currentVariant = VARIANT_CONFIG[variant] || VARIANT_CONFIG.default;
  const activeIconName = iconName || currentVariant.iconName;
  const activeIconColor = iconColor || currentVariant.iconColor;
  const activeIconBg = iconBgColor || currentVariant.iconBgColor;

  return (
    <Modal
      visible={Boolean(visible)}
      transparent
      animationType="fade"
      onRequestClose={handleRequestClose}
      testID={testID}
    >
      <View style={styles.backdrop}>
        {/* Backdrop overlay */}
        <View style={styles.backdropFill}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </View>

        {/* Modal Card */}
        <View
          style={styles.card}
          accessibilityViewIsModal
          accessibilityLiveRegion="polite"
        >
          {/* Top Icon Badge */}
          {!hideIcon ? (
            <View style={[styles.iconCircle, { backgroundColor: activeIconBg }]}>
              {iconEmoji ? (
                <Text style={styles.iconEmojiText}>{iconEmoji}</Text>
              ) : (
                <CustomLucidIcons
                  name={String(activeIconName)}
                  size={26}
                  color={activeIconColor}
                  strokeWidth={2.4}
                />
              )}
            </View>
          ) : null}

          {/* Title */}
          {title ? (
            typeof title === 'string' ? (
              <Text style={styles.title}>{title}</Text>
            ) : (
              title
            )
          ) : null}

          {/* Scrollable Message & Body Content */}
          <ScrollView
            style={{ maxHeight: maxContentHeight, width: '100%' }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {message ? (
              typeof message === 'string' ? (
                <Text style={styles.message}>{message}</Text>
              ) : (
                message
              )
            ) : null}

            {children ? <View style={styles.childrenWrap}>{children}</View> : null}
          </ScrollView>

          {/* Buttons Area */}
          <View
            style={[
              styles.buttonsContainer,
              isRowLayout ? styles.buttonsRow : styles.buttonsColumn,
            ]}
          >
            {resolvedButtons.map((btn, index) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';
              const isOutline = btn.style === 'outline';

              // Colors based on button style
              let btnBg: string = COLORS.themeColor || '#DB2F3C';
              let btnTextColor: string = '#FFFFFF';
              let btnBorderColor = 'transparent';

              if (isDestructive) {
                btnBg = '#DC2626';
                btnTextColor = '#FFFFFF';
              } else if (isCancel) {
                btnBg = '#F1F5F9';
                btnTextColor = '#1E293B';
              } else if (isOutline) {
                btnBg = 'transparent';
                btnTextColor = '#1E293B';
                btnBorderColor = '#CBD5E1';
              }

              const handleButtonPress = async () => {
                if (btn.disabled || btn.loading) return;
                try {
                  if (btn.onPress) {
                    await btn.onPress();
                  } else {
                    handleSafeClose();
                  }
                } catch (err) {
                  console.warn(`[AlertModal] Button ${btn.text} error:`, err);
                }
              };

              return (
                <TouchableOpacity
                  key={`alert_btn_${index}_${btn.text}`}
                  style={[
                    styles.button,
                    isRowLayout && styles.buttonFlex,
                    {
                      backgroundColor: btnBg,
                      borderColor: btnBorderColor,
                      borderWidth: isOutline ? 1 : 0,
                      opacity: btn.disabled ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleButtonPress}
                  activeOpacity={0.8}
                  disabled={btn.disabled || btn.loading}
                  accessibilityRole="button"
                  accessibilityLabel={btn.text}
                  testID={btn.testID}
                >
                  {btn.loading ? (
                    <ActivityIndicator size="small" color={btnTextColor} />
                  ) : (
                    <Text style={[styles.buttonText, { color: btnTextColor }]}>
                      {btn.text}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(AlertModal);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdropFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.60)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderColor: '#F1F5F9',
    borderRadius: 22,
    borderWidth: 1,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmojiText: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18Bold,
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  message: {
    fontSize: 13.5,
    fontFamily: fontFamily.Inter18Regular,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
  },
  childrenWrap: {
    width: '100%',
    marginTop: 12,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  buttonsColumn: {
    flexDirection: 'column',
  },
  button: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18SemiBold,
    letterSpacing: 0.2,
  },
});

// ─── Global Imperative API (showAlertModal / hideAlertModal) ───────────────────

export type AlertModalOptions = Omit<AlertModalProps, 'visible'>;

type AlertModalListener = (options: AlertModalOptions | null) => void;

let activeListener: AlertModalListener | null = null;
const alertQueue: AlertModalOptions[] = [];

/**
 * Show a global AlertModal from anywhere in the application (like Alert.alert).
 * Supports all AlertModal props (variant, title, message, primaryButton, secondaryButton, buttons, etc.).
 */
export const showAlertModal = (options: AlertModalOptions) => {
  try {
    if (activeListener) {
      activeListener(options);
    } else {
      alertQueue.push(options);
    }
  } catch (err) {
    console.warn('[GlobalAlertModal] showAlertModal error:', err);
  }
};

/**
 * Hide the currently visible global AlertModal.
 */
export const hideAlertModal = () => {
  try {
    if (activeListener) {
      activeListener(null);
    }
    alertQueue.length = 0;
  } catch (err) {
    console.warn('[GlobalAlertModal] hideAlertModal error:', err);
  }
};

/**
 * GlobalAlertModal component mounted at the root of the app.
 */
export const GlobalAlertModal: React.FC = () => {
  const [modalState, setModalState] = useState<AlertModalOptions | null>(null);

  useEffect(() => {
    activeListener = (options) => {
      setModalState(options);
    };

    if (alertQueue.length > 0) {
      const nextAlert = alertQueue.shift();
      if (nextAlert) {
        setModalState(nextAlert);
      }
    }

    return () => {
      activeListener = null;
    };
  }, []);

  const handleClose = useCallback(() => {
    try {
      modalState?.onClose?.();
    } catch (err) {
      console.warn('[GlobalAlertModal] onClose error:', err);
    }
    setModalState(null);
  }, [modalState]);

  if (!modalState) return null;

  return (
    <AlertModal
      {...modalState}
      visible={true}
      onClose={handleClose}
    />
  );
};
