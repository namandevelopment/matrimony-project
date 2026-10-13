import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthImage from '../../components/AuthImage';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomHeader from '../../components/headers/CustomHeader';
import LoginHelp from '../../components/LoginHelp';
import { clientPhoneNumber } from '../../utils/ClientData';
import { validateOtp } from '../../utils/ValidationsFuctions';
import { showToast } from '../../utils/CustomToast';
import { displayLocalNotification, processPendingNotificationRedirect } from '../../firebase';

interface ValidateOTPScreenProps {
  navigation: any;
  route?: {
    params?: {
      phoneNumber?: string;
      dialCode?: string;
    };
  };
}

const OTP_LENGTH = 6;
const RESEND_DELAY = 30;

const ValidateOTPScreen = ({ navigation, route }: ValidateOTPScreenProps) => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_DELAY);
  const inputRef = useRef<TextInput>(null);
  const phoneNumber = route?.params?.phoneNumber || clientPhoneNumber;
  const dialCode = route?.params?.dialCode || '+91';

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resendIn === 0) return;

    const timer = setInterval(() => {
      setResendIn(previous => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendIn]);

  const handleOtpChange = useCallback(
    (value: string) => {
      const cleanedOtp = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
      setOtp(cleanedOtp);
      if (errorMessage) setErrorMessage('');
    },
    [errorMessage],
  );

  const handleVerify = useCallback(() => {
    Keyboard.dismiss();
    const validationError = validateOtp(otp);

    if (validationError) {
      setErrorMessage(validationError);
      inputRef.current?.focus();
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast({
        type: 'success',
        message: 'Welcome back to Sindhi Matrimony.',
        position: 'top',
      });

      // Trigger rich login success notification
      displayLocalNotification({
        title: '🎉 Welcome Back!',
        body: 'You have logged in successfully to Sindhi Matrimony.',
        type: 'LOGIN_SUCCESS',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });

      // Redirect to pending notification target if user tapped one while logged out
      setTimeout(() => {
        processPendingNotificationRedirect();
      }, 200);
    }, 200);
  }, [navigation, otp]);

  const handleResend = useCallback(() => {
    if (resendIn > 0 || isLoading) return;

    setOtp('');
    setErrorMessage('');
    setResendIn(RESEND_DELAY);
    inputRef.current?.focus();

    // Trigger local notification for resent OTP
    displayLocalNotification({
      title: '📲 OTP Sent Successfully',
      body: `A new OTP was sent to ${dialCode} ${phoneNumber}. Valid for 10 minutes.`,
      type: 'OTP_SENT',
      data: { phoneNumber: `${dialCode} ${phoneNumber}` },
    });

    Alert.alert(
      'OTP sent',
      `A new OTP was sent to ${dialCode} ${phoneNumber}.`,
    );
  }, [dialCode, isLoading, phoneNumber, resendIn]);

  const maskedPhone =
    phoneNumber.length > 4
      ? `${phoneNumber.slice(0, 2)}******${phoneNumber.slice(-2)}`
      : phoneNumber;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader title="Verify OTP" disabled={isLoading} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthImage />
          <Text style={styles.subtitle}>
            Enter the 6-digit OTP sent to {dialCode} {maskedPhone}
          </Text>

          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={styles.otpContainer}
            accessible={false}
          >
            <TextInput
              ref={inputRef}
              editable={!isLoading}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              onChangeText={handleOtpChange}
              onSubmitEditing={handleVerify}
              placeholder=""
              placeholderTextColor="transparent"
              returnKeyType="done"
              style={styles.otpInput}
              textContentType="oneTimeCode"
              value={otp}
              accessibilityLabel="One-time password"
              caretHidden
              cursorColor="transparent"
            />

            <View style={styles.otpIndicators} pointerEvents="none">
              {Array.from({ length: OTP_LENGTH }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.otpIndicator,
                    index < otp.length && styles.otpIndicatorFilled,
                    errorMessage && styles.otpIndicatorError,
                  ]}
                >
                  <Text style={styles.otpIndicatorText}>
                    {otp[index] ? '•' : ''}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>

          {!!errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <LoadingButton
            title="Verify OTP"
            onPress={handleVerify}
            loading={isLoading}
            disabled={isLoading}
            style={styles.verifyButton}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={resendIn > 0 || isLoading}
              onPress={handleResend}
            >
              <Text
                style={[styles.resendLink, resendIn > 0 && styles.disabledLink]}
              >
                {resendIn > 0 ? ` Resend in ${resendIn}s` : ' Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          <LoginHelp phoneNumber={clientPhoneNumber} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, margin: 15 },
  scrollContent: { flexGrow: 1, paddingTop: 8, paddingBottom: 16 },
  subtitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  otpContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  otpInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: 'transparent',
    fontSize: 1,
    opacity: 0.01,
    zIndex: 2,
  },
  otpIndicators: { flexDirection: 'row', justifyContent: 'space-between' },
  otpIndicator: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderColor: '#DDDDDD',
    borderRadius: 10,
    borderWidth: 2,
    height: 54,
    justifyContent: 'center',
    width: 45,
  },
  otpIndicatorFilled: { borderColor: COLORS.themeColor },
  otpIndicatorError: { borderColor: '#FF3B30' },
  otpIndicatorText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter24Bold,
    fontSize: 24,
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    marginLeft: 4,
    marginTop: 7,
  },
  verifyButton: { marginTop: 30 },
  resendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#777777',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
  },
  resendLink: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 13,
  },
  disabledLink: { color: '#999999' },
});

export default ValidateOTPScreen;
