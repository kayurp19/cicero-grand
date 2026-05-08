import { Check, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import eventsSeed from '../content/events.json';
import siteSeed from '../content/site.json';

export default function Events() {
  const events = useContent<typeof eventsSeed>('events');
  const site = useContent<typeof siteSeed>('site');

  return (
    <>
      <PageHero
        eyebrow="Events & Meetings"
        image="/photos/venue-corporate-banquet.jpg"
        title={<>Meet, <em className="italic font-light">gather</em>, celebrate.</>}
        intro={events.intro}
      />

      {/* Spaces & capacities */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-16">
              <h2 className="col-span-12 lg:col-span-5 font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight text-balance">
                Four flexible spaces. <em className="italic font-light">One</em> coordinator.
              </h2>
              <ul className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
                {events.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm bg-muted/40 rounded-2xl p-4">
                    <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Real venue photos */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-16">
              <img
                src="/photos/venue-ballroom-empty.jpg"
                alt="The Ballroom — empty, ready to be configured"
                loading="lazy"
                className="aspect-[4/3] object-cover rounded-3xl col-span-1 md:col-span-2"
              />
              <img
                src="/photos/venue-foyer-prefunction.jpg"
                alt="Coffee break station detail with pastries"
                loading="lazy"
                className="aspect-[4/3] object-cover rounded-3xl"
              />
            </div>
          </Reveal>

          {/* Capacity table */}
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

      {/* PACKAGES */}
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
                Pick a starting package — corporate, social, or sports — then mix in stations, hors d'oeuvres, and bar service. Your coordinator builds the final menu with you. <a href={`mailto:${site.email}?subject=Event%20pricing%20request%20-%20Cicero%20Grand`} className="text-foreground underline underline-offset-4 hover:text-primary">Request a custom quote</a>.
              </p>
              <p className="mt-4 text-sm text-muted-foreground/80 italic">Menu items below are example selections from our master menu — your coordinator will tailor everything to your event.</p>
            </div>
          </Reveal>

          <div className="space-y-20 lg:space-y-28">
            {events.packages.map((cat, ci) => (
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
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
              Get a <em className="italic font-light">proposal</em>.
            </h2>
            <p className="text-lg text-background/70 leading-relaxed mb-8">
              Tell us about your event — meeting, banquet, reunion, conference, holiday party. Our team will respond with availability, custom menus, and a quote within one business day.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${site.salesPhoneRaw}`}
                className="inline-flex items-center px-7 h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Call sales: {site.salesPhone}
              </a>
              <a
                href={`mailto:${site.email}?subject=Event%20inquiry%20-%20Cicero%20Grand`}
                className="inline-flex items-center px-7 h-12 rounded-full border border-background/30 hover:bg-background/10 transition-colors"
              >
                Email sales
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-3">
            <img src="/photos/venue-tablescape.jpg" alt="Place setting detail" loading="lazy" className="aspect-[4/5] object-cover rounded-3xl" />
            <img src="/photos/venue-dance-floor.jpg" alt="Warm seasonal centerpiece detail with sunflowers and candles" loading="lazy" className="aspect-[4/5] object-cover rounded-3xl mt-10" />
          </div>
        </div>
      </section>
    </>
  );
}
