import { sql } from "drizzle-orm";

import type { Database } from "@/lib/db/database";
import { views } from "@/lib/db/schema";
import type { EdgeCache } from "@/lib/edge-cache";
import type { ViewCounts } from "@/lib/types";

const COUNTS_CACHE_KEY = "views-counts";
const COUNTS_TTL_SECONDS = 60;

export interface ViewCountsModule {
  /**
   * Every slug's count. Served from the edge cache, so counts can lag by
   * 60 seconds; increments do not invalidate the cached row-set. Resolves
   * to `{}` when the database is unavailable.
   */
  all: () => Promise<ViewCounts>;
  /** Adds one view to `slug`. Failures are logged, never thrown. */
  increment: (slug: string) => Promise<void>;
}

export const createViewCounts = ({
  cache,
  db,
}: {
  cache: EdgeCache;
  db: Database;
}): ViewCountsModule => ({
  all: async () => {
    try {
      return await cache(COUNTS_CACHE_KEY, COUNTS_TTL_SECONDS, async () => {
        const rows = await db
          .select({ count: views.count, slug: views.slug })
          .from(views);

        const counts: ViewCounts = {};

        for (const row of rows) {
          counts[row.slug] = row.count;
        }

        return counts;
      });
    } catch (error) {
      console.error("Failed to get view counts:", error);

      return {};
    }
  },
  increment: async (slug) => {
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
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  },
});
