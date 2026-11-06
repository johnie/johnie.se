import { createEnv } from "@t3-oss/env-core";
import { defineConfig } from "drizzle-kit";
import { unstable_readConfig } from "wrangler";
import type { Unstable_Config } from "wrangler";
import { z } from "zod";

const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_D1_TOKEN: z.string().min(1),
  },
});

const workerConfig: Pick<Unstable_Config, "d1_databases"> = unstable_readConfig(
  {
    config: "./wrangler.jsonc",
  }
);

const databaseId = workerConfig.d1_databases.find(
  (database) => database.binding === "DB"
)?.database_id;

if (!databaseId) {
  throw new Error("The DB binding in wrangler.jsonc must have a database_id");
}

export default defineConfig({
  dbCredentials: {
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    databaseId,
    token: env.CLOUDFLARE_D1_TOKEN,
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./lib/db/migrations",
  schema: "./lib/db/schema.ts",
});
