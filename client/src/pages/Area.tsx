import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import areaSeed from '../content/area.json';

export default function Area() {
  const area = useContent<typeof areaSeed>('area');

  return (
    <>
      <PageHero
        eyebrow="The Area"
        image="/photos/exterior-1.jpg"
        title={<>The middle <em className="italic font-light">of</em> everywhere.</>}
        intro={area.intro}
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <div className="col-span-12 md:col-span-3" />
            <div className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Micron Campus', d: '6 min' },
                { label: 'Oneida Lake', d: '5 min' },
                { label: 'Syracuse Airport', d: '14 min' },
                { label: 'Downtown Syracuse', d: '15 min' },
              ].map((p) => (
                <div key={p.label} className="bg-card border border-card-border rounded-2xl p-5">
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">{p.label}</div>
                  <div className="font-display text-3xl tracking-tight tabular-nums">{p.d}</div>
                </div>
              ))}
            </div>
          </div>

          {area.groups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 60}>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 py-14 lg:py-20 border-t border-border">
                <div className="col-span-12 lg:col-span-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1] tracking-tight mt-3 text-balance">
                    {group.title}.
                  </h2>
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-baseline justify-between gap-3 py-3 border-b border-border/60"
                      >
                        <span className="font-medium text-base leading-tight">{item.name}</span>
                        {item.note && (
                          <span className="text-xs text-muted-foreground tabular-nums shrink-0 text-right">
                            {item.note}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
