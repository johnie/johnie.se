import { doesNotMatch, equal, match, ok } from "node:assert/strict";
import { test } from "node:test";

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

test("sitemap lists only canonical, indexable pages with metadata", async (t) => {
  const response = await fetchPage("/sitemap.xml");
  equal(response.status, 200);
  const xml = await response.text();
  const urls = [...xml.matchAll(sitemapLocationPattern)].map(
    (entry) => entry.groups.url
  );

  ok(urls.length > 0);
  equal(new Set(urls).size, urls.length, "Sitemap URLs must be unique");
  doesNotMatch(xml, /<loc>[^<]*\/til\//u);

  await Promise.all(
    urls.map(async (url) => {
      const canonical = new URL(url);
      await t.test(canonical.pathname, async () => {
        equal(canonical.origin, siteUrl);
        const page = await fetchPage(canonical.pathname);
        equal(page.status, 200);
        equal(page.redirected, false, "Sitemap URLs must not redirect");
        const html = await page.text();

        equal(
          new URL(html.match(canonicalPattern)?.groups.url).href,
          canonical.href
        );
        equal(
          new URL(html.match(ogUrlPattern)?.groups.url).href,
          canonical.href
        );
        match(html, descriptionPattern);
        ok(
          html.includes(`type="application/rss+xml" href="${siteUrl}/feed.xml"`)
        );
        const title = html.match(titlePattern)?.groups.title;
        const ogTitle = html.match(ogTitlePattern)?.groups.title;
        const twitterTitle = html.match(twitterTitlePattern)?.groups.title;
        ok(title && ogTitle && twitterTitle);
        ok(
          title.startsWith(ogTitle),
          "Open Graph title must describe this page"
        );
        ok(
          title.startsWith(twitterTitle),
          "Twitter title must describe this page"
        );
        match(html, /<meta name="twitter:description" content="[^"]+"/u);
        doesNotMatch(
          html,
          /<meta name="(?:robots|googlebot)" content="[^"]*noindex/u
        );
        equal([...html.matchAll(headingPattern)].length, 1, "Expected one H1");

        for (const entry of html.matchAll(structuredDataPattern)) {
          const schema = JSON.parse(entry.groups.json);
          equal(schema["@context"], "https://schema.org");
          ok(schema["@type"]);
        }

        if (
          canonical.pathname === "/about" ||
          canonical.pathname.startsWith("/writing/")
        ) {
          for (const image of html.matchAll(imagePattern)) {
            ok(
              image[0].includes(responsiveSizes),
              "Content images need responsive sizes"
            );
          }
        }
      });
    })
  );
});

test("robots.txt advertises the sitemap and allows crawling", async () => {
  const response = await fetchPage("/robots.txt");
  equal(response.status, 200);
  const body = await response.text();
  ok(body.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
  match(body, /Allow: \/(?:\r?\n|$)/u);
});

test("removed TIL sitemap entries remain genuine 404s", async () => {
  const response = await fetchPage("/til/undici");
  equal(response.status, 404);
});

test("homepage work and project logos are lazy loaded", async () => {
  const response = await fetchPage("/");
  equal(response.status, 200);
  const html = await response.text();
  const images = [...html.matchAll(imagePattern)];
  ok(images.length > 0);
  for (const image of images) {
    ok(image[0].includes('loading="lazy"'));
    doesNotMatch(image[0], /fetchPriority="high"/iu);
  }
});
