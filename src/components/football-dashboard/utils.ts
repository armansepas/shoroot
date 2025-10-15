import { TypedMatch } from "@/types/football";

export const formatMatchTime = (time: string): string => {
  // Convert HH:MM to readable time format
  try {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return time;
  }
};

export const getStatusColor = (status: TypedMatch["status"]): string => {
  switch (status) {
    case "live":
      return "text-red-600";
    case "finished":
      return "text-gray-600";
    case "upcoming":
      return "text-blue-600";
    default:
      return "text-gray-500";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
