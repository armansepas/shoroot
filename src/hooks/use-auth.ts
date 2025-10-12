import { useAuthStore } from "@/stores/auth-store";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setLoading,
    setError,
    updateUser,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setLoading,
    setError,
    updateUser,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
};
