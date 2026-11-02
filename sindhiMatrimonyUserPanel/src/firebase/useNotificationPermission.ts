'use client';

import { useState, useEffect, useCallback } from 'react';
import { fcmWebService } from './fcmWebService';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const fcmToken = await fcmWebService.requestPermissionAndGetToken();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    setToken(fcmToken);
    return fcmToken;
  }, []);

  return {
    permission,
    isSupported,
    token,
    requestPermission,
    isGranted: permission === 'granted',
  };
}

export default useNotificationPermission;

