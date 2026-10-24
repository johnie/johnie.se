import { db } from "@/lib/db.server";
import { createEdgeCache } from "@/lib/edge-cache";
import { getServerEnv } from "@/lib/env.server";
import { createNowPlaying, createSongLog } from "@/lib/now-playing";
import type { SpotifyPlayer } from "@/lib/now-playing";
import type { SpotifyTokenResponse } from "@/lib/types";

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const REQUEST_TIMEOUT_MS = 5000;

const getAccessToken = async (): Promise<SpotifyTokenResponse> => {
  const env = getServerEnv();

  const basic = btoa(
    `${env.SPOTIFY_API_CLIENT_ID}:${env.SPOTIFY_API_CLIENT_SECRET}`
  );

  const response = await fetch(TOKEN_ENDPOINT, {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_API_REFRESH_TOKEN,
    }),
    headers: { Authorization: `Basic ${basic}` },
    method: "POST",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token");
  }

  return response.json();
};

/** Spotify Web API adapter for the Now playing module. */
const spotifyWebApi: SpotifyPlayer = {
  currentlyPlaying: async () => {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 204 || response.status >= 400) {
      return null;
    }

    return response.json();
  },
};

export const getNowPlaying = createNowPlaying({
  cache: createEdgeCache(caches),
  player: spotifyWebApi,
  songLog: createSongLog(db),
});
