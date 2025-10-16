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
  const [betsLoading, setBetsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
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
        setBetsLoading(false);

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
        } finally {
          setStatsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setBetsLoading(false);
        setStatsLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Header isAuthenticated={isAuthenticated} />

        <Tabs defaultValue="bets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="bets" className="text-sm font-medium">
              Available Bets
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-sm font-medium">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bets" className="space-y-6">
            {error ? (
              <div className="text-center">
                <div className="text-destructive mb-2">⚠️</div>
                <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-lg border border-destructive/20 max-w-md">
                  Error: {error}
                </div>
              </div>
            ) : betsLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">
                  Loading bets...
                </span>
              </div>
            ) : (
              <BetsGrid bets={bets} />
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-8">
            {statsLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">
                  Loading leaderboard...
                </span>
              </div>
            ) : stats ? (
              <>
                <StatsCards stats={stats} />
                <Leaderboard stats={stats} />
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No leaderboard data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
