import { useEffect } from "react";

const SITE_URL = "https://www.cicerogrand.com";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/events". Defaults to current pathname. */
  canonicalPath?: string;
  /** Optional Open Graph image (absolute URL or path). */
  ogImage?: string;
  /** One or more JSON-LD structured data objects. */
  jsonLd?: JsonLd;
  /** When true, page is excluded from search engines (private pages like /guest). */
  noindex?: boolean;
}

function setMeta(selector: string, attr: "name" | "property", attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSONLD_ID = "ld-json-page";

export function useSeo({ title, description, canonicalPath, ogImage, jsonLd, noindex }: SeoOptions) {
  useEffect(() => {
    document.title = title;

    setMeta('meta[name="description"]', "name", "description", description);
    if (noindex) {
      setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    }
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");

    const path = canonicalPath ?? window.location.pathname;
    const canonical = `${SITE_URL}${path === "/" ? "" : path}`;
    setLink("canonical", canonical);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);

    if (ogImage) {
      const imgUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;
      setMeta('meta[property="og:image"]', "property", "og:image", imgUrl);
      setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", imgUrl);
    }

    // Inject / replace JSON-LD
    let scriptEl = document.head.querySelector<HTMLScriptElement>(`script#${JSONLD_ID}`);
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = JSONLD_ID;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonicalPath, ogImage, JSON.stringify(jsonLd)]);
}

export const SITE = {
  url: SITE_URL,
  name: "The Cicero Grand",
  legalName: "The Cicero Grand Hotel",
  street: "5875 Carmenica Drive",
  locality: "Cicero",
  region: "NY",
  postalCode: "13039",
  country: "US",
  phone: "+1-315-752-0150",
  salesPhone: "+1-315-715-7410",
  email: "sales@cicerogrand.com",
  latitude: 43.1742,
  longitude: -76.1066,
  checkIn: "15:00",
  checkOut: "11:00",
  priceRange: "$$",
  logo: `${SITE_URL}/brand/cicero-grand-logo.jpg`,
  bookingUrl: "https://us2.cloudbeds.com/reservation/Uw3WC6",
};
