# Cookie consent repair: acceptance and regression checks

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
