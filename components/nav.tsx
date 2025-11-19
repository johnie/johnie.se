"use client";

import clsx from "clsx";
import { type HTMLMotionProps, LayoutGroup, motion } from "framer-motion";
import { LucideBrain, LucideHome, LucidePen, LucideUser } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import type { ReactNode } from "react";
import { useMainStore } from "@/lib/main-store";

type NavLink = {
  name: string;
  slug: string;
  icon?: ReactNode;
  enabled?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  {
    name: "Home",
    slug: "/",
    icon: <LucideHome className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
  {
    name: "About",
    slug: "/about",
    icon: <LucideUser className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
  {
    name: "Writing",
    slug: "/writing",
    icon: <LucidePen className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
  {
    name: "TIL",
    slug: "/til",
    icon: <LucideBrain className="h-[18px] w-[18px] text-current" />,
    enabled: true,
  },
];

export default function Navigation() {
  const { setCmd } = useMainStore();
  let pathname = usePathname() || "/";
  if (pathname.includes("/writing/")) {
    pathname = "/writing";
  }

  return (
    <LayoutGroup>
      <nav className="fade relative flex flex-row items-center justify-end px-0 pb-0 md:relative">
        <div className="flex flex-row space-x-2 rounded-lg bg-neutral-50 p-1 text-sm dark:bg-black">
          {NAV_LINKS.filter((i) => Boolean(i.enabled)).map(({ slug, name }) => {
            const isActive = slug === pathname;
            return (
              <Link
                className={clsx("ease flex align-middle transition-all", {
                  "text-muted-foreground dark:text-muted-foreground": !isActive,
                })}
                href={`${slug}` as LinkProps<"/">["href"]}
                key={slug}
              >
                <span className="relative px-3 py-1">
                  {slug === pathname ? (
                    <motion.div
                      initial={false}
                      {...({
                        className:
                          "absolute h-full inset-0 bg-neutral-200 dark:bg-muted rounded-md",
                      } as HTMLMotionProps<"div">)}
                      layoutId="sidebar"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  <span className="relative z-1">{name}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <button
          aria-label="Open command palette (⌘K)"
          className="group ml-2 hidden cursor-pointer text-muted-foreground text-sm md:block"
          onClick={() => setCmd(true)}
          type="button"
        >
          <kbd className="ease pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100 transition-colors group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </nav>
    </LayoutGroup>
  );
}
