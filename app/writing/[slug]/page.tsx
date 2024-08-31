import { Suspense, cache } from 'react';
import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { increment, getViewsCount } from '@/lib/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { allPosts } from 'content-collections';
import { Mdx } from '@/components/mdx';
import ViewCounter from '@/components/ViewCounter';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: any): Promise<Metadata | undefined> {
  const post = allPosts.find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const { title, publishedAt: publishedTime, summary: description, image, slug } = post;
  const ogImage = image ? `https://johnie.se${image}` : `https://johnie.se/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://johnie.se/writing/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Post({ params }: any) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.publishedAt,
            dateModified: post.lastModified,
            description: post.summary,
            image: post.image ? `https://johnie.se${post.image}` : `https://johnie.se/og?title=${post.title}`,
            url: `https://johnie.se/writing/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Johnie Hjelm',
            },
          }),
        }}
      />
      <Link
        href="/writing"
        className="text-neutral-600 dark:text-neutral-500 font-semibold text-sm mb-4 relative inline-block hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline-block mr-1 -mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Go back</span>
      </Link>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-bold tracking-tighter title">
        {post.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-400">
        <p>{format(new Date(post.publishedAt), 'dd MMMM, yyyy')}</p>
        <div className="flex gap-2">
          <p>{post.readingTime}</p>
          <span>•</span>
          <Suspense fallback={<p className="h-5" />}>
            <Views slug={post.slug} />
          </Suspense>
        </div>
      </div>
      <article
        className={cn('prose prose-quoteless prose-neutral dark:prose-invert', {
          leadertext: post.leading,
        })}
      >
        <Mdx code={post.mdx} />
      </article>
    </section>
  );
}

let incrementViews = cache(increment);

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();
  incrementViews(slug);
  return <ViewCounter allViews={views} slug={slug} />;
}
