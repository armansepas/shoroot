import { useUIStore } from "@/stores/ui-store";

export const useUI = () => {
  const {
    isLoading,
    loadingMessage,
    modal,
    notifications,
    sidebarOpen,
    setLoading,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleSidebar,
    setSidebarOpen,
    reset,
  } = useUIStore();

  return {
    isLoading,
    loadingMessage,
    modal,
    notifications,
    sidebarOpen,
    setLoading,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleSidebar,
    setSidebarOpen,
    reset,
  };
};
