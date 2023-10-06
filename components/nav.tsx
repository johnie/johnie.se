'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGroup, motion } from 'framer-motion';
import { useMainStore } from '@/lib/mainStore';

import { ReactNode } from 'react';
import { LucideHome, LucideUser, LucidePen } from 'lucide-react';

type NavLink = {
  name: string;
  href: string;
  icon?: ReactNode;
  enabled?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  {
    name: 'Home',
    href: '/',
    icon: <LucideHome className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
  {
    name: 'About',
    href: '/about',
    icon: <LucideUser className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
  {
    name: 'Writing',
    href: '/writing',
    icon: <LucidePen className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
  {
    name: 'Uses',
    href: '/uses',
    icon: <LucidePen className="h-[18px] w-[18px] text-current" />,
    enabled: false,
  },
];

export default function Navigation() {
  const { setCmd } = useMainStore();
  let pathname = usePathname() || '/';
  if (pathname.includes('/writing/')) {
    pathname = '/writing';
  }

  return (
    <LayoutGroup>
      <nav className="flex flex-row items-center justify-end relative px-0 pb-0 fade md:relative" role="navigation">
        <div className="flex flex-row space-x-0">
          {NAV_LINKS.filter((i) => Boolean(i.enabled)).map(({ href, name }) => {
            const isActive = href === pathname;
            return (
              <Link
                key={href}
                href={href}
                className={clsx('transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle ease', {
                  'text-neutral-500 dark:text-neutral-400': !isActive,
                })}
              >
                <span className="relative py-1 px-2 mx-2">
                  {name}
                  {href === pathname ? (
                    <motion.div
                      className="absolute h-[2px] top-7 mx-2 inset-0 bg-neutral-800 dark:bg-neutral-200"
                      layoutId="sidebar"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  ) : null}
                </span>
              </Link>
            );
          })}
        </div>
        <button className="text-sm text-muted-foreground ml-2 mt-2 cursor-pointer group" onClick={() => setCmd(true)}>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:bg-neutral-300 group-hover:dark:bg-neutral-700 transition-colors ease">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </nav>
    </LayoutGroup>
  );
}
