import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomTextInput from '../../components/inputBox/CustomTextInput';
import AuthImage from '../../components/AuthImage';
import { showToast } from '../../utils/CustomToast';
import { displayLocalNotification } from '../../firebase';
import useLoader from '../../customHooks/useLoader';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading, showLoader, hideLoader } = useLoader();

  const handleRegister = useCallback(async () => {
    Keyboard.dismiss();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!mobileOrEmail.trim()) {
      newErrors.mobileOrEmail = 'Please enter mobile number or email';
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    showLoader();

    setTimeout(async () => {
      hideLoader();

      // 🔔 Trigger rich registration success local notification
      await displayLocalNotification({
        title: '💍 Registration Successful!',
        body: `Welcome ${name.trim()}! Your profile is now live on Sindhi Matrimony.`,
        type: 'REGISTER_SUCCESS',
        data: { userName: name.trim() },
      });

      showToast({
        type: 'success',
        message: 'Account created successfully! Welcome to Sindhi Matrimony.',
        position: 'top',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });
    }, 1200);
  }, [hideLoader, mobileOrEmail, name, navigation, password, showLoader]);

  const handleGoToLogin = useCallback(() => {
    navigation.navigate('LoginScreen');
  }, [navigation]);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader title="Create Account" />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthImage />

          <Text style={styles.title}>Begin Your Journey</Text>
          <Text style={styles.subtitle}>
            Create your profile to discover verified Sindhi matches worldwide
          </Text>

          <CustomTextInput
            leftIcon="user"
            placeholder="Full Name"
            label="Full Name"
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            autoCapitalize="words"
          />

          <CustomTextInput
            leftIcon="mail"
            placeholder="Mobile Number or Email"
            label="Mobile No. / Email"
            value={mobileOrEmail}
            onChangeText={text => {
              setMobileOrEmail(text);
              if (errors.mobileOrEmail) setErrors(prev => ({ ...prev, mobileOrEmail: '' }));
            }}
            error={errors.mobileOrEmail}
            autoCapitalize="none"
          />

          <CustomTextInput
            leftIcon="lock"
            rightIcon={showPassword ? 'eye' : 'eye-off'}
            onRightPress={() => setShowPassword(prev => !prev)}
            placeholder="Password (min 6 characters)"
            label="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            autoCapitalize="none"
          />

          <LoadingButton
            title="Register Now"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleGoToLogin}
            accessibilityRole="button"
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginHighlight}>Login here</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
    marginHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.Inter18Bold,
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    fontFamily: fontFamily.Inter18Regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  registerBtn: {
    marginTop: 18,
  },
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18Regular,
    color: '#666666',
  },
  loginHighlight: {
    fontFamily: fontFamily.Inter18Bold,
    color: COLORS.themeColor,
  },
});

export default RegisterScreen;