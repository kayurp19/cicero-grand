/**
 * Tracking core — handles GTM bootstrap, pageview events, and dataLayer
 * pushes. This module is safe to call before tracking IDs are configured;
 * it short-circuits to no-ops in that case.
 */

import { TRACKING, isTrackingEnabled } from "./tracking-config";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

let gtmLoaded = false;

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
