import { sql } from '@vercel/postgres';

type FooterProps = {};

export const Footer = async (props: FooterProps) => {
  const { rows } = await sql`SELECT visits FROM jh_meta`;
  await sql`UPDATE jh_meta SET visits = ${rows[0].visits + 1}`;
  return (
    <footer role="contentinfo" className="my-10">
      <div className="text-sm flex items-center text-neutral-400 mb-8">
        <div className="animate-ping rounded-full bg-green-400 h-[8px] w-[8px] inline-block mr-2 absolute"></div>
        <div className="rounded-full bg-green-400 h-[8px] w-[8px] inline-block mr-2"></div>Actively looking for new
        projects.{' '}
        <a href="mailto:johnie@hjelm.im" className="border-b border-neutral-400">
          Get in touch!
        </a>
      </div>
      <h3 className="text-sm text-neutral-400 mb-2">
        © {new Date().getFullYear().toString()} Johnie Hjelm. {rows[0].visits} visits
      </h3>
    </footer>
  );
};
