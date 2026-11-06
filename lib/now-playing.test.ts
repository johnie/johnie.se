import { sql } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createEdgeCache } from "@/lib/edge-cache";
import { createNowPlaying } from "@/lib/now-playing";
import { createSongLog } from "@/lib/song-log";
import type { SongLog } from "@/lib/song-log";
import type {
  SpotifyCurrentlyPlayingResponse,
  SpotifyPlayer,
} from "@/lib/spotify-types";
import {
  createLocalDatabase,
  createMemoryCacheStore,
} from "@/lib/testing/local-runtime";

const GET_LUCKY = {
  album: "RAM",
  artist: "Daft Punk, Pharrell",
  songUrl: "https://open.spotify.com/track/get-lucky",
  title: "Get Lucky",
};

const playback = ({
  isPlaying = true,
  type = "track",
  title = "Get Lucky",
  songUrl = GET_LUCKY.songUrl,
} = {}): SpotifyCurrentlyPlayingResponse => ({
  currently_playing_type: type,
  is_playing: isPlaying,
  item: {
    album: {
      artists: [{ name: "Daft Punk" }, { name: "Pharrell" }],
      name: "RAM",
    },
    external_urls: { spotify: songUrl },
    name: title,
  },
});

const playerReturning = (
  state: SpotifyCurrentlyPlayingResponse | null
): SpotifyPlayer => ({ currentlyPlaying: () => Promise.resolve(state) });

const failingPlayer: SpotifyPlayer = {
  currentlyPlaying: () => Promise.reject(new Error("Spotify is down")),
};

const nowPlaying = (
  player: SpotifyPlayer,
  songLog: SongLog,
  now?: () => number
) =>
  createNowPlaying({
    cache: createEdgeCache(createMemoryCacheStore(now)),
    player,
    songLog,
  });

describe("Now playing", () => {
  const disposers: (() => Promise<void>)[] = [];

  const localSongLog = async () => {
    const { db, dispose } = await createLocalDatabase();

    disposers.push(dispose);

    return { db, songLog: createSongLog(db) };
  };

  afterEach(async () => {
    await Promise.all(disposers.splice(0).map((dispose) => dispose()));
    vi.restoreAllMocks();
  });

  it("shows the playing track and records it in the Song log", async () => {
    const { songLog } = await localSongLog();

    await expect(
      nowPlaying(playerReturning(playback()), songLog)()
    ).resolves.toStrictEqual({ ...GET_LUCKY, isPlaying: true });
    await expect(songLog.latest()).resolves.toStrictEqual(GET_LUCKY);
  });

  it.each([
    ["nothing is reported", null],
    ["playback is paused", playback({ isPlaying: false })],
    ["a podcast is playing", playback({ type: "episode" })],
    [
      "the reported track is missing",
      { currently_playing_type: "track", is_playing: true },
    ],
  ])("falls back to the last recorded song when %s", async (_case, stopped) => {
    const { songLog } = await localSongLog();

    await songLog.record(GET_LUCKY);

    await expect(
      nowPlaying(playerReturning(stopped), songLog)()
    ).resolves.toStrictEqual({ ...GET_LUCKY, isPlaying: false });
  });

  it("falls back to the Song log when Spotify fails", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const { songLog } = await localSongLog();

    await songLog.record(GET_LUCKY);

    await expect(nowPlaying(failingPlayer, songLog)()).resolves.toStrictEqual({
      ...GET_LUCKY,
      isPlaying: false,
    });
  });

  it("shows nothing when nothing is playing and nothing was logged", async () => {
    const { songLog } = await localSongLog();

    await expect(
      nowPlaying(playerReturning(null), songLog)()
    ).resolves.toBeNull();
  });

  it("still shows the playing track when recording to the Song log fails", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const { db, songLog } = await localSongLog();

    await db.run(sql`DROP TABLE "SPOTIFY"`);

    await expect(
      nowPlaying(playerReturning(playback()), songLog)()
    ).resolves.toStrictEqual({ ...GET_LUCKY, isPlaying: true });
  });

  it("shows nothing when the Song log cannot be read", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const { db, songLog } = await localSongLog();

    await db.run(sql`DROP TABLE "SPOTIFY"`);

    await expect(
      nowPlaying(playerReturning(null), songLog)()
    ).resolves.toBeNull();
  });

  it("keeps displaying the cached track until the cache entry expires", async () => {
    const { songLog } = await localSongLog();
    let now = 0;
    let state = playback();

    const current = nowPlaying(
      { currentlyPlaying: () => Promise.resolve(state) },
      songLog,
      () => now
    );

    await expect(current()).resolves.toStrictEqual({
      ...GET_LUCKY,
      isPlaying: true,
    });

    const nextSong = {
      ...GET_LUCKY,
      songUrl: "https://open.spotify.com/track/lose-yourself-to-dance",
      title: "Lose Yourself to Dance",
    };

    state = playback(nextSong);
    now = 59_999;

    await expect(current()).resolves.toStrictEqual({
      ...GET_LUCKY,
      isPlaying: true,
    });

    now = 60_000;

    await expect(current()).resolves.toStrictEqual({
      ...nextSong,
      isPlaying: true,
    });
  });
});
