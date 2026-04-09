import { create } from "zustand";

export interface MainStore {
  isCmdOpen: boolean;
  setCmd: (isCmdOpen: boolean) => void;
  toggleCmd: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  isCmdOpen: false,
  toggleCmd: () => set((state) => ({ isCmdOpen: !state.isCmdOpen })),
  setCmd: (isCmdOpen) => set({ isCmdOpen }),
}));
