import React from 'react';
import { AboutActions } from '@/components/aboutActions';

const startYear = (startYear: number) => {
  const today = new Date();
  const startDate = new Date(startYear, 0, 1);
  const yearsToday = today.getFullYear() - startDate.getFullYear();
  return yearsToday;
};

const BIO = `Johnie Hjelm is an innovative Technical Lead with over ${startYear(
  2009
)} years of expertise in the tech industry. As a self-taught Fullstack Web Developer, he has charted an impressive career path marked by his commitment to empowering individuals and teams. Johnie is renowned for his pragmatic leadership and transparent communication style, consistently driving projects to success. Beyond his professional achievements, he is the visionary founder of Crip in Tech, a groundbreaking initiative dedicated to enhancing inclusivity in the tech sector for individuals with physical disabilities. Johnie's unique blend of technical acumen, leadership skills, and advocacy work positions him as a transformative force in the industry, championing both technological advancement and workplace diversity.`;

export function Bio() {
  return (
    <>
      <h3 className="mt-10 text-xl text-neutral-800 dark:text-neutral-200 mb-4">Bio</h3>
      <p className="leading-[25px] text-neutral-500 dark:text-neutral-400">
        This is made for journalists, podcast hosts, and event organizers to copy-and-paste.
      </p>
      <blockquote className="pl-6 my-4 border-l-2 border-neutral-500 dark:border-neutral-200">
        <p className="leading-[25px] text-neutral-500 dark:text-neutral-400 italic">{BIO}</p>
      </blockquote>
      <AboutActions bio={BIO} />
    </>
  );
}
