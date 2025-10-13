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

export interface LeaderboardEntry {
  userId: number;
  email: string;
  fullName: string | null;
  totalWon: number;
  totalLost: number;
  winCount: number;
  lostCount: number;
  totalParticipation: number;
}

export interface Stats {
  totalBets: number;
  activeBets: number;
  inProgressBets: number;
  closedBets: number;
  totalMoneyRaised: number;
  totalUsers: number;
  topWinnerByCount: {
    userId: number;
    email: string;
    fullName: string | null;
    winCount: number;
  } | null;
  topWinnerByAmount: {
    userId: number;
    email: string;
    fullName: string | null;
    totalWon: number;
  } | null;
  leaderboard: LeaderboardEntry[];
}

export interface PublicDashboardProps {
  // Add any props if needed
}
