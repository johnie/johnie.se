import ViewCounter from "@/components/view-counter";
import { getViewsCount } from "@/lib/actions";

export async function Views({
  slug,
  trackView = false,
}: {
  slug: string;
  trackView?: boolean;
}) {
  const count = await getViewsCount(slug);
  return <ViewCounter count={count} slug={slug} trackView={trackView} />;
}
