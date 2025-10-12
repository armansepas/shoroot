"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Play, Pause, CheckCircle, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBets } from "@/hooks/use-bets";

interface AdminControlsProps {
  betId: number;
}

export function AdminControls({ betId }: AdminControlsProps) {
  const { user } = useAuth();
  const { getSingleBet } = useBets();
  const [bet, setBet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    amount: "",
  });
  const [newStatus, setNewStatus] = useState("");
  const [winningOption, setWinningOption] = useState("");

  // Only show admin controls if user is admin
  if (!user || user.role !== "admin") {
    return null;
  }

  const fetchBet = async () => {
    try {
      const betData = await getSingleBet(betId);
      setBet(betData);
      setEditForm({
        title: betData.title,
        description: betData.description,
        amount: betData.amount.toString(),
      });
    } catch (error) {
      console.error("Error fetching bet for admin controls:", error);
    }
  };

  const handleEdit = async () => {
    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          amount: parseInt(editForm.amount),
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        fetchBet(); // Refresh bet data
        alert("Bet edited successfully");
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

  const handleStatusChange = async () => {
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
      const response = await fetch(`/api/bets/${betId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          winningOption: newStatus === "resolved" ? winningOption : null,
        }),
      });

      if (response.ok) {
        setStatusDialogOpen(false);
        fetchBet(); // Refresh bet data
        alert("Bet status changed successfully");
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

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this bet? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Bet deleted successfully");
        window.location.href = "/admin"; // Redirect to admin dashboard
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

  const handleRemoveParticipant = async (participationId: number) => {
    if (!confirm("Are you sure you want to remove this participant?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/remove-participation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participationId }),
      });

      if (response.ok) {
        fetchBet(); // Refresh bet data
        alert("Participant removed successfully");
      } else {
        const error = await response.json();
        alert(error.error || "Error removing participant");
      }
    } catch (error) {
      console.error("Error removing participant:", error);
      alert("Error removing participant");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bet data when component mounts
  useState(() => {
    fetchBet();
  });

  if (!bet) {
    return <div className="text-center py-4 dark:text-white">Loading...</div>;
  }

  return (
    <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <CheckCircle className="h-5 w-5" />
          Admin Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Edit Bet */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Bet
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
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
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Bet title"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="description" className="dark:text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Bet description"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="dark:text-white">
                  Amount (Toman)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                  placeholder="Bet amount"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEdit} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Status */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Change Status
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                Change Bet Status
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-white">
                  Current status: {bet.status}
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newStatus === "resolved" && (
                <div>
                  <Label className="dark:text-white">Winning Option</Label>
                  <Select
                    value={winningOption}
                    onValueChange={setWinningOption}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Select winning option" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      {bet.options?.map((option: any) => (
                        <SelectItem key={option.id} value={option.optionText}>
                          {option.optionText}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleStatusChange} disabled={loading}>
                  {loading ? "Changing..." : "Change Status"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                  className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Bet */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Remove Participants */}
        {bet.participants?.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium dark:text-white">Manage Participants</h4>
            {bet.participants.map((participant: any) => (
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
                  onClick={() => handleRemoveParticipant(participant.id)}
                  disabled={loading}
                  className="dark:text-white dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
