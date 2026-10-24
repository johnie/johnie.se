import {
  EnvelopeIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  ThreadsLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

import type { SocialLink } from "@/lib/types";

export const LINKS: SocialLink[] = [
  {
    enabled: true,
    href: "mailto:johnie@hjelm.im",
    icon: <EnvelopeIcon size={20} />,
    name: "Email",
  },
  {
    enabled: true,
    href: "https://github.com/johnie",
    icon: <GithubLogoIcon size={20} />,
    name: "Github",
  },
  {
    enabled: true,
    href: "https://linkedin.com/in/johniehjelm",
    icon: <LinkedinLogoIcon size={20} />,
    name: "LinkedIn",
  },
  {
    enabled: true,
    href: "https://instagram.com/johnie",
    icon: <InstagramLogoIcon size={20} />,
    name: "Instagram",
  },
  {
    enabled: true,
    href: "https://threads.net/@johnie",
    icon: <ThreadsLogoIcon size={20} />,
    name: "Threads",
  },
];

export const SocialLinks = () => (
  <div className="mt-6 -ml-3 flex items-center">
    {LINKS.map((link: SocialLink) => (
      <a
        aria-label={link.name}
        className="rounded-[13px] border-none p-3 text-neutral-400 transition-[background-color,scale] duration-150 hover:bg-neutral-50 active:scale-[0.92] active:bg-neutral-100 active:duration-0 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:active:bg-neutral-800"
        href={link.href}
        key={link.name}
        rel="noopener noreferrer"
        target="_blank"
      >
        {link.icon}
      </a>
    ))}
  </div>
);
