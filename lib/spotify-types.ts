export interface SpotifyArtist {
  name: string;
}

export interface SpotifyAlbum {
  artists: SpotifyArtist[];
  name: string;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  external_urls: { spotify: string };
  name: string;
}

export interface SpotifyCurrentlyPlayingResponse {
  currently_playing_type?: string;
  is_playing?: boolean;
  item?: SpotifyTrack;
}

export interface SongData {
  album: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

export interface SpotifyPlayer {
  currentlyPlaying: () => Promise<SpotifyCurrentlyPlayingResponse | null>;
}
