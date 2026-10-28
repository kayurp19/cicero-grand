/** First-party preference storage only. No tracking or network requests here. */
export const CONSENT_KEY = "cg_cookie_consent_v2";
export const CONSENT_VERSION = "2026-10-28";
export const CONSENT_CHANGED = "cg:consent-changed";
export const CONSENT_OPEN = "cg:consent-open";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const PREVIEW = import.meta.env?.VITE_PREVIEW === "true";

export type ConsentChoice = "accepted" | "essential";
export type ConsentRecord = {
  choice: ConsentChoice;
  noticeVersion: string;
  savedAt: number;
  expiresAt: number;
};

let memoryRecord: ConsentRecord | null = null;
let storageUnavailable = false;

export function hasPrivacySignal(): boolean {
  return typeof navigator !== "undefined" &&
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function getConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  let record: ConsentRecord | null;
  try {
    record = PREVIEW || storageUnavailable
      ? memoryRecord
      : JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "null");
  } catch {
    record = memoryRecord;
  }
  if (!record || !["accepted", "essential"].includes(record.choice) ||
      record.noticeVersion !== CONSENT_VERSION ||
      !Number.isFinite(record.savedAt) || !Number.isFinite(record.expiresAt) ||
      record.savedAt > Date.now() + 60_000 ||
      record.expiresAt <= Date.now() ||
      record.expiresAt - record.savedAt !== MAX_AGE) return null;
  return record;
}

export function optionalTrackingAllowed(): boolean {
  return !hasPrivacySignal() &&
    (PREVIEW || !document.cookie.split(";").some(c => c.trim() === "cg_tracking_optout=1")) &&
    getConsent()?.choice === "accepted";
}

export function saveConsent(choice: ConsentChoice): void {
  const now = Date.now();
  const essential = hasPrivacySignal() || choice === "essential";
  // Independent rejection safeguard if storage becomes full/read-only after
  // an earlier acceptance. Never let the withdrawal reload restore old consent.
  if (!PREVIEW) document.cookie = `cg_tracking_optout=${essential ? "1" : ""}; Path=/; Max-Age=${essential ? MAX_AGE / 1000 : 0}; SameSite=Lax`;
  memoryRecord = {
    choice: essential ? "essential" : choice,
    noticeVersion: CONSENT_VERSION,
    savedAt: now,
    expiresAt: now + MAX_AGE,
  };
  if (!PREVIEW) try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(memoryRecord));
    window.localStorage.removeItem("cg_cookie_consent_v1");
    storageUnavailable = false;
  } catch {
    // A blocked/full storage area must not make the page unusable. This choice
    // lasts only in memory; a fresh load asks again and starts with tracking off.
    storageUnavailable = true;
    if (essential) {
      try { window.localStorage.removeItem(CONSENT_KEY); } catch { /* cookie safeguard remains */ }
    }
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN));
}

/** Remove only known optional first-party cookies, never booking/login state. */
export function clearOptionalCookies(): void {
  if (PREVIEW) return;
  const names = document.cookie.split(";").map(c => c.trim().split("=")[0])
    .filter(name => /^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gcl_|_fbp$|_fbc$)/.test(name));
  const host = window.location.hostname;
  const domains = new Set(["", host]);
  const labels = host.split(".");
  for (let i = 1; i < labels.length - 1; i++) domains.add(labels.slice(i).join("."));
  const paths = new Set(["/"]);
  const segments = window.location.pathname.split("/").filter(Boolean);
  segments.forEach((_, i) => paths.add("/" + segments.slice(0, i + 1).join("/")));
  for (const name of names) for (const domain of Array.from(domains)) for (const path of Array.from(paths)) {
    document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
  }
}
