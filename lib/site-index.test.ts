import { describe, expect, it } from "vitest";

import { createSiteIndex } from "@/lib/site-index";
import { pageFixture, postFixture } from "@/lib/testing/content-fixtures";
import { createWriting } from "@/lib/writing";

const LOC_PATTERN = /<loc>(?<url>[^<]+)<\/loc>/gu;

const ITEM_LINK_PATTERN =
  /<item>\s*<title>.*?<\/title>\s*<link>(?<url>[^<]+)/gsu;

const siteIndex = createSiteIndex({
  pages: [pageFixture("about"), pageFixture("uses")],
  writing: createWriting([
    postFixture({
      lastModified: "2025-05-05T00:00:00.000Z",
      publishedAt: "2025-01-01T00:00:00.000Z",
      slug: "older",
    }),
    postFixture({ publishedAt: "2026-01-01T00:00:00.000Z", slug: "newer" }),
  ]),
});

describe("sitemap", () => {
  const sitemap = siteIndex.sitemap();

  const urls = [...sitemap.matchAll(LOC_PATTERN)].map(
    (match) => match.groups?.url
  );

  it("lists indexable routes, Pages and Posts exactly once", () => {
    expect(urls.toSorted()).toStrictEqual([
      "https://johnie.se/",
      "https://johnie.se/about",
      "https://johnie.se/til",
      "https://johnie.se/uses",
      "https://johnie.se/writing",
      "https://johnie.se/writing/newer",
      "https://johnie.se/writing/older",
    ]);
  });

  it("dates Posts by their last modification", () => {
    expect(sitemap).toContain(
      "<loc>https://johnie.se/writing/older</loc><lastmod>2025-05-05T00:00:00.000Z</lastmod>"
    );
  });
});

describe("feed", () => {
  const builtAt = new Date("2026-02-03T04:05:06.000Z");
  const feed = siteIndex.feed(builtAt);

  it("lists Posts newest first with permalinks", () => {
    expect(
      [...feed.matchAll(ITEM_LINK_PATTERN)].map((match) => match.groups?.url)
    ).toStrictEqual([
      "https://johnie.se/writing/newer",
      "https://johnie.se/writing/older",
    ]);
    expect(feed).toContain(
      '<guid isPermaLink="true">https://johnie.se/writing/newer</guid>'
    );
  });

  it("stamps RFC 822 build and publication dates", () => {
    expect(feed).toContain(
      "<lastBuildDate>Tue, 03 Feb 2026 04:05:06 GMT</lastBuildDate>"
    );
    expect(feed).toContain("<pubDate>Thu, 01 Jan 2026 00:00:00 GMT</pubDate>");
  });
});

describe("robots", () => {
  it("advertises the sitemap", () => {
    expect(siteIndex.robots()).toContain(
      "Sitemap: https://johnie.se/sitemap.xml"
    );
  });
});
