import { afterEach, describe, expect, it, vi } from "vitest";

import { createEdgeCache } from "@/lib/edge-cache";
import { createNowPlaying, createSongLog } from "@/lib/now-playing";
import type { SongLog, SpotifyPlayer } from "@/lib/now-playing";
import {
  createLocalDatabase,
  createMemoryCacheStore,
} from "@/lib/testing/local-runtime";
import type { SpotifyCurrentlyPlayingResponse } from "@/lib/types";

const GET_LUCKY = {
  album: "RAM",
  artist: "Daft Punk, Pharrell",
  songUrl: "https://open.spotify.com/track/get-lucky",
  title: "Get Lucky",
};

const playback = ({
  isPlaying = true,
  type = "track",
} = {}): SpotifyCurrentlyPlayingResponse => ({
  currently_playing_type: type,
  is_playing: isPlaying,
  item: {
    album: {
      artists: [{ name: "Daft Punk" }, { name: "Pharrell" }],
      name: "RAM",
    },
    external_urls: { spotify: GET_LUCKY.songUrl },
    name: "Get Lucky",
  },
});

const playerReturning = (
  state: SpotifyCurrentlyPlayingResponse | null
): SpotifyPlayer => ({ currentlyPlaying: () => Promise.resolve(state) });

const failingPlayer: SpotifyPlayer = {
  currentlyPlaying: () => Promise.reject(new Error("Spotify is down")),
};

const nowPlaying = (player: SpotifyPlayer, songLog: SongLog) =>
  createNowPlaying({
    cache: createEdgeCache(createMemoryCacheStore()),
    player,
    songLog,
  });

describe("Now playing", () => {
  const disposers: (() => Promise<void>)[] = [];

  const localSongLog = async ({ migrate = true } = {}): Promise<SongLog> => {
    const { db, dispose } = await createLocalDatabase({ migrate });

    disposers.push(dispose);

    return createSongLog(db);
  };

  afterEach(async () => {
    await Promise.all(disposers.splice(0).map((dispose) => dispose()));
    vi.restoreAllMocks();
  });

  it("shows the playing track and records it in the Song log", async () => {
    const songLog = await localSongLog();

    await expect(
      nowPlaying(playerReturning(playback()), songLog)()
    ).resolves.toStrictEqual({ ...GET_LUCKY, isPlaying: true });
    await expect(songLog.latest()).resolves.toStrictEqual(GET_LUCKY);
  });

  it.each([
    ["nothing is reported", null],
    ["playback is paused", playback({ isPlaying: false })],
    ["a podcast is playing", playback({ type: "episode" })],
  ])("falls back to the last recorded song when %s", async (_case, stopped) => {
    const songLog = await localSongLog();

    await nowPlaying(playerReturning(playback()), songLog)();

    await expect(
      nowPlaying(playerReturning(stopped), songLog)()
    ).resolves.toStrictEqual({ ...GET_LUCKY, isPlaying: false });
  });

  it("falls back to the Song log when Spotify fails", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const songLog = await localSongLog();

    await songLog.record(GET_LUCKY);

    await expect(nowPlaying(failingPlayer, songLog)()).resolves.toStrictEqual({
      ...GET_LUCKY,
      isPlaying: false,
    });
  });

  it("shows nothing when nothing is playing and nothing was logged", async () => {
    const songLog = await localSongLog();

    await expect(
      nowPlaying(playerReturning(null), songLog)()
    ).resolves.toBeNull();
  });

  it("still shows the playing track when the Song log is unavailable", async () => {
    vi.spyOn(console, "error").mockReturnValue();
    const songLog = await localSongLog({ migrate: false });

    await expect(
      nowPlaying(playerReturning(playback()), songLog)()
    ).resolves.toStrictEqual({ ...GET_LUCKY, isPlaying: true });
    await expect(
      nowPlaying(playerReturning(null), songLog)()
    ).resolves.toBeNull();
  });

  it("asks Spotify once per cache lifetime", async () => {
    const currentlyPlaying = vi.fn<SpotifyPlayer["currentlyPlaying"]>(() =>
      Promise.resolve(playback())
    );

    const current = nowPlaying({ currentlyPlaying }, await localSongLog());

    await current();
    await current();

    expect(currentlyPlaying).toHaveBeenCalledOnce();
  });
});
