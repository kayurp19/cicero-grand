import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import rooms from '../client/src/content/rooms.json';
import { correctLegacyOccupancy } from '../server/content-corrections';

test('legacy CMS highlight is corrected without changing unrelated content', () => {
  const stored = { highlights: ['All-suite hotel — every room sleeps four', 'Free parking'], rate: 116 };
  assert.deepEqual(correctLegacyOccupancy('site', stored), {
    highlights: ['All-suite hotel — room occupancy varies by suite', 'Free parking'], rate: 116,
  });
  assert.equal(stored.highlights[0], 'All-suite hotel — every room sleeps four');
  assert.equal(correctLegacyOccupancy('offers', stored), stored);
  for (const value of [null, 'text', {}, { highlights: null }]) {
    assert.equal(correctLegacyOccupancy('site', value), value);
  }
});

test('owner-approved Executive King and Jacuzzi occupancy is consistent', () => {
  const executive = rooms.find(r => r.id === 'executive-king')!;
  const jacuzzi = rooms.find(r => r.id === 'king-jacuzzi')!;
  assert.equal(executive.sleeps, 4);
  assert.match(executive.tagline, /up to four guests/);
  assert.equal(jacuzzi.sleeps, 2);
  assert.equal(jacuzzi.beds, '1 King');
  assert.match(jacuzzi.tagline, /Maximum occupancy: two guests/);
  assert(jacuzzi.features.includes('Sofa for relaxing'));
  assert(!JSON.stringify(jacuzzi).match(/sleeper|two more guests/i));
  for (const id of ['two-queen-suite', 'executive-two-queen', 'ada-two-queen']) {
    assert.equal(rooms.find(r => r.id === id)!.sleeps, 6, 'unrelated room limits unchanged');
  }
});

test('room cards and offer schema use the shared occupancy; no blanket sleeper claims', () => {
  const source = fs.readFileSync('client/src/pages/Rooms.tsx','utf8');
  assert(source.includes('maxValue: r.sleeps'));
  assert(source.includes('Sleeps {room.sleeps}'));
  assert(!source.includes('separate living area, sofa sleeper, microwave'));
  const home = fs.readFileSync('client/src/pages/Home.tsx','utf8');
  assert(home.includes('Sleeps {room.sleeps}'));
  for (const file of [
    'client/src/content/site.json', 'client/src/content/area.json',
    'client/src/content/packages.json', 'client/src/content/weddings.json',
    'client/src/pages/Area.tsx','client/src/pages/Corporate.tsx',
    'client/src/pages/event-center/CorporateMeetings.tsx','server/static.ts',
  ]) {
    assert(!/every (suite|room) sleeps (four|4)|all sleeping four|all-suite rooms sleep 4/i.test(fs.readFileSync(file,'utf8')), file);
  }
});
