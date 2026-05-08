import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { useSeo } from '../hooks/useSeo';
import offersSeed from '../content/offers.json';
import siteSeed from '../content/site.json';

export default function Offers() {
  const offers = useContent<typeof offersSeed>('offers');
  const site = useContent<typeof siteSeed>('site');

  useSeo({
    title: 'Hotel Deals & Special Offers · The Cicero Grand, Syracuse NY',
    description:
      'Current hotel deals near Syracuse, NY: extended-stay rates, project-crew packages, weekend getaways, and AAA discounts at The Cicero Grand. Book direct for the lowest price.',
    canonicalPath: '/offers',
  });

  return (
    <>
      <PageHero
        eyebrow="Offers"
        image="/photos/lobby-fireplace.jpg"
        title={<>Better rates, <em className="italic font-light">direct</em>.</>}
        intro="Book direct for the best price, latest availability, and zero surprise fees. Project rates, group rates, and government per-diems available."
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={i * 60}>
                <article
                  data-testid={`offer-${o.id}`}
                  className="group relative bg-card border border-card-border rounded-3xl p-8 lg:p-10 h-full flex flex-col hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] uppercase tracking-[0.16em] font-medium">
                      {o.badge}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, '0')} · {String(offers.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] tracking-tight mb-5 text-balance">
                    {o.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8 flex-1">
                    {o.description}
                  </p>
                  <a
                    href={o.ctaHref}
                    target={o.ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    data-testid={`cta-${o.id}`}
                    className="inline-flex items-center gap-2 self-start font-medium hover:text-primary transition-colors"
                  >
                    {o.cta} <ArrowUpRight className="w-4 h-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background py-24 lg:py-32 text-center">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-6 text-balance">
            Don't see what you need?
          </h2>
          <p className="text-lg text-background/70 mb-8 max-w-xl mx-auto">
            Talk to our sales team — we put together custom rates for projects, sports teams, weddings, government travel, and long stays.
          </p>
          <a
            href={`tel:${site.salesPhoneRaw}`}
            className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Call sales: {site.salesPhone}
          </a>
        </div>
      </section>
    </>
  );
}
