"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";

interface EditBetModalProps {
  betId: number;
  currentTitle?: string;
  currentDescription?: string;
  currentAmount?: number;
  onBetUpdated: () => void;
}

export function EditBetModal({
  betId,
  currentTitle = "",
  currentDescription = "",
  currentAmount = 0,
  onBetUpdated,
}: EditBetModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: currentTitle,
    description: currentDescription,
    amount: currentAmount.toString(),
  });

  // Update form data when props change
  useEffect(() => {
    setFormData({
      title: currentTitle,
      description: currentDescription,
      amount: currentAmount.toString(),
    });
  }, [currentTitle, currentDescription, currentAmount]);

  const handleSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`/api/bets/${betId}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          amount: parseInt(formData.amount),
        }),
      });

      if (response.ok) {
        setOpen(false);
        onBetUpdated();
        alert("Bet edited successfully");
        setFormData({ title: "", description: "", amount: "" });
      } else {
        const error = await response.json();
        alert(error.error || "Error editing bet");
      }
    } catch (error) {
      console.error("Error editing bet:", error);
      alert("Error editing bet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="shadow-2xl">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Edit Bet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="dark:text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Bet title"
            />
          </div>
          <div>
            <Label htmlFor="description" className="dark:text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Bet description"
            />
          </div>
          <div>
            <Label htmlFor="amount" className="dark:text-white">
              Amount (Toman)
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Bet amount"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
