import { useNavigate } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useRef } from "react";

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
import { setCmd, useMainStore } from "@/lib/main-store";
import type { ViewportPoint } from "@/lib/main-store";

// The dialog is centred in the viewport, so its own centre is the viewport
// centre; offsetting from 50% anchors the scale to the trigger.
const originStyle = (
  origin: ViewportPoint | null
): CSSProperties | undefined =>
  origin
    ? {
        transformOrigin: `calc(50% + ${origin.x - window.innerWidth / 2}px) calc(50% + ${origin.y - window.innerHeight / 2}px)`,
      }
    : undefined;

const goTo = (slug: string) => {
  if (slug.startsWith("mailto:")) {
    window.location.href = slug;
    setCmd(false);

    return;
  }

  if (slug.startsWith("http") || slug.startsWith("//")) {
    window.open(slug, "_blank", "noopener,noreferrer");
    setCmd(false);
  }
};

export const Cmd = () => {
  const isCmdOpen = useMainStore((state) => state.isCmdOpen);
  const cmdOrigin = useMainStore((state) => state.cmdOrigin);
  const navigate = useNavigate();
  const previousFocus = useRef<Element | null>(null);

  return (
    <CommandDialog
      onCloseAutoFocus={(event) => {
        event.preventDefault();

        if (previousFocus.current instanceof HTMLElement) {
          previousFocus.current.focus();
        }
      }}
      onOpenAutoFocus={() => {
        // Runs before focus moves into the dialog, so this is the opener.
        previousFocus.current = document.activeElement;
      }}
      onOpenChange={setCmd}
      open={isCmdOpen}
      style={originStyle(cmdOrigin)}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navLinks
            .filter((i) => Boolean(i.enabled))
            .map(({ slug, name, icon }) => (
              <CommandItem
                key={slug}
                onSelect={() => {
                  void navigate({ to: slug });
                  setCmd(false);
                }}
                value={slug}
              >
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
