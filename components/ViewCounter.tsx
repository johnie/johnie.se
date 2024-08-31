import { QueryResultRow } from '@vercel/postgres';

export default function ViewCounter({
  slug,
  allViews,
}: {
  slug: string;
  allViews: QueryResultRow[] | [];
  trackView?: boolean;
}) {
  const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);
  const number = new Number(viewsForSlug?.count || 0);

  return <p className="text-sm text-neutral-600 dark:text-neutral-400">{`${number.toLocaleString()} views`}</p>;
}
