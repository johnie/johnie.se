import { useNavigate } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useRef } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/command-palette/command";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export interface PaletteProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  origin: { x: number; y: number } | null;
}

const originStyle = (
  origin: PaletteProps["origin"]
): CSSProperties | undefined =>
  origin
    ? {
        transformOrigin: `calc(50% + ${origin.x - window.innerWidth / 2}px) calc(50% + ${origin.y - window.innerHeight / 2}px)`,
      }
    : undefined;

const goTo = (href: string) => {
  if (href.startsWith("mailto:")) {
    window.location.href = href;
  } else {
    window.open(href, "_blank", "noopener,noreferrer");
  }
};

export const Palette = ({ onOpenChange, open, origin }: PaletteProps) => {
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
        // Radix invokes this before focus moves into the dialog.
        previousFocus.current = document.activeElement;
      }}
      onOpenChange={onOpenChange}
      open={open}
      style={originStyle(origin)}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAV_LINKS.map(({ slug, name, icon }) => (
            <CommandItem
              key={slug}
              onSelect={() => {
                void navigate({ to: slug });
                onOpenChange(false);
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
          {SOCIAL_LINKS.map(({ href, name, icon }) => (
            <CommandItem
              key={href}
              onSelect={() => {
                goTo(href);
                onOpenChange(false);
              }}
              value={href}
            >
              {icon}
              <span className="ml-2">{name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
