import { Await } from "@tanstack/react-router";

import ViewCounter from "@/components/view-counter";
import type { ViewCounts } from "@/lib/types";

export const Views = ({
  counts,
  slug,
  trackView = false,
}: {
  counts: Promise<ViewCounts>;
  slug: string;
  trackView?: boolean;
}) => (
  <Await promise={counts}>
    {(resolved) => (
      <ViewCounter
        count={resolved[slug] ?? 0}
        slug={slug}
        trackView={trackView}
      />
    )}
  </Await>
);
