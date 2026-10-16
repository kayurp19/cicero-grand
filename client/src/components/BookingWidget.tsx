import { useState, useRef, FormEvent } from 'react';
import { Calendar, Users } from 'lucide-react';
import site from '../content/site.json';
import { localDate, nextDate, validStay } from '@shared/booking-dates';

/** Big in-page booking widget. Submitting opens the Cloudbeds booking
 *  page with the user's selections appended as query params. */
export function BookingWidget({ variant = 'overlay' }: { variant?: 'overlay' | 'panel' }) {
  const today = localDate();
  const tomorrow = nextDate(today);
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const bookingLink = useRef<HTMLAnchorElement>(null);
  const bookingUrl = new URL(site.bookingUrl);
  bookingUrl.searchParams.set('checkin', checkin);
  bookingUrl.searchParams.set('checkout', checkout);
  bookingUrl.searchParams.set('adults', String(adults));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validStay(checkin, checkout, localDate())) return;
    // Keep implicit Enter submission on date inputs on this page. Focus the
    // real booking link; Enter on that link uses Google's native click linker.
    bookingLink.current?.focus();
  };

  const isOverlay = variant === 'overlay';

  return (
    <form
      onSubmit={onSubmit}
      data-testid="booking-widget"
      className={
        isOverlay
          ? 'w-full max-w-3xl mx-auto bg-background/95 backdrop-blur-2xl text-foreground rounded-3xl p-3 shadow-2xl border border-white/20'
          : 'w-full bg-card text-card-foreground rounded-3xl p-3 shadow-md border border-border'
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
        <label className="block bg-muted/40 rounded-2xl px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
            <Calendar className="w-3 h-3" /> Check in
          </span>
          <input
            type="date"
            required
            value={checkin}
            min={today}
            onChange={(e) => {
              setCheckin(e.target.value);
              if (e.target.value >= checkout) {
                setCheckout(nextDate(e.target.value));
              }
            }}
            data-testid="input-checkin"
            className="mt-0.5 w-full bg-transparent border-0 outline-none text-sm font-medium tabular-nums"
          />
        </label>
        <label className="block bg-muted/40 rounded-2xl px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
            <Calendar className="w-3 h-3" /> Check out
          </span>
          <input
            type="date"
            required
            value={checkout}
            min={nextDate(checkin || today)}
            onChange={(e) => setCheckout(e.target.value)}
            data-testid="input-checkout"
            className="mt-0.5 w-full bg-transparent border-0 outline-none text-sm font-medium tabular-nums"
          />
        </label>
        <label className="block bg-muted/40 rounded-2xl px-4 py-3 cursor-pointer hover:bg-muted transition-colors col-span-2 md:col-span-1">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
            <Users className="w-3 h-3" /> Adults
          </span>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            data-testid="input-guests"
            className="mt-0.5 w-full bg-transparent border-0 outline-none text-sm font-medium appearance-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'adult' : 'adults'}</option>
            ))}
          </select>
        </label>
        <a
          ref={bookingLink}
          href={bookingUrl.toString()}
          target="_blank"
          rel="noopener"
          data-booking-source="booking_widget"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Google's linker decorates on pointer-down. Give keyboard
              // activation the same preparation before the native link click.
              e.currentTarget.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
            }
          }}
          onClick={(e) => {
            const form = e.currentTarget.closest('form');
            if (!validStay(checkin, checkout, localDate()) || !form?.reportValidity()) {
              e.preventDefault();
            }
          }}
          data-testid="button-search-rooms"
          className="col-span-2 md:col-span-1 inline-flex items-center justify-center h-auto md:h-full px-7 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Search Rooms →
        </a>
      </div>
      <p className="px-4 pt-2 pb-1 text-xs text-muted-foreground">Add children and confirm room occupancy in the booking engine.</p>
    </form>
  );
}
