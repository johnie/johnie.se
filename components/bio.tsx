import React from 'react';
import { AboutActions } from '@/components/aboutActions';

const startYear = (startYear: number) => {
  const today = new Date();
  const startDate = new Date(startYear, 0, 1);
  const yearsToday = today.getFullYear() - startDate.getFullYear();
  return yearsToday;
};

const BIO = `Johnie Hjelm is a creative Technical Lead with over ${startYear(
  2009
)} of experience in the technology sector. As a self-educated Fullstack Web Developer, he has forged a remarkable career journey characterized by his dedication to uplifting individuals and teams. Johnie is celebrated for his practical leadership and open communication approach, consistently steering projects toward success. Aside from his professional successes, he is the innovative founder of Crip in Tech, a pioneering program aimed at improving inclusivity within the tech industry for those with physical disabilities. Johnie's distinctive mix of technical expertise, leadership abilities, and advocacy efforts makes him a transformative influence in the sector, promoting both technological progress and workplace diversity. `;

export function Bio() {
  return (
    <>
      <h3 className="mt-10 text-xl text-neutral-800 dark:text-neutral-200 mb-4">
        Bio
      </h3>
      <p className="leading-[25px] text-neutral-500 dark:text-neutral-400">
        This is made for journalists, podcast hosts, and event organizers to
        copy-and-paste.
      </p>
      <blockquote className="pl-6 my-4 border-l-2 border-neutral-500 dark:border-neutral-200">
        <p className="leading-[25px] text-neutral-500 dark:text-neutral-400 italic">
          {BIO}
        </p>
      </blockquote>
      <AboutActions bio={BIO} />
    </>
  );
}
