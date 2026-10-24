import { createFileRoute } from "@tanstack/react-router";

import { renderOgImage } from "@/lib/og.server";

export const Route = createFileRoute("/og")({
  server: {
    handlers: {
      GET: ({ request }) => renderOgImage(request),
    },
  },
});
