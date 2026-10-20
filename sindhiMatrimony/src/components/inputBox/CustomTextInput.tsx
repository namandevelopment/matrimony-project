import React, { useState, forwardRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CustomLucidIcons from '../CustomLucidIcons';
import COLORS from '../colors';
import fontFamily from '../fontFamily';
import { activeOpacity } from '../../utils/Responsive';

interface CustomTextInputProps {
  leftIcon?: string;
  rightIcon?: string;
  rightIconColor?: string;
  rightIconSize?: number;
  onRightPress?: () => void;
  onPress?: () => void;
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
  floatingLabel?: boolean;
  error?: string;
  containerStyle?: any;
  inputStyle?: any;
  inputContainerStyle?: any;
  labelStyle?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  editable?: boolean;
  selectionColor?: any;
  onFocus?: () => void;
  onBlur?: () => void;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>((props, ref) => {
  const {
    leftIcon,
    rightIcon,
    rightIconColor = COLORS.themeColor,
    rightIconSize = 20,
    onRightPress,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    label,
    floatingLabel = false,
    error,
    containerStyle,
    inputStyle,
    inputContainerStyle,
    labelStyle,
    autoCapitalize = 'none',
    autoCorrect = false,
    returnKeyType = 'done',
    onSubmitEditing,
    editable = true,
    onFocus,
    onBlur,
    selectionColor = COLORS.themeColor,
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

  const hasValue = !!value && value.toString().trim().length > 0;
  const showFloatingLabel = floatingLabel && !!label && (hasValue || isFocused);

  return (
    <View style={containerStyle}>
      {!floatingLabel && label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={props.onPress ? activeOpacity : 1}
        onPress={props.onPress}
        disabled={!props.onPress}
      >
        <View style={[styles.inputContainer, { borderColor }, inputContainerStyle]}>
          {showFloatingLabel && (
            <View style={styles.floatingBadge} pointerEvents="none">
              <Text style={[styles.floatingBadgeText, isFocused && { color: COLORS.themeColor }]}>
                {label}
              </Text>
            </View>
          )}

          {leftIcon ? (
            <View style={styles.iconWrapper}>
              <CustomLucidIcons name={leftIcon} color={COLORS.themeColor} size={20} />
            </View>
          ) : null}

          <TextInput
            ref={ref}
            selectionColor={selectionColor}
            style={[styles.textInput, inputStyle]}
            placeholder={floatingLabel && showFloatingLabel ? '' : placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            editable={props.onPress ? false : editable}
            pointerEvents={props.onPress ? 'none' : 'auto'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          {rightIcon && (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={onRightPress || props.onPress}
              style={styles.rightIconWrapper}
              disabled={!onRightPress && !props.onPress}
            >
              <CustomLucidIcons name={rightIcon} color={rightIconColor} size={rightIconSize} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    height: 50,
  },
  floatingBadge: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  floatingBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.Inter18Medium,
    color: '#6B7280',
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