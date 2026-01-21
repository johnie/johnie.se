import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Toaster } from "sonner";
import { CMD } from "@/components/cmd-loader";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Navigation from "@/components/nav";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Johnie Hjelm",
    template: "%s | Johnie Hjelm",
  },
  description: "Committed to developing individuals and teams for success.",
  authors: [{ name: "Johnie Hjelm", url: SITE_URL }],
  keywords: "Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip",
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: "Johnie Hjelm",
    description: "Committed to developing individuals and teams for success.",
    url: SITE_URL,
    siteName: "Johnie Hjelm",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Johnie Hjelm",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
              <div className="grid grid-cols-2 items-center py-8 text-neutral-700 md:py-16 dark:text-neutral-300">
                <Link href="/" rel="home">
                  <Logo />
                </Link>
                <Navigation />
              </div>
              <main id="main-content">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
        <Toaster richColors />
        <CMD />
        <Script
          data-website-id="12583e8d-e6ac-4653-83f9-a8fd899f03fb"
          defer
          src="https://pulse.hjelm.cloud/script.js"
        />
      </body>
    </html>
  );
}
