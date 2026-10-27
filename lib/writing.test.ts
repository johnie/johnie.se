import { describe, expect, it } from "vitest";

import { PostSchema } from "@/content-collections";
import { postFixture } from "@/lib/testing/content-fixtures";
import { createWriting, postHead, postJsonLd } from "@/lib/writing";

const meta = (head: ReturnType<typeof postHead>, property: string) =>
  head.meta.find((tag) => "property" in tag && tag.property === property)
    ?.content;

describe("Post frontmatter", () => {
  const requiredFields = {
    content: "",
    publishedAt: "2026-03-01",
    summary: "A summary",
    title: "A title",
  };

  it("accepts absent optional fields and normalizes explicit dates", () => {
    const withoutOptional = PostSchema.parse(requiredFields);

    const withOptional = PostSchema.parse({
      ...requiredFields,
      seoTitle: " Search title ",
      updatedAt: "2026-03-02",
    });

    expect(withoutOptional.updatedAt).toBeUndefined();
    expect(withoutOptional.seoTitle).toBeUndefined();
    expect(withOptional.publishedAt).toBe("2026-03-01T00:00:00.000Z");
    expect(withOptional.updatedAt).toBe("2026-03-02T00:00:00.000Z");
    expect(withOptional.seoTitle).toBe("Search title");
  });

  it("rejects invalid update dates and blank search titles", () => {
    expect(
      PostSchema.safeParse({ ...requiredFields, updatedAt: "invalid" }).success
    ).toBeFalsy();
    expect(
      PostSchema.safeParse({ ...requiredFields, seoTitle: "  " }).success
    ).toBeFalsy();
  });
});

describe(createWriting, () => {
  const writing = createWriting([
    postFixture({ publishedAt: "2024-06-01T00:00:00.000Z", slug: "middle" }),
    postFixture({ publishedAt: "2025-01-01T00:00:00.000Z", slug: "newest" }),
    // 23:30 UTC on New Year's Eve still belongs to the old year.
    postFixture({ publishedAt: "2023-12-31T23:30:00.000Z", slug: "oldest" }),
    postFixture({ publishedAt: "2024-02-01T00:00:00.000Z", slug: "early" }),
  ]);

  it("orders Posts newest first", () => {
    expect(writing.posts.map((post) => post.slug)).toStrictEqual([
      "newest",
      "middle",
      "early",
      "oldest",
    ]);
  });

  it("groups Posts by UTC year, newest year first", () => {
    expect(
      writing.postsByYear.map(([year, posts]) => [
        year,
        posts.map((post) => post.slug),
      ])
    ).toStrictEqual([
      ["2025", ["newest"]],
      ["2024", ["middle", "early"]],
      ["2023", ["oldest"]],
    ]);
  });

  it("finds a Post by slug and misses unknown slugs", () => {
    expect(writing.find("early")?.slug).toBe("early");
    expect(writing.find("missing")).toBeUndefined();
  });
});

describe("Post SEO facts", () => {
  const post = postFixture({
    updatedAt: "2026-03-02T10:00:00.000Z",
    publishedAt: "2026-03-01T00:00:00.000Z",
    slug: "hello",
    title: "Hello </script> world",
  });

  it("points canonical, og:url and JSON-LD at the same Post URL", () => {
    const head = postHead(post);
    const blogPosting = JSON.parse(postJsonLd(post).blogPosting);

    expect(head.links).toStrictEqual([
      { href: "https://johnie.se/writing/hello", rel: "canonical" },
    ]);
    expect(meta(head, "og:url")).toBe("https://johnie.se/writing/hello");
    expect(blogPosting.url).toBe("https://johnie.se/writing/hello");
  });

  it("falls back to the generated OG image and prefers the Post image", () => {
    expect(meta(postHead(post), "og:image")).toBe(
      "https://johnie.se/og?title=Hello%20%3C%2Fscript%3E%20world"
    );
    expect(
      meta(postHead({ ...post, image: "/images/hello.png" }), "og:image")
    ).toBe("https://johnie.se/images/hello.png");
  });

  it("reports the same modified date in head and JSON-LD", () => {
    const blogPosting = JSON.parse(postJsonLd(post).blogPosting);

    expect(meta(postHead(post), "article:modified_time")).toBe(
      "2026-03-02T10:00:00.000Z"
    );
    expect(blogPosting.dateModified).toBe("2026-03-02T10:00:00.000Z");
  });

  it("preserves the published date and omits an unknown modification date", () => {
    const withoutUpdate = postFixture({
      publishedAt: "2026-03-01T00:00:00.000Z",
      slug: "unmodified",
    });

    const head = postHead(withoutUpdate);
    const blogPosting = JSON.parse(postJsonLd(withoutUpdate).blogPosting);

    expect(meta(head, "article:published_time")).toBe(
      withoutUpdate.publishedAt
    );
    expect(meta(head, "article:modified_time")).toBeUndefined();
    expect(blogPosting.datePublished).toBe(withoutUpdate.publishedAt);
    expect(blogPosting).not.toHaveProperty("dateModified");
  });

  it("uses the optional search title only for the HTML title", () => {
    const withSeoTitle = { ...post, seoTitle: "A search title" };
    const head = postHead(withSeoTitle);
    const blogPosting = JSON.parse(postJsonLd(withSeoTitle).blogPosting);

    expect(head.meta).toContainEqual({
      title: "A search title | Johnie Hjelm",
    });
    expect(meta(head, "og:title")).toBe(post.title);
    expect(head.meta).toContainEqual({
      name: "twitter:title",
      content: post.title,
    });
    expect(blogPosting.headline).toBe(post.title);
    expect(postHead(post).meta).toContainEqual({
      title: `${post.title} | Johnie Hjelm`,
    });
  });

  it("escapes < so a title cannot close the JSON-LD script", () => {
    const { blogPosting, breadcrumbs } = postJsonLd(post);

    expect(blogPosting).not.toContain("</script>");
    expect(breadcrumbs).not.toContain("</script>");
    expect(JSON.parse(blogPosting).headline).toBe(post.title);
  });
});
