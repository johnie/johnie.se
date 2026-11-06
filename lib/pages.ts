import { notFound } from "@tanstack/react-router";
import { allPages } from "content-collections";
import type { Page } from "content-collections";

import { preloadMdx } from "@/lib/mdx-modules";

export const loadPage = async (slug: string): Promise<Page> => {
  const page = allPages.find((entry) => entry.slug === slug);

  if (!page) {
    throw notFound();
  }

  await preloadMdx(page.mdxPath);

  return page;
};
