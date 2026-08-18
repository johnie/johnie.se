import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { spotify, views } from "@/lib/db/schema";
import { env } from "@/lib/env";

const client = createClient({
  authToken: env.TURSO_AUTH_TOKEN,
  url: env.TURSO_DATABASE_URL,
});

export const db = drizzle({ client, schema: { spotify, views } });
