import { sql } from "drizzle-orm";

import { withEdgeCache } from "@/lib/cache.server";
import { db } from "@/lib/db.server";
import { views } from "@/lib/db/schema";
import type { ViewCounts } from "@/lib/types";

export const incrementViewCount = async (slug: string): Promise<void> => {
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
    console.error("Failed to increment view count:", error);
  }
};

// Counts can lag by 60 seconds; increments do not invalidate the cached row-set.
export const getAllViewCounts = async (): Promise<ViewCounts> => {
  try {
    return await withEdgeCache("views-counts", 60, async () => {
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
};
