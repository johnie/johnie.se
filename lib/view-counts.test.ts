import { afterEach, describe, expect, it, vi } from "vitest";

import { createEdgeCache } from "@/lib/edge-cache";
import {
  createLocalDatabase,
  createMemoryCacheStore,
} from "@/lib/testing/local-runtime";
import { createViewCounts } from "@/lib/view-counts";

describe("View counts", () => {
  const disposers: (() => Promise<void>)[] = [];

  const setup = async ({ migrate = true } = {}) => {
    const { db, dispose } = await createLocalDatabase({ migrate });

    disposers.push(dispose);

    // A fresh cache per module instance, so each instance reads D1 once.
    return () =>
      createViewCounts({
        cache: createEdgeCache(createMemoryCacheStore()),
        db,
      });
  };

  afterEach(async () => {
    await Promise.all(disposers.splice(0).map((dispose) => dispose()));
    vi.restoreAllMocks();
  });

  it("counts each increment per slug", async () => {
    const viewCounts = await setup();
    const writer = viewCounts();

    await writer.increment("a");
    await writer.increment("a");
    await writer.increment("b");

    await expect(viewCounts().all()).resolves.toStrictEqual({ a: 2, b: 1 });
  });

  it("serves cached counts until the cache entry expires", async () => {
    const viewCounts = (await setup())();

    await viewCounts.increment("a");
    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 1 });

    await viewCounts.increment("a");
    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 1 });
  });

  it("degrades to no counts when the database fails", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const viewCounts = (await setup({ migrate: false }))();

    await expect(viewCounts.increment("a")).resolves.toBeUndefined();
    await expect(viewCounts.all()).resolves.toStrictEqual({});
  });
});
