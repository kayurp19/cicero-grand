import { Check, Star, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import weddingsSeed from '../content/weddings.json';
import siteSeed from '../content/site.json';

export default function Weddings() {
  const w = useContent<typeof weddingsSeed>('weddings');
  const site = useContent<typeof siteSeed>('site');

  return (
    <>
      <PageHero
        eyebrow="Weddings"
        image="/photos/venue-wedding-reception.jpg"
        title={<>Your day. <em className="italic font-light">All</em> in one place.</>}
        intro={w.intro}
      />

      {/* Hero highlights */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="col-span-12 lg:col-span-6">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 inline-flex items-center gap-2">
                  ✦ The Ballroom at Cicero Grand
                </span>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
                  Made for <em className="italic font-light">memorable</em> moments.
                </h2>
                <ul className="space-y-3 mb-8">
                  {w.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-base">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={w.ratingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </span>
                  <span className="font-medium">{w.rating}</span>
                  <span className="text-muted-foreground">{w.ratingSource}</span>
                </a>
              </div>
              <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-3">
                <img src="/photos/venue-ceremony-arch.jpg" alt="Candlelit aisle detail with white roses and eucalyptus" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl" />
                <img src="/photos/venue-tablescape.jpg" alt="Reception tablescape detail" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl mt-12" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DAY-OF FLOW */}
      <section className="bg-foreground text-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="mb-14 max-w-3xl">
              <span className="text-xs uppercase tracking-[0.2em] text-background/60 mb-4 inline-flex items-center gap-2">
                <span className="w-8 h-px bg-background/40" /> The day, in four acts
              </span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance">
                Ceremony to last dance — <em className="italic font-light">all</em> on-site.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {w.dayOfFlow.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <article className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-background/5">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-7 lg:p-9 flex flex-col justify-between text-white">
                    <span className="text-xs uppercase tracking-[0.2em] opacity-80 tabular-nums">
                      {String(i + 1).padStart(2, '0')} — {step.title}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl lg:text-4xl leading-none tracking-tight mb-3">{step.title}</h3>
                      <p className="text-sm opacity-85 max-w-md leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAKE IT YOURS — OUTSIDE CATERING CALLOUT */}
      <section className="bg-background py-24 lg:py-32 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="col-span-12 lg:col-span-5">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 inline-flex items-center gap-2">
                  <span className="w-8 h-px bg-foreground/40" /> What sets us apart
                </span>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance">
                  Bring your own <em className="italic font-light">caterer</em>.
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <p className="text-lg leading-relaxed mb-6 max-w-prose">
                  Most hotel ballrooms lock you into their kitchen. We don't. Bring the caterer your family has used for 30 years, your favorite restaurant, a cultural specialist for traditional cuisine — whoever fits your day.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base mb-6">
                  {[
                    'Cultural & ethnic catering welcome',
                    'Kosher, halal, vegetarian, vegan',
                    'Family recipes & favorite restaurants',
                    'Or use our full on-site catering',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground max-w-prose">
                  Modest catering fee applies for outside caterers. We provide tables, chairs, linens, china, glassware, silverware, and full kitchen access — just bring your menu.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WEDDING PACKAGES */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="mb-16 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/40" /> Reception packages
              </span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance mb-5">
                Three ways to <em className="italic font-light">celebrate</em>.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Buffet, plated, or hors d'oeuvres-only. Mix in stations, premium bites, and bar enhancements. Tastings included on every plated and buffet package. <a href={`mailto:${site.email}?subject=Wedding%20pricing%20request%20-%20Cicero%20Grand`} className="text-foreground underline underline-offset-4 hover:text-primary">Request a custom quote</a>.
              </p>
              <p className="mt-4 text-sm text-muted-foreground/80 italic">Menu items below are example selections — your coordinator will tailor the final menu to your day.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {w.packages.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 80}>
                <article className="bg-card border border-border rounded-3xl p-7 lg:p-8 h-full flex flex-col">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl tracking-tight mb-3 text-balance">{pkg.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{pkg.tagline}</p>
                  <ul className="space-y-2 mb-2">
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

      {/* BRIDAL PARTY + BAR + ADD-ONS */}
      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12">
          <Reveal className="col-span-12 lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-6 h-px bg-foreground/40" /> Morning of
            </span>
            <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-5 text-balance">{w.bridalParty.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">{w.bridalParty.intro}</p>
            <div className="space-y-3">
              {w.bridalParty.items.map((it) => (
                <div key={it.name} className="bg-background border border-border rounded-2xl p-5">
                  <h4 className="font-display text-xl tracking-tight mb-1">{it.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{it.menu}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-5">
            <div className="bg-foreground text-background rounded-3xl p-8 lg:p-10 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-background/60 mb-4 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-background/40" /> Bar service
              </span>
              <h3 className="font-display text-2xl lg:text-3xl tracking-tight mb-4 text-balance">{w.hostedBar.title}</h3>
              <p className="text-background/80 leading-relaxed">{w.hostedBar.intro}</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-8">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-foreground/40" /> Popular add-ons
              </span>
              <ul className="grid grid-cols-1 gap-y-2 mt-3">
                {w.addOns.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-14 text-balance max-w-3xl">
              What couples <em className="italic font-light">say</em>.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {w.testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <blockquote className="bg-muted/30 border border-border rounded-3xl p-7 h-full flex flex-col">
                  <div className="flex items-center gap-0.5 mb-5">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-display text-2xl leading-snug tracking-tight">"{t.quote}"</p>
                </blockquote>
              </Reveal>
            ))}
          </div>
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
            {w.faqs.map((f, i) => (
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
            Let's plan it.
          </h2>
          <p className="text-lg text-background/70 leading-relaxed mb-10 max-w-xl mx-auto">
            Schedule a tour or request a custom quote. Our coordinator will walk you through the ballroom, the menu, and your guest-room block.
          </p>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${site.salesPhoneRaw}`}
              className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Call sales: {site.salesPhone}
            </a>
            <a
              href={`mailto:${site.email}?subject=Wedding%20inquiry%20-%20Cicero%20Grand`}
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
