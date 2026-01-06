"use server";

import { sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { env } from "@/lib/env";
import { views } from "./db/schema";
import { db } from "./turso";

export async function increment(slug: string) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  try {
    await db
      .insert(views)
      .values({ slug, count: 1 })
      .onConflictDoUpdate({
        target: views.slug,
        set: {
          count: sql`${views.count} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
      });
  } catch (error) {
    // Log error but don't throw - view counting shouldn't break the page
    console.error("Failed to increment view count:", error);
  }
}

export interface View {
  slug: string;
  count: number;
  updatedAt: string;
}

async function getViewsCountUncached(): Promise<View[]> {
  if (!env.TURSO_DATABASE_URL) {
    return [];
  }

  const result = await db.select().from(views);

  return result.map((row) => ({
    slug: row.slug,
    count: row.count,
    updatedAt: row.updatedAt,
  }));
}

// Cache view counts for 60 seconds to reduce database queries
export const getViewsCount = unstable_cache(
  getViewsCountUncached,
  ["views-count"],
  { revalidate: 60, tags: ["views"] }
);
