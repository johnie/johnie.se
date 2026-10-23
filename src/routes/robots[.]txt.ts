import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          "User-Agent: *\nAllow: /\n\nHost: https://johnie.se\nSitemap: https://johnie.se/sitemap.xml\n",
          { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        ),
    },
  },
});
