import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";

export const createPageMetadata = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata => {
  const url = new URL(path, SITE_URL).toString();
  const socialTitle = `${title} | Johnie Hjelm`;
  const imageUrl = `${SITE_URL}/og?title=${encodeURIComponent(title)}`;

  return {
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
    },
    description,
    openGraph: {
      description,
      images: [{ url: imageUrl }],
      locale: "en_US",
      siteName: "Johnie Hjelm",
      title: socialTitle,
      type: "website",
      url,
    },
    title: { absolute: socialTitle },
    twitter: {
      card: "summary_large_image",
      description,
      images: [imageUrl],
      title: socialTitle,
    },
  };
};
