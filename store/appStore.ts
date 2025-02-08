import { create } from "zustand";

type State = {
  sidebarOpen: boolean;
};

type Actions = {
  setSidebarOpen: (sidebarOpened: State["sidebarOpen"]) => void;
};

const useAppStore = create<State & Actions>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen: sidebarOpen }),
}));

export { useAppStore };
