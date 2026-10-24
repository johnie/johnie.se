import { allPosts } from "content-collections";
import type { Post } from "content-collections";

import { SITE_URL } from "@/lib/constants";
import { ogImageUrl, serializeJsonLd } from "@/lib/metadata";

const AUTHOR = "Johnie Hjelm";

export interface Writing {
  /** Every Post, newest first. */
  posts: readonly Post[];
  /** Posts grouped by UTC publication year, newest year and Post first. */
  postsByYear: readonly (readonly [year: string, posts: readonly Post[]])[];
  find: (slug: string) => Post | undefined;
}

export const createWriting = (unordered: readonly Post[]): Writing => {
  const posts = unordered.toSorted(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );

  const postsByYear: [string, Post[]][] = [];

  for (const post of posts) {
    const year = new Date(post.publishedAt).getUTCFullYear().toString();
    const group = postsByYear.at(-1);

    if (group?.[0] === year) {
      group[1].push(post);
    } else {
      postsByYear.push([year, [post]]);
    }
  }

  return {
    find: (slug) => posts.find((post) => post.slug === slug),
    posts,
    postsByYear,
  };
};

export const writing = createWriting(allPosts);

/** The canonical URL of a Post. */
export const postUrl = (post: Pick<Post, "slug">): string =>
  `${SITE_URL}/writing/${post.slug}`;

const postImageUrl = (post: Pick<Post, "image" | "title">): string =>
  post.image ? `${SITE_URL}${post.image}` : ogImageUrl(post.title);

/** Route `head` for a Post page: canonical link, article, OG and Twitter tags. */
export const postHead = (post: Post) => {
  const url = postUrl(post);
  const image = postImageUrl(post);

  return {
    links: [{ rel: "canonical", href: url }],
    meta: [
      { title: `${post.title} | ${AUTHOR}` },
      { name: "description", content: post.summary },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.summary },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: post.publishedAt },
      { property: "article:modified_time", content: post.lastModified },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: post.title },
      { name: "twitter:description", content: post.summary },
      { name: "twitter:image", content: image },
    ],
  };
};

/** Serialized BlogPosting and BreadcrumbList JSON-LD for a Post page. */
export const postJsonLd = (post: Post) => {
  const url = postUrl(post);

  return {
    blogPosting: serializeJsonLd({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      author: { "@type": "Person", name: AUTHOR },
      dateModified: post.lastModified,
      datePublished: post.publishedAt,
      description: post.summary,
      headline: post.title,
      image: postImageUrl(post),
      url,
    }),
    breadcrumbs: serializeJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", item: SITE_URL, name: "Home", position: 1 },
        {
          "@type": "ListItem",
          item: `${SITE_URL}/writing`,
          name: "Writing",
          position: 2,
        },
        { "@type": "ListItem", item: url, name: post.title, position: 3 },
      ],
    }),
  };
};
