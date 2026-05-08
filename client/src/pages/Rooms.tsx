import { Check, ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import roomsSeed from '../content/rooms.json';
import siteSeed from '../content/site.json';

export default function Rooms() {
  const rooms = useContent<typeof roomsSeed>('rooms');
  const site = useContent<typeof siteSeed>('site');

  return (
    <>
      <PageHero
        eyebrow="The Suites"
        image="/photos/king-jacuzzi.jpg"
        title={<>Eight suite types. <em className="italic font-light">No</em> regular rooms.</>}
        intro="Every stay at Cicero Grand comes with a separate living area, sofa sleeper, microwave, mini-fridge, pillow-top mattress, and 4K TV. Pick the layout — we'll handle the rest."
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 space-y-24 lg:space-y-32">
          {rooms.map((room, i) => (
            <Reveal key={room.id}>
              <article
                id={room.id}
                data-testid={`room-${room.id}`}
                className="grid grid-cols-12 gap-6 lg:gap-12 items-center scroll-mt-28"
              >
                <div className={`col-span-12 lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[5/4] rounded-3xl overflow-hidden bg-muted">
                    <img
                      src={room.image}
                      alt={room.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-5">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    <span className="text-primary tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    Sleeps {room.sleeps} · {room.beds}
                    {(room as any).startingFrom ? (
                      <>
                        <span className="opacity-50">·</span>
                        <span className="text-foreground font-medium">From ${(room as any).startingFrom}/night</span>
                      </>
                    ) : null}
                  </span>
                  <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-5 text-balance">
                    {room.name}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-7">
                    {room.tagline}
                  </p>
                  <ul className="space-y-2.5 mb-9">
                    {room.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={site.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`book-${room.id}`}
                      className="inline-flex items-center px-7 h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                      Book this suite →
                    </a>
                    <a
                      href={`tel:${site.phoneRaw}`}
                      className="inline-flex items-center px-7 h-12 rounded-full border border-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      Call to reserve
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-foreground text-background py-24 lg:py-32 text-center">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] tracking-tight mb-6 text-balance">
            Pick a date. <em className="italic font-light">We'll handle the rest.</em>
          </h2>
          <div className="mt-8 inline-flex flex-wrap gap-3 justify-center">
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Book Now <ArrowUpRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
