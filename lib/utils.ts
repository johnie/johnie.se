import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Server (Workers, UTC, en-US) and browser must render identical text, otherwise
// hydration fails. Pin locale and time zone instead of using the runtime's.
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

const countFormatter = new Intl.NumberFormat("en-US");

/** Formats an ISO date as `09 April, 2026` in UTC. */
export const formatDate = (iso: string): string => {
  const parts = dateFormatter.formatToParts(new Date(iso));

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? "";

  return `${part("day")} ${part("month")}, ${part("year")}`;
};

export const formatCount = (count: number): string =>
  countFormatter.format(count);
