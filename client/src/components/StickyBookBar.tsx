import { Phone } from 'lucide-react';
import site from '../content/site.json';

/** Sticky bottom CTA on mobile — booking is the primary conversion */
export function StickyBookBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border px-4 py-3 flex gap-2"
      data-testid="sticky-book-bar"
    >
      <a
        href={`tel:${site.phoneRaw}`}
        className="flex items-center justify-center w-12 h-12 rounded-full border border-border"
        aria-label="Call hotel"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="sticky-book-now"
        className="flex-1 inline-flex items-center justify-center h-12 rounded-full bg-primary text-primary-foreground font-medium"
      >
        Book Now
      </a>
    </div>
  );
}
