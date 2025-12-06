import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const views = sqliteTable("VIEWS", {
  slug: text("slug").primaryKey().notNull(),
  count: integer("count").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const spotifyTokens = sqliteTable("SPOTIFY_TOKENS", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: integer("expires_at").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const spotify = sqliteTable("SPOTIFY", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album").notNull(),
  songUrl: text("song_url").notNull().unique(),
  playCount: integer("play_count").notNull().default(1),
  lastPlayedAt: text("last_played_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
