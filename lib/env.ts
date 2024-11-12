// src/env.mjs
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    VERCEL_ENV: z.enum(['development', 'production']).default('development'),
    OPENPANEL_CLIENT_ID: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.TURSO_DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    VERCEL_ENV: process.env.VERCEL_ENV,
    OPENPANEL_CLIENT_ID: process.env.OPENPANEL_CLIENT_ID,
  },
});
