"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { ParticipateModal } from "./participate-modal";
import { Bet, TabType, UserStats } from "./types";
import {
  getStatusColor,
  getCardBackgroundColor,
  formatCurrency,
  getTabLabel,
  canParticipate,
} from "./utils";

export function UserBetsDashboard() {
  const [bets, setBets] = useState<Record<TabType, Bet[]>>({
    all: [],
    active: [],
    "in-progress": [],
    resolved: [],
  });
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        // Fetch bets
        const betsResponse = await fetch(`/api/bets/user?tab=${activeTab}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!betsResponse.ok) {
          throw new Error("Failed to fetch bets");
        }

        const betsData = await betsResponse.json();
        setBets((prev) => ({ ...prev, [activeTab]: betsData.bets }));

        // Fetch user stats
        const statsResponse = await fetch("/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserStats(statsData.userStats);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const handleParticipate = (bet: Bet) => {
    setSelectedBet(bet);
    setIsParticipateModalOpen(true);
  };

  const handleParticipateSubmit = async (
    betId: number,
    selectedOptionId: number
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(`/api/bets/${betId}/participate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedOptionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to participate");
      }

      // Refresh bets data
      setBets((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((tab) => {
          updated[tab as TabType] = updated[tab as TabType].map((bet) =>
            bet.id === betId ? { ...bet, hasUserParticipated: true } : bet
          );
        });
        return updated;
      });
    } catch (error) {
      console.error("Participation error:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading bets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  const currentBets = bets[activeTab];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Bets Dashboard
        </h1>
        <p className="text-gray-600">
          Browse and participate in available bets
        </p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userStats.participated}
              </div>
              <p className="text-xs text-gray-600">Participated</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {userStats.won}
              </div>
              <p className="text-xs text-gray-600">Won</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {userStats.lost}
              </div>
              <p className="text-xs text-gray-600">Lost</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(userStats.totalMoneyWon)}
              </div>
              <p className="text-xs text-gray-600">Money Won</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(userStats.totalMoneyLost)}
              </div>
              <p className="text-xs text-gray-600">Money Lost</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{getTabLabel("all")}</TabsTrigger>
          <TabsTrigger value="active">{getTabLabel("active")}</TabsTrigger>
          <TabsTrigger value="in-progress">
            {getTabLabel("in-progress")}
          </TabsTrigger>
          <TabsTrigger value="resolved">{getTabLabel("resolved")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBets.map((bet) => (
              <Card
                key={bet.id}
                className={`${getCardBackgroundColor(
                  bet.status
                )} hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {bet.title}
                    </CardTitle>
                    <Badge className={getStatusColor(bet.status)}>
                      {bet.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {bet.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Amount, Participants, and Date */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Amount: {formatCurrency(bet.amount)}</span>
                      <span>{bet.participationCount} participants</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(bet.createdAt).toLocaleDateString()}
                    </div>

                    {/* Participation Status */}
                    {bet.hasUserParticipated && (
                      <div className="text-sm text-blue-600 font-medium">
                        ✓ You have participated in this bet
                      </div>
                    )}

                    {/* Winning Option for Resolved Bets */}
                    {bet.status === "resolved" && bet.winningOptionText && (
                      <div className="text-sm text-green-600 font-medium">
                        🏆 Winning Option: {bet.winningOptionText}
                      </div>
                    )}

                    {/* Options Preview */}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">
                        Options:
                      </div>
                      {bet.options.slice(0, 2).map((option, index) => (
                        <div key={option.id} className="text-sm text-gray-600">
                          {index + 1}. {option.optionText}
                        </div>
                      ))}
                      {bet.options.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{bet.options.length - 2} more options available
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {canParticipate(bet) && (
                        <Button
                          onClick={() => handleParticipate(bet)}
                          className="flex-1"
                        >
                          Participate
                        </Button>
                      )}
                      <Link href={`/bet/${bet.id}`}>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentBets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === "all"
                  ? "No bets available at the moment."
                  : `No ${activeTab} bets found.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ParticipateModal
        isOpen={isParticipateModalOpen}
        onClose={() => setIsParticipateModalOpen(false)}
        bet={selectedBet}
        onParticipate={handleParticipateSubmit}
      />
    </div>
  );
}
