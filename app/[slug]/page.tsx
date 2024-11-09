import { allPages } from 'content-collections';
import { Mdx } from '@/components/mdx';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const page = allPages.find((page) => page._meta.path === slug);

  if (!page) {
    notFound();
  }

  return (
    <article>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        {page?.title}
      </h1>

      <div className="prose prose-quoteless prose-neutral dark:prose-invert prose-h3:mt-4">
        <Mdx code={page?.mdx as string} />
      </div>
    </article>
  );
}
