import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Injects/updates <link rel="canonical"> on every route change.
 * Ensures Google always knows the master URL for each page.
 *
 * Always uses https://www.cicerogrand.com as the canonical origin
 * regardless of how the user arrived (with/without www, with/without
 * trailing slash, with utm params, with hash, etc.)
 */
const CANONICAL_ORIGIN = "https://www.cicerogrand.com";

function buildCanonicalUrl(path: string): string {
  // strip trailing slash (except for root "/")
  let cleanPath = path === "/" ? "/" : path.replace(/\/+$/, "");

  // strip any query / hash — canonical should be the bare page URL
  cleanPath = cleanPath.split("?")[0].split("#")[0];

  // collapse any double slashes
  cleanPath = cleanPath.replace(/\/{2,}/g, "/");

  // ensure leading slash
  if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

  return CANONICAL_ORIGIN + cleanPath;
}

export function Canonical() {
  const [location] = useLocation();

  useEffect(() => {
    const canonicalUrl = buildCanonicalUrl(location);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // also set og:url so social shares and AI crawlers match
    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonicalUrl);
  }, [location]);

  return null;
}
