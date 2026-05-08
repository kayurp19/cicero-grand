import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { useSeo } from '../hooks/useSeo';
import amenitiesSeed from '../content/amenities.json';
import siteSeed from '../content/site.json';

export default function Amenities() {
  const amenities = useContent<typeof amenitiesSeed>('amenities');
  const site = useContent<typeof siteSeed>('site');

  useSeo({
    title: 'Hotel Amenities · Indoor Pool, Free Breakfast · The Cicero Grand',
    description:
      'Indoor heated pool, free hot breakfast, fitness center, free parking, pet friendly, free Wi-Fi, and 24-hour business essentials at The Cicero Grand near Syracuse, NY.',
    canonicalPath: '/amenities',
    ogImage: '/photos/pool.jpg',
  });

  return (
    <>
      <PageHero
        eyebrow="Amenities"
        image="/photos/pool.jpg"
        title={<>Everything you'd <em className="italic font-light">expect</em>. Nothing you wouldn't.</>}
        intro="A short list of things we got right — so the only thing you have to think about is when to come back."
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          {amenities.categories.map((cat, ci) => (
            <Reveal key={cat.title} delay={ci * 80}>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 py-14 lg:py-20 border-t border-border first:border-t-0">
                <div className="col-span-12 lg:col-span-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                    {String(ci + 1).padStart(2, '0')} ·  Group
                  </span>
                  <h2 className="font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1] tracking-tight mt-3 text-balance">
                    {cat.title}.
                  </h2>
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                    {cat.items.map((item) => (
                      <li key={item.name} className="border-b border-border pb-5">
                        <h3 className="font-medium text-base mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <img src="/photos/pool-2.jpg" alt="Pool" className="aspect-[4/5] w-full object-cover rounded-3xl" loading="lazy" />
          <img src="/photos/breakfast.jpg" alt="Breakfast area" className="aspect-[4/5] w-full object-cover rounded-3xl" loading="lazy" />
          <img src="/photos/lobby-fireplace.jpg" alt="Lobby fireplace" className="aspect-[4/5] w-full object-cover rounded-3xl" loading="lazy" />
        </div>
      </section>

      <section className="bg-foreground text-background py-24 lg:py-32 text-center">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
            Sound like your kind of stay?
          </h2>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Book your suite →
          </a>
        </div>
      </section>
    </>
  );
}
