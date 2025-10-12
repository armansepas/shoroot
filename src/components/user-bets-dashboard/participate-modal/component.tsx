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
import { useAuth } from "@/hooks/use-auth";
import { Bet, BetOption } from "../types";

interface ParticipateModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: Bet | null;
  onParticipate: (betId: number, selectedOptionId: number) => Promise<void>;
}

export function ParticipateModal({
  isOpen,
  onClose,
  bet,
  onParticipate,
}: ParticipateModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!bet || !selectedOptionId || !user) return;

    setIsSubmitting(true);
    try {
      await onParticipate(bet.id, selectedOptionId);
      onClose();
      setSelectedOptionId(null);
    } catch (error) {
      console.error("Failed to participate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedOptionId(null);
  };

  if (!bet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Participate in Bet</DialogTitle>
          <DialogDescription>
            Choose your option for "{bet.title}". You can only participate once.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Bet Details:</h4>
            <p className="text-sm text-gray-600 mb-1">{bet.description}</p>
            <p className="text-sm text-gray-600">Amount: ${bet.amount}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Select Your Option:</h4>
            {bet.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  selectedOptionId === option.id
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{option.optionText}</span>
              </button>
            ))}
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
            disabled={!selectedOptionId || isSubmitting}
          >
            {isSubmitting ? "Participating..." : "Participate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
