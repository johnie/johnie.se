import { allPages } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx";
import { createPageMetadata } from "@/lib/metadata";

export const generateStaticParams = () =>
  allPages.map((page) => ({
    slug: page._meta.path,
  }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const page = allPages.find((p) => p._meta.path === slug);

  if (!page) {
    return {};
  }

  return createPageMetadata({
    description: page.summary,
    path: `/${slug}`,
    title: page.title,
  });
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const page = allPages.find((p) => p._meta.path === slug);

  if (!page) {
    notFound();
  }

  return (
    <article>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-400">
        {page.title}
      </h1>

      <div className="prose prose-quoteless prose-neutral dark:prose-invert prose-h3:mt-4">
        <Mdx code={page.mdx} />
      </div>
    </article>
  );
};

export default Page;
