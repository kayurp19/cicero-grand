const fs = require('node:fs');
const path = 'client/src/content/landing-pages.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const amenities = [
  'All-suite hotel in Cicero, NY',
  'Microwave and mini-fridge in every suite',
  'Free hot breakfast, parking and Wi-Fi',
  'Indoor pool and fitness center',
  'Pet-friendly stays; contact us for current pet policies',
  'Convenient access from I-81 Exit 98',
];
const links = [
  { title: 'Suites and rooms', path: '/rooms', description: 'Explore suite layouts and check availability.' },
  { title: 'Hotel amenities', path: '/amenities', description: 'Breakfast, indoor pool, fitness center and parking.' },
  { title: 'Contact Cicero Grand', path: '/contact', description: 'Ask about your dates, room needs and group stays.' },
];
const locationAnswer = 'The Cicero Grand is at 5875 Carmenica Drive, Cicero, NY 13039, off I-81 Exit 98. Use current navigation for your route and allow for traffic.';
Object.assign(data['syracuse-airport'], {
  title: 'Hotel Near Syracuse Hancock Airport (SYR) | Cicero Grand',
  description: 'Stay at Cicero Grand near Syracuse Hancock Airport. All-suite rooms in Cicero, NY, with free breakfast, parking and Wi-Fi. Check rates and book direct.',
  subtitle: 'All-suite stays in Cicero, NY, with easy I-81 access, free breakfast and free parking during your stay.',
  venue: { name: 'Syracuse Hancock International Airport (SYR)', address: '1000 Col. Eileen Collins Blvd, Syracuse, NY 13212', drive: 'Check current route', miles: 'Hotel: I-81 Exit 98' },
  highlights: amenities,
  intro: 'Traveling through Syracuse Hancock International Airport? Stay at The Cicero Grand in Cicero, NY, off I-81 Exit 98. Settle into a suite with a microwave and mini-fridge, enjoy free hot breakfast, and use free hotel parking during your stay. Check your flight schedule and arrange transportation before you travel.',
  why: [
    { title: 'Suites for your trip', body: 'Choose an all-suite hotel with a microwave, mini-fridge and space to settle in before or after your flight. View room details for the layout and occupancy that fit your party.' },
    { title: 'Breakfast included', body: 'Free hot breakfast is included. Contact the front desk for current breakfast hours when planning an early departure.' },
    { title: 'Plan your airport transfer', body: 'Arrange your airport transportation separately. Call (315) 752-0150 with questions before arrival; a complimentary shuttle is not promised with your reservation.' },
  ],
  nearby: ['Syracuse Hancock International Airport (SYR)', 'I-81 Exit 98', 'Downtown Syracuse', 'Destiny USA', 'Micron project site in Clay, NY'],
  faqs: [
    { q: 'Where is the hotel located?', a: locationAnswer },
    { q: 'Is airport transportation included?', a: 'Please arrange airport transportation separately. Contact the front desk at (315) 752-0150 for questions before booking; do not assume a complimentary airport shuttle is included.' },
    { q: 'Can I leave my car while I fly?', a: 'Parking is free during your hotel stay. Contact the front desk before booking if you need parking beyond your stay; extended parking is subject to confirmation and is not included as a published park-and-fly package.' },
    { q: 'Is breakfast included?', a: 'Yes, free hot breakfast is included. Ask the front desk about current serving hours before an early flight.' },
    { q: 'Do the suites have kitchenettes?', a: 'No. Suites have a microwave and mini-fridge, not a kitchenette or full kitchen.' },
  ],
  internalLinks: links,
  reviews: [],
});
Object.assign(data.micron, {
  title: 'Hotel Near Micron in Clay NY | Cicero Grand',
  description: 'Ask about Micron crew and extended-stay lodging at Cicero Grand in Cicero, NY. Suites with a microwave and mini-fridge, free breakfast, parking and Wi-Fi.',
  subtitle: 'All-suite lodging for Micron project crews, contractors, vendors and visiting professionals near Clay, NY.',
  venue: { name: 'Micron project site', address: 'Clay, NY', drive: 'Check current route', miles: 'Hotel: I-81 Exit 98' },
  highlights: [...amenities.slice(0, 3), 'Ask about weekly, monthly and crew rates', 'Request a quote for your dates and room count', 'I-81 Exit 98 in Cicero, NY'],
  intro: 'Working on or visiting the Micron project in Clay, NY? The Cicero Grand offers 65 suites in nearby Cicero, off I-81 Exit 98. Each suite has a microwave and mini-fridge. Free hot breakfast, parking and Wi-Fi help make project stays practical. Tell our sales team your dates, number of rooms and expected length of stay for a tailored quote.',
  why: [
    { title: 'Micron project lodging', body: 'A Cicero base for contractors, vendors, engineers and visiting project teams. Confirm your site entrance and current travel route before departure.' },
    { title: 'Comfort for longer stays', body: 'Suites include a microwave and mini-fridge, with free hot breakfast, Wi-Fi and parking. There is no kitchenette or full kitchen.' },
    { title: 'Request a crew quote', body: 'Call sales at (315) 715-7410 to discuss weekly or monthly stays, room counts and availability. Any billing arrangements and rate terms are confirmed with your quote.' },
  ],
  nearby: ['Micron project site in Clay, NY', 'I-81 Exit 98', 'Syracuse Hancock International Airport', 'Cicero shopping and dining'],
  faqs: [
    { q: 'Where can Micron crews stay near Clay, NY?', a: locationAnswer + ' Contact sales at (315) 715-7410 about project lodging.' },
    { q: 'Do you offer weekly or monthly stays?', a: 'Ask our sales team about weekly and monthly options for your dates and room count. Rates, availability and terms are confirmed in your quote.' },
    { q: 'Do suites have a kitchen?', a: 'No. Every suite has a microwave and mini-fridge, not a kitchenette, cooking range or full-size refrigerator.' },
    { q: 'Can we arrange parking for work vehicles?', a: 'Hotel parking is free. Tell sales about any trucks, trailers or oversized vehicles so the team can confirm parking arrangements before arrival.' },
    { q: 'Can I request corporate billing?', a: 'Discuss billing requirements with sales before booking. Any approved billing arrangements must be confirmed in writing.' },
    { q: 'How many rooms does the hotel have?', a: 'Cicero Grand has 65 suites. Crew availability depends on your dates; call (315) 715-7410 for a quote.' },
  ],
  internalLinks: links,
  reviews: [],
});
// Correct the existing general hotel ad destination as well.
const general = data['syracuse-hotels'];
general.subtitle = 'All-suite stays in Cicero, NY, with access to Syracuse, Micron in Clay and Syracuse Hancock Airport.';
general.highlights = amenities;
general.intro = 'Looking for a hotel near Syracuse, NY? The Cicero Grand is a 65-suite hotel in Cicero, off I-81 Exit 98. Suites include a microwave and mini-fridge, with free hot breakfast, parking and Wi-Fi. Choose a stay for business travel, family visits, Micron project work or an event at our on-site event center.';
general.why = [
  { title: 'All-suite stays', body: 'Explore our room layouts and choose the suite that fits your party. Every suite has a microwave and mini-fridge, not a kitchenette.' },
  { title: 'A Cicero base for Central New York', body: 'Use I-81 to reach Syracuse-area destinations. Check current navigation for your airport, worksite or event route.' },
  { title: 'Breakfast and parking included', body: 'Enjoy free hot breakfast, hotel parking and Wi-Fi during your stay. Ask the front desk about breakfast hours or special parking needs.' },
  { title: 'More ways to unwind', body: 'Enjoy the indoor pool and fitness center. Contact the hotel for current hours and pet policies.' },
];
general.faqs = [
  { q: 'Where is Cicero Grand?', a: locationAnswer },
  { q: 'What is included with my stay?', a: 'Free hot breakfast, parking and Wi-Fi, with access to our indoor pool and fitness center. Check your selected rate for its full terms.' },
  { q: 'Do you offer extended stays for Micron contractors?', a: 'Yes. Contact sales at (315) 715-7410 about weekly or monthly options, crew room counts and current availability.' },
  { q: 'Do the suites have kitchenettes?', a: 'No. Suites include a microwave and mini-fridge, not a kitchenette or full kitchen.' },
  { q: 'Are pets welcome?', a: 'Cicero Grand is pet-friendly. Contact the hotel before booking to confirm current fees, restrictions and availability.' },
];
general.nearby = ['Syracuse Hancock International Airport', 'Micron project site in Clay, NY', 'Downtown Syracuse', 'Destiny USA', 'Syracuse University and JMA Wireless Dome', 'NYS Fairgrounds'];
general.internalLinks = [
  ...links,
  { title: 'Hotel near Micron', path: '/hotels-near-micron', description: 'Crew and extended-stay lodging near Clay, NY.' },
  { title: 'Hotel near Syracuse Airport', path: '/hotels-near-syracuse-airport', description: 'Plan your stay before or after a flight.' },
];
general.reviews = [];
// Avoid retaining extra long-form sections or comparison promises on paid destinations.
for (const key of ['syracuse-airport', 'micron', 'syracuse-hotels']) {
  const allowed = new Set(['path','title','description','h1','subtitle','venue','ogImage','highlights','intro','why','nearby','faqs','internalLinks','reviews']);
  for (const field of Object.keys(data[key])) if (!allowed.has(field)) delete data[key][field];
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
