import * as React from 'react';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { useMDXComponent } from 'next-contentlayer/hooks';
import type { MDXComponents } from 'mdx/types';

interface CustomLinkProps {
  href: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CustomLink: React.FC<CustomLinkProps> = (props) => {
  const href = props.href;

  if (href.startsWith('/')) {
    return <Link {...props}>{props.children}</Link>;
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

type CustomImageProps = ImageProps & {
  alt: string;
  [key: string]: any;
};

const RoundedImage: React.FC<CustomImageProps> = ({ alt, ...props }) => {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
};

interface CalloutProps {
  emoji: string;
  children: React.ReactNode;
}

const Callout: React.FC<CalloutProps> = ({ emoji, children }) => {
  return (
    <div className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded p-1 text-sm flex items-center text-neutral-900 dark:text-neutral-100 mb-8">
      <div className="flex items-center w-4 mr-4">{emoji}</div>
      <div className="w-full callout">{children}</div>
    </div>
  );
};

type HeadingProps = {
  children: React.ReactNode;
  [key: string]: any;
};

const H1: React.FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <h1
      className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8"
      {...props}
    >
      {children}
    </h1>
  );
};

const H2: React.FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200" {...props}>
      {children}
    </h2>
  );
};

const H3: React.FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <h3 className="mt-10 text-xl text-neutral-800 dark:text-neutral-200 mb-2" {...props}>
      {children}
    </h3>
  );
};

const components = {
  Image: RoundedImage,
  a: CustomLink,
  Callout,
  h1: H1,
  h2: H2,
  h3: H3,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
      <Component components={components as MDXComponents} />
    </article>
  );
}
