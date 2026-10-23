import { SITE_URL } from "@/lib/constants";

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
  const socialTitle = `${title} | Johnie Hjelm`;
  const imageUrl = `${SITE_URL}/og?title=${encodeURIComponent(title)}`;

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
