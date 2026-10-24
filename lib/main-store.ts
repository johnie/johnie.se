import { create } from "zustand";

export interface ViewportPoint {
  x: number;
  y: number;
}

export interface MainStore {
  /** Viewport point the palette grows from and returns to; null = centre. */
  cmdOrigin: ViewportPoint | null;
  isCmdOpen: boolean;
  openCmdFrom: (origin: ViewportPoint) => void;
  setCmd: (isCmdOpen: boolean) => void;
  toggleCmd: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  cmdOrigin: null,
  isCmdOpen: false,
  openCmdFrom: (origin) => set({ cmdOrigin: origin, isCmdOpen: true }),
  setCmd: (isCmdOpen) => set({ isCmdOpen }),
  // Keyboard opens have no on-screen source, so they grow from the centre.
  // Closing keeps the origin so the exit retraces the entrance.
  toggleCmd: () =>
    set((state) =>
      state.isCmdOpen
        ? { isCmdOpen: false }
        : { cmdOrigin: null, isCmdOpen: true }
    ),
}));
