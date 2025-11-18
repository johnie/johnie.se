import "./globals.css";
import { OpenPanelComponent } from "@openpanel/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { CMD } from "@/components/cmd";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Navigation from "@/components/nav";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://johnie.se"),
  title: {
    default: "Johnie Hjelm",
    template: "%s | Johnie Hjelm",
  },
  description: "Committed to developing individuals and teams for success.",
  authors: [{ name: "Johnie Hjelm", url: "https://johnie.se" }],
  keywords: "Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip",
  openGraph: {
    title: "Johnie Hjelm",
    description: "Committed to developing individuals and teams for success.",
    url: "https://johnie.se",
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
    <html lang="en">
      <body className={cn("antialiased", inter.className)}>
        <div className="mx-auto w-full px-4 text-neutral-700 md:max-w-[680px] dark:text-neutral-300">
          <div>
            <div className="flex min-h-dvh w-full flex-col justify-between">
              <div className="grid grid-cols-2 items-center py-8 text-neutral-700 md:py-16 dark:text-neutral-300">
                <Link href="/" rel="home">
                  <Logo />
                </Link>
                <Navigation />
              </div>
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </div>
        <Toaster richColors />
        <CMD />
        <OpenPanelComponent
          clientId={env.OPENPANEL_CLIENT_ID}
          trackAttributes={true}
          trackOutgoingLinks={true}
          trackScreenViews={true}
        />
      </body>
    </html>
  );
}
