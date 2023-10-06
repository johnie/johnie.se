import type { Metadata } from 'next';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import Balancer from 'react-wrap-balancer';
import { Mdx } from '@/components/mdx';

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
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(post.structuredData)}
      </script>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-bold tracking-tighter">
        <Balancer>{post.title}</Balancer>
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{format(new Date(post.publishedAt), 'dd MMMM, yyyy')}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{post.readingTime}</p>
      </div>
      <Mdx code={post.body.code} />
    </section>
  );
}
