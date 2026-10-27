import type { Page, Post } from "content-collections";

const meta = (directory: string, slug: string) => ({
  directory,
  extension: "mdx",
  fileName: `${slug}.mdx`,
  filePath: `${slug}.mdx`,
  path: slug,
});

export const postFixture = ({
  slug,
  ...overrides
}: Partial<Post> & Pick<Post, "slug">): Post => ({
  _meta: meta(".", slug),
  featured: false,
  leading: false,
  mdxPath: `/content/${slug}.mdx`,
  publishedAt: "2026-01-01T00:00:00.000Z",
  readingTime: "1 min read",
  slug,
  summary: `Summary of ${slug}`,
  title: `Title of ${slug}`,
  ...overrides,
});

export const pageFixture = (slug: string): Page => ({
  _meta: meta("page", slug),
  mdxPath: `/content/page/${slug}.mdx`,
  slug,
  summary: `Summary of ${slug}`,
  title: `Title of ${slug}`,
});
