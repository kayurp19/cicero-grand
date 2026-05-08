import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, Save, Check, AlertCircle, Eye } from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/lib/queryClient";
import { fetchContent, seeds, clearContentCache } from "@/lib/content";

import { SiteForm } from "./forms/SiteForm";
import { RoomsForm } from "./forms/RoomsForm";
import { OffersForm } from "./forms/OffersForm";
import { GalleryForm } from "./forms/GalleryForm";
import { AmenitiesForm } from "./forms/AmenitiesForm";
import { AreaForm } from "./forms/AreaForm";
import { EventsForm } from "./forms/EventsForm";
import { WeddingsForm } from "./forms/WeddingsForm";

const TITLES: Record<string, string> = {
  site: "Site & contact info",
  rooms: "Suites",
  amenities: "Amenities",
  area: "The area",
  offers: "Offers",
  events: "Events",
  weddings: "Weddings",
  gallery: "Photo gallery",
};

function FormFor({
  sectionKey,
  value,
  onChange,
}: {
  sectionKey: string;
  value: any;
  onChange: (v: any) => void;
}) {
  switch (sectionKey) {
    case "site":
      return <SiteForm value={value} onChange={onChange} />;
    case "rooms":
      return <RoomsForm value={value} onChange={onChange} />;
    case "offers":
      return <OffersForm value={value} onChange={onChange} />;
    case "gallery":
      return <GalleryForm value={value} onChange={onChange} />;
    case "amenities":
      return <AmenitiesForm value={value} onChange={onChange} />;
    case "area":
      return <AreaForm value={value} onChange={onChange} />;
    case "events":
      return <EventsForm value={value} onChange={onChange} />;
    case "weddings":
      return <WeddingsForm value={value} onChange={onChange} />;
    default:
      return <div>Unknown section.</div>;
  }
}

export default function AdminEditor() {
  const [, params] = useRoute("/admin/edit/:key");
  const [, setLocation] = useLocation();
  const sectionKey = params?.key || "";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  const valid = useMemo(() => Object.prototype.hasOwnProperty.call(seeds, sectionKey), [sectionKey]);

  // Auth check + initial load
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await fetch("/api/admin/me").then((r) => r.json());
        if (!me.authenticated) {
          setLocation("/admin");
          return;
        }
        if (!valid) {
          setLoading(false);
          return;
        }
        const seed = seeds[sectionKey];
        const live = await fetchContent(sectionKey, true);
        if (active) {
          // Deep clone to avoid mutating cached value
          setData(JSON.parse(JSON.stringify(live ?? seed)));
          setLoading(false);
        }
      } catch {
        setLocation("/admin");
      }
    })();
    return () => {
      active = false;
    };
  }, [sectionKey, setLocation, valid]);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      clearContentCache(sectionKey);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3500);
    } catch (e: any) {
      setError(e?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetToSeed() {
    if (!confirm("Reset this section to the original content? Your unsaved edits will be lost.")) return;
    setData(JSON.parse(JSON.stringify(seeds[sectionKey])));
  }

  if (!valid) {
    return (
      <div className="min-h-screen grid place-items-center px-5 text-center">
        <div>
          <h1 className="font-display text-3xl mb-3">Section not found</h1>
          <Link href="/admin/dashboard" className="text-primary underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading || data === null) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">Loading…</div>
    );
  }

  const previewHref =
    sectionKey === "site"
      ? "/"
      : sectionKey === "weddings" || sectionKey === "events"
      ? `/#/${sectionKey}`
      : `/#/${sectionKey === "area" ? "area" : sectionKey}`;

  return (
    <div className="min-h-screen bg-background grain pb-32">
      <header className="border-b border-border bg-background/85 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            <Logo />
            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
              data-testid="link-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm hover:bg-muted"
              data-testid="link-preview"
            >
              <Eye className="w-4 h-4" /> Preview
            </a>
            <button
              onClick={save}
              disabled={saving}
              data-testid="button-save"
              className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : savedAt ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save changes</>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-5 lg:px-10 pt-12 lg:pt-16">
        <Link
          href="/admin/dashboard"
          className="md:hidden inline-flex items-center gap-2 text-sm opacity-70 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Editing</span>
          <h1
            className="font-display text-[clamp(2.2rem,5vw,3.6rem)] tracking-[-0.02em] mt-2"
            data-testid="editor-title"
          >
            {TITLES[sectionKey]}
          </h1>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <div className="bg-card border border-card-border rounded-2xl p-6 lg:p-10">
          <FormFor sectionKey={sectionKey} value={data} onChange={setData} />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={resetToSeed}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            data-testid="button-reset"
          >
            Reset to original
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
            data-testid="button-save-bottom"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
