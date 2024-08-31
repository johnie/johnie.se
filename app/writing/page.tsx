import type { Metadata } from 'next';
import Link from 'next/link';
import { allPosts } from 'content-collections';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { getViewsCount } from '@/lib/actions';
import ViewCounter from '@/components/ViewCounter';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Read my thoughts on software development, leadership, tech career, and more.',
};

export default async function BlogPage() {
  return (
    <section>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        Stories. Updates. Guides.
      </h1>
      <p className="leading-[25px] mb-8 text-neutral-500 dark:text-neutral-400">
        Here you&lsquo;ll find all the <span className="text-neutral-900 dark:text-neutral-200">{allPosts.length}</span>{' '}
        articles on my thoughts on software development, leadership, tech career, and more. I&lsquo;ll also share
        updates on my projects and other things I&lsquo;m working on.
      </p>
      <div>
        {allPosts
          .sort((a, b) => {
            if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              key={post.slug}
              className="flex gap-x-4 px-4 -mx-4 py-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group transition-colors ease"
              href={`/writing/${post.slug}`}
            >
              <div className="w-full flex flex-col space-y-1">
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">{post.title}</p>
                <div className="flex items-center">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {format(new Date(post.publishedAt), 'dd MMMM, yyyy')}
                  </p>
                  <span className="mx-4 text-sm text-neutral-600 dark:text-neutral-400">•</span>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{post.readingTime}</p>
                  <span className="mx-4 text-sm text-neutral-600 dark:text-neutral-400">•</span>
                  <Suspense fallback={<p className="h-4" />}>
                    <Views slug={post.slug} />
                  </Suspense>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();
  return <ViewCounter slug={slug} allViews={views} />;
}
