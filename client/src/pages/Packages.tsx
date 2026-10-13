import { ArrowUpRight, Phone, Check } from 'lucide-react';
import { Link } from 'wouter';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useSeo, SITE } from '../hooks/useSeo';
import packages from '../content/packages.json';
import site from '../content/site.json';

export default function Packages() {
  useSeo({
    title: 'Hotel Packages · Direct Booking Perks · The Cicero Grand',
    description:
      'Hotel packages at The Cicero Grand: Micron crew rates, JMA Dome game days, Empower Amphitheater concert nights, Turning Stone casino weekends, and family Destiny stays. Explore our direct-booking perks.',
    canonicalPath: '/packages',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'Packages', item: `${SITE.url}/packages` },
        ],
      },
      ...packages.items.map((p, i) => ({
        '@context': 'https://schema.org',
        '@type': 'Offer',
        '@id': `${SITE.url}/packages#${p.slug}`,
        name: p.name,
        description: p.blurb,
        url: `${SITE.url}/packages`,
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: p.from,
          priceCurrency: 'USD',
          minPrice: p.from,
        },
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Hotel',
          name: SITE.name,
          url: SITE.url,
        },
        itemOffered: {
          '@type': 'LodgingReservation',
          name: p.name,
          provider: { '@type': 'Hotel', name: SITE.name, url: SITE.url },
        },
      })),
    ],
  });

  return (
    <>
      <PageHero
        eyebrow="Packages"
        image="/photos/lobby-fireplace.jpg"
        title={
          <>
            Built around <em className="italic font-light">why you're here</em>.
          </>
        }
        intro={packages.intro}
      />

      {/* Packages grid */}
      <section className="bg-background py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {packages.items.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <article
                  data-testid={`package-${p.id}`}
                  className="group relative bg-card border border-card-border rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/40 transition-colors"
                >
                  <div className="aspect-[16/8] bg-muted relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                    <div className="absolute top-5 left-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-background/95 text-foreground text-[10px] uppercase tracking-[0.18em] font-medium">
                        {p.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-5 right-5 text-white">
                      <span className="text-[10px] uppercase tracking-[0.16em] opacity-80">From</span>
                      <div className="font-display text-3xl tracking-tight tabular-nums leading-none">
                        ${p.from}
                        <span className="text-base opacity-80">/night</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-7 lg:p-9 flex flex-col flex-1">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {p.audienceLine}
                    </span>
                    <h2 className="font-display text-2xl lg:text-3xl leading-tight tracking-tight mt-3 text-balance">
                      {p.name}
                    </h2>
                    <p className="text-sm font-medium text-primary mt-2">{p.headline}</p>
                    <p className="text-base text-muted-foreground mt-4 leading-relaxed">{p.blurb}</p>

                    <ul className="mt-6 space-y-2.5">
                      {p.includes.map((line, idx) => (
                        <li key={idx} className="flex gap-3 text-sm leading-snug">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
                      {p.venueDistance}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <a
                        href={site.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`package-book-${p.id}`}
                        className="inline-flex items-center px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Book direct <ArrowUpRight className="w-4 h-4 ml-1" />
                      </a>
                      <a
                        href={`tel:${site.salesPhoneRaw}`}
                        className="inline-flex items-center gap-2 px-5 h-11 rounded-full border border-border text-sm hover:bg-foreground/5 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Group sales
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            {packages.disclaimer}
          </p>
        </div>
      </section>

      {/* Why book direct */}
      <section className="bg-muted/30 py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-6 mb-12">
              <div className="col-span-12 md:col-span-5">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Direct booking benefits
                </span>
                <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-tight mt-3 text-balance">
                  Why <em className="italic font-light">book direct</em>.
                </h2>
              </div>
              <div className="col-span-12 md:col-span-7 md:pt-3">
                <p className="text-base text-muted-foreground max-w-prose">
                  Plan your stay with the people who know the property. Book on cicerogrand.com for direct-booking perks, or call our team for help choosing a package, arranging a group stay, or sharing a special request.
                </p>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: 'Help choosing your stay', b: 'Speak with our team about room options, packages, group blocks, and extended stays.' },
              { t: 'Welcome amenity', b: 'A bottle of water and a snack are a small thank-you for booking directly with us.' },
              { t: 'Complimentary upgrade', b: 'Ask about a room upgrade at check-in, subject to availability.' },
              { t: 'Late checkout', b: 'Request checkout up to 1 PM at no additional cost, subject to availability.' },
              { t: 'Reservation assistance', b: 'Contact the hotel for help with requests or date changes. Your selected rate terms apply.' },
              { t: 'A return-stay offer', b: 'Enjoy 10% off your next direct stay within 12 months. Ask our team for redemption details.' },
            ].map((r, i) => (
              <Reveal key={r.t} delay={i * 40}>
                <div className="h-full bg-background border border-border rounded-2xl p-6 lg:p-7">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-display text-sm tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg leading-tight tracking-tight mt-4">{r.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Reserve a stay
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-tight mt-3 max-w-3xl mx-auto text-balance">
              Pick a package · book direct · make yourself at home.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 h-12 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Book a stay <ArrowUpRight className="w-4 h-4 ml-1" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 h-12 rounded-full border border-foreground/15 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
