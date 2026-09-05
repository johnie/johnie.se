import { Suspense } from "react";

import { Spotify } from "@/components/spotify";

const GetInTouch = ({ show }: { show: boolean }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="mb-8 flex items-center text-sm text-neutral-400">
      <div className="absolute mr-2 inline-block h-2 w-2 animate-ping rounded-full bg-green-400" />
      <div className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400" />
      Actively looking for new projects.{" "}
      <a className="border-b border-neutral-400" href="mailto:johnie@hjelm.im">
        Get in touch!
      </a>
    </div>
  );
};

export const Footer = () => (
  <footer className="my-10">
    <GetInTouch show={false} />
    <div className="mb-2 min-h-5">
      <Suspense fallback={null}>
        <Spotify />
      </Suspense>
    </div>
    <p className="mb-2 text-sm text-neutral-400">
      © {new Date().getFullYear().toString()} Johnie Hjelm.
    </p>
  </footer>
);
