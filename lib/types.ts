import type { ReactNode } from "react";

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type WithImage<T extends { image?: string }> = RequiredField<T, "image">;

export const hasImage = <T extends { image?: string }>(
  item: T
): item is WithImage<T> =>
  typeof item.image === "string" && item.image.length > 0;

export const hasUrl = <T extends { url?: string }>(
  item: T
): item is RequiredField<T, "url"> =>
  typeof item.url === "string" && item.url.length > 0;

export interface CalloutProps {
  children: ReactNode;
  emoji: string;
}

export interface View {
  count: number;
  slug: string;
  updatedAt: string;
}

export type ViewCounts = Record<string, number>;

export type {
  Page,
  Post,
  Project,
  TodayIlearned,
  Work,
} from "content-collections";
