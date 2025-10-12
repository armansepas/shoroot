import { useBetsStore } from "@/stores/bets-store";

export const useBets = () => {
  const {
    allBets,
    activeBets,
    inProgressBets,
    resolvedBets,
    currentBet,
    isLoading,
    error,
    setAllBets,
    setActiveBets,
    setInProgressBets,
    setResolvedBets,
    setCurrentBet,
    addBet,
    updateBet,
    removeBet,
    setLoading,
    setError,
    clearAll,
  } = useBetsStore();

  return {
    allBets,
    activeBets,
    inProgressBets,
    resolvedBets,
    currentBet,
    isLoading,
    error,
    setAllBets,
    setActiveBets,
    setInProgressBets,
    setResolvedBets,
    setCurrentBet,
    addBet,
    updateBet,
    removeBet,
    setLoading,
    setError,
    clearAll,
  };
};
