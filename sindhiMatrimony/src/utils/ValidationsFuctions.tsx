import { getExampleNumber, isValidPhoneNumber, parsePhoneNumberFromString, validatePhoneNumberLength } from 'libphonenumber-js';
import metadata from 'libphonenumber-js/metadata.min.json';

// Validation to check for SQL injection patterns
const sqlInjectionPattern =
  /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)*|INSERT( INTO)*|MERGE|SELECT|UPDATE|UNION( ALL)*|EXEC|OR|AND)\b)/gi;

// .replace(/[^a-zA-Z\s]/g, '')   // Remove non-alphabetic characters
// .replace(/\s{2,}/g, ' ')       // Replace multiple spaces with single space
// .replace(/^\s/, '');          // Trim leading space
//.replace(/[^a-zA-Z ]/g, '') // allow only letters & space
//                  .replace(/\s+/g, ' ') // collapse multiple spaces into one
//                .trimStart(), // no space at start










// Only alphabets + single space between words
export const OnlyAlphabetsSingleSpace = (text: string) => {
  return text
    .replace(/[^a-zA-Z ]/g, '') // allow only letters & space
    .replace(/\s+/g, ' ') // multiple spaces → single
    .replace(/^\s/, ''); // no leading space
};


// Only letters, numbers & underscore
// export const OnlyAlphaNumericUnderscore = (text: string) => {
//   return text.replace(/[^a-zA-Z0-9_]/g, '');
// };
// Only letters, numbers, underscore & single space between words
export const OnlyAlphaNumericUnderscore = (text: string) => {
  return text
    .replace(/[^a-zA-Z0-9_ ]/g, '') // allow letters, numbers, underscore, space
    .replace(/\s+/g, ' ')          // multiple spaces → single space
    .replace(/^\s/, '');           // no leading space
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



export const DollarAmountInput = (text: string) => {
  let formatted = text.replace(/[^0-9.]/g, '');

  const dots = formatted.split('.').length - 1;
  if (dots > 1) {
    const firstDotIndex = formatted.indexOf('.');
    formatted = formatted.substring(0, firstDotIndex + 1) +
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


const isSQLInjectionSafe = (input: any) => {
  return !sqlInjectionPattern.test(input);
};

// Validation to check for XSS patterns
const xssPattern = /(<([^>]+)>)/gi;

const isXSSSafe = (input: any) => {
  return !xssPattern.test(input);
};

// Email pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strong password pattern
export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const isValidEmail = (email: string) => {
  return emailPattern.test(email);
};
// Combined function to check for SQL injection and XSS
const isSafeInput = (input: any) => {
  return isSQLInjectionSafe(input) && isXSSSafe(input);
};

export const validateName = (name: any) => {
  if (!name.trim()) {
    return 'Please enter a name.';
  } else if (!isSafeInput(name)) {
    return 'Input contains invalid characters.';
  } else if (name.length < 3) {
    return 'Name must be at least 3 characters';
  } else {
    return '';
  }
};

export const validateMessage = (message: any) => {
  if (!message.trim()) {
    return 'Please enter a message.';
  } else if (message.length < 10) {
    return 'Message is too short.';
  } else {
    return '';
  }
};



export const validateAmount = (amount: any) => {
  if (!amount.trim()) {
    return 'Please enter a amount.';
  } else if (amount.length < 1) {
    return 'Amount is too low.';
  } else {
    return '';
  }
};


export const validateVerificationCode = (code: string): string => {
  if (!code.trim()) {
    return 'Please enter verification code.';
  } else if (code.length < 4) {
    return 'Verification code must be 4 digits.';
  } else if (!/^\d+$/.test(code)) {
    return 'Verification code must contain only numbers.';
  } else if (code.length > 4) {
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
  // Allows: 0.5, 1, 1.50, 0.01, etc.
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
  if (!username.trim()) {
    return 'Username is required.';
  } else if (!isSafeInput(username)) {
    return 'Input contains invalid characters.';
  } else if (username.length < 3) {
    return 'Username must be at least 3 characters.';
  } else {
    return '';
  }
};

// export const validateIFSC = (ifsc: any) => {
//   if (!ifsc.trim()) {
//     return 'Ifsc Code is required.';
//   } else if (!isSafeInput(ifsc)) {
//     return 'Input contains invalid characters.';
//   } else if (ifsc.length < 3) {
//     return 'IFSC must be at least 3 characters.';
//   } else {
//     return '';
//   }
// };




export const validateIfscCode = (ifsc: string): string => {
  if (!ifsc || ifsc.trim() === '') {
    return 'IFSC code is required';
  }
  // IFSC format: 4 letters + 7 alphanumeric characters
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
    return 'Enter a valid IFSC code (e.g., SBIN0012345)';
  }
  return '';
};

export const validateEmail = (email: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Please enter your email.';
  } else if (!isSafeInput(email)) {
    return 'Input contains invalid characters.';
  } else if (!emailRegex.test(email)) {
    return 'Please enter a valid email.';
  } else {
    return '';
  }
};

export const validatePassword = (password: any) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  if (!password.trim()) {
    return 'Please enter your password.';
  } else if (!isSafeInput(password)) {
    return 'Input contains invalid characters.';
  }
  else if (!passwordRegex.test(password)) {
    return "Password should be between 8 to 15 characters and should contain at least one uppercase, one lowercase, one number, and one special character.";
  }
  else {
    return '';
  }
};

export const validateNewPassword = (password: any, oldPassword: any) => {
  if (!password.trim()) {
    return 'Please enter your new password.';
  } else if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  } else if (!isSafeInput(password)) {
    return 'Input contains invalid characters.';
  } else if (password === oldPassword) {
    return 'Old password and New password must not be same.';
  } else {
    return validatePassword(password);
  }
};

export const validateConfirmPassword = (
  password: any,
  confirmPassword: any,
) => {
  if (!confirmPassword.trim()) {
    return 'Please enter your confirm password.';
  } else if (confirmPassword.length < 6) {
    return 'Password must be at least 6 characters long.';
  } else if (!isSafeInput(confirmPassword)) {
    return 'Input contains invalid characters.';
  } else if (password !== confirmPassword) {
    return 'New Password and Confirm password must be same.';
  } else {
    return '';
  }
};

export const validateNewConfirmPassword = (
  password: any,
  confirmPassword: any,
) => {
  if (!confirmPassword.trim()) {
    return 'Please enter your new password.';
  } else if (!isSafeInput(confirmPassword)) {
    return 'Input contains invalid characters.';
  } else if (password !== confirmPassword) {
    return 'New password and confirm password must be same.';
  } else {
    return '';
  }
};

export const validateOldPassword = (password: any) => {
  if (!password.trim()) {
    return 'Please enter old password.';
  } else if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  } else if (!isSafeInput(password)) {
    return 'Input contains invalid characters.';
  } else {
    return '';
  }
};


export const validateCountryName = (countryName: any) => {
  if (!countryName.trim()) {
    return 'Please select a country.';
  } else {
    return '';
  }
};




export const validateUserId = (userId: any) => {
  if (!userId || userId.trim() === '') {
    return 'Please enter User ID.';
  } else {
    return '';
  }
};

export const validateBankName = (bankName: any) => {
  if (!bankName.trim()) {
    return 'Please select a bank.';
  } else {
    return '';
  }
};




// export const validateMobileNumber = (mobileNumber: any) => {
//   // Mobile number regex validation with optional country code
//   // const mobileNumberRegex = /^\d{10}$/; // 10 Digit mobile Number Validation Check
//   const mobileNumberRegex = /^\+?\d{1,3}?\d{7,15}$/; // 7-15 Digit mobile Number Validation Check
//   if (!mobileNumber.trim()) {
//     return 'Please enter mobile number.';
//   } else if (!isSafeInput(mobileNumber)) {
//     return 'Input contains invalid characters.';
//   } else if (!mobileNumberRegex.test(mobileNumber)) {
//     return 'Please enter a valid mobile number.';
//   } else {
//     return '';
//   }
// };
export const validateMobileNumber = (mobileNumber: any) => {
  // Allows optional country code and 7–15 digits
  const mobileNumberRegex = /^\+?\d{1,3}?\d{7,15}$/;

  if (!mobileNumber?.trim()) {
    return 'Please enter mobile number.';
  } else if (!isSafeInput(mobileNumber)) {
    return 'Mobile number contains invalid characters.';
  } else if (!mobileNumberRegex.test(mobileNumber)) {
    return 'Please enter a valid mobile number (7-15 digits).';
  } else {
    return '';
  }
};

// export const validateAccountNumber = (accountNumber: any) => {
//   // Mobile number regex validation with optional country code
//   const accountNumberRegex = /^\+?\d{1,3}?\d{7,15}$/;
//   if (!accountNumber.trim()) {
//     return 'Account number is required.';
//   } else if (!isSafeInput(accountNumber)) {
//     return 'Input contains invalid characters.';
//   } else if (!accountNumberRegex.test(accountNumber)) {
//     return 'Please enter a valid account number.';
//   } else {
//     return '';
//   }
// };

export const validateAccountHolderName = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'Account holder name is required';
  }
  if (name.length < 3) {
    return 'Account holder name must be at least 3 characters';
  }
  if (name.length > 50) {
    return 'Account holder name must be less than 50 characters';
  }
  return '';
};



export const validateAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.trim() === '') {
    return 'Account number is required';
  }
  if (!/^\d+$/.test(accountNumber)) {
    return 'Account number must contain only numbers';
  }
  if (accountNumber.length < 9 || accountNumber.length > 18) {
    return 'Account number must be between 9 and 18 digits';
  }
  return '';
};
export const validatePincode = (pincode: any) => {
  const pincodeRegex = /^\d{4,10}$/;
  if (!pincode.trim()) {
    return 'Pincode no. is required.';
  } else if (!isSafeInput(pincode)) {
    return 'Input contains invalid characters.';
  } else if (!pincodeRegex.test(pincode)) {
    return 'Pincode no. must be 4 to 10 digits.';
  } else {
    return '';
  }
};

export const validateOtp = (otp: any) => {
  const otpRegex = /^\d{6}$/;
  if (!otp.trim()) {
    return 'OTP is required.';
  } else if (!isSafeInput(otp)) {
    return 'Input contains invalid characters.';
  } else if (!otpRegex.test(otp)) {
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
  const allowedFormats = ['image/jpeg', 'image/png'];
  if (!image) {
    return 'Uploaded file format is not supported.';
  } else if (!allowedFormats.includes(image.type)) {
    return 'Uploaded file format is not supported.';
  } else {
    return '';
  }
};

export const validateMandatory = (value: any) => {
  if (!value.trim()) {
    return 'Please enter all required details.';
  } else if (!isSafeInput(value)) {
    return 'Input contains invalid characters.';
  } else {
    return '';
  }
};

export const validateCredentials = (credentials: any) => {
  if (!credentials.trim()) {
    return 'Your credentials do not match.';
  } else if (!isSafeInput(credentials)) {
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

// export const validateCountryCode = (countryCode: any) => {
//   // Country code should be in the format +XXX where X is a digit
//   const countryCodeRegex = /^\+\d{1,3}$/;
//   if (!countryCode.trim()) {
//     return 'Country code is required.';
//   } else if (!isSafeInput(countryCode)) {
//     return 'Input contains invalid characters.';
//   } else if (!countryCodeRegex.test(countryCode)) {
//     return 'Please enter a valid country code in the format +XXX.';
//   } else {
//     return '';
//   }
// };


export const validateCountryCode = (countryCode: string) => {
  if (!countryCode?.trim()) {
    return 'Country code is required.';
  }

  // const cleanCode = countryCode.trim();

  // if (!/^\+\d{1,3}$/.test(cleanCode)) {
  //   return 'Country code must be like +91';
  // }

  return '';
};

export const validateGender = (gender: any) => {
  const validGenders = ['Male', 'Female', 'Other'];
  if (!gender.trim()) {
    return 'Please select a gender.';
  } else if (!isSafeInput(gender)) {
    return 'Input contains invalid characters.';
  } else if (!validGenders.includes(gender)) {
    return 'Please select a valid gender.';
  } else {
    return '';
  }
};



export const getPhoneLength = (country: any) => {
  const example = getExampleNumber(country, metadata);
  return example?.nationalNumber?.length || null;
};



export const getPhoneLengthRange = (iso2: any) => {
  const countryData: any = metadata.countries[iso2];

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
  iso2: any,
) => {
  console.log('countryCode', countryCode)
  console.log('phone', phone)
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
  const countryData: any = metadata.countries[iso2];

  if (!countryData) return null;

  const possibleLengths = countryData[3]; // possible lengths array

  if (!possibleLengths || possibleLengths.length === 0) return null;

  return Math.max(...possibleLengths);
};

export const validate_MobileNumber_With_Country = (
  phone: string,
  countryCode: string,
  iso2: string,
) => {

  console.log('phonephonephonephonephone', phone)
  console.log('countryCodecountryCodecountryCodecountryCode', countryCode)
  console.log('iso2iso2iso2iso2', iso2)

  if (!phone) {
    return 'Please enter phone number';
  }

  const countryData: any = metadata.countries[iso2];
  // console.log('countryDatacountryData',countryData)
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

  const lengthCheck = validatePhoneNumberLength(fullNumber, iso2);

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













// export const validate_MobileNumber_With_Country_Better = (
//   phone: string,
//   countryCode: string,
//   iso2: string,
// ) => {
//   if (!phone) {
//     return 'Please enter phone number';
//   }

//   try {
//     const fullNumber = phone.startsWith('+') ? phone : `+${countryCode.replace('+', '')}${phone}`;
//     const phoneNumber = parsePhoneNumberFromString(fullNumber, iso2);
    
//     if (!phoneNumber || !phoneNumber.isValid()) {
//       return `Invalid phone number for ${iso2}`;
//     }
    
//     // Verify country matches
//     if (phoneNumber.country !== iso2) {
//       return `Phone number doesn't belong to selected country (${iso2})`;
//     }
    
//     return '';
//   } catch (error) {
//     return 'Invalid phone number format';
//   }
// };




// export const validate_MobileNumber_With_Country = (
//   phone: string,
//   countryCode: string,
//   iso2: string,
// ) => {
//     console.log('phone,countryCode,iso2',phone,countryCode,iso2)
//   if (!phone) {
//     return 'Please enter phone number';
//   }

//   try {
//     const cleanPhone = phone.replace(/\D/g, '');
//     const fullNumber = `+${countryCode.replace('+', '')}${cleanPhone}`;
    
//     const phoneNumber = parsePhoneNumberFromString(fullNumber);
    
//     if (!phoneNumber) {
//       return 'Invalid phone number';
//     }
    
//     // Get country name from metadata (optional)
//     const countryNames: Record<string, string> = {
//       'US': 'United States',
//       'AG': 'Antigua and Barbuda',
//       'IN': 'India',
//       // add more as needed
//     };
//     const countryName = countryNames[iso2] || iso2;
    
//     if (!phoneNumber.isValid() || phoneNumber.country !== iso2) {
//       const metadata = require('libphonenumber-js/metadata.min.json');
//       const countryLengths = metadata.countries[iso2]?.[3];
      
//       if (countryLengths && countryLengths.length > 0) {
//         const minLength = Math.min(...countryLengths);
//         const maxLength = Math.max(...countryLengths);
        
//         if (minLength === maxLength) {
//           return `Phone number must be exactly ${minLength} digits for ${countryName}`;
//         } else {
//           return `Phone number must be between ${minLength} and ${maxLength} digits for ${countryName}`;
//         }
//       }
      
//       return `Invalid phone number for ${countryName}`;
//     }
    
//     return '';
//   } catch (error) {
//     return 'Invalid phone number format';
//   }
// };