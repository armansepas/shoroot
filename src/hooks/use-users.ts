import { useUsersStore } from "@/stores/users-store";

export const useUsers = () => {
  const {
    currentUser,
    allUsers,
    isLoading,
    error,
    setCurrentUser,
    setAllUsers,
    addUser,
    updateUser,
    removeUser,
    setLoading,
    setError,
    clearAll,
  } = useUsersStore();

  return {
    currentUser,
    allUsers,
    isLoading,
    error,
    setCurrentUser,
    setAllUsers,
    addUser,
    updateUser,
    removeUser,
    setLoading,
    setError,
    clearAll,
  };
};
