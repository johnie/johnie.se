import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import Navigation from '@/components/nav';
import { Footer } from '@/components/footer';
import { CMD } from '@/components/cmd';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://johnie.se'),
  title: {
    default: 'Johnie Hjelm',
    template: '%s | Johnie Hjelm',
  },
  description: 'Committed to developing individuals and teams for success.',
  authors: [{ name: 'Johnie Hjelm', url: 'https://johnie.se' }],
  keywords: 'Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip',
  openGraph: {
    title: 'Johnie Hjelm',
    description: 'Committed to developing individuals and teams for success.',
    url: 'https://johnie.se',
    siteName: 'Johnie Hjelm',
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Johnie Hjelm',
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('flex', inter.className)}>
        <div className="mx-auto w-full md:max-w-[680px] text-neutral-700 dark:text-neutral-300 px-4">
          <div>
            <div className="flex flex-col w-full">
              <div className="py-8 md:py-16 grid grid-cols-2 items-center text-neutral-700 dark:text-neutral-300">
                <Link href="/" rel="home">
                  <Logo fill="currentColor" />
                </Link>
                <Navigation />
              </div>
              <main role="main">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
        <Toaster richColors />
        <CMD />
        <Analytics />
      </body>
    </html>
  );
}
