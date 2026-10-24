import { Collapsible } from "@base-ui/react/collapsible";
import { ArrowUpRightIcon, CaretDownIcon } from "@phosphor-icons/react";
import { allUsesSections } from "content-collections";
import type { UsesSection } from "content-collections";
import { useState } from "react";
import type { JSX } from "react";

/** Items a collapsed section shows before its "Show more" toggle. */
const PREVIEW_COUNT = 3;

const sections = allUsesSections.toSorted((a, b) => a.order - b.order);

const UsesItem = ({ item }: { item: UsesSection["items"][number] }) => (
  <a
    className="group -mx-4 flex items-center gap-x-4 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-50 active:bg-neutral-100 active:duration-0 dark:hover:bg-neutral-900 dark:active:bg-neutral-800"
    href={item.url}
    rel="noopener noreferrer"
    target="_blank"
  >
    <div className="flex min-w-0 flex-auto flex-col gap-y-0.5">
      <p className="text-sm text-neutral-700 dark:text-neutral-300">
        {item.name}
      </p>
      <p className="text-[13px] leading-5 text-pretty text-neutral-500 dark:text-neutral-400">
        {item.description}
      </p>
    </div>
    <span
      aria-hidden="true"
      className="hidden size-7 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-neutral-200/60 text-neutral-600 opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:flex dark:bg-neutral-800 dark:text-neutral-300"
    >
      <ArrowUpRightIcon size={14} weight="bold" />
    </span>
  </a>
);

const UsesItemList = ({ items }: { items: UsesSection["items"] }) => (
  <ul>
    {items.map((item) => (
      <li key={item.name}>
        <UsesItem item={item} />
      </li>
    ))}
  </ul>
);

const UsesSectionList = ({ section }: { section: UsesSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Hiding a single item behind a toggle costs more than it saves.
  const isCollapsible =
    !section.expanded && section.items.length > PREVIEW_COUNT + 1;

  return (
    <section
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-8"
      id={section.id}
    >
      <h2
        className="mt-10 mb-2 font-medium text-neutral-700 dark:text-neutral-200"
        id={`${section.id}-heading`}
      >
        <a className="hover:underline" href={`#${section.id}`}>
          {section.title}
        </a>
      </h2>
      {section.description ? (
        <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          {section.description}
        </p>
      ) : null}
      {isCollapsible ? (
        <Collapsible.Root onOpenChange={setIsOpen} open={isOpen}>
          <UsesItemList items={section.items.slice(0, PREVIEW_COUNT)} />
          {/* hiddenUntilFound lets find-in-page reach and open collapsed items.
              -mx-4 px-4 keeps the rows' -mx-4 hover background inside overflow-hidden. */}
          <Collapsible.Panel
            className="-mx-4 h-(--collapsible-panel-height) overflow-hidden px-4 transition-[height,opacity] duration-300 ease-out data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none [&[hidden]:not([hidden='until-found'])]:hidden"
            hiddenUntilFound
          >
            <UsesItemList items={section.items.slice(PREVIEW_COUNT)} />
          </Collapsible.Panel>
          <Collapsible.Trigger className="group -mx-4 mt-1 flex cursor-pointer items-center gap-x-1.5 rounded-xl px-4 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-700 active:bg-neutral-100 active:duration-0 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200 dark:active:bg-neutral-800">
            {isOpen
              ? "Show less"
              : `Show ${section.items.length - PREVIEW_COUNT} more`}
            <CaretDownIcon
              aria-hidden="true"
              className="transition-transform duration-200 group-data-panel-open:rotate-180"
              size={12}
              weight="bold"
            />
          </Collapsible.Trigger>
        </Collapsible.Root>
      ) : (
        <UsesItemList items={section.items} />
      )}
    </section>
  );
};

export const Uses = (): JSX.Element | null => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div>
      <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
        {sections.map((section) => (
          <a
            className="flex items-center gap-x-1.5 rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 transition-[background-color,scale] duration-150 hover:bg-neutral-50 active:scale-[0.96] active:duration-0 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
            href={`#${section.id}`}
            key={section.id}
          >
            {section.title}
            <span className="text-xs text-neutral-400 tabular-nums dark:text-neutral-500">
              {section.items.length}
            </span>
          </a>
        ))}
      </nav>
      {sections.map((section) => (
        <UsesSectionList key={section.id} section={section} />
      ))}
    </div>
  );
};
