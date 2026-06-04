import { useState } from 'react';
import { Check, ArrowRight, Download, Mail, Phone } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useSeo, SITE } from '../hooks/useSeo';

// Catalog mirrors server/routes.ts MENU_CATALOG. No pricing displayed publicly.
const MENUS = [
  {
    slug: 'weddings',
    eyebrow: '01 · Weddings',
    title: 'Wedding Reception Menus',
    blurb:
      'Three reception packages — buffet, plated, and hors d’oeuvres receptions — plus bridal-party brunches and rehearsal-dinner options. Wedding cake service, coordinator, and tasting included.',
    image: '/photos/venue-wedding-reception.jpg',
    badge: 'Most requested',
  },
  {
    slug: 'corporate-meetings',
    eyebrow: '02 · Corporate',
    title: 'Corporate Meetings & Conferences',
    blurb:
      'Working lunches, mid-size hot buffets, and full-day conference packages with breakfast, lunch, and afternoon break. Built-in AV, dedicated coordinator, and preferred hotel rates for attendees.',
    image: '/photos/venue-corporate-banquet.jpg',
  },
  {
    slug: 'social-events',
    eyebrow: '03 · Social',
    title: 'Social Events',
    blurb:
      'Showers, birthdays, reunions, anniversaries. Classic buffet, Italian-inspired, or premium with live-action stations — all with dedicated private space, optional hosted bar, and a hotel block for out-of-town guests.',
    image: '/photos/venue-tablescape.jpg',
  },
  {
    slug: 'sports-teams',
    eyebrow: '04 · Sports',
    title: 'Sports Teams & Tournament Travel',
    blurb:
      'Boxed road meals, pizza & wings, and taco bars built for the bus. Plus team rates on all-suite rooms, fast-service team meals, and free bus parking right outside the event center.',
    image: '/photos/venue-ballroom-empty.jpg',
  },
  {
    slug: 'hosted-open-bar',
    eyebrow: '05 · Bar Service',
    title: 'Hosted Open Bar Package',
    blurb:
      'One all-inclusive bar package — beer, wine, spirits, mixers — billed per person on the hour. We hold the New York State Liquor License. TIPS-certified bartenders included.',
    image: '/photos/venue-tablescape.jpg',
  },
  {
    slug: 'master-banquet-packages',
    eyebrow: '06 · Reference',
    title: 'Master Banquet Packages',
    blurb:
      'Everything in one document — every package, every station, every enhancement and add-on. Best for planners and coordinators building a custom multi-element event end-to-end.',
    image: '/photos/venue-ballroom-empty.jpg',
    badge: 'All menus in one PDF',
  },
];

const EVENT_TYPES = [
  'Wedding',
  'Corporate / Meeting',
  'Social / Birthday / Shower',
  'Sports Team / Tournament',
  'Reunion / Anniversary',
  'Other',
];

const GUEST_RANGES = ['Under 50', '50–100', '100–150', '150+', 'Not sure yet'];

interface DownloadLink {
  slug: string;
  title: string;
  url: string;
}

export default function Menus() {
  useSeo({
    title: 'Banquet & Catering Menus · The Cicero Grand · Syracuse-Area Event Center',
    description:
      'Download wedding, corporate, social, and sports-team banquet menus from The Cicero Grand Event Center in Cicero, NY. Custom quotes within one business day.',
    canonicalPath: '/event-center/menus',
    ogImage: '/photos/venue-tablescape.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: `${SITE.name} — Banquet Catering`,
      servesCuisine: ['American', 'Italian-American', 'Buffet', 'Catering'],
      url: `${SITE.url}/event-center/menus`,
      telephone: SITE.salesPhone,
      email: SITE.email,
      hasMenu: MENUS.map((m) => ({
        '@type': 'Menu',
        name: m.title,
        url: `${SITE.url}/event-center/menus#${m.slug}`,
      })),
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.street,
        addressLocality: SITE.locality,
        addressRegion: SITE.region,
        postalCode: SITE.postalCode,
        addressCountry: SITE.country,
      },
    },
  });

  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [downloads, setDownloads] = useState<DownloadLink[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleMenu = (slug: string) => {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const scrollToForm = (slug?: string) => {
    if (slug && !selected.includes(slug)) {
      setSelected((prev) => [...prev, slug]);
    }
    setTimeout(() => {
      const el = document.getElementById('menu-request-form');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (selected.length === 0) {
      setError('Please select at least one menu to download.');
      return;
    }
    if (!form.name || !form.email || !form.eventType) {
      setError('Name, email, and event type are required.');
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch('/api/menu-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, menusRequested: selected }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.message || 'Could not submit request.');
      }
      const body = await r.json();
      setDownloads(body.downloads || []);
      // GA4 event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'menu_request', {
          event_category: 'lead',
          event_label: form.eventType,
          menus: selected.join(','),
        });
      }
      setTimeout(() => {
        document.getElementById('menu-downloads')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again or call (315) 752-0150.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Banquet & Catering Menus"
        image="/photos/venue-tablescape.jpg"
        title={
          <>
            Every menu, <em className="italic font-light">delivered to your inbox.</em>
          </>
        }
        intro="Wedding receptions, corporate meetings, social gatherings, sports-team meals, and our hosted bar packages — all built in-house, all customizable. Tell us the event, we’ll send the menu and a custom quote within one business day."
      />

      {/* Quick value bar */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-[15px]">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Six full menus, free.</div>
              <div className="opacity-85">Weddings, corporate, social, sports, bar, and the master reference.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Custom quote in 1 business day.</div>
              <div className="opacity-85">A dedicated coordinator follows up with availability and pricing.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Hotel block, AV, parking included.</div>
              <div className="opacity-85">One venue, one contact, one weekend — from rehearsal to brunch.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu cards */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="max-w-3xl mb-12 lg:mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-primary">Select the menus you want</span>
              <h2 className="text-3xl lg:text-5xl font-serif mt-3 leading-tight">
                Pick one. Pick all six. <em className="italic font-light">We’ll send them all.</em>
              </h2>
              <p className="text-muted-foreground mt-4 text-base lg:text-lg leading-relaxed">
                Tap any menu to add it to your request. Pricing is included in the PDF — we keep it off the public page so we can offer you the right package and any seasonal incentives.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {MENUS.map((m) => {
              const isSelected = selected.includes(m.slug);
              return (
                <Reveal key={m.slug}>
                  <button
                    type="button"
                    id={m.slug}
                    onClick={() => toggleMenu(m.slug)}
                    className={`group text-left w-full h-full flex flex-col bg-card border rounded-lg overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary shadow-lg scale-[1.01]'
                        : 'border-border hover:border-primary/50 hover:shadow-md'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={m.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {m.badge && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                          {m.badge}
                        </span>
                      )}
                      <div
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background/90 border-border text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 flex-1 flex flex-col">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-primary mb-2">{m.eyebrow}</div>
                      <h3 className="font-serif text-xl lg:text-2xl leading-tight mb-3">{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{m.blurb}</p>
                      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm">
                        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {isSelected ? 'Added to request' : 'Add to request'}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-primary' : 'group-hover:translate-x-1'}`}
                        />
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Sticky CTA when items selected */}
          {selected.length > 0 && !downloads && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => scrollToForm()}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-semibold text-base hover:bg-primary/90 transition-colors shadow-lg inline-flex items-center gap-2"
              >
                Continue with {selected.length} menu{selected.length > 1 ? 's' : ''}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section id="menu-request-form" className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-primary">Tell us about your event</span>
              <h2 className="text-3xl lg:text-4xl font-serif mt-3 leading-tight">
                Where should we send the menu{selected.length === 1 ? '' : 's'}?
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                {selected.length > 0
                  ? `${selected.length} menu${selected.length > 1 ? 's' : ''} selected. We’ll email the PDF${selected.length > 1 ? 's' : ''} and have a coordinator reach out within one business day.`
                  : 'Select at least one menu above to continue.'}
              </p>
            </div>
          </Reveal>

          {downloads ? (
            <div id="menu-downloads" className="bg-background border-2 border-primary rounded-lg p-8 lg:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl lg:text-3xl mb-3">Your menus are ready.</h3>
              <p className="text-muted-foreground mb-6">
                We’ve emailed a copy to <strong className="text-foreground">{form.email}</strong>. Click any menu below to open it now. A coordinator will follow up within one business day.
              </p>
              <ul className="space-y-3 max-w-md mx-auto">
                {downloads.map((d) => (
                  <li key={d.slug}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-5 py-4 rounded-md border border-border bg-card hover:bg-primary/5 hover:border-primary transition-colors text-left"
                    >
                      <span className="flex items-center gap-3 font-medium">
                        <Download className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{d.title}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
                Questions right now? Call <a className="text-primary font-semibold" href="tel:+13157520150">(315) 752-0150</a> or email{' '}
                <a className="text-primary font-semibold" href="mailto:sales@cicerogrand.com">sales@cicerogrand.com</a>.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-background rounded-lg p-6 lg:p-10 shadow-sm border border-border space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="mr-name" className="block text-sm font-medium mb-2">
                    Full name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="mr-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="mr-email" className="block text-sm font-medium mb-2">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    id="mr-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="mr-phone" className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    id="mr-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="mr-event-type" className="block text-sm font-medium mb-2">
                    Event type <span className="text-primary">*</span>
                  </label>
                  <select
                    id="mr-event-type"
                    required
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="mr-date" className="block text-sm font-medium mb-2">Event date (or estimate)</label>
                  <input
                    id="mr-date"
                    type="text"
                    placeholder="e.g. October 12, 2026 or 'Spring 2027'"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="mr-guests" className="block text-sm font-medium mb-2">Guest count</label>
                  <select
                    id="mr-guests"
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select range</option>
                    {GUEST_RANGES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="mr-notes" className="block text-sm font-medium mb-2">Anything else? (optional)</label>
                <textarea
                  id="mr-notes"
                  rows={3}
                  placeholder="Dietary needs, special requests, dates you’re weighing, etc."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>

              {selected.length > 0 && (
                <div className="bg-secondary/60 border border-border rounded-md p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Sending you</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.map((s) => {
                      const m = MENUS.find((x) => x.slug === s);
                      return (
                        <span key={s} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                          {m?.title}
                          <button type="button" onClick={() => toggleMenu(s)} className="hover:text-primary/70" aria-label="Remove">×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting || selected.length === 0}
                className="w-full bg-primary text-primary-foreground py-4 rounded-md font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending...' : `Send me ${selected.length || ''} menu${selected.length === 1 ? '' : 's'}`}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                We’ll never share your information. Used only to send the menu and coordinate your event.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Bottom contact strip */}
      <section className="bg-foreground text-background py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Call directly</div>
            <a href="tel:+13157520150" className="text-2xl lg:text-3xl font-serif hover:text-primary inline-flex items-center gap-2">
              <Phone className="w-5 h-5" />
              (315) 752-0150
            </a>
            <div className="text-sm opacity-70 mt-2">Mon–Fri 9–6, weekends by appt.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Email sales</div>
            <a href="mailto:sales@cicerogrand.com" className="text-2xl lg:text-3xl font-serif hover:text-primary inline-flex items-center gap-2 break-all">
              <Mail className="w-5 h-5 flex-shrink-0" />
              sales@cicerogrand.com
            </a>
            <div className="text-sm opacity-70 mt-2">Replies within one business day.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Visit the venue</div>
            <div className="text-xl font-serif">5875 Carmenica Drive</div>
            <div className="text-xl font-serif">Cicero, NY 13039</div>
            <div className="text-sm opacity-70 mt-2">Exit 98 off I-81 \u00b7 Free parking</div>
          </div>
        </div>
      </section>
    </>
  );
}
