"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { ParticipateModal } from "./participate-modal";
import { Bet, TabType, UserStats } from "./types";
import { Header } from "./header";
import { StatsCards } from "./stats-cards";
import { BetsGrid } from "./bets-grid";
import { getTabLabel } from "./utils";

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
        <div className="text-center dark:text-white">Loading bets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />

      {/* User Stats */}
      {userStats && <StatsCards userStats={userStats} />}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
      >
        <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
          <TabsTrigger value="all" className="dark:text-white">
            {getTabLabel("all")}
          </TabsTrigger>
          <TabsTrigger value="active" className="dark:text-white">
            {getTabLabel("active")}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="dark:text-white">
            {getTabLabel("in-progress")}
          </TabsTrigger>
          <TabsTrigger value="resolved" className="dark:text-white">
            {getTabLabel("resolved")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <BetsGrid
            bets={bets}
            activeTab={activeTab}
            onParticipate={handleParticipate}
          />
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
