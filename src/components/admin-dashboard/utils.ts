import { User, Bet } from "./types";

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

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

export const getRoleColor = (role: string): string => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "user":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { isValid: true };
};

export const validateBetOptions = (
  options: string[]
): { isValid: boolean; message?: string } => {
  if (options.length < 2) {
    return { isValid: false, message: "At least 2 options are required" };
  }

  const trimmedOptions = options
    .map((opt) => opt.trim())
    .filter((opt) => opt.length > 0);
  if (trimmedOptions.length !== options.length) {
    return { isValid: false, message: "All options must be non-empty" };
  }

  const uniqueOptions = new Set(trimmedOptions);
  if (uniqueOptions.size !== trimmedOptions.length) {
    return { isValid: false, message: "All options must be unique" };
  }

  return { isValid: true };
};
