"use client";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { NAV_LINKS as navLinks } from "@/components/nav";
import { LINKS as socialLinks } from "@/components/social-links";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useMainStore } from "@/lib/main-store";

const isInternalRoute = (slug: string): slug is Route => slug.startsWith("/");

export const Cmd = () => {
  const { toggleCmd, isCmdOpen, setCmd } = useMainStore();
  const { push } = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCmd();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCmd]);

  const goTo = (slug: string) => {
    if (slug.startsWith("mailto:")) {
      window.location.href = slug;
      setCmd(false);
      return;
    }

    if (isInternalRoute(slug)) {
      push(slug);
      setCmd(false);
      return;
    }

    if (slug.startsWith("http") || slug.startsWith("//")) {
      window.open(slug, "_blank", "noopener,noreferrer");
      setCmd(false);
    }
  };

  return (
    <CommandDialog onOpenChange={setCmd} open={isCmdOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navLinks
            .filter((i) => Boolean(i.enabled))
            .map(({ slug, name, icon }) => (
              <CommandItem key={slug} onSelect={goTo} value={slug}>
                {icon}
                <span className="ml-2">{name}</span>
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="External links">
          {socialLinks
            .filter((i) => Boolean(i.enabled))
            .map(({ href, name, icon }) => (
              <CommandItem key={href} onSelect={goTo} value={href}>
                {icon}
                <span className="ml-2">{name}</span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
