import { useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { useSeo } from '../hooks/useSeo';
import siteSeed from '../content/site.json';

export default function Contact() {
  useSeo({
    title: 'Contact The Cicero Grand · 5875 Carmenica Dr, Cicero NY',
    description:
      'Reach The Cicero Grand: front desk (315) 752-0150, sales (315) 715-7410, sales@cicerogrand.com. 5875 Carmenica Drive, Cicero, NY 13039.',
    canonicalPath: '/contact',
  });
  const site = useContent<typeof siteSeed>('site');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('sent');
        formEl.reset();
      } else {
        setStatus('error');
        setErrorMsg(data.message || `Server error (${res.status})`);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error — check your connection');
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.address.full
  )}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        image="/photos/exterior-2.jpg"
        title={<>Get in <em className="italic font-light">touch</em>.</>}
        intro="Phone us, email us, or fill out the form below. The front desk is staffed 24/7."
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Info column */}
            <Reveal as="div" className="col-span-12 lg:col-span-5">
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-tight mb-10 text-balance">
                Three ways to reach us.
              </h2>
              <ul className="space-y-7">
                <li>
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Hotel front desk</div>
                      <a href={`tel:${site.phoneRaw}`} className="font-display text-2xl tracking-tight hover:text-primary transition-colors">
                        {site.phone}
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Sales & events</div>
                      <a href={`tel:${site.salesPhoneRaw}`} className="font-display text-2xl tracking-tight hover:text-primary transition-colors">
                        {site.salesPhone}
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Email</div>
                      <a href={`mailto:${site.email}`} className="font-display text-2xl tracking-tight hover:text-primary transition-colors">
                        {site.email}
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Address</div>
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="font-display text-2xl tracking-tight hover:text-primary transition-colors block leading-tight">
                        {site.address.street}<br />
                        {site.address.city}, {site.address.state} {site.address.zip}
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Front desk</div>
                      <div className="font-display text-2xl tracking-tight">Open 24/7</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Check-in {site.checkIn} · Check-out {site.checkOut}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </Reveal>

            {/* Form column */}
            <Reveal as="div" className="col-span-12 lg:col-span-7" delay={120}>
              <form
                onSubmit={onSubmit}
                data-testid="contact-form"
                className="bg-card border border-card-border rounded-3xl p-7 lg:p-10"
              >
                <h3 className="font-display text-2xl tracking-tight mb-7">Send a message</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Name</span>
                    <input
                      name="name"
                      required
                      data-testid="input-name"
                      className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Email</span>
                    <input
                      type="email"
                      name="email"
                      required
                      data-testid="input-email"
                      className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      data-testid="input-phone"
                      className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Topic</span>
                    <select
                      name="topic"
                      data-testid="input-topic"
                      className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                    >
                      <option>General question</option>
                      <option>Group / project rate</option>
                      <option>Wedding inquiry</option>
                      <option>Event / meeting inquiry</option>
                      <option>Lost & found</option>
                    </select>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      data-testid="input-message"
                      className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                    />
                  </label>
                </div>
                <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
                  <p className={`text-xs ${status === 'sent' ? 'text-green-700 dark:text-green-400' : status === 'error' ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground'}`}>
                    {status === 'sent' && '✓ Thanks — we received your message. We respond within one business day.'}
                    {status === 'error' && `Could not send: ${errorMsg}. Please call us at ${site.phone} or email ${site.email}.`}
                    {status === 'idle' && 'We respond within one business day.'}
                    {status === 'sending' && 'Sending...'}
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    data-testid="button-submit"
                    className="inline-flex items-center gap-2 px-7 h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Send <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-muted/30 pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-map"
            className="block aspect-[16/7] rounded-3xl overflow-hidden bg-foreground relative group"
          >
            <iframe
              title="Map to Cicero Grand"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </section>
    </>
  );
}
