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
import CustomTextInput from '../../components/inputBox/CustomTextInput';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomHeader from '../../components/headers/CustomHeader';
import AuthImage from '../../components/AuthImage';
import { clientPhoneNumber } from '../../utils/ClientData';
import LoginHelp from '../../components/LoginHelp';
import CountryPickerModal from '../../customModals/CountryPickerModal';
import { showToast } from '../../utils/CustomToast';
import { displayLocalNotification, processPendingNotificationRedirect } from '../../firebase';
import { Storage } from '../../storage/Storage';
import { apiPost, ApiURL, setToken, setRefreshToken } from '../../redux/apiService';
import { useDispatch } from 'react-redux';
import { get_Profile_Call } from '../../redux/useDispatch';
import { useInputs } from '../../customHooks/useInputs';

const defaultCountry = COUNTRIES?.find(c => c.iso2 === 'IN') || COUNTRIES[0];

const LoginScreen = ({ navigation }: any) => {
  const {
    inputs,
    errors,
    booleans,
    updateInput,
    setBoolean,
    toggleBoolean,
    setError,
    clearError,
    getInputs,
  } = useInputs(
    {
      mobileNumber: '9876543210',
      password: 'Password123@',
    },
    {
      showPassword: false,
      isLoading: false,
      countryModalVisible: false,
    },
  );
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const dispatch = useDispatch();
  const inputRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const handleChange = useCallback(
    (text: string) => {
      updateInput('mobileNumber', OnlyNumbers(text));
    },
    [updateInput],
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      updateInput('password', text);
    },
    [updateInput],
  );

  const handleLogin = useCallback(async () => {
    Keyboard.dismiss();
    const current = getInputs();
    const trimmed = current.mobileNumber.trim();
    let valid = true;

    if (!trimmed) {
      setError('mobileNumber', 'Please enter your mobile number');
      valid = false;
    } else {
      const validationError = validate_MobileNumber_With_Country(
        trimmed,
        selectedCountry.dialCode,
        selectedCountry.iso2,
      );
      if (validationError) {
        setError('mobileNumber', validationError);
        valid = false;
      }
    }

    if (!current.password.trim()) {
      setError('password', 'Please enter your password');
      valid = false;
    }

    if (!valid) return;

    clearError('mobileNumber');
    clearError('password');
    setBoolean('isLoading', true);

    try {
      const response = await apiPost(ApiURL.login, {
        phone: trimmed,
        password: current.password,
        clientPlatform: 'MOBILE',
      });

      setBoolean('isLoading', false);

      if (response.error || !response.data) {
        const errorMsg =
          response.message || 'Login failed. Please check your credentials.';
        const isConnError =
          errorMsg.toLowerCase().includes('connect') ||
          errorMsg.toLowerCase().includes('internet') ||
          errorMsg.toLowerCase().includes('timed out');
        if (!isConnError) {
          setError('password', errorMsg);
        }
        showToast({
          type: 'error',
          message: errorMsg,
          position: 'top',
        });
        return;
      }

      const { token, refreshToken, user } = response?.data;

      if (token) {
        setToken(token);
        Storage.setItemSync('accessToken', token);
      }
      if (refreshToken) setRefreshToken(refreshToken);
      if (user) Storage.setItemSync('user', user);

      get_Profile_Call(dispatch);

      displayLocalNotification({
        title: '🎉 Welcome Back!',
        body: `Hello ${user?.phone || trimmed}, you have logged in successfully to Sindhi Matrimony.`,
        type: 'LOGIN_SUCCESS',
        data: { identifier: trimmed, profileId: user?.activeProfileId || user?.id },
      });

      showToast({
        type: 'success',
        message: response.message || 'Logged in successfully!',
        position: 'top',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });

      setTimeout(() => {
        processPendingNotificationRedirect();
      }, 200);
    } catch (err: any) {
      setBoolean('isLoading', false);
      const errMsg = err?.message || 'Network error. Please try again.';
      const isConnError =
        errMsg.toLowerCase().includes('connect') ||
        errMsg.toLowerCase().includes('internet') ||
        errMsg.toLowerCase().includes('network');
      if (!isConnError) {
        setError('password', errMsg);
      }
      showToast({
        type: 'error',
        message: errMsg,
        position: 'top',
      });
    }
  }, [getInputs, selectedCountry, navigation, setError, clearError, setBoolean]);

  const handleSelectCountry = useCallback((country: any) => {
    setSelectedCountry(country);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader title="Login" disabled={booleans.isLoading} />
      <View style={styles.container}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthImage />

          <Text style={styles.subtitle}>
            Enter your registered mobile number and password to login
          </Text>

          <PhoneInputWithCountry
            value={inputs.mobileNumber}
            disabled={booleans.isLoading}
            onChangeText={handleChange}
            error={errors.mobileNumber}
            placeholder="Enter Mobile Number"
            selectedCountry={selectedCountry}
            onCountryPress={() => setBoolean('countryModalVisible', true)}
            onSubmitEditing={() => passwordRef.current?.focus()}
            maxLength={15}
            returnKeyType="next"
            inputRef={inputRef}
          />

          <CustomTextInput
            ref={passwordRef}
            placeholder="Enter Password"
            value={inputs.password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!booleans.showPassword}
            leftIcon="lock"
            rightIcon={booleans.showPassword ? 'eye-off' : 'eye'}
            onRightPress={() => toggleBoolean('showPassword')}
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!booleans.isLoading}
            containerStyle={{ marginTop: 16 }}
          />

          <LoadingButton
            title="Login"
            onPress={handleLogin}
            loading={booleans.isLoading}
            disabled={booleans.isLoading}
            style={styles.otpButtonOverride}
          />

          <View style={styles.linksRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>|</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterScreen')}
              accessibilityLabel="Register"
            >
              <Text style={styles.linkText}>New user? Register</Text>
            </TouchableOpacity>
          </View>

          <LoginHelp phoneNumber={clientPhoneNumber} />
        </ScrollView>

        {booleans.countryModalVisible && (
          <CountryPickerModal
            visible={booleans.countryModalVisible}
            onClose={() => setBoolean('countryModalVisible', false)}
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
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  divider: {
    color: '#CCC',
    fontSize: 14,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
