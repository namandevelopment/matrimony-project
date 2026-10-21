import assert from 'assert';
import {
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
  validateEmail,
  validatePassword,
  validateNewPassword,
  validateConfirmPassword,
  validateMobileNumber,
  validateIfscCode,
  validateAccountNumber,
  validateOtp,
  validatePincode,
  validate_MobileNumber_With_Country,
  validate_MobileNumber_With_Country_Better,
} from '../utils/ValidationsFuctions';
import ValidationsFromAlias from '../utils/validationUtils';

console.log('Testing Validation Functions & Input Sanitization Suite...');

// 1. Text Sanitization
assert.strictEqual(OnlyAlphabetsSingleSpace('  Rahul   Kumar 123! '), 'Rahul Kumar ');
assert.strictEqual(OnlyAlphaNumericUnderscore('User_123 !@#$ Test'), 'User_123 Test');
assert.strictEqual(OnlyNumbers('abc1234def56'), '123456');
assert.strictEqual(formatAlphaNumeric('a-b*c_1#2'), 'abc12');
assert.strictEqual(NumbersNoLeadingZero('00054321'), '54321');
assert.strictEqual(DollarAmountInput('12.34.56'), '12.3456');

// 2. Security Checks (SQLi & XSS)
assert.strictEqual(isSQLInjectionSafe('normal user input'), true);
assert.strictEqual(isSQLInjectionSafe('DROP TABLE users;'), false);
assert.strictEqual(isSQLInjectionSafe('SELECT * FROM employees'), false);
assert.strictEqual(isXSSSafe('hello world'), true);
assert.strictEqual(isXSSSafe('<script>alert(1)</script>'), false);
assert.strictEqual(isSafeInput('<svg onload=alert(1)>'), false);
assert.strictEqual(isSafeInput('safe text'), true);

// 3. Field Validators
assert.strictEqual(validateName(''), 'Please enter a name.');
assert.strictEqual(validateName('Jo'), 'Name must be at least 3 characters');
assert.strictEqual(validateName('Rajesh Mulchandani'), '');

assert.strictEqual(isValidEmail('admin@sindhimarriage.in'), true);
assert.strictEqual(isValidEmail('invalid-email'), false);
assert.strictEqual(validateEmail('test@example.com'), '');
assert.strictEqual(validateEmail('invalid'), 'Please enter a valid email.');

assert.strictEqual(validatePassword('Weak'), 'Password should be between 8 to 15 characters and should contain at least one uppercase, one lowercase, one number, and one special character.');
assert.strictEqual(validatePassword('Admin@1234'), '');

assert.strictEqual(validateNewPassword('Admin@1234', 'Admin@1234'), 'Old password and New password must not be same.');
assert.strictEqual(validateConfirmPassword('Admin@1234', 'Mismatch@1'), 'New Password and Confirm password must be same.');
assert.strictEqual(validateConfirmPassword('Admin@1234', 'Admin@1234'), '');

assert.strictEqual(validateMobileNumber('+919820011223'), '');
assert.strictEqual(validateMobileNumber('123'), 'Please enter a valid mobile number (7-15 digits).');

assert.strictEqual(validateIfscCode('SBIN0012345'), '');
assert.strictEqual(validateIfscCode('INVALID_IFSC'), 'Enter a valid IFSC code (e.g., SBIN0012345)');

assert.strictEqual(validateAccountNumber('123456789012'), '');
assert.strictEqual(validateAccountNumber('1234'), 'Account number must be between 9 and 18 digits');

assert.strictEqual(validateOtp('1234'), '');
assert.strictEqual(validateOtp('123'), 'Please enter a valid 4-digit OTP.');
assert.strictEqual(validateOtp('12345'), 'Please enter a valid 4-digit OTP.');

assert.strictEqual(validatePincode('400001'), '');
assert.strictEqual(validatePincode('40'), 'Pincode no. must be 4 to 10 digits.');

// 4. Country Mobile Number Validation
assert.strictEqual(validate_MobileNumber_With_Country('9820011223', '+91', 'IN'), '');
assert.strictEqual(validate_MobileNumber_With_Country_Better('9820011223', '+91', 'IN'), '');

// 5. Default export from alias check
assert.strictEqual(typeof ValidationsFromAlias.validateEmail, 'function');
assert.strictEqual(typeof ValidationsFromAlias.validatePassword, 'function');

console.log('✅ All Validation Functions assertions passed successfully!');
