"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Bet, BetOption, Stats } from "./types";
import { getStatusColor, formatCurrency } from "./utils";

export function PublicDashboard() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

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
  }, [user]);

  const handleParticipateClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ShorOOt
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover and participate in exciting bets. Join the fun and test your
          predictions!
        </p>
        <Button onClick={handleParticipateClick} size="lg" className="mb-8">
          {isAuthenticated ? "View My Bets" : "Participate Now"}
        </Button>
      </div>

      <Tabs defaultValue="bets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bets">Available Bets</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="bets" className="mt-6">
          {/* Bets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bets.map((bet) => (
              <Card key={bet.id} className="hover:shadow-lg transition-shadow">
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
                    {/* Amount and Participants */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Bet Amount: {formatCurrency(bet.amount)}</span>
                      <span>{bet.participationCount} participants</span>
                    </div>

                    {/* Options */}
                    <div className="space-y-1">
                      {bet.options.map((option, index) => (
                        <div
                          key={option.id}
                          className={`p-2 rounded text-sm border ${
                            bet.status === "resolved" &&
                            bet.winningOptionText === option.optionText
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <span className="font-medium">
                            Option {index + 1}:
                          </span>{" "}
                          {option.optionText}
                          {bet.status === "resolved" &&
                            bet.winningOptionText === option.optionText && (
                              <span className="ml-2 text-green-600 font-bold">
                                ✓ Winner
                              </span>
                            )}
                        </div>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <Link href={`/bet/${bet.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {bets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No bets available at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {stats.totalBets}
                  </div>
                  <p className="text-xs text-gray-600">Total Bets</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-green-600">
                    {stats.activeBets}
                  </div>
                  <p className="text-xs text-gray-600">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    {stats.inProgressBets}
                  </div>
                  <p className="text-xs text-gray-600">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-red-600">
                    {stats.closedBets}
                  </div>
                  <p className="text-xs text-gray-600">Closed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(stats.totalMoneyRaised)}
                  </div>
                  <p className="text-xs text-gray-600">Money Raised</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-indigo-600">
                    {stats.totalUsers}
                  </div>
                  <p className="text-xs text-gray-600">Users</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Winners */}
          {stats && (stats.topWinnerByCount || stats.topWinnerByAmount) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {stats.topWinnerByCount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🏆 Most Wins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.topWinnerByCount.winCount}
                      </div>
                      <p className="text-sm text-gray-600">wins by</p>
                      <p className="font-medium">
                        {stats.topWinnerByCount.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {stats.topWinnerByAmount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">💰 Biggest Winner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(stats.topWinnerByAmount.totalWon)}
                      </div>
                      <p className="text-sm text-gray-600">won by</p>
                      <p className="font-medium">
                        {stats.topWinnerByAmount.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>🏆 Leaderboard - Top Winners</CardTitle>
              <CardDescription>
                Users ranked by total amount won
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.leaderboard && stats.leaderboard.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Total Won</TableHead>
                      <TableHead>Wins</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.leaderboard.map((entry, index) => (
                      <TableRow key={entry.userId}>
                        <TableCell className="font-medium">
                          #{index + 1}
                        </TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(entry.totalWon)}
                        </TableCell>
                        <TableCell>{entry.winCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No winners yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
