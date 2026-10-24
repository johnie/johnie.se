import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Suspense } from "react";

import { Mdx } from "@/components/mdx";
import { Views } from "@/components/views";
import { preloadMdx } from "@/lib/mdx-modules";
import { cn, formatDate } from "@/lib/utils";
import { getViewCounts } from "@/lib/views.functions";
import { postHead, postJsonLd, writing } from "@/lib/writing";

const Post = () => {
  const { post, viewCounts } = Route.useLoaderData();
  const jsonLd = postJsonLd(post);

  return (
    <section>
      <script type="application/ld+json">{jsonLd.blogPosting}</script>
      <script type="application/ld+json">{jsonLd.breadcrumbs}</script>
      <Link
        className="relative mb-4 inline-block text-sm font-semibold text-neutral-600 transition-colors duration-150 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-400"
        to="/writing"
      >
        <svg
          aria-hidden="true"
          className="-mt-1 mr-1 inline-block h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19l-7-7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <span>Go back</span>
      </Link>
      <h1 className="title bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-bold tracking-tighter text-transparent dark:from-neutral-100 dark:to-neutral-400">
        {post.title}
      </h1>
      <div className="mt-2 mb-8 flex items-center justify-between text-sm text-neutral-600">
        <p>{formatDate(post.publishedAt)}</p>
        <div className="flex gap-2">
          <p>{post.readingTime}</p>
          <span>•</span>
          <Suspense fallback={<p className="h-5" />}>
            <Views counts={viewCounts} slug={post.slug} trackView />
          </Suspense>
        </div>
      </div>
      <article
        className={cn("prose prose-quoteless prose-neutral dark:prose-invert", {
          leadertext: post.leading,
        })}
      >
        <Mdx path={post.mdxPath} />
      </article>
    </section>
  );
};

export const Route = createFileRoute("/writing/$slug")({
  loader: async ({ params }) => {
    const post = writing.find(params.slug);

    if (!post) {
      throw notFound();
    }

    const viewCounts = getViewCounts();
    await preloadMdx(post.mdxPath);

    return { post, viewCounts };
  },
  head: ({ loaderData }) => (loaderData ? postHead(loaderData.post) : {}),
  component: Post,
});
