import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import type { Options } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import calcReadingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import z from "zod";

import { SITE_URL } from "./lib/constants";

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

const generateId = (inputString: string): string => {
  const hash = createHash("sha256").update(inputString).digest("hex");

  const shortId = Buffer.from(hash).toString("base64").slice(0, 8);

  return shortId;
};

const getFileCreationDate = (filePath: string) => {
  const fullPath = path.join(process.cwd(), "content/til", filePath);
  const stats = statSync(fullPath);
  return new Date(stats.birthtime).toISOString();
};

const mdxOptions: Options = {
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeShiki,
      {
        theme: "vesper",
      },
    ],
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ["anchor"],
        },
      },
    ],
  ],
  remarkPlugins: [remarkGfm],
};

const setStructuredData = (doc: {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  _meta: { path: string };
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  author: {
    "@type": "Person",
    name: "Johnie Hjelm",
    url: SITE_URL,
  },
  dateModified: doc.publishedAt,
  datePublished: doc.publishedAt,
  description: doc.summary,
  headline: doc.title,
  image: doc.image
    ? `${SITE_URL}${doc.image}`
    : `${SITE_URL}/og?title=${encodeURIComponent(doc.title)}`,
  mainEntityOfPage: {
    "@id": `${SITE_URL}/writing/${doc._meta.path}`,
    "@type": "WebPage",
  },
  publisher: {
    "@type": "Person",
    name: "Johnie Hjelm",
  },
  url: `${SITE_URL}/writing/${doc._meta.path}`,
});

const PostSchema = z.object({
  content: z.string(),
  image: z.string().optional(),
  leading: z.boolean().optional().default(false),
  publishedAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date string")
    .transform<string>((value) => new Date(value).toISOString()),
  summary: z.string(),
  title: z.string(),
});

const Post = defineCollection({
  directory: "content/",
  include: "*.mdx",
  name: "Post",
  schema: PostSchema,
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const readingTime = calcReadingTime(document.content, {
      wordsPerMinute: 275,
    }).text;
    const structuredData = setStructuredData(document);
    const lastModified = await context.cache(
      document._meta.filePath,
      async (filePath) => {
        try {
          const stdout = await runGitLog(filePath);
          return new Date(stdout.toString().trim()).toISOString();
        } catch {
          return new Date().toISOString();
        }
      }
    );

    return {
      ...document,
      lastModified,
      mdx,
      readingTime,
      slug,
      structuredData,
    };
  },
});

const Page = defineCollection({
  directory: "content/page/",
  include: "*.mdx",
  name: "Page",
  schema: z.object({
    content: z.string(),
    image: z.string().optional(),
    summary: z.string(),
    title: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;

    return {
      ...document,
      mdx,
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
  transform: (document) => {
    const _id = generateId(
      document.company + document.role + document.startYear
    );
    return {
      ...document,
      _id,
    };
  },
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
  transform: (document) => {
    const _id = generateId(document.name + document.url);
    return {
      ...document,
      _id,
    };
  },
});

export const TodayILearned = defineCollection({
  directory: "content/til",
  include: "*.mdx",
  name: "TodayILearned",
  schema: z.object({
    content: z.string(),
    publishedAt: z
      .string()
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        "Invalid date string"
      )
      .transform<string>((value) => new Date(value).toISOString())
      .optional(),
    type: z.enum(["article", "code", "podcast", "general"]).optional(),
    url: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const publishedAt =
      document.publishedAt ?? getFileCreationDate(document._meta.filePath);

    return {
      ...document,
      mdx,
      publishedAt,
      slug,
    };
  },
});

export default defineConfig({
  content: [Post, Page, Work, Project, TodayILearned],
});
