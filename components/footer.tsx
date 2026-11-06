import { Await } from "@tanstack/react-router";
import { Suspense } from "react";

import { Spotify } from "@/components/spotify";
import { SITE_NAME } from "@/lib/constants";
import { useCurrentYear } from "@/lib/current-year";
import type { SongData } from "@/lib/spotify-types";

export const Footer = ({ song }: { song: Promise<SongData | null> }) => {
  const year = useCurrentYear();

  return (
    <footer className="my-10">
      <div className="mb-2 min-h-5">
        <Suspense fallback={null}>
          <Await promise={song}>
            {(resolved) => <Spotify song={resolved} />}
          </Await>
        </Suspense>
      </div>
      <p className="mb-2 text-sm text-neutral-400">
        © {year} {SITE_NAME}.
      </p>
    </footer>
  );
};
