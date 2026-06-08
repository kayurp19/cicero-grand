import { useState } from 'react';
import { useSeo } from '../hooks/useSeo';
import { ChevronDown, Phone, AlertTriangle, Wifi, Waves, BedDouble, Coffee, Cigarette, Dog, Dumbbell, Users, ShieldAlert, Sparkles } from 'lucide-react';

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  priority?: boolean;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: 'wifi',
    title: 'Wi-Fi',
    icon: <Wifi className="w-5 h-5" />,
    priority: true,
    body: (
      <div className="space-y-2">
        <div>Network: <span className="font-semibold">CiceroGrand-Guest</span></div>
        <div>No password required — connect and accept the splash page.</div>
        <div className="pt-1">Need help connecting? Call WiFi support at <a className="underline font-semibold" href="tel:18888122591">1-888-812-2591</a>.</div>
      </div>
    ),
  },
  {
    id: 'breakfast',
    title: 'Breakfast Hours',
    icon: <Coffee className="w-5 h-5" />,
    priority: true,
    body: (
      <ul className="space-y-1.5">
        <li><span className="font-semibold">Mon – Fri:</span> 6:00 AM – 9:00 AM</li>
        <li><span className="font-semibold">Sat – Sun:</span> 7:00 AM – 10:00 AM</li>
        <li><span className="font-semibold">Grab-and-go bags:</span> 4:00 AM – 6:00 AM daily</li>
      </ul>
    ),
  },
  {
    id: 'checkout',
    title: 'Check-Out & Housekeeping',
    icon: <BedDouble className="w-5 h-5" />,
    priority: true,
    body: (
      <ul className="space-y-2">
        <li><span className="font-semibold">Check-out:</span> 11:00 AM daily.</li>
        <li>If you do not want your room cleaned, please notify the front desk by <span className="font-semibold">9:00 AM</span>.</li>
        <li>Need fresh towels, linens, or amenities? Just dial <span className="font-semibold">0</span> from your room phone.</li>
      </ul>
    ),
  },
  {
    id: 'occupancy',
    title: 'Room Occupancy Limits',
    icon: <Users className="w-5 h-5" />,
    body: (
      <ul className="space-y-1.5">
        <li><span className="font-semibold">King Suites:</span> max 4 guests</li>
        <li><span className="font-semibold">Queen Suites:</span> max 5 guests</li>
        <li><span className="font-semibold">King Jacuzzi:</span> max 2 guests</li>
        <li className="pt-1 text-sm opacity-80">Limits are set by our occupancy permit and cannot be exceeded.</li>
      </ul>
    ),
  },
  {
    id: 'quiet-hours',
    title: 'Quiet Hours & No-Party Policy',
    icon: <ShieldAlert className="w-5 h-5" />,
    body: (
      <ul className="space-y-2">
        <li><span className="font-semibold">Sun – Fri:</span> Quiet time begins 9:00 PM</li>
        <li><span className="font-semibold">Saturday:</span> Quiet time begins 10:00 PM</li>
        <li>Activity must stay inside registered rooms past quiet time and non-registered visitors must depart.</li>
        <li>Only registered guests may enter the building past quiet time.</li>
        <li className="pt-1 text-sm opacity-80">No-party policy in effect to protect the comfort of other guests.</li>
      </ul>
    ),
  },
  {
    id: 'smoke-free',
    title: '100% Smoke-Free Policy',
    icon: <Cigarette className="w-5 h-5" />,
    body: (
      <div className="space-y-2">
        <div>The Cicero Grand is 100% smoke-free — including rooms, balconies, and all indoor common areas.</div>
        <div>This includes: cigarettes, cigars, vapes, e-cigarettes, marijuana, <span className="font-semibold">incense, and candles</span>.</div>
        <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm">
          <span className="font-semibold">$250 cleaning fee</span> charged to your card for any violation.
        </div>
      </div>
    ),
  },
  {
    id: 'pets',
    title: 'Pet Policy',
    icon: <Dog className="w-5 h-5" />,
    body: (
      <div>
        Pets are welcome for an additional fee. Please see the front desk to register your pet on arrival.
      </div>
    ),
  },
  {
    id: 'pool',
    title: 'Indoor Pool Hours & Rules',
    icon: <Waves className="w-5 h-5" />,
    body: (
      <div className="space-y-3">
        <div><span className="font-semibold">Hours:</span> 7:00 AM – 10:00 PM daily</div>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>Pool is for registered guests only.</li>
          <li>Maximum <span className="font-semibold">20 guests</span> in the pool area (including chairs).</li>
          <li>No food or drinks in the pool area.</li>
          <li>Never swim alone. At least <span className="font-semibold">2 adults (18+)</span> must be present whenever the pool is in use; at least one on the pool deck.</li>
          <li>Children under 16 must be accompanied by a parent, guardian, or responsible adult.</li>
          <li>No alcohol — do not drink and swim.</li>
          <li>If you are sick or have been exposed to a communicable illness, please do not enter.</li>
          <li>Pool towels stay in the pool area — place used towels in the bin before leaving.</li>
          <li>Follow all posted pool guidelines.</li>
        </ul>
        <div className="text-sm opacity-80 pt-1">In an emergency, use the free telephone in the pool area. Emergency numbers are posted on the wall.</div>
      </div>
    ),
  },
  {
    id: 'fitness',
    title: 'Fitness Center',
    icon: <Dumbbell className="w-5 h-5" />,
    body: (
      <div className="space-y-2">
        <div><span className="font-semibold">Hours:</span> Open 24 hours.</div>
        <div>Please use the sanitation stations after each use.</div>
      </div>
    ),
  },
  {
    id: 'alcohol-drugs',
    title: 'Alcohol & Drug Policy',
    icon: <ShieldAlert className="w-5 h-5" />,
    body: (
      <ul className="space-y-2">
        <li>Alcohol consumption by anyone under 21 is not permitted anywhere on property.</li>
        <li>Adults must keep alcoholic beverages inside their registered rooms and comply with NY State law.</li>
        <li>The Cicero Grand is a <span className="font-semibold">drug-free</span> environment.</li>
      </ul>
    ),
  },
  {
    id: 'safety',
    title: 'Property Safety',
    icon: <AlertTriangle className="w-5 h-5" />,
    body: (
      <ul className="space-y-2">
        <li>No sports/play equipment or weapons inside the hotel or on property (sticks, bats, balls, firearms, etc.).</li>
        <li>Ball or sport play is not permitted inside the building.</li>
        <li>Please locate the nearest exit, fire pull station, and extinguisher to your room.</li>
      </ul>
    ),
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    icon: <Phone className="w-5 h-5" />,
    body: (
      <div className="space-y-2">
        <div>In an emergency, dial <span className="font-semibold">9-1-1</span> first.</div>
        <div>Then reach the front desk:</div>
        <ul className="space-y-1 list-disc pl-5">
          <li>From your room phone: dial <span className="font-semibold">0</span></li>
          <li>From a cell phone: <a className="underline font-semibold" href="tel:13157520150">(315) 752-0150</a></li>
        </ul>
      </div>
    ),
  },
  {
    id: 'house-rules-other',
    title: 'Other House Policies',
    icon: <Sparkles className="w-5 h-5" />,
    body: (
      <div className="space-y-2 text-sm leading-relaxed">
        <div>This property is privately owned. Management reserves the right to refuse service and/or to evict persons in violation of stated policies.</div>
        <div>The Cicero Grand is not responsible for any accident, injury, or loss of personal valuables during your stay. <span className="font-semibold">No refunds.</span></div>
      </div>
    ),
  },
];

export default function Guest() {
  useSeo({
    title: 'Guest Directory · The Cicero Grand',
    description: 'In-room guest directory for The Cicero Grand — Wi-Fi, hours, pool rules, policies, and front desk help.',
    canonicalPath: '/guest',
    noindex: true,
  });

  const [openId, setOpenId] = useState<string | null>(SECTIONS[0].id);

  return (
    <div className="bg-[#F7F6F2] min-h-screen">
      {/* Hero */}
      <section className="bg-[#0c1c38] text-white">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
          <div className="text-xs uppercase tracking-[0.2em] text-[#d4af5f] mb-2">The Cicero Grand</div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">Welcome to your stay</h1>
          <p className="mt-3 text-white/85 leading-relaxed">
            Everything you need during your visit — Wi-Fi, breakfast hours, pool rules, policies, and front desk help — all in one place.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <a
              href="tel:13157520150"
              className="flex items-center justify-center gap-2 bg-[#d4af5f] text-[#0c1c38] font-semibold py-3 px-4 rounded-lg"
              data-testid="link-front-desk"
            >
              <Phone className="w-4 h-4" /> Call Front Desk
            </a>
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold py-3 px-4 rounded-lg"
              data-testid="link-emergency"
            >
              <AlertTriangle className="w-4 h-4" /> Emergency · 911
            </a>
          </div>
          <div className="mt-4 text-xs text-white/65">Tap any section below to expand. Most-asked questions are at the top.</div>
        </div>
      </section>

      {/* Accordion sections */}
      <section className="max-w-3xl mx-auto px-5 lg:px-8 py-8 space-y-2">
        {SECTIONS.map((s) => {
          const open = openId === s.id;
          return (
            <div
              key={s.id}
              className="bg-white border border-[#E4E1D9] rounded-xl overflow-hidden"
              data-testid={`section-${s.id}`}
            >
              <button
                onClick={() => setOpenId(open ? null : s.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
                aria-expanded={open}
                data-testid={`button-toggle-${s.id}`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[#0c1c38]">{s.icon}</span>
                  <span className="font-semibold text-[#0c1c38]">{s.title}</span>
                  {s.priority && (
                    <span className="text-[10px] uppercase tracking-wider bg-[#d4af5f]/15 text-[#7a6224] font-semibold px-2 py-0.5 rounded-full">
                      Top
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#0c1c38] transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <div className="px-4 pb-5 pt-1 text-[#28251D] leading-relaxed border-t border-[#F0EEE7]">
                  <div className="pt-3">{s.body}</div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Front desk footer card */}
      <section className="max-w-3xl mx-auto px-5 lg:px-8 pb-12">
        <div className="bg-[#0c1c38] text-white rounded-2xl p-6 text-center">
          <div className="text-sm uppercase tracking-[0.2em] text-[#d4af5f] mb-2">24/7 Front Desk</div>
          <div className="text-lg font-semibold">Need anything? Just dial 0 from your room phone.</div>
          <div className="mt-1 text-white/80">From a cell, call <a className="underline" href="tel:13157520150">(315) 752-0150</a>.</div>
          <div className="mt-4 text-xs text-white/60">
            Thank you for choosing The Cicero Grand · 5875 Carmenica Drive · Cicero, NY 13039 · Off I-81 Exit 98
          </div>
        </div>
      </section>
    </div>
  );
}
