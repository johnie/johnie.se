import { allPages } from '@/.contentlayer/generated';
import { Mdx } from '@/components/mdx';

const Uses = () => {
  const usesPage = allPages.find((page) => page._raw.flattenedPath === 'page/uses');
  return (
    <div>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        Tools. Apps. Gear.
      </h1>
      <p className="leading-[25px] mb-8 text-neutral-500 dark:text-neutral-400">
        This is a list of all the <span className="text-neutral-200">tools, apps, and gear</span> I use to do my work. This not a static page, it&lsquo;s a{' '}
        <span className="text-neutral-200">living document</span> with everything that I&lsquo;m using nowadays.
      </p>
      <Mdx code={usesPage?.body.code as string} />
    </div>
  );
};

export default Uses;
