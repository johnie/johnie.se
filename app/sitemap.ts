import { allPages, allPosts } from "content-collections";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = allPosts.map((post) => ({
    changeFrequency: "monthly" as const,
    lastModified: post.lastModified || post.publishedAt,
    priority: 0.7,
    url: `${SITE_URL}/writing/${post.slug}`,
  }));

  const pages = allPages.map((page) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date().toISOString(),
    priority: 0.5,
    url: `${SITE_URL}/${page.slug}`,
  }));

  const routes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "weekly",
      lastModified: new Date().toISOString(),
      priority: 1.0,
      url: SITE_URL,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date().toISOString(),
      priority: 0.8,
      url: `${SITE_URL}/about`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date().toISOString(),
      priority: 0.9,
      url: `${SITE_URL}/writing`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date().toISOString(),
      priority: 0.6,
      url: `${SITE_URL}/til`,
    },
  ];

  return [...routes, ...pages, ...blogs];
}
