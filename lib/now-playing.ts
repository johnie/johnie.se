import type { EdgeCache } from "@/lib/edge-cache";
import type { Song, SongLog } from "@/lib/song-log";
import type {
  SongData,
  SpotifyCurrentlyPlayingResponse,
  SpotifyPlayer,
} from "@/lib/spotify-types";

const NOW_PLAYING_CACHE_KEY = "spotify-current-song";
const NOW_PLAYING_TTL_SECONDS = 60;

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

/** Spotify failures fall back to the log; failed recording never hides playback. */
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
