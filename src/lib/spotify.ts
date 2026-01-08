import { desc, sql } from "drizzle-orm";
import { spotify } from "@/lib/db/schema";
import { getDb } from "@/lib/turso";
import { env } from "./env";

interface SpotifyTokenResponse {
  access_token: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  name: string;
  artists: SpotifyArtist[];
}

interface SpotifyTrack {
  name: string;
  album: SpotifyAlbum;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyCurrentlyPlayingResponse {
  currently_playing_type?: string;
  is_playing?: boolean;
  item?: SpotifyTrack;
}

interface SongData {
  title: string;
  artist: string;
  album: string;
  songUrl: string;
  isPlaying: boolean;
}

function isSpotifyConfigured(): boolean {
  return Boolean(
    env.SPOTIFY_API_CLIENT_ID &&
      env.SPOTIFY_API_CLIENT_SECRET &&
      env.SPOTIFY_API_REFRESH_TOKEN
  );
}

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
  if (!isSpotifyConfigured()) {
    throw new Error("Spotify API not configured");
  }

  const basic = Buffer.from(
    `${env.SPOTIFY_API_CLIENT_ID}:${env.SPOTIFY_API_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formEncode({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_API_REFRESH_TOKEN,
    }),
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
    });

    if (response.status === 204 || response.status > 400) {
      return null;
    }

    return response.json();
  };

async function getLatestSongFromDb() {
  const db = getDb();
  if (!db) {
    return null;
  }

  const [latestSong] = await db
    .select()
    .from(spotify)
    .orderBy(desc(spotify.lastPlayedAt))
    .limit(1);

  return latestSong;
}

async function getCurrentOrLastSongUncached(): Promise<SongData | null> {
  // If neither Spotify nor DB is configured, return null
  if (!(isSpotifyConfigured() || getDb())) {
    return null;
  }

  try {
    // Check if currently playing (only if Spotify is configured)
    if (isSpotifyConfigured()) {
      const nowPlaying = await getNowPlaying();

      // If currently playing a track, update database and return it
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
          title: item.name,
          album: item.album.name,
          artist,
          songUrl: item.external_urls.spotify,
        };

        // Update database with current song (upsert: increment play count if exists)
        const db = getDb();
        if (db) {
          await db
            .insert(spotify)
            .values(songData)
            .onConflictDoUpdate({
              target: spotify.songUrl,
              set: {
                playCount: sql`${spotify.playCount} + 1`,
                lastPlayedAt: sql`(CURRENT_TIMESTAMP)`,
              },
            });
        }

        return {
          ...songData,
          isPlaying: true,
        };
      }
    }

    // Not currently playing, get latest from database
    const latestSong = await getLatestSongFromDb();

    if (!latestSong) {
      return null;
    }

    return {
      title: latestSong.title,
      artist: latestSong.artist,
      album: latestSong.album,
      songUrl: latestSong.songUrl,
      isPlaying: false,
    };
  } catch {
    // If Spotify API fails, fallback to latest from database
    const latestSong = await getLatestSongFromDb();

    if (!latestSong) {
      return null;
    }

    return {
      title: latestSong.title,
      artist: latestSong.artist,
      album: latestSong.album,
      songUrl: latestSong.songUrl,
      isPlaying: false,
    };
  }
}

// Export the function directly (caching can be added via server function or external cache later)
export const getCurrentOrLastSong = getCurrentOrLastSongUncached;
