import { lazy, Suspense, useEffect, useState } from "react";

import { useMainStore } from "@/lib/main-store";

const IDLE_PRELOAD_TIMEOUT_MS = 2000;

const loadPalette = () => import("@/components/cmd");

let paletteModule: ReturnType<typeof loadPalette> | undefined;

/** Fetches the palette chunk ahead of the first open so ⌘K responds instantly. */
export const preloadCommandPalette = () => {
  paletteModule ??= loadPalette();

  return paletteModule;
};

// Rendered only after the first open: the palette reads document during initialization.
const CommandPalette = lazy(async () => {
  const { Cmd: Palette } = await preloadCommandPalette();

  return { default: Palette };
});

export const Cmd = () => {
  const isCmdOpen = useMainStore((state) => state.isCmdOpen);
  const toggleCmd = useMainStore((state) => state.toggleCmd);
  // Stay mounted after the first open so the close animation can run.
  const [hasOpened, setHasOpened] = useState(false);

  if (isCmdOpen && !hasOpened) {
    setHasOpened(true);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleCmd();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleCmd]);

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

  return hasOpened ? (
    <Suspense fallback={null}>
      <CommandPalette />
    </Suspense>
  ) : null;
};
