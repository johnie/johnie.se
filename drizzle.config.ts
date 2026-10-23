import { defineConfig } from "drizzle-kit";

import { getServerEnv } from "@/lib/env.server";

const env = getServerEnv();

export default defineConfig({
  dbCredentials: {
    authToken: env.TURSO_AUTH_TOKEN,
    url: env.TURSO_DATABASE_URL,
  },
  dialect: "turso",
  out: "./lib/db/migrations",
  schema: "./lib/db/schema.ts",
});
