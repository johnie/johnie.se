import ViewCounter from "@/components/view-counter";
import { getViewsCount, increment } from "@/lib/actions";

export async function Views({
  slug,
  trackView = false,
}: {
  slug: string;
  trackView?: boolean;
}) {
  const views = await getViewsCount();
  if (trackView) {
    increment(slug);
  }
  return <ViewCounter allViews={views} slug={slug} />;
}
