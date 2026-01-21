import { AboutActions } from "@/components/about-actions";

const startYear = (year: number) => {
  const today = new Date();
  const startDate = new Date(year, 0, 1);
  const yearsToday = today.getFullYear() - startDate.getFullYear();
  return yearsToday;
};

const BIO = `Johnie Hjelm is a Head of Engineering with over ${startYear(
  2009
)} years of experience building high-performing teams and products. As a self-taught fullstack developer, he has grown from intern to engineering leader, focusing on people development and inclusive engineering cultures. Johnie is an advocate for AI-assisted development, helping teams leverage modern AI tools to boost productivity and effectiveness. He is also the founder of Crip in Tech, an initiative dedicated to making the tech industry more inclusive for disabled people. His unique combination of technical expertise, engineering leadership, and advocacy for both AI adoption and workplace inclusivity makes him a distinctive voice in the technology sector.`;

export function Bio() {
  return (
    <>
      <h3 className="mt-10 mb-4 text-neutral-800 text-xl dark:text-neutral-200">
        Bio
      </h3>
      <p className="text-neutral-500 leading-[25px] dark:text-neutral-400">
        This is made for journalists, podcast hosts, and event organizers to
        copy-and-paste.
      </p>
      <blockquote className="my-4 border-neutral-500 border-l-2 pl-6 dark:border-neutral-200">
        <p className="text-neutral-500 italic leading-[25px] dark:text-neutral-400">
          {BIO}
        </p>
      </blockquote>
      <AboutActions bio={BIO} />
    </>
  );
}
