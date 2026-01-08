import { useNavigate } from "@tanstack/react-router";
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

export const CMD = () => {
  const { toggleCmd, isCmdOpen, setCmd } = useMainStore();
  const navigate = useNavigate();

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
    if (typeof slug === "string" && slug.startsWith("/")) {
      navigate({ to: slug });
      setCmd(false);
    }

    if (
      typeof slug === "string" &&
      (slug.startsWith("http") || slug.startsWith("//"))
    ) {
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
              <CommandItem key={slug} onSelect={() => goTo(slug)} value={slug}>
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
              <CommandItem key={href} onSelect={() => goTo(href)} value={href}>
                {icon}
                <span className="ml-2">{name}</span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
