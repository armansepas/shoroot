import { Bet } from "./types";

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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

export const sortBetsByStatus = (bets: Bet[]): Bet[] => {
  const statusOrder = { active: 1, "in-progress": 2, resolved: 3 };
  return [...bets].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );
};
