import { useLocation } from 'wouter';
import { eventInquiry } from '@shared/event-inquiry';
import site from '../content/site.json';

export function EventInquiryActions() {
  const [path] = useLocation();
  const inquiry = eventInquiry(path, '', import.meta.env.VITE_PREVIEW === 'true') ?? eventInquiry('/event-center', '', import.meta.env.VITE_PREVIEW === 'true')!;
  return (
    <section aria-label="Event inquiries" className="bg-primary text-primary-foreground">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="font-display text-2xl">Plan your gathering at Cicero Grand.</p>
          <p className="text-sm mt-2">Share your date, guest count and preferred layout. Our team will confirm availability and options.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a href={inquiry.quote} data-testid="event-request-quote" className="rounded-full bg-background text-foreground px-6 py-3 font-medium">Request a quote</a>
          <a href={inquiry.tour} data-testid="event-request-tour" className="rounded-full border border-current px-6 py-3 font-medium">Request a tour</a>
          <a href={`tel:${site.salesPhoneRaw}`} className="text-sm underline underline-offset-4">Sales: {site.salesPhone}</a>
        </div>
      </div>
    </section>
  );
}
