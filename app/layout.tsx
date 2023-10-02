import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Johnie Hjelm - Creative Developer',
  description: 'Committed to developing individuals and teams for success.',
  authors: [{ name: 'Johnie Hjelm', url: 'https://johnie.se' }],
  keywords: 'Johnie, Hjelm, Designer, Developer, Entrepreneur, Crip',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('dark flex', inter.className)}>{children}</body>
    </html>
  );
}
