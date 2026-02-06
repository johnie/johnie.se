import type { View } from "@/lib/types";

export default function ViewCounter({
  slug,
  allViews,
}: {
  slug: string;
  allViews: View[];
}) {
  const viewsForSlug = allViews?.find((view) => view.slug === slug);
  const number = Number(viewsForSlug?.count || 0);

  return <p>{`${number.toLocaleString()} views`}</p>;
}
