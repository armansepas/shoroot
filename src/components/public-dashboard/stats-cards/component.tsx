import { Card, CardContent } from "@/components/ui/card";
import { Stats } from "../types";
import { formatCurrency } from "../utils";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      value: stats.totalBets,
      label: "Total Bets",
      icon: "🎯",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: stats.activeBets,
      label: "Active",
      icon: "⚡",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      value: stats.inProgressBets,
      label: "In Progress",
      icon: "⏳",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      value: stats.closedBets,
      label: "Closed",
      icon: "🔒",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      value: formatCurrency(stats.totalMoneyRaised),
      label: "Money Raised",
      icon: "💰",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      value: stats.totalUsers,
      label: "Users",
      icon: "👥",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
