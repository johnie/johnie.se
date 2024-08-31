'use server';

import { QueryResultRow, sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function increment(slug: string) {
  if (process.env.VERCEL_ENV === 'development') {
    return;
  }

  noStore();
  await sql`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
  `;
}

export async function getViewsCount(): Promise<QueryResultRow[] | []> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  noStore();
  const { rows } = await sql`
    SELECT slug, count
    FROM views
  `;

  return rows;
}
