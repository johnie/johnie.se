import { createServerFn } from "@tanstack/react-start";

import { getNowPlaying } from "@/lib/spotify.server";

export const getSpotifySong = createServerFn({ method: "GET" }).handler(() =>
  getNowPlaying()
);
