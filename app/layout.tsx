import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Toaster } from "sonner";

import { Cmd } from "@/components/cmd-loader";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Navigation from "@/components/nav";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  authors: [{ name: "Johnie Hjelm", url: SITE_URL }],
  description: "Committed to developing individuals and teams for success.",
  keywords: "Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: "Committed to developing individuals and teams for success.",
    images: [{ url: `${SITE_URL}/og` }],
    locale: "en_US",
    siteName: "Johnie Hjelm",
    title: "Johnie Hjelm",
    type: "website",
    url: SITE_URL,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: "Johnie Hjelm",
    template: "%s | Johnie Hjelm",
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/og`],
    title: "Johnie Hjelm",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html className="dark" lang="en">
    <body className={cn("antialiased", inter.className)}>
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
              <Link href="/" rel="home">
                <Logo />
              </Link>
              <Navigation />
            </header>
            <main id="main-content">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
      <Toaster richColors />
      <Cmd />
      <Script
        data-website-id="12583e8d-e6ac-4653-83f9-a8fd899f03fb"
        defer
        src="https://pulse.hjelm.cloud/script.js"
      />
    </body>
  </html>
);

export default RootLayout;
