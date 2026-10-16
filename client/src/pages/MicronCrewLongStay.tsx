import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Check, Phone, Mail, MapPin, Clock, Building2, Bed, Wifi, Coffee, Dumbbell, Waves, Dog, Car, Briefcase } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useSeo, SITE } from '../hooks/useSeo';
import { trackContactSubmit } from '../lib/tracking';

const heroSubcopy =
  'All-suite lodging in Cicero for project crews working near Micron in Clay. Ask about weekly or monthly stays, room availability and a quote for your dates.';

const tiers = [
  {
    name: '5–9 rooms',
    nights: 'Share your dates',
    rate: 'Contact us',
    note: 'special crew rates — call (315) 715-7410',
    bullets: ['Free hot breakfast', 'Indoor pool, fitness center, business center', 'Free parking', 'Pet-friendly'],
  },
  {
    name: '10–24 rooms',
    nights: 'Share your project schedule',
    rate: 'Contact us',
    note: 'special crew rates — call (315) 715-7410',
    bullets: ['Ask about room-block availability', 'Billing terms confirmed with your quote', 'Confirm housekeeping arrangements', '24-hour front desk'],
    featured: true,
  },
  {
    name: '25+ rooms',
    nights: 'Availability confirmed by the hotel',
    rate: 'Contact us',
    note: 'Request a project-specific proposal',
    bullets: ['Share your room count and dates', 'Confirm arrival and departure schedules', 'Discuss changes to your room block', 'Review payment and cancellation terms'],
  },
];

const planningNotes = [
  { title: 'Confirm the worksite', body: 'Ask your employer for the exact gate or meeting point. Check current routes from 5875 Carmenica Drive; traffic and site access can change travel times.' },
  { title: 'Match rooms to your crew', body: 'Share the number of people and rooms you need. Confirm room occupancy and bedding with the hotel; sleeper sofas should not be assumed available.' },
  { title: 'Review your quote', body: 'Rates, minimum stays, deposits, billing approval and cancellation terms depend on the confirmed proposal. A quote request does not reserve a room block.' },
];

const amenities = [
  { icon: Bed, label: 'All-suite rooms' },
  { icon: Coffee, label: 'Free hot breakfast' },
  { icon: Waves, label: 'Indoor pool' },
  { icon: Dumbbell, label: '24/7 fitness center' },
  { icon: Wifi, label: 'Fast free Wi-Fi' },
  { icon: Briefcase, label: 'Business center' },
  { icon: Car, label: 'Free parking' },
  { icon: Dog, label: 'Pet-friendly; confirm fees' },
];

const nearby = [
  { name: 'Micron-area stays', href: '/hotels-near-micron' },
  { name: 'SRCTec business stays', href: '/hotels-near-srctec-syracuse' },
  { name: 'Syracuse airport arrivals', href: '/hotels-near-syracuse-airport' },
  { name: 'Lockheed Martin business stays', href: '/hotels-near-lockheed-martin-syracuse' },
  { name: 'National Grid business stays', href: '/hotels-near-national-grid-syracuse' },
  { name: 'RTX / Raytheon business stays', href: '/hotels-near-rtx-raytheon-syracuse' },
  { name: 'Liverpool-area stays', href: '/hotels-liverpool-ny' },
];

export default function MicronCrewLongStay() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: 'Micron Crew & Extended-Stay Hotel | Cicero Grand',
    description:
      'Request a quote for crew lodging in Cicero near Micron in Clay. Suites with a microwave and mini-fridge, free breakfast and parking.',
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
          'Crew and extended-stay lodging in Cicero for contractors, vendors and project teams visiting the Micron area in Clay. Availability and terms confirmed by quote.',
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
          message: `— CREW LODGING INQUIRY —
Lead source: Micron Crew Long-Stay page
Stay type: Crew long-stay / project housing
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
        title="Micron crew stays in Cicero."
        intro={heroSubcopy}
        image="/photos/exterior-1.jpg"
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
                Ask about weekly and monthly pricing for your crew. Rates, availability, billing arrangements and stay terms are confirmed with your quote. Enjoy free breakfast, parking and Wi-Fi, plus our indoor pool and fitness center.
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
                      Project stays
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
                    Request a quote <ArrowUpRight className="w-4 h-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground max-w-2xl">
            Room counts are planning examples, not guaranteed inventory or minimum-stay policies. All rates, availability, payment arrangements and stay terms require a confirmed quote. Cicero Grand is an independent hotel, not affiliated with Micron.
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
                Plan your crew's <em className="italic font-light">stay</em>.
              </h2>
              <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                A few details help us match your project schedule to available rooms. For an individual stay, check live availability in our booking engine.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-3 gap-5">
              {planningNotes.map(n => (
                <article key={n.title} className="rounded-3xl border border-card-border bg-background p-7">
                  <h3 className="font-display text-2xl mb-4">{n.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{n.body}</p>
                </article>
              ))}
            </div>
            <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full px-6 py-3 bg-primary text-primary-foreground font-medium">Check rates & book <ArrowUpRight className="ml-2 w-5 h-5" /></a>
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
              <h3 className="font-display text-4xl lg:text-5xl tracking-tight mb-8">Plan your work trip.</h3>
              <ul className="divide-y divide-card-border border-y border-card-border">
                {nearby.map((n) => (
                  <li key={n.name} className="flex items-center justify-between py-4">
                    <Link href={n.href} className="text-sm underline underline-offset-4 hover:text-primary">{n.name}</Link>
                    <ArrowUpRight className="w-4 h-4" />
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
                Share your dates and room needs below, or call sales: <a href="tel:+13157157410" className="underline">(315) 715-7410</a>.
              </p>
            </div>
          </Reveal>

          {submitted ? (
            <Reveal>
              <div className="p-10 rounded-3xl bg-background/10 border border-background/20">
                <h3 className="font-display text-3xl mb-3">Got it. We'll be in touch shortly.</h3>
                <p className="opacity-75 text-sm">
                  Our team will review your request and contact you about availability and terms. This inquiry does not confirm a reservation. Need to talk now? Call (315) 715-7410.
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
