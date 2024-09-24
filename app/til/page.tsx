import { allTodayILearneds } from '@/.content-collections/generated';
import { Mdx } from '@/components/mdx';
import { format } from 'date-fns';

export default function TodayILearned() {
  return (
    <section className="flex gap-6">
      <div className="w-1 bg-neutral-800 rounded-full" />
      <section>
        <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
          Today I Learned
        </h1>

        {allTodayILearneds.map((til) => (
          <div key={til.slug}>
            <time className="text-neutral-200 dark:text-neutral-400 -ml-[42px] relative z-10 flex items-center font-mono text-sm font-bold">
              <span className="size-8 flex justify-center items-center bg-neutral-950 rounded-full mr-2">
                <span className="size-4 border-4 border-neutral-200 rounded-full" />
              </span>
              {format(new Date(til.publishedAt), 'dd MMMM, yyyy')}
            </time>
            <div className="prose prose-quoteless prose-neutral dark:prose-invert">
              <Mdx code={til.mdx} />
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
