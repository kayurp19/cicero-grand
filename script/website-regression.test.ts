import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { relatedLinks } from '../shared/related-links';
import { localDate, nextDate, validStay } from '../shared/booking-dates';
import { injectRouteSchema } from '../server/static';
import { PAGE_SEO } from '../shared/page-seo';
import pages from '../client/src/content/landing-pages.json';
import imageManifest from '../shared/image-manifest.json';
import { eventInquiry } from '../shared/event-inquiry';

test('related links handle both historic shapes and remove invalid/self/duplicate links', () => {
  assert.deepEqual(relatedLinks([
    {title:'Airport',path:'/airport'}, {label:'Rooms',href:'/rooms'},
    {label:'Self',href:'/current/'}, {label:'Duplicate',href:'/rooms/'},
    {label:' ',href:'/empty'}, {label:'External',href:'//example.com'},
    {label:'Missing'}, null, {label:'Unsafe',href:'javascript:alert(1)'},
  ], '/current'), [{href:'/airport',label:'Airport'}, {href:'/rooms',label:'Rooms'}]);
});
test('all landing links are descriptive, non-self and use existing final routes', () => {
  const app = fs.readFileSync('client/src/App.tsx', 'utf8');
  for (const p of Object.values(pages)) {
    const links = relatedLinks(p.internalLinks, p.path);
    assert.equal(links.length, p.internalLinks.length, p.path);
    for (const l of links) {
      assert(app.includes(`path="${l.href}"`), `${p.path} -> ${l.href}`);
      assert.notEqual(l.href, '/area-guide');
    }
  }
  assert.equal(pages['syracuse-airport'].internalLinks.length, 3);
  assert.equal(pages['jma-wireless-dome'].internalLinks.length, 7);
});
test('landing initial HTML matches client title, description and self canonical', () => {
  const template = fs.readFileSync('client/index.html', 'utf8');
  for (const p of Object.values(pages)) {
    const html = injectRouteSchema(template, p.path);
    const meta = PAGE_SEO[p.path] ?? p;
    assert(html.includes(meta.title.replaceAll('&', '&amp;')), p.path);
    assert(html.includes(`rel="canonical" href="https://www.cicerogrand.com${p.path}"`), p.path);
  }
});
test('date handling preserves local day, month boundaries and DST dates', () => {
  assert.equal(localDate(new Date(2026, 9, 16, 23)), '2026-10-16');
  assert.equal(nextDate('2026-10-31'), '2026-11-01');
  assert.equal(nextDate('2026-12-31'), '2027-01-01');
  assert.equal(nextDate('2028-02-28'), '2028-02-29');
  assert.equal(validStay('2026-10-16','2026-10-16','2026-10-16'), false);
  assert.equal(validStay('2026-10-15','2026-10-17','2026-10-16'), false);
  assert.equal(validStay('2026-10-16','2026-10-17','2026-10-16'), true);
});
test('responsive image variants exist and have explicit source dimensions', () => {
  for (const [src, image] of Object.entries(imageManifest)) {
    assert(image.width > 0 && image.height > 0, src);
    for (const variant of image.variants) {
      assert(fs.existsSync(`client/public${variant.src}`), variant.src);
      assert(variant.width <= image.width, src);
    }
  }
  assert(fs.existsSync('client/public/photos/exterior-entrance-mobile.webp'));
});
test('home image discovery and accessibility restrictions', () => {
  const template = fs.readFileSync('client/index.html', 'utf8');
  const home = injectRouteSchema(template, '/');
  assert(!/maximum-scale|user-scalable/.test(template));
  assert(home.includes('imagesrcset='));
  assert(home.includes('exterior-entrance-mobile.webp'));
  assert(home.includes('media="(max-width: 767px)"'));
  assert(template.includes('as="font"'));
  assert(!template.includes('fonts.googleapis.com'));
});
test('event inquiry routes preserve event intent without replacing room booking', () => {
  assert.equal(eventInquiry('/rooms'), null);
  assert.equal(eventInquiry('/'), null);
  assert.equal(eventInquiry('/contact'), null);
  for (const p of ['/event-center','/event-center/weddings','/event-center/social-events','/event-center/corporate-meetings','/event-center/menus']) {
    const links = eventInquiry(p)!;
    assert(links.quote.startsWith('/contact?'));
    assert(links.tour.includes('tour=1'));
    const params = new URL('https://www.cicerogrand.com'+links.quote).searchParams;
    assert.equal(params.get('topic'), p.endsWith('weddings') ? 'Wedding inquiry' : 'Event / meeting inquiry');
  }
});
test('event metadata is explicit and contains no unsupported rating or capacity markup', () => {
  const template = fs.readFileSync('client/index.html', 'utf8');
  for (const p of ['/event-center','/event-center/social-events','/event-center/weddings','/event-center/corporate-meetings','/event-center/menus']) {
    const html = injectRouteSchema(template,p);
    assert(html.includes(PAGE_SEO[p].description.replaceAll('&','&amp;')),p);
    assert(!html.includes('5.0/5.0'),p);
    assert(!html.includes('maximumAttendeeCapacity'),p);
  }
});
