import { Link } from 'wouter';
import { ArrowUpRight, MapPin, Check, Phone, Mail, Building2, Stethoscope, GraduationCap } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useSeo, SITE } from '../hooks/useSeo';

interface Employer {
  slug: string;
  path: string;
  name: string;
  short: string;
  drive: string;
  hook: string;
  category: 'defense' | 'tech' | 'utility' | 'education' | 'medical';
}

const employers: Employer[] = [
  {
    slug: 'micron',
    path: '/hotels-near-micron',
    name: 'Micron Technology Megafab',
    short: 'Micron',
    drive: '6 minutes',
    hook: 'Closest full-service hotel to the Clay build site. Long-stay rates for crews, vendors, engineers.',
    category: 'tech',
  },
  {
    slug: 'srctec',
    path: '/hotels-near-srctec-syracuse',
    name: 'SRCTec / SRC Inc.',
    short: 'SRCTec / SRC',
    drive: '6 minutes',
    hook: 'Closest full-service suite hotel to SRC. Corporate direct billing, quiet rooms, quick access.',
    category: 'defense',
  },
  {
    slug: 'lockheed-martin',
    path: '/hotels-near-lockheed-martin-syracuse',
    name: 'Lockheed Martin (Salina)',
    short: 'Lockheed Martin',
    drive: '10 minutes',
    hook: 'Salina campus in 10 minutes. Cleared-defense rates and direct billing.',
    category: 'defense',
  },
  {
    slug: 'rtx-raytheon',
    path: '/hotels-near-rtx-raytheon-syracuse',
    name: 'RTX / Raytheon Technologies',
    short: 'RTX / Raytheon',
    drive: '12 minutes',
    hook: 'East Syracuse site in 12 minutes. Quiet suites, defense-corporate rates.',
    category: 'defense',
  },
  {
    slug: 'national-grid',
    path: '/hotels-near-national-grid-syracuse',
    name: 'National Grid (Syracuse)',
    short: 'National Grid',
    drive: '12 minutes',
    hook: 'Emergency storm-response blocks and direct billing. Crews sleep 12 minutes from the office.',
    category: 'utility',
  },
  {
    slug: 'le-moyne',
    path: '/hotels-near-le-moyne-college',
    name: 'Le Moyne College',
    short: 'Le Moyne',
    drive: '18 minutes',
    hook: 'Parent weekends, admitted-student events, visiting-team lodging.',
    category: 'education',
  },
  {
    slug: 'upstate-medical',
    path: '/hotels-near-upstate-medical',
    name: 'Upstate Medical University',
    short: 'Upstate Medical',
    drive: '15 minutes',
    hook: 'Fifteen minutes from Upstate, Crouse, and Golisano Children\u2019s. Quiet room while family is in care.',
    category: 'medical',
  },
  {
    slug: 'crouse-hospital',
    path: '/hotels-near-crouse-hospital',
    name: 'Crouse Health',
    short: 'Crouse Hospital',
    drive: '15 minutes',
    hook: 'Patient family rates. Quiet suites, free hot breakfast, 24/7 check-in.',
    category: 'medical',
  },
  {
    slug: 'st-josephs-hospital',
    path: '/hotels-near-st-josephs-hospital-syracuse',
    name: 'St. Joseph\u2019s Health Hospital',
    short: 'St. Joseph\u2019s',
    drive: '15 minutes',
    hook: 'Patient family rates. Real suites with kitchenette, ADA rooms available.',
    category: 'medical',
  },
  {
    slug: 'va-medical-center',
    path: '/hotels-near-va-medical-center-syracuse',
    name: 'Syracuse VA Medical Center',
    short: 'VA Medical Center',
    drive: '18 minutes',
    hook: 'Veteran and patient-family rates. ADA rooms with roll-in shower. 24/7 check-in.',
    category: 'medical',
  },
];

const categories = [
  {
    id: 'defense',
    label: 'Defense & Aerospace',
    icon: Building2,
    blurb: 'Cleared-defense rates, secure direct billing, quiet suites for extended assignments.',
  },
  {
    id: 'tech',
    label: 'Tech & Advanced Manufacturing',
    icon: Building2,
    blurb: 'Long-stay rates for crews, contractors, and traveling engineers.',
  },
  {
    id: 'utility',
    label: 'Utilities & Emergency Response',
    icon: Building2,
    blurb: 'Storm-response blocks, 24/7 check-in, immediate direct billing setup.',
  },
  {
    id: 'education',
    label: 'Higher Education',
    icon: GraduationCap,
    blurb: 'Parent weekends, admitted-student events, visiting-team lodging, alumni functions.',
  },
  {
    id: 'medical',
    label: 'Medical & Patient Family',
    icon: Stethoscope,
    blurb: 'Patient-family rates, ADA rooms with roll-in shower, quiet suites, 24/7 check-in.',
  },
] as const;

export default function Corporate() {
  useSeo({
    title: 'Corporate & Institutional Rates \u00b7 The Cicero Grand',
    description:
      'Corporate direct billing, long-stay rates, and dedicated blocks for Micron, SRC, Lockheed Martin, RTX/Raytheon, National Grid, Upstate Medical, Crouse, St. Joseph\u2019s, VA Medical Center, and Le Moyne College. Book directly with the sales team at The Cicero Grand.',
    canonicalPath: '/corporate',
    ogImage: '/photos/exterior-entrance.jpg',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: SITE.name,
        url: `${SITE.url}/corporate`,
        telephone: SITE.phone,
        email: SITE.email,
        priceRange: SITE.priceRange,
        image: `${SITE.url}/photos/exterior-entrance.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.street,
          addressLocality: SITE.locality,
          addressRegion: SITE.region,
          postalCode: SITE.postalCode,
          addressCountry: SITE.country,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'Corporate', item: `${SITE.url}/corporate` },
        ],
      },
    ],
  });

  const grouped = categories.map((cat) => ({
    ...cat,
    items: employers.filter((e) => e.category === cat.id),
  }));

  return (
    <>
      <PageHero
        eyebrow="Corporate & Institutional Rates"
        image="/photos/exterior-entrance.jpg"
        title={
          <>
            Built for teams,{' '}
            <em className="italic font-light">crews, and families</em> traveling to Syracuse.
          </>
        }
        intro="Direct billing, long-stay rates, and dedicated blocks with the closest all-suite hotel to Micron, SRC, Lockheed Martin, RTX/Raytheon, National Grid, Le Moyne, and the Syracuse hospital corridor."
      />

      {/* Quick facts */}
      <section className="bg-background py-16 lg:py-20 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Suites
              </div>
              <div className="font-display text-3xl tracking-tight tabular-nums">65</div>
              <div className="text-sm text-muted-foreground mt-1">All-suite property</div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Direct billing
              </div>
              <div className="font-display text-3xl tracking-tight">Yes</div>
              <div className="text-sm text-muted-foreground mt-1">Net-30 terms available</div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Long-stay
              </div>
              <div className="font-display text-3xl tracking-tight">7+ nights</div>
              <div className="text-sm text-muted-foreground mt-1">Weekly &amp; monthly rates</div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
                Included
              </div>
              <div className="font-display text-3xl tracking-tight">Free</div>
              <div className="text-sm text-muted-foreground mt-1">Hot breakfast &amp; parking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why corporates choose Cicero Grand */}
      <section className="bg-background py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 lg:col-span-7">
              <Reveal>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Why Cicero Grand
                </span>
                <h2 className="font-display text-4xl lg:text-5xl tracking-tight mt-4">
                  The closest all-suite hotel to the corporate corridor north of Syracuse.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-foreground/85 max-w-prose">
                  Off I-81 Exit 30 in Cicero, minutes from the Micron Megafab site, SRC/SRCTec,
                  Lockheed Martin, RTX/Raytheon, National Grid, and the full Syracuse medical
                  corridor. Every room is a real suite with kitchenette &mdash; not a repackaged
                  standard room.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    'Corporate direct billing with net-30 terms',
                    'Weekly and monthly long-stay rates for crews and contractors',
                    'Dedicated blocks for storm response, project mobilization, and events',
                    'Every suite sleeps four with kitchenette (microwave + full-size fridge)',
                    'Free hot breakfast and free parking for every guest',
                    '24/7 front desk for shift schedules, late arrivals, and surgery mornings',
                    'ADA rooms with roll-in shower for accessible bookings',
                    'Executive Meeting &amp; Event Center on-site for training and mobilizations',
                  ].map((h, i) => (
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
                    Sales team
                  </span>
                  <h3 className="font-display text-3xl lg:text-4xl tracking-tight mt-3">
                    Set up direct billing or request a group block.
                  </h3>
                  <p className="mt-4 text-sm text-background/75 leading-relaxed">
                    Same-day response Monday&ndash;Friday. Contracts, W-9, and credit application
                    ready to send.
                  </p>
                  <div className="mt-8 space-y-4">
                    <a
                      href="tel:+13157520150"
                      className="flex items-center gap-3 text-background hover:opacity-80 transition-opacity"
                      data-testid="link-corporate-phone"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-lg tabular-nums">(315) 752-0150</span>
                    </a>
                    <a
                      href="mailto:hello@cicerogrand.com?subject=Corporate%20rate%20%2F%20direct%20billing%20inquiry"
                      className="flex items-center gap-3 text-background hover:opacity-80 transition-opacity"
                      data-testid="link-corporate-email"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-lg">hello@cicerogrand.com</span>
                    </a>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-10 inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                    data-testid="link-corporate-contact-form"
                  >
                    Send corporate inquiry
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Employer directory */}
      <section className="bg-card/40 py-20 lg:py-28 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Employer directory
              </span>
              <h2 className="font-display text-4xl lg:text-5xl tracking-tight mt-4">
                Ten dedicated pages. Drive times, rates, and direct-book links.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-foreground/80 max-w-prose">
                Every employer, campus, and hospital we serve has its own page with drive time,
                relevant amenities, and a direct booking link that bypasses OTA fees. Send a link
                to your travel coordinator or bookmark for repeat trips.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 space-y-16">
            {grouped.map((group) =>
              group.items.length === 0 ? null : (
                <div key={group.id}>
                  <div className="flex items-baseline justify-between border-b border-border pb-4 mb-8">
                    <div className="flex items-center gap-3">
                      <group.icon className="w-5 h-5 text-primary shrink-0" />
                      <h3 className="font-display text-2xl lg:text-3xl tracking-tight">
                        {group.label}
                      </h3>
                    </div>
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground tabular-nums">
                      {group.items.length} {group.items.length === 1 ? 'page' : 'pages'}
                    </span>
                  </div>
                  <p className="text-base text-foreground/75 max-w-2xl mb-8 leading-relaxed">
                    {group.blurb}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((e) => (
                      <Link
                        key={e.slug}
                        href={e.path}
                        className="group bg-card border border-card-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                        data-testid={`link-employer-${e.slug}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="tabular-nums">{e.drive}</span>
                            </div>
                            <h4 className="font-display text-xl lg:text-2xl tracking-tight leading-tight">
                              {e.name}
                            </h4>
                            <p className="mt-3 text-sm text-foreground/75 leading-relaxed">
                              {e.hook}
                            </p>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                        </div>
                        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.16em] text-primary font-medium">
                            View {e.short} rates
                          </span>
                          <span className="text-xs text-muted-foreground">
                            cicerogrand.com{e.path}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Long-stay + Micron long-stay callout */}
      <section className="bg-background py-20 lg:py-24 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="col-span-12 lg:col-span-6">
              <Reveal>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Long-stay program
                </span>
                <h2 className="font-display text-3xl lg:text-4xl tracking-tight mt-4">
                  Weekly and monthly rates for crews on assignment.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-foreground/85">
                  Every room at The Cicero Grand is a real all-suite room with kitchenette &mdash;
                  microwave, full-size refrigerator, and space to actually live for a week or a
                  month. Weekly and monthly discounts apply automatically at 7+ and 28+ nights.
                </p>
                <Link
                  href="/micron-crew-long-stay"
                  className="mt-8 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  data-testid="link-micron-long-stay"
                >
                  See Micron crew long-stay details
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Reveal>
                <div className="bg-card border border-card-border rounded-3xl p-8 lg:p-10">
                  <h3 className="font-display text-2xl tracking-tight mb-6">What&apos;s included</h3>
                  <ul className="space-y-3">
                    {[
                      'Kitchenette in every suite (microwave, full-size fridge)',
                      'Free hot breakfast, 7 days a week',
                      'Free self-parking',
                      'Free high-speed Wi-Fi',
                      'On-site laundry facilities',
                      'Fitness center + indoor heated pool',
                      '24/7 front desk',
                    ].map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-base leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-foreground text-background py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-background/60">
              Ready to set up an account?
            </span>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight mt-4 max-w-4xl mx-auto text-balance">
              Direct billing, group blocks, and long-stay rates &mdash; same-day response.
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+13157520150"
                className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
                data-testid="button-corporate-call"
              >
                <Phone className="w-4 h-4" />
                (315) 752-0150
              </a>
              <a
                href="mailto:hello@cicerogrand.com?subject=Corporate%20rate%20%2F%20direct%20billing%20inquiry"
                className="inline-flex items-center gap-2 border border-background/30 text-background px-8 py-4 rounded-full font-medium hover:bg-background/10 transition-colors"
                data-testid="button-corporate-email"
              >
                <Mail className="w-4 h-4" />
                Email sales
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
