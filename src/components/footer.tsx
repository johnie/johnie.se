import { Spotify } from "@/components/spotify-loader";

const GetInTouch = ({ show }: { show: boolean }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="mb-8 flex items-center text-neutral-400 text-sm">
      <div className="absolute mr-2 inline-block h-2 w-2 animate-ping rounded-full bg-green-400" />
      <div className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400" />
      Actively looking for new projects.{" "}
      <a className="border-neutral-400 border-b" href="mailto:johnie@hjelm.im">
        Get in touch!
      </a>
    </div>
  );
};

export const Footer = () => (
  <footer className="my-10">
    <GetInTouch show={false} />
    <Spotify />
    <h3 className="mb-2 text-neutral-400 text-sm">
      © {new Date().getFullYear().toString()} Johnie Hjelm.
    </h3>
  </footer>
);
