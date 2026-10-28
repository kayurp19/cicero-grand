import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import {
  CONSENT_OPEN, CONSENT_CHANGED, CONSENT_KEY, getConsent, hasPrivacySignal, saveConsent,
  type ConsentChoice,
} from "../lib/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const rejectButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const privacySignal = hasPrivacySignal();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(!getConsent()), 600);
    const open = () => {
      opener.current = document.activeElement as HTMLElement;
      setVisible(true);
      window.setTimeout(() => rejectButton.current?.focus(), 0);
    };
    const changed = () => setVisible(false);
    const storageChanged = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) setVisible(!getConsent());
    };
    window.addEventListener(CONSENT_OPEN, open);
    window.addEventListener(CONSENT_CHANGED, changed);
    window.addEventListener("storage", storageChanged);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_OPEN, open);
      window.removeEventListener(CONSENT_CHANGED, changed);
      window.removeEventListener("storage", storageChanged);
    };
  }, []);

  const close = () => {
    setVisible(false);
    opener.current?.focus();
    opener.current = null;
  };
  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    close();
  };
  const dismiss = () => {
    if (!getConsent()) choose("essential");
    else close();
  };
  if (!visible) return null;

  return (
    <div data-nosnippet="" data-testid="cookie-settings" role="dialog" aria-label="Cookie settings"
      aria-describedby="cookie-description"
      onKeyDown={event => { if (event.key === "Escape") dismiss(); }}
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="relative mx-auto max-w-4xl rounded-2xl border border-background/20 bg-foreground text-background p-5 sm:p-6 shadow-2xl max-h-[85dvh] overflow-y-auto">
        <button onClick={dismiss} aria-label={getConsent() ? "Close cookie settings" : "Close using essential cookies"}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-background/40 hover:bg-background/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          <X className="h-4 w-4" />
        </button>
        <h2 className="font-display text-xl pr-12 mb-2">Your privacy choices</h2>
        <p id="cookie-description" className="text-sm leading-relaxed pr-2 max-w-2xl">
          Essential features work without optional tracking. With your permission,
          Google Analytics, Google Ads and Meta help us measure visits and advertising.
          Choose Essential only to keep these tools off, or Accept all to enable them.
        </p>
        {privacySignal && <p className="mt-3 text-sm leading-relaxed">
          Your browser sends a Global Privacy Control signal. We keep optional analytics
          and advertising off while that signal is enabled.
        </p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <button ref={rejectButton} onClick={() => choose("essential")} data-testid="cookie-essential"
            className="inline-flex min-h-11 flex-1 sm:flex-none items-center justify-center rounded-full border border-background px-5 text-sm font-medium hover:bg-background hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Essential only
          </button>
          <button onClick={() => choose("accepted")} disabled={privacySignal} data-testid="cookie-accept"
            className="inline-flex min-h-11 flex-1 sm:flex-none items-center justify-center rounded-full border border-background px-5 text-sm font-medium hover:bg-background hover:text-foreground disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Accept all
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed">
          Change your choice anytime using Cookie settings in the footer.
          Withdrawing permission reloads this page to stop running trackers.{" "}
          <Link href="/privacy" className="underline underline-offset-2">Privacy &amp; cookie policy</Link>.
        </p>
      </div>
    </div>
  );
}
