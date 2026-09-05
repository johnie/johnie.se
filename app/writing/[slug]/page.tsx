import { allPosts } from "content-collections";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Mdx } from "@/components/mdx";
import { Views } from "@/components/views";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> => {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post;
  const ogImage = image
    ? `${SITE_URL}${image}`
    : `${SITE_URL}/og?title=${encodeURIComponent(title)}`;

  return {
    alternates: {
      canonical: `${SITE_URL}/writing/${slug}`,
      types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
    },
    description,
    openGraph: {
      description,
      images: [
        {
          url: ogImage,
        },
      ],
      locale: "en_US",
      modifiedTime: post.lastModified,
      publishedTime,
      siteName: "Johnie Hjelm",
      title,
      type: "article",
      url: `${SITE_URL}/writing/${slug}`,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImage],
      title,
    },
  };
};

export const generateStaticParams = () =>
  allPosts.map((post) => ({
    slug: post.slug,
  }));

const Post = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

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
        href="/writing"
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
            <Views slug={post.slug} trackView />
          </Suspense>
        </div>
      </div>
      <article
        className={cn("prose prose-quoteless prose-neutral dark:prose-invert", {
          leadertext: post.leading,
        })}
      >
        <Mdx code={post.mdx} />
      </article>
    </section>
  );
};

export default Post;
