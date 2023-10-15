import { create } from 'zustand';

export type MainStore = {
  isCmdOpen: boolean;
  toggleCmd: () => void;
  setCmd: (isCmdOpen: boolean) => void;
};

export const useMainStore = create<MainStore>((set) => ({
  isCmdOpen: false,
  toggleCmd: () => set((state) => ({ isCmdOpen: !state.isCmdOpen })),
  setCmd: (isCmdOpen) => set({ isCmdOpen }),
}));
