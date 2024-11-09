import { allWorks, allProjects, allPosts } from 'content-collections';
import { WorkExperience } from '@/components/work';
import { Projects } from '@/components/projects';
import { SocialLinks } from '@/components/socialLinks';
import { LatestWriting } from '@/components/latestWriting';

export default function Home() {
  return (
    <div>
      <h1 className="mt-[6px]">
        <span className="font-semibold">Johnie Hjelm</span> is committed to
        developing individuals and teams for success.
      </h1>
      <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
        Since my teenage years, I have engaged in both design and coding,
        unwilling to be confined to just one specialty. I have excelled as a
        Jack of all Trades across different teams, engaging in a wide range of
        tasks from graphic and digital design to both frontend and backend
        development, along with product and API strategy.
      </p>
      <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
        In addition to technology, I have a strong enthusiasm for efficient team
        management and intelligent work habits. I think a team&lsquo;s wellness
        is crucial for effective operations, and although ideas inspire
        innovation, it&lsquo;s the execution that leads to success.
      </p>
      <SocialLinks />
      <h3 className="mt-10 text-xl text-neutral-700 dark:text-neutral-200 mb-2">
        Latest Writing
      </h3>
      <LatestWriting items={allPosts} amount={2} />
      <h3 className="mt-10 text-xl text-neutral-700 dark:text-neutral-200 mb-2">
        Work
      </h3>
      <WorkExperience items={allWorks} />
      <h3 className="mt-10 text-xl text-neutral-700 dark:text-neutral-200 mb-2">
        Projects
      </h3>
      <Projects items={allProjects} />
    </div>
  );
}
