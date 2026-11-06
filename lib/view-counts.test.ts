import { sql } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createEdgeCache } from "@/lib/edge-cache";
import {
  createLocalDatabase,
  createMemoryCacheStore,
} from "@/lib/testing/local-runtime";
import { createViewCounts } from "@/lib/view-counts";

describe("View counts", () => {
  const disposers: (() => Promise<void>)[] = [];

  const setup = async (now?: () => number) => {
    const { db, dispose } = await createLocalDatabase();

    disposers.push(dispose);

    return {
      db,
      viewCounts: createViewCounts({
        cache: createEdgeCache(createMemoryCacheStore(now)),
        db,
      }),
    };
  };

  afterEach(async () => {
    await Promise.all(disposers.splice(0).map((dispose) => dispose()));
    vi.restoreAllMocks();
  });

  it("atomically counts concurrent increments per slug", async () => {
    const { viewCounts } = await setup();

    await Promise.all([
      viewCounts.increment("a"),
      viewCounts.increment("a"),
      viewCounts.increment("b"),
    ]);

    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 2, b: 1 });
  });

  it("serves cached counts until the cache entry expires", async () => {
    let now = 0;
    const { viewCounts } = await setup(() => now);

    await viewCounts.increment("a");
    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 1 });

    await viewCounts.increment("a");
    now = 59_999;
    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 1 });

    now = 60_000;
    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 2 });
  });

  it("degrades to no counts when the database fails", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const { db, viewCounts } = await setup();

    await db.run(sql`DROP TABLE "VIEWS"`);

    await viewCounts.increment("a");
    await expect(viewCounts.all()).resolves.toStrictEqual({});
  });
});
