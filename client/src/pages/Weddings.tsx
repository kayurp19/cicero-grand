import { Check, Star } from 'lucide-react';
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
        image="/photos/event-5.jpg"
        title={<>Your day. <em className="italic font-light">All</em> in one place.</>}
        intro={w.intro}
      />

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
                <img src="/photos/event-1.jpg" alt="Wedding setup" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl" />
                <img src="/photos/event-6.jpg" alt="Wedding setup" loading="lazy" className="aspect-[3/4] object-cover rounded-3xl mt-12" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-14 text-balance max-w-3xl">
              What couples <em className="italic font-light">say</em>.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {w.testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <blockquote className="bg-background border border-border rounded-3xl p-7 h-full flex flex-col">
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
