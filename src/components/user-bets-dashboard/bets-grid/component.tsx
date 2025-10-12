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
          )} hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700`}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2 dark:text-white">
                {bet.title}
              </CardTitle>
              <Badge className={getStatusColor(bet.status)}>
                {bet.status.replace("-", " ")}
              </Badge>
            </div>
            <CardDescription className="line-clamp-3 dark:text-gray-300">
              {bet.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Amount, Participants, and Date */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Amount: {formatCurrency(bet.amount)}</span>
                <span>{bet.participationCount} participants</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(bet.createdAt).toLocaleDateString()}
              </div>

              {/* Participation Status */}
              {bet.hasUserParticipated && (
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  ✓ You have participated in this bet
                </div>
              )}

              {/* Winning Option for Resolved Bets */}
              {bet.status === "resolved" && bet.winningOptionText && (
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  🏆 Winning Option: {bet.winningOptionText}
                </div>
              )}

              {/* Options Preview */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Options:
                </div>
                {bet.options.slice(0, 2).map((option, index) => (
                  <div
                    key={option.id}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    {index + 1}. {option.optionText}
                  </div>
                ))}
                {bet.options.length > 2 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    +{bet.options.length - 2} more options available
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {canParticipate(bet) && (
                  <Button onClick={() => onParticipate(bet)} className="flex-1">
                    Participate
                  </Button>
                )}
                <Link href={`/bet/${bet.id}`}>
                  <Button
                    variant="outline"
                    className="flex-1 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {currentBets.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === "all"
              ? "No bets available at the moment."
              : `No ${activeTab} bets found.`}
          </p>
        </div>
      )}
    </div>
  );
}
