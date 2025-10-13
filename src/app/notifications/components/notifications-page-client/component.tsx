"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationsList } from "@/components/notifications/notifications-list/component";

export function NotificationsPageClient() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { notifications, unreadCount, isLoading, markAllNotificationsAsRead } =
    useNotifications();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, user?.id, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="mt-1">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <NotificationsList notifications={notifications} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
