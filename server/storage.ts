import { contentBlocks, contactSubmissions, menuRequests, emailLeads } from "@shared/schema";
import type { ContentBlock, ContactSubmission, InsertContact, MenuRequest, InsertMenuRequest, EmailLead, InsertEmailLead } from "@shared/schema";
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
  CREATE TABLE IF NOT EXISTS menu_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    event_type TEXT NOT NULL,
    event_date TEXT,
    guest_count TEXT,
    menus_requested TEXT NOT NULL,
    notes TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS email_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    source_page TEXT,
    promo_code TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    claimed INTEGER NOT NULL DEFAULT 0,
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
  createMenuRequest(data: InsertMenuRequest): Promise<MenuRequest>;
  listMenuRequests(limit?: number): Promise<MenuRequest[]>;
  getEmailLead(email: string): Promise<EmailLead | undefined>;
  createEmailLead(data: InsertEmailLead & { promoCode: string; ipAddress?: string; userAgent?: string }): Promise<EmailLead>;
  listEmailLeads(limit?: number): Promise<EmailLead[]>;
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

  async createMenuRequest(data: InsertMenuRequest): Promise<MenuRequest> {
    return db
      .insert(menuRequests)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: data.eventDate,
        guestCount: data.guestCount,
        menusRequested: JSON.stringify(data.menusRequested),
        notes: data.notes,
        createdAt: Date.now(),
      })
      .returning()
      .get();
  }

  async listMenuRequests(limit = 200): Promise<MenuRequest[]> {
    return db
      .select()
      .from(menuRequests)
      .orderBy(desc(menuRequests.createdAt))
      .limit(limit)
      .all();
  }

  async getEmailLead(email: string): Promise<EmailLead | undefined> {
    return db.select().from(emailLeads).where(eq(emailLeads.email, email.toLowerCase())).get();
  }

  async createEmailLead(
    data: InsertEmailLead & { promoCode: string; ipAddress?: string; userAgent?: string },
  ): Promise<EmailLead> {
    return db
      .insert(emailLeads)
      .values({
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        sourcePage: data.sourcePage,
        promoCode: data.promoCode,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        claimed: 0,
        createdAt: Date.now(),
      })
      .returning()
      .get();
  }

  async listEmailLeads(limit = 500): Promise<EmailLead[]> {
    return db
      .select()
      .from(emailLeads)
      .orderBy(desc(emailLeads.createdAt))
      .limit(limit)
      .all();
  }
}

export const storage = new DatabaseStorage();
