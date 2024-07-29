import { type Post } from 'content-collections';
import Link from 'next/link';
import { format } from 'date-fns';

export const LatestWriting = ({ items, amount }: { items: Post[]; amount: number }) => {
  if (!items) {
    return null;
  }
  return (
    <div>
      {items
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
            return -1;
          }
          return 1;
        })
        .slice(0, amount)
        .map((post) => (
          <Link
            key={post.slug}
            className="flex gap-x-4 px-4 -mx-4 py-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group transition-colors ease"
            href={`/writing/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="text-neutral-700 dark:text-neutral-300 tracking-tight text-sm md:text-base">{post.title}</p>
              <div className="flex items-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  {format(new Date(post.publishedAt), 'dd MMMM, yyyy')}
                </p>
                <span className="mx-4 text-sm text-neutral-500 dark:text-neutral-500">•</span>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">{post.readingTime}</p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};
