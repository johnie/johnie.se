import { allPages } from "content-collections";
import type { Page } from "content-collections";

import { SITE_URL } from "@/lib/constants";
import { postUrl, writing } from "@/lib/writing";
import type { Writing } from "@/lib/writing";
import type { FileRouteTypes } from "@/src/routeTree.gen";

interface SitemapRule {
  changeFrequency: "monthly" | "weekly";
  priority: number;
}

interface SitemapEntry extends SitemapRule {
  lastModified?: string;
  url: string;
}

/**
 * Every route the router knows, so a new route file fails typecheck until it
 * is classified here. `null` routes are not standalone sitemap entries:
 * dynamic routes are listed per Page and Post, the rest are not indexable.
 */
const ROUTES: Record<FileRouteTypes["to"], SitemapRule | null> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/$slug": null,
  "/about": { changeFrequency: "monthly", priority: 0.8 },
  "/feed.xml": null,
  "/og": null,
  "/robots.txt": null,
  "/sitemap.xml": null,
  "/til": { changeFrequency: "weekly", priority: 0.6 },
  "/wp-admin": null,
  "/writing": { changeFrequency: "weekly", priority: 0.9 },
  "/writing/$slug": null,
};

const isStaticRoute = (path: string): path is FileRouteTypes["to"] =>
  Object.hasOwn(ROUTES, path);

const renderUrl = (entry: SitemapEntry): string => {
  const lastModified = entry.lastModified
    ? `<lastmod>${entry.lastModified}</lastmod>`
    : "";

  return `<url><loc>${entry.url}</loc>${lastModified}<changefreq>${entry.changeFrequency}</changefreq><priority>${entry.priority}</priority></url>`;
};

export interface SiteIndex {
  /** RSS 2.0 feed of every Post, newest first. */
  feed: (builtAt: Date) => string;
  robots: () => string;
  /** Every indexable route, Page, and Post. */
  sitemap: () => string;
}

export const createSiteIndex = ({
  pages,
  writing: { posts },
}: {
  pages: readonly Page[];
  writing: Pick<Writing, "posts">;
}): SiteIndex => ({
  feed: (builtAt) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Johnie Hjelm</title>
    <link>${SITE_URL}</link>
    <description>Committed to developing individuals and teams for success.</description>
    <language>en</language>
    <lastBuildDate>${builtAt.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl(post)}</link>
      <guid isPermaLink="true">${postUrl(post)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`,
  robots: () =>
    `User-Agent: *\nAllow: /\n\nHost: ${SITE_URL}\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  sitemap: () => {
    const routes: SitemapEntry[] = Object.entries(ROUTES).flatMap(
      ([path, rule]) =>
        rule ? [{ ...rule, url: new URL(path, SITE_URL).toString() }] : []
    );

    // A Page with its own route (e.g. /about) is listed once, as that route.
    const pageEntries: SitemapEntry[] = pages
      .filter((page) => !isStaticRoute(`/${page.slug}`))
      .map((page) => ({
        changeFrequency: "monthly",
        priority: 0.5,
        url: `${SITE_URL}/${page.slug}`,
      }));

    const postEntries: SitemapEntry[] = posts.map((post) => ({
      changeFrequency: "monthly",
      lastModified: post.lastModified,
      priority: 0.7,
      url: postUrl(post),
    }));

    const urls = [...routes, ...pageEntries, ...postEntries]
      .map(renderUrl)
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  },
});

export const siteIndex = createSiteIndex({ pages: allPages, writing });
