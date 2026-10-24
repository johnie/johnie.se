import { Link, createFileRoute } from "@tanstack/react-router";

import { OmniLogo } from "@/components/omni-logo";
import { PostList } from "@/components/post-list";
import { Projects } from "@/components/projects";
import { SocialLinks } from "@/components/social-links";
import { WorkExperience } from "@/components/work";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { createPageHead, serializeJsonLd } from "@/lib/metadata";
import { getViewCounts } from "@/lib/views.functions";
import { writing } from "@/lib/writing";

const featuredPosts = writing.posts.filter((post) => post.featured);

const Home = () => {
  const { viewCounts } = Route.useLoaderData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    author: {
      "@type": "Person",
      name: "Johnie Hjelm",
      url: SITE_URL,
    },
    description: SITE_DESCRIPTION,
    name: "Johnie Hjelm",
    url: SITE_URL,
  };

  const jsonLdString = serializeJsonLd(jsonLd);

  return (
    <div>
      <script type="application/ld+json">{jsonLdString}</script>
      <h1 className="mt-1.5 text-xl leading-snug tracking-[-0.01em] text-neutral-700 dark:text-neutral-200">
        I&rsquo;m <span className="font-semibold">Johnie Hjelm</span>, Head of
        Engineering at{" "}
        <a
          className="inline-block transition-opacity hover:opacity-70"
          href="https://omni.se"
          rel="noopener noreferrer"
          target="_blank"
        >
          <OmniLogo className="inline-block h-[0.8em] w-auto align-baseline" />
          <span className="sr-only">Omni</span>
        </a>
        . I build teams, still write code, and think a lot about where the craft
        goes when typing stops being the bottleneck.
      </h1>
      <p className="mt-8 leading-6.25 text-neutral-500 dark:text-neutral-400">
        I started as a high school intern at a Stockholm web agency in 2009,
        doing design and code because I couldn&rsquo;t pick one. I&rsquo;ve
        always hunted for shortcuts: remapped keys, snippets, tools, little
        scripts, anything to keep up with my own brain. I have spinal muscular
        atrophy, and around twenty-five my hands started falling behind, so the
        hunt got serious. Nothing ever fully closed the gap. AI is the first
        tool that finally keeps up with what I want to build.
      </p>
      <p className="mt-8 leading-6.25 text-neutral-500 dark:text-neutral-400">
        I write about leadership, AI, and building when your body changes the
        rules. The{" "}
        <Link
          className="text-neutral-700 underline decoration-neutral-300 underline-offset-2 dark:text-neutral-300 dark:decoration-neutral-600"
          to="/about"
        >
          longer version
        </Link>{" "}
        is on the about page.
      </p>
      <SocialLinks />
      {featuredPosts.length > 0 ? (
        <>
          <h2 className="mt-10 mb-2 font-medium text-neutral-700 dark:text-neutral-200">
            Start Here
          </h2>
          <PostList posts={featuredPosts} viewCounts={viewCounts} />
        </>
      ) : null}
      <h2 className="mt-10 mb-2 font-medium text-neutral-700 dark:text-neutral-200">
        Work
      </h2>
      <WorkExperience />
      <h2 className="mt-10 mb-2 font-medium text-neutral-700 dark:text-neutral-200">
        Projects
      </h2>
      <Projects />
    </div>
  );
};

export const Route = createFileRoute("/")({
  loader: () => ({ viewCounts: getViewCounts() }),
  head: () =>
    createPageHead({
      description:
        "Johnie Hjelm is Head of Engineering at Omni. Writing on engineering leadership, inclusive teams, and AI as assistive technology.",
      path: "/",
      title: "Developer & Engineering Leader",
    }),
  component: Home,
});
