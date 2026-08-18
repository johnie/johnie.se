"use client";

import { useEffect } from "react";

import { increment } from "@/lib/actions";

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
      increment(slug);
    }
  }, [slug, trackView]);

  return <p>{`${count.toLocaleString()} views`}</p>;
};

export default ViewCounter;
