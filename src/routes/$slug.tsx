import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPages } from "content-collections";

import { Mdx } from "@/components/mdx";
import { preloadMdx } from "@/lib/mdx-modules";
import { createPageHead } from "@/lib/metadata";

const Page = () => {
  const { page } = Route.useLoaderData();

  return (
    <article>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-300">
        {page.title}
      </h1>
      <div className="prose prose-quoteless prose-neutral dark:prose-invert prose-h3:mt-4">
        <Mdx path={page.mdxPath} />
      </div>
    </article>
  );
};

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const page = allPages.find((entry) => entry._meta.path === params.slug);

    if (!page) {
      throw notFound();
    }

    await preloadMdx(page.mdxPath);

    return { page };
  },
  head: ({ loaderData }) =>
    loaderData
      ? createPageHead({
          description: loaderData.page.summary,
          path: `/${loaderData.page.slug}`,
          title: loaderData.page.title,
        })
      : {},
  component: Page,
});
