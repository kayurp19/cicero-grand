import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { initTracking, trackPageView, trackContactSubmit, trackBookNow } from '../client/src/lib/tracking';

test('tracking initializes once and emits one page view per router call, preserving campaign URL', () => {
  const commands: unknown[][] = [];
  const scripts: unknown[] = [];
  const win: any = {
    dataLayer: [],
    location: { origin: 'https://www.cicerogrand.com', search: '?utm_source=qa&utm_medium=test' },
    fbq: (...args: unknown[]) => commands.push(args),
  };
  Object.assign(globalThis, {
    window: win,
    document: { title: 'Test page', createElement: () => ({}), head: { appendChild: (s: unknown) => scripts.push(s) } },
  });
  initTracking();
  initTracking();
  assert.equal(scripts.length, 1);
  assert.equal(commands.filter(c => c[0] === 'init').length, 1);
  assert.equal(commands.filter(c => c[1] === 'PageView').length, 0);
  trackPageView('/', 'Home');
  assert.equal(commands.filter(c => c[1] === 'PageView').length, 1);
  assert.equal(win.dataLayer.at(-1).page_location, 'https://www.cicerogrand.com/?utm_source=qa&utm_medium=test');
  win.location.search = '';
  trackPageView('/event-center', 'Event Center');
  assert.equal(commands.filter(c => c[1] === 'PageView').length, 2);
  trackContactSubmit({ topic: 'Event / meeting inquiry', source: 'contact_page' });
  assert.equal(win.dataLayer.filter((x: any) => x.event === 'generate_lead').length, 1);
  trackBookNow({ source: 'booking_widget' });
  assert.equal(win.dataLayer.filter((x: any) => x.event === 'begin_checkout').length, 1);
  assert.equal(win.dataLayer.filter((x: any) => x.event === 'purchase').length, 0);
  assert(!fs.readFileSync('client/index.html', 'utf8').includes("fbq('init'"));
});

test('booking widget uses the shared link path instead of bypassing Google linker with window.open', () => {
  const source = fs.readFileSync('client/src/components/BookingWidget.tsx', 'utf8');
  assert(!source.includes('window.open'));
  assert(source.includes('href={bookingUrl.toString()}'));
  assert(source.includes("bookingLink.current?.focus()"));
  assert(source.includes('data-booking-source="booking_widget"'));
});
