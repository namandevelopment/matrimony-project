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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomTextInput from '../../components/inputBox/CustomTextInput';
import { activeOpacity } from '../../utils/Responsive';
import LoginHelp from '../../components/LoginHelp';
import { clientPhoneNumber } from '../../utils/ClientData';
import { displayLocalNotification, processPendingNotificationRedirect } from '../../firebase';
import { Storage } from '../../storage/Storage';

const LoginWithPassword = ({ navigation }: any) => {
  const [inputs, setInputs] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle state

  const passwordRef = useRef<TextInput>(null);

  const handleInputChange = useCallback(
    (field: keyof typeof inputs, text: string) => {
      setInputs(prev => ({ ...prev, [field]: text }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors],
  );

  const handleLogin = useCallback(() => {
    Keyboard.dismiss();
    let valid = true;
    const newErrors = { identifier: '', password: '' };

    if (!inputs.identifier.trim()) {
      newErrors.identifier = 'Please enter Mobile No / Email ID / Matri ID';
      valid = false;
    }
    if (!inputs.password.trim()) {
      newErrors.password = 'Please enter your password';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      displayLocalNotification({
        title: '🎉 Welcome Back!',
        body: `Hello ${inputs.identifier}, you have logged in successfully to Sindhi Matrimony.`,
        type: 'LOGIN_SUCCESS',
        data: { identifier: inputs.identifier },
      });
      Storage.setItemSync('token', 'session_active');
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });
      setTimeout(() => {
        processPendingNotificationRedirect();
      }, 200);
    }, 200);
  }, [inputs, navigation]);

  const handleLoginWithOTP = useCallback(() => {
    navigation.navigate('LoginScreen');
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ResetPassword');
  }, []);

  const handleHelpCall = useCallback(() => {
    Alert.alert('Call Support', 'Calling +91 8144778866');
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  const handleFocusIdentifier = useCallback(() => {
    if (errors.identifier) {
      setErrors(prev => ({ ...prev, identifier: '' }));
    }
  }, [errors.identifier]);

  const handleFocusPassword = useCallback(() => {
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  }, [errors.password]);
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader title="Login with Password" />
      <View style={{ flex: 1, margin: 15 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CustomTextInput
            leftIcon="user"
            label={`Mobile No./ Email-Id`}
            placeholder="Mobile No / E-Mail ID / Matri Id"
            value={inputs.identifier}
            onChangeText={text => handleInputChange('identifier', text)}
            error={errors.identifier}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!isLoading}
            onFocus={handleFocusIdentifier}
            containerStyle={{ marginBottom: 16 }}
          />
          <CustomTextInput
            ref={passwordRef}
            label={`Password`}
            leftIcon="lock"
            placeholder="Enter Password"
            value={inputs.password}
            onChangeText={text => handleInputChange('password', text)}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightPress={togglePasswordVisibility}
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!isLoading}
            onFocus={handleFocusPassword}
            containerStyle={{ marginBottom: 16 }}
          />

          <LoadingButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButtonOverride}
          />

          <View style={styles.linksRow}>
            <TouchableOpacity activeOpacity={1} onPress={handleLoginWithOTP}>
              <Text style={styles.linkText}>Login with OTP</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>|</Text>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleForgotPassword}
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <LoginHelp  phoneNumber={clientPhoneNumber} />
      </View>
    </View>
  );
};

export default LoginWithPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  loginButtonOverride: {
    marginTop: 30,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
    textDecorationLine: 'underline',
  },
  divider: {
    fontSize: 15,
    color: '#888',
    marginHorizontal: 12,
    fontFamily: fontFamily.Inter18Regular,
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
