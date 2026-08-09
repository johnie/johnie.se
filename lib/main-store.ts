import { create } from "zustand";

export interface MainStore {
  isCmdOpen: boolean;
  setCmd: (isCmdOpen: boolean) => void;
  toggleCmd: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  isCmdOpen: false,
  setCmd: (isCmdOpen) => set({ isCmdOpen }),
  toggleCmd: () => set((state) => ({ isCmdOpen: !state.isCmdOpen })),
}));
