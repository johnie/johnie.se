import type { Metadata } from 'next';
import Image from 'next/image';
import { Bio } from '@/components/bio';

export const metadata: Metadata = {
  title: 'About',
  description: 'Committed to developing individuals and teams for success.',
};

const About = () => {
  return (
    <div>
      <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        Create. Share. Repeat.
      </h1>
      <div className="grid grid-cols-3 gap-x-4">
        <div className="md:col-span-1 col-span-3">
          <Image
            alt="Johnie"
            src="/images/johnie.jpg"
            width={400}
            height={400}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
            className="rounded w-full h-auto mb-4 md:mb-0"
            priority
          />
        </div>
        <div className="md:col-span-2 col-span-3">
          <p className="leading-[25px] text-neutral-500 dark:text-neutral-400">
            <span className="text-neutral-800 dark:text-neutral-200">Hey, I&#39;m Johnie Hjelm!</span> 31 years old, currently living in Solna, Stockholm with my beloved{' '}
            <a href="https://izabela.se" target="_blank" rel="noopener noreferrer">
              girlfriend
            </a>{' '}
            and have more than 15 years career in the tech industry, I&#39;ve journeyed from a high school intern to a{' '}
            <span className="text-neutral-800 dark:text-neutral-200">Technical Lead Manager</span>, overcoming the unique hurdles posed by my{' '}
            <span className="text-neutral-800 dark:text-neutral-200">physical disability</span> along the way. My initial experience at a web agency sparked a{' '}
            <span className="text-neutral-800 dark:text-neutral-200">self-taught path in web development</span>, fueling my conviction that{' '}
            <span className="text-neutral-800 dark:text-neutral-200">technology has the power to better lives</span>. In my current role, I put a strong emphasis on both{' '}
            <span className="text-neutral-800 dark:text-neutral-200">personal and professional development</span> within my team.
          </p>
        </div>
        <div className="col-span-3">
          <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
            My leadership mantra is straightforward: <span className="text-neutral-800 dark:text-neutral-200">stay humble, stay hungry</span>. This philosophy is at the core of
            every project I oversee and every team I lead. The goal is not just to build <span className="text-neutral-800 dark:text-neutral-200">exceptional products</span>, but
            also to cultivate an environment that <span className="text-neutral-800 dark:text-neutral-200">nurtures growth and development</span> in individuals.
          </p>
          <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
            In my personal endeavors, I&#39;m committed to making the tech industry more <span className="text-neutral-800 dark:text-neutral-200">inclusive</span> through my
            initiative,{' '}
            <a className="text-neutral-800 dark:text-neutral-200 border-b border-neutral-200" href="https://crip.io" target="_blank" rel="noopener noreferrer">
              Crip in Tech
            </a>
            . By focusing on inclusivity, I aim to help others overcome their own challenges, enriching the tech community{' '}
            <span className="text-neutral-800 dark:text-neutral-200">with more crips</span>.
          </p>
        </div>
      </div>
      <Bio />
      <h3 className="mt-10 text-xl text-neutral-800 dark:text-neutral-200 mb-4">Current preferred stack</h3>
      <p className="leading-[25px] text-neutral-500 dark:text-neutral-400">
        I&#39;m a big fan of <span className="text-neutral-800 dark:text-neutral-200">Serverless</span> and I currently prefer using the following stack for projects:
      </p>
      <ul className="list-disc pl-8 py-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
        <li>React</li>
        <li>Next.js</li>
        <li>TypeScript</li>
        <li>Jest</li>
        <li>Tailwind CSS</li>
        <li>Svelte</li>
        <li>Node.js</li>
        <li>PostgreSQL</li>
      </ul>

      <h3 className="mt-8 text-xl text-neutral-800 dark:text-neutral-200 mb-4">Hire me</h3>
      <p className="leading-[25px] text-neutral-500 dark:text-neutral-400">
        I&#39;m currently available for <span className="text-neutral-800 dark:text-neutral-200">consulting</span> and{' '}
        <span className="text-neutral-800 dark:text-neutral-200">freelance</span> work. If you&#39;re interested in working together, please reach out!
      </p>
      <ul className="list-disc pl-8 py-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Fullstack developer</span> with wide skills
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Technical Leadership:</span> Proven track record as a Technical Lead, managing teams and projects to success.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Agile Workflow:</span> Experienced in implementing agile practices to optimize team workflow.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">+6 years of React experience:</span> Worked with Redux in the past but now preferring Context API.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">4 years of Jest and TDD:</span> Strong focus on quality and compliance.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">4 years of Next.js:</span> Extensive experience in front-end and back-end technologies.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">5 years working with server-side JavaScript:</span> (Node + Express), REST APIs, and PostgreSQL databases.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Recent experience with Svelte:</span> Always staying updated with the latest technologies.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Tailwind CSS:</span> I&#39;m a big fan of Tailwind CSS and I&#39;m using it in most of my projects.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Thinking about accessibility as a top priority in UX:</span> Passionate about fostering genuine connections and
          promoting diversity and inclusion.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Github Actions:</span> Experienced in Deployment Pipelines and Automation.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">I&#39;ve also worked in the past with:</span> Vue, Styled Components, Gatsby, Redux, mySQL, Angular, Firebase.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Can communicate with designers:</span> I&#39;m not a designer but I can communicate with them and understand
          their needs.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Creative and with good writing skills:</span> Led creative development and produced thought-provoking podcasts.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Compliance Expertise:</span> Managed compliance-related tasks, particularly in the gambling and betting industry.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Microservices Architecture:</span> Worked with microservices development using Node.js and Golang.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Containerization and Automation:</span> Familiar with containerization technologies and automation tools.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Security:</span> Prioritize security measures in development practices.
        </li>
        <li>
          <span className="text-neutral-800 dark:text-neutral-200">Volunteer Experience:</span> Acted as a Code Coach at Tjejer Kodar in 2019, showcasing a commitment to community
          and skill-sharing.
        </li>
      </ul>
    </div>
  );
};

export default About;
