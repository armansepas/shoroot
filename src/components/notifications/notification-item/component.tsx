"use client";

import { useState } from "react";
import { Notification } from "@/stores/notifications-store";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationDetailsModal } from "@/components/notifications/notification-details-modal";

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
        className={`transition-colors cursor-pointer hover:bg-muted/50 ${
          !notification.isRead ? "bg-blue-50 border-blue-200" : ""
        }`}
        onClick={handleViewDetails}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-sm truncate">
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <Badge variant="destructive" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {notification.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(notification.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="flex items-center gap-1"
              >
                {notification.isRead ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
                View
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
