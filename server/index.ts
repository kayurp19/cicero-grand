import "dotenv/config";
import express, { Response, NextFunction } from 'express';
import type { Request } from 'express';
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "node:http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// =====================================================================
// SEO canonicalization middleware
// 1. Force lowercase paths
// 2. Strip trailing slashes (except for root "/")
// 3. 301 redirect legacy aliases to their canonical URLs
// =====================================================================
const LEGACY_REDIRECTS: Record<string, string> = {
  "/area-guide": "/area",
  "/events": "/event-center",
  "/weddings": "/event-center/weddings",
  "/micron-long-stay": "/micron-crew-long-stay",
  // SEO consolidation (2026-06-24): homepage now ranks for "Hotels in Cicero NY".
  // Redirecting this duplicate page to homepage prevents keyword cannibalization
  // and pushes all its link equity to the page Google is already ranking.
  "/cicero-ny-hotels": "/",
};

app.use((req, res, next) => {
  // Only apply to GET/HEAD on non-API, non-admin, non-asset routes.
  // Skip anything with a file extension (e.g. /assets/index-Cmppl74e.js,
  // /favicon.png, /sitemap.xml) — Vite uses mixed-case hashed filenames
  // that must NOT be lowercased.
  if (
    (req.method !== "GET" && req.method !== "HEAD") ||
    req.path.startsWith("/api") ||
    req.path.startsWith("/admin") ||
    req.path.startsWith("/assets") ||
    /\.[a-zA-Z0-9]+$/.test(req.path)
  ) {
    return next();
  }

  let canonicalPath = req.path;

  // strip trailing slash (except root)
  if (canonicalPath.length > 1 && canonicalPath.endsWith("/")) {
    canonicalPath = canonicalPath.replace(/\/+$/, "");
  }

  // lowercase URL path (Google treats /Events and /events as duplicates)
  if (canonicalPath !== canonicalPath.toLowerCase()) {
    canonicalPath = canonicalPath.toLowerCase();
  }

  // legacy alias redirects
  if (LEGACY_REDIRECTS[canonicalPath]) {
    canonicalPath = LEGACY_REDIRECTS[canonicalPath];
  }

  // if we changed anything, 301 redirect
  if (canonicalPath !== req.path) {
    const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(301, canonicalPath + qs);
  }

  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
