import { Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import type { Post } from "content-collections";
import { format } from "date-fns";
import { Suspense } from "react";
import type { JSX } from "react";

import { Views } from "@/components/views";
import { sortPostsByDate } from "@/lib/content-utils";
import type { ViewCounts } from "@/lib/types";

const TOTAL_ITEMS = 3;

export const LatestWriting = ({
  viewCounts,
}: {
  viewCounts: Promise<ViewCounts>;
}): JSX.Element | null => {
  if (allPosts.length === 0) {
    return null;
  }

  const items = sortPostsByDate(allPosts).slice(0, TOTAL_ITEMS);

  return (
    <div>
      {items.map((post: Post) => (
        <Link
          className="group ease -mx-4 flex gap-x-4 rounded-xl border-none px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          params={{ slug: post.slug }}
          to="/writing/$slug"
          key={post.slug}
        >
          <div className="flex w-full flex-col">
            <p className="text-sm tracking-tight text-neutral-700 md:text-base dark:text-neutral-300">
              {post.title}
            </p>
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-500">
              <p>{format(new Date(post.publishedAt), "dd MMMM, yyyy")}</p>
              <span className="mx-4">•</span>
              <p>{post.readingTime}</p>
              <span className="mx-4">•</span>
              <Suspense fallback={null}>
                <Views counts={viewCounts} slug={post.slug} />
              </Suspense>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
