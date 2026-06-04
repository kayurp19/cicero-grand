import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/** Editable content blocks. `key` corresponds to the JSON seed name
 *  (site, rooms, amenities, area, offers, events, weddings, gallery).
 *  Value is stored as JSON text. */
export const contentBlocks = sqliteTable("content_blocks", {
  key: text("key").primaryKey(),
  value: text("value").notNull(), // JSON string
  updatedAt: integer("updated_at").notNull(),
});

// NOTE: the underlying SQLite column is still `subject` (legacy), but the
// public/form-facing field name is `topic`. The route handler maps topic↔subject
// so old DB rows continue to work and new submissions store the topic dropdown.
export const contactSubmissions = sqliteTable("contact_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: integer("created_at").notNull(),
});

// Public form schema — accepts `topic` from the contact form, which the
// server then maps to the `subject` column when persisting.
export const insertContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable().transform((v) => v || undefined),
  topic: z.string().max(120).optional().nullable().transform((v) => v || undefined),
  message: z.string().min(1).max(8000),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type ContentBlock = typeof contentBlocks.$inferSelect;

// ----- Menu download requests (gated PDF lead capture) -----
export const menuRequests = sqliteTable("menu_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  eventType: text("event_type").notNull(), // wedding, corporate, social, sports, bar, full
  eventDate: text("event_date"), // free-text date or estimate
  guestCount: text("guest_count"), // rough range
  menusRequested: text("menus_requested").notNull(), // JSON array of menu slugs
  notes: text("notes"),
  createdAt: integer("created_at").notNull(),
});

export const insertMenuRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable().transform((v) => v || undefined),
  eventType: z.string().min(1).max(60),
  eventDate: z.string().max(120).optional().nullable().transform((v) => v || undefined),
  guestCount: z.string().max(60).optional().nullable().transform((v) => v || undefined),
  menusRequested: z.array(z.string().max(80)).min(1).max(8),
  notes: z.string().max(2000).optional().nullable().transform((v) => v || undefined),
});

export type InsertMenuRequest = z.infer<typeof insertMenuRequestSchema>;
export type MenuRequest = typeof menuRequests.$inferSelect;
