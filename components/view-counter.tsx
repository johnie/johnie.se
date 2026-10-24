import { useEffect } from "react";

import { formatCount } from "@/lib/utils";
import { incrementView } from "@/lib/views.functions";

const ViewCounter = ({
  slug,
  count,
  trackView = false,
}: {
  slug: string;
  count: number;
  trackView?: boolean;
}) => {
  useEffect(() => {
    if (trackView) {
      incrementView({ data: { slug } }).catch(() => null);
    }
  }, [slug, trackView]);

  return <p>{`${formatCount(count)} views`}</p>;
};

export default ViewCounter;
