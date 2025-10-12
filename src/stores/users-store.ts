import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

interface UsersState {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
  error: string | null;
}

interface UsersActions {
  setCurrentUser: (user: User | null) => void;
  setAllUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (userId: number, updates: Partial<User>) => void;
  removeUser: (userId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

type UsersStore = UsersState & UsersActions;

export const useUsersStore = create<UsersStore>((set, get) => ({
  currentUser: null,
  allUsers: [],
  isLoading: false,
  error: null,

  setCurrentUser: (user: User | null) => set({ currentUser: user }),

  setAllUsers: (users: User[]) => set({ allUsers: users }),

  addUser: (user: User) =>
    set((state) => ({
      allUsers: [...state.allUsers, user],
    })),

  updateUser: (userId: number, updates: Partial<User>) =>
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...updates }
          : state.currentUser,
    })),

  removeUser: (userId: number) =>
    set((state) => ({
      allUsers: state.allUsers.filter((user) => user.id !== userId),
      currentUser: state.currentUser?.id === userId ? null : state.currentUser,
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearAll: () =>
    set({
      currentUser: null,
      allUsers: [],
      isLoading: false,
      error: null,
    }),
}));
