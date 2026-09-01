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
import { insertContactSchema, insertMenuRequestSchema, insertEmailLeadSchema } from "@shared/schema";
import nodemailer from "nodemailer";

// ----- Config -----
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cicero-admin";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "change-me-in-production-please-32-chars-min";
// Comma-separated list supported, e.g. "sales@cicerogrand.com,sales@sundhm.com".
// Avoids relying on flaky shared-host forwarders (Microsoft 365 silently drops
// forwards that fail SPF re-check).
const SALES_EMAIL = process.env.SALES_EMAIL || "sales@cicerogrand.com";
const SALES_EMAILS: string[] = SALES_EMAIL
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// ----- Email config -----
// Preferred: Resend HTTPS API (Railway blocks outbound SMTP).
// Fallback: nodemailer SMTP (works locally, blocked on Railway).
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const DIAG_KEY = process.env.DIAG_KEY || "";

const SMTP_HOST = process.env.SMTP_HOST || "mail.cicerogrand.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM =
  process.env.SMTP_FROM ||
  (RESEND_API_KEY
    ? "Cicero Grand Website <hello@cicerogrand.com>"
    : SMTP_USER
    ? `Cicero Grand Website <${SMTP_USER}>`
    : "");

function usingResendApi(): boolean {
  return !!RESEND_API_KEY;
}

async function sendViaResend(args: {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}): Promise<any> {
  const payload: any = {
    from: args.from,
    to: Array.isArray(args.to) ? args.to : [args.to],
    subject: args.subject,
    text: args.text,
    html: args.html,
  };
  if (args.replyTo) payload.reply_to = args.replyTo;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const bodyText = await r.text();
  let json: any = null;
  try {
    json = JSON.parse(bodyText);
  } catch {}
  if (!r.ok) {
    const err: any = new Error(
      `Resend API ${r.status}: ${(json && json.message) || bodyText.slice(0, 200)}`
    );
    err.status = r.status;
    err.responseBody = json || bodyText;
    throw err;
  }
  return json;
}

// SMTP fallback (will time out on Railway — kept only for local dev)
const mailer =
  !RESEND_API_KEY && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        requireTLS: SMTP_PORT === 587,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        tls: { rejectUnauthorized: false },
        logger: process.env.SMTP_DEBUG === "1",
        debug: process.env.SMTP_DEBUG === "1",
      })
    : null;

console.log(
  `[mail] mode=${
    usingResendApi() ? "resend-https" : mailer ? "smtp" : "none"
  } from="${SMTP_FROM}" to="${SALES_EMAILS.join(", ")}"`
);

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
  "testimonials",
]);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(cookieParser());

  // Dedicated healthcheck endpoint — always returns 200 if the server is up.
  // Railway uses this to confirm a new deploy is healthy before swapping traffic.
  // ----- Dynamic sitemap.xml -----
  // Stamped with today's date on every request so Google sees fresh `lastmod`
  // values and recrawls regularly. Static sitemap files go stale and Google
  // de-prioritizes recrawling them, which kills indexing freshness.
  const SITEMAP_URLS: Array<{ path: string; changefreq: string; priority: string }> = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/rooms", changefreq: "weekly", priority: "0.9" },
    { path: "/amenities", changefreq: "monthly", priority: "0.7" },
    { path: "/area-guide", changefreq: "monthly", priority: "0.8" },
    { path: "/event-center", changefreq: "weekly", priority: "0.95" },
    { path: "/event-center/corporate-meetings", changefreq: "weekly", priority: "0.9" },
    { path: "/event-center/social-events", changefreq: "weekly", priority: "0.9" },
    { path: "/event-center/weddings", changefreq: "weekly", priority: "0.9" },
    { path: "/event-center/menus", changefreq: "weekly", priority: "0.9" },
    { path: "/offers", changefreq: "weekly", priority: "0.9" },
    { path: "/packages", changefreq: "weekly", priority: "0.9" },
    { path: "/direct-perks", changefreq: "weekly", priority: "0.85" },
    { path: "/gallery", changefreq: "monthly", priority: "0.7" },
    { path: "/contact", changefreq: "monthly", priority: "0.6" },
    { path: "/micron-crew-long-stay", changefreq: "weekly", priority: "0.85" },
    // SEO landing pages (geo + intent)
    { path: "/hotels-syracuse-ny", changefreq: "weekly", priority: "0.9" },
    { path: "/hotel-syracuse-ny", changefreq: "weekly", priority: "0.9" },
    { path: "/cicero-ny-hotels", changefreq: "weekly", priority: "0.9" },
    { path: "/hotels-near-micron", changefreq: "weekly", priority: "0.9" },
    { path: "/hotels-near-syracuse-airport", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-destiny-usa", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-jma-wireless-dome", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-turning-stone", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-empower-amphitheater", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-upstate-medical", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-nys-fair", changefreq: "weekly", priority: "0.85" },
    { path: "/pet-friendly-hotels-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-brewerton-ny", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-clay-ny", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-baldwinsville-ny", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-east-syracuse-ny", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-liverpool-ny", changefreq: "weekly", priority: "0.85" },
    // Corporate & institutional landing pages
    { path: "/hotels-near-lockheed-martin-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-srctec-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-rtx-raytheon-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-national-grid-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-syracuse-university", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-crouse-hospital", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-st-josephs-hospital-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-va-medical-center-syracuse", changefreq: "weekly", priority: "0.85" },
    { path: "/hotels-near-le-moyne-college", changefreq: "weekly", priority: "0.8" },
    // Legal
    { path: "/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
    { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
  ];

  app.get(["/sitemap.xml", "/sitemap"], (_req, res) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      SITEMAP_URLS.map(
        (u) =>
          `  <url>\n` +
          `    <loc>https://www.cicerogrand.com${u.path}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`,
      ).join("\n") +
      `\n</urlset>\n`;
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600"); // 1h cache
    res.send(xml);
  });

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Serve uploaded images
  app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

  // ----- 301 redirects: legacy URLs → Event Center -----
  // Preserves SEO ranking when consolidating /events + /weddings into /event-center.
  const legacyRedirects: Record<string, string> = {
    "/events": "/event-center",
    "/events/": "/event-center",
    "/weddings": "/event-center/weddings",
    "/weddings/": "/event-center/weddings",
  };
  for (const [from, to] of Object.entries(legacyRedirects)) {
    app.get(from, (_req, res) => res.redirect(301, to));
  }

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

    // Respond to the user RIGHT NOW so the form button doesn't hang on slow/timing-out SMTP.
    // Email notification fires in the background; failures are logged but never block the user.
    res.json({ ok: true, id: submission.id });

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

    if (usingResendApi()) {
      console.log(
        `[contact] sending #${submission.id} via Resend HTTPS → ${SALES_EMAILS.join(", ")}`
      );
      sendViaResend({
        from: SMTP_FROM,
        to: SALES_EMAILS,
        replyTo: email,
        subject,
        text,
        html,
      })
        .then((info: any) => {
          console.log(
            `[contact] Resend OK for #${submission.id}: id=${info?.id || "?"}`
          );
        })
        .catch((err: any) => {
          console.error(
            `[contact] Resend FAILED for #${submission.id}: status=${err?.status} message=${err?.message} body=${JSON.stringify(err?.responseBody)?.slice(0, 400)}`
          );
        });
    } else if (mailer) {
      console.log(
        `[contact] sending #${submission.id} via SMTP ${SMTP_HOST}:${SMTP_PORT} → ${SALES_EMAILS.join(", ")}`
      );
      mailer
        .sendMail({
          from: SMTP_FROM,
          to: SALES_EMAILS.join(", "),
          replyTo: email,
          subject,
          text,
          html,
        })
        .then((info) => {
          console.log(
            `[contact] SMTP OK for #${submission.id}: messageId=${info.messageId}`
          );
        })
        .catch((err: any) => {
          console.error(
            `[contact] SMTP FAILED for #${submission.id}: code=${err?.code} message=${err?.message}`
          );
        });
    } else {
      console.warn(
        `[contact] no email transport configured — submission #${submission.id} saved but no email sent`
      );
    }
    return;
  });

  // ----- Menu PDF lead-capture -----
  // POST /api/menu-request — captures lead, emails sales@ + sends PDF links to user.
  const MENU_CATALOG: Record<string, { title: string; file: string }> = {
    "master-banquet-packages": { title: "Master Banquet Packages (All Menus)", file: "cicero-grand-menu-master-banquet-packages.pdf" },
    "weddings": { title: "Wedding Reception Menus", file: "cicero-grand-menu-weddings.pdf" },
    "corporate-meetings": { title: "Corporate Meetings & Conferences", file: "cicero-grand-menu-corporate-meetings.pdf" },
    "social-events": { title: "Social Events (Showers, Birthdays, Reunions)", file: "cicero-grand-menu-social-events.pdf" },
    "sports-teams": { title: "Sports Teams & Tournament Travel", file: "cicero-grand-menu-sports-teams.pdf" },
    "hosted-open-bar": { title: "Hosted Open Bar Package", file: "cicero-grand-menu-hosted-open-bar.pdf" },
  };

  app.post("/api/menu-request", async (req, res) => {
    const parse = insertMenuRequestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ message: "Invalid form data", errors: parse.error.flatten() });
    }
    // Filter to known menus only.
    const validMenus = parse.data.menusRequested.filter((m) => MENU_CATALOG[m]);
    if (validMenus.length === 0) {
      return res.status(400).json({ message: "No valid menus selected" });
    }
    const data = { ...parse.data, menusRequested: validMenus };
    const submission = await storage.createMenuRequest(data);
    console.log(`[menu-request] new #${submission.id} from ${data.email} (${validMenus.length} menu(s))`);

    // Respond immediately — emails fire in the background.
    const downloadLinks = validMenus.map((slug) => ({
      slug,
      title: MENU_CATALOG[slug].title,
      url: `/menus/${MENU_CATALOG[slug].file}`,
    }));
    res.json({ ok: true, id: submission.id, downloads: downloadLinks });

    const { name, email, phone, eventType, eventDate, guestCount, notes } = data;
    const menuList = validMenus.map((s) => `• ${MENU_CATALOG[s].title}`).join("\n");

    // --- Internal notification to sales@ ---
    const internalSubject = `Menu request: ${eventType} — ${name}${guestCount ? ` (${guestCount} guests)` : ""}`;
    const internalText = [
      `New menu download request from cicerogrand.com`,
      ``,
      `Name:        ${name}`,
      `Email:       ${email}`,
      `Phone:       ${phone || "—"}`,
      `Event Type:  ${eventType}`,
      `Event Date:  ${eventDate || "—"}`,
      `Guest Count: ${guestCount || "—"}`,
      ``,
      `Menus requested:`,
      menuList,
      ``,
      `Notes:`,
      notes || "(none)",
      ``,
      `— Submission #${submission.id}`,
    ].join("\n");
    const internalHtml = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;">
        <h2 style="font-family:Georgia,serif;font-size:24px;color:#a36b3f;margin:0 0 8px;">New menu request</h2>
        <p style="margin:0 0 16px;color:#666;font-size:14px;">Lead captured from /menus on cicerogrand.com</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;width:140px;color:#666;">Event Type</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(eventType)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Name</td><td style="padding:6px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;">${escapeHtml(phone || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Event Date</td><td style="padding:6px 0;">${escapeHtml(eventDate || "—")}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Guest Count</td><td style="padding:6px 0;">${escapeHtml(guestCount || "—")}</td></tr>
        </table>
        <div style="margin:20px 0 6px;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">Menus requested</div>
        <ul style="margin:0;padding-left:18px;line-height:1.7;">${validMenus.map((s) => `<li>${escapeHtml(MENU_CATALOG[s].title)}</li>`).join("")}</ul>
        ${notes ? `<div style="margin:20px 0 6px;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">Notes</div><div style="padding:12px;background:#f7f5f2;border-left:3px solid #a36b3f;border-radius:4px;white-space:pre-wrap;line-height:1.55;">${escapeHtml(notes)}</div>` : ""}
        <p style="margin-top:28px;font-size:12px;color:#999;">Submission #${submission.id} · <a href="https://www.cicerogrand.com/admin" style="color:#a36b3f;">admin panel</a></p>
      </div>
    `;

    // --- Auto-reply to the requester with PDF links ---
    const replySubject = `Your Cicero Grand banquet menus`;
    const linksHtml = validMenus
      .map((s) => `<li style="margin:8px 0;"><a href="https://www.cicerogrand.com/menus/${MENU_CATALOG[s].file}" style="color:#a36b3f;font-weight:600;text-decoration:none;">${escapeHtml(MENU_CATALOG[s].title)} →</a></li>`)
      .join("");
    const linksText = validMenus
      .map((s) => `• ${MENU_CATALOG[s].title}\n  https://www.cicerogrand.com/menus/${MENU_CATALOG[s].file}`)
      .join("\n\n");
    const replyText = [
      `Hi ${name},`,
      ``,
      `Thanks for your interest in The Cicero Grand. Your requested menus are linked below:`,
      ``,
      linksText,
      ``,
      `A member of our event team will follow up shortly with availability and a custom quote for your ${eventType.toLowerCase()}.`,
      ``,
      `Questions? Just reply to this email or call (315) 752-0150.`,
      ``,
      `— The Cicero Grand`,
      `5875 Carmenica Drive · Cicero, NY 13039`,
      `sales@cicerogrand.com · (315) 752-0150`,
      `www.cicerogrand.com`,
    ].join("\n");
    const replyHtml = `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
        <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #d4cdb8;">
          <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#a36b3f;">The Cicero Grand</div>
          <div style="font-size:13px;color:#6b6b6b;margin-top:4px;">Event Center · Cicero, NY</div>
        </div>
        <h2 style="font-size:24px;margin:28px 0 12px;color:#1a1a1a;">Your menus are ready.</h2>
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;margin:0 0 18px;">Hi ${escapeHtml(name)} — thanks for your interest. Click below to open your requested menu${validMenus.length > 1 ? "s" : ""}:</p>
        <ul style="font-family:system-ui,sans-serif;font-size:15px;padding-left:20px;margin:0 0 24px;">${linksHtml}</ul>
        <div style="padding:16px 20px;background:#f5f0e6;border-left:3px solid #a36b3f;border-radius:2px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;color:#1a1a1a;">
          A member of our event team will follow up shortly with availability and a custom quote for your <strong>${escapeHtml(eventType.toLowerCase())}</strong>.
        </div>
        <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;margin:24px 0 0;">Questions? Reply to this email or call <a href="tel:+13157520150" style="color:#a36b3f;text-decoration:none;font-weight:600;">(315) 752-0150</a>.</p>
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #d4cdb8;font-family:system-ui,sans-serif;font-size:12px;color:#6b6b6b;line-height:1.55;">
          The Cicero Grand · 5875 Carmenica Drive, Cicero, NY 13039<br>
          <a href="mailto:sales@cicerogrand.com" style="color:#a36b3f;text-decoration:none;">sales@cicerogrand.com</a> · <a href="tel:+13157520150" style="color:#a36b3f;text-decoration:none;">(315) 752-0150</a> · <a href="https://www.cicerogrand.com" style="color:#a36b3f;text-decoration:none;">www.cicerogrand.com</a>
        </div>
      </div>
    `;

    const sendEmail = async (to: string | string[], replyTo: string | undefined, subject: string, text: string, html: string, tag: string) => {
      if (usingResendApi()) {
        try {
          const info: any = await sendViaResend({ from: SMTP_FROM, to, replyTo, subject, text, html });
          console.log(`[menu-request] ${tag} Resend OK for #${submission.id}: id=${info?.id || "?"}`);
        } catch (err: any) {
          console.error(`[menu-request] ${tag} Resend FAILED for #${submission.id}: ${err?.message}`);
        }
      } else if (mailer) {
        try {
          const info = await mailer.sendMail({ from: SMTP_FROM, to: Array.isArray(to) ? to.join(", ") : to, replyTo, subject, text, html });
          console.log(`[menu-request] ${tag} SMTP OK for #${submission.id}: ${info.messageId}`);
        } catch (err: any) {
          console.error(`[menu-request] ${tag} SMTP FAILED for #${submission.id}: ${err?.message}`);
        }
      } else {
        console.warn(`[menu-request] no transport — #${submission.id} ${tag} email skipped`);
      }
    };

    sendEmail(SALES_EMAILS, email, internalSubject, internalText, internalHtml, "internal");
    sendEmail(email, undefined, replySubject, replyText, replyHtml, "auto-reply");
    return;
  });

  // List menu requests (admin)
  app.get("/api/admin/menu-requests", requireAdmin, async (_req, res) => {
    const rows = await storage.listMenuRequests();
    res.json(rows.map((r) => ({ ...r, menusRequested: JSON.parse(r.menusRequested) })));
  });

  // ----- Email leads (popup $15 coupon signup) -----
  const PROMO_CODE = process.env.PROMO_CODE || "WELCOME15";
  const PROMO_AMOUNT = "$15";
  const PROMO_VALIDITY_DAYS = 60;
  const POPUP_COOKIE_NAME = "cg_popup";
  const POPUP_COOKIE_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000; // 180 days

  function setPopupCookie(res: Response, state: "claimed" | "dismissed") {
    res.cookie(POPUP_COOKIE_NAME, state, {
      maxAge: POPUP_COOKIE_MAX_AGE_MS,
      httpOnly: false, // readable by client so it can skip fetch on repeat visits
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  // GET /api/email-lead/status — cheap check: has this device already claimed / dismissed?
  // Popup calls this on mount before arming any triggers.
  app.get("/api/email-lead/status", (req, res) => {
    const state = req.cookies?.[POPUP_COOKIE_NAME] || null;
    res.json({ state }); // { state: "claimed" | "dismissed" | null }
  });

  // POST /api/email-lead/dismiss — user closed the popup without submitting.
  // Silences it for this device for a shorter window (30 days).
  app.post("/api/email-lead/dismiss", (_req, res) => {
    res.cookie(POPUP_COOKIE_NAME, "dismissed", {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.json({ ok: true });
  });

  app.post("/api/email-lead", async (req, res) => {
    const parse = insertEmailLeadSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ ok: false, message: "Please enter a valid email address." });
    }
    const email = parse.data.email.toLowerCase().trim();
    const firstName = parse.data.firstName?.trim();
    const sourcePage = parse.data.sourcePage;

    // Duplicate protection: same email = return same code, don't re-email.
    const existing = await storage.getEmailLead(email);
    if (existing) {
      setPopupCookie(res, "claimed");
      return res.json({
        ok: true,
        alreadyClaimed: true,
        promoCode: existing.promoCode,
        message: "You've already claimed your discount. Here's your code again.",
      });
    }

    const ipAddress = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
    const userAgent = (req.headers["user-agent"] as string || "").slice(0, 500);

    const lead = await storage.createEmailLead({
      email,
      firstName,
      sourcePage,
      promoCode: PROMO_CODE,
      ipAddress,
      userAgent,
    });
    console.log(`[email-lead] new #${lead.id} from ${email} (source: ${sourcePage || "unknown"})`);

    setPopupCookie(res, "claimed");
    res.json({
      ok: true,
      alreadyClaimed: false,
      promoCode: PROMO_CODE,
      message: `Your ${PROMO_AMOUNT} off code is on its way.`,
    });

    // Fire-and-forget auto-reply with code.
    const greetingName = firstName ? escapeHtml(firstName) : "there";
    const replySubject = `Your ${PROMO_AMOUNT} off code for The Cicero Grand`;
    const replyText = [
      `Hi ${firstName || "there"},`,
      ``,
      `Thanks for signing up. Here's your ${PROMO_AMOUNT} off code:`,
      ``,
      `    ${PROMO_CODE}`,
      ``,
      `How to use it:`,
      `• Book direct at www.cicerogrand.com`,
      `• Enter code ${PROMO_CODE} at checkout, OR mention it at check-in`,
      `• Valid ${PROMO_VALIDITY_DAYS} days from today`,
      `• Direct bookings only — not valid on Expedia, Booking.com, or other OTAs`,
      `• One use per guest`,
      ``,
      `Book here: https://www.cicerogrand.com`,
      ``,
      `Questions? Reply to this email or call (315) 752-0150.`,
      ``,
      `— The Cicero Grand`,
      `5875 Carmenica Drive · Cicero, NY 13039`,
      `www.cicerogrand.com · (315) 752-0150`,
    ].join("\n");
    const replyHtml = `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;background:#ffffff;">
        <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #d4cdb8;">
          <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#a36b3f;">The Cicero Grand</div>
          <div style="font-size:13px;color:#6b6b6b;margin-top:4px;">All-Suite Hotel · Cicero, NY</div>
        </div>
        <h2 style="font-size:26px;margin:28px 0 10px;color:#1a1a1a;">Your ${PROMO_AMOUNT} off is here.</h2>
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;margin:0 0 24px;">Hi ${greetingName} — thanks for signing up. Your one-time discount code is below.</p>
        <div style="text-align:center;padding:28px 20px;background:#f5f0e6;border:2px dashed #a36b3f;border-radius:6px;margin:0 0 24px;">
          <div style="font-family:system-ui,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#6b6b6b;margin-bottom:8px;">Your code</div>
          <div style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;letter-spacing:0.15em;color:#a36b3f;">${PROMO_CODE}</div>
          <div style="font-family:system-ui,sans-serif;font-size:13px;color:#6b6b6b;margin-top:10px;">${PROMO_AMOUNT} off · direct bookings only · valid ${PROMO_VALIDITY_DAYS} days</div>
        </div>
        <div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.7;color:#1a1a1a;margin:0 0 24px;">
          <strong style="display:block;margin-bottom:6px;">How to use it</strong>
          • Book direct at <a href="https://www.cicerogrand.com" style="color:#a36b3f;text-decoration:none;font-weight:600;">cicerogrand.com</a><br>
          • Enter <strong>${PROMO_CODE}</strong> at checkout — or mention it at check-in<br>
          • Valid ${PROMO_VALIDITY_DAYS} days from today<br>
          • Direct bookings only (not valid on Expedia, Booking.com, or other OTAs)<br>
          • One use per guest
        </div>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="https://www.cicerogrand.com" style="display:inline-block;padding:14px 32px;background:#a36b3f;color:#ffffff;text-decoration:none;border-radius:2px;font-family:system-ui,sans-serif;font-size:15px;font-weight:600;letter-spacing:0.03em;">Book direct now</a>
        </div>
        <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;margin:24px 0 0;">Questions? Reply to this email or call <a href="tel:+13157520150" style="color:#a36b3f;text-decoration:none;font-weight:600;">(315) 752-0150</a>.</p>
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #d4cdb8;font-family:system-ui,sans-serif;font-size:12px;color:#6b6b6b;line-height:1.55;">
          The Cicero Grand · 5875 Carmenica Drive, Cicero, NY 13039<br>
          <a href="mailto:hello@cicerogrand.com" style="color:#a36b3f;text-decoration:none;">hello@cicerogrand.com</a> · <a href="tel:+13157520150" style="color:#a36b3f;text-decoration:none;">(315) 752-0150</a> · <a href="https://www.cicerogrand.com" style="color:#a36b3f;text-decoration:none;">www.cicerogrand.com</a>
        </div>
      </div>
    `;

    (async () => {
      if (usingResendApi()) {
        try {
          const info: any = await sendViaResend({ from: SMTP_FROM, to: email, subject: replySubject, text: replyText, html: replyHtml });
          console.log(`[email-lead] code email Resend OK for #${lead.id}: id=${info?.id || "?"}`);
        } catch (err: any) {
          console.error(`[email-lead] code email Resend FAILED for #${lead.id}: ${err?.message}`);
        }
      } else if (mailer) {
        try {
          const info = await mailer.sendMail({ from: SMTP_FROM, to: email, subject: replySubject, text: replyText, html: replyHtml });
          console.log(`[email-lead] code email SMTP OK for #${lead.id}: ${info.messageId}`);
        } catch (err: any) {
          console.error(`[email-lead] code email SMTP FAILED for #${lead.id}: ${err?.message}`);
        }
      } else {
        console.warn(`[email-lead] no transport — #${lead.id} code email skipped (code was: ${PROMO_CODE})`);
      }
    })();

    return;
  });

  // List email leads (admin)
  app.get("/api/admin/email-leads", requireAdmin, async (_req, res) => {
    const rows = await storage.listEmailLeads();
    res.json(rows);
  });

  // CSV export of email leads (admin)
  app.get("/api/admin/email-leads.csv", requireAdmin, async (_req, res) => {
    const rows = await storage.listEmailLeads(10000);
    const header = ["id", "email", "first_name", "source_page", "promo_code", "claimed", "created_at", "ip_address"];
    const escapeCsv = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        r.id,
        r.email,
        r.firstName || "",
        r.sourcePage || "",
        r.promoCode,
        r.claimed,
        new Date(r.createdAt).toISOString(),
        r.ipAddress || "",
      ].map(escapeCsv).join(","));
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="cicero-grand-email-leads-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(lines.join("\n"));
  });

  // ----- Email diagnostic -----
  // Hit GET /api/smtp-verify?key=<DIAG_KEY> to confirm Resend key + domain.
  app.get("/api/smtp-verify", async (req: Request, res: Response) => {
    if (!DIAG_KEY || req.query.key !== DIAG_KEY) {
      return res.status(404).json({ ok: false });
    }
    if (usingResendApi()) {
      try {
        const r = await fetch("https://api.resend.com/domains", {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
        });
        const body = await r.text();
        let json: any = null;
        try {
          json = JSON.parse(body);
        } catch {}
        return res.json({
          ok: r.ok,
          mode: "resend-https-api",
          status: r.status,
          from: SMTP_FROM,
          to: SALES_EMAILS,
          response: json || body.slice(0, 400),
        });
      } catch (err: any) {
        return res.json({
          ok: false,
          mode: "resend-https-api",
          error: err?.message || "unknown",
        });
      }
    }
    if (!mailer) {
      return res.json({ ok: false, mode: "none", error: "no transport configured" });
    }
    try {
      const ok = await mailer.verify();
      return res.json({
        ok,
        mode: "smtp",
        host: SMTP_HOST,
        port: SMTP_PORT,
        from: SMTP_FROM,
        to: SALES_EMAILS,
      });
    } catch (err: any) {
      return res.json({
        ok: false,
        mode: "smtp",
        code: err?.code,
        message: err?.message,
      });
    }
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

  // ----- Admin: list/view/delete contact submissions -----
  app.get("/api/admin/submissions", requireAdmin, async (_req, res) => {
    const items = await storage.listContacts(500);
    // Map DB column `subject` back to public name `topic` so the admin UI
    // matches what users actually selected on the form.
    const mapped = items.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      topic: s.subject,
      message: s.message,
      createdAt: s.createdAt,
    }));
    return res.json({ items: mapped });
  });

  app.get("/api/admin/submissions/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Bad id" });
    const item = await storage.getContact(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      topic: item.subject,
      message: item.message,
      createdAt: item.createdAt,
    });
  });

  app.delete("/api/admin/submissions/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Bad id" });
    await storage.deleteContact(id);
    return res.json({ ok: true });
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
