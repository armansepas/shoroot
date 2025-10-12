import { Card, CardContent } from "@/components/ui/card";
import { AdminStats } from "../types";
import { formatCurrency } from "../utils";

interface StatsCardsProps {
  adminStats: AdminStats;
}

export function StatsCards({ adminStats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {adminStats.totalUsers}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Total Users
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {adminStats.activeBets}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Active Bets
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {adminStats.resolvedBets}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Resolved Bets
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {adminStats.closedBets}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Closed Bets
          </p>
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(adminStats.totalMoneyRaised)}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Total Money Raised
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
