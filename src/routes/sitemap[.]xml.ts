import { createFileRoute } from "@tanstack/react-router";
import { allPages, allPosts } from "content-collections";
import { SITE_URL } from "@/lib/constants";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const staticRoutes = [
          { url: SITE_URL, changefreq: "weekly", priority: "1.0" },
          { url: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.8" },
          { url: `${SITE_URL}/writing`, changefreq: "weekly", priority: "0.9" },
          { url: `${SITE_URL}/til`, changefreq: "weekly", priority: "0.6" },
        ];

        const blogUrls = allPosts.map((post) => ({
          url: `${SITE_URL}/writing/${post.slug}`,
          lastmod: post.lastModified || post.publishedAt,
          changefreq: "monthly",
          priority: "0.7",
        }));

        const pageUrls = allPages.map((page) => ({
          url: `${SITE_URL}/${page.slug}`,
          changefreq: "monthly",
          priority: "0.5",
        }));

        const allUrls = [...staticRoutes, ...blogUrls, ...pageUrls];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (item) => `
  <url>
    <loc>${item.url}</loc>
    ${"lastmod" in item && item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
