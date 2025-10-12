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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {stats.topWinnerByCount && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  🏆 Most Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.topWinnerByCount.winCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    wins by
                  </p>
                  <p className="font-medium dark:text-white">
                    {stats.topWinnerByCount.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {stats.topWinnerByAmount && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  💰 Biggest Winner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(stats.topWinnerByAmount.totalWon)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    won by
                  </p>
                  <p className="font-medium dark:text-white">
                    {stats.topWinnerByAmount.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">
            🏆 Leaderboard - Top Winners
          </CardTitle>
          <CardDescription className="dark:text-gray-300">
            Users ranked by total amount won
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.leaderboard && stats.leaderboard.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="dark:text-gray-300">Rank</TableHead>
                  <TableHead className="dark:text-gray-300">User</TableHead>
                  <TableHead className="dark:text-gray-300">
                    Total Won
                  </TableHead>
                  <TableHead className="dark:text-gray-300">Wins</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.leaderboard.map((entry, index) => (
                  <TableRow key={entry.userId}>
                    <TableCell className="font-medium dark:text-white">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="dark:text-white">
                      {entry.email}
                    </TableCell>
                    <TableCell className="text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(entry.totalWon)}
                    </TableCell>
                    <TableCell className="dark:text-white">
                      {entry.winCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No winners yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
