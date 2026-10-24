import { AboutActions } from "@/components/about-actions";

const CAREER_START_YEAR = 2009;

const yearsSince = (year: number) => new Date().getFullYear() - year;

const SHORT_BIO =
  "Johnie Hjelm is Head of Engineering at Omni. A self-taught developer living with spinal muscular atrophy, he writes and speaks about engineering leadership, inclusive teams, and AI as assistive technology.";

const LONG_BIO = `Johnie Hjelm is Head of Engineering at Omni, with over ${yearsSince(
  CAREER_START_YEAR
)} years in tech. A self-taught developer, he started as a high school intern at a Stockholm web agency and has since worked across design, fullstack development, and engineering leadership at companies including Mr Green, Bambuser, and SEB. Johnie lives with spinal muscular atrophy and relied on AI coding tools as assistive technology long before they went mainstream. He writes and speaks about engineering leadership, inclusive engineering cultures, and AI-assisted development. He also founded Crip in Tech, an initiative to get more disabled people into the tech industry.`;

const BioQuote = ({ text }: { text: string }) => (
  <blockquote className="my-4 border-l-2 border-neutral-500 pl-6 dark:border-neutral-200">
    <p className="leading-[25px] text-neutral-500 italic dark:text-neutral-400">
      {text}
    </p>
  </blockquote>
);

export const Bio = () => (
  <>
    <h3 className="mt-10 mb-4 text-xl text-neutral-800 dark:text-neutral-200">
      Bio
    </h3>
    <p className="leading-[25px] text-neutral-500 dark:text-neutral-400">
      This is made for journalists, podcast hosts, and event organizers to
      copy-and-paste.
    </p>
    <h4 className="mt-6 text-neutral-800 dark:text-neutral-200">Short</h4>
    <BioQuote text={SHORT_BIO} />
    <h4 className="mt-6 text-neutral-800 dark:text-neutral-200">Long</h4>
    <BioQuote text={LONG_BIO} />
    <AboutActions longBio={LONG_BIO} shortBio={SHORT_BIO} />
  </>
);
