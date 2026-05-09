import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer } from "node:http";
import type { Server } from "node:http";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import multer from "multer";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import nodemailer from "nodemailer";

// ----- Config -----
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cicero-admin";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "change-me-in-production-please-32-chars-min";
const SALES_EMAIL = process.env.SALES_EMAIL || "sales@cicerogrand.com";

// SMTP via WebHostingPad mailbox (mail.cicerogrand.com)
const SMTP_HOST = process.env.SMTP_HOST || "mail.cicerogrand.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || ""; // e.g. sales@cicerogrand.com
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM =
  process.env.SMTP_FROM ||
  (SMTP_USER ? `Cicero Grand Website <${SMTP_USER}>` : "");
// Port 465 = implicit TLS (secure: true). Port 587 = STARTTLS (secure: false, requireTLS: true).
const mailer =
  SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        requireTLS: SMTP_PORT === 587,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
    : null;

function escapeHtml(s: string | undefined | null): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Persistent upload directory. Locally we use ./uploads, in production
// (Railway) we expect a volume mounted at /data/uploads. If the configured
// path can't be created (e.g. volume not yet mounted), fall back to /tmp so
// the server still boots — uploads will not persist across redeploys until
// the volume is fixed.
function resolveUploadDir(): string {
  const configured =
    process.env.UPLOAD_DIR ||
    (process.env.NODE_ENV === "production" ? "/data/uploads" : "uploads");
  try {
    if (!fs.existsSync(configured)) {
      fs.mkdirSync(configured, { recursive: true });
    }
    fs.accessSync(configured, fs.constants.W_OK);
    return configured;
  } catch (err) {
    console.error(
      `[routes] cannot use upload dir ${configured} (${(err as Error).message}); falling back to /tmp/uploads. Uploads will NOT persist until the volume is mounted correctly.`,
    );
    const fallback = "/tmp/uploads";
    if (!fs.existsSync(fallback)) {
      fs.mkdirSync(fallback, { recursive: true });
    }
    return fallback;
  }
}
const UPLOAD_DIR = resolveUploadDir();
console.log(`[routes] uploads dir: ${UPLOAD_DIR}`);

// ----- Auth helpers (HMAC-signed cookie token, no extra deps) -----
function signToken(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [body, sig] = parts;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  if (sig !== expected) return false;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof data.exp !== "number") return false;
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token =
    req.cookies?.["cg_admin"] ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined);
  if (!verifyToken(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// ----- Multer for image upload -----
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const safe = crypto.randomBytes(8).toString("hex");
      cb(null, `${Date.now()}-${safe}${ext}`);
    },
  }),
  limits: { fileSize: 12 * 1024 * 1024 }, // 12 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image uploads allowed"));
  },
});

const VALID_KEYS = new Set([
  "site",
  "rooms",
  "amenities",
  "area",
  "offers",
  "events",
  "weddings",
  "gallery",
]);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(cookieParser());

  // Dedicated healthcheck endpoint — always returns 200 if the server is up.
  // Railway uses this to confirm a new deploy is healthy before swapping traffic.
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Serve uploaded images
  app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

  // ----- Public: read content -----
  app.get("/api/content/:key", async (req, res) => {
    const { key } = req.params;
    if (!VALID_KEYS.has(key)) {
      return res.status(404).json({ message: "Unknown content key" });
    }
    const block = await storage.getContent(key);
    if (!block) {
      // No override yet — frontend falls back to bundled JSON seed.
      return res.status(404).json({ message: "No override" });
    }
    try {
      const parsed = JSON.parse(block.value);
      return res.json(parsed);
    } catch {
      return res.status(500).json({ message: "Stored content is not valid JSON" });
    }
  });

  // ----- Public: contact form -----
  app.post("/api/contact", async (req, res) => {
    const parse = insertContactSchema.safeParse(req.body);
    if (!parse.success) {
      return res
        .status(400)
        .json({ message: "Invalid form data", errors: parse.error.flatten() });
    }
    const submission = await storage.createContact(parse.data);
    console.log(
      `[contact] new submission #${submission.id} from ${submission.email} (notify ${SALES_EMAIL})`
    );

    // Email notification via SMTP (mail.cicerogrand.com) if credentials configured
    if (mailer) {
      const { name, email, phone, topic, message } = parse.data;
      const subject = `New Cicero Grand inquiry: ${topic || "General question"} — ${name}`;
      const text = [
        `New inquiry from cicerogrand.com`,
        ``,
        `Topic:   ${topic || "General question"}`,
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Phone:   ${phone || "—"}`,
        ``,
        `Message:`,
        message,
        ``,
        `—`,
        `Submission #${submission.id} · admin: https://www.cicerogrand.com/admin`,
      ].join("\n");
      const html = `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;">
          <h2 style="font-family:Georgia,serif;font-size:24px;color:#a36b3f;margin:0 0 16px;">New inquiry from cicerogrand.com</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;width:120px;color:#666;">Topic</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(topic || "General question")}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone || "—")}</td></tr>
          </table>
          <div style="margin:24px 0 8px;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">Message</div>
          <div style="padding:16px;background:#f7f5f2;border-left:3px solid #a36b3f;border-radius:4px;white-space:pre-wrap;line-height:1.55;">${escapeHtml(message)}</div>
          <p style="margin-top:32px;font-size:12px;color:#999;">Submission #${submission.id} · also viewable in the <a href="https://www.cicerogrand.com/admin" style="color:#a36b3f;">admin panel</a>.</p>
        </div>
      `;
      try {
        await mailer.sendMail({
          from: SMTP_FROM,
          to: SALES_EMAIL,
          replyTo: email,
          subject,
          text,
          html,
        });
        console.log(`[contact] email sent to ${SALES_EMAIL} via ${SMTP_HOST} for submission #${submission.id}`);
      } catch (err) {
        console.error(`[contact] email send failed for #${submission.id}:`, err);
        // Don't fail the request — submission is already saved
      }
    } else {
      console.warn(
        `[contact] SMTP_USER/SMTP_PASS not set — submission #${submission.id} saved but no email sent`
      );
    }

    return res.json({ ok: true, id: submission.id });
  });

  // ----- Admin auth -----
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body || {};
    if (typeof password !== "string" || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const token = signToken({ role: "admin", exp });
    res.cookie("cg_admin", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    return res.json({ ok: true, token });
  });

  app.post("/api/admin/logout", (_req, res) => {
    res.clearCookie("cg_admin", { path: "/" });
    return res.json({ ok: true });
  });

  app.get("/api/admin/me", (req, res) => {
    const ok = verifyToken(req.cookies?.["cg_admin"]);
    return res.json({ authenticated: ok });
  });

  // ----- Admin: write content -----
  app.put("/api/admin/content/:key", requireAdmin, async (req, res) => {
    const { key } = req.params;
    if (!VALID_KEYS.has(key)) {
      return res.status(404).json({ message: "Unknown content key" });
    }
    // Body is the raw JSON object to store. We re-stringify so callers can
    // post the parsed object directly.
    const value = JSON.stringify(req.body);
    const block = await storage.setContent(key, value);
    return res.json({ ok: true, key: block.key, updatedAt: block.updatedAt });
  });

  // ----- Admin: image upload -----
  app.post(
    "/api/admin/upload",
    requireAdmin,
    upload.single("image"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      return res.json({
        ok: true,
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
      });
    }
  );

  return httpServer;
}
