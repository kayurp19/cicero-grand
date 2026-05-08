import { Check } from 'lucide-react';
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
        image="/photos/event-1.jpg"
        title={<>Meet, <em className="italic font-light">gather</em>, celebrate.</>}
        intro={events.intro}
      />

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
            <img src="/photos/event-2.jpg" alt="Event setup" loading="lazy" className="aspect-[4/5] object-cover rounded-3xl" />
            <img src="/photos/event-3.jpg" alt="Event setup" loading="lazy" className="aspect-[4/5] object-cover rounded-3xl mt-10" />
          </div>
        </div>
      </section>
    </>
  );
}
