import { allPages, allPosts } from "content-collections";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = allPosts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: post.lastModified || post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const pages = allPages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/writing`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/til`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  return [...routes, ...pages, ...blogs];
}
