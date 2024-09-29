import React from 'react';
import { AboutActions } from '@/components/aboutActions';

const BIO = `Johnie Hjelm is a seasoned Technical Lead Manager with over 15 years in the tech industry. A self-taught Fullstack Web Developer, he has successfully navigated a rich career journey, marked by his dedication to fostering individual and team success. Known for his pragmatic and transparent leadership style, Johnie is also the force behind Crip in Tech, an initiative aimed at making the tech sector more inclusive for individuals with physical disabilities.`;

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
