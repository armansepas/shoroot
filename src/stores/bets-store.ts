import { create } from "zustand";

export interface BetOption {
  id: number;
  betId: number;
  optionText: string;
  createdAt: string;
}

export interface BetParticipation {
  id: number;
  userId: number;
  betId: number;
  selectedOptionId: number | null;
  isWinner: boolean | null;
  participatedAt: string;
}

export interface Bet {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "active" | "in-progress" | "resolved";
  winningOption: string | null;
  createdAt: string;
  updatedAt: string;
  options?: BetOption[];
  participations?: BetParticipation[];
}

export interface BetDetails {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "active" | "in-progress" | "resolved";
  winningOption: string | null;
  options: BetOption[];
  participants: {
    id: number;
    userId: number;
    selectedOptionText: string | null;
    isWinner: boolean | null;
    participatedAt: string;
  }[];
  participationCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BetsState {
  allBets: Bet[];
  activeBets: Bet[];
  inProgressBets: Bet[];
  resolvedBets: Bet[];
  currentBet: Bet | null;
  isLoading: boolean;
  error: string | null;
}

interface BetsActions {
  setAllBets: (bets: Bet[]) => void;
  setActiveBets: (bets: Bet[]) => void;
  setInProgressBets: (bets: Bet[]) => void;
  setResolvedBets: (bets: Bet[]) => void;
  setCurrentBet: (bet: Bet | null) => void;
  addBet: (bet: Bet) => void;
  updateBet: (betId: number, updates: Partial<Bet>) => void;
  removeBet: (betId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
  getSingleBet: (betId: number) => Promise<BetDetails>;
}

type BetsStore = BetsState & BetsActions;

export const useBetsStore = create<BetsStore>((set, get) => ({
  allBets: [],
  activeBets: [],
  inProgressBets: [],
  resolvedBets: [],
  currentBet: null,
  isLoading: false,
  error: null,

  setAllBets: (bets: Bet[]) =>
    set({
      allBets: bets,
      activeBets: bets.filter((bet) => bet.status === "active"),
      inProgressBets: bets.filter((bet) => bet.status === "in-progress"),
      resolvedBets: bets.filter((bet) => bet.status === "resolved"),
    }),

  setActiveBets: (bets: Bet[]) => set({ activeBets: bets }),

  setInProgressBets: (bets: Bet[]) => set({ inProgressBets: bets }),

  setResolvedBets: (bets: Bet[]) => set({ resolvedBets: bets }),

  setCurrentBet: (bet: Bet | null) => set({ currentBet: bet }),

  addBet: (bet: Bet) =>
    set((state) => {
      const newAllBets = [...state.allBets, bet];
      return {
        allBets: newAllBets,
        activeBets:
          bet.status === "active"
            ? [...state.activeBets, bet]
            : state.activeBets,
        inProgressBets:
          bet.status === "in-progress"
            ? [...state.inProgressBets, bet]
            : state.inProgressBets,
        resolvedBets:
          bet.status === "resolved"
            ? [...state.resolvedBets, bet]
            : state.resolvedBets,
      };
    }),

  updateBet: (betId: number, updates: Partial<Bet>) =>
    set((state) => {
      const updateBetInArray = (bets: Bet[]) =>
        bets.map((bet) => (bet.id === betId ? { ...bet, ...updates } : bet));

      const updatedAllBets = updateBetInArray(state.allBets);
      const updatedActiveBets = updateBetInArray(state.activeBets);
      const updatedInProgressBets = updateBetInArray(state.inProgressBets);
      const updatedResolvedBets = updateBetInArray(state.resolvedBets);

      return {
        allBets: updatedAllBets,
        activeBets: updatedActiveBets,
        inProgressBets: updatedInProgressBets,
        resolvedBets: updatedResolvedBets,
        currentBet:
          state.currentBet?.id === betId
            ? { ...state.currentBet, ...updates }
            : state.currentBet,
      };
    }),

  removeBet: (betId: number) =>
    set((state) => ({
      allBets: state.allBets.filter((bet) => bet.id !== betId),
      activeBets: state.activeBets.filter((bet) => bet.id !== betId),
      inProgressBets: state.inProgressBets.filter((bet) => bet.id !== betId),
      resolvedBets: state.resolvedBets.filter((bet) => bet.id !== betId),
      currentBet: state.currentBet?.id === betId ? null : state.currentBet,
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearAll: () =>
    set({
      allBets: [],
      activeBets: [],
      inProgressBets: [],
      resolvedBets: [],
      currentBet: null,
      isLoading: false,
      error: null,
    }),

  getSingleBet: async (betId: number): Promise<BetDetails> => {
    try {
      const response = await fetch(`/api/bets/${betId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bet details");
      }
      const data = await response.json();
      return data.bet;
    } catch (error) {
      console.error("Error fetching single bet:", error);
      throw error;
    }
  },
}));
