import { createServerFn } from "@tanstack/react-start";

import { getCurrentOrLastSong } from "@/lib/spotify.server";

export const getSpotifySong = createServerFn({ method: "GET" }).handler(() =>
  getCurrentOrLastSong()
);
