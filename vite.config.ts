import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        rehypePlugins: [
          rehypeSlug,
          [rehypeShiki, { theme: "vesper" }],
          [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
        ],
        remarkPlugins: [remarkFrontmatter, remarkGfm],
      }),
    },
    contentCollections(),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react({ include: /\.(?:mdx|js|jsx|ts|tsx)$/u }),
  ],
  preview: { port: 3000 },
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
});
