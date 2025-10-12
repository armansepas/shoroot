export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Bet {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "active" | "in-progress" | "resolved";
  winningOption?: string;
  options: BetOption[];
  participationCount: number;
  createdAt: string;
}

export interface BetOption {
  id: number;
  optionText: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: "admin" | "user";
}

export interface CreateBetData {
  title: string;
  description: string;
  amount: number;
  options: string[];
}

export interface UpdateBetData {
  title?: string;
  description?: string;
  amount?: number;
  options?: string[];
}

export interface AdminDashboardProps {
  // Add any props if needed
}
