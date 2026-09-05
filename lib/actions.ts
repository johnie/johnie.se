"use server";

import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { z } from "zod";

import { env } from "@/lib/env";

import { views } from "./db/schema";
import { db } from "./turso";

const slugSchema = z.string().min(1).max(100);

export const increment = async (slug: string) => {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) {
    return;
  }

  try {
    await db
      .insert(views)
      .values({ count: 1, slug: parsed.data })
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
};

const getViewsCountUncached = async (slug: string): Promise<number> => {
  if (!env.TURSO_DATABASE_URL) {
    return 0;
  }

  try {
    const result = await db.select().from(views).where(eq(views.slug, slug));
    return result[0]?.count ?? 0;
  } catch (error: unknown) {
    console.error("Failed to get view count:", error);
    return 0;
  }
};

// Counts can lag by 60 seconds. Do not invalidate on every increment:
// doing so would expire cached counts and pages on every article view.
export const getViewsCount = async (slug: string): Promise<number> =>
  await unstable_cache(
    () => getViewsCountUncached(slug),
    [`views-count-${slug}`],
    { revalidate: 60 }
  )();
