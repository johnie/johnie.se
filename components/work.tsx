import { type Work } from 'content-collections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

export const WorkExperience = ({ items }: { items: Work[] }) => {
  if (!items) {
    return null;
  }
  return (
    <div>
      <div className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none card-shine-effect">
        <Skeleton className="w-[36px] h-[36px] rounded-full" />

        <div
          className={cn(
            'flex flex-col text-sm flex-auto pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300 border-b border-neutral-100 dark:border-neutral-900'
          )}
        >
          <div className="space-y-1">
            <Skeleton className="w-12 h-4" />

            <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
              <Skeleton className="w-28 h-4" />
              <div className="text-neutral-400 dark:text-neutral-500 tabular-nums">
                2025 -
              </div>
            </div>
          </div>
        </div>
      </div>

      {items
        .sort((a, b) => b.startYear - a.startYear)
        .map((work: Work, index, { length }) => (
          <a
            key={work._id}
            href={work.url}
            className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group transition-colors ease"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-full mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
              <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                <Image
                  src={work.image as string}
                  alt={`${work.company} logo`}
                  loading="lazy"
                  width="36"
                  height="36"
                  decoding="async"
                  data-nimg="1"
                  className="w-[36px] h-[36px]"
                />
              </div>
            </div>
            <div
              className={cn(
                'flex flex-col text-sm flex-auto pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300',
                {
                  'border-b border-neutral-100 dark:border-neutral-900':
                    index + 1 !== length,
                }
              )}
            >
              <div>{work.company}</div>
              <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                <div>{work.role}</div>
                <div className="text-neutral-400 dark:text-neutral-500 tabular-nums">
                  {work.startYear} – {work?.present ? 'Now' : work.endYear}
                </div>
              </div>
            </div>
          </a>
        ))}
    </div>
  );
};
