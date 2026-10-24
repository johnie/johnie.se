import {
  BrainIcon,
  HouseIcon,
  PencilSimpleIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { Link, useLocation } from "@tanstack/react-router";
import { clsx } from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import { useCallback } from "react";
import type { MouseEvent } from "react";

import { preloadCommandPalette } from "@/components/cmd-loader";
import { openCmdFrom } from "@/lib/main-store";
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
  let pathname = useLocation({ select: (location) => location.pathname });

  if (pathname.includes("/writing/")) {
    pathname = "/writing";
  }

  const openCommandPalette = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      openCmdFrom({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    },
    []
  );

  return (
    <LayoutGroup>
      <nav className="relative flex flex-row items-center justify-end">
        <div className="flex flex-row space-x-2 rounded-lg bg-neutral-50 p-1 text-sm dark:bg-black">
          {NAV_LINKS.map(({ enabled, slug, name }) => {
            if (!enabled) {
              return null;
            }

            const isActive = slug === pathname;

            return (
              <Link
                className={clsx(
                  "relative flex align-middle transition-[color,scale] duration-150 before:absolute before:inset-x-0 before:-inset-y-2 active:scale-[0.96] active:duration-0",
                  {
                    "text-muted-foreground dark:text-muted-foreground active:text-neutral-200":
                      !isActive,
                  }
                )}
                to={slug}
                key={slug}
              >
                <span className="relative px-3 py-1">
                  {slug === pathname ? (
                    <motion.div
                      initial={false}
                      className="dark:bg-muted absolute inset-0 h-full rounded-md bg-neutral-200"
                      layoutId="sidebar"
                      transition={{ bounce: 0, duration: 0.35, type: "spring" }}
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
          className="group text-muted-foreground ml-2 hidden cursor-pointer text-sm transition-[scale] duration-150 active:scale-[0.94] active:duration-0 md:block"
          onClick={openCommandPalette}
          onFocus={preloadCommandPalette}
          onPointerEnter={preloadCommandPalette}
          type="button"
        >
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 transition-colors select-none group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </nav>
    </LayoutGroup>
  );
};

export default Navigation;
