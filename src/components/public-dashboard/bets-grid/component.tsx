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
          className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border-border/50"
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
              {/* Amount and Participants */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Bet:</span>
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

              {/* Options */}
              <div className="space-y-2">
                {bet.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded-md text-sm border transition-colors ${
                      bet.status === "resolved" &&
                      bet.winningOptionText === option.optionText
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 shadow-sm"
                        : "bg-muted/30 border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Option {index + 1}: {option.optionText}
                      </span>
                      {bet.status === "resolved" &&
                        bet.winningOptionText === option.optionText && (
                          <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                            🏆
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* View Details Button */}
              <Link href={`/bet/${bet.id}`}>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                >
                  View Details →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {bets.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="text-6xl mb-4">🎲</div>
          <p className="text-muted-foreground text-lg">
            No bets available at the moment.
          </p>
          <p className="text-muted-foreground/70 text-sm mt-2">
            Check back later for new betting opportunities!
          </p>
        </div>
      )}
    </div>
  );
}
