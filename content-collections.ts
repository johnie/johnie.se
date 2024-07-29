import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX, Options } from '@content-collections/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import calcReadingTime from 'reading-time';

function run(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
}

function generateId(inputString: string): string {
  const hash = createHash('sha256').update(inputString).digest('hex');

  const shortId = Buffer.from(hash).toString('base64').substring(0, 8);

  return shortId;
}

const mdxOptions: Options = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: JSON.parse(readFileSync(new URL('../../themes/will.json', import.meta.url)).toString()),
        keepBackground: false,
        onVisitLine(node: any) {
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
          }
        },
        onVisitHighlightedLine(node: any) {
          node.properties.className.push('line--highlighted');
        },
        onVisitHighlightedWord(node: any) {
          node.properties.className = ['word--highlighted'];
        },
      },
    ],
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ['anchor'],
        },
      },
    ],
  ],
};

const setStructuredData = (doc: any) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: doc.title,
  datePublished: doc.publishedAt,
  dateModified: doc.publishedAt,
  description: doc.summary,
  image: doc.image ? `https://johnie.se${doc.image}` : `https://johnie.se/og?title=${doc.title}`,
  url: `https://johnie.se/writings/${doc._meta.path}`,
  author: {
    '@type': 'Person',
    name: 'Johnie Hjelm',
  },
});

const Post = defineCollection({
  name: 'Post',
  directory: 'content/',
  include: '*.mdx',
  schema: (z) => ({
    title: z.string(),
    publishedAt: z
      .string()
      .refine((value) => !isNaN(Date.parse(value)), 'Invalid date string')
      .transform<string>((value) => new Date(value).toISOString()),
    summary: z.string().optional(),
    image: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const readingTime = calcReadingTime(document.content, { wordsPerMinute: 275 }).text;
    const structuredData = setStructuredData(document);
    const lastModified = await context.cache(document._meta.filePath, async (filePath) => {
      try {
        const stdout = (await run(`git log -1 --format=%ai -- content/${filePath}`)) as string;
        return new Date(stdout.toString().trim()).toISOString();
      } catch (error) {
        return new Date().toISOString();
      }
    });

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
  name: 'Page',
  directory: 'content/page/',
  include: '*.mdx',
  schema: (z) => ({
    title: z.string(),
    summary: z.string().optional(),
    image: z.string().optional(),
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
  name: 'Work',
  directory: 'content/work/',
  include: '*.yml',
  parser: 'yaml',
  schema: (z) => ({
    company: z.string(),
    role: z.string(),
    url: z.string().optional(),
    startYear: z.number().int(),
    endYear: z.number().int().optional(),
    present: z.boolean().optional(),
    image: z.string().optional(),
  }),
  transform: (document) => {
    const _id = generateId(document.company + document.role + document.startYear);
    return {
      ...document,
      _id,
    };
  },
});

const Project = defineCollection({
  name: 'Project',
  directory: 'content/projects/',
  include: '*.yml',
  parser: 'yaml',
  schema: (z) => ({
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

export default defineConfig({
  collections: [Post, Page, Work, Project],
});
