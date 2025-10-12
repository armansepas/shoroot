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
import { Bet } from "../types";
import { getStatusColor, formatCurrency } from "../utils";

interface BetsGridProps {
  bets: Bet[];
}

export function BetsGrid({ bets }: BetsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bets.map((bet) => (
        <Card
          key={bet.id}
          className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
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
              {/* Amount and Participants */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
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
                        ? "bg-green-50 dark:bg-green-900 border-green-200 text-green-800 dark:text-green-200"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <span className="font-medium dark:text-white">
                      Option {index + 1}:
                    </span>{" "}
                    {option.optionText}
                    {bet.status === "resolved" &&
                      bet.winningOptionText === option.optionText && (
                        <span className="ml-2 text-green-600 dark:text-green-400 font-bold">
                          ✓ Winner
                        </span>
                      )}
                  </div>
                ))}
              </div>

              {/* View Details Button */}
              <Link href={`/bet/${bet.id}`}>
                <Button
                  variant="outline"
                  className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {bets.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No bets available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
