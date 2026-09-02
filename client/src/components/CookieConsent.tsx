import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cg_cookie_consent_v1';

type Choice = 'accepted' | 'essential' | null;

function getStorage(): Storage | null {
  try {
    const key = 'local' + 'Storage';
    return (window as any)[key] || null;
  } catch { return null; }
}

function getStored(): Choice {
  try {
    const s = getStorage();
    if (!s) return null;
    const v = s.getItem(STORAGE_KEY);
    if (v === 'accepted' || v === 'essential') return v;
  } catch {}
  return null;
}

function setStored(v: Exclude<Choice, null>) {
  try {
    const s = getStorage();
    if (s) s.setItem(STORAGE_KEY, v);
  } catch {}
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStored()) {
      // small delay so it doesn't fight the hero on initial paint
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    setStored('accepted');
    setVisible(false);
  };

  const essentialOnly = () => {
    setStored('essential');
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-4xl bg-foreground text-background rounded-2xl shadow-2xl border border-foreground/20 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm leading-relaxed text-background/90">
          <strong className="font-medium">We use cookies.</strong> This site uses cookies
          to keep the booking experience smooth, measure traffic, and improve our service.
          You can accept all cookies or accept only those required for the site to
          function. Read our{' '}
          <Link href="/privacy" className="underline hover:text-background">
            Privacy Policy
          </Link>{' '}
          for details.
        </div>
        <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={essentialOnly}
            className="inline-flex items-center justify-center px-4 h-10 rounded-full border border-background/30 text-xs sm:text-sm font-medium hover:bg-background hover:text-foreground transition-colors"
            data-testid="cookie-essential"
          >
            Essential only
          </button>
          <button
            onClick={accept}
            className="inline-flex items-center justify-center px-5 h-10 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="cookie-accept"
          >
            Accept all
          </button>
          <button
            onClick={essentialOnly}
            aria-label="Close"
            className="ml-1 inline-flex items-center justify-center w-10 h-10 rounded-full border border-background/15 hover:bg-background/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
