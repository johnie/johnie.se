"use server";

import { sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { env } from "@/lib/env";
import type { View } from "@/lib/types";
import { views } from "./db/schema";
import { db } from "./turso";

export async function increment(slug: string) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  try {
    await db
      .insert(views)
      .values({ count: 1, slug })
      .onConflictDoUpdate({
        set: {
          count: sql`${views.count} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
        target: views.slug,
      });
  } catch (error: unknown) {
    // Log error but don't throw - view counting shouldn't break the page
    console.error("Failed to increment view count:", error);
  }
}

async function getViewsCountUncached(): Promise<View[]> {
  if (!env.TURSO_DATABASE_URL) {
    return [];
  }

  const result = await db.select().from(views);

  return result.map((row) => ({
    count: row.count,
    slug: row.slug,
    updatedAt: row.updatedAt,
  }));
}

// Cache view counts for 60 seconds to reduce database queries
export const getViewsCount = unstable_cache(
  getViewsCountUncached,
  ["views-count"],
  { revalidate: 60, tags: ["views"] }
);
