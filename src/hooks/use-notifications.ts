import { useEffect, useCallback } from "react";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useAuthStore } from "@/stores/auth-store";

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    setNotifications,
    markAsRead,
    markAllAsRead,
    setUnreadCount,
    setLoading,
    setError,
    clearNotifications,
  } = useNotificationsStore();

  const { user, isAuthenticated } = useAuthStore();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
      // Unread count is automatically calculated by the store when setNotifications is called
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError, setNotifications]);

  // Fetch notifications when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Only fetch notifications, unread count is handled by the bell component
      fetchNotifications();
    } else {
      clearNotifications();
    }
  }, [isAuthenticated, user?.id, fetchNotifications, clearNotifications]);

  const markNotificationAsRead = useCallback(
    async (notificationId: number) => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notificationId }),
        });

        if (response.ok) {
          markAsRead(notificationId);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [user, markAsRead]
  );

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        markAllAsRead();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [user, markAllAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};
