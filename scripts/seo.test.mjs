import { readdir } from "node:fs/promises";

import { assert, describe, it } from "vitest";

const baseUrl = process.env.SEO_BASE_URL ?? "http://localhost:3000";
const siteUrl = "https://johnie.se";
const sitemapLocationPattern = /<loc>\s*(?<url>[^<]+?)\s*<\/loc>/gu;

const attributePattern =
  /(?<name>[^\s=/>]+)(?:\s*=\s*(?:"(?<double>[^"]*)"|'(?<single>[^']*)'|(?<bare>[^\s"'=<>`]+)))?/gu;

const scriptPattern =
  /<script\b(?<attributes>[^>]*)>(?<body>[\s\S]*?)<\/script\s*>/giu;

const titlePattern = /<title\b[^>]*>(?<title>[\s\S]*?)<\/title\s*>/giu;

const decodeEntities = (value) =>
  value.replaceAll(
    /&(?<entity>amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/giu,
    (match, entity) => {
      if (entity.startsWith("#")) {
        return String.fromCodePoint(
          entity[1].toLowerCase() === "x"
            ? Number.parseInt(entity.slice(2), 16)
            : Number(entity.slice(1))
        );
      }

      return (
        { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[
          entity.toLowerCase()
        ] ?? match
      );
    }
  );

const attributes = (markup) =>
  Object.fromEntries(
    [...markup.matchAll(attributePattern)].map(({ groups }) => [
      groups.name.toLowerCase(),
      decodeEntities(groups.double ?? groups.single ?? groups.bare ?? ""),
    ])
  );

const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b(?<attributes>[^>]*)>`, "giu"))].map(
    ({ groups }) => attributes(groups.attributes)
  );

const uniqueTag = (entries, predicate, label) => {
  const matches = entries.filter(predicate);
  assert.lengthOf(matches, 1, `Expected exactly one ${label}`);

  return matches[0];
};

const metaContent = (meta, key, value) => {
  const tag = uniqueTag(meta, (entry) => entry[key] === value, value);
  assert.isString(tag.content, `${value} needs content`);

  return tag.content;
};

const articleCases = [
  {
    path: "/writing/i-already-lost-this-once",
  },
  {
    path: "/writing/de-clutter-your-inbox-organize-your-newsletters-with-instapaper",
    image: `${siteUrl}/images/writing/instapaper.png`,
  },
];

const fetchPage = async (path) =>
  await fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(20_000) });

const assertIndexablePageMarkup = (html, canonical) => {
  const links = tags(html, "link");
  const meta = tags(html, "meta");

  const canonicalLink = uniqueTag(
    links,
    (link) => link.rel === "canonical",
    "canonical link"
  );

  assert.strictEqual(new URL(canonicalLink.href).href, canonical.href);
  assert.strictEqual(metaContent(meta, "property", "og:url"), canonical.href);

  const feed = uniqueTag(
    links,
    (link) => link.rel === "alternate" && link.type === "application/rss+xml",
    "RSS alternate"
  );

  assert.strictEqual(feed.href, `${siteUrl}/feed.xml`);

  const titles = [...html.matchAll(titlePattern)];
  assert.lengthOf(titles, 1, "Expected exactly one document title");
  const title = decodeEntities(titles[0].groups.title.trim());
  assert.match(
    title,
    /\S.* \| Johnie Hjelm$/u,
    "Document titles identify the page and author"
  );
  const socialTitle = metaContent(meta, "property", "og:title");
  assert.strictEqual(metaContent(meta, "name", "twitter:title"), socialTitle);
  const description = metaContent(meta, "name", "description");
  assert.match(description, /\S/u, "Descriptions must contain text");
  assert.strictEqual(
    metaContent(meta, "property", "og:description"),
    description
  );
  assert.strictEqual(
    metaContent(meta, "name", "twitter:description"),
    description
  );
  const image = metaContent(meta, "property", "og:image");
  assert.strictEqual(new URL(image).origin, siteUrl);
  assert.strictEqual(metaContent(meta, "name", "twitter:image"), image);
  assert.strictEqual(
    metaContent(meta, "name", "twitter:card"),
    "summary_large_image"
  );

  for (const name of ["robots", "googlebot"]) {
    assert.notMatch(metaContent(meta, "name", name), /\bnoindex\b/iu);
  }

  assert.lengthOf(tags(html, "h1"), 1, "Expected one H1");

  const schemas = [...html.matchAll(scriptPattern)].flatMap(({ groups }) =>
    attributes(groups.attributes).type === "application/ld+json"
      ? [JSON.parse(groups.body)]
      : []
  );

  const article = canonical.pathname.startsWith("/writing/");

  const expectedSchemas = article
    ? ["BlogPosting", "BreadcrumbList"]
    : ({ "/": ["WebSite"], "/about": ["Person"] }[canonical.pathname] ?? []);

  assert.deepEqual(
    schemas.map((schema) => schema["@type"]).toSorted(),
    expectedSchemas.toSorted()
  );

  for (const schema of schemas) {
    assert.strictEqual(schema["@context"], "https://schema.org");
  }

  assert.strictEqual(
    metaContent(meta, "property", "og:type"),
    article ? "article" : "website"
  );

  if (article) {
    const posting = schemas.find((schema) => schema["@type"] === "BlogPosting");

    const breadcrumbs = schemas.find(
      (schema) => schema["@type"] === "BreadcrumbList"
    );

    assert.strictEqual(posting.url, canonical.href);
    assert.strictEqual(posting.headline, socialTitle);
    const heading = html.match(/<h1\b[^>]*>(?<text>[\s\S]*?)<\/h1\s*>/iu);
    assert.strictEqual(decodeEntities(heading.groups.text.trim()), socialTitle);
    assert.strictEqual(posting.description, description);
    assert.strictEqual(posting.image, image);
    assert.strictEqual(posting.author.name, "Johnie Hjelm");
    assert.strictEqual(
      metaContent(meta, "property", "article:published_time"),
      posting.datePublished
    );
    assert.strictEqual(
      new Date(posting.datePublished).toISOString(),
      posting.datePublished
    );
    assert.deepEqual(
      meta.flatMap((tag) =>
        tag.property === "article:modified_time" ? [tag.content] : []
      ),
      posting.dateModified ? [posting.dateModified] : []
    );
    assert.deepEqual(
      breadcrumbs.itemListElement.map(({ item, position }) => ({
        item,
        position,
      })),
      [
        { item: siteUrl, position: 1 },
        { item: `${siteUrl}/writing`, position: 2 },
        { item: canonical.href, position: 3 },
      ]
    );

    const knownArticle = articleCases.find(
      ({ path }) => path === canonical.pathname
    );

    if (knownArticle) {
      assert.notStrictEqual(
        title,
        `${socialTitle} | Johnie Hjelm`,
        "Authored search titles must not replace editorial titles"
      );

      if (knownArticle.image) {
        assert.strictEqual(image, knownArticle.image);
      } else {
        const generatedImage = new URL(image);
        assert.strictEqual(generatedImage.pathname, "/og");
        assert.strictEqual(
          generatedImage.searchParams.get("title"),
          socialTitle
        );
      }
    }
  } else {
    assert.strictEqual(title, socialTitle);

    if (canonical.pathname === "/" || canonical.pathname === "/about") {
      assert.strictEqual(schemas[0].url, siteUrl);
      assert.strictEqual(schemas[0].name, "Johnie Hjelm");
    }
  }
};

const assertPriorityImage = (html, src, width, height) => {
  const image = uniqueTag(tags(html, "img"), (entry) => entry.src === src, src);
  assert.strictEqual(Number(image.width), width);
  assert.strictEqual(Number(image.height), height);
  assert.strictEqual(image.loading, "eager");
  assert.strictEqual(image.fetchpriority, "high");
  assert.match(
    image.sizes,
    /\b\d+(?:\.\d+)?vw\b/u,
    "Content images should adapt to the viewport"
  );
};

describe("SEO", () => {
  it("sitemap includes public routes and authored articles, with unique indexable metadata", async () => {
    const response = await fetchPage("/sitemap.xml");
    assert.strictEqual(response.status, 200);
    const xml = await response.text();

    const urls = [...xml.matchAll(sitemapLocationPattern)].map(
      (entry) => entry.groups.url
    );

    const articleFiles = await readdir(new URL("../content/", import.meta.url));

    const expectedPaths = [
      "/",
      "/about",
      "/til",
      "/uses",
      "/writing",
      ...articleFiles.flatMap((name) =>
        name.endsWith(".mdx") ? [`/writing/${name.slice(0, -4)}`] : []
      ),
    ];

    assert.includeMembers(
      urls,
      expectedPaths.map((path) => new URL(path, siteUrl).href)
    );
    assert.includeMembers(
      urls,
      articleCases.map(({ path }) => `${siteUrl}${path}`)
    );
    assert.strictEqual(
      new Set(urls).size,
      urls.length,
      "Sitemap URLs must be unique"
    );

    for (const url of urls) {
      const path = new URL(url).pathname;
      assert.notMatch(path, /^\/til\//u);
      assert.notInclude(
        ["/wp-admin", "/og", "/feed.xml", "/robots.txt", "/sitemap.xml"],
        path
      );
    }

    await Promise.all(
      urls.map(async (url) => {
        const canonical = new URL(url);
        assert.strictEqual(canonical.origin, siteUrl);
        const page = await fetchPage(canonical.pathname);
        assert.strictEqual(page.status, 200, canonical.pathname);
        assert.isFalse(page.redirected, "Sitemap URLs must not redirect");
        assertIndexablePageMarkup(await page.text(), canonical);
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

  it.each([
    { path: "/about", src: "/images/johnie-omni.jpg", width: 648, height: 432 },
    {
      path: "/writing/de-clutter-your-inbox-organize-your-newsletters-with-instapaper",
      src: "/images/writing/instapaper.png",
      width: 1280,
      height: 720,
    },
  ])(
    "renders a dimensioned priority image on $path",
    async ({ path, src, width, height }) => {
      const response = await fetchPage(path);
      assert.strictEqual(response.status, 200);
      assertPriorityImage(await response.text(), src, width, height);
    }
  );

  it("renders biography experience from the request year rather than the Worker startup clock", async () => {
    const response = await fetchPage("/about");
    assert.strictEqual(response.status, 200);
    const html = await response.text();

    const experience = [
      ...html.matchAll(/with over (?<years>-?\d+) years in tech/gu),
    ];

    assert.lengthOf(experience, 1);
    assert.strictEqual(
      Number(experience[0].groups.years),
      new Date().getUTCFullYear() - 2009
    );
  });

  it("homepage work and project logos reserve space and remain lazy loaded", async () => {
    const response = await fetchPage("/");
    assert.strictEqual(response.status, 200);
    const images = tags(await response.text(), "img");
    uniqueTag(images, (image) => image.src === "/omni.svg", "Omni work logo");
    uniqueTag(
      images,
      (image) => image.src === "/dold.svg",
      "dold project logo"
    );

    for (const image of images) {
      assert.strictEqual(image.loading, "lazy");
      assert.notStrictEqual(image.fetchpriority, "high");
      assert.isAbove(Number(image.width), 0);
      assert.isAbove(Number(image.height), 0);
    }
  });
});
