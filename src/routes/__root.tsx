import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { CMD } from "@/components/cmd-loader";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Navigation from "@/components/nav-loader";
import appCss from "@/globals.css?url";
import { SITE_URL } from "@/lib/constants";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content: "Committed to developing individuals and teams for success.",
      },
      { name: "author", content: "Johnie Hjelm" },
      {
        name: "keywords",
        content: "Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip",
      },
      { property: "og:title", content: "Johnie Hjelm" },
      {
        property: "og:description",
        content: "Committed to developing individuals and teams for success.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: "Johnie Hjelm" },
      { property: "og:locale", content: "en-US" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Johnie Hjelm" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: `${SITE_URL}/feed.xml`,
        title: "Johnie Hjelm RSS Feed",
      },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-[Inter,sans-serif] antialiased">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-black dark:focus:bg-black dark:focus:text-white"
          href="#main-content"
        >
          Skip to content
        </a>
        <div className="mx-auto w-full px-4 text-neutral-700 md:max-w-170 dark:text-neutral-300">
          <div className="flex min-h-dvh w-full flex-col justify-between">
            <div className="grid grid-cols-2 items-center py-8 text-neutral-700 md:py-16 dark:text-neutral-300">
              <Link rel="home" to="/">
                <Logo />
              </Link>
              <Navigation />
            </div>
            <main id="main-content">{children}</main>
            <Footer />
          </div>
        </div>
        <Toaster richColors />
        <CMD />
        <Scripts />
      </body>
    </html>
  );
}
