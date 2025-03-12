import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import Image, { ImageProps } from 'next/image';
import { useMDXComponent } from '@content-collections/mdx/react';
import type { MDXComponents } from 'mdx/types';
import { Bio } from '@/components/bio';
import { Badge } from './ui/badge';

type CustomLinkProps = LinkProps & {
  href: string;
  children?: React.ReactNode;
};

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
};

const RoundedImage: React.FC<CustomImageProps> = ({ alt, ...props }) => {
  return <Image alt={alt} className="rounded-lg" {...props} />;
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
};

const H1: React.FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <h1
      className="text-3xl bg-clip-text text-transparent bg-linear-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8"
      {...props}
    >
      {children}
    </h1>
  );
};

const H2: React.FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <h2
      className="text-xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200"
      {...props}
    >
      {children}
    </h2>
  );
};

const H3: React.FC<HeadingProps> = ({ children, ...props }) => {
  return (
    <h3
      className="mt-10 text-xl text-neutral-800 dark:text-neutral-200 mb-2"
      {...props}
    >
      {children}
    </h3>
  );
};

type ProsCardProps = {
  title: string;
  pros: string[];
};

function ProsCard({ title, pros }: ProsCardProps) {
  return (
    <div className="border border-emerald-200 dark:border-emerald-900 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 my-4 w-full">
      <span>{`You might use ${title} if...`}</span>
      <div className="mt-4">
        {pros.map((pro) => (
          <div key={pro} className="flex font-medium items-baseline mb-2">
            <div className="h-4 w-4 mr-2">
              <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
}

type ConsCardProps = {
  title: string;
  cons: string[];
};

function ConsCard({ title, cons }: ConsCardProps) {
  return (
    <div className="border border-red-200 dark:border-red-900 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 my-6 w-full">
      <span>{`You might not use ${title} if...`}</span>
      <div className="mt-4">
        {cons.map((con) => (
          <div key={con} className="flex font-medium items-baseline mb-2">
            <div className="h-4 w-4 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-red-500"
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
}

const components = {
  Image: RoundedImage,
  a: CustomLink,
  Callout,
  h1: H1,
  h2: H2,
  h3: H3,
  ProsCard,
  ConsCard,
  Bio,
  Badge,
};

export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code);

  return <Component components={components as MDXComponents} />;
}
