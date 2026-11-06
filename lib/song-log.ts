import { desc, sql } from "drizzle-orm";

import type { Database } from "@/lib/db/database";
import { spotify } from "@/lib/db/schema";
import type { SongData } from "@/lib/spotify-types";

export type Song = Omit<SongData, "isPlaying">;

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
