"use client";

import dynamic from "next/dynamic";

export const Cmd = dynamic(
  async () => {
    const cmdModule = await import("@/components/cmd");
    return cmdModule.Cmd;
  },
  {
    ssr: false,
  }
);
