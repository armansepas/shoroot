import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bet, TabType } from "../types";
import {
  getStatusColor,
  getCardBackgroundColor,
  formatCurrency,
  canParticipate,
} from "../utils";

interface BetsGridProps {
  bets: Record<TabType, Bet[]>;
  activeTab: TabType;
  onParticipate: (bet: Bet) => void;
}

export function BetsGrid({ bets, activeTab, onParticipate }: BetsGridProps) {
  const currentBets = bets[activeTab];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentBets.map((bet) => (
        <Card
          key={bet.id}
          className={`${getCardBackgroundColor(
            bet.status
          )} hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border-border/50`}
        >
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-3">
              <CardTitle className="text-lg line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {bet.title}
              </CardTitle>
              <Badge className={`${getStatusColor(bet.status)} font-medium`}>
                {bet.status.replace("-", " ")}
              </Badge>
            </div>
            <CardDescription className="line-clamp-3 text-muted-foreground">
              {bet.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Amount, Participants, and Date */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Amount:</span>
                  <span className="text-primary font-semibold">
                    {formatCurrency(bet.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">
                    Participants:
                  </span>
                  <span className="text-muted-foreground">
                    {bet.participationCount}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {new Date(bet.createdAt).toLocaleDateString()}
              </div>

              {/* Participation Status */}
              {bet.hasUserParticipated && (
                <div className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <span className="text-lg">✅</span>
                  <span className="text-blue-700 dark:text-blue-300">
                    You have participated in this bet
                  </span>
                </div>
              )}

              {/* Winning Option for Resolved Bets */}
              {bet.status === "resolved" && bet.winningOptionText && (
                <div className="flex items-center gap-2 text-sm font-medium p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                  <span className="text-2xl">🏆</span>
                  <span className="text-green-700 dark:text-green-300">
                    Winner: {bet.winningOptionText}
                  </span>
                </div>
              )}

              {/* Options Preview */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">
                  Options:
                </div>
                {bet.options.slice(0, 2).map((option, index) => (
                  <div
                    key={option.id}
                    className="text-sm text-muted-foreground bg-muted/30 p-2 rounded"
                  >
                    {index + 1}. {option.optionText}
                  </div>
                ))}
                {bet.options.length > 2 && (
                  <div className="text-sm text-muted-foreground/70">
                    +{bet.options.length - 2} more options available
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {canParticipate(bet) && (
                  <Button
                    onClick={() => onParticipate(bet)}
                    className="flex-1 bg-primary hover:bg-primary/90 transition-colors"
                  >
                    🎯 Participate
                  </Button>
                )}
                <Link href={`/bet/${bet.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                  >
                    View Details →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {currentBets.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="text-6xl mb-4">
            {activeTab === "all"
              ? "🎲"
              : activeTab === "active"
              ? "⚡"
              : activeTab === "in-progress"
              ? "⏳"
              : "✅"}
          </div>
          <p className="text-muted-foreground text-lg">
            {activeTab === "all"
              ? "No bets available at the moment."
              : `No ${activeTab} bets found.`}
          </p>
          <p className="text-muted-foreground/70 text-sm mt-2">
            {activeTab === "all"
              ? "Check back later for new betting opportunities!"
              : "Try switching to a different tab to see more bets."}
          </p>
        </div>
      )}
    </div>
  );
}
