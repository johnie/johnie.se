import { createEnv } from "@t3-oss/env-core";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

// Same database as the `DB` binding in wrangler.jsonc.
const D1_DATABASE_ID = "49db3441-c286-4ab9-bd7f-bc3b14e1246f";

const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_D1_TOKEN: z.string().min(1),
  },
});

export default defineConfig({
  dbCredentials: {
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: D1_DATABASE_ID,
    token: env.CLOUDFLARE_D1_TOKEN,
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./lib/db/migrations",
  schema: "./lib/db/schema.ts",
});
