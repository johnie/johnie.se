import { createFileRoute } from "@tanstack/react-router";

import { siteIndex } from "@/lib/site-index";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(siteIndex.sitemap(), {
          headers: { "Content-Type": "application/xml" },
        }),
    },
  },
});
