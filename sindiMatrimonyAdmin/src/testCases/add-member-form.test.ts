import assert from 'assert';
import {
  validateMemberForm,
  generateInitialValues,
  TAB_FIELDS,
  TABS,
  type AddMemberFormValues,
} from '../screens/membersScreen/AddMemberScreen';

console.log('Testing AddMemberScreen Form & Validation Suite with useInputs...');

// 1. Initial State Contract
const initialMale = generateInitialValues('Male');
assert.strictEqual(initialMale.gender, 'Male');
assert.ok(initialMale.uniqueId.startsWith('E10'), 'Male unique ID should start with E10');
assert.strictEqual(initialMale.fullName, '');
assert.strictEqual(initialMale.mobile, '');
assert.strictEqual(initialMale.isVerified, true);
assert.strictEqual(initialMale.plan, 'PLATINUM');
assert.strictEqual(initialMale.status, 'ACTIVE');

const initialFemale = generateInitialValues('Female');
assert.strictEqual(initialFemale.gender, 'Female');
assert.ok(initialFemale.uniqueId.startsWith('A8'), 'Female unique ID should start with A8');

// 2. Tab Fields Mapping Contract
assert.strictEqual(TABS.length, 7, 'Must have 7 wizard tabs');
TABS.forEach((tab) => {
  assert.ok(TAB_FIELDS[tab.id], `Tab ${tab.id} must have fields defined`);
  assert.ok(TAB_FIELDS[tab.id].length > 0, `Tab ${tab.id} must have at least 1 field`);
});

// 3. Validation Rules Tests
// Empty form should flag required fields
const emptyErrors = validateMemberForm(initialMale);
assert.strictEqual(emptyErrors.fullName, 'Full Name is required.');
assert.strictEqual(emptyErrors.mobile, 'Mobile number is required.');

// Short Full Name
const shortNameErrors = validateMemberForm({
  ...initialMale,
  fullName: 'Al',
});
assert.strictEqual(shortNameErrors.fullName, 'Full Name must be at least 3 characters.');

// XSS/SQL Injection in Full Name
const unsafeNameErrors = validateMemberForm({
  ...initialMale,
  fullName: '<script>alert("xss")</script>',
});
assert.strictEqual(unsafeNameErrors.fullName, 'Full Name contains invalid characters.');

// Valid Full Name
const validNameErrors = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
});
assert.strictEqual(validNameErrors.fullName, undefined);

// Mobile Validation
const shortMobileErrors = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '982001',
});
assert.strictEqual(shortMobileErrors.mobile, 'Please enter a valid 10-digit mobile number.');

const invalidMobileChar = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '<script>',
});
assert.strictEqual(invalidMobileChar.mobile, 'Mobile number contains invalid characters.');

const validMobileErrors = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
});
assert.strictEqual(validMobileErrors.mobile, undefined);

// Password & Confirm Password Mismatch
const passwordMismatch = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  password: 'Password@123',
  confirmPassword: 'MismatchPassword',
});
assert.strictEqual(passwordMismatch.confirmPassword, 'Passwords do not match.');

// Short Password
const shortPassword = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  password: '123',
  confirmPassword: '123',
});
assert.strictEqual(shortPassword.password, 'Password must be at least 6 characters.');

// Age & Date of Birth
const underageDob = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  dob: '2015-01-01',
});
assert.strictEqual(underageDob.dob, 'Member must be at least 18 years old.');

const validDob = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  dob: '1995-06-15',
});
assert.strictEqual(validDob.dob, undefined);

// Email (optional, but validated if provided)
const invalidEmail = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  email: 'not-an-email',
});
assert.strictEqual(invalidEmail.email, 'Please enter a valid email address.');

const validEmail = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  email: 'haresh.jagtiani@example.com',
});
assert.strictEqual(validEmail.email, undefined);

// Optional Verifications (Aadhaar 12-digits)
const invalidAadhaar = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  verifyAadhaar: '12345',
});
assert.strictEqual(invalidAadhaar.verifyAadhaar, 'Aadhaar must be a 12-digit number.');

const validAadhaar = validateMemberForm({
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  verifyAadhaar: '123456789012',
});
assert.strictEqual(validAadhaar.verifyAadhaar, undefined);

// Fully Valid Member Form
const validForm: AddMemberFormValues = {
  ...initialMale,
  fullName: 'Haresh Jagtiani',
  mobile: '9820011223',
  email: 'haresh@example.com',
  dob: '1996-04-10',
};
const noErrors = validateMemberForm(validForm);
assert.strictEqual(Object.keys(noErrors).length, 0, 'Valid form should have zero errors');

console.log('✅ AddMemberScreen Form & Validation Suite assertions passed successfully!');
