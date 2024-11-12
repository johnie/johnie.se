'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { z } from 'zod';
import { turso } from './turso';
import { env } from '@/lib/env';

export async function increment(slug: string) {
  if (process.env.VERCEL_ENV === 'development') {
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
  if (!env.TURSO_DATABASE_URL) {
    return [];
  }

  noStore();
  const { rows } = await turso.execute(
    `SELECT slug, count, updated_at FROM views`
  );

  return rows as unknown as View[];
}

const visitorSchema = z.object({
  city: z.string().optional(),
  country_name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type Visitor = z.infer<typeof visitorSchema>;

export async function setVisitor() {
  if (!env.TURSO_DATABASE_URL) {
    return;
  }
  noStore();
  const ipData = await fetch('https://ipapi.co/json');
  const data = await ipData.json();

  const visitor = visitorSchema.parse(data);

  await turso.execute(
    `INSERT INTO visits (city, country_name, latitude, longitude) VALUES ('${visitor.city}', '${visitor.country_name}', ${visitor.latitude}, ${visitor.longitude})`
  );
}

export async function getLastVisitor(): Promise<Visitor> {
  if (!env.TURSO_DATABASE_URL) {
    return {
      country_name: 'somewhere on earth',
    };
  }
  noStore();
  const { rows } = await turso.execute(
    `SELECT * FROM visits ORDER BY id DESC LIMIT 1`
  );

  return rows[0] as unknown as Visitor;
}
