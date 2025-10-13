import { useEffect } from "react";
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

  // Fetch notifications when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      clearNotifications();
    }
  }, [isAuthenticated, user?.id]); // Changed dependency to user?.id to avoid unnecessary re-renders

  const fetchNotifications = async () => {
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
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
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
  };

  const markAllNotificationsAsRead = async () => {
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
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};
