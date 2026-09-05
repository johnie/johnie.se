import { LatestWriting } from "@/components/latest-writing";
import { Projects } from "@/components/projects";
import { SocialLinks } from "@/components/social-links";
import { WorkExperience } from "@/components/work";
import { SITE_URL } from "@/lib/constants";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  description:
    "Developer, engineering leader, and inclusive tech advocate. Read Johnie Hjelm's writing on AI, team leadership, and productivity, and explore his work.",
  path: "/",
  title: "Developer & Engineering Leader",
});

const Home = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    author: {
      "@type": "Person",
      name: "Johnie Hjelm",
      url: SITE_URL,
    },
    description: "Committed to developing individuals and teams for success.",
    name: "Johnie Hjelm",
    url: SITE_URL,
  };
  const jsonLdString = JSON.stringify(jsonLd).replaceAll("<", "\\u003c");

  return (
    <div>
      <script type="application/ld+json">{jsonLdString}</script>
      <h1 className="mt-1.5">
        <span className="font-semibold">Johnie Hjelm</span> is committed to
        developing individuals and teams for success.
      </h1>
      <p className="mt-8 leading-6.25 text-neutral-500 dark:text-neutral-400">
        Since my teenage years, I have engaged in both design and coding,
        unwilling to be confined to just one specialty. I have excelled as a
        Jack of all Trades across different teams, engaging in a wide range of
        tasks from graphic and digital design to both frontend and backend
        development, along with product and API strategy.
      </p>
      <p className="mt-8 leading-6.25 text-neutral-500 dark:text-neutral-400">
        In addition to technology, I have a strong enthusiasm for efficient team
        management and intelligent work habits. I think a team&lsquo;s wellness
        is crucial for effective operations, and although ideas inspire
        innovation, it&lsquo;s the execution that leads to success.
      </p>
      <SocialLinks />
      <h2 className="mt-10 mb-2 text-xl text-neutral-700 dark:text-neutral-200">
        Latest Writing
      </h2>
      <LatestWriting />
      <h2 className="mt-10 mb-2 text-xl text-neutral-700 dark:text-neutral-200">
        Work
      </h2>
      <WorkExperience />
      <h2 className="mt-10 mb-2 text-xl text-neutral-700 dark:text-neutral-200">
        Projects
      </h2>
      <Projects />
    </div>
  );
};

export default Home;
