import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { format } from "date-fns";
import { Suspense } from "react";
import { Views } from "@/components/views";
import { sortPostsByDate } from "@/lib/content-utils";

export const Route = createFileRoute("/writing/")({
  head: () => ({
    meta: [
      { title: "Writing | Johnie Hjelm" },
      {
        name: "description",
        content:
          "Read my thoughts on software development, leadership, tech career, and more.",
      },
    ],
  }),
  component: WritingPage,
});

function WritingPage() {
  return (
    <section>
      <h1 className="mb-8 bg-linear-to-r from-neutral-800 to-neutral-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-neutral-100 dark:to-neutral-400">
        Stories. Updates. Guides.
      </h1>
      <p className="mb-8 text-neutral-500 leading-6.25 dark:text-neutral-400">
        Here you&lsquo;ll find all the{" "}
        <span className="text-neutral-900 dark:text-neutral-200">
          {allPosts.length}
        </span>{" "}
        articles on my thoughts on software development, leadership, tech
        career, and more. I&lsquo;ll also share updates on my projects and other
        things I&lsquo;m working on.
      </p>
      <div>
        {sortPostsByDate(allPosts).map((post) => (
          <Link
            className="group ease -mx-4 flex gap-x-4 rounded-xl border-none px-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
            key={post.slug}
            to={`/writing/${post.slug}`}
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
