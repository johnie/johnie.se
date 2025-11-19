// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TURSO_DATABASE_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string().min(1),
    OPENPANEL_CLIENT_ID: z.string().min(1),
    SPOTIFY_API_CLIENT_ID: z.string().min(1),
    SPOTIFY_API_CLIENT_SECRET: z.string().min(1),
    SPOTIFY_API_REFRESH_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    OPENPANEL_CLIENT_ID: process.env.OPENPANEL_CLIENT_ID,
    SPOTIFY_API_CLIENT_ID: process.env.SPOTIFY_API_CLIENT_ID,
    SPOTIFY_API_CLIENT_SECRET: process.env.SPOTIFY_API_CLIENT_SECRET,
    SPOTIFY_API_REFRESH_TOKEN: process.env.SPOTIFY_API_REFRESH_TOKEN,
  },
});
