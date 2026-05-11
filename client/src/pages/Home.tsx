import { Link } from 'wouter';
import { ArrowUpRight, MapPin, Star, Wifi, Coffee, Waves, Dumbbell, Dog, Car, Sparkles } from 'lucide-react';
import { BookingWidget } from '../components/BookingWidget';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { useSeo, SITE } from '../hooks/useSeo';
import siteSeed from '../content/site.json';
import roomsSeed from '../content/rooms.json';
import offersSeed from '../content/offers.json';
import testimonialsSeed from '../content/testimonials.json';

const tickerItems = [
  'All-suite stays',
  'Free hot breakfast',
  'Indoor heated pool',
  'Pet friendly',
  'Free parking',
  'Off I-81 · Exit 98',
  '6 minutes to Micron build',
  'Crews & vendors welcome',
  'Near Syracuse Airport',
  'Walkable to Oneida Lake',
];

const ICONS = {
  Wifi, Coffee, Waves, Dumbbell, Dog, Car, Sparkles,
};

export default function Home() {
  const site = useContent<typeof siteSeed>('site');
  const rooms = useContent<typeof roomsSeed>('rooms');
  const offers = useContent<typeof offersSeed>('offers');
  const testimonials = useContent<typeof testimonialsSeed>('testimonials');

  useSeo({
    title: 'The Cicero Grand · Hotel in Cicero NY · 7 Min to Micron · Syracuse North',
    description:
      'All-suite hotel in Cicero NY (Syracuse North), 7 minutes from the Micron megafab. Off I-81 Exit 98 · free hot breakfast · indoor pool · pet-friendly · weekly + monthly crew rates. Book direct: (315) 752-0150.',
    canonicalPath: '/',
    ogImage: '/photos/exterior-entrance.jpg',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: SITE.name,
        description:
          'All-suite hotel near Syracuse, NY — 6 minutes from the Micron megafab. Free hot breakfast, indoor pool, pet friendly, free parking.',
        url: SITE.url,
        telephone: SITE.phone,
        email: SITE.email,
        image: [`${SITE.url}/photos/exterior-entrance.jpg`, `${SITE.url}/photos/pool.jpg`],
        logo: SITE.logo,
        priceRange: SITE.priceRange,
        checkinTime: SITE.checkIn,
        checkoutTime: SITE.checkOut,
        starRating: { '@type': 'Rating', ratingValue: '3' },
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
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Free Breakfast', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Indoor Pool', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Fitness Center', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'All-Suite Rooms', value: true },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: testimonials.rating,
          reviewCount: String(testimonials.reviewCount),
          bestRating: '5',
        },
        review: testimonials.items.slice(0, 4).map((t) => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: String(t.stars), bestRating: '5' },
          author: { '@type': 'Person', name: t.name },
          reviewBody: t.quote,
        })),
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
        '@type': 'Organization',
        name: SITE.legalName,
        url: SITE.url,
        logo: SITE.logo,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: SITE.phone,
            contactType: 'reservations',
            areaServed: 'US',
            availableLanguage: 'English',
          },
          {
            '@type': 'ContactPoint',
            telephone: SITE.salesPhone,
            contactType: 'sales',
            email: SITE.email,
            areaServed: 'US',
          },
        ],
      },
    ],
  });

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src="/photos/exterior-entrance.jpg"
          alt="Cicero Grand exterior at the porte-cochère entrance"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/70" />

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-32 lg:pb-40 flex flex-col">
          <div className="max-w-4xl text-white">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-90 mb-6">
              <span className="w-8 h-px bg-white/70" /> Syracuse North · Cicero, NY
            </span>
            <h1
              className="font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.02em] text-balance"
              data-testid="hero-headline"
            >
              An all-suite stay
              <br />
              in <em className="italic font-light">central</em> New York.
            </h1>
            <p className="mt-7 text-base md:text-lg max-w-xl opacity-90 leading-relaxed">
              {site.shortDescription}
            </p>
          </div>

          <div className="mt-auto pt-10 lg:pt-14">
            <BookingWidget variant="overlay" />
          </div>
        </div>

        {/* Hero ticker */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/15 bg-black/30 backdrop-blur-sm overflow-hidden">
          <div className="ticker py-3 text-white/80 text-xs uppercase tracking-[0.18em] whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="flex items-center gap-12 shrink-0">
                {t} <span className="text-white/30">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO STATEMENT */}
      <section className="bg-background grain py-32 lg:py-44 relative">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-6">
              <span className="col-span-12 md:col-span-3 text-xs uppercase tracking-[0.2em] text-muted-foreground pt-3">
                ✦ Welcome
              </span>
              <h2 className="col-span-12 md:col-span-9 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-balance">
                Sixty-five suites. One <em className="italic font-light">unfussy</em> mission — make your stay easy and your morning even easier.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-12 gap-6 mt-16">
              <div className="col-span-12 md:col-span-3" />
              <p className="col-span-12 md:col-span-6 text-lg leading-relaxed text-muted-foreground">
                Off I-81 at Exit 98, the Cicero Grand sits between everything you came for — just 7 minutes from the Micron megafab in Clay, plus Syracuse, the airport, the Finger Lakes, and Oneida Lake. Every room is a suite. Breakfast is hot. Parking is free. The pool is open year-round.
              </p>
              <Link
                href="/rooms"
                data-testid="link-explore-rooms"
                className="col-span-12 md:col-span-3 group inline-flex items-start gap-2 text-sm uppercase tracking-[0.16em] hover:text-primary transition-colors"
              >
                <span>Explore the suites</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROOM SHOWCASE */}
      <section className="bg-foreground text-background py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-background/60 mb-4">
                  <span className="w-8 h-px bg-background/40" /> The Suites
                </span>
                <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1] tracking-tight text-balance max-w-3xl">
                  Four ways to stay. <em className="italic font-light">All</em> with a separate living area.
                </h2>
              </div>
              <Link
                href="/rooms"
                className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] opacity-80 hover:opacity-100 transition-opacity"
              >
                See all suites <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {rooms.map((room, i) => (
              <Reveal key={room.id} delay={i * 80}>
                <article
                  className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-background/5"
                  data-testid={`card-room-${room.id}`}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute inset-0 p-7 lg:p-9 flex flex-col justify-between text-white">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.18em] opacity-80">
                        Sleeps {room.sleeps}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs uppercase tracking-[0.14em] bg-white/12 backdrop-blur-md border border-white/20">
                        {room.beds}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-3xl lg:text-4xl leading-none tracking-tight mb-3">
                        {room.name}
                      </h3>
                      <p className="text-sm opacity-85 max-w-md mb-5 leading-relaxed">{room.tagline}</p>
                      <div className="flex gap-3">
                        <Link
                          href={`/rooms#${room.id}`}
                          className="inline-flex items-center px-4 h-10 rounded-full border border-white/30 text-xs uppercase tracking-[0.14em] hover:bg-white/10 transition-colors"
                        >
                          Details
                        </Link>
                        <a
                          href={site.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`book-${room.id}`}
                          className="inline-flex items-center px-4 h-10 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-[0.14em] hover:bg-primary/90 transition-colors"
                        >
                          Book
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES STRIP */}
      <section className="bg-background py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-6 mb-14">
              <span className="col-span-12 md:col-span-3 text-xs uppercase tracking-[0.2em] text-muted-foreground pt-3">
                ✦ Amenities
              </span>
              <h2 className="col-span-12 md:col-span-9 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight text-balance">
                Everything you'd expect. <em className="italic font-light">Nothing you wouldn't.</em>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { icon: 'Coffee', title: 'Hot breakfast', sub: 'Every morning, free' },
              { icon: 'Waves', title: 'Indoor pool', sub: 'Heated, year-round' },
              { icon: 'Dumbbell', title: 'Fitness center', sub: 'Cardio + free weights' },
              { icon: 'Wifi', title: 'Fast Wi-Fi', sub: 'Wired & wireless, free' },
              { icon: 'Car', title: 'Free parking', sub: 'Cars, trucks, coaches' },
              { icon: 'Dog', title: 'Pet friendly', sub: 'Bring the whole family' },
              { icon: 'Sparkles', title: '100% smoke-free', sub: 'Inside and out' },
              { icon: 'MapPin', title: 'I-81 · Exit 98', sub: 'Minutes from anywhere' },
            ].map((a, i) => {
              const Icon = ((ICONS as any)[a.icon] || MapPin) as typeof MapPin;
              return (
                <Reveal key={a.title} delay={i * 50}>
                  <div className="aspect-square bg-card border border-card-border rounded-3xl p-6 flex flex-col justify-between hover:bg-muted/40 transition-colors">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    <div>
                      <h3 className="font-display text-2xl leading-tight tracking-tight">{a.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{a.sub}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/amenities"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] hover:text-primary transition-colors"
            >
              See all amenities <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AREA / LOCATION */}
      <section className="bg-muted/40 py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <Reveal as="div" className="col-span-12 lg:col-span-5">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                ✦ The Area
              </span>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
                Central NY's <em className="italic font-light">middle</em> of everywhere.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                Off I-81 at Exit 98. Seven minutes to Micron's growing chip campus. Ten to the airport. Twelve to downtown Syracuse. Five to Oneida Lake.
              </p>
              <Link
                href="/area"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-full border border-foreground hover:bg-foreground hover:text-background transition-colors text-sm uppercase tracking-[0.14em]"
              >
                Explore the area <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Reveal>

            <Reveal as="div" className="col-span-12 lg:col-span-7" delay={120}>
              <Link
                href="/micron-crew-long-stay"
                data-testid="link-micron-crew"
                className="group mb-3 flex items-center justify-between gap-4 bg-foreground text-background rounded-2xl p-5 hover:opacity-90 transition-opacity"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] opacity-60 mb-1">✦ For Micron crews</div>
                  <div className="text-sm font-medium">Long-stay program — weekly + monthly rates, PO billing</div>
                </div>
                <ArrowUpRight className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-45" />
              </Link>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Micron Campus', distance: '7 min' },
                  { label: 'Syracuse Airport', distance: '10 min' },
                  { label: 'Downtown Syracuse', distance: '12 min' },
                  { label: 'Destiny USA', distance: '12 min' },
                  { label: 'NYS Fairgrounds', distance: '13 min' },
                  { label: 'Syracuse University', distance: '16 min' },
                  { label: 'Turning Stone', distance: '25 min' },
                  { label: 'Oneida Lake', distance: '5 min' },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="bg-background rounded-2xl p-5 border border-border flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="text-sm text-muted-foreground tabular-nums">{p.distance}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OFFERS PEEK */}
      <section className="bg-background py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  ✦ Offers
                </span>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight text-balance max-w-3xl">
                  Better rates, <em className="italic font-light">direct</em>.
                </h2>
              </div>
              <Link
                href="/offers"
                className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] hover:text-primary transition-colors"
              >
                All offers <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offers.slice(0, 4).map((o, i) => (
              <Reveal key={o.id} delay={i * 60}>
                <article
                  className="group relative h-full bg-card border border-card-border rounded-3xl p-7 flex flex-col hover:border-primary/40 transition-colors"
                  data-testid={`card-offer-${o.id}`}
                >
                  <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] uppercase tracking-[0.14em] font-medium mb-6">
                    {o.badge}
                  </span>
                  <h3 className="font-display text-2xl leading-tight tracking-tight mb-3">{o.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-7 flex-1">
                    {o.description}
                  </p>
                  <a
                    href={o.ctaHref}
                    target={o.ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    {o.cta} <ArrowUpRight className="w-4 h-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative bg-background py-24 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 lg:mb-20">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  ✦ Guest reviews
                </span>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight text-balance max-w-3xl">
                  What guests are <em className="italic font-light">saying</em>.
                </h2>
              </div>
              <a
                href={testimonials.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <Star key={n} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <Star className="w-4 h-4 fill-primary/40 text-primary" />
                </div>
                <span className="uppercase tracking-[0.16em]">
                  {testimonials.rating} · {testimonials.reviewCount} reviews on {testimonials.source}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.items.slice(0, 6).map((t, i) => (
              <Reveal key={`${t.name}-${i}`} delay={i * 60}>
                <article
                  className="group relative h-full bg-card border border-card-border rounded-3xl p-8 flex flex-col hover:border-primary/40 transition-colors"
                  data-testid={`testimonial-${i}`}
                >
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, n) => (
                      <Star key={n} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-[15px] leading-relaxed text-foreground/85 flex-1">
                    “{t.quote}”
                  </blockquote>
                  <footer className="mt-7 pt-5 border-t border-card-border">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.location} · Stayed {t.stayMonth}
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative bg-foreground text-background py-32 lg:py-44 overflow-hidden">
        <img
          src="/photos/lobby-fireplace.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/85 via-foreground/70 to-foreground" />
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-background/60 mb-6">
              <span className="w-8 h-px bg-background/40" /> Rested. Set. Go.
            </span>
            <h2 className="font-display text-[clamp(2.6rem,7vw,7rem)] leading-[0.95] tracking-tight text-balance max-w-5xl mx-auto">
              Your Central NY <em className="italic font-light">basecamp</em> is ready.
            </h2>
            <p className="mt-8 text-lg text-background/70 max-w-xl mx-auto">
              Book direct for the best rate, latest availability, and no surprise fees.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="closing-book-now"
                className="inline-flex items-center justify-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Book a stay
              </a>
              <a
                href={`tel:${site.phoneRaw}`}
                className="inline-flex items-center justify-center px-8 h-14 rounded-full border border-background/40 hover:bg-background/10 transition-colors"
              >
                Call {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
