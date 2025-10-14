import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stats } from "../types";
import { formatCurrency } from "../utils";

interface LeaderboardProps {
  stats: Stats;
}

export function Leaderboard({ stats }: LeaderboardProps) {
  return (
    <div>
      {/* Top Winners Cards */}
      {stats && (stats.topWinnerByCount || stats.topWinnerByAmount) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.topWinnerByCount && (
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">🏆</div>
                <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
                  Champion
                </CardTitle>
                <CardDescription className="text-sm">Most Wins</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.topWinnerByCount.winCount}
                </div>
                <p className="text-sm text-muted-foreground mb-2">wins by</p>
                <p className="font-semibold text-foreground text-lg">
                  {stats.topWinnerByCount.fullName ||
                    stats.topWinnerByCount.email}
                </p>
              </CardContent>
            </Card>
          )}
          {stats.topWinnerByAmount && (
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-green-200 dark:border-green-800">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">💰</div>
                <CardTitle className="text-xl text-green-600 dark:text-green-400">
                  High Roller
                </CardTitle>
                <CardDescription className="text-sm">
                  Biggest Winner
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {formatCurrency(stats.topWinnerByAmount.totalWon)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">won by</p>
                <p className="font-semibold text-foreground text-lg">
                  {stats.topWinnerByAmount.fullName ||
                    stats.topWinnerByAmount.email}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🏆 Complete Leaderboard
          </CardTitle>
          <CardDescription>
            All users ranked by their betting performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.leaderboard && stats.leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="w-16 font-semibold">Rank</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="text-center font-semibold">
                      Wins
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Losses
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Won
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Lost
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Total Bets
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.leaderboard.map((entry, index) => (
                    <TableRow
                      key={entry.userId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-bold text-lg">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.fullName || entry.email.split("@")[0]}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                          <span>✓</span> {entry.winCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-red-500 dark:text-red-400">
                          {entry.lostCount || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(entry.totalWon || 0)}
                      </TableCell>
                      <TableCell className="text-right text-red-500 dark:text-red-400">
                        {formatCurrency(entry.totalLost || 0)}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {entry.totalParticipation || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎲</div>
              <p className="text-muted-foreground text-lg">
                No betting activity yet
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                Be the first to place a bet and claim the top spot!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
