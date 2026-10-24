import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { defineCollection, defineConfig } from "@content-collections/core";
import calcReadingTime from "reading-time";
import { z } from "zod";

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

const PostSchema = z.object({
  content: z.string(),
  image: z.string().optional(),
  featured: z.boolean().optional().default(false),
  leading: z.boolean().optional().default(false),
  publishedAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date string")
    .transform<string>((value) => new Date(value).toISOString()),
  summary: z.string().trim().min(1, "Post summary must not be empty"),
  title: z.string(),
});

const Post = defineCollection({
  directory: "content/",
  include: "*.mdx",
  name: "Post",
  schema: PostSchema,
  transform: async (document, context) => {
    const { content, ...rest } = document;
    const slug = document._meta.path;

    const readingTime = calcReadingTime(content, {
      wordsPerMinute: 275,
    }).text;

    const lastModified = await context.cache(
      document._meta.filePath,
      async (filePath) => {
        try {
          const stdout = await runGitLog(filePath);

          return new Date(stdout.toString().trim()).toISOString();
        } catch {
          return document.publishedAt;
        }
      }
    );

    return {
      ...rest,
      lastModified,
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
    image: z.string().optional(),
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
  transform: (document) => {
    const { content: _content, ...rest } = document;
    const slug = document._meta.path;

    const publishedAt =
      document.publishedAt ?? getFileCreationDate(document._meta.filePath);

    return {
      ...rest,
      mdxPath: `/content/til/${document._meta.filePath}`,
      publishedAt,
      slug,
    };
  },
});

export default defineConfig({
  content: [Post, Page, Work, Project, TodayILearned],
});
