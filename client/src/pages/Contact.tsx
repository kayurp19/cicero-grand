import { useState, useEffect, useRef, FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import { trackContactSubmit } from '../lib/tracking';
import { useSeo } from '../hooks/useSeo';
import siteSeed from '../content/site.json';

const TOPIC_OPTIONS = [
  'General question',
  'Group blocks',
  'Corporate / extended stays',
  'Wedding inquiry',
  'Event / meeting inquiry',
  'Lost & found',
] as const;

function matchTopic(raw: string | null): string {
  if (!raw) return 'General question';
  const lower = raw.toLowerCase();
  const exact = TOPIC_OPTIONS.find((t) => t.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes('wedding')) return 'Wedding inquiry';
  if (lower.includes('corporate') || lower.includes('extended') || lower.includes('long stay') || lower.includes('crew') || lower.includes('project rate'))
    return 'Corporate / extended stays';
  if (lower.includes('group') || lower.includes('block'))
    return 'Group blocks';
  if (lower.includes('tour') || lower.includes('event') || lower.includes('meeting') || lower.includes('banquet'))
    return 'Event / meeting inquiry';
  if (lower.includes('lost')) return 'Lost & found';
  return 'General question';
}

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

  // Form state
  const [topic, setTopic] = useState<string>('General question');
  const [message, setMessage] = useState<string>('');
  // Event-lead details (only required when topic is event-related)
  const [eventType, setEventType] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [alternateDate, setAlternateDate] = useState<string>('');
  const [flexibility, setFlexibility] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>('');
  const [roomBlockNeeded, setRoomBlockNeeded] = useState<string>('Not sure yet');
  const [roomBlockNights, setRoomBlockNights] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [companyOrg, setCompanyOrg] = useState<string>('');
  const [tourRequested, setTourRequested] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  // Show event-lead fields for any event-related topic
  const isEventLead =
    topic === 'Wedding inquiry' ||
    topic === 'Event / meeting inquiry' ||
    topic === 'Group blocks' ||
    topic === 'Corporate / extended stays';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get('topic');
    const messageParam = params.get('message');
    if (topicParam) setTopic(matchTopic(topicParam));
    if (messageParam) setMessage(messageParam);
    // Optional prefills from URL — each CTA can supply context
    const eventTypeParam = params.get('event_type');
    if (eventTypeParam) setEventType(eventTypeParam);
    const dateParam = params.get('date') || params.get('preferred_date');
    if (dateParam) setPreferredDate(dateParam);
    const altDateParam = params.get('alternate_date');
    if (altDateParam) setAlternateDate(altDateParam);
    const guestsParam = params.get('guests') || params.get('guest_count');
    if (guestsParam) setGuestCount(guestsParam);
    const blockParam = params.get('room_block');
    if (blockParam) setRoomBlockNeeded(blockParam);
    const budgetParam = params.get('budget');
    if (budgetParam) setBudget(budgetParam);
    const orgParam = params.get('org') || params.get('company');
    if (orgParam) setCompanyOrg(orgParam);
    if (params.get('tour') === '1' || params.get('tour') === 'true') setTourRequested(true);

    if (topicParam || messageParam || window.location.hash === '#contact-form') {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, []);

  // Compose extra lead details into the message body so they flow through the
  // existing /api/contact endpoint (which only persists name/email/phone/topic/message)
  // — no DB migration needed, and the sales team gets a fully-structured email.
  function composeMessageWithDetails(baseMessage: string): string {
    if (!isEventLead) return baseMessage;
    const lines: string[] = [];
    lines.push('— EVENT LEAD DETAILS —');
    if (eventType) lines.push(`Event type: ${eventType}`);
    if (preferredDate) lines.push(`Preferred date: ${preferredDate}`);
    if (alternateDate) lines.push(`Alternate date: ${alternateDate}`);
    if (flexibility) lines.push(`Date flexibility: ${flexibility}`);
    if (guestCount) lines.push(`Approx. guest count: ${guestCount}`);
    if (roomBlockNeeded && roomBlockNeeded !== 'Not sure yet')
      lines.push(`Room block needed: ${roomBlockNeeded}${roomBlockNights ? ` (${roomBlockNights} night${roomBlockNights === '1' ? '' : 's'})` : ''}`);
    if (budget) lines.push(`Budget range: ${budget}`);
    if (companyOrg) lines.push(`Company / organization: ${companyOrg}`);
    if (tourRequested) lines.push(`Tour requested: Yes`);
    if (lines.length === 1) return baseMessage; // only header, no details — skip
    const header = lines.join('\n');
    return baseMessage ? `${header}\n\n— MESSAGE —\n${baseMessage}` : header;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const payload: Record<string, string> = Object.fromEntries(
      Array.from(fd.entries()).map(([k, v]) => [k, String(v)])
    );
    // Override message with composed version that includes event-lead details
    payload.message = composeMessageWithDetails(message);
    payload.topic = topic;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('sent');
        trackContactSubmit({ topic, source: 'contact_page' });
        formEl.reset();
        // reset event-lead local state too
        setMessage('');
        setEventType('');
        setPreferredDate('');
        setAlternateDate('');
        setFlexibility('');
        setGuestCount('');
        setRoomBlockNeeded('Not sure yet');
        setRoomBlockNights('');
        setBudget('');
        setCompanyOrg('');
        setTourRequested(false);
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
                ref={formRef}
                id="contact-form"
                onSubmit={onSubmit}
                data-testid="contact-form"
                className="bg-card border border-card-border rounded-3xl p-7 lg:p-10 scroll-mt-24"
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
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                    >
                      {TOPIC_OPTIONS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>

                  {/* EVENT-LEAD DETAILS — shown only for event-related topics */}
                  {isEventLead && (
                    <div className="md:col-span-2 mt-2 mb-2 rounded-2xl border border-primary/25 bg-primary/5 p-5 lg:p-6">
                      <div className="mb-4">
                        <span className="text-xs uppercase tracking-[0.18em] text-primary font-medium">Event details</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          A few quick details so our coordinator can prep options before they call you back.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Event type</span>
                          <input
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            placeholder={topic === 'Wedding inquiry' ? 'Wedding reception, ceremony…' : 'Conference, banquet, party…'}
                            data-testid="input-event-type"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Approx. guest count</span>
                          <input
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            inputMode="numeric"
                            placeholder="e.g. 120"
                            data-testid="input-guest-count"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Preferred date</span>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            data-testid="input-preferred-date"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Alternate date</span>
                          <input
                            type="date"
                            value={alternateDate}
                            onChange={(e) => setAlternateDate(e.target.value)}
                            data-testid="input-alternate-date"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Date flexibility</span>
                          <select
                            value={flexibility}
                            onChange={(e) => setFlexibility(e.target.value)}
                            data-testid="input-flexibility"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          >
                            <option value="">— Select —</option>
                            <option>Fixed date</option>
                            <option>Flexible by 1–2 weeks</option>
                            <option>Flexible by a month</option>
                            <option>Wide open — pick best availability</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Room block needed</span>
                          <select
                            value={roomBlockNeeded}
                            onChange={(e) => setRoomBlockNeeded(e.target.value)}
                            data-testid="input-room-block"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          >
                            <option>Not sure yet</option>
                            <option>Yes — under 10 rooms</option>
                            <option>Yes — 10–25 rooms</option>
                            <option>Yes — 25–50 rooms</option>
                            <option>Yes — 50+ rooms</option>
                            <option>No room block</option>
                          </select>
                        </label>
                        {roomBlockNeeded.startsWith('Yes') && (
                          <label className="block">
                            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Number of nights</span>
                            <input
                              value={roomBlockNights}
                              onChange={(e) => setRoomBlockNights(e.target.value)}
                              inputMode="numeric"
                              placeholder="e.g. 2"
                              data-testid="input-room-block-nights"
                              className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                            />
                          </label>
                        )}
                        <label className="block">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Budget range (optional)</span>
                          <input
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. $5–10k"
                            data-testid="input-budget"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Company / organization (optional)</span>
                          <input
                            value={companyOrg}
                            onChange={(e) => setCompanyOrg(e.target.value)}
                            placeholder="e.g. Micron, Le Moyne College"
                            data-testid="input-company"
                            className="mt-1.5 w-full bg-background border border-border rounded-xl px-4 h-12 outline-none focus:border-primary transition-colors"
                          />
                        </label>
                        <label className="flex items-start gap-3 md:col-span-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tourRequested}
                            onChange={(e) => setTourRequested(e.target.checked)}
                            data-testid="input-tour-requested"
                            className="mt-1 w-4 h-4 accent-primary"
                          />
                          <span className="text-sm">
                            <span className="font-medium">I'd like to schedule a tour</span>
                            <span className="block text-xs text-muted-foreground">Our coordinator will reach out with available tour times.</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <label className="block md:col-span-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {isEventLead ? 'Anything else? (optional)' : 'Message'}
                    </span>
                    <textarea
                      name="message"
                      required={!isEventLead}
                      rows={isEventLead ? 3 : 5}
                      data-testid="input-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isEventLead ? 'Special requests, accessibility needs, A/V, anything we should know…' : ''}
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
