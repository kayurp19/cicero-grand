import { Link } from 'wouter';
import { ArrowUpRight, MapPin, Check, ChevronDown, Phone } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useSeo, SITE } from '../hooks/useSeo';
import landingData from '../content/landing-pages.json';

interface LandingPageProps {
  slug: keyof typeof landingData;
}

export default function LandingPage({ slug }: LandingPageProps) {
  const data = (landingData as any)[slug];
  if (!data) return null;

  useSeo({
    title: data.title,
    description: data.description,
    canonicalPath: data.path,
    ogImage: data.ogImage,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: SITE.name,
        description: data.description,
        url: `${SITE.url}${data.path}`,
        telephone: SITE.phone,
        email: SITE.email,
        image: `${SITE.url}${data.ogImage}`,
        priceRange: SITE.priceRange,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.street,
          addressLocality: SITE.locality,
          addressRegion: SITE.region,
          postalCode: SITE.postalCode,
          addressCountry: SITE.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE.latitude,
          longitude: SITE.longitude,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '31',
          bestRating: '5',
        },
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: SITE.bookingUrl,
            actionPlatform: [
              'http://schema.org/DesktopWebPlatform',
              'http://schema.org/MobileWebPlatform',
            ],
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  });

  return (
    <>
      <PageHero
        eyebrow={`${data.venue.drive} from The Cicero Grand`}
        image={data.ogImage}
        title={
          <>
            {data.h1.split(' ').slice(0, -2).join(' ')}{' '}
            <em className="italic font-light">
              {data.h1.split(' ').slice(-2).join(' ')}
            </em>
            .
          </>
        }
        intro={data.subtitle}
      />

      {/* Quick facts strip */}
      <section className="bg-background py-16 lg:py-20 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Drive time
              </div>
              <div className="font-display text-3xl tracking-tight tabular-nums">
                {data.venue.drive}
              </div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Distance
              </div>
              <div className="font-display text-3xl tracking-tight tabular-nums">
                {data.venue.miles.split(' ')[0]} mi
              </div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Sleeps
              </div>
              <div className="font-display text-3xl tracking-tight tabular-nums">4</div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Breakfast
              </div>
              <div className="font-display text-3xl tracking-tight">Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + booking CTA */}
      <section className="bg-background py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 lg:col-span-7">
              <Reveal>
                <p className="text-lg lg:text-xl leading-relaxed text-foreground/85 max-w-prose">
                  {data.intro}
                </p>
              </Reveal>

              <Reveal>
                <ul className="mt-10 space-y-3">
                  {data.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-base leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <Reveal>
                <div className="bg-foreground text-background rounded-3xl p-8 lg:p-10 sticky top-32">
                  <span className="text-xs uppercase tracking-[0.2em] text-background/60">
                    Book direct
                  </span>
                  <h3 className="font-display text-3xl lg:text-4xl tracking-tight mt-3">
                    Lowest rate, guaranteed.
                  </h3>
                  <p className="mt-4 text-sm text-background/75 leading-relaxed">
                    Book direct on cicerogrand.com and skip the OTA fees. Every suite
                    sleeps four with a kitchenette and separate living area.
                  </p>
                  <div className="mt-6 space-y-3">
                    <a
                      href={SITE.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-6 h-12 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Check rates & book{' '}
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                    <a
                      href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                      className="w-full inline-flex items-center justify-center px-6 h-12 rounded-full border border-background/30 text-sm font-medium hover:bg-background hover:text-foreground transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" /> {SITE.phone}
                    </a>
                  </div>
                  <div className="mt-6 pt-6 border-t border-background/15 text-xs text-background/65 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>
                        5875 Carmenica Drive
                        <br />
                        Cicero, NY 13039
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Why stay here */}
      <section className="bg-muted/30 py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Why The Cicero Grand
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-tight mt-3 max-w-3xl text-balance">
              Closer than downtown. Bigger than the airport. Quieter than both.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {data.why.map((w: any, i: number) => (
              <Reveal key={i}>
                <div className="bg-background border border-border rounded-3xl p-8 h-full">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl tracking-tight mt-3 mb-4">
                    {w.title}.
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {w.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby places */}
      <section className="bg-background py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 lg:col-span-4">
              <Reveal>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  In the area
                </span>
                <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1] tracking-tight mt-3 text-balance">
                  Also worth your time.
                </h2>
                <p className="text-sm text-muted-foreground mt-5 max-w-md leading-relaxed">
                  See the full{' '}
                  <Link href="/area-guide" className="underline hover:text-primary">
                    Syracuse Area Guide
                  </Link>{' '}
                  for restaurants, breweries, attractions, and more.
                </p>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                {data.nearby.map((line: string, i: number) => (
                  <li
                    key={i}
                    className="py-3.5 border-b border-border/60 text-base"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-10">
            <div className="col-span-12 lg:col-span-4">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Common questions
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1] tracking-tight mt-3 text-balance">
                Frequently asked.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <div className="divide-y divide-border">
                {data.faqs.map((faq: any, i: number) => (
                  <details key={i} className="group py-5">
                    <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                      <h3 className="font-medium text-lg leading-snug pr-4">
                        {faq.q}
                      </h3>
                      <ChevronDown className="w-5 h-5 mt-1 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-prose">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {data.venue.drive} from {data.venue.name}
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-tight mt-3 max-w-3xl mx-auto text-balance">
              Make The Cicero Grand your basecamp.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/rooms"
                className="inline-flex items-center px-6 h-12 rounded-full border border-foreground/15 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                See all suites
              </Link>
              <a
                href={SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 h-12 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Book a stay <ArrowUpRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
