import { Bet, TabType } from "./types";

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
    case "in-progress":
      return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    case "resolved":
      return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    default:
      return "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  }
};

export const getCardBackgroundColor = (status: string): string => {
  // Use consistent design system colors
  return "";
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

export const getTabLabel = (tab: TabType): string => {
  switch (tab) {
    case "all":
      return "All Bets";
    case "active":
      return "Active";
    case "in-progress":
      return "In Progress";
    case "resolved":
      return "Completed";
    default:
      return "All Bets";
  }
};

export const canParticipate = (bet: Bet): boolean => {
  return bet.status === "active" && !bet.hasUserParticipated;
};
