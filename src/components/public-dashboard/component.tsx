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
import { useAuth } from "@/hooks/use-auth";
import { Bet, BetOption } from "./types";
import { getStatusColor, formatCurrency } from "./utils";

export function PublicDashboard() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch("/api/bets/public");
        if (!response.ok) {
          throw new Error("Failed to fetch bets");
        }
        const data = await response.json();
        setBets(data.bets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBets();
  }, []);

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {bets.filter((b) => b.status === "active").length}
            </div>
            <p className="text-gray-600">Active Bets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {bets.filter((b) => b.status === "in-progress").length}
            </div>
            <p className="text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {bets.filter((b) => b.status === "resolved").length}
            </div>
            <p className="text-gray-600">Resolved Bets</p>
          </CardContent>
        </Card>
      </div>

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
                      <span className="font-medium">Option {index + 1}:</span>{" "}
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
    </div>
  );
}
