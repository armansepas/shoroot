"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBets } from "@/hooks/use-bets";
import { EditBetModal } from "./edit-bet-modal";
import { ChangeStatusModal } from "./change-status-modal";
import { DeleteBetModal } from "./delete-bet-modal";
import { ManageParticipants } from "./manage-participants";
import { Participant } from "./manage-participants/types";

interface AdminControlsProps {
  betId: number;
}

export function AdminControls({ betId }: AdminControlsProps) {
  const { user } = useAuth();
  const { getSingleBet } = useBets();
  const [bet, setBet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBet = async () => {
    try {
      const betData = await getSingleBet(betId);
      setBet(betData);
    } catch (error) {
      console.error("Error fetching bet for admin controls:", error);
    }
  };

  useEffect(() => {
    fetchBet();
  }, [betId]);

  // Only show admin controls if user is admin
  if (!user || user.role !== "admin") {
    return null;
  }

  const handleRemoveParticipant = async (participationId: number) => {
    if (!confirm("Are you sure you want to remove this participant?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`/api/bets/${betId}/remove-participation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  const handleChangeOption = async (userId: number, newOptionId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`/api/bets/${betId}/change-option`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, newOptionId }),
      });

      if (response.ok) {
        fetchBet(); // Refresh bet data
      } else {
        const error = await response.json();
        alert(error.error || "Error changing participant option");
      }
    } catch (error) {
      console.error("Error changing participant option:", error);
      alert("Error changing participant option");
    } finally {
      setLoading(false);
    }
  };

  const handleBetDeleted = () => {
    window.location.href = "/admin"; // Redirect to admin dashboard
  };

  if (!bet) {
    return <div className="text-center py-4 dark:text-white">Loading...</div>;
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <CheckCircle className="h-5 w-5" />
          Admin Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditBetModal
          betId={betId}
          currentTitle={bet.title}
          currentDescription={bet.description}
          currentAmount={bet.amount}
          onBetUpdated={fetchBet}
        />
        <ChangeStatusModal
          betId={betId}
          currentStatus={bet.status}
          options={bet.options}
          onStatusChanged={fetchBet}
        />
        <DeleteBetModal betId={betId} onBetDeleted={handleBetDeleted} />
        <ManageParticipants
          participants={bet.participants}
          betOptions={bet.options}
          onRemoveParticipant={handleRemoveParticipant}
          onChangeOption={handleChangeOption}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
