import assert from 'node:assert/strict';
import fs from 'node:fs';
import { injectRouteSchema } from '../server/static';
import { PAGE_SEO } from '../shared/page-seo';

const html = fs.readFileSync('client/index.html', 'utf8');
const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const descriptions = new Set<string>();
for (const [route, expected] of Object.entries(PAGE_SEO)) {
  const out = injectRouteSchema(html, route);
  assert.equal(decode(out.match(/<title>(.*?)<\/title>/)![1]), expected.title);
  for (const [attribute, key, value] of [
    ['name', 'description', expected.description],
    ['property', 'og:title', expected.title],
    ['property', 'og:description', expected.description],
    ['name', 'twitter:title', expected.title],
    ['name', 'twitter:description', expected.description],
  ]) {
    const matches = Array.from(out.matchAll(new RegExp(`<meta ${attribute}="${key}" content="([^"]*)"`, 'g')));
    assert.equal(matches.length, 1, `${route}: ${key} must be unique`);
    assert.equal(decode(matches[0][1]), value, `${route}: ${key}`);
  }
  assert.equal(/kitchenette/i.test(expected.description), false);
  assert.ok(expected.description.length <= 165, `${route}: description length`);
  assert.ok(!descriptions.has(expected.description), `${route}: duplicate description`);
  descriptions.add(expected.description);
  for (const script of out.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(script[1]);
  console.log(`PASS ${route} (${expected.description.length} characters)`);
}
PAGE_SEO['/test-escaping'] = { title: 'Suites & "Rooms" <test>', description: 'A 55" TV & room <details>.' };
const escaped = injectRouteSchema(html, '/test-escaping');
assert.ok(escaped.includes('content="A 55&quot; TV &amp; room &lt;details&gt;."'));
delete PAGE_SEO['/test-escaping'];
assert.equal(injectRouteSchema(html, '/unknown-path'), html);
console.log('PASS HTML escaping and unknown-route preservation');
