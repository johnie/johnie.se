import { allProjects, type Project } from "content-collections";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Projects = () => {
  if (!allProjects || allProjects.length === 0) {
    return null;
  }

  const items = allProjects
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((project) => Boolean(project.active));

  return (
    <div>
      {items.map((project: Project, index, { length }) => (
        <a
          className="-mx-4 group ease flex gap-x-4 rounded-[12px] border-none px-4 pt-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          href={project.url}
          key={project._id}
        >
          <div className="mt-[2px] h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[10px] border border-neutral bg-neutral-100 shadow-shorter dark:bg-neutral-800">
            <div className="flex h-full items-center justify-center font-semibold text-neutral-400 text-sm">
              <Image
                alt={`${project.name} logo`}
                className="h-[36px] w-[36px]"
                decoding="async"
                height="36"
                loading="lazy"
                src={project.image as string}
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
            <div>{project.name}</div>
            <div className="flex items-center justify-between gap-x-2 text-neutral-500 dark:text-neutral-500">
              <div>{project.description}</div>
              <div className="rounded-full border border-black border-opacity-5 bg-neutral-100 px-2 text-xs dark:bg-neutral-800 dark:text-neutral-500">
                {project.projectType}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
