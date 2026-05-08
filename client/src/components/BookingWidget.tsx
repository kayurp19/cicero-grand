import { useState, FormEvent } from 'react';
import { Calendar, Users } from 'lucide-react';
import site from '../content/site.json';

/** Big in-page booking widget. Submitting opens the Cloudbeds booking
 *  page with the user's selections appended as query params. */
export function BookingWidget({ variant = 'overlay' }: { variant?: 'overlay' | 'panel' }) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(tomorrow);
  const [adults, setAdults] = useState(2);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = new URL(site.bookingUrl);
    url.searchParams.set('checkin', checkin);
    url.searchParams.set('checkout', checkout);
    url.searchParams.set('adults', String(adults));
    window.open(url.toString(), '_blank', 'noopener');
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
            value={checkin}
            min={today}
            onChange={(e) => {
              setCheckin(e.target.value);
              if (e.target.value >= checkout) {
                const next = new Date(e.target.value);
                next.setDate(next.getDate() + 1);
                setCheckout(next.toISOString().slice(0, 10));
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
            value={checkout}
            min={checkin}
            onChange={(e) => setCheckout(e.target.value)}
            data-testid="input-checkout"
            className="mt-0.5 w-full bg-transparent border-0 outline-none text-sm font-medium tabular-nums"
          />
        </label>
        <label className="block bg-muted/40 rounded-2xl px-4 py-3 cursor-pointer hover:bg-muted transition-colors col-span-2 md:col-span-1">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
            <Users className="w-3 h-3" /> Guests
          </span>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            data-testid="input-guests"
            className="mt-0.5 w-full bg-transparent border-0 outline-none text-sm font-medium appearance-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          data-testid="button-search-rooms"
          className="col-span-2 md:col-span-1 inline-flex items-center justify-center h-auto md:h-full px-7 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Search Rooms →
        </button>
      </div>
    </form>
  );
}
