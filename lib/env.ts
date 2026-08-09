// lib/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  runtimeEnv: {
    EDGE_CONFIG: process.env.EDGE_CONFIG,
    SPOTIFY_API_CLIENT_ID: process.env.SPOTIFY_API_CLIENT_ID,
    SPOTIFY_API_CLIENT_SECRET: process.env.SPOTIFY_API_CLIENT_SECRET,
    SPOTIFY_API_REFRESH_TOKEN: process.env.SPOTIFY_API_REFRESH_TOKEN,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  },
  server: {
    EDGE_CONFIG: z.string().optional(),
    SPOTIFY_API_CLIENT_ID: z.string().min(1),
    SPOTIFY_API_CLIENT_SECRET: z.string().min(1),
    SPOTIFY_API_REFRESH_TOKEN: z.string().min(1),
    TURSO_AUTH_TOKEN: z.string().min(1),
    TURSO_DATABASE_URL: z.string().url(),
  },
});
