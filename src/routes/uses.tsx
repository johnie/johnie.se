import { createFileRoute } from "@tanstack/react-router";

import { Mdx } from "@/components/mdx";
import { Uses } from "@/components/uses";
import { createPageHead } from "@/lib/metadata";
import { loadPage } from "@/lib/pages";

const UsesPage = () => {
  const { page } = Route.useLoaderData();

  return (
    <div>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-300">
        {page.title}
      </h1>
      <div className="prose prose-quoteless prose-neutral dark:prose-invert">
        <Mdx path={page.mdxPath} />
      </div>
      <Uses />
    </div>
  );
};

export const Route = createFileRoute("/uses")({
  loader: async () => ({ page: await loadPage("uses") }),
  head: ({ loaderData }) =>
    loaderData
      ? createPageHead({
          description: loaderData.page.summary,
          path: "/uses",
          title: loaderData.page.title,
        })
      : {},
  component: UsesPage,
});
