import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

interface UIState {
  isLoading: boolean;
  loadingMessage: string | null;
  modal: ModalState;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  }>;
  sidebarOpen: boolean;
}

interface UIActions {
  setLoading: (loading: boolean, message?: string | null) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  reset: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  isLoading: false,
  loadingMessage: null,
  modal: {
    isOpen: false,
    type: null,
    data: undefined,
  },
  notifications: [],
  sidebarOpen: false,
};

export const useUIStore = create<UIStore>((set, get) => ({
  ...initialState,

  setLoading: (loading: boolean, message: string | null = null) =>
    set({
      isLoading: loading,
      loadingMessage: loading ? message : null,
    }),

  openModal: (type: string, data?: any) =>
    set({
      modal: {
        isOpen: true,
        type,
        data,
      },
    }),

  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        type: null,
        data: undefined,
      },
    }),

  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after duration
    if (newNotification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration || 5000);
    }
  },

  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  reset: () => set(initialState),
}));
