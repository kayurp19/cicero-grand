import { ArrowUpRight, BedDouble, Clock, Percent, Gift } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { BookingWidget } from '../components/BookingWidget';
import { useContent } from '../lib/content';
import { useSeo } from '../hooks/useSeo';
import siteSeed from '../content/site.json';

const perks = [
  {
    id: 'upgrade',
    badge: 'Perk 01',
    icon: BedDouble,
    title: 'Free room upgrade at check-in',
    description:
      'When you book direct, we move you up to the next room category if availability allows — King Suite to Executive King, 2 Queen to Executive 2 Queen. No request needed. Just show up.',
  },
  {
    id: 'late-checkout',
    badge: 'Perk 02',
    icon: Clock,
    title: 'Late checkout up to 1 PM',
    description:
      'Late checkout upon request at no additional cost up to 1 PM — instead of the standard 11 AM. Two extra hours to sleep in, finish work, or get a real breakfast before the drive home. Subject to availability for the following arrival.',
  },
  {
    id: 'discount',
    badge: 'Perk 03',
    icon: Percent,
    title: '10% off your next direct stay',
    description:
      'Every direct booking earns you 10% off your next stay — guaranteed for 12 months. We add the code to your reservation receipt automatically. No app, no points, no tiers.',
  },
  {
    id: 'welcome',
    badge: 'Perk 04',
    icon: Gift,
    title: 'Welcome bottle of water + snack',
    description:
      'A small thank-you waiting in your room at check-in. Cold water and a snack so you can settle in without hunting for the vending machine. Only for direct bookings.',
  },
];

export default function DirectPerks() {
  const site = useContent<typeof siteSeed>('site');

  useSeo({
    title: 'Book Direct & Save · Free Upgrade + Late Checkout up to 1 PM · The Cicero Grand',
    description:
      'Book direct at The Cicero Grand for four perks Expedia and Booking.com cannot offer: free room upgrade, late checkout up to 1 PM at no additional cost, 10% off your next stay, and a welcome amenity. No booking fees, best rate guaranteed.',
    canonicalPath: '/direct-perks',
  });

  return (
    <>
      <PageHero
        eyebrow="Cicero Grand Direct"
        image="/photos/lobby-fireplace.jpg"
        title={<>Four reasons to book <em className="italic font-light">direct</em>.</>}
        intro="When you book at cicerogrand.com instead of through an OTA, you get four perks Expedia and Booking.com literally cannot offer. Same price. More value. Every time."
      />

      {/* Perks grid */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.id} delay={i * 60}>
                  <article
                    data-testid={`perk-${p.id}`}
                    className="group relative bg-card border border-card-border rounded-3xl p-8 lg:p-10 h-full flex flex-col hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] uppercase tracking-[0.16em] font-medium">
                        {p.badge}
                      </span>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-tight mb-5 text-balance">
                      {p.title}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed flex-1">
                      {p.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison strip */}
      <section className="bg-card border-y border-card-border py-20 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-tight mb-12 text-center text-balance">
              Direct vs. third-party booking sites
            </h2>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-card-border bg-background">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-foreground text-background">
                    <th className="text-left p-4 lg:p-6 font-medium uppercase tracking-[0.12em] text-xs">What you get</th>
                    <th className="p-4 lg:p-6 font-medium uppercase tracking-[0.12em] text-xs">Direct</th>
                    <th className="p-4 lg:p-6 font-medium uppercase tracking-[0.12em] text-xs opacity-70">Expedia / Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Best available rate', '✓', '✓'],
                    ['No booking fees', '✓', '✗'],
                    ['Free room upgrade at check-in', '✓', '✗'],
                    ['Late checkout up to 1 PM', '✓', '✗'],
                    ['10% off your next stay', '✓', '✗'],
                    ['Welcome amenity', '✓', '✗'],
                    ['Flexible cancellation', '✓', 'Varies'],
                    ['Direct line to the property', '✓', '✗'],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-card-border">
                      <td className="p-4 lg:p-6 text-foreground">{row[0]}</td>
                      <td className="p-4 lg:p-6 text-center text-primary font-medium text-lg">{row[1]}</td>
                      <td className="p-4 lg:p-6 text-center text-muted-foreground">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
              Best Rate Guarantee: find the same room and date cheaper anywhere online before you book, and we'll match it and give you 10% off on top. Submit your finding to <a href="mailto:hello@cicerogrand.com" className="text-primary hover:underline">hello@cicerogrand.com</a> before booking.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Booking widget */}
      <section className="bg-background py-20 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-tight mb-4 text-balance">
                Book direct now
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                All four perks apply automatically when you book at cicerogrand.com. No code needed.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <BookingWidget variant="default" />
          </Reveal>
        </div>
      </section>

      {/* Sales CTA */}
      <section className="bg-foreground text-background py-24 lg:py-32 text-center">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1] tracking-tight mb-6 text-balance">
            Questions? Call us direct.
          </h2>
          <p className="text-lg text-background/70 mb-8 max-w-xl mx-auto">
            Our front desk is staffed 24/7. Call us for the best rate, room availability, group bookings, or anything else.
          </p>
          <a
            href={`tel:${site.salesPhoneRaw}`}
            className="inline-flex items-center px-8 h-14 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Call: {site.salesPhone}
          </a>
        </div>
      </section>
    </>
  );
}
