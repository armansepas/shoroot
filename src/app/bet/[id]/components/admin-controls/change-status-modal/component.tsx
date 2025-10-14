"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play } from "lucide-react";
import { useState } from "react";

interface ChangeStatusModalProps {
  betId: number;
  currentStatus: string;
  options: any[];
  onStatusChanged: () => void;
}

export function ChangeStatusModal({
  betId,
  currentStatus,
  options,
  onStatusChanged,
}: ChangeStatusModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [winningOption, setWinningOption] = useState("");

  const handleSubmit = async () => {
    if (!newStatus) {
      alert("Please select a new status");
      return;
    }

    // If resolving, winning option is required
    if (newStatus === "resolved" && !winningOption) {
      alert("For resolving bet, select winning option");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`/api/bets/${betId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          winningOption: newStatus === "resolved" ? winningOption : null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        onStatusChanged();
        alert("Bet status changed successfully");
        setNewStatus("");
        setWinningOption("");
      } else {
        const error = await response.json();
        alert(error.error || "Error changing status");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Error changing status");
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
          <Play className="h-4 w-4 mr-2" />
          Change Status
        </Button>
      </DialogTrigger>
      <DialogContent className="shadow-2xl">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Change Bet Status
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="dark:text-white">
              Current status: {currentStatus}
            </Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newStatus === "resolved" && (
            <div>
              <Label className="dark:text-white">Winning Option</Label>
              <Select value={winningOption} onValueChange={setWinningOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select winning option" />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option: any) => (
                    <SelectItem key={option.id} value={option.optionText}>
                      {option.optionText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Changing..." : "Change Status"}
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
