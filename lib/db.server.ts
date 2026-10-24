import { env } from "cloudflare:workers";

import { createDatabase } from "@/lib/db/database";

export const db = createDatabase(env.DB);
