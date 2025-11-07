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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Create a simple scroll area if not available
const SimpleScrollArea: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children
}) => (
  <div className={`overflow-auto ${className}`}>
    {children}
  </div>
);
import { FileText, Loader2 } from "lucide-react";

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => Promise<void>;
  onCancel: () => void;
  termsContent: string;
}

export function TermsAcceptanceModal({
  isOpen,
  onAccept,
  onCancel,
  termsContent,
}: TermsAcceptanceModalProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!isAccepted) return;

    setIsSubmitting(true);
    try {
      await onAccept();
    } catch (error) {
      console.error("Failed to accept terms:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onCancel();
      setIsAccepted(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className="text-base">
            Before participating in bets, you must read and accept our terms and conditions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <SimpleScrollArea className="h-[400px] w-full border rounded-lg p-4 bg-muted/30">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {termsContent}
              </pre>
            </div>
          </SimpleScrollArea>
        </div>

        <DialogFooter className="flex-shrink-0 flex-col gap-4">
          <div className="flex items-center gap-2 w-full">
            <Checkbox
              id="accept-terms"
              checked={isAccepted}
              onCheckedChange={(checked) => setIsAccepted(checked as boolean)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="accept-terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I have read and accept the terms and conditions
            </label>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!isAccepted || isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept & Continue"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}