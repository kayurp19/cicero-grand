import { Link } from 'wouter';
import { ArrowUpRight, MapPin, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { useSeo, SITE } from '../hooks/useSeo';
import areaSeed from '../content/area.json';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Area() {
  const area = useContent<typeof areaSeed>('area');

  useSeo({
    title:
      'Syracuse Area Guide · Hotels Near Destiny USA, Micron, SU & The Airport · The Cicero Grand',
    description:
      "The locals' guide to Syracuse, NY. Drive times to Micron, Destiny USA, JMA Wireless Dome, Hancock Airport, and Onondaga Lake from The Cicero Grand — plus 100+ named restaurants, breweries, parks, and attractions.",
    canonicalPath: '/area-guide',
    ogImage: '/photos/exterior-1.jpg',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: 'Syracuse, NY — Visitor & Area Guide',
        description: area.seoBlurb || area.intro,
        url: `${SITE.url}/area-guide`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Syracuse',
          addressRegion: 'NY',
          addressCountry: 'US',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (area.faqs || []).map((f: any) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Top attractions, restaurants, and local businesses near The Cicero Grand',
        itemListElement: (area.sections || []).flatMap((s: any, si: number) =>
          (s.items || []).map((it: any, idx: number) => ({
            '@type': 'ListItem',
            position: si * 100 + idx + 1,
            item: {
              '@type': 'Place',
              name: it.name,
              address: it.address,
            },
          }))
        ),
      },
    ],
  });

  return (
    <>
      <PageHero
        eyebrow="Area Guide"
        image="/photos/exterior-1.jpg"
        title={
          <>
            The middle <em className="italic font-light">of</em> everywhere.
          </>
        }
        intro={area.intro}
      />

      {/* Quick distance snapshot */}
      <section className="bg-background pt-20 lg:pt-28">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <div className="col-span-12 md:col-span-3">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Drive times
              </span>
              <h2 className="font-display text-3xl leading-[1] tracking-tight mt-3">
                The map, simplified.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3">
              {area.snapshot.map((p: any) => (
                <div
                  key={p.label}
                  className="bg-card border border-card-border rounded-2xl p-5"
                >
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                    {p.label}
                  </div>
                  <div className="font-display text-3xl tracking-tight tabular-nums">
                    {p.d}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inline CTA #1 — after snapshot */}
      <section className="bg-background pb-12">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="bg-primary/[0.04] border border-primary/15 rounded-3xl p-8 lg:p-10 grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-8">
              <span className="text-xs uppercase tracking-[0.2em] text-primary/80">
                Stay 5 minutes away
              </span>
              <h3 className="font-display text-2xl lg:text-3xl tracking-tight mt-2 text-balance">
                Spacious all-suite rooms at I-81 Exit 30 — every suite sleeps four.
              </h3>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end gap-3">
              <Link
                href="/rooms"
                className="inline-flex items-center px-5 h-11 rounded-full border border-foreground/15 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Suites
              </Link>
              <a
                href={SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Book a stay <ArrowUpRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick jump nav */}
      <section className="bg-background py-6 sticky top-[64px] z-30 border-y border-border/60 backdrop-blur-md bg-background/85">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {area.sections.map((s: any) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-medium border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          {area.sections.map((section: any, si: number) => {
            const showCtaAfter = si === Math.floor(area.sections.length / 2) - 1;
            return (
              <div key={section.id}>
                <Reveal>
                  <div
                    id={section.id}
                    className="grid grid-cols-12 gap-8 lg:gap-12 py-14 lg:py-20 border-t border-border scroll-mt-32"
                  >
                    <div className="col-span-12 lg:col-span-4">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                        {String(si + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1] tracking-tight mt-3 text-balance">
                        {section.title}.
                      </h2>
                      {section.blurb && (
                        <p className="text-sm text-muted-foreground mt-5 max-w-md leading-relaxed">
                          {section.blurb}
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                        {section.items.map((item: any) => {
                          const itemId = slugify(item.name);
                          return (
                            <li
                              key={item.name}
                              id={itemId}
                              className="py-4 border-b border-border/60 scroll-mt-32"
                            >
                              <div className="flex items-baseline justify-between gap-3">
                                <span className="font-medium text-base leading-tight">
                                  {item.name}
                                </span>
                                {item.note && (
                                  <span className="text-xs text-muted-foreground tabular-nums shrink-0 text-right">
                                    {item.note}
                                  </span>
                                )}
                              </div>
                              {(item.address || item.tag) && (
                                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                  {item.address && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {item.address}
                                    </span>
                                  )}
                                  {item.tag && (
                                    <span className="ml-auto text-muted-foreground/80">
                                      · {item.tag}
                                    </span>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Reveal>

                {/* Inline CTA #2 — mid-page */}
                {showCtaAfter && (
                  <Reveal>
                    <div className="my-8 bg-foreground text-background rounded-3xl p-8 lg:p-10 grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-12 md:col-span-8">
                        <span className="text-xs uppercase tracking-[0.2em] text-background/60">
                          Closer than you think
                        </span>
                        <h3 className="font-display text-2xl lg:text-3xl tracking-tight mt-2 text-balance">
                          From The Cicero Grand, every place on this list is twenty minutes
                          or less.
                        </h3>
                      </div>
                      <div className="col-span-12 md:col-span-4 flex md:justify-end gap-3">
                        <Link
                          href="/offers"
                          className="inline-flex items-center px-5 h-11 rounded-full border border-background/30 text-sm font-medium hover:bg-background hover:text-foreground transition-colors"
                        >
                          See offers
                        </Link>
                        <a
                          href={SITE.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 h-11 rounded-full bg-background text-foreground text-sm font-medium hover:bg-background/90 transition-colors"
                        >
                          Book now <ArrowUpRight className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Getting around */}
      {area.transit && (
        <section className="bg-muted/30 py-20 lg:py-28 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
            <Reveal>
              <div className="grid grid-cols-12 gap-8 lg:gap-12">
                <div className="col-span-12 lg:col-span-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Transit
                  </span>
                  <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1] tracking-tight mt-3 text-balance">
                    {area.transit.title}.
                  </h2>
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <ul className="space-y-4">
                    {area.transit.items.map((line: string, i: number) => (
                      <li
                        key={i}
                        className="flex gap-4 pb-4 border-b border-border/60 last:border-0"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0 mt-1">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-base leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ — critical for SEO */}
      {area.faqs && area.faqs.length > 0 && (
        <section className="bg-background py-20 lg:py-28 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
            <Reveal>
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
                    {area.faqs.map((faq: any, i: number) => (
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
            </Reveal>
          </div>
        </section>
      )}

      {/* Final CTA #3 */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Ready when you are
              </span>
              <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-tight mt-3 text-balance">
                Make Cicero your <em className="italic font-light">basecamp</em>.
              </h2>
              <p className="mt-5 text-base text-muted-foreground max-w-xl mx-auto">
                One quiet exit off I-81. Free hot breakfast, indoor pool, all-suite rooms
                that sleep four. Book direct for the lowest rate.
              </p>
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
            </div>
          </Reveal>
        </div>
      </section>

      {/* Live events calendar — powered by Visit Syracuse */}
      <section className="bg-muted/30 py-24 lg:py-32 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-10">
              <div className="col-span-12 lg:col-span-5">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  What's on this week
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mt-3 text-balance">
                  Live events <em className="italic font-light">calendar</em>.
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-7 lg:pt-4">
                <p className="text-base text-muted-foreground max-w-prose">
                  Concerts, festivals, sports, theater, and family events happening across
                  Syracuse and Onondaga County. Updated daily by Visit Syracuse — plan
                  your stay around what's on.
                </p>
                <a
                  href="https://events.visitsyracuse.com/events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium hover:text-primary transition-colors"
                >
                  Open full calendar at visitsyracuse.com →
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl overflow-hidden border border-border bg-background shadow-sm">
              <iframe
                src="https://events.visitsyracuse.com/events/"
                title="Syracuse area events calendar — powered by Visit Syracuse"
                loading="lazy"
                className="w-full h-[900px] border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Calendar courtesy of{' '}
              <a
                href="https://www.visitsyracuse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Visit Syracuse
              </a>
              . Listings are not affiliated with The Cicero Grand.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
