import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const views = sqliteTable("VIEWS", {
  count: integer("count").notNull().default(0),
  slug: text("slug").primaryKey().notNull(),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const spotifyTokens = sqliteTable("SPOTIFY_TOKENS", {
  accessToken: text("access_token").notNull(),
  expiresAt: integer("expires_at").notNull(),
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  refreshToken: text("refresh_token").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const spotify = sqliteTable("SPOTIFY", {
  album: text("album").notNull(),
  artist: text("artist").notNull(),
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  lastPlayedAt: text("last_played_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  playCount: integer("play_count").notNull().default(1),
  songUrl: text("song_url").notNull().unique(),
  title: text("title").notNull(),
});
