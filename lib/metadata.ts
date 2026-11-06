import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const ogImageUrl = (title: string): string =>
  `${SITE_URL}/og?title=${encodeURIComponent(title)}`;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonLd {
  "@context": string;
  "@type": string;
  [property: string]: JsonValue;
}

/** JSON for an `application/ld+json` script; `<` is escaped so it cannot close the tag. */
export const serializeJsonLd = (document: JsonLd): string =>
  JSON.stringify(document).replaceAll("<", "\\u003c");

export const createPageHead = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) => {
  const url = new URL(path, SITE_URL).toString();
  const socialTitle = `${title} | ${SITE_NAME}`;
  const imageUrl = ogImageUrl(title);

  return {
    links: [{ rel: "canonical", href: url }],
    meta: [
      { title: socialTitle },
      { name: "description", content: description },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
  };
};
