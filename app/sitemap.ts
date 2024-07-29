import { allPosts } from 'content-collections';

export default async function sitemap() {
  const blogs = allPosts.map((post) => ({
    url: `https://johnie.se/writing/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const routes = ['', '/about', '/writing'].map((route) => ({
    url: `https://johnie.se${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
