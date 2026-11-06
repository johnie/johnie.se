import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

import { CommandPaletteProvider } from "@/components/command-palette/provider";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Navigation from "@/components/nav";
import NotFound from "@/components/not-found";
import { Toaster } from "@/components/ui/toast";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { CurrentYearContext } from "@/lib/current-year";
import { getSpotifySong } from "@/lib/spotify.functions";

import appCss from "../styles/globals.css?url";

const RootDocument = ({ children }: { children: ReactNode }) => (
  <html className="dark" lang="en">
    <head>
      <HeadContent />
    </head>
    <body className="antialiased">
      {children}
      <Scripts />
    </body>
  </html>
);

const RootLayout = () => {
  const { song, year } = Route.useLoaderData();

  return (
    <MotionConfig reducedMotion="user">
      <CurrentYearContext value={year}>
        <CommandPaletteProvider>
          <a
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-black dark:focus:bg-black dark:focus:text-white"
            href="#main-content"
          >
            Skip to content
          </a>
          <div className="mx-auto w-full px-4 text-neutral-700 md:max-w-170 dark:text-neutral-300">
            <div className="flex min-h-dvh w-full flex-col justify-between">
              <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-6 py-8 text-neutral-700 md:py-16 dark:text-neutral-300">
                <Link rel="home" to="/">
                  <Logo />
                </Link>
                <Navigation />
              </header>
              <main id="main-content">
                <Outlet />
              </main>
              <Footer song={song} />
            </div>
          </div>
          <Toaster />
        </CommandPaletteProvider>
      </CurrentYearContext>
    </MotionConfig>
  );
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      {
        name: "description",
        content: SITE_DESCRIPTION,
      },
      { name: "author", content: SITE_NAME },
      {
        name: "keywords",
        content: "Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip",
      },
      { name: "robots", content: "index, follow" },
      {
        name: "googlebot",
        content:
          "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
      },
      {
        property: "og:description",
        content: SITE_DESCRIPTION,
      },
      { property: "og:image", content: `${SITE_URL}/og` },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og` },
      { name: "twitter:title", content: SITE_NAME },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "author", href: SITE_URL },
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: `${SITE_URL}/feed.xml`,
      },
    ],
    scripts: [
      {
        src: "https://pulse.hjelm.cloud/script.js",
        defer: true,
        "data-website-id": "12583e8d-e6ac-4653-83f9-a8fd899f03fb",
      },
    ],
  }),
  // Workers' module-scope clock can be frozen at the Unix epoch.
  loader: () => ({ song: getSpotifySong(), year: new Date().getFullYear() }),
  staleTime: 60_000,
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
});
