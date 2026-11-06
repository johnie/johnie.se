import { describe, expect, it } from "vitest";

import { createSiteIndex } from "@/lib/site-index";
import { pageFixture, postFixture } from "@/lib/testing/content-fixtures";
import { createWriting } from "@/lib/writing";

const xmlElements = (xml: string, tag: string): string[] =>
  [
    ...xml.matchAll(
      new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gu")
    ),
  ].map((match) => match[1].trim());

const siteIndex = createSiteIndex({
  pages: [
    ...[
      "about",
      "uses",
      "writing",
      "til",
      "wp-admin",
      "feed.xml",
      "robots.txt",
      "sitemap.xml",
      "og",
    ].map(pageFixture),
    pageFixture("colophon"),
  ],
  writing: createWriting([
    postFixture({
      updatedAt: "2025-05-05T00:00:00.000Z",
      publishedAt: "2025-01-01T00:00:00.000Z",
      slug: "older",
    }),
    postFixture({ publishedAt: "2026-01-01T00:00:00.000Z", slug: "newer" }),
  ]),
});

describe("sitemap", () => {
  const sitemap = siteIndex.sitemap();

  const entries = xmlElements(sitemap, "url");
  const urls = entries.flatMap((entry) => xmlElements(entry, "loc"));

  it("lists indexable routes, Pages and Posts exactly once", () => {
    expect(urls.toSorted()).toStrictEqual([
      "https://johnie.se/",
      "https://johnie.se/about",
      "https://johnie.se/colophon",
      "https://johnie.se/til",
      "https://johnie.se/uses",
      "https://johnie.se/writing",
      "https://johnie.se/writing/newer",
      "https://johnie.se/writing/older",
    ]);
  });

  it("keeps file-route ownership when a Page has a reserved slug", () => {
    const about = entries.filter((entry) =>
      xmlElements(entry, "loc").includes("https://johnie.se/about")
    );

    expect(about.map((entry) => xmlElements(entry, "priority"))).toStrictEqual([
      ["0.8"],
    ]);
    expect(
      urls.filter((url) =>
        ["/wp-admin", "/og", "/feed.xml", "/robots.txt", "/sitemap.xml"].some(
          (path) => url === `https://johnie.se${path}`
        )
      )
    ).toStrictEqual([]);
  });

  it.each([
    { slug: "older", lastModified: ["2025-05-05T00:00:00.000Z"] },
    { slug: "newer", lastModified: [] },
  ])(
    "uses only explicit modification dates for $slug",
    ({ slug, lastModified }) => {
      const postEntries = entries.filter((entry) =>
        xmlElements(entry, "loc").includes(`https://johnie.se/writing/${slug}`)
      );

      expect(
        postEntries.map((entry) => xmlElements(entry, "lastmod"))
      ).toStrictEqual([lastModified]);
    }
  );
});

describe("feed", () => {
  const builtAt = new Date("2026-02-03T04:05:06.000Z");
  const feed = siteIndex.feed(builtAt);

  it("lists Posts newest first with permalink GUIDs and publication dates", () => {
    const items = xmlElements(feed, "item");
    expect(
      items.map((item) => ({
        links: xmlElements(item, "link"),
        guids: xmlElements(item, "guid"),
        published: xmlElements(item, "pubDate"),
      }))
    ).toStrictEqual([
      {
        links: ["https://johnie.se/writing/newer"],
        guids: ["https://johnie.se/writing/newer"],
        published: ["Thu, 01 Jan 2026 00:00:00 GMT"],
      },
      {
        links: ["https://johnie.se/writing/older"],
        guids: ["https://johnie.se/writing/older"],
        published: ["Wed, 01 Jan 2025 00:00:00 GMT"],
      },
    ]);

    for (const item of items) {
      expect(item).toMatch(/<guid\b[^>]*\bisPermaLink\s*=\s*["']true["']/u);
    }
  });

  it("stamps an RFC 822 build date", () => {
    expect(xmlElements(feed, "lastBuildDate")).toStrictEqual([
      "Tue, 03 Feb 2026 04:05:06 GMT",
    ]);
  });
});

describe("robots", () => {
  it("advertises the sitemap", () => {
    expect(siteIndex.robots()).toContain(
      "Sitemap: https://johnie.se/sitemap.xml"
    );
  });
});
