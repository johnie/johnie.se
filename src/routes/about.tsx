import { createFileRoute } from "@tanstack/react-router";
import { allPages } from "content-collections";
import { Mdx } from "@/components/mdx-loader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Johnie Hjelm" },
      {
        name: "description",
        content:
          "Learn about Johnie Hjelm, a designer, developer, and entrepreneur focused on building products and leading teams to success.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const content = allPages.find((page) => page._meta.path === "about");

  if (!content) {
    return null;
  }

  return (
    <div>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-neutral-100 dark:to-neutral-400">
        {content.title}
      </h1>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <div className="mb-4 w-full">
          <img
            alt="Johnie"
            className="h-auto w-full rounded"
            height={432}
            src="/images/johnie-omni.jpg"
            width={648}
          />
        </div>
        <Mdx code={content.mdx} />
      </article>
    </div>
  );
}
