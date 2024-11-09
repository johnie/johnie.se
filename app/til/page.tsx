import { allTodayILearneds } from '@/.content-collections/generated';
import { Mdx } from '@/components/mdx';
import { format } from 'date-fns';

export default function TodayILearned() {
  const tilsDescending = allTodayILearneds.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return (
    <section>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        Today I Learned
      </h1>

      {tilsDescending.map((til) => (
        <div key={til.slug} className="mb-8">
          <time className="text-neutral-600 dark:text-neutral-400 -ml-[42px] relative z-10 flex items-center font-mono text-sm font-bold">
            <span className="size-8 flex justify-center items-center mr-2">
              <span className="size-3 border-2 dark:border-neutral-200 border-neutral-800 rounded-full" />
            </span>
            {format(new Date(til.publishedAt), 'dd MMMM, yyyy')}
          </time>
          <div className="prose prose-quoteless prose-neutral dark:prose-invert prose-h3:mt-4">
            <Mdx code={til.mdx} />
          </div>
        </div>
      ))}
    </section>
  );
}
