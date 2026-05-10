import { Check, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { PageHero } from '../../components/PageHero';
import { Reveal } from '../../components/Reveal';
import { useContent } from '../../lib/content';
import { useSeo, SITE } from '../../hooks/useSeo';
import eventsSeed from '../../content/events.json';
import siteSeed from '../../content/site.json';

const occasions = [
  'Bridal & baby showers',
  'Birthdays & milestone parties',
  'Family reunions',
  'Holiday parties (corporate or family)',
  'Anniversaries & vow renewals',
  'Religious & cultural celebrations',
  'Quinceañeras & Sweet 16s',
  'Graduations & retirement parties',
  'Memorials & celebrations of life',
  'Sports teams & group travel',
  'Association banquets',
  'Fundraisers & galas',
];

export default function SocialEvents() {
  const events = useContent<typeof eventsSeed>('events');
  const site = useContent<typeof siteSeed>('site');

  // Pull both Social and Sports packages — they're all "social events"
  const socialCategories = events.packages.filter(
    (p) => !p.category.startsWith('Corporate'),
  );

  useSeo({
    title: 'Banquet Hall Syracuse · Outside Caterers Welcome · The Cicero Grand',
    description:
      'Banquet hall near Syracuse, NY for showers, reunions, holiday parties, religious & cultural events. Outside caterers welcome. Buffet, plated, or stations. Hotel suites on-site.',
    canonicalPath: '/event-center/social-events',
    ogImage: '/photos/venue-ballroom-empty.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      name: `${SITE.name} — Social Events & Banquets`,
      description:
        'Banquet hall and social event venue near Syracuse, NY. Outside caterers welcome — kosher, halal, cultural, family. On-site suites for guests.',
      url: `${SITE.url}/event-center/social-events`,
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
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Event Center · Social"
        image="/photos/venue-ballroom-empty.jpg"
        title={<>Banquets that <em className="italic font-light">feel</em> like home.</>}
        intro="Showers, reunions, birthdays, holiday parties, religious & cultural gatherings — up to 250 guests. Bring your own caterer for the dishes that matter, or use ours. One ballroom. Every tradition welcome."
      />

      {/* Breadcrumb */}
      <nav className="bg-background border-b border-border" aria-label="Breadcrumb">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/event-center" className="hover:text-foreground transition-colors">Event Center</Link>
          <span>/</span>
          <span className="text-foreground">Social Events</span>
        </div>
      </nav>

      {/* OCCASIONS GRID */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
              <div className="col-span-12 lg:col-span-6">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 inline-flex items-center gap-2">
                  ✦ Every kind of gathering
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-6 text-balance">
                  If it's worth <em className="italic font-light">celebrating</em>, we'll host it.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our ballroom hosts up to 250 guests for banquet seating, with three smaller breakout rooms for showers, intimate dinners, and meeting-style events from 20 to 110 guests.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-3">
                <img src="/photos/venue-tablescape.jpg" alt="Banquet tablescape detail" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl" />
                <img src="/photos/venue-cocktail-hour.jpg" alt="Cocktail hour detail" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl mt-12" />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {occasions.map((o) => (
                <li key={o} className="flex items-start gap-3 text-sm bg-muted/40 rounded-2xl p-4">
                  <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* OUTSIDE CATERING — HEADLINE FEATURE */}
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
                  This is the question we get most. The answer is yes. Family recipes. Cultural specialists. The restaurant your community has used for thirty years. Religious dietary laws — kosher, halal, jain. We provide the room, the kitchen access, and everything on the table. You bring the food.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base mb-6">
                  {[
                    'Cultural & ethnic catering welcome',
                    'In-house catering led by our exec chef of 30+ years',
                    'Kosher, halal, vegetarian, vegan, jain',
                    'Family recipes & community caterers',
                    'Or use our full on-site catering',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-background/60 max-w-prose">
                  Two paths: use our in-house catering led by our executive chef of 30+ years (plated, buffet, stations, carving), or bring your own caterer with a modest catering fee. Either way we provide tables, chairs, linens, china, glassware, silverware, and full kitchen access.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SOCIAL PACKAGES */}
      {socialCategories.length > 0 && (
        <section className="bg-muted/30 py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
            <Reveal>
              <div className="mb-16 max-w-3xl">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  <span className="w-8 h-px bg-foreground/40" /> Banquet packages
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance mb-5">
                  Built around <em className="italic font-light">your</em> event.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Pick a starting package — classic, premium, family-style, boxed, or pizza-and-wings for groups. Mix in stations, hors d'oeuvres, and bar service. Your coordinator builds the final menu. <a href={`mailto:${site.email}?subject=Banquet%20pricing%20request%20-%20Cicero%20Grand`} className="text-foreground underline underline-offset-4 hover:text-primary">Request a custom quote</a>.
                </p>
                <p className="mt-4 text-sm text-muted-foreground/80 italic">Menu items below are example selections — your coordinator will tailor everything.</p>
              </div>
            </Reveal>

            <div className="space-y-20 lg:space-y-28">
              {socialCategories.map((cat, ci) => (
                <Reveal key={cat.category}>
                  <div className="grid grid-cols-12 gap-6 lg:gap-12 items-start">
                    <div className={`col-span-12 lg:col-span-5 ${ci % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted lg:sticky lg:top-28">
                        <img src={cat.image} alt={cat.category} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-7">
                      <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-8 text-balance">{cat.category}</h3>
                      <div className="space-y-5">
                        {cat.items.map((pkg) => (
                          <div key={pkg.name} className="bg-background border border-border rounded-3xl p-6 lg:p-7">
                            <div className="flex items-start justify-between gap-6 mb-3">
                              <h4 className="font-display text-2xl tracking-tight">{pkg.name}</h4>
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">{pkg.tagline}</p>
                            <ul className="space-y-2">
                              {pkg.menu.map((m) => (
                                <li key={m} className="flex items-start gap-3 text-sm">
                                  <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOSTED BAR + ADD-ONS */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12">
          <Reveal className="col-span-12 lg:col-span-5">
            <div className="bg-foreground text-background rounded-3xl p-8 lg:p-10 sticky top-28">
              <span className="text-xs uppercase tracking-[0.2em] text-background/60 mb-4 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-background/40" /> Bar service
              </span>
              <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-5 text-balance">{events.hostedBar.title}</h3>
              <p className="text-background/80 leading-relaxed mb-6">{events.hostedBar.intro}</p>
              <div className="flex flex-wrap gap-2">
                {events.hostedBar.tiers.map((t) => (
                  <span key={t} className="px-4 h-10 inline-flex items-center rounded-full border border-background/30 text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-7">
            <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-8 text-balance">{events.addOns.title}</h3>
            <div className="space-y-7">
              {events.addOns.groups.map((g) => (
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
        <div className="max-w-3xl mx-auto px-5 lg:px-10 text-center">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
            Let's <em className="italic font-light">plan</em> it.
          </h2>
          <p className="text-lg text-background/70 leading-relaxed mb-10 max-w-xl mx-auto">
            Tell us your date, head count, and the kind of event you're hosting. We'll send a proposal with menus, bar, and a guest-room block within one business day.
          </p>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${site.salesPhoneRaw}`}
              className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Call sales: {site.salesPhone}
            </a>
            <a
              href={`mailto:${site.email}?subject=Social%20event%20inquiry%20-%20Cicero%20Grand`}
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
