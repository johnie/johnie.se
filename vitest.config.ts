import contentCollections from "@content-collections/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    projects: [
      {
        extends: true,
        plugins: [contentCollections()],
        test: { include: ["lib/**/*.test.ts"], name: "unit" },
      },
      {
        extends: true,
        test: { include: ["scripts/seo.test.mjs"], name: "seo" },
      },
    ],
  },
});
