import { useState, useCallback, useMemo } from 'react';
import React from 'react';
import { LoaderOverlay } from '../customModals/LoaderOverlay';

export interface UseLoaderReturn {
  isLoading: boolean;
  message: string;
  subMessage: string;
  showLoader: (message?: string, subMessage?: string) => void;
  hideLoader: () => void;
  withLoader: <T>(asyncFn: Promise<T> | (() => Promise<T>), message?: string, subMessage?: string) => Promise<T>;
  LoaderComponent: React.ReactElement | null;
}

/**
 * Custom hook to control and trigger loading overlays across admin screens and components.
 */
export function useLoader(defaultMessage = 'Loading...'): UseLoaderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [subMessage, setSubMessage] = useState('Please wait while we process your request');

  const showLoader = useCallback((msg?: string, subMsg?: string) => {
    if (msg) setMessage(msg);
    if (subMsg) setSubMessage(subMsg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoader = useCallback(
    async <T,>(
      action: Promise<T> | (() => Promise<T>),
      msg?: string,
      subMsg?: string
    ): Promise<T> => {
      showLoader(msg, subMsg);
      try {
        if (typeof action === 'function') {
          return await action();
        }
        return await action;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  const LoaderComponent = useMemo(() => {
    if (!isLoading) return null;
    return <LoaderOverlay isLoading={isLoading} message={message} subMessage={subMessage} />;
  }, [isLoading, message, subMessage]);

  return {
    isLoading,
    message,
    subMessage,
    showLoader,
    hideLoader,
    withLoader,
    LoaderComponent,
  };
}
