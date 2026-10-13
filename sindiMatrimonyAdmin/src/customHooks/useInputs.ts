import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import fastDeepEqual from 'fast-deep-equal';

export type FormValues = Record<string, any>;

/**
 * Clean binding object for standard input, textarea, and select elements.
 */
export interface FieldBinding<V = any> {
  name: string;
  value: V;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | V) => void;
  onBlur: (e?: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

/**
 * Clean binding object for boolean checkbox elements.
 */
export interface CheckboxBinding {
  name: string;
  type: 'checkbox';
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | boolean) => void;
  onBlur: (e?: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * 0-Re-render binding object for uncontrolled input elements using refs.
 */
export interface RegisterBinding<V = any> {
  name: string;
  defaultValue: V;
  ref: (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e?: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export interface UseInputsOptions<T extends FormValues> {
  /** Optional custom validation function returning record of field errors */
  validate?: (values: T) => Partial<Record<keyof T, string>> | undefined;
  /** Validate whenever values change (default: false to maximize typing performance) */
  validateOnChange?: boolean;
  /** Validate when field loses focus (default: true) */
  validateOnBlur?: boolean;
  /** Optional callback triggered on field changes */
  onFieldChange?: <K extends keyof T>(field: K, value: T[K], allValues: T) => void;
}

export interface UseInputsReturn<T extends FormValues> {
  /** The reactive state containing all form values */
  values: T;

  /** Synchronously get latest form values without triggering or subscribing to re-renders */
  getValues: () => T;

  /** Synchronously get a single field value from ref without subscribing to re-renders */
  getValue: <K extends keyof T>(field: K) => T[K];

  /** Directly update a single field with strong type-safety */
  setFieldValue: <K extends keyof T>(field: K, value: T[K] | ((prev: T[K]) => T[K])) => void;

  /** Batch update multiple fields in a single atomic render */
  setValues: (updater: Partial<T> | ((prev: T) => T)) => void;

  /**
   * Universal change handler:
   * - Native event: `<input name="email" value={values.email} onChange={handleChange} />`
   * - Curried: `<input value={values.email} onChange={handleChange('email')} />`
   * - 2-args setter: `handleChange('gender', 'Male')`
   */
  handleChange: {
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void;
    <K extends keyof T>(field: K): (
      eOrValue: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | T[K]
    ) => void;
    <K extends keyof T>(field: K, value: T[K]): void;
  };

  /**
   * Universal blur handler:
   * - `<input onBlur={handleBlur} />`
   * - `<input onBlur={handleBlur('email')} />`
   */
  handleBlur: {
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void;
    <K extends keyof T>(field: K): (e?: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  };

  /**
   * Clean binding for input/select/textarea:
   * `<input {...bind('fullName')} placeholder="Full Name" />`
   */
  bind: <K extends keyof T>(field: K) => FieldBinding<T[K]>;

  /**
   * Clean binding for boolean checkboxes:
   * `<input type="checkbox" {...bindCheckbox('isVerified')} />`
   */
  bindCheckbox: <K extends keyof T>(field: K) => CheckboxBinding;

  /**
   * High-Performance 0-Re-render Uncontrolled Binding:
   * Connects DOM node via ref & defaultValue. Typing updates ref internally without re-rendering parent screen!
   * `<input {...register('bio')} placeholder="Notes" />`
   */
  register: <K extends keyof T>(
    field: K,
    options?: { syncOnBlur?: boolean }
  ) => RegisterBinding<T[K]>;

  /** Reset form to initial state (or provide new initial defaults) */
  reset: (newInitialValues?: Partial<T>) => void;

  /** Boolean indicating if any form value has been modified from initial state */
  dirty: boolean;

  /** Check if a specific field or entire form is modified */
  isDirty: <K extends keyof T>(field?: K) => boolean;

  /** Record of touched fields */
  touched: Partial<Record<keyof T, boolean>>;

  /** Set field touched state */
  setFieldTouched: <K extends keyof T>(field: K, isTouched?: boolean) => void;

  /** Record of validation error messages */
  errors: Partial<Record<keyof T, string>>;

  /** Set an error message for a specific field */
  setFieldError: <K extends keyof T>(field: K, errorMessage?: string) => void;

  /** Clear an error message for a specific field */
  clearFieldError: <K extends keyof T>(field: K) => void;

  /** Clear all error messages */
  clearErrors: () => void;

  /** Boolean indicating if there are any current errors */
  hasErrors: boolean;

  /** Run validation manually (returns true if valid, false if errors found) */
  validateForm: () => boolean;
}

/**
 * Universal, Highly-Optimized Form & Input Management Hook.
 * Eliminates boilerplate `useState` and individual setter functions on screens.
 * Uses referentially stable callbacks and zero-ref render access to satisfy React 19 standards.
 *
 * @param initialValues Object or initializer function containing initial form values.
 * @param options Configuration for validation, change triggers, and blur handling.
 */
export function useInputs<T extends FormValues>(
  initialValues: T | (() => T),
  options: UseInputsOptions<T> = {}
): UseInputsReturn<T> {
  const {
    validate,
    validateOnChange = false,
    validateOnBlur = true,
    onFieldChange,
  } = options;

  // Resolve initial state safely
  const resolveInitial = useCallback((): T => {
    return typeof initialValues === 'function' ? (initialValues as () => T)() : initialValues;
  }, [initialValues]);

  const [initialValuesState, setInitialValuesState] = useState<T>(resolveInitial);
  const [values, setValuesState] = useState<T>(resolveInitial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // Synchronous references updated outside render to prevent React 19 ref warnings
  const initialValuesRef = useRef<T>(initialValuesState);
  const valuesRef = useRef<T>(values);
  const onFieldChangeRef = useRef(onFieldChange);
  const validateRef = useRef(validate);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    onFieldChangeRef.current = onFieldChange;
  }, [onFieldChange]);

  useEffect(() => {
    validateRef.current = validate;
  }, [validate]);

  // Map of uncontrolled DOM elements registered via register()
  const registeredInputsRef = useRef<Map<keyof T, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>(new Map());

  // Helper: Synchronously read value from either registered DOM input or valuesRef
  const getValue = useCallback(<K extends keyof T>(field: K): T[K] => {
    const domNode = registeredInputsRef.current.get(field);
    if (domNode) {
      if (domNode instanceof HTMLInputElement && domNode.type === 'checkbox') {
        return domNode.checked as unknown as T[K];
      }
      return domNode.value as unknown as T[K];
    }
    return valuesRef.current[field];
  }, []);

  // Helper: Get complete values snapshot (merges registered DOM values + current values)
  const getValues = useCallback((): T => {
    const snapshot = { ...valuesRef.current };
    registeredInputsRef.current.forEach((domNode, key) => {
      if (domNode) {
        if (domNode instanceof HTMLInputElement && domNode.type === 'checkbox') {
          (snapshot as any)[key] = domNode.checked;
        } else {
          (snapshot as any)[key] = domNode.value;
        }
      }
    });
    return snapshot;
  }, []);

  // Helper: Run validation safely
  const runValidation = useCallback((currentValues: T): boolean => {
    if (!validateRef.current) return true;
    const newErrors = validateRef.current(currentValues) || {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Set single field value
  const setFieldValue = useCallback(<K extends keyof T>(
    field: K,
    valueOrUpdater: T[K] | ((prev: T[K]) => T[K])
  ) => {
    setValuesState((prev) => {
      const prevVal = prev[field];
      const nextVal = typeof valueOrUpdater === 'function'
        ? (valueOrUpdater as (prevVal: T[K]) => T[K])(prevVal)
        : valueOrUpdater;

      if (Object.is(prevVal, nextVal)) {
        return prev;
      }

      const next = { ...prev, [field]: nextVal };
      valuesRef.current = next;

      // Sync registered DOM node if present
      const domNode = registeredInputsRef.current.get(field);
      if (domNode) {
        if (domNode instanceof HTMLInputElement && domNode.type === 'checkbox') {
          domNode.checked = Boolean(nextVal);
        } else {
          domNode.value = String(nextVal ?? '');
        }
      }

      if (onFieldChangeRef.current) {
        onFieldChangeRef.current(field, nextVal, next);
      }

      if (validateOnChange) {
        runValidation(next);
      }

      return next;
    });
  }, [validateOnChange, runValidation]);

  // Batch update multiple fields
  const setValues = useCallback((updater: Partial<T> | ((prev: T) => T)) => {
    setValuesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      valuesRef.current = next;

      registeredInputsRef.current.forEach((domNode, key) => {
        if (domNode && key in next) {
          const val = next[key];
          if (domNode instanceof HTMLInputElement && domNode.type === 'checkbox') {
            domNode.checked = Boolean(val);
          } else {
            domNode.value = String(val ?? '');
          }
        }
      });

      if (validateOnChange) {
        runValidation(next);
      }

      return next;
    });
  }, [validateOnChange, runValidation]);

  // Universal change handler (stable reference)
  const handleChange = useCallback((...args: any[]): any => {
    if (typeof args[0] === 'string') {
      const field = args[0] as keyof T;

      if (args.length >= 2) {
        setFieldValue(field, args[1]);
        return;
      }

      return (eOrValue: any) => {
        if (eOrValue && typeof eOrValue === 'object' && 'target' in eOrValue) {
          const target = eOrValue.target;
          const val = target.type === 'checkbox' ? target.checked : target.value;
          setFieldValue(field, val);
        } else {
          setFieldValue(field, eOrValue);
        }
      };
    }

    const e = args[0];
    if (e && e.target) {
      const target = e.target as HTMLInputElement;
      const name = target.name as keyof T;
      if (!name) return;

      const val: any = target.type === 'checkbox' ? target.checked : target.value;
      setFieldValue(name, val);
    }
  }, [setFieldValue]) as UseInputsReturn<T>['handleChange'];

  // Universal blur handler
  const handleBlur = useCallback((...args: any[]): any => {
    if (typeof args[0] === 'string') {
      const field = args[0] as keyof T;
      return () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (validateOnBlur) {
          runValidation(valuesRef.current);
        }
      };
    }

    const e = args[0];
    if (e && e.target) {
      const name = e.target.name as keyof T;
      if (name) {
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (validateOnBlur) {
          runValidation(valuesRef.current);
        }
      }
    }
  }, [validateOnBlur, runValidation]) as UseInputsReturn<T>['handleBlur'];

  // Pure React bind helper (reads reactive state values[field], no ref-in-render violations)
  const bind = useCallback(<K extends keyof T>(field: K): FieldBinding<T[K]> => {
    return {
      name: String(field),
      value: values[field],
      onChange: (eOrValue: any) => {
        if (eOrValue && typeof eOrValue === 'object' && 'target' in eOrValue) {
          const target = eOrValue.target as HTMLInputElement;
          const val = target.type === 'checkbox' ? target.checked : target.value;
          setFieldValue(field, val as T[K]);
        } else {
          setFieldValue(field, eOrValue as T[K]);
        }
      },
      onBlur: () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (validateOnBlur) {
          runValidation(valuesRef.current);
        }
      },
    };
  }, [values, setFieldValue, validateOnBlur, runValidation]);

  // Pure React bindCheckbox helper
  const bindCheckbox = useCallback(<K extends keyof T>(field: K): CheckboxBinding => {
    return {
      name: String(field),
      type: 'checkbox',
      checked: Boolean(values[field]),
      onChange: (eOrBool: any) => {
        const checked = typeof eOrBool === 'boolean' ? eOrBool : Boolean(eOrBool?.target?.checked);
        setFieldValue(field, checked as unknown as T[K]);
      },
      onBlur: () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (validateOnBlur) {
          runValidation(valuesRef.current);
        }
      },
    };
  }, [values, setFieldValue, validateOnBlur, runValidation]);

  // Uncontrolled / 0-Re-render register helper
  const register = useCallback(<K extends keyof T>(
    field: K,
    regOptions: { syncOnBlur?: boolean } = {}
  ): RegisterBinding<T[K]> => {
    const defaultValue = initialValuesRef.current[field];

    return {
      name: String(field),
      defaultValue,
      ref: (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
        if (node) {
          registeredInputsRef.current.set(field, node);
        } else {
          registeredInputsRef.current.delete(field);
        }
      },
      onChange: (e: React.ChangeEvent<any>) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        valuesRef.current = { ...valuesRef.current, [field]: val };
      },
      onBlur: () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (regOptions.syncOnBlur) {
          const val = valuesRef.current[field];
          setFieldValue(field, val);
        }
        if (validateOnBlur) {
          runValidation(getValues());
        }
      },
    };
  }, [setFieldValue, validateOnBlur, runValidation, getValues]);

  // Reset function
  const reset = useCallback((newInitialValues?: Partial<T>) => {
    const nextInitial = newInitialValues
      ? { ...initialValuesRef.current, ...newInitialValues }
      : resolveInitial();

    initialValuesRef.current = nextInitial;
    valuesRef.current = nextInitial;
    setInitialValuesState(nextInitial);
    setValuesState(nextInitial);
    setTouched({});
    setErrors({});

    registeredInputsRef.current.forEach((domNode, key) => {
      if (domNode && key in nextInitial) {
        const val = nextInitial[key];
        if (domNode instanceof HTMLInputElement && domNode.type === 'checkbox') {
          domNode.checked = Boolean(val);
        } else {
          domNode.value = String(val ?? '');
        }
      }
    });
  }, [resolveInitial]);

  // Dirty checking
  const isDirty = useCallback(<K extends keyof T>(field?: K): boolean => {
    if (field) {
      return !fastDeepEqual(getValue(field), initialValuesRef.current[field]);
    }
    return !fastDeepEqual(getValues(), initialValuesRef.current);
  }, [getValue, getValues]);

  // Set field touched
  const setFieldTouched = useCallback(<K extends keyof T>(field: K, isFieldTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isFieldTouched }));
  }, []);

  // Error setters
  const setFieldError = useCallback(<K extends keyof T>(field: K, errorMessage?: string) => {
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  }, []);

  const clearFieldError = useCallback(<K extends keyof T>(field: K) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateForm = useCallback((): boolean => {
    return runValidation(getValues());
  }, [runValidation, getValues]);

  // Compute dirty state cleanly without reading refs during render
  const dirty = useMemo(() => !fastDeepEqual(values, initialValuesState), [values, initialValuesState]);
  const hasErrors = Object.keys(errors).length > 0;

  return {
    values,
    getValues,
    getValue,
    setFieldValue,
    setValues,
    handleChange,
    handleBlur,
    bind,
    bindCheckbox,
    register,
    reset,
    dirty,
    isDirty,
    touched,
    setFieldTouched,
    errors,
    setFieldError,
    clearFieldError,
    clearErrors,
    hasErrors,
    validateForm,
  };
}

export default useInputs;
