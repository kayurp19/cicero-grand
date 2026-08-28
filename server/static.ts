import express from 'express';
import type { Express } from 'express';
import fs from "node:fs";
import path from "node:path";

// =============================================================================
// Per-route JSON-LD injection
// =============================================================================
// Why this exists: React injects route-specific schema (FAQPage, EventVenue,
// BreadcrumbList) via useSeo() AFTER hydration. Google's Rich Results Test
// and some crawlers don't wait long enough to see it. To guarantee discovery,
// we inject the same schema directly into the static HTML before React runs.
// =============================================================================

const SITE_URL = "https://www.cicerogrand.com";

const weddingsSchema = [
  {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": "The Cicero Grand — Weddings",
    "description": "Wedding venue near Syracuse, NY. Outside caterers welcome. Getting Ready Room for the wedding party and on-site hotel suites for guests. Rated 5.0/5.0 on WeddingWire.",
    "url": `${SITE_URL}/event-center/weddings`,
    "telephone": "+1-315-752-0150",
    "email": "sales@cicerogrand.com",
    "image": `${SITE_URL}/photos/venue-ballroom-empty.jpg`,
    "maximumAttendeeCapacity": 180,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "5875 Carmenica Drive",
      "addressLocality": "Cicero",
      "addressRegion": "NY",
      "postalCode": "13039",
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 43.1709, "longitude": -76.1146 }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "Can we host the ceremony and reception in the same room?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. We flip the room from ceremony to reception during cocktail hour — no second-venue logistics, no transportation gap, no extra rental fee." } },
      { "@type": "Question", "name": "Is a tasting included?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every plated and buffet wedding package includes a complimentary menu tasting for up to four guests." } },
      { "@type": "Question", "name": "Do you offer a guest-room block?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every wedding qualifies for a discounted block of suites at preferred rates, plus a complimentary suite for the couple on the wedding night." } },
      { "@type": "Question", "name": "Can we bring our own caterer?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes — and this is one of our biggest differences from most hotel venues. Many ballrooms force you to use their kitchen. We welcome outside licensed caterers, including cultural and family-owned restaurants." } },
      { "@type": "Question", "name": "What about other outside vendors?",
        "acceptedAnswer": { "@type": "Answer", "text": "Florists, photographers, videographers, DJs, bands, and officiants are all welcome. We can recommend trusted local vendors or work with anyone you choose." } },
      { "@type": "Question", "name": "What about decor and setup?",
        "acceptedAnswer": { "@type": "Answer", "text": "Tables, chairs, linens, china, glassware, and silverware are included. We set up the room to your floor plan and break it down after the event." } },
      { "@type": "Question", "name": "How far in advance should we book?",
        "acceptedAnswer": { "@type": "Answer", "text": "Most weddings book 9–18 months ahead. Saturday evenings during peak season (May–October) book first, so reach out as early as you can." } }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Event Center", "item": `${SITE_URL}/event-center` },
      { "@type": "ListItem", "position": 3, "name": "Weddings", "item": `${SITE_URL}/event-center/weddings` }
    ]
  }
];

const corporateSchema = [
  {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": "The Cicero Grand — Corporate Meetings & Conferences",
    "description": "Corporate meeting venue near Syracuse, NY. A/V, in-house catering (or bring your own), and on-site hotel suites for attendees.",
    "url": `${SITE_URL}/event-center/corporate-meetings`,
    "telephone": "+1-315-752-0150",
    "email": "sales@cicerogrand.com",
    "image": `${SITE_URL}/photos/venue-ballroom-empty.jpg`,
    "maximumAttendeeCapacity": 220,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "5875 Carmenica Drive",
      "addressLocality": "Cicero",
      "addressRegion": "NY",
      "postalCode": "13039",
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 43.1709, "longitude": -76.1146 }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Event Center", "item": `${SITE_URL}/event-center` },
      { "@type": "ListItem", "position": 3, "name": "Corporate Meetings", "item": `${SITE_URL}/event-center/corporate-meetings` }
    ]
  }
];

const ROUTE_SCHEMA: Record<string, { title: string; description: string; schema: object[] }> = {
  "/event-center/weddings": {
    title: "Syracuse Wedding Venue · 5.0 ★ WeddingWire · Bring Your Own Caterer | The Cicero Grand",
    description: "Rated 5.0/5.0 on WeddingWire. Flexible Syracuse-area ballroom with outside caterers welcome. Getting Ready Room for the wedding party and on-site guest rooms. Open bar packages. Tour the venue — call (315) 752-0150.",
    schema: weddingsSchema,
  },
  "/event-center/corporate-meetings": {
    title: "Meeting Rooms Syracuse NY · Free A/V, Wi-Fi & Parking | The Cicero Grand",
    description: "Conference & meeting rooms 6 min from Micron, off I-81 Exit 98. Free A/V, Wi-Fi & parking. Catered breakfast and lunch packages. Discounted suite blocks for out-of-town attendees. Call (315) 752-0150.",
    schema: corporateSchema,
  },
};

function injectRouteSchema(html: string, route: string): string {
  const config = ROUTE_SCHEMA[route];
  if (!config) return html;

  const scriptBlocks = config.schema
    .map((s) => `    <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n    </script>`)
    .join("\n");

  // Inject route-specific schema right before </head>
  let out = html.replace("</head>", `${scriptBlocks}\n  </head>`);

  // Override the <title> for this route
  out = out.replace(
    /<title>[^<]*<\/title>/,
    `<title>${config.title}</title>`
  );

  // Override the meta description
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${config.description}" />`
  );

  // Update canonical
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${SITE_URL}${route}" />`
  );

  return out;
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Read index.html once at startup
  const indexHtmlPath = path.resolve(distPath, "index.html");
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  app.use(express.static(distPath, { index: false }));

  // SPA fallback: serve index.html for any non-asset route, with per-route
  // schema injected when applicable. Refuse to serve HTML for asset-like
  // paths (e.g. .js, .css, .png) so a missing asset returns 404 instead of
  // an HTML page that the browser tries to execute as JS — which silently
  // blanks the page.
  // NOTE: Express 5's app.use mounts at a prefix, so req.path inside the
  // handler is RELATIVE to the mount point (always "/" when mounted at "/").
  // We must use req.originalUrl (minus the querystring) to get the actual
  // request path for per-route schema lookups.
  app.use((req, res) => {
    const fullPath = req.originalUrl.split("?")[0];

    if (/\.[a-zA-Z0-9]+$/.test(fullPath)) {
      return res.status(404).type("text/plain").send("Not found");
    }
    const route = fullPath.replace(/\/+$/, "") || "/";
    const html = injectRouteSchema(indexHtml, route);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
}
