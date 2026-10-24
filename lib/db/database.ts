import { drizzle } from "drizzle-orm/d1";

import { spotify, views } from "@/lib/db/schema";

export const createDatabase = (binding: D1Database) =>
  drizzle(binding, { schema: { spotify, views } });

export type Database = ReturnType<typeof createDatabase>;
