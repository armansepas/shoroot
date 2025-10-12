import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from "../types";
import { formatCurrency } from "../utils";

interface StatsCardsProps {
  userStats: UserStats;
}

export function StatsCards({ userStats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {userStats.participated}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Participated
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {userStats.won}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Won</p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {userStats.lost}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Lost</p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(userStats.totalMoneyWon)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Money Won</p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(userStats.totalMoneyLost)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Money Lost</p>
        </CardContent>
      </Card>
    </div>
  );
}
