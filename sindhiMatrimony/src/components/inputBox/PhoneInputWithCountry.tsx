import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import CustomLucidIcons from '../CustomLucidIcons';
import COLORS from '../colors';
import fontFamily from '../fontFamily';

export interface PhoneInputWithCountryProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  selectedCountry: {
    flag: string;
    dialCode: string;
    iso2: string;
  };
  onCountryPress: () => void;
  onSubmitEditing?: () => void;
  disabled?: boolean;
  maxLength?: number;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  inputRef?: React.RefObject<TextInput>;
}


const PhoneInputWithCountry = forwardRef<TextInput, PhoneInputWithCountryProps>(
  (
    {
      value,
      onChangeText,
      error,
      placeholder = 'Enter Mobile Number',
      selectedCountry,
      onSubmitEditing,
      disabled = false,
      onCountryPress,
      maxLength = 15,
      returnKeyType = 'done',
      inputRef,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<TextInput>(null);
    const textInputRef = inputRef || internalRef;

    useImperativeHandle(ref, () => textInputRef.current as TextInput);

    return (
        <View style={styles.wrapper}>
          <View
            style={[
              styles.inputContainer,
              error
                ? styles.inputContainerError
                : isFocused
                ? styles.inputContainerFocused
                : styles.inputContainerDefault,
            ]}
          >
            <TouchableOpacity
              style={styles.countryCode}
              onPress={onCountryPress}
              activeOpacity={0.6}
              accessibilityLabel="Select country code"
            >
              <Text style={styles.flagText}>{selectedCountry.flag}</Text>
              <Text style={styles.codeText}>{selectedCountry.dialCode}</Text>
              <CustomLucidIcons
                name="chevron-down"
                color={COLORS.black}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TextInput
              ref={textInputRef}
              style={styles.phoneInput}
              placeholder={placeholder}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChangeText}
              maxLength={maxLength}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              editable={!disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              accessibilityLabel="Mobile number input"
              accessibilityHint="Enter your mobile number"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#FAFAFA',
  },
  inputContainerError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  inputContainerFocused: {
    borderColor: COLORS.themeColor,
    borderWidth: 2,
  },
  inputContainerDefault: {
    borderColor: '#DDD',
    borderWidth: 2,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 4,
  },
  flagText: {
    fontSize: 22,
    marginRight: 2,
  },
  codeText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: fontFamily.Inter18Medium,
  },
  dropdownIcon: {
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#CCC',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,height:50,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Regular,
    paddingVertical: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default PhoneInputWithCountry;