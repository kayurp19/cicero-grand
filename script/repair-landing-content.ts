import fs from 'node:fs';
import { relatedLinks } from '../shared/related-links';

// One-time content migration. Existing URLs and actual hotel policies are unchanged.
const file = 'client/src/content/landing-pages.json';
const pages = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const p of Object.values(pages) as any[]) {
  p.internalLinks = relatedLinks(p.internalLinks, p.path).map(l => ({
    ...l, href: l.href === '/area-guide' ? '/area' : l.href === '/hotels-cicero-ny' ? '/cicero-ny-hotels' : l.href,
  }));
}
const roomNote = 'Suites include a microwave and mini-fridge, not a kitchenette or full kitchen. Confirm the selected room’s occupancy and bedding before booking; do not assume a sleeper sofa is available.';
const petNote = 'Pet-friendly room options are available. Contact the hotel before booking to confirm current pet fees, restrictions and room availability.';
const cicero = pages['cicero-ny-hotels'];
Object.assign(cicero, {
  title: 'Hotel in Cicero, NY | All-Suite Stays at Cicero Grand',
  description: 'Stay at Cicero Grand in Cicero, NY, off I-81 Exit 98. Suites with a microwave and mini-fridge, free breakfast and parking. Check direct availability.',
  h1: 'Your hotel in Cicero, NY',
  subtitle: 'Stay at 5875 Carmenica Drive, off I-81 Exit 98, with all-suite rooms and a hotel team ready to help plan your visit.',
  intro: 'Choose Cicero Grand when your visit brings you to Cicero, Brewerton or the northern Syracuse area. Our Carmenica Drive location gives you a base for local family visits, youth sports, Oneida Lake outings and project work in nearby Clay. Check live room availability for your dates, then contact the hotel about any special arrival or parking needs.',
  highlights: ['Located in the Town of Cicero, NY', 'All-suite rooms with a microwave and mini-fridge', 'Free hot breakfast, Wi-Fi and hotel parking', 'Indoor pool and fitness center', '24-hour front desk for late arrivals', 'Ask about crew and group stays'],
  why: [
    { title: 'Arrive in Cicero', body: 'Use 5875 Carmenica Drive, Cicero, NY 13039 in your navigation. Check your route from I-81 before departure and allow for current roadwork and traffic.' },
    { title: 'Choose the right suite', body: roomNote },
    { title: 'Plan a local visit', body: 'Tell us whether you are visiting family, attending a tournament or arranging project lodging. For several rooms, share your dates, room count and arrival schedule with our team.' },
  ],
  nearby: ['Cicero and Brewerton family visits', 'Oneida Lake outings', 'Clay and Micron-area project work', 'Syracuse Hancock International Airport', 'Syracuse campus and event trips'],
  longContent: [
    { h2: 'Local stays, not a downtown address', body: 'Cicero Grand is in Cicero, north of Syracuse. If your plans include downtown Syracuse or a campus event, check the route to the exact venue and its parking instructions. Hotel parking does not include parking at an attraction or event.' },
    { h2: 'Traveling with a team or crew', body: 'Send the hotel your arrival and departure dates, number of rooms and any schedule changes you expect. Group availability, quoted rates, billing arrangements and cancellation terms must be confirmed in writing for your booking.' },
    { h2: 'Before you arrive', body: 'Our front desk is staffed 24 hours. Let us know about a late arrival, an oversized vehicle or a pet before travel so we can confirm the arrangements that apply to your stay.' },
  ],
  faqs: [
    { q: 'Where is Cicero Grand located?', a: '5875 Carmenica Drive, Cicero, NY 13039, off I-81 Exit 98. We are in the Town of Cicero, not downtown Syracuse.' },
    { q: 'Can I arrive late?', a: 'The front desk is staffed 24 hours. Contact the hotel about your expected arrival time and check the guarantee and cancellation terms on your reservation.' },
    { q: 'What room features should I expect?', a: roomNote },
    { q: 'Can I bring a pet?', a: petNote },
    { q: 'How do I check the price for my dates?', a: 'Use Check rates & book to see live availability in our booking engine. Review occupancy, taxes, fees and the cancellation terms of your selected rate before completing the reservation.' },
  ],
});
// Do not edit quoted guest statements; withdraw unsupported promotional quotes.
cicero.reviews = [];
const visitor = pages['syracuse-hotel'];
Object.assign(visitor, {
  h1: 'Plan your Syracuse visit',
  subtitle: 'Campus visits, medical appointments, airport arrivals and event nights: plan your route from our all-suite hotel in Cicero.',
  intro: 'Start with the reason for your Syracuse trip. Cicero Grand is at 5875 Carmenica Drive in Cicero, not downtown or on a university campus. Match your room dates to your appointment, flight or event, then check the route and parking arrangements at your destination. Our hotel includes free hot breakfast, Wi-Fi and hotel parking.',
  highlights: ['A Cicero base for visits to the Syracuse area', 'Microwave and mini-fridge in your suite', 'Free breakfast, Wi-Fi and hotel parking', '24-hour front desk', 'Live availability and rate terms in the booking engine'],
  why: [
    { title: 'Campus and event visits', body: 'For Syracuse University, Le Moyne College or the JMA Wireless Dome, confirm the exact building or entrance, ticket time and destination parking. Allow extra travel time around busy events.' },
    { title: 'Hospital appointments', body: 'Confirm the campus, building and appointment time directly with the medical provider. If your return date could change, compare cancellation terms before choosing your room rate.' },
    { title: 'Airport arrivals', body: 'Arrange transportation between the hotel and Syracuse Hancock International Airport. Do not assume an airport shuttle or extended parking is included; ask the hotel about your needs before booking.' },
  ],
  nearby: ['Syracuse University and the JMA Wireless Dome', 'Le Moyne College', 'Upstate Medical, Crouse and the Syracuse VA Medical Center', "St. Joseph's Hospital", 'Syracuse Hancock International Airport', 'Destiny USA and downtown Syracuse'],
  longContent: [
    { h2: 'Match the room to your party', body: roomNote },
    { h2: 'Build flexibility into your stay', body: 'Enter the dates and occupancy you actually need. Review the total price, payment rules and cancellation deadline for your selected room and rate. If several people are traveling together or your dates may change, contact our team before confirming.' },
    { h2: 'Working in the Syracuse area', body: 'For a project assignment, confirm the exact worksite with your employer. Our Micron crew page explains how to request an extended-stay quote; other local business guides are linked below. Corporate billing and room blocks require individual confirmation.' },
  ],
  faqs: [
    { q: 'Is Cicero Grand in downtown Syracuse?', a: 'No. We are in Cicero, NY, off I-81 Exit 98. Use current navigation to check travel to the exact destination for your visit.' },
    { q: 'Where can I plan a campus or hospital stay?', a: 'Use the related destination guides below, then confirm appointment, visitor and parking instructions with the institution you are visiting.' },
    { q: 'Is airport transportation included?', a: 'Do not assume transportation or extended parking is included. Contact the hotel to confirm your arrangements before arrival.' },
    { q: 'Can my whole party use one suite?', a: 'Check occupancy for the selected room in the booking engine and confirm bedding with the hotel. Sleeper availability must be confirmed rather than assumed.' },
    { q: 'Are pets welcome?', a: petNote },
  ],
  reviews: [],
});
delete visitor.comparison;
visitor.internalLinks = [
  { href: '/hotels-syracuse-ny', label: 'Hotel suites and amenities near Syracuse' },
  ...['syracuse-airport', 'jma-wireless-dome', 'syracuse-university', 'le-moyne', 'upstate-medical', 'crouse-hospital', 'st-josephs-hospital', 'va-medical-center'].map(k => ({href: pages[k].path, label: pages[k].h1})),
  { href: '/micron-crew-long-stay', label: 'Micron crew and extended stays' },
];
pages['syracuse-hotels'].h1 = 'All-suite hotel near Syracuse';
// Preserve the already-corrected property overview and link to the trip planner.
if (!pages['syracuse-hotels'].internalLinks.some((l: any) => l.href === visitor.path)) {
  pages['syracuse-hotels'].internalLinks.push({href: visitor.path, label: 'Plan a Syracuse campus, hospital or event visit'});
}
// Correct known room-feature errors and withdraw unapproved promotional claims.
// This changes public copy, not live inventory, rates or hotel policies.
const rateNote = 'Request a quote for your dates and room count. Rates, billing approval, minimum stays and cancellation terms must be confirmed by the hotel.';
for (const p of Object.values(pages) as any[]) {
  const risky = /EV charg|kitchenette|sleep(?:s|ing)? (?:4|four)|\$[0-9]|rates (?:that )?(?:don't|do not|hold|stay)|no minimum/i;
  p.reviews = (p.reviews || []).filter((r: any) => !risky.test(r.text));
  delete p.comparison;
  function clean(value: any, key = ''): any {
    if (Array.isArray(value)) return value.map(v => clean(v, key));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, k === 'reviews' ? v : clean(v, k)]));
    if (typeof value !== 'string' || ['path','href','q','h1','h2','label','title','ogImage'].includes(key)) return value;
    value = value.replace(/\(315\) 883-8288/g, '(315) 752-0150').replace(/hello@cicerogrand\.com/g, 'sales@cicerogrand.com');
    if (/\$(?:79|89|99)|no minimum|rates (?:that )?(?:don't|do not|hold|stay)/i.test(value)) return rateNote;
    if (/EV charg/i.test(value)) return 'Free hotel parking. Contact the hotel to confirm vehicle requirements and any charging arrangements before arrival.';
    if (/sleep(?:s|ing)? (?:4|four)|sofa bed|sleeper option/i.test(value)) return 'All-suite rooms with a microwave and mini-fridge. Confirm occupancy and bedding for your selected room before booking; sleeper availability must be confirmed with the hotel.';
    if (/kitchenette/i.test(value) && !/(?:no|not a) kitchenette|no\. suites|no\. every suite/i.test(value)) {
      return 'Suites have a microwave and mini-fridge, not a kitchenette or full kitchen. Check the room description and contact the hotel about your stay requirements.';
    }
    return value;
  }
  Object.assign(p, clean(p));
  // Search snippets should describe the stay, not advertise unverified rates or timed drives.
  if (!['/cicero-ny-hotels','/hotel-syracuse-ny','/hotels-syracuse-ny'].includes(p.path)) {
    const titles: Record<string,string> = {
      'syracuse-airport':'Syracuse Hancock Airport (SYR)', 'jma-wireless-dome':'JMA Wireless Dome',
      'upstate-medical':'Upstate Medical', 'syracuse-university':'Syracuse University',
      'crouse-hospital':'Crouse Hospital', 'st-josephs-hospital':"St. Joseph’s Hospital Syracuse",
      'va-medical-center':'Syracuse VA Medical Center', 'le-moyne':'Le Moyne College',
      'lockheed-martin':'Lockheed Martin Syracuse', 'srctec':'SRCTec / SRC',
      'rtx-raytheon':'RTX / Raytheon Syracuse', 'national-grid':'National Grid Syracuse',
      'turning-stone':'Turning Stone', 'destiny-usa':'Destiny USA', 'empower-amphitheater':'Empower Amphitheater',
      'nys-fair':'New York State Fair', 'micron':'Micron in Clay, NY',
      'clay-ny-hotels':'Clay, NY', 'liverpool-ny-hotels':'Liverpool, NY',
    };
    const slug = Object.keys(pages).find(k => pages[k] === p)!;
    if (titles[slug]) {
      p.title = `Hotel Near ${titles[slug]} | Cicero Grand`;
      p.description = `Visiting ${titles[slug]}? Stay at Cicero Grand in Cicero, NY, with all-suite rooms, free breakfast and parking. Check dates and direct availability.`;
    }
  }
}
const visitIntros: Record<string,string> = {
  'jma-wireless-dome': 'Make your Dome trip easier to plan from a hotel base in Cicero. Check the event start time, entrance and venue parking before choosing your departure time; allow extra time for game-day or concert traffic. After the event, return to an all-suite room with a microwave and mini-fridge. Hotel parking is included, but event parking and transportation are separate arrangements.',
  'upstate-medical': 'For a visit to Upstate Medical, confirm which building or campus you need before planning your route from Cicero. Bring your appointment or visitor instructions, and choose reservation terms that suit any uncertainty in your travel dates. Cicero Grand offers suites, free breakfast and hotel parking; our team can discuss room options for a companion or an extended visit.',
  'syracuse-university': 'Plan a Syracuse University visit around your campus schedule, not just your room dates. Confirm the building, tour meeting point or event entrance with the university, and review campus parking instructions before traveling from Cicero. Tell our team how many guests are coming so you can confirm suitable room occupancy and bedding before booking.',
  'crouse-hospital': 'If your trip includes Crouse Hospital, check the appointment location and current visitor arrangements directly with the hospital. Cicero Grand provides an all-suite base in Cicero for overnight or longer visits. If your departure date may change, review your selected rate’s cancellation conditions and ask our team about availability for additional nights.',
  'st-josephs-hospital': "Visiting St. Joseph's Hospital in Syracuse may mean an early appointment, a late return or changing plans. Confirm your destination and visitor instructions with the hospital, then plan your route from our Cicero address. Our 24-hour front desk can help with arrival questions, while a microwave and mini-fridge in the suite support a stay away from home.",
  'va-medical-center': 'For a Syracuse VA Medical Center visit, confirm your appointment building, arrival time and any companion arrangements with the medical center. Cicero Grand is in Cicero, so plan transportation to your appointment separately. Contact the hotel about room accessibility or an extended visit before booking; any special rate or eligibility requirement must be confirmed in your quote.',
  'le-moyne': 'Whether you are visiting Le Moyne College for a tour, family weekend or an athletic event, start with the campus itinerary. Confirm event times and parking with the college, then check room availability in Cicero for the nights you need. For families or teams, share your party size and room count rather than assuming one suite fits everyone.',
  'liverpool-ny-hotels': 'Visiting Liverpool for business, family or an event? Cicero Grand is in nearby Cicero, not in Liverpool village. Use the exact office, venue or meeting address to plan your daily route. Our suites include a microwave and mini-fridge, and our hotel team can discuss several-room or extended-stay requests for your schedule.',
  'lockheed-martin': 'For a Lockheed Martin visit in the Syracuse area, ask your host for the correct facility entrance, arrival time and visitor requirements. Cicero Grand offers an all-suite base in Cicero for overnight meetings or a longer assignment. Share your dates and room count with our team; any corporate billing arrangement must be approved before arrival.',
  'national-grid': 'Planning lodging for a National Grid assignment or utility work in the Syracuse area? Confirm the worksite, shift schedule and vehicle requirements with your coordinator before reserving rooms. Cicero Grand can review a room-block request in Cicero, including late-arrival plans and parking needs. Availability, billing and any change to the room count require hotel confirmation.',
  'rtx-raytheon': 'For RTX or Raytheon business in the Syracuse area, confirm the exact office or worksite with your host rather than relying on a company name alone. From a suite in Cicero, plan your commute around the appointment or shift. Send our team your arrival dates and expected project duration to discuss availability and quote-dependent billing terms.',
  'srctec': 'Visiting SRCTec or SRC for a meeting, vendor visit or project assignment? Confirm the facility address, entry instructions and schedule with your host. Cicero Grand offers suites in Cicero with free Wi-Fi, breakfast and hotel parking. For a team stay, ask about room counts and payment arrangements before confirming travel.',
  'turning-stone': 'For a Turning Stone show, event or visit, plan transportation between Verona and our hotel in Cicero before booking. Check your event’s timing and destination parking, especially for a late return. Cicero Grand offers all-suite rooms and free hotel parking; confirm the room occupancy that fits your party and review live rates for your dates.',
  'clay-ny-hotels': 'Working in Clay or visiting the Micron area? Cicero Grand is in nearby Cicero, with suites that include a microwave and mini-fridge. Confirm the worksite entrance and current route with your host. For a longer assignment, use our crew-stay inquiry to share your schedule and request written rates, availability and billing terms.',
  'destiny-usa': 'Plan a shopping or entertainment visit to Destiny USA from an all-suite hotel in Cicero. Check current store, restaurant and attraction hours before travel, and allow time for the route to and from the mall. Our suites include a microwave and mini-fridge; confirm bedding and occupancy for your party when you choose your room.',
};
for (const [slug, intro] of Object.entries(visitIntros)) pages[slug].intro = intro;
for (const p of Object.values(pages) as any[]) {
  p.highlights = [...new Set(p.highlights.map((v: string) => {
    if (v.startsWith('Suites have a microwave') || v.startsWith('All-suite rooms with a microwave')) return 'Suites with a microwave and mini-fridge; confirm occupancy';
    if (v.startsWith('Free hotel parking.')) return 'Free hotel parking; confirm oversized vehicle needs';
    return v;
  }))];
}
fs.writeFileSync(file, JSON.stringify(pages, null, 2) + '\n');
