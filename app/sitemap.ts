import { allPosts } from "content-collections";
import { SITE_URL } from "@/lib/constants";

export default function sitemap() {
  const blogs = allPosts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const routes = ["", "/about", "/writing", "/til"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
