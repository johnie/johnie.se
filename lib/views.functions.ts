import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { viewCounts } from "@/lib/views.server";

export const getViewCounts = createServerFn({ method: "GET" }).handler(() =>
  viewCounts.all()
);

export const incrementView = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    if (import.meta.env.DEV) {
      return;
    }

    await viewCounts.increment(data.slug);
  });
