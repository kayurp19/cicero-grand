import { Phone } from 'lucide-react';
import site from '../content/site.json';
import { useLocation } from 'wouter';
import { eventInquiry } from '@shared/event-inquiry';

/** Sticky bottom CTA on mobile — booking is the primary conversion */
export function StickyBookBar() {
  const [path] = useLocation();
  const inquiry = eventInquiry(path, window.location.search, import.meta.env.VITE_PREVIEW === 'true');
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border px-4 py-3 flex gap-2"
      data-testid="sticky-book-bar"
    >
      <a
        href={`tel:${inquiry ? site.salesPhoneRaw : site.phoneRaw}`}
        className="flex items-center justify-center w-12 h-12 rounded-full border border-border"
        aria-label={inquiry ? 'Call event sales' : 'Call hotel'}
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href={inquiry?.quote ?? site.bookingUrl}
        target={inquiry ? undefined : '_blank'}
        rel="noopener noreferrer"
        data-testid="sticky-book-now"
        className="flex-1 inline-flex items-center justify-center h-12 rounded-full bg-primary text-primary-foreground font-medium"
      >
        {inquiry ? 'Request an event quote' : 'Book Now'}
      </a>
    </div>
  );
}
