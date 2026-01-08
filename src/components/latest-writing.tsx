import { Link } from "@tanstack/react-router";
import { allPosts, type Post } from "content-collections";
import { format } from "date-fns";
import { type JSX, Suspense } from "react";
import { Views } from "@/components/views";
import { sortPostsByDate } from "@/lib/content-utils";

const TOTAL_ITEMS = 2;

export const LatestWriting = (): JSX.Element | null => {
  if (!allPosts || allPosts.length === 0) {
    return null;
  }

  const items = sortPostsByDate(allPosts).slice(0, TOTAL_ITEMS);

  return (
    <div>
      {items.map((post: Post) => (
        <Link
          className="group ease -mx-4 flex gap-x-4 rounded-xl border-none px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          key={post.slug}
          to={`/writing/${post.slug}`}
        >
          <div className="flex w-full flex-col">
            <p className="text-neutral-700 text-sm tracking-tight md:text-base dark:text-neutral-300">
              {post.title}
            </p>
            <div className="flex items-center text-neutral-500 text-sm dark:text-neutral-500">
              <p>{format(new Date(post.publishedAt), "dd MMMM, yyyy")}</p>
              <span className="mx-4">•</span>
              <p>{post.readingTime}</p>
              <span className="mx-4">•</span>
              <Suspense fallback={null}>
                <Views slug={post.slug} />
              </Suspense>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
