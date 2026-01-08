import { createFileRoute } from "@tanstack/react-router";
import { allTodayILearneds } from "content-collections";
import { format } from "date-fns";
import { Mdx } from "@/components/mdx-loader";

export const Route = createFileRoute("/til")({
  head: () => ({
    meta: [
      { title: "Today I Learned | Johnie Hjelm" },
      {
        name: "description",
        content:
          "Quick learnings and discoveries about development, tools, and technology.",
      },
      { property: "og:title", content: "Today I Learned" },
      {
        property: "og:description",
        content:
          "Quick learnings and discoveries about development, tools, and technology.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TodayILearnedPage,
});

function TodayILearnedPage() {
  const tilsDescending = allTodayILearneds.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <section>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-neutral-100 dark:to-neutral-400">
        Today I Learned
      </h1>

      {tilsDescending.map((til) => (
        <div className="mb-8" key={til.slug}>
          <time className="relative z-10 -ml-[42px] flex items-center font-bold font-mono text-neutral-600 text-sm dark:text-neutral-400">
            <span className="mr-2 flex size-8 items-center justify-center">
              <span className="size-3 rounded-full border-2 border-neutral-800 dark:border-neutral-200" />
            </span>
            {format(new Date(til.publishedAt), "dd MMMM, yyyy")}
          </time>
          <div className="prose prose-quoteless prose-neutral dark:prose-invert prose-h3:mt-4">
            <Mdx code={til.mdx} />
          </div>
        </div>
      ))}
    </section>
  );
}
