import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useRef } from "react";

import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export interface PaletteProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  origin: { x: number; y: number } | null;
}

type CommandItem = (typeof NAV_LINKS)[number] | (typeof SOCIAL_LINKS)[number];

const COMMAND_GROUPS: { value: string; items: readonly CommandItem[] }[] = [
  { value: "Navigation", items: NAV_LINKS },
  { value: "External links", items: SOCIAL_LINKS },
];

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { contains } = Autocomplete.useFilter();

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop className="bg-background/80 data-open:animate-overlay-in data-closed:animate-overlay-out reduced-transparency:bg-background/95 reduced-transparency:backdrop-blur-none fixed inset-0 z-50 backdrop-blur-xs" />
        <Dialog.Popup
          className="bg-background data-open:animate-dialog-in data-closed:animate-dialog-out fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-hidden border p-0 shadow-lg sm:rounded-lg md:w-full"
          initialFocus={inputRef}
          style={originStyle(origin)}
        >
          <Dialog.Title className="sr-only">Commands</Dialog.Title>
          <Autocomplete.Root
            autoHighlight="always"
            filter={(item, query) =>
              contains(item.name, query) ||
              contains("slug" in item ? item.slug : item.href, query)
            }
            inline
            items={COMMAND_GROUPS}
            itemToStringValue={(item) => item.name}
            keepHighlight
            open
          >
            <div className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
              <div className="flex items-center border-b px-3">
                <MagnifyingGlassIcon className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                <Autocomplete.Input
                  aria-label="Search commands"
                  className="placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 pr-8 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type a command or search..."
                  ref={inputRef}
                />
              </div>
              <Autocomplete.Empty>
                <div className="py-6 text-center text-sm">
                  No results found.
                </div>
              </Autocomplete.Empty>
              <Autocomplete.List className="max-h-[380px] overflow-x-hidden overflow-y-auto outline-hidden">
                {(group: (typeof COMMAND_GROUPS)[number]) => (
                  <Autocomplete.Group
                    className="text-foreground overflow-hidden p-1 px-2 [&+&]:border-t [&+&]:pt-0"
                    items={group.items}
                    key={group.value}
                  >
                    <Autocomplete.GroupLabel className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                      {group.value}
                    </Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {(item: CommandItem) => (
                        <Autocomplete.Item
                          className="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-3 text-sm outline-hidden select-none [&_svg]:h-5 [&_svg]:w-5"
                          key={"slug" in item ? item.slug : item.href}
                          onClick={() => {
                            if ("slug" in item) {
                              void navigate({ to: item.slug });
                            } else {
                              goTo(item.href);
                            }

                            onOpenChange(false);
                          }}
                          value={item}
                        >
                          {item.icon}
                          <span className="ml-2">{item.name}</span>
                        </Autocomplete.Item>
                      )}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                )}
              </Autocomplete.List>
            </div>
          </Autocomplete.Root>
          <Dialog.Close className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon size={16} />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
