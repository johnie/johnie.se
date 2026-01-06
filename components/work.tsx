import { allWorks, type Work } from "content-collections";
import Image from "next/image";
import type { JSX } from "react";
import { cn } from "@/lib/utils";

export const WorkExperience = (): JSX.Element | null => {
  if (!allWorks || allWorks.length === 0) {
    return null;
  }
  const items = allWorks.sort((a, b) => b.startYear - a.startYear);

  return (
    <div>
      {items.map((work: Work, index, { length }) => (
        <a
          className="group ease -mx-4 flex gap-x-4 rounded-xl border-none px-4 pt-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          href={work.url}
          key={work._id}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-100 shadow-shorter dark:bg-neutral-800">
            <div className="flex h-full items-center justify-center font-semibold text-neutral-400 text-sm">
              <Image
                alt={`${work.company} logo`}
                className="h-9 w-9"
                decoding="async"
                height="36"
                loading={index < 2 ? undefined : "lazy"}
                priority={index < 2}
                src={work.image as string}
                width="36"
              />
            </div>
          </div>
          <div
            className={cn(
              "flex flex-auto flex-col pb-4 text-neutral-700 text-sm group-hover:border-transparent dark:text-neutral-300",
              {
                "border-neutral-100 border-b dark:border-neutral-900":
                  index + 1 !== length,
              }
            )}
          >
            <div>{work.company}</div>
            <div className="flex items-center justify-between gap-x-2 text-neutral-500 dark:text-neutral-500">
              <div>{work.role}</div>
              <div className="text-neutral-400 tabular-nums dark:text-neutral-500">
                {work.startYear} – {work?.present ? "Now" : work.endYear}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
