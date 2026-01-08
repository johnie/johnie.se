import { createServerFn } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { views } from "./db/schema";
import { env } from "./env";
import { db } from "./turso";

// Server function to increment view count
export const increment = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const slug = data.slug;
    // Skip in development
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
      console.error("Failed to increment view count:", error);
    }
  });

export interface View {
  slug: string;
  count: number;
  updatedAt: string;
}

// Server function to get all view counts
export const getViewsCount = createServerFn({ method: "GET" }).handler(
  async () => {
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
);

// Server function to get current Spotify song
export const getSpotifySong = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getCurrentOrLastSong } = await import("./spotify");
    return getCurrentOrLastSong();
  }
);
