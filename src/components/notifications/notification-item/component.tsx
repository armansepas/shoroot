"use client";

import { useState } from "react";
import { Notification } from "@/stores/notifications-store";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationDetailsModal } from "@/components/notifications/notification-details-modal/component";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [showModal, setShowModal] = useState(false);
  const { markNotificationAsRead } = useNotifications();

  const handleViewDetails = async () => {
    setShowModal(true);
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <>
      <Card
        className={`transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.01] border-border/50 ${
          !notification.isRead
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            : "hover:bg-muted/30"
        }`}
        onClick={handleViewDetails}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-semibold text-foreground text-base truncate">
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <Badge
                    variant="destructive"
                    className="text-xs px-2 py-1 font-medium animate-pulse"
                  >
                    New
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {notification.description}
              </p>
              <p className="text-sm text-muted-foreground/70">
                {formatTimestamp(notification.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {notification.isRead ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <NotificationDetailsModal
        notification={notification}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
