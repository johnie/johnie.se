import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { Views } from "@/components/views";
import { createPageHead } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { getViewCounts } from "@/lib/views.functions";
import { writing } from "@/lib/writing";

const BlogPage = () => {
  const { viewCounts } = Route.useLoaderData();
  const { postsByYear } = writing;

  return (
    <section>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-300">
        Thoughts. Tools. Leadership.
      </h1>
      <p className="mb-8 leading-6.25 text-neutral-500 dark:text-neutral-400">
        Here you&lsquo;ll find my thoughts on AI-augmented engineering,
        leadership for makers, productivity systems, and the occasional personal
        reflection. With 15+ years in tech, I write about what actually works,
        and what I&lsquo;m still figuring out.
      </p>
      <div className="space-y-8">
        {postsByYear.map(([year, posts]) => (
          <div key={year}>
            <div className="first:pt-0">
              <span className="text-sm font-medium text-neutral-400">
                {year}
              </span>
            </div>
            {posts.map((post) => (
              <Link
                className="group -mx-4 flex gap-x-4 rounded-xl border-none px-4 py-4 transition-colors hover:bg-neutral-50 active:bg-neutral-100 active:duration-0 dark:hover:bg-neutral-900 dark:active:bg-neutral-800"
                to="/writing/$slug"
                params={{ slug: post.slug }}
                key={post.slug}
              >
                <div className="flex w-full flex-col space-y-1">
                  <p className="leading-snug tracking-tight text-neutral-700 dark:text-neutral-300">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <p>{formatDate(post.publishedAt)}</p>
                    <span>•</span>
                    <p>{post.readingTime}</p>
                    <span>•</span>
                    <Suspense fallback={<p className="h-4" />}>
                      <Views counts={viewCounts} slug={post.slug} />
                    </Suspense>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export const Route = createFileRoute("/writing/")({
  loader: () => ({ viewCounts: getViewCounts() }),
  head: () =>
    createPageHead({
      description:
        "Thoughts on AI-augmented engineering, leadership, and productivity systems.",
      path: "/writing",
      title: "Writing",
    }),
  component: BlogPage,
});
