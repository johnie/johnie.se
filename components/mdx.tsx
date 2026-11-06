import { Link } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";
import { Suspense } from "react";
import type * as React from "react";
import { z } from "zod";

import { Bio } from "@/components/bio";
import { CONTENT_IMAGE_SIZES } from "@/lib/constants";
import { getMdxComponent } from "@/lib/mdx-modules";
import type { FileRouteTypes } from "@/src/routeTree.gen";

type CustomLinkProps = React.ComponentProps<"a">;

const hrefSchema = z.string();

const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  href,
  ...props
}) => {
  const destination = hrefSchema.safeParse(href);

  if (!destination.success) {
    return children;
  }

  const url = destination.data;

  if (url.startsWith("/")) {
    // SAFETY: MDX supplies runtime paths; the router handles unknown paths as not-found.
    const to = url as FileRouteTypes["to"];

    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (url.startsWith("http")) {
    return (
      <a href={url} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={url} {...props}>
      {children}
    </a>
  );
};

type RoundedImageProps = Omit<React.ComponentProps<"img">, "alt"> & {
  alt: string;
  priority?: boolean;
};

const RoundedImage = ({
  alt,
  priority = false,
  ...props
}: RoundedImageProps) => (
  <img
    alt={alt}
    className="rounded-lg"
    decoding="async"
    fetchPriority={priority ? "high" : undefined}
    loading={priority ? "eager" : "lazy"}
    sizes={CONTENT_IMAGE_SIZES}
    {...props}
  />
);

interface CalloutProps {
  children: React.ReactNode;
  emoji: string;
}

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
    className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text text-3xl font-semibold text-transparent dark:from-neutral-100 dark:to-neutral-300"
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

const components: MDXComponents = {
  Bio,
  Callout,
  Image: RoundedImage,
  a: CustomLink,
  h1: H1,
  h2: H2,
  h3: H3,
  ul: UL,
};

export const Mdx = ({ path }: { path: string }) => {
  const Content = getMdxComponent(path);

  return (
    <Suspense fallback={null}>
      {/* oxlint-disable-next-line react/static-components -- The module registry memoizes lazy component identity by path. */}
      <Content components={components} />
    </Suspense>
  );
};
