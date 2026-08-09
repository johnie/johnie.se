export default function robots() {
  return {
    host: "https://johnie.se",
    rules: [
      {
        allow: "/",
        userAgent: "*",
      },
    ],
    sitemap: "https://johnie.se/sitemap.xml",
  };
}
