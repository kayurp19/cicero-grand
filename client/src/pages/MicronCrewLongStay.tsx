import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Check, Phone, Mail, MapPin, Clock, Building2, Bed, Wifi, Coffee, Dumbbell, Waves, Dog, Car, Briefcase } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useSeo, SITE } from '../hooks/useSeo';
import { trackContactSubmit } from '../lib/tracking';

const heroSubcopy =
  '65 all-suite rooms · 6 minutes from White Pine Commerce Park · weekly + monthly crew rates · billed by PO · no minimum commitment · pet-friendly.';

const tiers = [
  {
    name: '5–9 rooms',
    nights: '7+ nights',
    rate: 'Contact us',
    note: 'special crew rates — call (315) 715-7410',
    bullets: ['Free hot breakfast', 'Indoor pool, fitness center, business center', 'Free parking + EV charging', 'Pet-friendly'],
  },
  {
    name: '10–24 rooms',
    nights: '30+ nights',
    rate: 'Contact us',
    note: 'special crew rates — call (315) 715-7410',
    bullets: ['Dedicated check-in lane for your crew', 'Direct billing or purchase order', 'Weekly housekeeping (or skip-and-save)', 'Late-night arrivals welcome — 24/7 desk'],
    featured: true,
  },
  {
    name: '25+ rooms',
    nights: '30+ nights',
    rate: 'Contact us',
    note: "we'll beat any modular-camp per-bed cost",
    bullets: ['Block reserved for your project', 'Named account manager', 'Quarterly review + flex scaling', 'Block roll-ups for tax + reporting'],
  },
];

const compareRows = [
  { label: 'Distance to Micron gate', us: '6 min drive', camp: 'On-site or adjacent' },
  { label: 'Per-bed/night (loaded)', us: 'Special crew pricing — call for quote', camp: 'Comparable, but breakfast, gym, pool extra' },
  { label: 'Available today', us: 'Yes — 65 rooms, fully operational', camp: 'Permitting + construction first' },
  { label: 'Room type', us: 'Full hotel suite, real bed, real bathroom, sitting area', camp: 'Modular dorm-style unit' },
  { label: 'Breakfast', us: 'Included — hot buffet, 6am–10am', camp: 'Cafeteria add-on' },
  { label: 'Gym / pool', us: 'Included', camp: 'Add-on facility' },
  { label: 'Pet-friendly', us: 'Yes — for relocating supervisors', camp: 'Typically no' },
  { label: 'Local tax revenue', us: 'Stays in Onondaga County', camp: 'Out-of-state operator' },
];

const amenities = [
  { icon: Bed, label: 'All-suite rooms' },
  { icon: Coffee, label: 'Free hot breakfast' },
  { icon: Waves, label: 'Indoor pool' },
  { icon: Dumbbell, label: '24/7 fitness center' },
  { icon: Wifi, label: 'Fast free Wi-Fi' },
  { icon: Briefcase, label: 'Business center' },
  { icon: Car, label: 'Free parking + EV' },
  { icon: Dog, label: 'Pet-friendly' },
];

const nearby = [
  { name: 'Micron Megafab (White Pine)', drive: '7 min' },
  { name: 'SRCTec (Cicero)', drive: '6 min' },
  { name: 'Hancock International Airport', drive: '8 min' },
  { name: 'Lockheed Martin Salina', drive: '10 min' },
  { name: 'Downtown Syracuse', drive: '14 min' },
];

export default function MicronCrewLongStay() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: 'Micron Construction Crew Long-Stay Program · The Cicero Grand · 6 min from White Pine Commerce Park',
    description:
      'Weekly and monthly hotel rates for Micron construction crews and contractors. 65 all-suite rooms 6 minutes from the White Pine Commerce Park gate. PO billing, dedicated check-in, no minimum commitment.',
    canonicalPath: '/micron-crew-long-stay',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'Micron Crew Long-Stay', item: `${SITE.url}/micron-crew-long-stay` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Micron Construction Crew Long-Stay Program',
        provider: { '@type': 'Hotel', name: SITE.name, url: SITE.url, telephone: '+1-315-752-0150', address: { '@type': 'PostalAddress', streetAddress: '5875 Carmenica Dr', addressLocality: 'Cicero', addressRegion: 'NY', postalCode: '13039', addressCountry: 'US' } },
        areaServed: 'Cicero, NY · Clay, NY · Onondaga County',
        description:
          'Weekly and monthly hotel rates for Micron construction crews, contractors, vendors, and engineering teams. 65 all-suite rooms 6 minutes from the White Pine Commerce Park gate.',
        offers: tiers.map((t) => ({ '@type': 'Offer', name: t.name, description: 'Contact for special crew rates' })),
      },
    ],
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone') || undefined,
          topic: 'Corporate / extended stays',
          message: `— EVENT LEAD DETAILS —
Lead source: Micron Crew Long-Stay page
Event type: Crew long-stay / project housing
Company / organization: ${fd.get('company') || '—'}
Rooms needed: ${fd.get('rooms')}
Start date: ${fd.get('startDate')}
Duration: ${fd.get('duration')}

— MESSAGE —
${fd.get('notes') || '—'}`,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      trackContactSubmit({ topic: 'Corporate / extended stays', source: 'micron_crew_page' });
      setSubmitted(true);
    } catch (err) {
      setError('Could not submit. Please call (315) 752-0150 or email sales@cicerogrand.com.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <PageHero
        eyebrow="Micron Crew Long-Stay Program"
        title="65 suites. 6 minutes from the gate."
        subtitle={heroSubcopy}
        image="/photos/exterior-hero.jpg"
      />

      {/* HERO CTA STRIP */}
      <section className="border-b border-card-border bg-card/50">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 5875 Carmenica Dr, Cicero NY</span>
            <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> (315) 752-0150</span>
            <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> sales@cicerogrand.com</span>
          </div>
          <a href="#crew-inquiry" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Request a crew quote <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* TIERS */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">✦ Crew rates</span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] tracking-tight">
                Block rates that <em className="italic font-light">scale</em> with your project.
              </h2>
              <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                Weekly and monthly pricing, billed direct or by purchase order. No minimum commitment — scale up or down by week as your crews ramp. Every rate is all-in: breakfast, gym, pool, parking, EV charging, Wi-Fi.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <article
                  className={`relative h-full p-8 lg:p-10 rounded-3xl border flex flex-col ${
                    t.featured
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card border-card-border'
                  }`}
                  data-testid={`tier-${t.name.split(' ')[0]}`}
                >
                  {t.featured && (
                    <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em]">
                      Most popular
                    </span>
                  )}
                  <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-2">{t.name}</div>
                  <div className="text-sm opacity-70 mb-6">{t.nights}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-3xl lg:text-4xl leading-tight">{t.rate}</span>
                  </div>
                  <div className="text-sm opacity-75 mb-7">{t.note}</div>
                  <ul className="space-y-3 text-sm flex-1">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${t.featured ? 'text-primary' : 'text-primary'}`} />
                        <span className="opacity-90">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#crew-inquiry"
                    className={`mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium ${
                      t.featured
                        ? 'bg-background text-foreground hover:opacity-90'
                        : 'bg-foreground text-background hover:opacity-90'
                    }`}
                  >
                    Get this rate <ArrowUpRight className="w-4 h-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground max-w-2xl">
            All rates subject to availability + final scope. Quoted rates assume direct billing or PO; credit-card-only stays may carry a small premium. Block rates reserved for verified Micron-affiliated contractors and vendors.
          </p>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 lg:py-32 bg-card/40">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">✦ Why us</span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] tracking-tight">
                Real hotel vs. <em className="italic font-light">modular camp</em>.
              </h2>
              <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                Both have a place. We're already open, your crews can check in tonight, and you're keeping bed-tax dollars in Onondaga County.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto rounded-3xl border border-card-border bg-background">
              <table className="w-full text-sm" data-testid="comparison-table">
                <thead>
                  <tr className="border-b border-card-border bg-card/60">
                    <th className="text-left p-5 font-medium uppercase tracking-[0.12em] text-xs text-muted-foreground"></th>
                    <th className="text-left p-5 font-medium uppercase tracking-[0.12em] text-xs">The Cicero Grand</th>
                    <th className="text-left p-5 font-medium uppercase tracking-[0.12em] text-xs text-muted-foreground">Modular workforce camp</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => (
                    <tr key={r.label} className="border-b border-card-border last:border-0">
                      <td className="p-5 text-muted-foreground align-top">{r.label}</td>
                      <td className="p-5 align-top font-medium">{r.us}</td>
                      <td className="p-5 align-top text-muted-foreground">{r.camp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AMENITIES + NEARBY */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">✦ Included</span>
              <h3 className="font-display text-4xl lg:text-5xl tracking-tight mb-8">Built for long stays.</h3>
              <div className="grid grid-cols-2 gap-5">
                {amenities.map((a) => (
                  <div key={a.label} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center shrink-0">
                      <a.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">✦ Site adjacencies</span>
              <h3 className="font-display text-4xl lg:text-5xl tracking-tight mb-8">Closest to where you work.</h3>
              <ul className="divide-y divide-card-border border-y border-card-border">
                {nearby.map((n) => (
                  <li key={n.name} className="flex items-center justify-between py-4">
                    <span className="text-sm">{n.name}</span>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> {n.drive}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/area" className="mt-6 inline-flex items-center gap-2 text-sm hover:text-primary">
                Full area guide <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="crew-inquiry" className="py-24 lg:py-36 bg-foreground text-background">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-60 mb-4">✦ Request a quote</span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] tracking-tight">
                Tell us what your crew <em className="italic font-light">needs</em>.
              </h2>
              <p className="mt-6 text-base opacity-75 leading-relaxed">
                We respond within 4 business hours. Or call sales direct: <a href="tel:+13157520150" className="underline">(315) 752-0150</a>.
              </p>
            </div>
          </Reveal>

          {submitted ? (
            <Reveal>
              <div className="p-10 rounded-3xl bg-background/10 border border-background/20">
                <h3 className="font-display text-3xl mb-3">Got it. We'll be in touch shortly.</h3>
                <p className="opacity-75 text-sm">
                  Sales will follow up within 4 business hours with a quote and walk-through times. Need to talk now? Call (315) 752-0150.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="form-crew-inquiry">
                <FormField label="Your name" name="name" required />
                <FormField label="Company" name="company" required />
                <FormField label="Work email" name="email" type="email" required />
                <FormField label="Phone" name="phone" type="tel" />
                <FormField label="Rooms needed" name="rooms" placeholder="e.g. 12" required />
                <FormField label="Estimated start date" name="startDate" type="date" required />
                <FormField label="Estimated duration" name="duration" placeholder="e.g. 4 months" required full />
                <FormField label="Notes / requirements" name="notes" placeholder="Pet-friendly? Specific arrival times? Anything else…" textarea full />

                {error && <div className="md:col-span-2 text-sm text-red-300">{error}</div>}

                <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    data-testid="button-submit-crew"
                  >
                    {submitting ? 'Sending…' : 'Send inquiry'} <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs opacity-60">We respect your privacy. Inquiries route to sales@cicerogrand.com only.</p>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  textarea,
  full,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? 'md:col-span-2' : ''}`}>
      <span className="block text-xs uppercase tracking-[0.16em] opacity-60 mb-2">
        {label} {required && <span className="opacity-60">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="w-full bg-background/5 border border-background/20 rounded-2xl px-5 py-4 text-sm placeholder:opacity-40 focus:outline-none focus:border-background/50"
          data-testid={`input-${name}`}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full bg-background/5 border border-background/20 rounded-2xl px-5 py-4 text-sm placeholder:opacity-40 focus:outline-none focus:border-background/50"
          data-testid={`input-${name}`}
        />
      )}
    </label>
  );
}
