import React, { memo, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';
import { moderateScale, moderateVerticalScale } from '../utils/Responsive';
import { clearTokens } from '../redux/apiService';
import { reset } from '../navigation/navigationService';
import { showToast } from '../utils/CustomToast';

export interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = memo(({
  visible,
  onClose,
  onConfirm,
  title = 'Log Out?',
  message = 'Are you sure you want to log out of your Sindhi Matrimony account?',
  isLoading: externalLoading = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handleLogout = useCallback(async () => {
    setInternalLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        clearTokens();
        showToast({
          type: 'success',
          message: 'You have been logged out successfully.',
        });
        reset('LoginScreen');
      }
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        message: err?.message || 'Failed to logout. Please try again.',
      });
    } finally {
      setInternalLoading(false);
    }
  }, [onConfirm, onClose]);

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropColor={COLORS.black}
      backdropOpacity={0.6}
      backdropTransitionOutTiming={0}
      onBackdropPress={isLoading ? undefined : onClose}
      onBackButtonPress={isLoading ? undefined : onClose}
      statusBarTranslucent
      useNativeDriver
      useNativeDriverForBackdrop
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* Top Floating Glow Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconRing}>
            <CustomLucidIcons
              name="log-out"
              size={moderateScale(28)}
              color={COLORS.themeColor}
            />
          </View>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {/* Sub Info Pill */}
        <View style={styles.infoBox}>
          <CustomLucidIcons
            name="shield-check"
            size={moderateScale(16)}
            color="#059669"
          />
          <Text style={styles.infoText}>
            Your profile and search preferences remain saved safely.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            disabled={isLoading}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogout}
            disabled={isLoading}
            style={styles.logoutButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <CustomLucidIcons
                  name="log-out"
                  size={moderateScale(16)}
                  color={COLORS.white}
                />
                <Text style={styles.logoutText}>Log Out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: moderateScale(20),
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateVerticalScale(28),
    paddingBottom: moderateVerticalScale(20),
    width: '100%',
    maxWidth: moderateScale(340),
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: moderateVerticalScale(16),
  },
  iconRing: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: '#FFE9EA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  title: {
    fontSize: moderateScale(20),
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    textAlign: 'center',
    marginBottom: moderateVerticalScale(8),
  },
  message: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    textAlign: 'center',
    lineHeight: moderateScale(19),
    paddingHorizontal: moderateScale(8),
    marginBottom: moderateVerticalScale(16),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(20),
    gap: moderateScale(8),
  },
  infoText: {
    fontSize: moderateScale(11),
    color: '#065F46',
    fontFamily: fontFamily.Inter18Medium,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(14),
    paddingVertical: moderateVerticalScale(13),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#4B5563',
    fontSize: moderateScale(14),
    fontFamily: fontFamily.Inter18SemiBold,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    gap: moderateScale(6),
    backgroundColor: COLORS.themeColor,
    borderRadius: moderateScale(14),
    paddingVertical: moderateVerticalScale(13),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: moderateScale(14),
    fontFamily: fontFamily.Inter18Bold,
  },
});

export default LogoutModal;
