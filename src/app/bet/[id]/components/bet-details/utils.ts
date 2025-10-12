export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()} تومان`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "in-progress":
      return "bg-yellow-500";
    case "resolved":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "active":
      return "فعال";
    case "in-progress":
      return "در حال انجام";
    case "resolved":
      return "حل شده";
    default:
      return status;
  }
};
