import { useState, useCallback } from "react";
import type { NotificationType } from "../components/ui/Notification/Notification";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notify = useCallback(
    (type: NotificationType, title: string, message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, type, title, message }]);
    },
    [],
  );
  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    notify,
    remove,
  };
};
