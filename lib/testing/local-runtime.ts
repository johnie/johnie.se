import {
  generateSQLiteDrizzleJson,
  generateSQLiteMigration,
} from "drizzle-kit/api";
import { getPlatformProxy } from "wrangler";

import { createDatabase } from "@/lib/db/database";
import type { Database } from "@/lib/db/database";
import { spotify, views } from "@/lib/db/schema";
import type { CacheStore } from "@/lib/edge-cache";

/**
 * An in-memory D1 (Miniflare, via wrangler) with `lib/db/schema.ts` applied.
 * Pass `migrate: false` for a database whose queries fail.
 */
export const createLocalDatabase = async ({ migrate = true } = {}): Promise<{
  db: Database;
  dispose: () => Promise<void>;
}> => {
  const proxy = await getPlatformProxy<{ DB: D1Database }>({ persist: false });

  if (migrate) {
    const statements = await generateSQLiteMigration(
      await generateSQLiteDrizzleJson({}),
      await generateSQLiteDrizzleJson({ spotify, views })
    );

    await proxy.env.DB.batch(
      statements.map((statement) => proxy.env.DB.prepare(statement))
    );
  }

  return { db: createDatabase(proxy.env.DB), dispose: () => proxy.dispose() };
};

const requestKey = (request: RequestInfo | URL): string => {
  if (request instanceof Request) {
    return request.url;
  }

  return request.toString();
};

/** A `CacheStore` that keeps entries in memory and never expires them. */
export const createMemoryCacheStore = (): CacheStore => {
  const entries = new Map<string, Response>();

  const cache: Pick<Cache, "match" | "put"> = {
    match: (request) =>
      Promise.resolve(entries.get(requestKey(request))?.clone()),
    put: (request, response) => {
      entries.set(requestKey(request), response.clone());

      return Promise.resolve();
    },
  };

  return { open: () => Promise.resolve(cache) };
};
