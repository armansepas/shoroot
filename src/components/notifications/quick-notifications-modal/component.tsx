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
      <DialogContent className="max-w-md shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="text-3xl">🔔</div>
            Recent Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                Stay tuned for updates!
              </p>
            </div>
          ) : (
            <>
              {recentNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                      !notification.isRead
                        ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"
                        : "bg-card hover:bg-muted/30 border border-border"
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-base truncate mb-2">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                          <span>🕒</span>
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse shadow-lg" />
                      )}
                    </div>
                  </div>
                  {index < recentNotifications.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}

              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
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
