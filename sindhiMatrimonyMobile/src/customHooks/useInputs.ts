import { useState, useCallback, useRef, useEffect } from 'react';

export const useInputs = <
  T extends Record<string, any>,
  B extends Record<string, boolean> = Record<string, boolean>
>(
  initialInputs: T,
  initialBooleans?: B,
) => {
  const [inputs, setInputsState] = useState<T>(initialInputs);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [booleans, setBooleansState] = useState<B>(() => initialBooleans ?? ({} as B));

  const inputsRef = useRef<T>(inputs);
  const booleansRef = useRef<B>(booleans);

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  useEffect(() => {
    booleansRef.current = booleans;
  }, [booleans]);

  const clearError = useCallback(<K extends keyof T>(key: K) => {
    setErrors(prev => (prev[key] ? { ...prev, [key]: '' } : prev));
  }, []);

  const updateInput = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setInputsState(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
      clearError(key);
    },
    [clearError],
  );

  const setError = useCallback(<K extends keyof T>(key: K, message: string) => {
    setErrors(prev => (prev[key] === message ? prev : { ...prev, [key]: message }));
  }, []);

  const setBoolean = useCallback(<K extends keyof B>(key: K, value: boolean) => {
    setBooleansState(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const toggleBoolean = useCallback(<K extends keyof B>(key: K) => {
    setBooleansState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getInputs = useCallback(() => inputsRef.current, []);
  const getBooleans = useCallback(() => booleansRef.current, []);

  const resetInputs = useCallback(() => {
    setInputsState(initialInputs);
    setErrors({});
    if (initialBooleans) setBooleansState(initialBooleans);
  }, [initialInputs, initialBooleans]);

  return {
    inputs,
    errors,
    booleans,
    updateInput,
    setBoolean,
    toggleBoolean,
    setError,
    clearError,
    resetInputs,
    getInputs,
    getBooleans,
    inputsRef,
  };
};