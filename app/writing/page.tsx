import { allPosts } from "content-collections";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ViewCounter from "@/components/view-counter";
import { getViewsCount } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Read my thoughts on software development, leadership, tech career, and more.",
};

export default async function BlogPage() {
  return (
    <section>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-neutral-100 dark:to-neutral-400">
        Stories. Updates. Guides.
      </h1>
      <p className="mb-8 text-neutral-500 leading-[25px] dark:text-neutral-400">
        Here you&lsquo;ll find all the{" "}
        <span className="text-neutral-900 dark:text-neutral-200">
          {allPosts.length}
        </span>{" "}
        articles on my thoughts on software development, leadership, tech
        career, and more. I&lsquo;ll also share updates on my projects and other
        things I&lsquo;m working on.
      </p>
      <div>
        {allPosts
          .sort((a, b) => {
            if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              className="-mx-4 group ease flex gap-x-4 rounded-[12px] border-none px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
              href={`/writing/${post.slug}`}
              key={post.slug}
            >
              <div className="flex w-full flex-col space-y-1">
                <p className="text-neutral-700 leading-snug tracking-tight dark:text-neutral-300">
                  {post.title}
                </p>
                <div className="flex items-center gap-3 text-neutral-500 text-sm">
                  <p>{format(new Date(post.publishedAt), "dd MMMM, yyyy")}</p>
                  <span>•</span>
                  <p>{post.readingTime}</p>
                  <span>•</span>
                  <Suspense fallback={<p className="h-4" />}>
                    <Views slug={post.slug} />
                  </Suspense>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}

async function Views({ slug }: { slug: string }) {
  const views = await getViewsCount();
  return <ViewCounter allViews={views} slug={slug} />;
}
