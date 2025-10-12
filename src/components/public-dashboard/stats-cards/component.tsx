import { Card, CardContent } from "@/components/ui/card";
import { Stats } from "../types";
import { formatCurrency } from "../utils";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalBets}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Total Bets</p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {stats.activeBets}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Active</p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.inProgressBets}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            In Progress
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {stats.closedBets}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Closed</p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(stats.totalMoneyRaised)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Money Raised
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.totalUsers}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Users</p>
        </CardContent>
      </Card>
    </div>
  );
}
