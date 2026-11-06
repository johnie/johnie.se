import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import type {
  Palette,
  PaletteProps,
} from "@/components/command-palette/palette";

type Origin = NonNullable<PaletteProps["origin"]>;

const CommandPaletteContext = createContext<((origin: Origin) => void) | null>(
  null
);

const IDLE_PRELOAD_TIMEOUT_MS = 2000;
let paletteModule: Promise<{ Palette: typeof Palette }> | undefined;

export const preloadCommandPalette = () => {
  paletteModule ??= import("@/components/command-palette/palette");

  return paletteModule;
};

const CommandPalette = lazy(async () => {
  const { Palette } = await preloadCommandPalette();

  return { default: Palette };
});

export const useOpenCommandPalette = () => {
  const openFrom = useContext(CommandPaletteContext);

  if (!openFrom) {
    throw new Error("Command palette trigger requires CommandPaletteProvider");
  }

  return openFrom;
};

export const CommandPaletteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<{
    hasOpened: boolean;
    open: boolean;
    origin: PaletteProps["origin"];
  }>({ hasOpened: false, open: false, origin: null });

  const openFrom = useCallback((origin: Origin) => {
    setState({ hasOpened: true, open: true, origin });
  }, []);

  const setOpen = (open: boolean) => {
    setState((previous) => ({
      ...previous,
      hasOpened: previous.hasOpened || open,
      open,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setState((previous) => ({
          hasOpened: true,
          open: !previous.open,
          origin: previous.open ? previous.origin : null,
        }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preloadCommandPalette, {
        timeout: IDLE_PRELOAD_TIMEOUT_MS,
      });

      return () => window.cancelIdleCallback(id);
    }

    // Safari has no requestIdleCallback.
    const id = setTimeout(preloadCommandPalette, IDLE_PRELOAD_TIMEOUT_MS);

    return () => clearTimeout(id);
  }, []);

  return (
    <CommandPaletteContext value={openFrom}>
      {children}
      {state.hasOpened ? (
        <Suspense fallback={null}>
          <CommandPalette
            onOpenChange={setOpen}
            open={state.open}
            origin={state.origin}
          />
        </Suspense>
      ) : null}
    </CommandPaletteContext>
  );
};
