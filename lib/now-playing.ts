import { desc, sql } from "drizzle-orm";

import type { Database } from "@/lib/db/database";
import { spotify } from "@/lib/db/schema";
import type { EdgeCache } from "@/lib/edge-cache";
import type { SongData, SpotifyCurrentlyPlayingResponse } from "@/lib/types";

const NOW_PLAYING_CACHE_KEY = "spotify-current-song";
const NOW_PLAYING_TTL_SECONDS = 60;

export type Song = Omit<SongData, "isPlaying">;

/** Spotify's currently-playing state; `null` when nothing is reported. */
export interface SpotifyPlayer {
  currentlyPlaying: () => Promise<SpotifyCurrentlyPlayingResponse | null>;
}

/** Songs heard on Spotify, most recent last. */
export interface SongLog {
  latest: () => Promise<Song | null>;
  record: (song: Song) => Promise<void>;
}

export const createSongLog = (db: Database): SongLog => ({
  latest: async () => {
    const [song] = await db
      .select({
        album: spotify.album,
        artist: spotify.artist,
        songUrl: spotify.songUrl,
        title: spotify.title,
      })
      .from(spotify)
      .orderBy(desc(spotify.lastPlayedAt))
      .limit(1);

    return song ?? null;
  },
  record: async (song) => {
    await db
      .insert(spotify)
      .values(song)
      .onConflictDoUpdate({
        set: {
          lastPlayedAt: sql`(CURRENT_TIMESTAMP)`,
          playCount: sql`${spotify.playCount} + 1`,
        },
        target: spotify.songUrl,
      });
  },
});

const toPlayingTrack = (
  state: SpotifyCurrentlyPlayingResponse | null
): Song | null => {
  if (
    state?.currently_playing_type !== "track" ||
    !state.item ||
    !state.is_playing
  ) {
    return null;
  }

  const { item } = state;

  return {
    album: item.album.name,
    artist: item.album.artists.map((artist) => artist.name).join(", "),
    songUrl: item.external_urls.spotify,
    title: item.name,
  };
};

/**
 * The song to show as Now playing: the track Spotify is playing, recorded in
 * the Song log, or else the Song log's latest song. Spotify and Song log
 * failures degrade to the fallback or `null`; results are edge-cached for
 * 60 seconds.
 */
export const createNowPlaying = ({
  cache,
  player,
  songLog,
}: {
  cache: EdgeCache;
  player: SpotifyPlayer;
  songLog: SongLog;
}): (() => Promise<SongData | null>) => {
  const lastPlayed = async (): Promise<SongData | null> => {
    try {
      const song = await songLog.latest();

      return song ? { ...song, isPlaying: false } : null;
    } catch (error) {
      console.error("Failed to get latest Spotify song:", error);

      return null;
    }
  };

  const load = async (): Promise<SongData | null> => {
    let playing: Song | null;

    try {
      playing = toPlayingTrack(await player.currentlyPlaying());
    } catch (error) {
      console.error("Failed to get Spotify playback:", error);

      return lastPlayed();
    }

    if (!playing) {
      return lastPlayed();
    }

    try {
      await songLog.record(playing);
    } catch (error) {
      console.error("Failed to log song to database:", error);
    }

    return { ...playing, isPlaying: true };
  };

  return () => cache(NOW_PLAYING_CACHE_KEY, NOW_PLAYING_TTL_SECONDS, load);
};
