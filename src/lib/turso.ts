import { type Client, createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { spotify, views } from "@/lib/db/schema";
import { env } from "@/lib/env";

let client: Client | null = null;
let database: LibSQLDatabase<{
  views: typeof views;
  spotify: typeof spotify;
}> | null = null;

function getClient(): Client | null {
  if (!client) {
    if (!env.TURSO_DATABASE_URL) {
      console.warn(
        "TURSO_DATABASE_URL is not set - database operations will be skipped"
      );
      return null;
    }
    client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export function getDb() {
  const dbClient = getClient();
  if (!dbClient) {
    return null;
  }
  if (!database) {
    database = drizzle({ client: dbClient, schema: { views, spotify } });
  }
  return database;
}

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return env.TURSO_DATABASE_URL !== undefined;
}

// Legacy exports for compatibility - use getDb() instead
export const db = {
  get select() {
    const database = getDb();
    if (!database) {
      throw new Error("Database not available - TURSO_DATABASE_URL not set");
    }
    return database.select.bind(database);
  },
  get insert() {
    const database = getDb();
    if (!database) {
      throw new Error("Database not available - TURSO_DATABASE_URL not set");
    }
    return database.insert.bind(database);
  },
  get update() {
    const database = getDb();
    if (!database) {
      throw new Error("Database not available - TURSO_DATABASE_URL not set");
    }
    return database.update.bind(database);
  },
  get delete() {
    const database = getDb();
    if (!database) {
      throw new Error("Database not available - TURSO_DATABASE_URL not set");
    }
    return database.delete.bind(database);
  },
};

export const turso = {
  get client() {
    return getClient();
  },
};
