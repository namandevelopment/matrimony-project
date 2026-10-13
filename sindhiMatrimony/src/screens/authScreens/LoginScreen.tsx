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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import {
  OnlyNumbers,
  validate_MobileNumber_With_Country,
} from '../../utils/ValidationsFuctions';
import { COUNTRIES } from '../../staticData/countryJsonData';
import PhoneInputWithCountry from '../../components/inputBox/PhoneInputWithCountry';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomHeader from '../../components/headers/CustomHeader';
import AuthImage from '../../components/AuthImage';
import { clientPhoneNumber } from '../../utils/ClientData';
import LoginHelp from '../../components/LoginHelp';
import CountryPickerModal from '../../customModals/CountryPickerModal';
import { showToast } from '../../utils/CustomToast';
import { displayLocalNotification } from '../../firebase';

const defaultCountry = COUNTRIES?.find(c => c.iso2 === 'IN') || COUNTRIES[0];

const LoginScreen = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const inputRef = useRef<any>(null);

  const handleChange = useCallback(
    (text: string) => {
      const cleaned = OnlyNumbers(text);
      setMobileNumber(cleaned);
      if (errorMessage) setErrorMessage('');
    },
    [errorMessage],
  );

  const handleGetOTP = useCallback(() => {
    Keyboard.dismiss();
    const trimmed = mobileNumber.trim();
    setIsLoading(true);

    if (!trimmed) {
      setIsLoading(false);

      setErrorMessage('Please enter your mobile number');

      return;
    }

    const validationError = validate_MobileNumber_With_Country(
      trimmed,
      selectedCountry.dialCode,
      selectedCountry.iso2,
    );

    if (validationError) {
      setIsLoading(false);

      setErrorMessage(validationError);
      return;
    }

    setErrorMessage('');
    setIsLoading(true);


    showToast({
      type: 'success',
      message: 'OTP sent successfully to your mobile number.',
      position: 'top',
    });

    // Trigger rich local notification for OTP arrival
    displayLocalNotification({
      title: '📲 OTP Sent Successfully',
      body: `Verification code sent to ${selectedCountry.dialCode} ${trimmed}. Valid for 10 minutes.`,
      type: 'OTP_SENT',
      data: { phoneNumber: `${selectedCountry.dialCode} ${trimmed}` },
    });

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('ValidateOTPScreen', {
        phoneNumber: trimmed,
        dialCode: selectedCountry.dialCode,
      });
    }, 200);
  }, [mobileNumber, navigation, selectedCountry]);

  const handleLoginWithPassword = useCallback(() => {
    navigation.navigate('LoginWithPassword');
  }, [navigation]);

  const handleSelectCountry = useCallback((country: any) => {
    setSelectedCountry(country);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader title="Login with OTP" disabled={isLoading} />
      <View style={styles.container}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthImage />

          <Text style={styles.subtitle}>
            Enter your registered mobile number and we will send you an OTP for
            login
          </Text>

          <PhoneInputWithCountry
            value={mobileNumber}
            disabled={isLoading}
            onChangeText={handleChange}
            error={errorMessage}
            placeholder="Enter Mobile Number"
            selectedCountry={selectedCountry}
            onCountryPress={() => setCountryModalVisible(true)}
            onSubmitEditing={handleGetOTP}
            maxLength={15}
            returnKeyType="done"
            inputRef={inputRef}
          />

          <LoadingButton
            title="Get OTP"
            onPress={handleGetOTP}
            loading={isLoading}
            disabled={isLoading}
            style={styles.otpButtonOverride}
          />

          <TouchableOpacity
            style={styles.passwordLink}
            onPress={handleLoginWithPassword}
            accessibilityLabel="Login with password"
            accessibilityRole="button"
          >
            <Text style={styles.passwordLinkText}>Login with password</Text>
          </TouchableOpacity>

          <LoginHelp phoneNumber={clientPhoneNumber} />
        </ScrollView>

        {countryModalVisible && (
          <CountryPickerModal
            visible={countryModalVisible}
            onClose={() => setCountryModalVisible(false)}
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    margin: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 16,
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
});

export default LoginScreen;
