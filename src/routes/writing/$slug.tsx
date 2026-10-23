import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { format } from "date-fns";
import { Suspense } from "react";

import { Mdx } from "@/components/mdx";
import { Views } from "@/components/views";
import { SITE_URL } from "@/lib/constants";
import { preloadMdx } from "@/lib/mdx-modules";
import { cn } from "@/lib/utils";
import { getViewCounts } from "@/lib/views.functions";

const Post = () => {
  const { post, viewCounts } = Route.useLoaderData();

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: "Johnie Hjelm",
    },
    dateModified: post.lastModified,
    datePublished: post.publishedAt,
    description: post.summary,
    headline: post.title,
    image: post.image
      ? `${SITE_URL}${post.image}`
      : `${SITE_URL}/og?title=${encodeURIComponent(post.title)}`,
    url: `${SITE_URL}/writing/${post.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: SITE_URL,
        name: "Home",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: `${SITE_URL}/writing`,
        name: "Writing",
        position: 2,
      },
      {
        "@type": "ListItem",
        item: `${SITE_URL}/writing/${post.slug}`,
        name: post.title,
        position: 3,
      },
    ],
  };

  const blogPostingSchemaJson = JSON.stringify(blogPostingSchema).replaceAll(
    "<",
    "\\u003c"
  );

  const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema).replaceAll(
    "<",
    "\\u003c"
  );

  return (
    <section>
      <script type="application/ld+json">{blogPostingSchemaJson}</script>
      <script type="application/ld+json">{breadcrumbSchemaJson}</script>
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
        <p>{format(new Date(post.publishedAt), "dd MMMM, yyyy")}</p>
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
    const post = allPosts.find((entry) => entry.slug === params.slug);

    if (!post) {
      throw notFound();
    }

    const viewCounts = getViewCounts();
    await preloadMdx(post.mdxPath);

    return { post, viewCounts };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    const { post } = loaderData;
    const url = `${SITE_URL}/writing/${post.slug}`;

    const ogImage = post.image
      ? `${SITE_URL}${post.image}`
      : `${SITE_URL}/og?title=${encodeURIComponent(post.title)}`;

    return {
      links: [{ rel: "canonical", href: url }],
      meta: [
        { title: `${post.title} | Johnie Hjelm` },
        { name: "description", content: post.summary },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.summary },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:modified_time", content: post.lastModified },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.summary },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
  component: Post,
});
