import type { Post } from "content-collections";

export const sortPostsByDate = (posts: Post[]): Post[] =>
  posts.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });
