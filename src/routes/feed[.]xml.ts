import { createFileRoute } from "@tanstack/react-router";

import { siteIndex } from "@/lib/site-index";

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(siteIndex.feed(new Date()), {
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "Content-Type": "application/rss+xml; charset=utf-8",
          },
        }),
    },
  },
});
