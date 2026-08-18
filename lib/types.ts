import type { Route } from "next";
import type { ReactNode } from "react";

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithImage<T extends { image?: string }> = RequiredField<T, "image">;

export const hasImage = <T extends { image?: string }>(
  item: T
): item is WithImage<T> =>
  typeof item.image === "string" && item.image.length > 0;

export const hasUrl = <T extends { url?: string }>(
  item: T
): item is RequiredField<T, "url"> =>
  typeof item.url === "string" && item.url.length > 0;

export interface NavLink {
  enabled?: boolean;
  icon?: ReactNode;
  name: string;
  slug: Route;
}

export interface SocialLink {
  enabled: boolean;
  href: string;
  icon: ReactNode;
  name: string;
}

export interface CalloutProps {
  children: ReactNode;
  emoji: string;
}

export interface View {
  count: number;
  slug: string;
  updatedAt: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
}

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

export type {
  Page,
  Post,
  Project,
  TodayIlearned,
  Work,
} from "content-collections";
