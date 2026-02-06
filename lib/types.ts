import type { ReactNode } from "react";

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithImage<T extends { image?: string }> = RequiredField<T, "image">;

export function hasImage<T extends { image?: string }>(
  item: T
): item is WithImage<T> {
  return typeof item.image === "string" && item.image.length > 0;
}

export interface NavLink {
  name: string;
  slug: string;
  icon?: ReactNode;
  enabled?: boolean;
}

export interface SocialLink {
  href: string;
  icon: ReactNode;
  name: string;
  enabled: boolean;
}

export interface CalloutProps {
  emoji: string;
  children: ReactNode;
}

export interface HeadingProps {
  children: ReactNode;
}

export interface ProsCardProps {
  title: string;
  pros: string[];
}

export interface ConsCardProps {
  title: string;
  cons: string[];
}

export interface View {
  slug: string;
  count: number;
  updatedAt: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
}

export interface SpotifyArtist {
  name: string;
}

export interface SpotifyAlbum {
  name: string;
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  name: string;
  album: SpotifyAlbum;
  external_urls: { spotify: string };
}

export interface SpotifyCurrentlyPlayingResponse {
  currently_playing_type?: string;
  is_playing?: boolean;
  item?: SpotifyTrack;
}

export interface SongData {
  title: string;
  artist: string;
  album: string;
  songUrl: string;
  isPlaying: boolean;
}

export type {
  Page,
  Post,
  Project,
  TodayIlearned,
  Work,
} from "content-collections";
