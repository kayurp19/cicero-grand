import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import site from '../content/site.json';

const STORAGE_KEY = 'cg_banner_dismissed';

/**
 * Site-wide top banner pushing direct booking.
 * Dismissible per session (sessionStorage). Returns next visit.
 */
export function RateBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== '1') setShow(true);
    } catch {
      // sandboxed iframe — show by default
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setShow(false);
    document.documentElement.style.setProperty('--banner-height', '0px');
  }

  // CSS var for layout offset (Header uses this)
  useEffect(() => {
    if (!show) {
      document.documentElement.style.setProperty('--banner-height', '0px');
      return;
    }
    function set() {
      const h = window.matchMedia('(min-width: 768px)').matches ? 38 : 64;
      document.documentElement.style.setProperty('--banner-height', `${h}px`);
    }
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] bg-primary text-primary-foreground"
      data-testid="rate-banner"
      role="region"
      aria-label="Direct booking promotion"
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-2 lg:py-2 flex items-center gap-3 text-[12px] lg:text-[13px]">
        <p className="flex-1 leading-tight">
          <strong className="font-semibold">Book direct and save</strong>
          <span className="opacity-80"> · best rate guaranteed, no booking fees.</span>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="rate-banner-cta"
            className="ml-2 inline-flex items-center font-medium underline underline-offset-2 hover:opacity-90"
          >
            Reserve now <span aria-hidden className="ml-1">→</span>
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss banner"
          data-testid="rate-banner-dismiss"
          className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/15 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
