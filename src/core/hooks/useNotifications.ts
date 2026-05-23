import { useCallback, useRef } from 'react';
import { authService } from '../../modules/auth/infrastructure/services/auth.service';

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function useNotifications() {
  const permissionRef = useRef<NotificationPermissionState>(
    typeof Notification !== 'undefined'
      ? Notification.permission
      : 'unsupported'
  );

  const getPermission = useCallback((): NotificationPermissionState => {
    if (typeof Notification === 'undefined') return 'unsupported';
    return Notification.permission;
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (typeof Notification === 'undefined') return 'unsupported';

    try {
      const result = await Notification.requestPermission();
      permissionRef.current = result as NotificationPermissionState;
      return result as NotificationPermissionState;
    } catch {
      return 'denied';
    }
  }, []);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (typeof Notification === 'undefined') return;
      if (Notification.permission !== 'granted') return;

      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    },
    []
  );

  const syncPreferenceToServer = useCallback(
    async (userId: string, enabled: boolean) => {
      try {
        await authService.updateNotificationPreference(userId, enabled);
      } catch (error) {
        console.error('Error saving notification preference:', error);
      }
    },
    []
  );

  return {
    getPermission,
    requestPermission,
    sendNotification,
    syncPreferenceToServer,
    isSupported: typeof Notification !== 'undefined',
  };
}
