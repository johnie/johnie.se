import { allProjects } from "content-collections";
import Image from "next/image";
import type { JSX } from "react";

import { hasImage, hasUrl } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Projects = (): JSX.Element | null => {
  if (allProjects.length === 0) {
    return null;
  }

  const items = allProjects
    .filter((project) => Boolean(project.active))
    .filter(hasImage)
    .filter(hasUrl)
    .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div>
      {items.map((project, index, { length }) => (
        <a
          className="group ease -mx-4 flex gap-x-4 rounded-xl border-none px-4 pt-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          aria-label={`${project.name}: ${project.description}`}
          href={project.url}
          key={project._id}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="shadow-shorter mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-[10px] border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
            <div className="flex h-full items-center justify-center text-sm font-semibold text-neutral-400">
              <Image
                alt={`${project.name} logo`}
                className="h-9 w-9"
                decoding="async"
                height={36}
                loading={index < 2 ? undefined : "lazy"}
                priority={index < 2}
                src={project.image}
                style={{ height: "auto", width: "auto" }}
                width={36}
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
            <div>{project.name}</div>
            <div className="flex items-center justify-between gap-x-2 text-neutral-500 dark:text-neutral-500">
              <div>{project.description}</div>
              <div className="border-opacity-5 rounded-full border border-black bg-neutral-100 px-2 text-xs dark:bg-neutral-800 dark:text-neutral-500">
                {project.projectType}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
