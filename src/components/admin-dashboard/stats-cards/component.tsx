import { Card, CardContent } from "@/components/ui/card";
import { AdminStats } from "../types";
import { formatCurrency } from "../utils";

interface StatsCardsProps {
  adminStats: AdminStats;
}

export function StatsCards({ adminStats }: StatsCardsProps) {
  const statsData = [
    {
      value: adminStats.totalUsers,
      label: "Total Users",
      icon: "👥",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: adminStats.activeBets,
      label: "Active Bets",
      icon: "⚡",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      value: adminStats.resolvedBets,
      label: "Resolved Bets",
      icon: "✅",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      value: adminStats.closedBets,
      label: "Closed Bets",
      icon: "🔒",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      value: formatCurrency(adminStats.totalMoneyRaised),
      label: "Total Money Raised",
      icon: "💰",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-6 text-center">
            <div
              className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}
            >
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
