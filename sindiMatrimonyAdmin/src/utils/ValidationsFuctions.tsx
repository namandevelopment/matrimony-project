import {
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js';
import metadata from 'libphonenumber-js/metadata.min.json';

// Re-export core libphonenumber utilities for direct access
export { getExampleNumber, isValidPhoneNumber, parsePhoneNumberFromString, validatePhoneNumberLength };

// Validation to check for SQL injection patterns
export const sqlInjectionPattern =
  /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)*|INSERT( INTO)*|MERGE|SELECT|UPDATE|UNION( ALL)*|EXEC|OR|AND)\b)/gi;

// Validation to check for XSS patterns
export const xssPattern = /(<([^>]+)>)/gi;

// Email pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strong password pattern
export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// ======================================================
// 🔤 SANITIZATION & FORMATTING HELPERS
// ======================================================

// Only alphabets + single space between words
export const OnlyAlphabetsSingleSpace = (text: string) => {
  return text
    .replace(/[^a-zA-Z ]/g, '') // allow only letters & space
    .replace(/\s+/g, ' ') // multiple spaces → single
    .replace(/^\s/, ''); // no leading space
};

// Only letters, numbers, underscore & single space between words
export const OnlyAlphaNumericUnderscore = (text: string) => {
  return text
    .replace(/[^a-zA-Z0-9_ ]/g, '') // allow letters, numbers, underscore, space
    .replace(/\s+/g, ' ') // multiple spaces → single space
    .replace(/^\s/, ''); // no leading space
};

// Only numbers
export const OnlyNumbers = (text: string) => {
  return text.replace(/[^0-9]/g, '');
};

// Alphabets + numbers (no special chars)
export const formatAlphaNumeric = (text: string) => {
  return text.replace(/[^a-zA-Z0-9]/g, '');
};

// Only numbers but NOT starting with zero
export const NumbersNoLeadingZero = (text: string) => {
  let formatted = text.replace(/[^0-9]/g, '');
  // remove leading zeros
  formatted = formatted.replace(/^0+/, '');
  return formatted;
};

// Currency / Dollar amount input formatting
export const DollarAmountInput = (text: string) => {
  let formatted = text.replace(/[^0-9.]/g, '');

  const dots = formatted.split('.').length - 1;
  if (dots > 1) {
    const firstDotIndex = formatted.indexOf('.');
    formatted =
      formatted.substring(0, firstDotIndex + 1) +
      formatted.substring(firstDotIndex + 1).replace(/\./g, '');
  }

  if (formatted.length > 1) {
    if (!formatted.startsWith('0.')) {
      formatted = formatted.replace(/^0+/, '');
    }
  }

  if (formatted.startsWith('.')) {
    formatted = '0' + formatted;
  }

  if (formatted === '' || formatted === '.') {
    return '';
  }

  return formatted;
};

// ======================================================
// 🛡️ SECURITY & SAFETY CHECKS (SQLi & XSS)
// ======================================================

export const isSQLInjectionSafe = (input: any) => {
  if (input === null || input === undefined) return true;
  sqlInjectionPattern.lastIndex = 0;
  return !sqlInjectionPattern.test(String(input));
};

export const isXSSSafe = (input: any) => {
  if (input === null || input === undefined) return true;
  xssPattern.lastIndex = 0;
  return !xssPattern.test(String(input));
};

// Combined function to check for SQL injection and XSS
export const isSafeInput = (input: any) => {
  return isSQLInjectionSafe(input) && isXSSSafe(input);
};

export const isValidEmail = (email: string) => {
  return emailPattern.test(email);
};

// ======================================================
// 📋 FIELD VALIDATION FUNCTIONS
// ======================================================

export const validateName = (name: any) => {
  const str = String(name || '');
  if (!str.trim()) {
    return 'Please enter a name.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (str.trim().length < 3) {
    return 'Name must be at least 3 characters';
  } else {
    return '';
  }
};

export const validateMessage = (message: any) => {
  const str = String(message || '');
  if (!str.trim()) {
    return 'Please enter a message.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (str.trim().length < 10) {
    return 'Message is too short.';
  } else {
    return '';
  }
};

export const validateAmount = (amount: any) => {
  const str = String(amount || '');
  if (!str.trim()) {
    return 'Please enter a amount.';
  } else if (str.trim().length < 1) {
    return 'Amount is too low.';
  } else {
    return '';
  }
};

export const validateVerificationCode = (code: string): string => {
  const str = String(code || '');
  if (!str.trim()) {
    return 'Please enter verification code.';
  } else if (str.length < 4) {
    return 'Verification code must be 4 digits.';
  } else if (!/^\d+$/.test(str)) {
    return 'Verification code must contain only numbers.';
  } else if (str.length > 4) {
    return 'Verification code cannot exceed 4 digits.';
  } else {
    return '';
  }
};

export const validateDollarAmount = (amount: any) => {
  const amountStr = String(amount || '').trim();

  if (!amountStr) {
    return 'Please enter an amount.';
  }

  // Check if it's a valid positive number (including decimals)
  if (!/^\d*\.?\d+$/.test(amountStr)) {
    return 'Please enter a valid positive number.';
  }

  const amountNum = parseFloat(amountStr);

  if (isNaN(amountNum)) {
    return 'Please enter a valid number.';
  }

  // Allow amounts like 0.5, 0.01, 0.99
  if (amountNum <= 0) {
    return 'Amount must be greater than 0.';
  }

  return '';
};

export const validateUsername = (username: any) => {
  const str = String(username || '');
  if (!str.trim()) {
    return 'Username is required.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (str.trim().length < 3) {
    return 'Username must be at least 3 characters.';
  } else {
    return '';
  }
};

export const validateIfscCode = (ifsc: string): string => {
  if (!ifsc || ifsc.trim() === '') {
    return 'IFSC code is required';
  }
  // IFSC format: 4 letters + 0 + 6 alphanumeric characters
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())) {
    return 'Enter a valid IFSC code (e.g., SBIN0012345)';
  }
  return '';
};

export const validateEmail = (email: any) => {
  const str = String(email || '');
  if (!str.trim()) {
    return 'Please enter your email.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (!emailPattern.test(str)) {
    return 'Please enter a valid email.';
  } else {
    return '';
  }
};

export const validatePassword = (password: any) => {
  const str = String(password || '');
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  if (!str.trim()) {
    return 'Please enter your password.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (!passwordRegex.test(str)) {
    return 'Password should be between 8 to 15 characters and should contain at least one uppercase, one lowercase, one number, and one special character.';
  } else {
    return '';
  }
};

export const validateNewPassword = (password: any, oldPassword: any) => {
  const str = String(password || '');
  if (!str.trim()) {
    return 'Please enter your new password.';
  } else if (str.length < 6) {
    return 'Password must be at least 6 characters long.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (str === String(oldPassword || '')) {
    return 'Old password and New password must not be same.';
  } else {
    return validatePassword(str);
  }
};

export const validateConfirmPassword = (
  password: any,
  confirmPassword: any
) => {
  const str = String(confirmPassword || '');
  if (!str.trim()) {
    return 'Please enter your confirm password.';
  } else if (str.length < 6) {
    return 'Password must be at least 6 characters long.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (String(password || '') !== str) {
    return 'New Password and Confirm password must be same.';
  } else {
    return '';
  }
};

export const validateNewConfirmPassword = (
  password: any,
  confirmPassword: any
) => {
  const str = String(confirmPassword || '');
  if (!str.trim()) {
    return 'Please enter your new password.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (String(password || '') !== str) {
    return 'New password and confirm password must be same.';
  } else {
    return '';
  }
};

export const validateOldPassword = (password: any) => {
  const str = String(password || '');
  if (!str.trim()) {
    return 'Please enter old password.';
  } else if (str.length < 6) {
    return 'Password must be at least 6 characters long.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else {
    return '';
  }
};

export const validateCountryName = (countryName: any) => {
  const str = String(countryName || '');
  if (!str.trim()) {
    return 'Please select a country.';
  } else {
    return '';
  }
};

export const validateUserId = (userId: any) => {
  const str = String(userId || '');
  if (!str || str.trim() === '') {
    return 'Please enter User ID.';
  } else {
    return '';
  }
};

export const validateBankName = (bankName: any) => {
  const str = String(bankName || '');
  if (!str.trim()) {
    return 'Please select a bank.';
  } else {
    return '';
  }
};

export const validateMobileNumber = (mobileNumber: any) => {
  const str = String(mobileNumber || '');
  // Allows optional country code and 7–15 digits
  const mobileNumberRegex = /^\+?\d{1,3}?\d{7,15}$/;

  if (!str.trim()) {
    return 'Please enter mobile number.';
  } else if (!isSafeInput(str)) {
    return 'Mobile number contains invalid characters.';
  } else if (!mobileNumberRegex.test(str.trim())) {
    return 'Please enter a valid mobile number (7-15 digits).';
  } else {
    return '';
  }
};

export const validateAccountHolderName = (name: string): string => {
  const str = String(name || '');
  if (!str || str.trim() === '') {
    return 'Account holder name is required';
  }
  if (str.trim().length < 3) {
    return 'Account holder name must be at least 3 characters';
  }
  if (str.trim().length > 50) {
    return 'Account holder name must be less than 50 characters';
  }
  return '';
};

export const validateAccountNumber = (accountNumber: string): string => {
  const str = String(accountNumber || '').trim();
  if (!str) {
    return 'Account number is required';
  }
  if (!/^\d+$/.test(str)) {
    return 'Account number must contain only numbers';
  }
  if (str.length < 9 || str.length > 18) {
    return 'Account number must be between 9 and 18 digits';
  }
  return '';
};

export const validatePincode = (pincode: any) => {
  const str = String(pincode || '');
  const pincodeRegex = /^\d{4,10}$/;
  if (!str.trim()) {
    return 'Pincode no. is required.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (!pincodeRegex.test(str.trim())) {
    return 'Pincode no. must be 4 to 10 digits.';
  } else {
    return '';
  }
};

export const validateOtp = (otp: any) => {
  const str = String(otp || '');
  const otpRegex = /^\d{6}$/;
  if (!str.trim()) {
    return 'OTP is required.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (!otpRegex.test(str.trim())) {
    return 'Please enter valid OTP.';
  } else {
    return '';
  }
};

export const validateTerms = (terms: any) => {
  if (!terms) {
    return 'Please agree to the Terms & Conditions and Privacy Policy.';
  } else {
    return '';
  }
};

export const validateImageFormat = (image: any) => {
  const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  if (!image) {
    return 'Uploaded file format is not supported.';
  } else if (!allowedFormats.includes(image.type)) {
    return 'Uploaded file format is not supported.';
  } else {
    return '';
  }
};

export const validateMandatory = (value: any) => {
  const str = String(value || '');
  if (!str.trim()) {
    return 'Please enter all required details.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else {
    return '';
  }
};

export const validateCredentials = (credentials: any) => {
  const str = String(credentials || '');
  if (!str.trim()) {
    return 'Your credentials do not match.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else {
    return '';
  }
};

export const validateInactiveAccount = (account: any) => {
  if (!account) {
    return 'Your account has been deactivated. Please contact admin.';
  } else {
    return '';
  }
};

export const validateInternet = (internet: any) => {
  if (!internet) {
    return 'Please check your internet connection and try again.';
  } else {
    return '';
  }
};

export const validateProfileAction = (action: any) => {
  if (!action) {
    return 'Action required.';
  } else {
    return '';
  }
};

export const validateUnregisteredUser = (user: any) => {
  if (!user) {
    return 'User does not exist.';
  } else {
    return '';
  }
};

export const validateCountryCode = (countryCode: string) => {
  if (!countryCode?.trim()) {
    return 'Country code is required.';
  }
  return '';
};

export const validateGender = (gender: any) => {
  const str = String(gender || '');
  const validGenders = ['Male', 'Female', 'Other'];
  if (!str.trim()) {
    return 'Please select a gender.';
  } else if (!isSafeInput(str)) {
    return 'Input contains invalid characters.';
  } else if (!validGenders.includes(str.trim())) {
    return 'Please select a valid gender.';
  } else {
    return '';
  }
};

// ======================================================
// 🌍 INTERNATIONAL PHONE NUMBER VALIDATION HELPERS
// ======================================================

export const getPhoneLength = (country: any) => {
  const example = getExampleNumber(country, metadata as any);
  return example?.nationalNumber?.length || null;
};

export const getPhoneLengthRange = (iso2: any) => {
  const countryData: any = (metadata as any).countries[iso2];

  if (!countryData) return null;

  const possibleLengths = countryData[3]; // possible phone lengths

  if (!possibleLengths || possibleLengths.length === 0) return null;

  return {
    min: Math.min(...possibleLengths),
    max: Math.max(...possibleLengths),
  };
};

export const validatePhoneByCountry = (
  phone: any,
  countryCode: string,
  iso2: any
) => {
  if (!phone) {
    return 'Phone number is required';
  }

  const fullNumber = `${countryCode}${phone}`;
  const lengthCheck = validatePhoneNumberLength(fullNumber, iso2);

  if (lengthCheck === 'TOO_SHORT' || lengthCheck === 'TOO_LONG') {
    const range = getPhoneLengthRange(iso2);

    if (range) {
      if (range.min === range.max) {
        return `Phone number must be ${range.min} digits`;
      } else {
        return `Phone number must be between ${range.min} and ${range.max} digits`;
      }
    }

    return 'Invalid phone number length';
  }

  return '';
};

export const getMaxPhoneLength = (iso2: string) => {
  const countryData: any = (metadata as any).countries[iso2];

  if (!countryData) return null;

  const possibleLengths = countryData[3]; // possible lengths array

  if (!possibleLengths || possibleLengths.length === 0) return null;

  return Math.max(...possibleLengths);
};

export const validate_MobileNumber_With_Country = (
  phone: string,
  countryCode: string,
  iso2: string
) => {
  if (!phone) {
    return 'Please enter phone number';
  }

  const countryData: any = (metadata as any).countries[iso2];
  if (!countryData) {
    return 'Invalid country';
  }

  const possibleLengths = countryData[3];

  if (!possibleLengths || possibleLengths?.length === 0) {
    return 'Invalid phone number';
  }

  const minLength = Math.min(...possibleLengths);
  const maxLength = Math.max(...possibleLengths);

  const fullNumber = `${countryCode}${phone}`;
  const lengthCheck = validatePhoneNumberLength(fullNumber, iso2 as any);

  if (lengthCheck === 'TOO_SHORT') {
    return `Phone number must be at least ${minLength} digits`;
  }

  if (lengthCheck === 'TOO_LONG') {
    return `Phone number must be at most ${maxLength} digits`;
  }

  if (phone.length < minLength || phone.length > maxLength) {
    if (minLength === maxLength) {
      return `Phone number must be ${minLength} digits`;
    } else {
      return `Phone number must be between ${minLength} and ${maxLength} digits`;
    }
  }

  return '';
};

export const validate_MobileNumber_With_Country_Better = (
  phone: string,
  countryCode: string,
  iso2: string
) => {
  if (!phone) {
    return 'Please enter phone number';
  }

  try {
    const fullNumber = phone.startsWith('+')
      ? phone
      : `+${countryCode.replace('+', '')}${phone}`;
    const phoneNumber = parsePhoneNumberFromString(fullNumber, iso2 as any);

    if (!phoneNumber || !phoneNumber.isValid()) {
      return `Invalid phone number for ${iso2}`;
    }

    // Verify country matches
    if (phoneNumber.country !== iso2) {
      return `Phone number doesn't belong to selected country (${iso2})`;
    }

    return '';
  } catch (_error) {
    return 'Invalid phone number format';
  }
};

const Validations = {
  OnlyAlphabetsSingleSpace,
  OnlyAlphaNumericUnderscore,
  OnlyNumbers,
  formatAlphaNumeric,
  NumbersNoLeadingZero,
  DollarAmountInput,
  isSQLInjectionSafe,
  isXSSSafe,
  isSafeInput,
  isValidEmail,
  validateName,
  validateMessage,
  validateAmount,
  validateVerificationCode,
  validateDollarAmount,
  validateUsername,
  validateIfscCode,
  validateEmail,
  validatePassword,
  validateNewPassword,
  validateConfirmPassword,
  validateNewConfirmPassword,
  validateOldPassword,
  validateCountryName,
  validateUserId,
  validateBankName,
  validateMobileNumber,
  validateAccountHolderName,
  validateAccountNumber,
  validatePincode,
  validateOtp,
  validateTerms,
  validateImageFormat,
  validateMandatory,
  validateCredentials,
  validateInactiveAccount,
  validateInternet,
  validateProfileAction,
  validateUnregisteredUser,
  validateCountryCode,
  validateGender,
  getPhoneLength,
  getPhoneLengthRange,
  validatePhoneByCountry,
  getMaxPhoneLength,
  validate_MobileNumber_With_Country,
  validate_MobileNumber_With_Country_Better,
};

export default Validations;
