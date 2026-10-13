import { useState } from 'react';

export const useInputs = <T extends Record<string, any>>(
  initialState: T,
) => {
  const [inputs, setInputs] = useState<T>(initialState);

  const [errors, setErrors] = useState<
    Partial<Record<keyof T, string>>
  >({});

  const updateInput = <K extends keyof T>(
    key: K,
    value: T[K],
  ) => {
    setInputs(prev => ({
      ...prev,
      [key]: value,
    }));

    clearError(key);
  };

  const setError = <K extends keyof T>(
    key: K,
    message: string,
  ) => {
    setErrors(prev => ({
      ...prev,
      [key]: message,
    }));
  };

  const clearError = <K extends keyof T>(
    key: K,
  ) => {
    setErrors(prev => ({
      ...prev,
      [key]: '',
    }));
  };

  const resetInputs = () => {
    setInputs(initialState);
    setErrors({});
  };

  return {
    inputs,
    errors,
    updateInput,
    setError,
    clearError,
    resetInputs,
  };
};