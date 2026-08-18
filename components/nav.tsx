"use client";

import {
  BrainIcon,
  HouseIcon,
  PencilSimpleIcon,
  UserIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { useMainStore } from "@/lib/main-store";
import type { NavLink } from "@/lib/types";

export const NAV_LINKS: NavLink[] = [
  {
    enabled: true,
    icon: <HouseIcon size={18} />,
    name: "Home",
    slug: "/",
  },
  {
    enabled: true,
    icon: <UserIcon size={18} />,
    name: "About",
    slug: "/about",
  },
  {
    enabled: true,
    icon: <PencilSimpleIcon size={18} />,
    name: "Writing",
    slug: "/writing",
  },
  {
    enabled: true,
    icon: <BrainIcon size={18} />,
    name: "TIL",
    slug: "/til",
  },
];

const Navigation = () => {
  const { setCmd } = useMainStore();
  let pathname = usePathname() || "/";
  if (pathname.includes("/writing/")) {
    pathname = "/writing";
  }

  const openCommandPalette = useCallback(() => setCmd(true), [setCmd]);

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
                href={slug}
                key={slug}
              >
                <span className="relative px-3 py-1">
                  {slug === pathname ? (
                    <motion.div
                      initial={false}
                      className="dark:bg-muted absolute inset-0 h-full rounded-md bg-neutral-200"
                      layoutId="sidebar"
                      transition={{
                        damping: 30,
                        stiffness: 350,
                        type: "spring",
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
          className="group text-muted-foreground ml-2 hidden cursor-pointer text-sm md:block"
          onClick={openCommandPalette}
          type="button"
        >
          <kbd className="ease bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 transition-colors select-none group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </nav>
    </LayoutGroup>
  );
};

export default Navigation;
