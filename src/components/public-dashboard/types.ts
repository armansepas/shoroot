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
  createdAt: string;
}

export interface PublicDashboardProps {
  // Add any props if needed
}
