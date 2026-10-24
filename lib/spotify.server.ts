import { db } from "@/lib/db.server";
import { createEdgeCache } from "@/lib/edge-cache";
import { getServerEnv } from "@/lib/env.server";
import { createNowPlaying, createSongLog } from "@/lib/now-playing";
import type { SpotifyPlayer } from "@/lib/now-playing";
import { requestSpotifyToken } from "@/lib/spotify-token";

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

const REQUEST_TIMEOUT_MS = 5000;

const getAccessToken = async (): Promise<string> => {
  const env = getServerEnv();

  const { access_token } = await requestSpotifyToken(
    {
      clientId: env.SPOTIFY_API_CLIENT_ID,
      clientSecret: env.SPOTIFY_API_CLIENT_SECRET,
    },
    {
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_API_REFRESH_TOKEN,
    }
  );

  return access_token;
};

/** Spotify Web API adapter for the Now playing module. */
const spotifyWebApi: SpotifyPlayer = {
  currentlyPlaying: async () => {
    const accessToken = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
