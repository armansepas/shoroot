export interface FootballDashboardProps {
  // Component props if needed
}

export interface FootballDashboardState {
  activeTab: string;
  matches: import("@/types/football").TypedMatch[];
  loading: boolean;
  error: string | null;
}
