import { sql } from "drizzle-orm";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { createEdgeCache } from "@/lib/edge-cache";
import {
  createLocalDatabase,
  createMemoryCacheStore,
} from "@/lib/testing/local-runtime";
import type { LocalDatabase } from "@/lib/testing/local-runtime";
import { createViewCounts } from "@/lib/view-counts";

describe("View counts", () => {
  let database: LocalDatabase;

  beforeAll(async () => {
    database = await createLocalDatabase();

    return () => database.dispose();
  });

  beforeEach(async () => {
    await database.reset();
  });

  const setup = (now?: () => number) => {
    const { db } = database;

    return {
      db,
      viewCounts: createViewCounts({
        cache: createEdgeCache(createMemoryCacheStore(now)),
        db,
      }),
    };
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("atomically counts concurrent increments per slug", async () => {
    const { viewCounts } = setup();

    await Promise.all([
      viewCounts.increment("a"),
      viewCounts.increment("a"),
      viewCounts.increment("b"),
    ]);

    await expect(viewCounts.all()).resolves.toStrictEqual({ a: 2, b: 1 });
  });

  it("serves cached counts until the cache entry expires", async () => {
    let now = 0;
    const { viewCounts } = setup(() => now);

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
    const { db, viewCounts } = setup();

    await db.run(sql`DROP TABLE "VIEWS"`);

    await viewCounts.increment("a");
    await expect(viewCounts.all()).resolves.toStrictEqual({});
  });
});
