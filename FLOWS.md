# Cookie consent repair: acceptance and regression checks

## November 21 property name
- Header logo follow-up: full supplied logo artwork in light/dark versions, with only the location “Syracuse North” alongside; accessible home link; header height, navigation, footer and homepage SEO remain intact.
- Match the homepage H1, shared header/footer, branded titles and Hotel, Organization and WebSite names to Cicero Grand - Syracuse North.
- Preserve the original logo mark, page topics, booking links, analytics, legal terms, addresses and canonical URLs. Verify before requesting a homepage recrawl.

## November 17 room occupancy and Tripadvisor verification
- Executive King shows Sleeps 4 on homepage and Suites; King Jacuzzi stays at 2.
- Jacuzzi has one king bed and a sofa for relaxing, never additional sleeper capacity.
- Remove blanket every-suite-sleeps-four and all-suite-sofa-sleeper claims, including packages and event/area copy.
- Rooms offers JSON-LD declares maximum occupancy from the same room records.
- Offers, packages, guest directory and initial server metadata contain no contrary occupancy claims.
- CMS rooms/offers/weddings have no override; inspect site/area overrides separately.
- Exact supplied Tripadvisor URL retains all four UTM parameters at arrival.
- With consent, real booking clicks acquire Google's _gl linker; client/session identity persists on Cloudbeds and ignores self-referral.
- Repeat after internal navigation and via mobile widget / keyboard activation.
- Essential-only consent must still block website measurement.
- GA4 historical purchase report checks transaction ID, USD value and per-ID event counts; no synthetic purchase, real booking or payment is submitted.
- No new purchase tag, integration-mode change, rate change or budget change.

### November 17 validation results
- TypeScript, regression tests, production build and analytics-disabled preview build pass.
- Browser checks: shared homepage/Suites cards and room-offer JSON-LD show Executive King 4 and Jacuzzi 2; mobile navigation, cookie settings, event inquiry topic and affected routes work without new page errors.
- Legacy CMS site highlight is corrected on read by exact string match; unrelated settings and stored content remain intact.
- Live supplied Tripadvisor landing captures UTMs. Header, mobile sticky and keyboard date-widget booking links receive `_gl`, including after navigating to Offers.
- Website and Cloudbeds GA4 requests use the same client/session IDs; Cloudbeds sends `ir=1`. GA4 domain configuration includes cloudbeds.com and cicerogrand.com.
- GA4 purchase report for November 1–16, 2026 has 11 nonempty unique transaction IDs, each with one purchase event, one ecommerce purchase, positive purchase revenue and USD currency. This is a report sample, not reconciliation against PMS records or proof of universal deduplication.
- No Tripadvisor purchase appears in the reviewed report. A new completed Tripadvisor reservation, its amount/currency reconciliation and confirmation-page reload deduplication are NOT end-to-end verified; no reservation or payment was submitted.
- Cloudbeds guest interface loads in Comet; the sandbox browser encountered a Cloudbeds loading error. No booking-engine settings were changed.

## November 2 catering-copy correction
- Event center, weddings and social events use neutral catering descriptions.
- No ethnicity/religion-focused promotional copy remains on these event pages.
- China, glassware, silverware and kitchen access are paid extras, not base inclusions.
- Expand related FAQs; verify the same terms in visible text and wedding JSON-LD.
- Existing rates, menu prices, catering fees and booking systems remain unchanged.
- Mobile/desktop catering layout and quote/tour links remain usable.
- Public CMS events/weddings endpoints had no overrides (404) before this edit.
- Oneida Lake is a first-position Area Guide highlight with a working NYSDEC link.
- Lake highlight uses an intentional wave illustration, not an unrelated lake photograph.
- No new lake driving-time or opening-hours guarantees are introduced.

## Consent choices
- A fresh desktop/mobile visit makes no Google or Meta tracking requests.
- Essential only and closing an undecided banner save essential-only preference.
- Navigate and reload: no tracking, no replay of actions.
- Accept all starts configured tracking once; only the current page is emitted.
- Footer Cookie settings reopens; keyboard focus reaches the choices.
- Withdrawal reloads, removes known optional cookies, preserves necessary cookies.
- Accepted and essential choices persist for 180 days, with version and timestamp.
- Legacy, malformed and expired choices fail closed and ask again.
- Global Privacy Control prevents optional tracking even with an accepted record.
- Blocked storage, cross-tab withdrawal and browser back/forward are checked.
- No JavaScript tracking fallbacks bypass consent.

## Booking and inquiry paths
- Home booking controls still validate dates and open the same Cloudbeds destination.
- Rooms and event navigation remains available with either preference.
- Event inquiry link opens the contact form with the intended topic.
- No real reservation or inquiry is submitted as part of this cookie repair.

## Shared pages and overlays
- Privacy policy describes actual cookie settings and their off-domain limits.
- Footer controls work on home, rooms, event, privacy and guest directory pages.
- Mobile/desktop layout, keyboard actions, resize and console errors checked.
- Promo form still uses its existing endpoint; its measurement is consent-gated.
- All public routes smoke-checked; draft emergency-map commits are excluded.

## Scope
- No rate, budget, discount, booking integration or conversion-definition changes.
- Consent records are browser-local, not a central server-side audit ledger.
- Preview builds disable all live measurement regardless of preference.

## Syracuse hotel search pages
- On desktop and mobile, the Syracuse shopper and airport heroes offer Check dates (existing Cloudbeds destination) and Compare suites (/rooms).
- The visitor guide leads to the shopper page; all three retain independent headings and canonical URLs. Airport copy limits included parking to the stay and does not offer a shuttle.
