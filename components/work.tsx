import { allWorks } from "content-collections";
import type { JSX } from "react";

import { hasImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export const WorkExperience = (): JSX.Element | null => {
  if (allWorks.length === 0) {
    return null;
  }

  const items = allWorks
    .filter(hasImage)
    .toSorted((a, b) => b.startYear - a.startYear);

  return (
    <div>
      {items.map((work, index, { length }) => {
        const content = (
          <>
            <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div className="flex h-full items-center justify-center text-sm font-semibold text-neutral-400">
                <img
                  alt={`${work.company} logo`}
                  className="h-9 w-9"
                  decoding="async"
                  height="36"
                  loading="lazy"
                  src={work.image}
                  width="36"
                />
              </div>
            </div>
            <div
              className={cn(
                "flex flex-auto flex-col pb-4 text-sm text-neutral-700 group-hover:border-transparent dark:text-neutral-300",
                {
                  "border-b border-neutral-100 dark:border-neutral-900":
                    index + 1 !== length,
                }
              )}
            >
              <div>{work.company}</div>
              <div className="flex items-center justify-between gap-x-2 text-neutral-500 dark:text-neutral-400">
                <div>{work.role}</div>
                <div className="text-neutral-400 tabular-nums">
                  {work.startYear} – {work?.present ? "Now" : work.endYear}
                </div>
              </div>
            </div>
          </>
        );

        const className = cn(
          "group -mx-4 flex gap-x-4 rounded-xl border-none px-4 pt-4 transition-colors hover:bg-neutral-50 active:bg-neutral-100 active:duration-0 dark:hover:bg-neutral-900 dark:active:bg-neutral-800",
          {
            "cursor-default": !work.url,
          }
        );

        if (!work.url) {
          return (
            <div aria-disabled="true" className={className} key={work._id}>
              {content}
            </div>
          );
        }

        return (
          <a
            aria-label={`${work.company}: ${work.role}`}
            className={className}
            href={work.url}
            key={work._id}
            rel="noopener noreferrer"
            target="_blank"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
};
