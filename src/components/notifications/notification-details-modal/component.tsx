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
      <DialogContent className="max-w-2xl shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center justify-between text-xl">
            <span className="flex items-center gap-2">
              <div className="text-2xl">📬</div>
              {notification.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
              📝 Description
            </h3>
            <p className="text-foreground leading-relaxed">
              {notification.description}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-3 uppercase tracking-wide">
              💡 Reason
            </h3>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
              {getReasonText(notification.type)}
            </p>
          </div>

          {parsedData && (
            <div className="bg-card border border-border p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                📊 Details
              </h3>
              <div className="bg-muted/50 p-4 rounded-md">
                {notification.type === "new_participant" && (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">👤</span>
                      <strong className="text-foreground">User:</strong>
                      <span>{parsedData.userFullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">🎯</span>
                      <strong className="text-foreground">Choice:</strong>
                      <span>{parsedData.selectedOption}</span>
                    </div>
                    {parsedData.betTitle && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🎲</span>
                        <strong className="text-foreground">Bet:</strong>
                        <span>{parsedData.betTitle}</span>
                      </div>
                    )}
                  </div>
                )}
                {notification.type === "new_user" && (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">👤</span>
                      <strong className="text-foreground">User:</strong>
                      <span>{parsedData.userFullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">📅</span>
                      <strong className="text-foreground">Registration:</strong>
                      <span>{parsedData.registrationDate}</span>
                    </div>
                  </div>
                )}
                {(notification.type === "new_bet" ||
                  notification.type === "bet_resolved" ||
                  notification.type === "bet_in_progress" ||
                  notification.type === "bet_deleted") &&
                  parsedData.betTitle && (
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">🎲</span>
                        <strong className="text-foreground">Bet:</strong>
                        <span>{parsedData.betTitle}</span>
                      </div>
                      {parsedData.amount && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">💰</span>
                          <strong className="text-foreground">Amount:</strong>
                          <span>{parsedData.amount} toman</span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground/70 border-t border-border pt-4 flex items-center gap-2">
            <span className="text-lg">🕒</span>
            <span>Received {formatDate(notification.createdAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
