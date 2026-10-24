import { useSyncExternalStore } from "react";

export interface ViewportPoint {
  x: number;
  y: number;
}

export interface MainState {
  /** Viewport point the palette grows from and returns to; null = centre. */
  cmdOrigin: ViewportPoint | null;
  isCmdOpen: boolean;
}

let state: MainState = { cmdOrigin: null, isCmdOpen: false };
const listeners = new Set<() => void>();

const setState = (patch: Partial<MainState>) => {
  state = { ...state, ...patch };

  for (const listener of listeners) {
    listener();
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getState = () => state;

/** Selectors must return stable values (fields of state), not fresh objects. */
export const useMainStore = <T>(selector: (state: MainState) => T): T =>
  useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getState())
  );

export const openCmdFrom = (origin: ViewportPoint) =>
  setState({ cmdOrigin: origin, isCmdOpen: true });

export const setCmd = (isCmdOpen: boolean) => setState({ isCmdOpen });

// Keyboard opens have no on-screen source, so they grow from the centre.
// Closing keeps the origin so the exit retraces the entrance.
export const toggleCmd = () =>
  setState(
    state.isCmdOpen
      ? { isCmdOpen: false }
      : { cmdOrigin: null, isCmdOpen: true }
  );
