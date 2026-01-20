import type { Post } from "content-collections";

export const sortPostsByDate = (posts: Post[]): Post[] =>
  posts.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });

export function groupPostsByYear(posts: Post[]): [string, Post[]][] {
  const sorted = sortPostsByDate(posts);
  const grouped: Record<string, Post[]> = {};

  for (const post of sorted) {
    const year = new Date(post.publishedAt).getFullYear().toString();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(post);
  }

  return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
}
