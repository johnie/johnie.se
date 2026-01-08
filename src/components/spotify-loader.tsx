import { lazy, Suspense } from "react";

const SpotifyComponent = lazy(() =>
  import("@/components/spotify").then((mod) => ({ default: mod.Spotify }))
);

function SpotifyFallback() {
  return (
    <div className="mb-2 flex h-5 items-center gap-2">
      <div className="h-4 w-4 animate-pulse rounded bg-neutral-700" />
      <div className="h-4 w-32 animate-pulse rounded bg-neutral-700" />
    </div>
  );
}

export function Spotify() {
  return (
    <Suspense fallback={<SpotifyFallback />}>
      <SpotifyComponent />
    </Suspense>
  );
}
