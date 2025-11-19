"use server";

import { sql } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { env } from "@/lib/env";
import { views } from "./db/schema";
import { db } from "./turso";

export async function increment(slug: string) {
  if (process.env.VERCEL_ENV === "development") {
    return;
  }

  noStore();
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
}

export type View = {
  slug: string;
  count: number;
  updatedAt: string;
};

export async function getViewsCount(): Promise<View[]> {
  if (!env.TURSO_DATABASE_URL) {
    return [];
  }

  noStore();
  const result = await db.select().from(views);

  return result.map((row) => ({
    slug: row.slug,
    count: row.count,
    updatedAt: row.updatedAt,
  }));
}
