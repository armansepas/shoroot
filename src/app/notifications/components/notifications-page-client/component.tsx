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
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🔔</div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="mt-2 px-3 py-1 text-sm font-medium"
              >
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            📬 All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading notifications...
              </span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-muted-foreground text-lg">
                No notifications yet
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                You'll receive notifications about your bets and activities
                here.
              </p>
            </div>
          ) : (
            <NotificationsList notifications={notifications} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
