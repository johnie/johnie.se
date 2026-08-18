import { useMDXComponent } from "@content-collections/mdx/react";
import type { MDXComponents } from "mdx/types";
import type { Route } from "next";
import Image from "next/image";
import type { ImageProps } from "next/image";
import Link from "next/link";
import { createElement } from "react";
import type * as React from "react";
import { z } from "zod";

import { Bio } from "@/components/bio";
import type { CalloutProps } from "@/lib/types";

import { Badge } from "./ui/badge";

type CustomLinkProps = React.ComponentProps<typeof Link> & {
  children?: React.ReactNode;
} & React.ComponentProps<"a">;

const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  href,
  ...props
}) => {
  const parsedHref = z.string().safeParse(href);

  if (!parsedHref.success) {
    return children;
  }

  const linkHref = parsedHref.data;

  if (linkHref.startsWith("/")) {
    // SAFETY: MDX links are validated absolute paths; Next cannot infer content-derived routes.
    const route = linkHref as Route;

    return (
      <Link href={route} {...props}>
        {children}
      </Link>
    );
  }

  if (linkHref.startsWith("#")) {
    return (
      <a href={linkHref} {...props}>
        {children}
      </a>
    );
  }

  if (linkHref.startsWith("http")) {
    return (
      <a href={linkHref} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={linkHref} {...props}>
      {children}
    </a>
  );
};

type CustomImageProps = ImageProps & {
  alt: string;
};

const RoundedImage: React.FC<CustomImageProps> = ({ alt, ...props }) => (
  <Image alt={alt} className="rounded-lg" {...props} />
);

const Callout: React.FC<CalloutProps> = ({ emoji, children }) => (
  <div className="mb-8 flex items-center rounded border border-neutral-200 bg-neutral-50 p-1 px-4 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
    <div className="mr-4 flex w-4 items-center">{emoji}</div>
    <div className="callout w-full">{children}</div>
  </div>
);

interface HeadingProps {
  children: React.ReactNode;
}

const H1: React.FC<HeadingProps> = ({ children, ...props }) => (
  <h1
    className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-400"
    {...props}
  >
    {children}
  </h1>
);

const H2: React.FC<HeadingProps> = ({ children, ...props }) => (
  <h2
    className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200"
    {...props}
  >
    {children}
  </h2>
);

const H3: React.FC<HeadingProps> = ({ children, ...props }) => (
  <h3
    className="scroll-m-20 text-lg font-semibold tracking-tight text-neutral-800 dark:text-neutral-200"
    {...props}
  >
    {children}
  </h3>
);

const UL = (props: React.ComponentProps<"ul">) => (
  <ul className="my-6 list-disc [&>li]:mt-2" {...props} />
);

interface ProsCardProps {
  pros: string[];
  title: string;
}

const ProsCard = ({ title, pros }: ProsCardProps) => (
  <div className="my-4 w-full rounded-xl border border-emerald-200 bg-neutral-50 p-6 dark:border-emerald-900 dark:bg-neutral-900">
    <span>{`You might use ${title} if...`}</span>
    <div className="mt-4">
      {pros.map((pro) => (
        <div className="mb-2 flex items-baseline font-medium" key={pro}>
          <div className="mr-2 h-4 w-4">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-emerald-500"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </g>
            </svg>
          </div>
          <span>{pro}</span>
        </div>
      ))}
    </div>
  </div>
);

interface ConsCardProps {
  cons: string[];
  title: string;
}

const ConsCard = ({ title, cons }: ConsCardProps) => (
  <div className="my-6 w-full rounded-xl border border-red-200 bg-neutral-50 p-6 dark:border-red-900 dark:bg-neutral-900">
    <span>{`You might not use ${title} if...`}</span>
    <div className="mt-4">
      {cons.map((con) => (
        <div className="mb-2 flex items-baseline font-medium" key={con}>
          <div className="mr-2 h-4 w-4">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </div>
          <span>{con}</span>
        </div>
      ))}
    </div>
  </div>
);

const components: MDXComponents = {
  Badge,
  Bio,
  Callout,
  ConsCard,
  Image: RoundedImage,
  ProsCard,
  a: CustomLink,
  h1: H1,
  h2: H2,
  h3: H3,
  ul: UL,
};

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return createElement(Component, { components });
};
