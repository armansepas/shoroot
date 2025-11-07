import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: "admin" | "user";
  hasAcceptedTerms: boolean;
  acceptedTermsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (user: User) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // Clear token from localStorage on logout
    localStorage.removeItem("token");
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  updateUser: (userUpdate: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userUpdate } : null,
    })),
}));
