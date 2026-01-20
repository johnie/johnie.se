import { allPosts } from "content-collections";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Views } from "@/components/views";
import { groupPostsByYear } from "@/lib/content-utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Thoughts on AI-augmented engineering, leadership, and productivity systems.",
};

export default async function BlogPage() {
  const postsByYear = groupPostsByYear(allPosts);

  return (
    <section>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-neutral-100 dark:to-neutral-400">
        Thoughts. Tools. Leadership.
      </h1>
      <p className="mb-8 text-neutral-500 leading-6.25 dark:text-neutral-400">
        Here you&lsquo;ll find my thoughts on AI-augmented engineering,
        leadership for makers, productivity systems, and the occasional personal
        reflection. With 15+ years in tech, I write about what actually works,
        and what I&lsquo;m still figuring out.
      </p>
      <div>
        {postsByYear.map(([year, posts]) => (
          <div key={year}>
            <div className="pt-8 pb-2 first:pt-0">
              <span className="font-medium text-neutral-400 text-sm dark:text-neutral-500">
                {year}
              </span>
            </div>
            {posts.map((post) => (
              <Link
                className="group ease -mx-4 flex gap-x-4 rounded-xl border-none px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
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
        ))}
      </div>
    </section>
  );
}
