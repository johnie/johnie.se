import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { spotify, views } from "@/lib/db/schema";
import { env } from "@/lib/env";

const client = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle({ client, schema: { views, spotify } });
export const turso = client;
