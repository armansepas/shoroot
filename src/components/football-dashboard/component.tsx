"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { TypedMatch } from "@/types/football";
import { BetModal } from "@/components/admin-dashboard/bet-modal";
import { useBetsStore } from "@/stores/bets-store";
import {
  CreateBetData,
  UpdateBetData,
} from "@/components/admin-dashboard/types";
import { Loader2 } from "lucide-react";

const DATE_TABS = [
  { value: "yesterday", label: "Yesterday" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "day after tomorrow", label: "Day After Tomorrow" },
] as const;

interface FootballMatchesResponse {
  matches: TypedMatch[];
}

export function FootballDashboardComponent() {
  const [activeTab, setActiveTab] = useState<string>("today");
  const [matches, setMatches] = useState<TypedMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<TypedMatch | null>(null);
  const { user } = useAuth();
  const { setLoading: setBetsLoading } = useBetsStore();

  const fetchMatches = async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/football/matches?date=${encodeURIComponent(date)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.statusText}`);
      }

      const data: FootballMatchesResponse = await response.json();
      setMatches(data.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  const handleCreateBet = (match: TypedMatch) => {
    setSelectedMatch(match);
    setIsBetModalOpen(true);
  };

  const handleBetModalClose = () => {
    setIsBetModalOpen(false);
    setSelectedMatch(null);
  };

  const handleBetSubmit = async (data: CreateBetData | UpdateBetData) => {
    // Only handle create mode in this component
    if (!("title" in data) || !data.title) {
      throw new Error("Invalid bet data for create mode");
    }

    try {
      setBetsLoading(true);

      // Get auth token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/bets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create bet");
      }

      // Refresh bets in store or show success message
      // You might want to refresh the bets store here
      handleBetModalClose();
    } catch (error) {
      console.error("Error creating bet:", error);
      throw error; // Let the modal handle the error
    } finally {
      setBetsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: TypedMatch["status"]) => {
    switch (status) {
      case "live":
        return "destructive"; // red
      case "finished":
        return "secondary"; // gray
      case "upcoming":
        return "default"; // blue
      default:
        return "outline";
    }
  };

  const formatScore = (score?: { home: number; away: number }) => {
    if (!score) return "-";
    return `${score.home} - ${score.away}`;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Football Dashboard</h1>
        <p className="text-muted-foreground">
          Live football match details and betting opportunities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              {DATE_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {DATE_TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading matches...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{error}</p>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No matches found for {tab.label.toLowerCase()}.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Teams</TableHead>
                          <TableHead>League</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          {user?.role === "admin" && (
                            <TableHead>Actions</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Group matches by league */}
                        {Object.entries(
                          matches.reduce((acc, match) => {
                            if (!acc[match.league]) {
                              acc[match.league] = [];
                            }
                            acc[match.league].push(match);
                            return acc;
                          }, {} as Record<string, typeof matches>)
                        ).map(([league, leagueMatches]) => (
                          <React.Fragment key={`league-${league}`}>
                            {/* League Header */}
                            <TableRow key={`header-${league}`}>
                              <TableCell
                                colSpan={user?.role === "admin" ? 6 : 5}
                                className="bg-muted/50 font-semibold text-primary"
                              >
                                {league}
                              </TableCell>
                            </TableRow>
                            {/* League Matches */}
                            {leagueMatches.map((match) => (
                              <TableRow key={match.id}>
                                <TableCell className="font-medium">
                                  {match.time}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                    <span className="truncate max-w-[120px] sm:max-w-none">
                                      {match.homeTeam}
                                    </span>
                                    <span className="text-muted-foreground hidden sm:inline">
                                      vs
                                    </span>
                                    <span className="truncate max-w-[120px] sm:max-w-none">
                                      {match.awayTeam}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="truncate max-w-[150px]">
                                  {match.league}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={getStatusBadgeVariant(
                                      match.status
                                    )}
                                  >
                                    {match.status.charAt(0).toUpperCase() +
                                      match.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {formatScore(match.score)}
                                </TableCell>
                                {user?.role === "admin" && (
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      onClick={() => handleCreateBet(match)}
                                      disabled={match.status === "finished"}
                                    >
                                      Create Bet
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Bet Modal */}
      <BetModal
        isOpen={isBetModalOpen}
        onClose={handleBetModalClose}
        mode="create"
        onSubmit={handleBetSubmit}
        initialTitle={
          selectedMatch
            ? `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`
            : ""
        }
        initialDescription={
          selectedMatch
            ? `Football match prediction: ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} in ${selectedMatch.league}`
            : ""
        }
        initialOptions={
          selectedMatch
            ? [selectedMatch.homeTeam, selectedMatch.awayTeam]
            : ["", ""]
        }
      />
    </div>
  );
}
