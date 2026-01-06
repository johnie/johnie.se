export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://johnie.se/sitemap.xml",
    host: "https://johnie.se",
  };
}
