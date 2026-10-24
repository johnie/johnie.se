import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import { spotify, views } from "@/lib/db/schema";

export const db = drizzle(env.DB, { schema: { spotify, views } });
