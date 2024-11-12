import { type Project, allProjects } from 'content-collections';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
          key={project._id}
          className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group transition-colors ease"
          href={project.url}
        >
          <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-[10px] mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden border border-neutral">
            <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full ">
              <Image
                src={project.image as string}
                alt={`${project.name} logo`}
                loading="lazy"
                width="36"
                height="36"
                decoding="async"
                className="w-[36px] h-[36px] "
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
            <div>{project.name}</div>
            <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
              <div>{project.description}</div>
              <div className="bg-neutral-100 border border-black border-opacity-5 px-2 text-xs rounded-full dark:bg-neutral-800 dark:text-neutral-500">
                {project.projectType}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
