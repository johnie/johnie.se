import { LatestWriting } from "@/components/latest-writing";
import { Projects } from "@/components/projects";
import { SocialLinks } from "@/components/social-links";
import { WorkExperience } from "@/components/work";

export default function Home() {
  return (
    <div>
      <h1 className="mt-[6px]">
        <span className="font-semibold">Johnie Hjelm</span> is committed to
        developing individuals and teams for success.
      </h1>
      <p className="mt-8 text-neutral-500 leading-[25px] dark:text-neutral-400">
        Since my teenage years, I have engaged in both design and coding,
        unwilling to be confined to just one specialty. I have excelled as a
        Jack of all Trades across different teams, engaging in a wide range of
        tasks from graphic and digital design to both frontend and backend
        development, along with product and API strategy.
      </p>
      <p className="mt-8 text-neutral-500 leading-[25px] dark:text-neutral-400">
        In addition to technology, I have a strong enthusiasm for efficient team
        management and intelligent work habits. I think a team&lsquo;s wellness
        is crucial for effective operations, and although ideas inspire
        innovation, it&lsquo;s the execution that leads to success.
      </p>
      <SocialLinks />
      <h3 className="mt-10 mb-2 text-neutral-700 text-xl dark:text-neutral-200">
        Latest Writing
      </h3>
      <LatestWriting />
      <h3 className="mt-10 mb-2 text-neutral-700 text-xl dark:text-neutral-200">
        Work
      </h3>
      <WorkExperience />
      <h3 className="mt-10 mb-2 text-neutral-700 text-xl dark:text-neutral-200">
        Projects
      </h3>
      <Projects />
    </div>
  );
}
