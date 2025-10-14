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
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">
          Loading bet details...
        </span>
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎲</div>
        <p className="text-muted-foreground text-lg">Bet not found</p>
        <p className="text-muted-foreground/70 text-sm mt-2">
          The bet you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "resolved":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const winners = bet.participants?.filter((p: any) => p.isWinner) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Bet Info */}
      <Card className="shadow-lg border-2 border-border/50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                {bet.title}
              </CardTitle>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {bet.description}
              </p>
            </div>
            <Badge
              className={`text-sm font-semibold px-3 py-1 ${getStatusColor(
                bet.status
              )}`}
            >
              {bet.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {bet.amount}
              </div>
              <div className="text-sm text-muted-foreground">Bet Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {bet.participationCount}
              </div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {bet.options?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {new Date(bet.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Created</div>
            </div>
          </div>

          {bet.status === "resolved" && bet.winningOption && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🏆</div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Winning Option
                </h3>
              </div>
              <p className="text-green-700 dark:text-green-300 text-lg font-medium">
                {bet.winningOption}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            🎯 Available Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {bet.options?.map((option: any, index: number) => (
              <div
                key={option.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  bet.status === "resolved" &&
                  bet.winningOption === option.optionText
                    ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 shadow-md"
                    : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <Badge
                  variant="outline"
                  className="text-lg px-3 py-1 min-w-[40px] justify-center"
                >
                  {index + 1}
                </Badge>
                <span className="flex-1 text-foreground font-medium">
                  {option.optionText}
                </span>
                {bet.status === "resolved" &&
                  bet.winningOption === option.optionText && (
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">🏆</div>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1">
                        WINNER
                      </Badge>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            👥 Participants ({bet.participationCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bet.participants?.length > 0 ? (
            <div className="space-y-4">
              {bet.participants.map((participant: any) => (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    participant.isWinner
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 shadow-md"
                      : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        participant.isWinner ? "bg-green-500" : "bg-primary"
                      }`}
                    >
                      {(participant.userFullName || participant.userEmail)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {participant.userFullName || participant.userEmail}
                      </p>
                      {participant.selectedOptionText && (
                        <p className="text-muted-foreground">
                          Chose:{" "}
                          <span className="font-medium">
                            {participant.selectedOptionText}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {participant.isWinner && (
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">🏆</div>
                        <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1">
                          WINNER
                        </Badge>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(
                          participant.participatedAt
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(
                          participant.participatedAt
                        ).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎭</div>
              <p className="text-muted-foreground text-lg">
                No participants yet
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                Be the first to join this bet!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Winners Section for Resolved Bets */}
      {bet.status === "resolved" && winners.length > 0 && (
        <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 text-green-700 dark:text-green-300">
              <div className="text-3xl">🏆</div>
              Champions ({winners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {winners.map((winner: any) => (
                <div
                  key={winner.id}
                  className="flex items-center gap-4 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg shadow-sm"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {(winner.userFullName || winner.userEmail)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-800 dark:text-green-200 text-xl">
                      {winner.userFullName || winner.userEmail}
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-lg">
                      Won with:{" "}
                      <span className="font-semibold">
                        {winner.selectedOptionText}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 text-lg">
                      Winner - {bet.amount}
                    </Badge>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Prize claimed!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
