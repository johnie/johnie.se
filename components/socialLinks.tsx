import {
  LucideGithub,
  LucideLinkedin,
  LucideInstagram,
  LucideMail,
} from 'lucide-react';

type SocialLink = {
  href: string;
  icon: React.ReactNode;
  name: string;
  enabled: boolean;
};

const Bsky = () => (
  <svg width="18px" height="15.9px" viewBox="0 0 600 530">
    <path
      d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
      stroke="currentColor"
      strokeWidth="52"
      fill="none"
    />
  </svg>
);

export const LINKS: SocialLink[] = [
  {
    href: 'mailto:johnie@hjelm.im',
    icon: <LucideMail className="h-[18px] w-[18px]" />,
    name: 'Email',
    enabled: true,
  },
  {
    href: 'https://github.com/johnie',
    icon: <LucideGithub className="h-[18px] w-[18px]" />,
    name: 'Github',
    enabled: true,
  },
  {
    href: 'https://linkedin.com/in/johniehjelm',
    icon: <LucideLinkedin className="h-[18px] w-[18px]" />,
    name: 'LinkedIn',
    enabled: true,
  },
  {
    href: 'https://instagram.com/johnie',
    icon: <LucideInstagram className="h-[18px] w-[18px]" />,
    name: 'Instagram',
    enabled: true,
  },
  {
    href: 'https://bsky.app/profile/johnie.se',
    icon: <Bsky />,
    name: 'Bluesky',
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
