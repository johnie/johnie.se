"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { useMainStore } from "@/lib/main-store";

const CommandPalette = dynamic(
  async () => {
    const cmdModule = await import("@/components/cmd");
    return cmdModule.Cmd;
  },
  {
    ssr: false,
  }
);

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

  return isCmdOpen ? <CommandPalette /> : null;
};
