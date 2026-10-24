import { createFileRoute } from "@tanstack/react-router";

import { siteIndex } from "@/lib/site-index";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(siteIndex.robots(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
