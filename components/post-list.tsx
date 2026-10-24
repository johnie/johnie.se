import { Link } from "@tanstack/react-router";
import type { Post } from "content-collections";
import { Suspense } from "react";
import type { JSX } from "react";

import { Views } from "@/components/views";
import type { ViewCounts } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const PostList = ({
  posts,
  viewCounts,
}: {
  posts: readonly Post[];
  viewCounts: Promise<ViewCounts>;
}): JSX.Element | null => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      {posts.map((post) => (
        <Link
          className="group -mx-4 flex gap-x-4 rounded-xl border-none px-4 py-4 transition-colors hover:bg-neutral-50 active:bg-neutral-100 active:duration-0 dark:hover:bg-neutral-900 dark:active:bg-neutral-800"
          params={{ slug: post.slug }}
          to="/writing/$slug"
          key={post.slug}
        >
          <div className="flex w-full flex-col">
            <p className="text-sm tracking-tight text-neutral-700 md:text-base dark:text-neutral-300">
              {post.title}
            </p>
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <p>{formatDate(post.publishedAt)}</p>
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
