import {
  EnvelopeIcon,
  GithubLogoIcon,
  HouseIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  PencilSimpleIcon,
  ThreadsLogoIcon,
  ToolboxIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

import type { FileRouteTypes } from "@/src/routeTree.gen";

interface NavigationLink {
  icon: ReactNode;
  name: string;
  slug: FileRouteTypes["to"];
}

interface SocialLink {
  href: string;
  icon: ReactNode;
  name: string;
}

export const NAV_LINKS: readonly NavigationLink[] = [
  { icon: <HouseIcon size={18} />, name: "Home", slug: "/" },
  { icon: <UserIcon size={18} />, name: "About", slug: "/about" },
  { icon: <PencilSimpleIcon size={18} />, name: "Writing", slug: "/writing" },
  { icon: <ToolboxIcon size={18} />, name: "Uses", slug: "/uses" },
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: "mailto:johnie@hjelm.im",
    icon: <EnvelopeIcon size={20} />,
    name: "Email",
  },
  {
    href: "https://github.com/johnie",
    icon: <GithubLogoIcon size={20} />,
    name: "Github",
  },
  {
    href: "https://linkedin.com/in/johniehjelm",
    icon: <LinkedinLogoIcon size={20} />,
    name: "LinkedIn",
  },
  {
    href: "https://instagram.com/johnie",
    icon: <InstagramLogoIcon size={20} />,
    name: "Instagram",
  },
  {
    href: "https://threads.net/@johnie",
    icon: <ThreadsLogoIcon size={20} />,
    name: "Threads",
  },
];
