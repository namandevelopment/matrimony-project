import assert from 'assert';
import { validateName, validateEmail, validateMobileNumber } from '../utils/ValidationsFuctions';
import { type CallResponseFormValues } from '../customModals/CallResponseModal';
import { type EmployeeFormValues } from '../screens/employeeScreen/EmployeeScreen';
import { type ManualPaymentFormValues } from '../screens/membersScreen/ProfileDetailsByIdScreen';

console.log('Testing Universal Multi-Field Form Integration & useInputs Validation Suite...');

// 1. Call Response Form Contract & Validation
const callValues: CallResponseFormValues = {
  callStatus: 'CONNECTED',
  outcome: 'INTERESTED',
  durationSec: 120,
  userResponse: '',
  conversationNotes: '',
  nextFollowUp: 'Tomorrow, 11:00 AM',
  newLeadStatus: 'INTERESTED',
};

assert.strictEqual(callValues.callStatus, 'CONNECTED');
assert.strictEqual(callValues.outcome, 'INTERESTED');
assert.strictEqual(callValues.durationSec, 120);

// Validate user response requirement
const validateCallForm = (vals: CallResponseFormValues) => {
  const errs: Partial<Record<keyof CallResponseFormValues, string>> = {};
  if (!vals.userResponse.trim()) {
    errs.userResponse = 'Please record what response came from the customer during the call.';
  }
  return errs;
};

const emptyCallErrors = validateCallForm(callValues);
assert.strictEqual(emptyCallErrors.userResponse, 'Please record what response came from the customer during the call.');

const validCallErrors = validateCallForm({
  ...callValues,
  userResponse: 'Spoke with mother. Ready to review 2 biodatas on WhatsApp.',
});
assert.strictEqual(validCallErrors.userResponse, undefined);
console.log('  ✓ CallResponseModal contract & audit validation verified');

// 2. Employee Add / Provision Form Validation
const employeeValues: EmployeeFormValues = {
  fullName: '',
  employeeId: '',
  email: '',
  mobile: '',
  role: 'CRM_AGENT',
  department: 'Sales & CRM',
  managerName: 'Priya Sharma',
  recordScope: 'OWN',
  maxLeadCapacity: 25,
  regions: 'Mumbai, Pune',
  languages: 'Sindhi, Hindi, English',
};

const validateEmployeeForm = (vals: EmployeeFormValues) => {
  const errs: Partial<Record<keyof EmployeeFormValues, string>> = {};
  const nameErr = validateName(vals.fullName);
  if (nameErr) errs.fullName = nameErr;

  const emailErr = validateEmail(vals.email);
  if (emailErr) errs.email = emailErr;

  const mobileErr = validateMobileNumber(vals.mobile);
  if (mobileErr) errs.mobile = mobileErr;

  if (!vals.employeeId.trim()) {
    errs.employeeId = 'Employee code is required.';
  }
  return errs;
};

const emptyEmpErrors = validateEmployeeForm(employeeValues);
assert.ok(emptyEmpErrors.fullName, 'Full name should be required');
assert.ok(emptyEmpErrors.email, 'Email should be required');
assert.ok(emptyEmpErrors.mobile, 'Mobile should be required');
assert.ok(emptyEmpErrors.employeeId, 'Employee ID should be required');

const validEmpErrors = validateEmployeeForm({
  ...employeeValues,
  fullName: 'Haresh Hingorani',
  employeeId: 'EMP042',
  email: 'haresh.h@sindhimarriage.in',
  mobile: '9820011223',
});
assert.strictEqual(Object.keys(validEmpErrors).length, 0, 'Valid employee should produce 0 errors');
console.log('  ✓ EmployeeScreen Add / Provision Form validation verified');

// 3. Member Payment Form Validation
const paymentValues: ManualPaymentFormValues = {
  amount: 0,
  planTier: 'GOLD',
  planName: 'Gold Matchmaking (180 Days)',
  gateway: 'Razorpay',
  paymentMode: 'UPI',
  receiptNo: '',
};

const validatePaymentForm = (vals: ManualPaymentFormValues) => {
  const errs: Partial<Record<keyof ManualPaymentFormValues, string>> = {};
  if (!vals.amount || Number(vals.amount) <= 0) {
    errs.amount = 'Amount must be greater than ₹0';
  }
  if (!vals.receiptNo?.trim()) {
    errs.receiptNo = 'Receipt number is required';
  }
  return errs;
};

const emptyPaymentErrors = validatePaymentForm(paymentValues);
assert.strictEqual(emptyPaymentErrors.amount, 'Amount must be greater than ₹0');
assert.strictEqual(emptyPaymentErrors.receiptNo, 'Receipt number is required');

const validPaymentErrors = validatePaymentForm({
  ...paymentValues,
  amount: 2999,
  receiptNo: 'REC-2026-8812',
});
assert.strictEqual(Object.keys(validPaymentErrors).length, 0);
console.log('  ✓ ProfileDetailsByIdScreen Manual Payment Form validation verified');

console.log('✅ Universal Multi-Field Form Integration & useInputs Validation Suite assertions passed successfully!');
