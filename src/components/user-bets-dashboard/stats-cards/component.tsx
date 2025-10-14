import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from "../types";
import { formatCurrency } from "../utils";

interface StatsCardsProps {
  userStats: UserStats;
}

export function StatsCards({ userStats }: StatsCardsProps) {
  const statsData = [
    {
      value: userStats.participated,
      label: "Participated",
      icon: "🎯",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: userStats.won,
      label: "Won",
      icon: "🏆",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      value: userStats.lost,
      label: "Lost",
      icon: "❌",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      value: formatCurrency(userStats.totalMoneyWon),
      label: "Money Won",
      icon: "💰",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      value: formatCurrency(userStats.totalMoneyLost),
      label: "Money Lost",
      icon: "📉",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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
