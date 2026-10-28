import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { initTracking, trackPageView, trackContactSubmit, trackBookNow } from '../client/src/lib/tracking';
import { saveConsent, CONSENT_KEY, getConsent } from '../client/src/lib/consent';

test('tracking fails closed, initializes once after consent, preserves events and stops on withdrawal', () => {
  const commands: unknown[][] = [];
  const scripts: unknown[] = [];
  const local = new Map<string, string>();
  const target = new EventTarget();
  let reloads = 0;
  const win: any = {
    dataLayer: [],
    location: {
      origin: 'https://www.cicerogrand.com', hostname: 'www.cicerogrand.com',
      pathname: '/', search: '?utm_source=qa&utm_medium=test', reload: () => reloads++,
    },
    addEventListener: target.addEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    localStorage: {
      getItem: (key: string) => local.get(key) ?? null,
      setItem: (key: string, value: string) => local.set(key, value),
      removeItem: (key: string) => local.delete(key),
    },
    fbq: (...args: unknown[]) => commands.push(args),
  };
  Object.assign(globalThis, {
    window: win,
    document: { cookie: '', title: 'Test page', createElement: () => ({}), head: { appendChild: (s: unknown) => scripts.push(s) } },
  });
  initTracking();
  trackPageView('/before-consent');
  trackContactSubmit({ source: 'before-consent' });
  trackBookNow({ source: 'before-consent' });
  assert.equal(scripts.length, 0);
  assert.equal(commands.length, 0);
  assert.equal(win.dataLayer.filter((x: any) => x.event).length, 0);
  local.set('cg_cookie_consent_v1', 'accepted');
  assert.equal(getConsent(), null, 'legacy acceptance must not authorize tracking');
  saveConsent('accepted');
  assert.equal(getConsent()?.noticeVersion, '2026-10-28');
  assert.equal(getConsent()!.expiresAt - getConsent()!.savedAt, 180 * 864e5);
  initTracking();
  assert.equal(scripts.length, 1);
  assert.equal(commands.filter(c => c[0] === 'init').length, 1);
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
  const eventCount = win.dataLayer.filter((x: any) => x.event).length;
  saveConsent('essential');
  assert.equal(reloads, 1);
  assert.equal(JSON.parse(local.get(CONSENT_KEY)!).choice, 'essential');
  trackContactSubmit({ source: 'after-withdrawal' });
  trackBookNow({ source: 'after-withdrawal' });
  trackPageView('/after-withdrawal');
  assert.equal(win.dataLayer.filter((x: any) => x.event).length, eventCount);
  assert.equal(commands.filter(c => c[0] === 'consent' && c[1] === 'revoke').length, 1);
  const html = fs.readFileSync('client/index.html', 'utf8');
  assert(!html.includes("fbq('init'"));
  assert(!html.includes('googletagmanager.com/ns.html'));
  assert(!html.includes('facebook.com/tr?'));
});

test('booking widget uses the shared link path instead of bypassing Google linker with window.open', () => {
  const source = fs.readFileSync('client/src/components/BookingWidget.tsx', 'utf8');
  assert(!source.includes('window.open'));
  assert(source.includes('href={bookingUrl.toString()}'));
  assert(source.includes("bookingLink.current?.focus()"));
  assert(source.includes('data-booking-source="booking_widget"'));
});
