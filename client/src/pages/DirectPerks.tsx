import { BedDouble, Clock, Percent, Gift } from 'lucide-react';
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
      'Enjoy a complimentary room upgrade at check-in when a suitable room is available. Ask our front desk about availability for your stay.',
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
      'Enjoy 10% off your next direct stay within 12 months. Ask our team for the details and how to redeem your return-stay offer.',
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
    title: 'Direct Booking Perks · Upgrades & Late Checkout · The Cicero Grand',
    description:
      'Explore direct-booking perks at The Cicero Grand: room upgrades and late checkout subject to availability, a return-stay offer, and a welcome amenity.',
    canonicalPath: '/direct-perks',
  });

  return (
    <>
      <PageHero
        eyebrow="Cicero Grand Direct"
        image="/photos/lobby-fireplace.jpg"
        title={<>Four reasons to book <em className="italic font-light">direct</em>.</>}
        intro="Make your stay a little more special. Book at cicerogrand.com and enjoy thoughtful extras, with our hotel team here to help you plan your visit."
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

      {/* Booking widget */}
      <section className="bg-background py-20 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-tight mb-4 text-balance">
                Book direct now
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Reserve your stay at cicerogrand.com. Upgrades and late checkout are subject to availability; our team can help with perk details.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <BookingWidget variant="panel" />
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
            Our front desk is staffed 24/7. Call us for current rates, room availability, group bookings, or help planning your stay.
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
