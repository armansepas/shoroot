"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Edit } from "lucide-react";
import { ManageParticipantsProps } from "./types";

export function ManageParticipants({
  participants,
  betOptions,
  onRemoveParticipant,
  onChangeOption,
  loading,
}: ManageParticipantsProps) {
  const [changeOptionModal, setChangeOptionModal] = useState<{
    isOpen: boolean;
    participant: any;
    selectedOptionId: number | null;
  }>({
    isOpen: false,
    participant: null,
    selectedOptionId: null,
  });

  if (!participants?.length) {
    return null;
  }

  const handleOpenChangeOptionModal = (participant: any) => {
    setChangeOptionModal({
      isOpen: true,
      participant,
      selectedOptionId: participant.selectedOptionId,
    });
  };

  const handleConfirmChangeOption = () => {
    if (changeOptionModal.participant && changeOptionModal.selectedOptionId) {
      onChangeOption(
        changeOptionModal.participant.userId,
        changeOptionModal.selectedOptionId
      );
      setChangeOptionModal({
        isOpen: false,
        participant: null,
        selectedOptionId: null,
      });
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h4 className="font-medium dark:text-white">Manage Participants</h4>
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-3 border rounded bg-card border-border"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="dark:text-white font-medium">
                  {participant.userFullName ||
                    participant.userEmail ||
                    `User ${participant.userId}`}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground">
                  {participant.selectedOptionText}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChangeOptionModal(participant)}
                disabled={loading}
                className="dark:text-white dark:hover:bg-gray-600"
              >
                <Edit className="h-4 w-4" />
              </Button>
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
          </div>
        ))}
      </div>

      <Dialog
        open={changeOptionModal.isOpen}
        onOpenChange={(open) =>
          setChangeOptionModal({ ...changeOptionModal, isOpen: open })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Participant Option</DialogTitle>
            <DialogDescription>
              Change the selected option for{" "}
              {changeOptionModal.participant?.userFullName ||
                changeOptionModal.participant?.userEmail ||
                `User ${changeOptionModal.participant?.userId}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="option" className="text-right">
                Option
              </label>
              <Select
                value={changeOptionModal.selectedOptionId?.toString()}
                onValueChange={(value) =>
                  setChangeOptionModal({
                    ...changeOptionModal,
                    selectedOptionId: parseInt(value),
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select new option" />
                </SelectTrigger>
                <SelectContent>
                  {betOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.optionText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setChangeOptionModal({
                  isOpen: false,
                  participant: null,
                  selectedOptionId: null,
                })
              }
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmChangeOption}
              disabled={!changeOptionModal.selectedOptionId || loading}
            >
              {loading ? "Changing..." : "Change Option"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
