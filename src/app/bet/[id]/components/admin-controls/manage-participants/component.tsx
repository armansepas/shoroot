"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ManageParticipantsProps {
  participants: any[];
  onRemoveParticipant: (participationId: number) => void;
  loading: boolean;
}

export function ManageParticipants({
  participants,
  onRemoveParticipant,
  loading,
}: ManageParticipantsProps) {
  if (!participants?.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium dark:text-white">Manage Participants</h4>
      {participants.map((participant: any) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-2 border rounded dark:border-gray-600 dark:bg-gray-700"
        >
          <span className="dark:text-white">
            User {participant.userId} - {participant.selectedOptionText}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveParticipant(participant.id)}
            disabled={loading}
            className="dark:text-white dark:hover:bg-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
