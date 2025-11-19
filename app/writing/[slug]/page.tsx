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

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
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
    : `${SITE_URL}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${SITE_URL}/writing/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: Params }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.lastModified,
    description: post.summary,
    image: post.image
      ? `${SITE_URL}${post.image}`
      : `${SITE_URL}/og?title=${post.title}`,
    url: `${SITE_URL}/writing/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Johnie Hjelm",
    },
  };

  return (
    <section>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - JSON-LD structured data with static content
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
        suppressHydrationWarning
        type="application/ld+json"
      />
      <Link
        className="relative mb-4 inline-block font-semibold text-neutral-600 text-sm transition-colors duration-150 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-400"
        href="/writing"
      >
        <svg
          aria-label="Go back"
          className="-mt-1 mr-1 inline-block h-4 w-4"
          fill="none"
          role="img"
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
      <h1 className="title bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-bold text-3xl text-transparent tracking-tighter dark:from-neutral-100 dark:to-neutral-400">
        {post.title}
      </h1>
      <div className="mt-2 mb-8 flex items-center justify-between text-neutral-600 text-sm">
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
}
