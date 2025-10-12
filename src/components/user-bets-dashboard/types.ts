export interface BetOption {
  id: number;
  optionText: string;
}

export interface Bet {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "active" | "in-progress" | "resolved";
  winningOption?: string;
  winningOptionText?: string;
  options: BetOption[];
  participationCount: number;
  hasUserParticipated: boolean;
  createdAt: string;
}

export interface UserBetsDashboardProps {
  // Add any props if needed
}

export type TabType = "all" | "active" | "in-progress" | "resolved";
