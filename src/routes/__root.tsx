import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { Cmd } from "@/components/cmd-loader";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Navigation from "@/components/nav";
import NotFound from "@/components/not-found";
import { SITE_URL } from "@/lib/constants";
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
  const { song } = Route.useLoaderData();

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-black dark:focus:bg-black dark:focus:text-white"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="mx-auto w-full px-4 text-neutral-700 md:max-w-170 dark:text-neutral-300">
        <div>
          <div className="flex min-h-dvh w-full flex-col justify-between">
            <header className="grid grid-cols-2 items-center py-8 text-neutral-700 md:py-16 dark:text-neutral-300">
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
      </div>
      <Toaster richColors />
      <Cmd />
    </>
  );
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Johnie Hjelm" },
      {
        name: "description",
        content: "Committed to developing individuals and teams for success.",
      },
      { name: "author", content: "Johnie Hjelm" },
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
        content: "Committed to developing individuals and teams for success.",
      },
      { property: "og:image", content: `${SITE_URL}/og` },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Johnie Hjelm" },
      { property: "og:title", content: "Johnie Hjelm" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og` },
      { name: "twitter:title", content: "Johnie Hjelm" },
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
  loader: () => ({ song: getSpotifySong() }),
  staleTime: 60_000,
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
});
