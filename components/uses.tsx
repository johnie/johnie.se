import { Collapsible } from "@base-ui/react/collapsible";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { allUsesSections } from "content-collections";
import type { UsesSection } from "content-collections";
import { useState } from "react";
import type { JSX } from "react";

import { formatDate } from "@/lib/utils";

/** Items a collapsed section shows before its "Show more" toggle. */
const PREVIEW_COUNT = 3;

const sections = allUsesSections.toSorted((a, b) => a.order - b.order);

// ISO strings sort chronologically, so the max is the latest change.
const lastModified = sections
  .map((section) => section.lastModified)
  .filter((date) => date !== null)
  .toSorted()
  .at(-1);

// The row is a div whose name link stretches over it (after:inset-0), so a
// post link can sit inside the row without nesting one link in another.
const UsesItem = ({ item }: { item: UsesSection["items"][number] }) => (
  <div className="group relative -mx-4 flex items-center gap-x-4 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-50 has-[a:active]:bg-neutral-100 has-[a:active]:duration-0 dark:hover:bg-neutral-900 dark:has-[a:active]:bg-neutral-800">
    <div className="flex min-w-0 flex-auto flex-col gap-y-0.5">
      <a
        className="text-sm font-medium text-neutral-900 after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-neutral-500 focus-visible:after:ring-inset dark:text-neutral-100"
        href={item.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {item.name}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <p className="text-[13px] leading-5 text-pretty text-neutral-500 dark:text-neutral-400">
        {item.description}
      </p>
      {item.post ? (
        <Link
          className="relative mt-1 inline-flex items-center gap-x-1 self-start rounded-sm text-[13px] text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-900 hover:decoration-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none dark:text-neutral-300 dark:decoration-neutral-700 dark:hover:text-neutral-100 dark:hover:decoration-neutral-400"
          params={{ slug: item.post.slug }}
          to="/writing/$slug"
        >
          Read: {item.post.title}
          <ArrowRightIcon aria-hidden="true" size={12} weight="bold" />
        </Link>
      ) : null}
    </div>
    <span
      aria-hidden="true"
      className="hidden size-7 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-neutral-200/60 text-neutral-600 opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-has-[a:focus-visible]:translate-x-0 group-has-[a:focus-visible]:opacity-100 sm:flex dark:bg-neutral-800 dark:text-neutral-300"
    >
      <ArrowUpRightIcon size={14} weight="bold" />
    </span>
  </div>
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
      {lastModified ? (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Last updated{" "}
          <time dateTime={lastModified}>{formatDate(lastModified)}</time>
        </p>
      ) : null}
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
