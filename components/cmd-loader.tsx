"use client";

import dynamic from "next/dynamic";

export const CMD = dynamic(
  () => import("@/components/cmd").then((mod) => mod.CMD),
  {
    ssr: false,
  }
);
