/**
 * Optimized React Hook for Notification Events
 * Sindhi Matrimony Application
 *
 * Prevents unnecessary component re-renders by storing callback references
 * in mutable React refs and attaching/detaching clean listeners.
 */

import { useEffect, useRef, useCallback } from 'react';
import { fcmService } from './fcmService';
import { ParsedNotification, NotificationType } from './types';

export interface UseNotificationObserverOptions {
  filterType?: NotificationType | NotificationType[];
  onNotificationReceived?: (notification: ParsedNotification) => void;
}

export function useNotificationObserver(options?: UseNotificationObserverOptions) {
  // Store callback in ref to prevent stale closures and avoid re-subscribing on each render
  const callbackRef = useRef(options?.onNotificationReceived);
  const filterTypeRef = useRef(options?.filterType);

  useEffect(() => {
    callbackRef.current = options?.onNotificationReceived;
    filterTypeRef.current = options?.filterType;
  }, [options?.onNotificationReceived, options?.filterType]);

  useEffect(() => {
    const handleEvent = (notification: ParsedNotification) => {
      const filter = filterTypeRef.current;
      if (filter) {
        if (Array.isArray(filter)) {
          if (!filter.includes(notification.type)) return;
        } else if (filter !== notification.type) {
          return;
        }
      }

      // Execute callback safely
      if (callbackRef.current) {
        try {
          callbackRef.current(notification);
        } catch (err) {
          console.warn('⚠️ [useNotificationObserver] Error in consumer callback:', err);
        }
      }
    };

    // Attach subscriber
    const unsubscribe = fcmService.subscribe(handleEvent);

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Helper function to manually display a local alert without re-rendering
   */
  const showCustomNotification = useCallback(
    async (
      title: string,
      body: string,
      type: NotificationType = 'GENERAL_ALERT',
      data: Record<string, any> = {}
    ) => {
      try {
        await fcmService.displayLocalNotification({
          id: `local_${Date.now()}`,
          title,
          body,
          type,
          data: {
            type,
            ...data,
          },
          receivedAt: Date.now(),
          source: 'FOREGROUND',
        });
      } catch (err) {
        console.warn('⚠️ [useNotificationObserver] showCustomNotification error:', err);
      }
    },
    []
  );

  return {
    showCustomNotification,
  };
}
