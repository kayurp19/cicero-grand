import { contentBlocks, contactSubmissions } from "@shared/schema";
import type { ContentBlock, ContactSubmission, InsertContact } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { desc, eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

// Database path. Locally we use ./data.db. In production (Railway) we expect
// a persistent volume — set DATABASE_PATH=/data/data.db so the database survives
// redeploys. If the configured directory doesn't exist (e.g. volume not yet
// mounted), fall back to /tmp so the server still boots and the healthcheck
// passes — data won't persist, but the user can SEE the site and fix the
// volume after the fact.
function resolveDbPath(): string {
  const configured =
    process.env.DATABASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/data/data.db" : "data.db");
  try {
    const dir = path.dirname(configured);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Test that we can actually write here.
    fs.accessSync(dir, fs.constants.W_OK);
    return configured;
  } catch (err) {
    console.error(
      `[storage] cannot use DB path ${configured} (${(err as Error).message}); falling back to /tmp/data.db. Persistence is DISABLED until the volume is mounted correctly.`,
    );
    return "/tmp/data.db";
  }
}
const DB_PATH = resolveDbPath();
console.log(`[storage] using SQLite at ${DB_PATH}`);
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
  listContacts(limit?: number): Promise<ContactSubmission[]>;
  getContact(id: number): Promise<ContactSubmission | undefined>;
  deleteContact(id: number): Promise<void>;
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
    // Public form posts `topic`; underlying DB column is `subject` (legacy).
    return db
      .insert(contactSubmissions)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.topic,
        message: data.message,
        createdAt: Date.now(),
      })
      .returning()
      .get();
  }

  async listContacts(limit = 200): Promise<ContactSubmission[]> {
    return db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(limit)
      .all();
  }

  async getContact(id: number): Promise<ContactSubmission | undefined> {
    return db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .get();
  }

  async deleteContact(id: number): Promise<void> {
    db.delete(contactSubmissions).where(eq(contactSubmissions.id, id)).run();
  }
}

export const storage = new DatabaseStorage();
