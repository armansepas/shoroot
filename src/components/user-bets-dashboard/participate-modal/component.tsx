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
import { useAuth } from "@/hooks/use-auth";
import { Bet, BetOption } from "../types";
import { TermsAcceptanceModal } from "@/components/terms-acceptance-modal";

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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!bet || !selectedOptionId || !user) return;

    // Check if user has accepted terms
    if (!user.hasAcceptedTerms) {
      // Fetch terms content and show acceptance modal
      try {
        const response = await fetch("/api/terms");
        if (response.ok) {
          const termsData = await response.json();
          setTermsContent(termsData.content);
          setShowTermsModal(true);
        } else {
          console.error("Failed to fetch terms");
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      }
      return;
    }

    // User has accepted terms, proceed with participation
    await proceedWithParticipation();
  };

  const proceedWithParticipation = async () => {
    if (!bet || !selectedOptionId) return;

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

  const handleTermsAccept = async () => {
    try {
      const response = await fetch("/api/terms/accept", {
        method: "POST",
      });
      if (response.ok) {
        setShowTermsModal(false);
        // Now proceed with participation
        await proceedWithParticipation();
      } else {
        console.error("Failed to accept terms");
      }
    } catch (error) {
      console.error("Failed to accept terms:", error);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedOptionId(null);
  };

  if (!bet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            🎯 Participate in Bet
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose your option for{" "}
            <span className="font-semibold text-primary">"{bet.title}"</span>.
            You can only participate once per bet.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              📋 Bet Details
            </h4>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              {bet.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-medium text-foreground">Amount:</span>
              <span className="text-primary font-bold">{bet.amount} Toman</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              🎲 Select Your Option
            </h4>
            <div className="grid gap-3">
              {bet.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                    selectedOptionId === option.id
                      ? "border-primary bg-primary/10 text-primary-foreground shadow-lg scale-[1.02]"
                      : "border-border hover:border-primary/50 bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        selectedOptionId === option.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-muted-foreground dark:text-primary">
                      {option.optionText}
                    </span>
                    {selectedOptionId === option.id && (
                      <div className="ml-auto text-primary text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedOptionId || isSubmitting}
            className="bg-primary hover:bg-primary/90 transition-colors px-6"
          >
            {isSubmitting ? "🎲 Participating..." : "🎯 Participate"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <TermsAcceptanceModal
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
        onCancel={() => setShowTermsModal(false)}
        termsContent={termsContent}
      />
    </Dialog>
  );
}
