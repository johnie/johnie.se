import { desc, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { spotify } from "@/lib/db/schema";
import { db } from "@/lib/turso";
import type {
  SongData,
  SpotifyCurrentlyPlayingResponse,
  SpotifyTokenResponse,
} from "@/lib/types";

import { env } from "./env";

const basic = Buffer.from(
  `${env.SPOTIFY_API_CLIENT_ID}:${env.SPOTIFY_API_CLIENT_SECRET}`
).toString("base64");
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const formEncode = (
  params: Record<string, string | number | boolean | null | undefined>
) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

const getAccessToken = async (): Promise<SpotifyTokenResponse> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    body: formEncode({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_API_REFRESH_TOKEN,
    }),
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token");
  }

  return response.json();
};

const getNowPlaying =
  async (): Promise<SpotifyCurrentlyPlayingResponse | null> => {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 204 || response.status >= 400) {
      return null;
    }

    return response.json();
  };

const getLatestSongFromDb = async () => {
  try {
    const [latestSong] = await db
      .select()
      .from(spotify)
      .orderBy(desc(spotify.lastPlayedAt))
      .limit(1);

    return latestSong;
  } catch (error: unknown) {
    console.error("Failed to get latest Spotify song:", error);
    return null;
  }
};

export const logSongToDb = async (songData: {
  album: string;
  artist: string;
  songUrl: string;
  title: string;
}) => {
  try {
    await db
      .insert(spotify)
      .values(songData)
      .onConflictDoUpdate({
        set: {
          lastPlayedAt: sql`(CURRENT_TIMESTAMP)`,
          playCount: sql`${spotify.playCount} + 1`,
        },
        target: spotify.songUrl,
      });
  } catch (error) {
    console.error("Failed to log song to database:", error);
  }
};

const getCurrentOrLastSongUncached = async (): Promise<SongData | null> => {
  try {
    // Check if currently playing
    const nowPlaying = await getNowPlaying();

    // If currently playing a track, return it
    if (
      nowPlaying &&
      nowPlaying.currently_playing_type === "track" &&
      nowPlaying.item &&
      nowPlaying.is_playing
    ) {
      const { item } = nowPlaying;
      const artist = item.album.artists
        .map((albumArtist) => albumArtist.name)
        .join(", ");

      const songData = {
        album: item.album.name,
        artist,
        songUrl: item.external_urls.spotify,
        title: item.name,
      };

      return {
        ...songData,
        isPlaying: true,
      };
    }

    // Not currently playing, get latest from database
    const latestSong = await getLatestSongFromDb();

    if (!latestSong) {
      return null;
    }

    return {
      album: latestSong.album,
      artist: latestSong.artist,
      isPlaying: false,
      songUrl: latestSong.songUrl,
      title: latestSong.title,
    };
  } catch {
    // If Spotify API fails, fallback to latest from database
    const latestSong = await getLatestSongFromDb();

    if (!latestSong) {
      return null;
    }

    return {
      album: latestSong.album,
      artist: latestSong.artist,
      isPlaying: false,
      songUrl: latestSong.songUrl,
      title: latestSong.title,
    };
  }
};

// Cache Spotify data for 60 seconds to reduce API calls
export const getCurrentOrLastSong = unstable_cache(
  getCurrentOrLastSongUncached,
  ["spotify-current-song"],
  { revalidate: 60, tags: ["spotify"] }
);
