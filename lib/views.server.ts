import { db } from "@/lib/db.server";
import { createEdgeCache } from "@/lib/edge-cache";
import { createViewCounts } from "@/lib/view-counts";

export const viewCounts = createViewCounts({
  cache: createEdgeCache(caches),
  db,
});
