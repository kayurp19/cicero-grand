import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  Building2,
  BedDouble,
  Sparkles,
  MapPin,
  Tag,
  CalendarHeart,
  GlassWater,
  Images,
  Inbox,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/lib/queryClient";

type Section = {
  key: string;
  href: string;
  label: string;
  icon: typeof Building2;
  desc: string;
  highlight?: boolean;
};

const SECTIONS: Section[] = [
  { key: "submissions", href: "/admin/submissions", label: "Form submissions", icon: Inbox, desc: "Inquiries from the website Contact form", highlight: true },
  { key: "site", href: "/admin/edit/site", label: "Site & contact info", icon: Building2, desc: "Phones, address, taglines, social" },
  { key: "rooms", href: "/admin/edit/rooms", label: "Suites", icon: BedDouble, desc: "Room types, photos, features" },
  { key: "amenities", href: "/admin/edit/amenities", label: "Amenities", icon: Sparkles, desc: "What's included for guests" },
  { key: "area", href: "/admin/edit/area", label: "The area", icon: MapPin, desc: "Nearby points of interest" },
  { key: "offers", href: "/admin/edit/offers", label: "Offers", icon: Tag, desc: "Special rates and packages" },
  { key: "events", href: "/admin/edit/events", label: "Events", icon: GlassWater, desc: "Meeting & gathering spaces" },
  { key: "weddings", href: "/admin/edit/weddings", label: "Weddings", icon: CalendarHeart, desc: "Wedding content & testimonials" },
  { key: "gallery", href: "/admin/edit/gallery", label: "Photo gallery", icon: Images, desc: "Hotel photos" },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) setLocation("/admin");
        else setChecking(false);
      })
      .catch(() => setLocation("/admin"));
  }, [setLocation]);

  async function logout() {
    try {
      await apiRequest("POST", "/api/admin/logout");
    } catch {}
    setLocation("/admin");
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grain">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between">
          <Logo variant="dark" />
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
              data-testid="link-view-site"
            >
              View site <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm hover:bg-muted transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
            <span className="w-8 h-px bg-current" /> Owner dashboard
          </span>
          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4rem)] tracking-[-0.02em] leading-[0.95]">
            Edit your website <em className="italic font-light">in plain English.</em>
          </h1>
          <p className="mt-5 text-base lg:text-lg text-muted-foreground max-w-2xl">
            Pick a section to update. Changes go live immediately on cicerogrand.com — no developer required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.key}
                href={s.href}
                data-testid={`card-edit-${s.key}`}
                className={`group relative bg-card border rounded-2xl p-7 hover:shadow-md transition-all ${
                  s.highlight
                    ? "border-primary/40 hover:border-primary md:col-span-2"
                    : "border-card-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl tracking-[-0.01em]">{s.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 p-7 rounded-2xl bg-foreground text-background">
          <h2 className="font-display text-2xl mb-2">Prefer to edit in GitHub?</h2>
          <p className="text-background/75 text-sm max-w-2xl">
            All content is also stored as JSON files in <code className="px-1.5 py-0.5 rounded bg-background/15">client/src/content/</code>.
            Edit them in GitHub and Railway will redeploy automatically. The admin panel takes precedence when both are set.
          </p>
        </div>
      </main>
    </div>
  );
}
