"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bet } from "../types";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: Bet | null;
  onSubmit: (
    betId: number,
    status: string,
    winningOption?: string
  ) => Promise<void>;
}

export function StatusModal({
  isOpen,
  onClose,
  bet,
  onSubmit,
}: StatusModalProps) {
  const [status, setStatus] = useState<"active" | "in-progress" | "resolved">(
    "active"
  );
  const [winningOption, setWinningOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bet) {
      setStatus(bet.status);
      setWinningOption(bet.winningOption || "");
    }
  }, [bet, isOpen]);

  const handleSubmit = async () => {
    if (!bet) return;

    setIsSubmitting(true);
    try {
      const winningOptionText =
        status === "resolved" && winningOption
          ? bet.options.find((opt) => opt.id.toString() === winningOption)
              ?.optionText
          : undefined;

      await onSubmit(bet.id, status, winningOptionText);
      onClose();
    } catch (error) {
      console.error("Status change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStatus("active");
    setWinningOption("");
  };

  if (!bet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Bet Status</DialogTitle>
          <DialogDescription>
            Change the status of "{bet.title}". This action will affect user
            participation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === "resolved" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="winningOption" className="text-right">
                Winning Option
              </Label>
              <div className="col-span-3">
                <Select value={winningOption} onValueChange={setWinningOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select winning option" />
                  </SelectTrigger>
                  <SelectContent>
                    {bet.options.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.optionText}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Status Effects:</strong>
            <ul className="mt-1 list-disc list-inside">
              <li>
                <strong>Active:</strong> Users can participate
              </li>
              <li>
                <strong>In Progress:</strong> No new participation allowed
              </li>
              <li>
                <strong>Resolved:</strong> Bet is closed, winners determined
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (status === "resolved" && !winningOption)}
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
