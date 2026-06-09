import { Check, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { PageHero } from '../../components/PageHero';
import { Reveal } from '../../components/Reveal';
import { useContent } from '../../lib/content';
import { useSeo, SITE } from '../../hooks/useSeo';
import eventsSeed from '../../content/events.json';
import siteSeed from '../../content/site.json';

export default function CorporateMeetings() {
  const events = useContent<typeof eventsSeed>('events');
  const site = useContent<typeof siteSeed>('site');

  const corporate = events.packages.find((p) => p.category.startsWith('Corporate'));

  useSeo({
    title: 'Meeting Rooms Syracuse NY · Free A/V, Wi-Fi & Parking | The Cicero Grand',
    description:
      'Conference & meeting rooms 6 min from Micron, off I-81 Exit 98. Free A/V, Wi-Fi & parking. Catered breakfast and lunch packages. Discounted suite blocks for out-of-town attendees. Call (315) 752-0150.',
    canonicalPath: '/event-center/corporate-meetings',
    ogImage: '/photos/venue-ballroom-empty.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      name: `${SITE.name} — Corporate Meetings & Conferences`,
      description:
        'Corporate meeting venue near Syracuse, NY. A/V, in-house catering (or bring your own), and on-site hotel suites for attendees.',
      url: `${SITE.url}/event-center/corporate-meetings`,
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
      maximumAttendeeCapacity: 220,
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Event Center · Corporate"
        image="/photos/venue-ballroom-empty.jpg"
        title={<>Meetings that <em className="italic font-light">land</em>.</>}
        intro="Half-day sessions, full-day conferences, training, and off-sites. Configurable as classroom, theater, U-shape, or boardroom. Breakfast, lunch, and breaks built around your agenda."
      />

      {/* Breadcrumb */}
      <nav className="bg-background border-b border-border" aria-label="Breadcrumb">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/event-center" className="hover:text-foreground transition-colors">Event Center</Link>
          <span>/</span>
          <span className="text-foreground">Corporate Meetings</span>
        </div>
      </nav>

      {/* WHY CICERO GRAND */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="col-span-12 lg:col-span-6">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 inline-flex items-center gap-2">
                  ✦ Built for productivity
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-6 text-balance">
                  One venue. <em className="italic font-light">Everything</em> your team needs.
                </h2>
                <ul className="space-y-3 mb-8">
                  {[
                    'Suite block at preferred rates for out-of-town attendees',
                    'Free Wi-Fi for every attendee — no daily caps',
                    'On-site A/V — projectors, screens, mics, podium',
                    'Free parking, including bus & truck',
                    'Free hot breakfast at the hotel for staying guests',
                    'Indoor pool, fitness, and lobby spaces for downtime',
                    'Dedicated coordinator from booking through teardown',
                  ].map((h) => (
                    <li key={h} className="flex items-start gap-3 text-base">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-3">
                <img src="/photos/venue-corporate-banquet.jpg" alt="Conference table coffee service detail" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl" />
                <img src="/photos/venue-foyer-prefunction.jpg" alt="Pre-function coffee break station" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl mt-12" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONFIGURATION & CAPACITIES */}
      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="mb-12 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/40" /> Room configurations
              </span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance mb-5">
                Set the room <em className="italic font-light">to</em> the agenda.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Pick classroom for training, theater for keynotes, U-shape for workshops, boardroom for executive sessions. Same room — different setup. We'll flip it during your lunch break if you need.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl border border-border overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="px-6 py-4 font-medium">Space</th>
                      <th className="px-4 py-4 font-medium whitespace-nowrap">Size</th>
                      <th className="px-4 py-4 font-medium text-center">Classroom</th>
                      <th className="px-4 py-4 font-medium text-center">Theater</th>
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

      {/* CORPORATE PACKAGES */}
      {corporate && (
        <section className="bg-background py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
            <Reveal>
              <div className="mb-16 max-w-3xl">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  <span className="w-8 h-px bg-foreground/40" /> Conference packages
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance mb-5">
                  Fueled, <em className="italic font-light">focused</em>, on-time.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Mix and match — add coffee or breakfast to any meeting, pick the lunch that fits your day, or bundle it all into a full-day conference. Your coordinator builds the final menu with you. <a href="/contact?topic=Event%20%2F%20meeting%20inquiry&event_type=Corporate%20meeting#contact-form" data-testid="corp-pricing-quote" className="text-foreground underline underline-offset-4 hover:text-primary">Request a custom quote</a>.
                </p>
                <p className="mt-4 text-sm text-muted-foreground/80 italic">Menu items below are example selections — your coordinator will tailor everything to your team.</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {corporate.items.map((pkg, i) => (
                <Reveal key={pkg.name} delay={i * 80}>
                  <article className="bg-card border border-border rounded-3xl p-7 lg:p-8 h-full flex flex-col">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-2xl lg:text-3xl tracking-tight mb-3 text-balance">{pkg.name}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{pkg.tagline}</p>
                    <ul className="space-y-2">
                      {pkg.menu.map((m) => (
                        <li key={m} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* A/V + ADD-ONS */}
      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12">
          <Reveal className="col-span-12 lg:col-span-5">
            <div className="bg-foreground text-background rounded-3xl p-8 lg:p-10 sticky top-28">
              <span className="text-xs uppercase tracking-[0.2em] text-background/60 mb-4 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-background/40" /> Suite blocks
              </span>
              <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-5 text-balance">Stay where you meet.</h3>
              <p className="text-background/80 leading-relaxed mb-4">
                Block 10+ all-suite rooms at preferred rates for out-of-town attendees. Every suite sleeps 4, so teams can share when budgets are tight. Free hot breakfast included.
              </p>
              <a
                href="/contact?topic=Group%20blocks&event_type=Corporate%20meeting%20room%20block#contact-form"
                data-testid="corp-room-block"
                className="inline-flex items-center text-background underline underline-offset-4 hover:text-primary transition-colors"
              >
                Request a group block →
              </a>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-7">
            <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-8 text-balance">A/V & meeting add-ons.</h3>
            <div className="space-y-7">
              {events.addOns.groups
                .filter((g) => g.label === 'Audio Visual' || g.label === 'Service & Logistics' || g.label === 'Menu Upgrades')
                .map((g) => (
                  <div key={g.label}>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{g.label}</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {g.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-12 text-balance">
              Common <em className="italic font-light">questions</em>.
            </h2>
          </Reveal>
          <div className="space-y-3">
            {events.faqs.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <details className="group bg-muted/30 border border-border rounded-3xl px-6 py-5 open:py-6 transition-all">
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
        <div className="max-w-3xl mx-auto px-5 lg:px-10 text-center">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
            Get a meeting <em className="italic font-light">proposal</em>.
          </h2>
          <p className="text-lg text-background/70 leading-relaxed mb-10 max-w-xl mx-auto">
            Tell us your dates, head count, and agenda. We'll send a proposal with menus, A/V, and a guest-room block within one business day.
          </p>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${site.salesPhoneRaw}`}
              className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Call sales: {site.salesPhone}
            </a>
            <a
              href="/contact?topic=Event%20%2F%20meeting%20inquiry&event_type=Corporate%20meeting&tour=1#contact-form"
              data-testid="corp-cta-quote"
              className="inline-flex items-center px-8 h-14 rounded-full border border-background/30 hover:bg-background/10 transition-colors"
            >
              Request a quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
