"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Notification } from "@/stores/notifications-store";
import { format } from "date-fns";

interface NotificationDetailsModalProps {
  notification: Notification;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDetailsModal({
  notification,
  isOpen,
  onClose,
}: NotificationDetailsModalProps) {
  let parsedData = null;
  try {
    parsedData = notification.data ? JSON.parse(notification.data) : null;
  } catch {
    parsedData = null;
  }

  const getReasonText = (type: string) => {
    switch (type) {
      case "new_bet":
        return "A new bet has been created and is now available for participation.";
      case "bet_resolved":
        return "This bet has been resolved and winners have been determined.";
      case "bet_in_progress":
        return "This bet is now in progress. No more participants can join.";
      case "bet_deleted":
        return "This bet has been deleted by an administrator.";
      case "new_participant":
        return "A new participant has joined this bet.";
      case "new_user":
        return "A new user has registered on the platform.";
      default:
        return "This notification was triggered by a system event.";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{notification.title}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              DESCRIPTION
            </h3>
            <p className="text-sm">{notification.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              REASON
            </h3>
            <p className="text-sm">{getReasonText(notification.type)}</p>
          </div>

          {parsedData && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                DETAILS
              </h3>
              <div className="bg-muted p-3 rounded-md">
                {notification.type === "new_participant" && (
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>User:</strong> {parsedData.userFullName}
                    </p>
                    <p>
                      <strong>Choice:</strong> {parsedData.selectedOption}
                    </p>
                    {parsedData.betTitle && (
                      <p>
                        <strong>Bet:</strong> {parsedData.betTitle}
                      </p>
                    )}
                  </div>
                )}
                {notification.type === "new_user" && (
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>User:</strong> {parsedData.userFullName}
                    </p>
                    <p>
                      <strong>Registration Date:</strong>{" "}
                      {parsedData.registrationDate}
                    </p>
                  </div>
                )}
                {(notification.type === "new_bet" ||
                  notification.type === "bet_resolved" ||
                  notification.type === "bet_in_progress" ||
                  notification.type === "bet_deleted") &&
                  parsedData.betTitle && (
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Bet:</strong> {parsedData.betTitle}
                      </p>
                      {parsedData.amount && (
                        <p>
                          <strong>Amount:</strong> {parsedData.amount} toman
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground border-t pt-4">
            Received {formatDate(notification.createdAt)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
