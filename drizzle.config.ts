import { defineConfig } from "drizzle-kit";
import { env } from "@/lib/env";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
