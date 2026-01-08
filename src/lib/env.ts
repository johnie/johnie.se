import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    TURSO_DATABASE_URL: z.url().optional(),
    TURSO_AUTH_TOKEN: z.string().min(1).optional(),
    SPOTIFY_API_CLIENT_ID: z.string().optional(),
    SPOTIFY_API_CLIENT_SECRET: z.string().optional(),
    SPOTIFY_API_REFRESH_TOKEN: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    SPOTIFY_API_CLIENT_ID: process.env.SPOTIFY_API_CLIENT_ID,
    SPOTIFY_API_CLIENT_SECRET: process.env.SPOTIFY_API_CLIENT_SECRET,
    SPOTIFY_API_REFRESH_TOKEN: process.env.SPOTIFY_API_REFRESH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: process.env.NODE_ENV === "development",
});
