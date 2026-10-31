import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Keyboard,
  TextInput,
  Image,
} from 'react-native';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomTextInput from '../../components/inputBox/CustomTextInput';
import { IMAGES } from '../../components/images';
import AuthImage from '../../components/AuthImage';
import LoginHelp from '../../components/LoginHelp';
import { clientPhoneNumber } from '../../utils/ClientData';
// import CustomTextInput from '../../components/CustomTextInput'; // 👈 import

const ResetPassword = ({ navigation }: any) => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleInputChange = useCallback(
    (text: string) => {
      setIdentifier(text);
      if (error) setError('');
    },
    [error],
  );

  // Clear error on focus
  const handleFocus = useCallback(() => {
    if (error) setError('');
  }, [error]);

  const handleGetOTP = useCallback(() => {
    Keyboard.dismiss();
    const trimmed = identifier.trim();

    if (!trimmed) {
      setError(
        'Please enter your registered mobile number, email, or Matri ID',
      );
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('OTP Sent', `OTP sent to ${trimmed} for password reset.`);
      // navigation.navigate('OTPVerification', { resetPassword: true });
    }, 1500);
  }, [identifier]);

  const handleLoginWithPassword = useCallback(() => {
    navigation.navigate('LoginWithPassword');
  }, [navigation]);



  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader title="Reset password" />
      <View style={{ flex: 1, margin: 15 }}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthImage />
          <Text style={styles.subtitle}>
            Enter your registered mobile number, email or Matri ID and we will
            send you an OTP for resetting your password
          </Text>

          {/* CustomTextInput for identifier */}
          <CustomTextInput
            ref={inputRef}
            leftIcon="user"
            placeholder="Mobile No / E-Mail ID / Matri Id"
            value={identifier}
            onChangeText={handleInputChange}
            error={error}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleGetOTP}
            editable={!isLoading}
            containerStyle={{ marginBottom: 4 }}
          />

          {/* Get OTP Button */}
          <LoadingButton
            title="Get OTP"
            onPress={handleGetOTP}
            loading={isLoading}
            disabled={isLoading}
            style={styles.otpButtonOverride}
          />

          {/* Link to Login with password */}
          <TouchableOpacity
            style={styles.passwordLink}
            onPress={handleLoginWithPassword}
            accessibilityLabel="Login with password"
            accessibilityRole="button"
          >
            <Text style={styles.passwordLinkText}>Login with password</Text>
          </TouchableOpacity>

          {/* Help Section */}

          <LoginHelp phoneNumber={clientPhoneNumber} />
        </ScrollView>

      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    lineHeight: 22,
    marginBottom: 30,
  },
  otpButtonOverride: {
    marginTop: 30,
  },
  passwordLink: {
    alignSelf: 'center',
    marginTop: 20,
  },
  passwordLinkText: {
    fontSize: 15,
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
    textDecorationLine: 'underline',
  },
  helpContainer: {
    marginTop: 'auto',
    paddingTop: 40,
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
