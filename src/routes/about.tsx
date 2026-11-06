import { createFileRoute } from "@tanstack/react-router";

import { Mdx } from "@/components/mdx";
import {
  CONTENT_IMAGE_SIZES,
  HEADSHOT_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { createPageHead, serializeJsonLd } from "@/lib/metadata";
import { loadPage } from "@/lib/pages";

const About = () => {
  const { page } = Route.useLoaderData();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    description: SITE_DESCRIPTION,
    jobTitle: "Head of Engineering",
    worksFor: {
      "@type": "Organization",
      name: "Omni",
      url: "https://omni.se",
    },
    name: SITE_NAME,
    sameAs: [
      "https://github.com/johnie",
      "https://www.linkedin.com/in/johniehjelm",
    ],
    url: SITE_URL,
  };

  const personSchemaJson = serializeJsonLd(personSchema);

  return (
    <div>
      <script type="application/ld+json">{personSchemaJson}</script>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-300">
        {page.title}
      </h1>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <div className="mb-4 w-full">
          <img
            alt={SITE_NAME}
            className="h-auto w-full rounded"
            decoding="async"
            fetchPriority="high"
            height={432}
            loading="eager"
            sizes={CONTENT_IMAGE_SIZES}
            src={HEADSHOT_URL}
            width={648}
          />
        </div>
        <Mdx path={page.mdxPath} />
      </article>
    </div>
  );
};

export const Route = createFileRoute("/about")({
  loader: async () => ({ page: await loadPage("about") }),
  head: () =>
    createPageHead({
      description:
        "How Johnie Hjelm went from self-taught developer to Head of Engineering at Omni, living with spinal muscular atrophy and using AI as assistive technology long before it was a trend.",
      path: "/about",
      title: "About",
    }),
  component: About,
});
