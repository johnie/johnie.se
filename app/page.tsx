import { allWorks, allProjects, allPosts } from 'content-collections';
import { WorkExperience } from '@/components/work';
import { Projects } from '@/components/projects';
import { SocialLinks } from '@/components/socialLinks';
import { LatestWriting } from '@/components/latestWriting';

export default function Home() {
  return (
    <div>
      <h1 className="mt-[6px]">
        <span className="font-semibold">Johnie Hjelm</span> is committed to developing individuals and teams for
        success.
      </h1>
      <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
        Since my teens, I&lsquo;ve been immersed in both design and coding, refusing to be pigeonholed into a single
        specialty. I&lsquo;ve thrived as a Jack of all Trades in various teams, dabbling in everything from graphic and
        digital design to front and backend development, as well as product and API strategy.
      </p>
      <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
        Beyond tech, I&lsquo;m passionate about effective team leadership and smart work practices. I believe that a
        team&lsquo;s well-being is central to smooth operations and that while ideas spark innovation, it&lsquo;s
        execution that drives success.
      </p>
      <SocialLinks />
      <h3 className="mt-10 text-xl text-neutral-700 dark:text-neutral-200 mb-2">Latest Writing</h3>
      <LatestWriting items={allPosts} amount={2} />
      <h3 className="mt-10 text-xl text-neutral-700 dark:text-neutral-200 mb-2">Work</h3>
      <WorkExperience items={allWorks} />
      <h3 className="mt-10 text-xl text-neutral-700 dark:text-neutral-200 mb-2">Projects</h3>
      <Projects items={allProjects} />
    </div>
  );
}
