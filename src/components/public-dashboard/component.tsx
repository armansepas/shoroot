"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Bet, Stats } from "./types";
import { Header } from "./header";
import { BetsGrid } from "./bets-grid";
import { StatsCards } from "./stats-cards";
import { Leaderboard } from "./leaderboard";

export function PublicDashboard() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bets
        const betsResponse = await fetch("/api/bets/public");
        if (!betsResponse.ok) {
          throw new Error("Failed to fetch bets");
        }
        const betsData = await betsResponse.json();
        setBets(betsData.bets);

        // Fetch stats for leaderboard (works for authenticated and non-authenticated users)
        try {
          const headers: Record<string, string> = {};
          if (user && isAuthenticated) {
            const token = localStorage.getItem("token");
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }
          }

          const statsResponse = await fetch("/api/stats", { headers });
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          } else {
            console.error("Stats fetch failed:", statsResponse.status);
            // Don't set error state for stats failure
          }
        } catch (statsError) {
          console.error("Stats fetch error:", statsError);
          // Don't set error state for stats failure
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated]);

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
      <Header isAuthenticated={isAuthenticated} />

      <Tabs defaultValue="bets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
          <TabsTrigger value="bets" className="dark:text-white">
            Available Bets
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="dark:text-white">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bets" className="mt-6">
          <BetsGrid bets={bets} />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          {stats && <StatsCards stats={stats} />}
          {stats && <Leaderboard stats={stats} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
