import { Link } from 'wouter';
import { Check, ArrowUpRight, ChevronDown, Phone, Calendar } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { useSeo, SITE } from '../hooks/useSeo';
import eventsSeed from '../content/events.json';
import siteSeed from '../content/site.json';

const categories = [
  {
    href: '/event-center/corporate-meetings',
    eyebrow: '01',
    title: 'Corporate Meetings & Conferences',
    blurb:
      'Boardrooms, classrooms, breakouts, and full-day conferences — with A/V, breakfast, lunch, and discounted suite blocks for out-of-town attendees.',
    image: '/photos/venue-corporate-banquet.jpg',
    cta: 'Plan a meeting',
  },
  {
    href: '/event-center/social-events',
    eyebrow: '02',
    title: 'Social Events & Banquets',
    blurb:
      'Showers, birthdays, reunions, holiday parties, religious & cultural gatherings. Bring your own caterer — or use ours. Buffet, plated, or stations.',
    image: '/photos/venue-tablescape.jpg',
    cta: 'Plan a banquet',
  },
  {
    href: '/event-center/weddings',
    eyebrow: '03',
    title: 'Weddings',
    blurb:
      'Ceremony to last dance — all on-site. Rated 5.0/5.0 on WeddingWire. Outside caterers welcome. Bridal suite and guest-room block included.',
    image: '/photos/venue-wedding-reception.jpg',
    cta: 'Plan a wedding',
  },
];

export default function EventCenter() {
  const events = useContent<typeof eventsSeed>('events');
  const site = useContent<typeof siteSeed>('site');

  useSeo({
    title: 'Event Center · Banquet Hall, Meetings & Weddings · The Cicero Grand',
    description:
      'The Cicero Grand Event Center — banquet hall, corporate meeting space, and wedding venue near Syracuse, NY. Outside caterers welcome. On-site suites for guests. Get a custom quote.',
    canonicalPath: '/event-center',
    ogImage: '/photos/venue-ballroom-empty.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      name: `${SITE.name} — Event Center`,
      description:
        'Full-service event center in Cicero, NY. Corporate meetings, banquets, weddings. Outside caterers welcome. Hotel suites on-site.',
      url: `${SITE.url}/event-center`,
      telephone: SITE.salesPhone,
      email: SITE.email,
      image: `${SITE.url}/photos/venue-ballroom-empty.jpg`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.street,
        addressLocality: SITE.locality,
        addressRegion: SITE.region,
        postalCode: SITE.postalCode,
        addressCountry: SITE.country,
      },
      maximumAttendeeCapacity: 250,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Outside Caterers Welcome', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'On-site Audio/Visual', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Hotel Suites On-site', value: true },
      ],
    },
  });

  return (
    <>
      <PageHero
        eyebrow="The Event Center"
        image="/photos/venue-ballroom-empty.jpg"
        title={<>One ballroom. <em className="italic font-light">Every</em> kind of gathering.</>}
        intro="A 45 × 64 ballroom plus three flexible breakout rooms — built to host meetings, banquets, and weddings up to 250 guests. Outside caterers welcome, on-site suites for overnight guests, and one coordinator from booking through teardown."
      />

      {/* CALL-FIRST CTA BAR — directly under hero so ad traffic sees it immediately */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <p className="text-sm uppercase tracking-[0.2em] opacity-80 mb-2">Tour the ballroom this week</p>
            <h2 className="font-display text-2xl lg:text-3xl leading-tight tracking-tight">
              Talk to a coordinator now — availability, pricing, and menus in one call.
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
            <a
              href={`tel:${site.salesPhoneRaw}`}
              data-testid="event-hero-call"
              className="inline-flex items-center justify-center gap-2 px-6 h-14 rounded-full bg-background text-foreground font-medium hover:bg-background/90 transition-colors"
            >
              <Phone className="w-5 h-5" strokeWidth={2.2} />
              Call {site.salesPhone}
            </a>
            <a
              href="/contact?topic=Event%20%2F%20meeting%20inquiry&tour=1#contact-form"
              data-testid="event-hero-tour"
              className="inline-flex items-center justify-center gap-2 px-6 h-14 rounded-full border border-background/40 hover:bg-background/10 transition-colors"
            >
              <Calendar className="w-5 h-5" strokeWidth={2.2} />
              Request a tour
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS — 3 sub-pages */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="mb-16 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/40" /> Three event types
              </span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance mb-5">
                Pick the path that <em className="italic font-light">fits</em> your event.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Each path has tailored packages, menus, and add-ons. Spaces and capacities are shared — see the table below.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((c, i) => (
              <Reveal key={c.href} delay={i * 80}>
                <Link
                  href={c.href}
                  data-testid={`card-event-${c.eyebrow}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-foreground/5"
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                  <div className="absolute inset-0 p-7 lg:p-9 flex flex-col justify-between text-white">
                    <span className="text-xs uppercase tracking-[0.2em] opacity-80 tabular-nums">
                      {c.eyebrow} — {c.cta}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl lg:text-4xl leading-none tracking-tight mb-3 text-balance">
                        {c.title}
                      </h3>
                      <p className="text-sm opacity-90 leading-relaxed mb-5 max-w-md">{c.blurb}</p>
                      <span className="inline-flex items-center gap-2 text-sm border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                        Explore <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHARED SPACES & CAPACITIES */}
      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-16">
              <h2 className="col-span-12 lg:col-span-5 font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance">
                Four flexible spaces. <em className="italic font-light">One</em> coordinator.
              </h2>
              <ul className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
                {events.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm bg-background rounded-2xl p-4">
                    <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl border border-border overflow-hidden bg-card">
              <div className="px-6 py-5 border-b border-border">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  ✦ Spaces & capacities
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="px-6 py-4 font-medium">Space</th>
                      <th className="px-4 py-4 font-medium whitespace-nowrap">Size</th>
                      <th className="px-4 py-4 font-medium text-center">Classroom</th>
                      <th className="px-4 py-4 font-medium text-center">Theater</th>
                      <th className="px-4 py-4 font-medium text-center">Banquet</th>
                      <th className="px-4 py-4 font-medium text-center">U-Shape</th>
                      <th className="px-4 py-4 font-medium text-center">Boardroom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.spaces.map((s) => (
                      <tr key={s.name} className="border-t border-border">
                        <td className="px-6 py-5 font-display text-xl tracking-tight">{s.name}</td>
                        <td className="px-4 py-5 text-muted-foreground whitespace-nowrap">{s.size}</td>
                        <td className="px-4 py-5 text-center tabular-nums">{s.classroom}</td>
                        <td className="px-4 py-5 text-center tabular-nums">{s.theater}</td>
                        <td className="px-4 py-5 text-center tabular-nums">{s.banquet}</td>
                        <td className="px-4 py-5 text-center tabular-nums">{s.uShape}</td>
                        <td className="px-4 py-5 text-center tabular-nums">{s.boardroom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* OUTSIDE CATERING CALLOUT */}
      <section className="bg-foreground text-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="col-span-12 lg:col-span-5">
                <span className="text-xs uppercase tracking-[0.2em] text-background/60 mb-4 inline-flex items-center gap-2">
                  <span className="w-8 h-px bg-background/40" /> What sets us apart
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance">
                  Bring your own <em className="italic font-light">caterer</em>.
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <p className="text-lg leading-relaxed mb-6 max-w-prose text-background/90">
                  Most hotel banquet venues won't let outside food in the door. We will. Cultural events, religious gatherings, family reunions, ethnic association banquets — bring the caterer that gets your community right.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base mb-6">
                  {[
                    'Cultural & ethnic catering welcome',
                    'Or use our in-house kitchen',
                    'Kosher, halal, vegetarian, vegan',
                    'Religious & community events',
                    'Or use our full on-site catering',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-background/60 max-w-prose">
                  Two paths: use our in-house kitchen — plated, buffet, stations, carving, prepared by Chef Ken and his team — or bring your own caterer with a modest catering fee. Either way we provide tables, chairs, linens, china, glassware, silverware, and full kitchen access.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-12 text-balance">
              Common <em className="italic font-light">questions</em>.
            </h2>
          </Reveal>
          <div className="space-y-3">
            {events.faqs.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <details className="group bg-background border border-border rounded-3xl px-6 py-5 open:py-6 transition-all">
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none font-display text-xl lg:text-2xl tracking-tight">
                    <span className="text-balance">{f.q}</span>
                    <ChevronDown className="w-5 h-5 mt-1.5 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-muted-foreground leading-relaxed mt-4">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
              Get a <em className="italic font-light">proposal</em>.
            </h2>
            <p className="text-lg text-background/70 leading-relaxed mb-8">
              Tell us about your event — meeting, banquet, reunion, holiday party, wedding. Our team will respond with availability, custom menus, and a quote within one business day.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${site.salesPhoneRaw}`}
                className="inline-flex items-center px-7 h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Call sales: {site.salesPhone}
              </a>
              <a
                href="/contact?topic=Event%20%2F%20meeting%20inquiry#contact-form"
                data-testid="event-bottom-cta"
                className="inline-flex items-center px-7 h-12 rounded-full border border-background/30 hover:bg-background/10 transition-colors"
              >
                Request a quote
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-3">
            <img src="/photos/venue-ballroom-empty.jpg" alt="The Ballroom" loading="lazy" className="aspect-[4/5] object-cover rounded-3xl" />
            <img src="/photos/venue-dance-floor.jpg" alt="Reception with dance floor" loading="lazy" className="aspect-[4/5] object-cover rounded-3xl mt-10" />
          </div>
        </div>
      </section>
    </>
  );
}
