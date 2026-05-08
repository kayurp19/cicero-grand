import { contentBlocks, contactSubmissions } from "@shared/schema";
import type { ContentBlock, ContactSubmission, InsertContact } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

// Database path. Locally we use ./data.db. In production (Railway) we expect
// a persistent volume — set DATABASE_PATH=/data/data.db so the database survives
// redeploys.
const DB_PATH =
  process.env.DATABASE_PATH ||
  (process.env.NODE_ENV === "production" ? "/data/data.db" : "data.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

// Bootstrap tables on first run (idempotent).
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS content_blocks (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite);

export interface IStorage {
  getContent(key: string): Promise<ContentBlock | undefined>;
  setContent(key: string, value: string): Promise<ContentBlock>;
  listContentKeys(): Promise<string[]>;
  createContact(data: InsertContact): Promise<ContactSubmission>;
}

export class DatabaseStorage implements IStorage {
  async getContent(key: string): Promise<ContentBlock | undefined> {
    return db.select().from(contentBlocks).where(eq(contentBlocks.key, key)).get();
  }

  async setContent(key: string, value: string): Promise<ContentBlock> {
    const now = Date.now();
    const existing = await this.getContent(key);
    if (existing) {
      return db
        .update(contentBlocks)
        .set({ value, updatedAt: now })
        .where(eq(contentBlocks.key, key))
        .returning()
        .get();
    }
    return db
      .insert(contentBlocks)
      .values({ key, value, updatedAt: now })
      .returning()
      .get();
  }

  async listContentKeys(): Promise<string[]> {
    const rows = db.select({ key: contentBlocks.key }).from(contentBlocks).all();
    return rows.map((r) => r.key);
  }

  async createContact(data: InsertContact): Promise<ContactSubmission> {
    return db
      .insert(contactSubmissions)
      .values({ ...data, createdAt: Date.now() })
      .returning()
      .get();
  }
}

export const storage = new DatabaseStorage();
