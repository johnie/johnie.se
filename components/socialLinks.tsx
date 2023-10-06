import { LucideGithub, LucideLinkedin, LucideInstagram, LucideMail } from 'lucide-react';

type SocialLink = {
  href: string;
  icon: React.ReactNode;
  name: string;
  enabled: boolean;
};

export const LINKS: SocialLink[] = [
  {
    href: 'mailto:johnie@hjelm.im',
    icon: <LucideMail className="h-[18px] w-[18px] text-current" />,
    name: 'Email',
    enabled: true,
  },
  {
    href: 'https://github.com/johnie',
    icon: <LucideGithub className="h-[18px] w-[18px] text-current" />,
    name: 'Github',
    enabled: true,
  },
  {
    href: 'https://linkedin.com/in/johniehjelm',
    icon: <LucideLinkedin className="h-[18px] w-[18px] text-current" />,
    name: 'LinkedIn',
    enabled: true,
  },
  {
    href: 'https://instagram.com/johnie',
    icon: <LucideInstagram className="h-[18px] w-[18px] text-current" />,
    name: 'Instagram',
    enabled: true,
  },
];

export const SocialLinks = () => {
  return (
    <div className="flex -ml-2 mt-6 items-center">
      {LINKS.map((link: SocialLink) => (
        <a
          key={link.name}
          href={link.href}
          className="p-3 rounded-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-900 border-none text-neutral-400 dark:text-neutral-400"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};
