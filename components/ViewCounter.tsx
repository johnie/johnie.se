import { type View } from '@/lib/actions';

export default function ViewCounter({
  slug,
  allViews,
}: {
  slug: string;
  allViews: View[];
  trackView?: boolean;
}) {
  const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);
  const number = new Number(viewsForSlug?.count || 0);

  return <p>{`${number.toLocaleString()} views`}</p>;
}
