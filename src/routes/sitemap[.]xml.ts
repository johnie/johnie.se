import { createFileRoute } from "@tanstack/react-router";
import { allPages, allPosts } from "content-collections";

import { SITE_URL } from "@/lib/constants";

interface SitemapEntry {
  changeFrequency: "monthly" | "weekly";
  lastModified?: string;
  priority: number;
  url: string;
}

const GET = () => {
  const blogs: SitemapEntry[] = allPosts.map((post) => ({
    changeFrequency: "monthly",
    lastModified: post.lastModified ?? post.publishedAt,
    priority: 0.7,
    url: `${SITE_URL}/writing/${post.slug}`,
  }));

  const pages: SitemapEntry[] = allPages
    .filter((page) => page.slug !== "about")
    .map((page) => ({
      changeFrequency: "monthly",
      priority: 0.5,
      url: `${SITE_URL}/${page.slug}`,
    }));

  const routes: SitemapEntry[] = [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: SITE_URL,
    },
    {
      changeFrequency: "monthly",
      priority: 0.8,
      url: `${SITE_URL}/about`,
    },
    {
      changeFrequency: "weekly",
      priority: 0.9,
      url: `${SITE_URL}/writing`,
    },
    {
      changeFrequency: "weekly",
      priority: 0.6,
      url: `${SITE_URL}/til`,
    },
  ];

  const entries = [...routes, ...pages, ...blogs]
    .map(
      (entry) =>
        `<url><loc>${entry.url}</loc>${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ""}<changefreq>${entry.changeFrequency}</changefreq><priority>${entry.priority}</priority></url>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
};

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET } },
});
