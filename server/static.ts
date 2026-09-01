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
  "/": {
    title: "Cicero Grand · All-Suite Hotel · Free Breakfast + Pool · Cicero NY",
    description: "All-suite hotel off I-81 Exit 98, 10 min from downtown Syracuse & 6 min from Micron. Free hot breakfast, indoor heated pool, free parking, pet friendly. Book direct & save — best rate guaranteed. Call (315) 752-0150.",
    schema: [],
  },
  "/rooms": {
    title: "All-Suite Hotel Rooms · Sleeps 4 · Kitchenette · Cicero Grand Syracuse NY",
    description: "Every room is a suite — sleeps 4 with kitchenette, separate living area, 55\" smart TV. King, queen, and accessible options. Free breakfast + parking. Book direct at (315) 752-0150.",
    schema: [],
  },
  "/amenities": {
    title: "Free Breakfast · Indoor Pool · Pet Friendly · Cicero Grand Hotel NY",
    description: "Free hot breakfast every morning, heated indoor pool, 24-hr fitness center, fast free Wi-Fi, free parking, pet friendly, 100% smoke-free. Cicero NY · off I-81 Exit 98.",
    schema: [],
  },
  "/area": {
    title: "Things to Do Near Cicero NY · Syracuse Attractions Guide | Cicero Grand",
    description: "Oneida Lake, Destiny USA, downtown Syracuse, Green Lakes State Park, NBT Bank Stadium, Empower Amphitheater — all minutes from The Cicero Grand. Local dining, shopping & event guide.",
    schema: [],
  },
  "/offers": {
    title: "Hotel Deals & Special Offers · The Cicero Grand · Syracuse NY",
    description: "Book direct and save. Weekly and monthly long-stay rates, weekend getaway packages, sports team blocks, and Micron crew rates. Best price guaranteed — call (315) 752-0150.",
    schema: [],
  },
  "/direct-perks": {
    title: "Book Direct & Save · Free Upgrade + Late Checkout · Cicero Grand",
    description: "Skip Expedia. Book direct for the lowest rate, free room upgrade at check-in, late checkout to 1 PM, welcome water + snack, and 10% off your next stay. Call (315) 752-0150.",
    schema: [],
  },
  "/micron-crew-long-stay": {
    title: "Micron Crew Housing · 6 min from White Pine Fab · Cicero Grand",
    description: "Closest all-suite hotel to Micron's Clay megafab — 6 min off I-81 Exit 98. Weekly & monthly crew rates, kitchenettes, free breakfast, laundry, secure parking for trucks. Call (315) 752-0150.",
    schema: [],
  },
  "/event-center": {
    title: "Syracuse Event Venue · Weddings, Banquets, Meetings | The Cicero Grand",
    description: "Syracuse-area event center for weddings, corporate meetings, sports teams, showers, milestones, and celebrations of life. Outside caterers welcome. Tour — (315) 752-0150.",
    schema: [],
  },
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
  "/event-center/social-events": {
    title: "Syracuse Banquet Hall · Showers, Birthdays, Reunions | The Cicero Grand",
    description: "Private banquet hall in Cicero, NY for showers, birthdays, quinces, reunions & celebrations of life. Outside caterers welcome. 40–180 guests. Call (315) 752-0150.",
    schema: [],
  },
  "/contact": {
    title: "Contact The Cicero Grand · (315) 752-0150 · Cicero NY",
    description: "The Cicero Grand · 5875 Carmenica Dr, Cicero, NY 13039 · (315) 752-0150. Front desk 24/7. Book direct or email hello@cicerogrand.com.",
    schema: [],
  },
  "/gallery": {
    title: "Photo Gallery · The Cicero Grand Hotel · Cicero NY",
    description: "Photos of our suites, indoor pool, event center, and Cicero NY hotel. See the difference before you book.",
    schema: [],
  },
  // SEO landing pages (2026-08-31): server-side title/description for geo + intent queries.
  // Previously these pages inherited the homepage <title>, which killed rankings for
  // "hotels near micron", "hotels in cicero ny", etc. Now Googlebot sees unique metadata.
  "/hotels-near-destiny-usa": {
    title: "Hotels Near Destiny USA · 12 Min from Mall · The Cicero Grand",
    description: "Stay 12 minutes from Destiny USA at The Cicero Grand. All-suite rooms sleep 4, free hot breakfast, indoor pool, free parking. Book direct for the lowest rate.",
    schema: [],
  },
  "/hotels-near-syracuse-airport": {
    title: "Hotels Near Syracuse Hancock Airport (SYR) · 14 Min · The Cicero Grand",
    description: "Just 14 minutes from Syracuse Hancock International Airport. All-suite rooms, free breakfast, indoor pool, free parking — leave your car while you fly. Book direct.",
    schema: [],
  },
  "/hotels-near-jma-wireless-dome": {
    title: "Hotels Near JMA Wireless Dome · Syracuse University · The Cicero Grand",
    description: "Sixteen minutes from the JMA Wireless Dome and Syracuse University campus. All-suite rooms, free breakfast, free parking. Book your game-weekend stay direct.",
    schema: [],
  },
  "/hotels-near-micron": {
    title: "Hotels Near Micron Megafab · 6 Min Away · The Cicero Grand",
    description: "Closest full-service hotel to Micron's Clay megafab. Six minutes from the build site. Extended-stay rates, direct billing, free truck parking. Book project crew rooms direct.",
    schema: [],
  },
  "/hotels-near-turning-stone": {
    title: "Hotels Near Turning Stone Casino · 35 Min · The Cicero Grand",
    description: "Stay 35 minutes from Turning Stone Casino at The Cicero Grand. All-suite rooms sleep 4, free breakfast, free parking. Better rates than staying on-site for shows and events.",
    schema: [],
  },
  "/hotels-near-empower-amphitheater": {
    title: "Hotels Near Empower FCU Amphitheater · 12 Min · The Cicero Grand",
    description: "Stay 12 minutes from Empower FCU Amphitheater. All-suite rooms, free hot breakfast, indoor pool, free parking. Quiet sleep after the show. Book direct.",
    schema: [],
  },
  "/hotels-near-upstate-medical": {
    title: "Hotels Near Upstate Medical University · 15 Min · The Cicero Grand",
    description: "All-suite hotel 15 minutes from Upstate Medical University and Crouse Hospital. Free hot breakfast, indoor pool, free parking. Patient-family rates available.",
    schema: [],
  },
  "/hotels-near-nys-fair": {
    title: "Hotels Near NYS Fairgrounds & Expo Center · 13 Min · The Cicero Grand",
    description: "13 minutes to the NYS Fairgrounds and Expo Center. Year-round events: Great NYS Fair, concerts, trade shows, RV & boat shows, holiday markets. Group and vendor rates. Free breakfast + parking.",
    schema: [],
  },
  "/hotels-syracuse-ny": {
    title: "Hotels in Syracuse NY · The Cicero Grand · All-Suite",
    description: "Looking for hotels in Syracuse, NY? The Cicero Grand is an all-suite hotel just outside the city — minutes from Micron, Destiny USA, the Dome, and the airport. Free breakfast, indoor pool, free parking.",
    schema: [],
  },
  "/cicero-ny-hotels": {
    title: "Hotels in Cicero, NY · The Cicero Grand · All-Suite",
    description: "The Cicero Grand is an all-suite hotel in Cicero, NY — I-81 Exit 98. Free hot breakfast, indoor pool, free parking, pet-friendly. Minutes from Syracuse and Oneida Lake.",
    schema: [],
  },
  "/pet-friendly-hotels-syracuse": {
    title: "Pet-Friendly Hotels in Syracuse · The Cicero Grand",
    description: "Looking for pet-friendly hotels in Syracuse, NY? The Cicero Grand welcomes dogs and cats in our all-suite rooms. Free hot breakfast, indoor pool, free parking. Book direct.",
    schema: [],
  },
  "/hotels-clay-ny": {
    title: "Hotels Near Micron Clay NY · 7 Min from White Pine Fab · Cicero Grand",
    description: "Closest all-suite hotel to Micron's Clay megafab and White Pine Commerce Park — 7 minutes off I-81 Exit 98. Weekly & monthly crew rates, free breakfast, kitchenettes, secure truck parking. Call (315) 752-0150.",
    schema: [],
  },
  "/hotel-syracuse-ny": {
    title: "Hotel in Syracuse, NY · The Cicero Grand · All-Suite, Free Parking & Breakfast",
    description: "The Cicero Grand is the top-rated all-suite hotel near Syracuse, NY — 15 min from downtown, 16 min from Syracuse University & JMA Dome, 6 min from Micron's Clay megafab. Free parking, free hot breakfast, pet-friendly. Book direct for the lowest rate.",
    schema: [],
  },
  "/hotels-liverpool-ny": {
    title: "Hotels in Liverpool, NY · The Cicero Grand · Near JMA Wireless & NYS Fair",
    description: "Hotels near Liverpool, NY — The Cicero Grand is 8 minutes north via I-81. All-suite rooms, free hot breakfast, indoor pool, free parking, pet-friendly. Near JMA Wireless, the NYS Fairgrounds, and Onondaga Lake.",
    schema: [],
  },
  "/hotels-near-lockheed-martin-syracuse": {
    title: "Hotels Near Lockheed Martin Salina · 10 Min Away · The Cicero Grand",
    description: "Closest all-suite hotel to Lockheed Martin's Salina campus. Direct billing for defense corporate accounts, quiet suites for engineers, free parking. Book direct at (315) 752-0150.",
    schema: [],
  },
  "/hotels-near-syracuse-university": {
    title: "Hotels Near Syracuse University · 15 Min from Campus · The Cicero Grand",
    description: "All-suite hotel 15 minutes from Syracuse University campus and the JMA Wireless Dome. Parent weekend rates, group blocks for commencement + reunions, free breakfast. Book direct.",
    schema: [],
  },
  "/hotels-near-crouse-hospital": {
    title: "Hotels Near Crouse Hospital · 15 Min · Family Rates · The Cicero Grand",
    description: "All-suite hotel 15 minutes from Crouse Hospital in Syracuse. Patient-family rates, weekly nurse rates, quiet suites, free breakfast. Book direct at (315) 752-0150.",
    schema: [],
  },
  "/hotels-near-st-josephs-hospital-syracuse": {
    title: "Hotels Near St. Joseph's Hospital Syracuse · Family Rates · The Cicero Grand",
    description: "All-suite hotel 15 minutes from St. Joseph's Hospital in Syracuse. Patient-family rates, quiet suites, kitchenette in every room, free breakfast. Call (315) 752-0150 to book direct.",
    schema: [],
  },
  "/hotels-near-srctec-syracuse": {
    title: "Hotels Near SRCTec / SRC Inc. · 6 Min Away · The Cicero Grand",
    description: "Closest all-suite hotel to SRCTec and SRC Inc. — six minutes away. Direct billing for defense corporate accounts, quiet suites for engineers, secure parking. Book direct.",
    schema: [],
  },
  "/hotels-near-rtx-raytheon-syracuse": {
    title: "Hotels Near RTX / Raytheon East Syracuse · 12 Min · The Cicero Grand",
    description: "All-suite hotel 12 minutes from RTX/Raytheon Technologies in East Syracuse. Direct billing for defense corporate accounts, quiet suites, secure parking. Book direct at (315) 883-8288.",
    schema: [],
  },
  "/hotels-near-raytheon-syracuse": {
    title: "Hotels Near Raytheon East Syracuse · 12 Min · The Cicero Grand",
    description: "All-suite hotel 12 minutes from Raytheon/RTX in East Syracuse. Direct billing for defense corporate accounts, quiet suites, secure parking. Book direct at (315) 883-8288.",
    schema: [],
  },
  "/hotels-near-national-grid-syracuse": {
    title: "Hotels Near National Grid Syracuse · Storm-Response Rates · The Cicero Grand",
    description: "All-suite hotel 12 minutes from National Grid's Syracuse offices. Emergency storm-response block pricing, direct billing, hot breakfast starting 6 AM, free parking. Book direct at (315) 883-8288.",
    schema: [],
  },
  "/hotels-near-va-medical-center-syracuse": {
    title: "Hotels Near Syracuse VA Medical Center · Veteran Rates · The Cicero Grand",
    description: "All-suite hotel 18 minutes from Syracuse VA Medical Center. Veteran discount, patient-family rates, ADA rooms with roll-in shower, 24/7 check-in, free breakfast, free parking. Book direct at (315) 883-8288.",
    schema: [],
  },
  "/hotels-near-le-moyne-college": {
    title: "Hotels Near Le Moyne College · 18 Min · Parent Weekend Rates · The Cicero Grand",
    description: "All-suite hotel 18 minutes from Le Moyne College campus. Parent-weekend rates, group blocks for athletic teams and admitted-student events, free breakfast, free parking. Book direct at (315) 883-8288.",
    schema: [],
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

  // 301 redirects for retired thin-content landing pages. These pages had
  // 90-day CTR of 0% and were pruned to consolidate authority into the
  // homepage. Preserves any legacy backlinks.
  const RETIRED_REDIRECTS: Record<string, string> = {
    "/hotels-baldwinsville-ny": "/",
    "/hotels-brewerton-ny": "/",
    "/hotels-east-syracuse-ny": "/",
  };
  app.use((req, res, next) => {
    const fullPath = req.originalUrl.split("?")[0].replace(/\/+$/, "") || "/";
    const dest = RETIRED_REDIRECTS[fullPath];
    if (dest) return res.redirect(301, dest);
    next();
  });

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
