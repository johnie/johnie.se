import { useEffect } from "react";

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

  return <p>{`${count.toLocaleString()} views`}</p>;
};

export default ViewCounter;
