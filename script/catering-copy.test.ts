import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import events from '../client/src/content/events.json';
import weddings from '../client/src/content/weddings.json';
import area from '../client/src/content/area.json';

test('event catering copy is general and distinguishes paid extras from base rental', () => {
  for (const path of [
    'client/src/pages/EventCenter.tsx',
    'client/src/pages/event-center/Weddings.tsx',
    'client/src/pages/event-center/SocialEvents.tsx',
    'client/src/content/events.json',
    'client/src/content/weddings.json',
    'server/static.ts',
  ]) {
    const text = readFileSync(path, 'utf8');
    assert(!/\bethnic|\bcultural|\breligious|\bkosher|\bhalal|\bjain|\bquince/i.test(text), path);
    assert(!text.includes('full kitchen access'), path);
    assert(text.includes('not included in the base rental'), path);
  }
  const schemaSource = readFileSync('server/static.ts', 'utf8');
  for (const q of ['Can we bring our own caterer?', 'What about decor and setup?']) {
    const faq = weddings.faqs.find(f => f.q === q);
    assert(faq, q);
    assert(schemaSource.includes(JSON.stringify(faq.a)), `SSR schema must match visible FAQ: ${q}`);
  }
  const included = events.faqs.find(f => f.q === "What's included in every package?");
  assert(included?.a.includes('optional paid add-ons'));
});

test('Oneida Lake is a featured destination with official visitor information', () => {
  const lakes = area.featured.filter(f => f.name === 'Oneida Lake');
  assert.equal(lakes.length, 1);
  assert.equal(lakes[0].sourceUrl, 'https://dec.ny.gov/places/oneida-lake-madison-onondaga-oswego-and-oneida');
  assert(!lakes[0].drive.includes('min'));
});
