import assert from 'assert';
import { toast, showToast, hideToast, toastConfig } from '../toastMessage/toast';
import { toast as customToast, showToast as customShowToast } from '../utils/CustomToast';

// ========================================================
// 🍞 Test Suite: Toast Message System
// ========================================================

console.log('Testing Toast Message System...');

// 1. Verify toast object methods
assert.strictEqual(typeof toast.show, 'function', 'toast.show should be a function');
assert.strictEqual(typeof toast.success, 'function', 'toast.success should be a function');
assert.strictEqual(typeof toast.error, 'function', 'toast.error should be a function');
assert.strictEqual(typeof toast.info, 'function', 'toast.info should be a function');
assert.strictEqual(typeof toast.warning, 'function', 'toast.warning should be a function');
assert.strictEqual(typeof toast.hide, 'function', 'toast.hide should be a function');

// 2. Verify re-exports from utils/CustomToast
assert.strictEqual(typeof customToast.success, 'function', 'customToast.success should be a function');
assert.strictEqual(typeof customShowToast, 'function', 'customShowToast should be a function');

// 3. Verify toastConfig keys
assert.ok(toastConfig.success, 'toastConfig.success should exist');
assert.ok(toastConfig.error, 'toastConfig.error should exist');
assert.ok(toastConfig.info, 'toastConfig.info should exist');
assert.ok(toastConfig.warning, 'toastConfig.warning should exist');

// 4. Test calling showToast with string
let showed = false;
let hidden = false;

// Mock requestAnimationFrame in node environment if needed
if (typeof globalThis.requestAnimationFrame !== 'function') {
  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 0) as any;
  };
  (globalThis as any).cancelAnimationFrame = (id: any) => {
    clearTimeout(id);
  };
}

showToast('Operation successful!', 'success');
toast.success('Lead updated successfully!');
toast.error('Failed to connect to telephony provider.');
toast.warning('Please enter your credentials.');
toast.info('Connecting to live session...');
toast.hide();

console.log('✅ All Toast System assertions passed successfully!');
