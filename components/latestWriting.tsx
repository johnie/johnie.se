import { allPosts, type Post } from 'content-collections';
import Link from 'next/link';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { getViewsCount } from '@/lib/actions';
import ViewCounter from '@/components/ViewCounter';

const TOTAL_ITEMS = 2;

export const LatestWriting = () => {
  if (!allPosts || allPosts.length === 0) {
    return null;
  }

  const items = allPosts
    .sort((a, b) => {
      if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, TOTAL_ITEMS);

  return (
    <div>
      {items.map((post: Post) => (
        <Link
          key={post.slug}
          className="flex gap-x-4 px-4 -mx-4 py-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group transition-colors ease"
          href={`/writing/${post.slug}`}
        >
          <div className="w-full flex flex-col">
            <p className="text-neutral-700 dark:text-neutral-300 tracking-tight text-sm md:text-base">
              {post.title}
            </p>
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-500">
              <p>{format(new Date(post.publishedAt), 'dd MMMM, yyyy')}</p>
              <span className="mx-4 ">•</span>
              <p>{post.readingTime}</p>
              <span className="mx-4 ">•</span>
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

async function Views({ slug }: { slug: string }) {
  const views = await getViewsCount();
  return <ViewCounter slug={slug} allViews={views} />;
}
