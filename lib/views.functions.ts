import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getAllViewCounts, incrementViewCount } from "@/lib/views.server";

export const getViewCounts = createServerFn({ method: "GET" }).handler(() =>
  getAllViewCounts()
);

export const incrementView = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    if (import.meta.env.DEV) {
      return;
    }

    await incrementViewCount(data.slug);
  });
