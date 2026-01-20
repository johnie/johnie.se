import {
  EnvelopeIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  ThreadsLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  name: string;
  enabled: boolean;
}

export const LINKS: SocialLink[] = [
  {
    href: "mailto:johnie@hjelm.im",
    icon: <EnvelopeIcon size={20} />,
    name: "Email",
    enabled: true,
  },
  {
    href: "https://github.com/johnie",
    icon: <GithubLogoIcon size={20} />,
    name: "Github",
    enabled: true,
  },
  {
    href: "https://linkedin.com/in/johniehjelm",
    icon: <LinkedinLogoIcon size={20} />,
    name: "LinkedIn",
    enabled: true,
  },
  {
    href: "https://instagram.com/johnie",
    icon: <InstagramLogoIcon size={20} />,
    name: "Instagram",
    enabled: true,
  },
  {
    href: "https://threads.net/@johnie",
    icon: <ThreadsLogoIcon size={20} />,
    name: "Threads",
    enabled: true,
  },
];

export const SocialLinks = () => (
  <div className="mt-6 -ml-2 flex items-center gap-1">
    {LINKS.map((link: SocialLink) => (
      <a
        aria-label={link.name}
        className="rounded-[13px] border-none p-2 text-neutral-400 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
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
