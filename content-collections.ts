import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { defineCollection, defineConfig } from "@content-collections/core";
import calcReadingTime from "reading-time";
import { z } from "zod";

import { dateSchema, PostSchema } from "./lib/content-schema";

const execFileAsync = promisify(execFile);

const runGitLog = async (filePath: string): Promise<string> => {
  const { stdout } = await execFileAsync("git", [
    "log",
    "-1",
    "--format=%ai",
    "--",
    `content/${filePath}`,
  ]);

  return stdout;
};

const Post = defineCollection({
  directory: "content/",
  include: "*.mdx",
  name: "Post",
  schema: PostSchema,
  transform: (document) => {
    const { content, ...rest } = document;
    const slug = document._meta.path;

    const readingTime = calcReadingTime(content, {
      wordsPerMinute: 275,
    }).text;

    return {
      ...rest,
      mdxPath: `/content/${document._meta.filePath}`,
      readingTime,
      slug,
    };
  },
});

const Page = defineCollection({
  directory: "content/page/",
  include: "*.mdx",
  name: "Page",
  schema: z.object({
    content: z.string(),
    summary: z.string(),
    title: z.string(),
  }),
  transform: (document) => {
    const { content: _content, ...rest } = document;
    const slug = document._meta.path;

    return {
      ...rest,
      mdxPath: `/content/page/${document._meta.filePath}`,
      slug,
    };
  },
});

const Work = defineCollection({
  directory: "content/work/",
  include: "*.yml",
  name: "Work",
  parser: "yaml",
  schema: z.object({
    company: z.string(),
    endYear: z.number().int().optional(),
    image: z.string().optional(),
    present: z.boolean().optional(),
    role: z.string(),
    startYear: z.number().int(),
    url: z.string().optional(),
  }),
});

const Project = defineCollection({
  directory: "content/projects/",
  include: "*.yml",
  name: "Project",
  parser: "yaml",
  schema: z.object({
    active: z.boolean().optional(),
    description: z.string(),
    image: z.string().optional(),
    name: z.string(),
    order: z.number().optional(),
    projectType: z.string().optional(),
    url: z.string().optional(),
  }),
});

export const TodayILearned = defineCollection({
  directory: "content/til",
  include: "*.mdx",
  name: "TodayILearned",
  schema: z.object({
    content: z.string(),
    publishedAt: dateSchema,
  }),
  transform: (document) => {
    const { content: _content, ...rest } = document;
    const slug = document._meta.path;

    return {
      ...rest,
      mdxPath: `/content/til/${document._meta.filePath}`,
      slug,
    };
  },
});

const UsesSection = defineCollection({
  directory: "content/uses/",
  include: "*.yml",
  name: "UsesSection",
  parser: "yaml",
  schema: z.object({
    description: z.string().trim().min(1).optional(),
    /** Show every item instead of a short preview with a "Show more" toggle. */
    expanded: z.boolean().default(false),
    items: z
      .array(
        z.object({
          description: z.string().trim().min(1),
          name: z.string().trim().min(1),
          /** Slug of a post about this item, linked under its description. */
          post: z.string().trim().min(1).optional(),
          url: z.url({ protocol: /^https$/u }),
        })
      )
      .min(1, "A uses section needs at least one item"),
    order: z.number().int(),
    title: z.string(),
  }),
  transform: async (document, context) => {
    const posts = context.documents(Post);

    const items = document.items.map(({ post: slug, ...item }) => {
      if (!slug) {
        return { ...item, post: undefined };
      }

      const post = posts.find((entry) => entry._meta.path === slug);

      if (!post) {
        throw new Error(
          `Uses item "${item.name}" links to unknown post "${slug}"`
        );
      }

      return { ...item, post: { slug, title: post.title } };
    });

    // Git failures and files without a commit leave this optional date unset.
    const lastModified = await context.cache(
      document._meta.filePath,
      async (filePath) => {
        try {
          const stdout = await runGitLog(`uses/${filePath}`);
          const date = new Date(stdout.trim());

          return Number.isNaN(date.getTime()) ? null : date.toISOString();
        } catch {
          return null;
        }
      }
    );

    return {
      ...document,
      id: document._meta.path,
      items,
      lastModified,
    };
  },
});

export default defineConfig({
  content: [Post, Page, Work, Project, TodayILearned, UsesSection],
});
