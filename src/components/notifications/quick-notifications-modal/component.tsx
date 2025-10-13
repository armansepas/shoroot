"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuthStore } from "@/stores/auth-store";
import { formatDistanceToNow } from "date-fns";
import { Bell, ExternalLink } from "lucide-react";

interface QuickNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickNotificationsModal({
  isOpen,
  onClose,
}: QuickNotificationsModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, markNotificationAsRead } = useNotifications();

  // Get last 3 notifications
  const recentNotifications = notifications.slice(0, 3);

  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    onClose();
  };

  const handleViewAll = () => {
    onClose();
    router.push("/notifications");
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <>
              {recentNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.isRead
                        ? "bg-blue-50 border border-blue-200"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                  {index < recentNotifications.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}

              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleViewAll}
              >
                <ExternalLink className="h-4 w-4" />
                View All Notifications
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
