import { lazy, Suspense, useEffect } from "react";

import { useMainStore } from "@/lib/main-store";

// Loaded only after opening: the palette reads document during initialization.
const CommandPalette = lazy(async () => {
  const { Cmd: Palette } = await import("@/components/cmd");

  return { default: Palette };
});

export const Cmd = () => {
  const isCmdOpen = useMainStore((state) => state.isCmdOpen);
  const toggleCmd = useMainStore((state) => state.toggleCmd);

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

  return isCmdOpen ? (
    <Suspense fallback={null}>
      <CommandPalette />
    </Suspense>
  ) : null;
};
