/**
 * Tracking core — handles GTM bootstrap, pageview events, and dataLayer
 * pushes. This module is safe to call before tracking IDs are configured;
 * it short-circuits to no-ops in that case.
 */

import {
  TRACKING,
  isTrackingEnabled,
  isMetaPixelEnabled,
} from "./tracking-config";

declare global {
  interface Window {
    dataLayer: any[];
    fbq?: any;
    _fbq?: any;
  }
}

let gtmLoaded = false;
let metaPixelLoaded = false;

/**
 * Bootstrap Meta (Facebook) Pixel. Safe to call multiple times — the pixel
 * script only injects once. No-ops if META_PIXEL_ID isn't configured.
 *
 * Powers retargeting on Facebook + Instagram: every visitor gets tagged so
 * you can run ads to "people who viewed cicerogrand.com in the last 30 days."
 */
export function initMetaPixel(): void {
  if (typeof window === "undefined") return;
  if (!isMetaPixelEnabled()) return;
  if (metaPixelLoaded) return;
  metaPixelLoaded = true;

  // Standard Meta Pixel bootstrap, transcribed from the docs.
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", TRACKING.META_PIXEL_ID);
  window.fbq("track", "PageView");
}

/**
 * Fire a Meta Pixel event. No-op when pixel isn't configured or hasn't loaded.
 * Use this to mirror key events (Lead, InitiateCheckout, Contact) to Meta.
 */
function fbqTrack(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!isMetaPixelEnabled()) return;
  if (!window.fbq) return;
  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
}

/**
 * Initialize the dataLayer and inject the GTM <script> snippet into the
 * page head. Safe to call multiple times — the script will only inject
 * once. No-ops if GTM ID isn't configured yet.
 */
export function initTracking(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  if (!isTrackingEnabled()) {
    // Tracking IDs not pasted in yet — leave dataLayer in place so future
    // .push() calls queue events for later, but skip loading GTM.
    return;
  }

  if (gtmLoaded) return;
  gtmLoaded = true;

  // Standard GTM bootstrap, transcribed from the docs.
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const id = TRACKING.GTM_CONTAINER_ID;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  // Also bootstrap Meta Pixel if configured. Kept next to GTM so a single
  // initTracking() call wires up both platforms.
  initMetaPixel();
}

/**
 * Push a virtual pageview into the dataLayer. Wire this to your SPA router
 * so each route change is captured (otherwise GTM only fires on hard load).
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_view",
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title || document.title,
  });

  // Mirror to Meta Pixel for SPA route changes (initial load already fires
  // PageView in initMetaPixel).
  fbqTrack("PageView");
}

/**
 * Push a "Book Now" / begin_checkout event when a user clicks any link or
 * button that leads to the Cloudbeds reservation engine.
 */
export function trackBookNow(meta?: {
  source?: string;
  ratePlan?: string;
}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "begin_checkout",
    booking_source: meta?.source || "unknown",
    rate_plan: meta?.ratePlan || undefined,
    ecommerce: {
      currency: "USD",
      // Average booking value estimate — Cloudbeds Google Ads native
      // integration will replace this with the actual purchase value once
      // the reservation completes on us2.cloudbeds.com.
      value: 125,
    },
  });

  // Mirror to Meta Pixel — InitiateCheckout is Meta's booking-intent event.
  fbqTrack("InitiateCheckout", {
    content_category: "hotel_booking",
    content_name: meta?.ratePlan || meta?.source || "book_now",
    currency: "USD",
    value: 125,
  });
}

/**
 * Push a "Phone Click" / generate_lead event when a tel: link is clicked.
 */
export function trackPhoneClick(meta?: { source?: string }): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    lead_source: meta?.source || "phone_click",
    ecommerce: {
      currency: "USD",
      value: 25, // Estimated lead value per the handoff doc
    },
  });

  // Mirror to Meta Pixel — Lead is Meta's phone/inquiry event.
  fbqTrack("Lead", {
    content_name: "phone_click",
    content_category: "hotel_inquiry",
    currency: "USD",
    value: 25,
  });
}

/**
 * Push a contact-form submission event.
 */
export function trackContactSubmit(meta?: {
  topic?: string;
  source?: string;
}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    lead_source: meta?.source || "contact_form",
    contact_topic: meta?.topic || undefined,
    ecommerce: {
      currency: "USD",
      value: 25,
    },
  });

  // Mirror to Meta Pixel — Contact is Meta's form-submission event.
  fbqTrack("Contact", {
    content_name: meta?.topic || "contact_form",
    content_category: "hotel_inquiry",
    currency: "USD",
    value: 25,
  });
}

/**
 * Generic event push — escape hatch for any custom event we want to track
 * without adding a named helper. Use sparingly; named helpers are preferred
 * because they document intent.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...(params || {}),
  });
}

/**
 * Install global click listeners that auto-detect Book Now / phone clicks
 * anywhere in the app. Call once at mount; idempotent.
 */
let globalListenersInstalled = false;
export function installGlobalClickTracking(): void {
  if (typeof window === "undefined") return;
  if (globalListenersInstalled) return;
  globalListenersInstalled = true;

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      // Phone click
      if (href.toLowerCase().startsWith("tel:")) {
        const source = anchor.dataset.bookingSource || anchor.dataset.testid || "tel_link";
        trackPhoneClick({ source });
        return;
      }

      // Book Now — anything pointing at Cloudbeds reservation
      if (href.includes("cloudbeds.com/reservation") || href.includes("us2.cloudbeds.com")) {
        const source = anchor.dataset.bookingSource || anchor.dataset.testid || "book_now";
        const ratePlan = anchor.dataset.ratePlan;
        trackBookNow({ source, ratePlan });
        return;
      }
    },
    // Use capture phase so we get the event even if a downstream handler
    // calls stopPropagation.
    true,
  );
}
