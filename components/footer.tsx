import Visitor from './visitor';

const GetInTouch = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="text-sm flex items-center text-neutral-400 mb-8">
      <div className="animate-ping rounded-full bg-green-400 h-[8px] w-[8px] inline-block mr-2 absolute"></div>
      <div className="rounded-full bg-green-400 h-[8px] w-[8px] inline-block mr-2"></div>
      Actively looking for new projects.{' '}
      <a href="mailto:johnie@hjelm.im" className="border-b border-neutral-400">
        Get in touch!
      </a>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer role="contentinfo" className="my-10 space-y-2">
      <GetInTouch show={false} />
      <Visitor />
      <h3 className="text-sm text-neutral-400 mb-2">
        © {new Date().getFullYear().toString()} Johnie Hjelm.
      </h3>
    </footer>
  );
};
