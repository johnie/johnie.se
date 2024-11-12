import { createClient } from '@libsql/client';
import { env } from '@/lib/env';

export const turso = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});
