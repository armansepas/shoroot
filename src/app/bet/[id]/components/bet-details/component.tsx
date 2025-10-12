"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useBets } from "@/hooks/use-bets";

interface BetDetailsProps {
  betId: number;
}

export function BetDetails({ betId }: BetDetailsProps) {
  const { user } = useAuth();
  const { getSingleBet } = useBets();
  const [bet, setBet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBet = async () => {
      try {
        const betData = await getSingleBet(betId);
        setBet(betData);
      } catch (error) {
        console.error("Error fetching bet details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBet();
  }, [betId, getSingleBet]);

  if (loading) {
    return <div className="text-center py-8">Loading bet details...</div>;
  }

  if (!bet) {
    return <div className="text-center py-8">Bet not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const winners = bet.participants?.filter((p: any) => p.isWinner) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Bet Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{bet.title}</CardTitle>
            <Badge className={getStatusColor(bet.status)}>{bet.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{bet.description}</p>
          <div className="flex gap-4 text-sm">
            <span>
              <strong>Amount:</strong> {bet.amount} تومان
            </span>
            <span>
              <strong>Participants:</strong> {bet.participationCount}
            </span>
          </div>
          {bet.status === "resolved" && bet.winningOption && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Winning Option</h3>
              <p className="text-green-700">{bet.winningOption}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Available Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {bet.options?.map((option: any, index: number) => (
              <div
                key={option.id}
                className="flex items-center gap-2 p-2 bg-muted rounded"
              >
                <Badge variant="outline">{index + 1}</Badge>
                <span>{option.optionText}</span>
                {bet.status === "resolved" &&
                  bet.winningOption === option.optionText && (
                    <Badge className="bg-green-500">Winner</Badge>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({bet.participationCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {bet.participants?.length > 0 ? (
            <div className="space-y-3">
              {bet.participants.map((participant: any) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        U{participant.userId}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">User {participant.userId}</p>
                      {participant.selectedOptionText && (
                        <p className="text-sm text-muted-foreground">
                          Chose: {participant.selectedOptionText}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.isWinner && (
                      <Badge className="bg-green-500">Winner</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(
                        participant.participatedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No participants yet</p>
          )}
        </CardContent>
      </Card>

      {/* Winners Section for Resolved Bets */}
      {bet.status === "resolved" && winners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">
              Winners ({winners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {winners.map((winner: any) => (
                <div
                  key={winner.id}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      U{winner.userId}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      User {winner.userId}
                    </p>
                    <p className="text-sm text-green-600">
                      Won with: {winner.selectedOptionText}
                    </p>
                  </div>
                  <Badge className="bg-green-500 ml-auto">
                    Winner - {bet.amount} تومان
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
