# Cicero Grand — cicerogrand.com

Modern marketing site + lightweight CMS for the Cicero Grand all-suite hotel in Cicero, NY.

- Public site with hero, suites, amenities, area guide, offers, events, weddings, gallery, and contact
- Cloudbeds booking widget plus sticky "Book Now" CTAs throughout
- Admin panel at `/#/admin` for editing every section without touching code
- GitHub-based JSON editing as a backup workflow for power users

---

## Tech stack

- **Frontend:** Vite + React + TypeScript + Tailwind v3 + shadcn/ui + wouter (hash router)
- **Backend:** Express 5 + better-sqlite3 + Drizzle ORM
- **Auth:** HMAC-signed cookie (no third-party auth dependency)
- **Uploads:** multer disk storage, served from `/uploads`
- **Hosting:** Railway (single service, single port)

---

## Local development

```bash
npm install
cp .env.example .env   # then edit .env if you want non-default values
npm run dev            # starts Express + Vite on http://localhost:5000
```

Visit:
- `http://localhost:5000` — public site
- `http://localhost:5000/#/admin` — admin login (default password: `cicero-admin`)

The local SQLite database is created at `./data.db` and uploaded images go to `./uploads/`. Both are gitignored.

---

## Editing content — two ways

### A) Admin panel (recommended)

1. Go to `https://cicerogrand.com/#/admin`
2. Log in with the password you set in `ADMIN_PASSWORD`
3. Pick a section (Site Info, Suites, Amenities, Area, Offers, Events, Weddings, Gallery)
4. Edit fields, drag photos in, click **Save**
5. Refresh any public page to see the change

Changes are stored in the database — they survive redeploys as long as the Railway volume stays mounted at `/data`.

### B) GitHub (advanced)

The "factory defaults" for each section live as JSON files in [`client/src/content/`](client/src/content/). Edit those files in GitHub's web editor, commit, and Railway auto-deploys. These act as the fallback whenever the database has no override for a key.

> Heads-up: if you've already saved an override through the admin panel, the database value wins over the JSON file. To make a JSON edit visible, either delete the override in the admin panel or update the same field there too.

---

## Deploying to Railway

1. **Push this repo to GitHub.** Railway pulls from there.
2. In Railway, **New Project → Deploy from GitHub repo** and pick this one. Railway reads `railway.json` and uses NIXPACKS — no extra build config needed.
3. **Add a volume** for persistent storage:
   - Service → Settings → Volumes → **New Volume**
   - Mount path: `/data`
   - Pick the smallest size (1 GB is plenty for content + photos)
4. **Set environment variables** (Service → Variables):
   - `ADMIN_PASSWORD` — password for the admin panel
   - `SESSION_SECRET` — long random string (32+ chars). Generate with:
     ```
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `SALES_EMAIL=sales@sundhm.com`
   - `UPLOAD_DIR=/data/uploads`
   - `DATABASE_PATH=/data/data.db`
   - `NODE_ENV=production`
5. **Deploy.** Railway runs `npm ci && npm run build`, then `npm start` on the injected `PORT`.
6. **Connect cicerogrand.com:**
   - Service → Settings → Networking → **Custom Domain** → add `cicerogrand.com` and `www.cicerogrand.com`
   - At your domain registrar, point the records to the values Railway shows (typically a CNAME for `www` and an A/ALIAS for the apex)
   - Railway provisions an SSL certificate automatically

The healthcheck at `/api/content/site` confirms the server is live before Railway swaps traffic to a new deploy.

---

## Project structure

```
client/                React app (Vite)
  src/
    pages/             Public pages + /admin
    components/        Header, Footer, BookBar, etc.
    content/           JSON seed content (factory defaults — edit on GitHub)
    lib/content.ts     Reads /api/content/:key, falls back to seed JSON
server/
  index.ts             Express bootstrap
  routes.ts            Content API + auth + upload + contact
  storage.ts           Drizzle/SQLite layer
shared/schema.ts       content_blocks, contact_submissions tables
script/build.ts        Production bundler (vite build + esbuild server)
railway.json           Railway build & start config
.env.example           Environment variable reference
```

---

## Notes

- The Cloudbeds booking widget URL lives in `client/src/content/site.json` (`bookingUrl`). Update it from the **Site Info** editor in the admin panel — every "Book Now" button on the site reads from there.
- All photos in the public site come from `client/public/photos/`. New uploads from the admin panel are saved to `/data/uploads/` on Railway and referenced as `/uploads/<filename>`.
- If you ever lock yourself out of the admin panel, change `ADMIN_PASSWORD` in Railway and redeploy — the cookie is invalidated whenever `SESSION_SECRET` changes.
