import { allPages } from "content-collections";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page._meta.path,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const page = allPages.find((p) => p._meta.path === slug);

  if (!page) {
    notFound();
  }

  return (
    <article>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-neutral-100 dark:to-neutral-400">
        {page.title}
      </h1>

      <div className="prose prose-quoteless prose-neutral dark:prose-invert prose-h3:mt-4">
        <Mdx code={page.mdx} />
      </div>
    </article>
  );
}
