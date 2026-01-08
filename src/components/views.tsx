import { useEffect, useState } from "react";
import { getViewsCount, increment, type View } from "@/lib/server-functions";

export function Views({
  slug,
  trackView = false,
}: {
  slug: string;
  trackView?: boolean;
}) {
  const [views, setViews] = useState<View[]>([]);

  useEffect(() => {
    // Fetch views on mount
    getViewsCount().then(setViews);

    // Track view if needed
    if (trackView) {
      increment({ data: slug });
    }
  }, [slug, trackView]);

  const viewsForSlug = views.find((view) => view.slug === slug);
  const number = Number(viewsForSlug?.count || 0);

  return <p>{`${number.toLocaleString()} views`}</p>;
}
