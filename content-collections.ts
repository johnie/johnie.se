import { exec } from "node:child_process";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX, type Options } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import calcReadingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import z from "zod";

function run(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}

function generateId(inputString: string): string {
  const hash = createHash("sha256").update(inputString).digest("hex");

  const shortId = Buffer.from(hash).toString("base64").substring(0, 8);

  return shortId;
}

const getFileCreationDate = (filePath: string) => {
  const stats = statSync(filePath);
  return new Date(stats.birthtime).toISOString();
};

const mdxOptions: Options = {
  remarkPlugins: [remarkGfm],
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
};

const setStructuredData = (doc: Post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: doc.title,
  datePublished: doc.publishedAt,
  dateModified: doc.publishedAt,
  description: doc.summary,
  image: doc.image
    ? `https://johnie.se${doc.image}`
    : `https://johnie.se/og?title=${encodeURIComponent(doc.title)}`,
  url: `https://johnie.se/writing/${doc._meta.path}`,
  author: {
    "@type": "Person",
    name: "Johnie Hjelm",
    url: "https://johnie.se",
  },
  publisher: {
    "@type": "Person",
    name: "Johnie Hjelm",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://johnie.se/writing/${doc._meta.path}`,
  },
});

const PostSchema = z.object({
  title: z.string(),
  publishedAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date string")
    .transform<string>((value) => new Date(value).toISOString()),
  summary: z.string(),
  image: z.string().optional(),
  leading: z.boolean().optional().default(false),
  content: z.string(),
});

type Post = z.infer<typeof PostSchema> & {
  _meta: {
    path: string;
    filePath: string;
  };
};

const Post = defineCollection({
  name: "Post",
  directory: "content/",
  include: "*.mdx",
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
          const stdout = (await run(
            `git log -1 --format=%ai -- content/${filePath}`
          )) as string;
          return new Date(stdout.toString().trim()).toISOString();
        } catch {
          return new Date().toISOString();
        }
      }
    );

    return {
      ...document,
      slug,
      readingTime,
      structuredData,
      lastModified,
      mdx,
    };
  },
});

const Page = defineCollection({
  name: "Page",
  directory: "content/page/",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;

    return {
      ...document,
      slug,
      mdx,
    };
  },
});

const Work = defineCollection({
  name: "Work",
  directory: "content/work/",
  include: "*.yml",
  parser: "yaml",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    url: z.string().optional(),
    startYear: z.number().int(),
    endYear: z.number().int().optional(),
    present: z.boolean().optional(),
    image: z.string().optional(),
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
  name: "Project",
  directory: "content/projects/",
  include: "*.yml",
  parser: "yaml",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    projectType: z.string().optional(),
    image: z.string().optional(),
    order: z.number().optional(),
    active: z.boolean().optional(),
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
  name: "TodayILearned",
  directory: "content/til",
  include: "*.mdx",
  schema: z.object({
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
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const publishedAt =
      document.publishedAt ?? getFileCreationDate(document._meta.filePath);

    return {
      ...document,
      slug,
      mdx,
      publishedAt,
    };
  },
});

export default defineConfig({
  collections: [Post, Page, Work, Project, TodayILearned],
});
