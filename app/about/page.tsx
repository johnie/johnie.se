import type { Metadata } from 'next';
import { allPages } from '@/.content-collections/generated';
import { Mdx } from '@/components/mdx';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description: 'Committed to developing individuals and teams for success.',
};

const About = () => {
  const content = allPages.find((page) => page._meta.path === 'about');

  return (
    <div>
      <h1 className="text-3xl bg-clip-text text-transparent bg-linear-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        {content?.title}
      </h1>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <div className="float-left w-full md:w-1/3 mr-0 md:mr-4 mb-4 md:mb-0">
          <Image
            alt="Johnie"
            src="/images/johnie.jpg"
            width={400}
            height={400}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
            className="rounded w-full h-auto"
            priority
          />
        </div>
        <Mdx code={content?.mdx as string} />
      </article>
    </div>
  );
};

export default About;
