import { assert, describe, it } from "vitest";

const baseUrl = process.env.SEO_BASE_URL ?? "http://localhost:3000";
const siteUrl = "https://johnie.se";
const sitemapLocationPattern = /<loc>(?<url>[^<]+)<\/loc>/gu;
const headingPattern = /<h1[\s>]/gu;
const canonicalPattern = /<link rel="canonical" href="(?<url>[^"]+)"/u;
const ogUrlPattern = /<meta property="og:url" content="(?<url>[^"]+)"/u;
const descriptionPattern = /<meta name="description" content="[^"]+"/u;
const titlePattern = /<title>(?<title>[^<]+)<\/title>/u;
const ogTitlePattern = /<meta property="og:title" content="(?<title>[^"]+)"/u;

const twitterTitlePattern =
  /<meta name="twitter:title" content="(?<title>[^"]+)"/u;

const structuredDataPattern =
  /<script type="application\/ld\+json">(?<json>[^<]+)<\/script>/gu;

const imagePattern = /<img\b[^>]*>/gu;
const responsiveSizes = 'sizes="(min-width: 768px) 648px, calc(100vw - 32px)"';

const fetchPage = async (path) =>
  await fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(20_000) });

const assertIndexablePageMarkup = (html, canonical) => {
  assert.strictEqual(
    new URL(html.match(canonicalPattern)?.groups.url).href,
    canonical.href
  );
  assert.strictEqual(
    new URL(html.match(ogUrlPattern)?.groups.url).href,
    canonical.href
  );
  assert.match(html, descriptionPattern);
  assert.include(html, `type="application/rss+xml" href="${siteUrl}/feed.xml"`);

  const title = html.match(titlePattern)?.groups.title;
  const ogTitle = html.match(ogTitlePattern)?.groups.title;
  const twitterTitle = html.match(twitterTitlePattern)?.groups.title;
  assert.isOk(title && ogTitle && twitterTitle);
  assert.match(html, /<meta name="twitter:description" content="[^"]+"/u);
  assert.notMatch(
    html,
    /<meta name="(?:robots|googlebot)" content="[^"]*noindex/u
  );
  assert.lengthOf([...html.matchAll(headingPattern)], 1, "Expected one H1");

  for (const entry of html.matchAll(structuredDataPattern)) {
    const schema = JSON.parse(entry.groups.json);
    assert.strictEqual(schema["@context"], "https://schema.org");
    assert.isOk(schema["@type"]);
  }
};

describe("SEO", () => {
  it("sitemap lists only canonical, indexable pages with metadata", async () => {
    const response = await fetchPage("/sitemap.xml");
    assert.strictEqual(response.status, 200);
    const xml = await response.text();

    const urls = [...xml.matchAll(sitemapLocationPattern)].map(
      (entry) => entry.groups.url
    );

    assert.isAbove(urls.length, 0);
    assert.strictEqual(
      new Set(urls).size,
      urls.length,
      "Sitemap URLs must be unique"
    );
    assert.notMatch(xml, /<loc>[^<]*\/til\//u);

    await Promise.all(
      urls.map(async (url) => {
        const canonical = new URL(url);
        assert.strictEqual(canonical.origin, siteUrl);
        const page = await fetchPage(canonical.pathname);
        assert.strictEqual(page.status, 200, canonical.pathname);
        assert.isFalse(page.redirected, "Sitemap URLs must not redirect");
        const html = await page.text();

        assertIndexablePageMarkup(html, canonical);

        if (
          canonical.pathname === "/about" ||
          canonical.pathname.startsWith("/writing/")
        ) {
          for (const image of html.matchAll(imagePattern)) {
            assert.include(
              image[0],
              responsiveSizes,
              "Content images need responsive sizes"
            );
          }
        }
      })
    );
  });

  it("robots.txt advertises the sitemap and allows crawling", async () => {
    const response = await fetchPage("/robots.txt");
    assert.strictEqual(response.status, 200);
    const body = await response.text();
    assert.include(body, `Sitemap: ${siteUrl}/sitemap.xml`);
    assert.match(body, /Allow: \/(?:\r?\n|$)/u);
  });

  it("removed TIL sitemap entries remain genuine 404s", async () => {
    const response = await fetchPage("/til/undici");
    assert.strictEqual(response.status, 404);
  });

  it("permanently redirects trailing slashes while preserving the query", async () => {
    const response = await fetch(
      new URL("/writing/i-already-lost-this-once/?source=search", baseUrl),
      { redirect: "manual" }
    );

    assert.strictEqual(response.status, 308);
    assert.strictEqual(
      response.headers.get("location"),
      "/writing/i-already-lost-this-once?source=search"
    );
  });

  it("homepage work and project logos are lazy loaded", async () => {
    const response = await fetchPage("/");
    assert.strictEqual(response.status, 200);
    const html = await response.text();
    const images = [...html.matchAll(imagePattern)];
    assert.isAbove(images.length, 0);

    for (const image of images) {
      assert.include(image[0], 'loading="lazy"');
      assert.notMatch(image[0], /fetchPriority="high"/iu);
    }
  });
});
