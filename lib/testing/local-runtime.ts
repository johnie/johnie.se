import {
  generateSQLiteDrizzleJson,
  generateSQLiteMigration,
} from "drizzle-kit/api";
import { getTableName } from "drizzle-orm";
import { getPlatformProxy } from "wrangler";

import { createDatabase } from "@/lib/db/database";
import type { Database } from "@/lib/db/database";
import { spotify, views } from "@/lib/db/schema";
import type { CacheStore } from "@/lib/edge-cache";

export interface LocalDatabase {
  db: Database;
  dispose: () => Promise<void>;
  reset: () => Promise<void>;
}

/** In-memory D1 with schema reset for isolated tests in one Worker runtime. */
export const createLocalDatabase = async (): Promise<LocalDatabase> => {
  const proxy = await getPlatformProxy<{ DB: D1Database }>({ persist: false });

  try {
    const statements = await generateSQLiteMigration(
      await generateSQLiteDrizzleJson({}),
      await generateSQLiteDrizzleJson({ spotify, views })
    );

    const resetStatements = [
      ...[spotify, views].map(
        (table) => `DROP TABLE IF EXISTS "${getTableName(table)}"`
      ),
      ...statements,
    ].map((statement) => proxy.env.DB.prepare(statement));

    const reset = async () => {
      await proxy.env.DB.batch(resetStatements);
    };

    await reset();

    return {
      db: createDatabase(proxy.env.DB),
      dispose: () => proxy.dispose(),
      reset,
    };
  } catch (error) {
    await proxy.dispose();
    throw error;
  }
};

const requestKey = (request: RequestInfo | URL): string => {
  if (request instanceof Request) {
    return request.url;
  }

  return request.toString();
};

/** An in-memory `CacheStore`; `now` returns milliseconds for max-age expiry. */
export const createMemoryCacheStore = (
  now: () => number = Date.now
): CacheStore => {
  const entries = new Map<string, { expiresAt: number; response: Response }>();

  const cache: Pick<Cache, "match" | "put"> = {
    match: (request) => {
      const key = requestKey(request);
      const entry = entries.get(key);

      if (!entry) {
        return Promise.resolve(undefined);
      }

      if (now() >= entry.expiresAt) {
        entries.delete(key);

        return Promise.resolve(undefined);
      }

      return Promise.resolve(entry.response.clone());
    },
    put: (request, response) => {
      const maxAge = response.headers
        .get("Cache-Control")
        ?.match(/(?:^|,)\s*max-age=(?<seconds>\d+)\b/iu);

      entries.set(requestKey(request), {
        expiresAt: maxAge
          ? now() + Number(maxAge.groups?.seconds) * 1000
          : Number.POSITIVE_INFINITY,
        response: response.clone(),
      });

      return Promise.resolve();
    },
  };

  return { open: () => Promise.resolve(cache) };
};
