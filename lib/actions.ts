'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { turso } from './turso';
import { env } from '@/lib/env';

export async function increment(slug: string) {
  if (env.VERCEL_ENV === 'development') {
    return;
  }

  noStore();
  await turso.execute(
    `INSERT INTO views (slug, count) VALUES ('${slug}', 1)  ON CONFLICT(slug) DO UPDATE SET count = views.count + 1, updated_at = CURRENT_TIMESTAMP;`
  );
}

export type View = {
  slug: string;
  count: number;
  updated_at: string;
};

export async function getViewsCount(): Promise<View[]> {
  if (!env.DATABASE_URL) {
    return [];
  }

  noStore();
  const { rows } = await turso.execute(
    `SELECT slug, count, updated_at FROM views`
  );

  return rows as unknown as View[];
}
