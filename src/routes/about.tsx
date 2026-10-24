import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPages } from "content-collections";

import { Mdx } from "@/components/mdx";
import { SITE_URL } from "@/lib/constants";
import { preloadMdx } from "@/lib/mdx-modules";
import { createPageHead } from "@/lib/metadata";

const About = () => {
  const { page } = Route.useLoaderData();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    description:
      "Committed to developing individuals and teams for success. Developer, engineering leader, and inclusive tech advocate focused on building products and leading teams.",
    jobTitle: "Developer, Engineering Leader, and Inclusive Tech Advocate",
    name: "Johnie Hjelm",
    sameAs: [
      "https://github.com/johnie",
      "https://www.linkedin.com/in/johniehjelm",
    ],
    url: SITE_URL,
  };

  const personSchemaJson = JSON.stringify(personSchema).replaceAll(
    "<",
    "\\u003c"
  );

  return (
    <div>
      <script type="application/ld+json">{personSchemaJson}</script>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-300">
        {page.title}
      </h1>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <div className="mb-4 w-full">
          <img
            alt="Johnie Hjelm"
            className="h-auto w-full rounded"
            decoding="async"
            fetchPriority="high"
            height={432}
            loading="eager"
            sizes="(min-width: 768px) 648px, calc(100vw - 32px)"
            src="/images/johnie-omni.jpg"
            width={648}
          />
        </div>
        <Mdx path={page.mdxPath} />
      </article>
    </div>
  );
};

export const Route = createFileRoute("/about")({
  loader: async () => {
    const page = allPages.find((entry) => entry._meta.path === "about");

    if (!page) {
      throw notFound();
    }

    await preloadMdx(page.mdxPath);

    return { page };
  },
  head: () =>
    createPageHead({
      description:
        "Learn about Johnie Hjelm, a developer, engineering leader, and inclusive tech advocate focused on building products and leading teams to success.",
      path: "/about",
      title: "About",
    }),
  component: About,
});
