import React, { useState, forwardRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CustomLucidIcons from '../CustomLucidIcons';
import COLORS from '../colors';
import fontFamily from '../fontFamily';
import { activeOpacity } from '../../utils/Responsive';

interface CustomTextInputProps {
  leftIcon: string;
  rightIcon?: string;
  onRightPress?: () => void;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
  error?: string;
  containerStyle?: any;
  inputStyle?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  editable?: boolean;
  selectionColor?:any
  onFocus?: () => void;   // 👈 new
  onBlur?: () => void;    // 👈 new (optional)
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>((props, ref) => {
  const {
    leftIcon,
    rightIcon,
    onRightPress,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    label,
    error,
    containerStyle,
    inputStyle,
    autoCapitalize = 'none',
    autoCorrect = false,
    returnKeyType = 'done',
    onSubmitEditing,
    editable = true,
    onFocus,
    onBlur,
    selectionColor=COLORS.themeColor,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  // Border color logic: error → red, focused → themeColor, else default
  let borderColor = '#ddd';
  if (error) borderColor = 'red';
  else if (isFocused) borderColor = COLORS.themeColor;

  // Internal handlers that also call parent's callbacks
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.(); // 👈 clears error from parent
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, { borderColor }]}>
        <View style={styles.iconWrapper}>
          <CustomLucidIcons name={leftIcon} color={COLORS.themeColor} size={20} />
        </View>
        <TextInput
          ref={ref}
          selectionColor={selectionColor}
          style={[styles.textInput, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          onFocus={handleFocus}   // 👈 use internal handler
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity activeOpacity={activeOpacity} onPress={onRightPress} style={styles.rightIconWrapper}>
            <CustomLucidIcons name={rightIcon} color={COLORS.themeColor} size={20} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18Medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    height: 50,
  },
  iconWrapper: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontFamily: fontFamily.Inter18Regular,
    color: COLORS.black,
  },
  rightIconWrapper: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    fontFamily: fontFamily.Inter18Regular,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomTextInput;