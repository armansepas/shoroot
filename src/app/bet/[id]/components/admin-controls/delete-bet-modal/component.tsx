"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteBetModalProps {
  betId: number;
  onBetDeleted: () => void;
}

export function DeleteBetModal({ betId, onBetDeleted }: DeleteBetModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this bet? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`/api/bets/${betId}/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Bet deleted successfully");
        onBetDeleted();
      } else {
        const error = await response.json();
        alert(error.error || "Error deleting bet");
      }
    } catch (error) {
      console.error("Error deleting bet:", error);
      alert("Error deleting bet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Delete Bet</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground dark:text-gray-300">
          Are you sure you want to delete this bet? This action cannot be
          undone.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
