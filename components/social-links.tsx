import { SOCIAL_LINKS } from "@/lib/site-links";

export const SocialLinks = () => (
  <div className="mt-6 -ml-3 flex items-center">
    {SOCIAL_LINKS.map((link) => (
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
