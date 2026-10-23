import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";

import { spotify, views } from "@/lib/db/schema";
import { getServerEnv } from "@/lib/env.server";

const createDb = () => {
  const env = getServerEnv();

  const client = createClient({
    authToken: env.TURSO_AUTH_TOKEN,
    url: env.TURSO_DATABASE_URL,
  });

  return drizzle({ client, schema: { spotify, views } });
};

let db: ReturnType<typeof createDb> | undefined;

export const getDb = () => {
  db ??= createDb();

  return db;
};
