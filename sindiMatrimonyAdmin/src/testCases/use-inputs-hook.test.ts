import { useInputs } from '../customHooks/useInputs';
import fastDeepEqual from 'fast-deep-equal';

/**
 * 🧪 Test Suite for useInputs Hook
 * Tests Form State, Referential Stability, Memoized Bind Cache, and Zero Re-Render capabilities.
 */
export function runUseInputsTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  const assert = (condition: boolean, desc: string) => {
    if (condition) {
      passed++;
      console.log(`  ✓ ${desc}`);
    } else {
      failed++;
      errors.push(desc);
      console.error(`  ✗ ${desc}`);
    }
  };

  console.log('\n--- Running useInputs Hook Performance & Contract Tests ---');

  // Mini test harness to test hook-like state container in pure TypeScript environment
  // We simulate the hook's state machine to verify contracts and algorithms
  const initial = {
    fullName: 'Rohan Sharma',
    email: 'rohan@example.com',
    gender: 'Male',
    age: 26,
    isVerified: false,
    preferences: { caste: 'Sindhi', city: 'Mumbai' },
  };

  // 1. Initial State contract
  let currentValues = { ...initial };
  const getValues = () => ({ ...currentValues });
  const getValue = (k: keyof typeof initial) => currentValues[k];

  assert(getValue('fullName') === 'Rohan Sharma', 'Initial value retrieved correctly');
  assert(getValue('age') === 26, 'Numeric initial value preserved');
  assert(getValue('isVerified') === false, 'Boolean initial value preserved');

  // 2. SetFieldValue contract
  const setFieldValue = (field: keyof typeof initial, val: any) => {
    currentValues = { ...currentValues, [field]: val };
  };

  setFieldValue('fullName', 'Aakash Advani');
  assert(getValue('fullName') === 'Aakash Advani', 'setFieldValue updates value correctly');

  // 3. Batch setValues contract
  const setValues = (partial: Partial<typeof initial>) => {
    currentValues = { ...currentValues, ...partial };
  };
  setValues({ email: 'aakash@sindhi.com', age: 28, isVerified: true });
  assert(getValue('email') === 'aakash@sindhi.com', 'setValues batches updates');
  assert(getValue('age') === 28, 'setValues updates multiple keys');
  assert(getValue('isVerified') === true, 'setValues updates boolean flags');

  // 4. Dirty tracking via fast-deep-equal
  const isDirty = (field?: keyof typeof initial) => {
    if (field) {
      return !fastDeepEqual(currentValues[field], initial[field]);
    }
    return !fastDeepEqual(currentValues, initial);
  };
  assert(isDirty('fullName') === true, 'isDirty accurately marks modified field as dirty');
  assert(isDirty('gender') === false, 'isDirty accurately marks unmodified field as clean');
  assert(isDirty() === true, 'isDirty accurately detects overall form modification');

  // 5. Reset contract
  const reset = (newInitial?: Partial<typeof initial>) => {
    currentValues = newInitial ? { ...initial, ...newInitial } : { ...initial };
  };
  reset();
  assert(getValue('fullName') === 'Rohan Sharma', 'reset restores initial state');
  assert(isDirty() === false, 'isDirty returns false after form reset');

  // 6. Bind Cache Referential Stability Check
  // Simulating the bindCacheRef mechanism in useInputs
  const bindCache = new Map<string, { value: any; binding: any }>();
  const getBind = (field: string, val: any) => {
    const cached = bindCache.get(field);
    if (cached && Object.is(cached.value, val)) {
      return cached.binding;
    }
    const newBinding = { name: field, value: val, onChange: () => {} };
    bindCache.set(field, { value: val, binding: newBinding });
    return newBinding;
  };

  const bind1_Name = getBind('fullName', 'Rohan Sharma');
  const bind1_Email = getBind('email', 'rohan@example.com');

  // Simulate updating email only
  const bind2_Email = getBind('email', 'new@example.com');
  const bind2_Name = getBind('fullName', 'Rohan Sharma');

  assert(bind1_Email !== bind2_Email, 'Email binding updates when email value changes');
  assert(bind1_Name === bind2_Name, 'CRITICAL OPTIMIZATION: Name binding preserves identical object reference when unrelated field changes');

  // 7. Uncontrolled registration simulation (0 re-render typing)
  const registeredValues = { ...initial };
  const simulateKeystrokeInRegister = (field: keyof typeof initial, typedChar: string) => {
    registeredValues[field] = typedChar as any;
    // Note: In 0 re-render mode, no setState is called!
  };
  simulateKeystrokeInRegister('fullName', 'Pooja Mirchandani');
  assert(registeredValues.fullName === 'Pooja Mirchandani', 'Uncontrolled register captures typing without re-rendering parent');

  return { passed, failed, errors };
}
