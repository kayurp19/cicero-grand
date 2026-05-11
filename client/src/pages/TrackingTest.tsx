/**
 * /tracking-test — internal debug page for verifying GTM, GA4, and Google
 * Ads conversion tracking are wired correctly. Not linked from any nav, but
 * accessible by typing the URL directly. Safe to leave in production.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  trackBookNow,
  trackPhoneClick,
  trackContactSubmit,
  trackPageView,
  trackEvent,
} from "../lib/tracking";
import { TRACKING, isTrackingEnabled } from "../lib/tracking-config";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function TrackingTest() {
  const [events, setEvents] = useState<any[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    document.title = "Tracking Test · The Cicero Grand";
    const refresh = () => {
      const dl = window.dataLayer || [];
      setEvents([...dl].slice(-30).reverse());
    };
    refresh();
    const id = window.setInterval(refresh, 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  const enabled = isTrackingEnabled();

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-5 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
        <h1 className="font-display text-4xl lg:text-5xl mt-6 mb-2">Tracking Test</h1>
        <p className="text-muted-foreground mb-10">
          Internal debug page. Use to verify GTM, GA4, and Google Ads conversion events fire correctly. Not linked from public nav.
        </p>

        {/* Config snapshot */}
        <section className="mb-12 p-6 rounded-2xl border border-card-border bg-card">
          <h2 className="font-display text-2xl mb-4">Configuration</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <ConfigRow label="Tracking enabled" value={enabled ? "Yes" : "No — IDs not yet pasted into TRACKING config"} ok={enabled} />
            <ConfigRow label="GTM container ID" value={TRACKING.GTM_CONTAINER_ID || "(empty)"} ok={!!TRACKING.GTM_CONTAINER_ID} />
            <ConfigRow label="GA4 measurement ID" value={TRACKING.GA4_MEASUREMENT_ID || "(empty)"} ok={!!TRACKING.GA4_MEASUREMENT_ID} />
            <ConfigRow label="Google Ads conversion ID" value={TRACKING.GADS_CONVERSION_ID || "(empty)"} ok={!!TRACKING.GADS_CONVERSION_ID} />
          </dl>
          {!enabled && (
            <p className="mt-6 text-xs text-muted-foreground">
              To enable tracking: edit <code className="bg-background/40 px-1 py-0.5 rounded">client/src/lib/tracking-config.ts</code> and paste the IDs from your GTM, GA4, and Google Ads dashboards.
            </p>
          )}
        </section>

        {/* Test actions */}
        <section className="mb-12">
          <h2 className="font-display text-2xl mb-4">Fire test events</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Each button pushes a corresponding event into the dataLayer. If GTM is configured and tags are published, you should see these forward to GA4 (Realtime) and Google Ads (Conversions diagnostic).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TestButton
              label="Fire begin_checkout (Book Now)"
              onClick={() => {
                trackBookNow({ source: "tracking_test_page" });
                setTick((t) => t + 1);
              }}
            />
            <TestButton
              label="Fire generate_lead (Phone click)"
              onClick={() => {
                trackPhoneClick({ source: "tracking_test_page" });
                setTick((t) => t + 1);
              }}
            />
            <TestButton
              label="Fire generate_lead (Contact submit)"
              onClick={() => {
                trackContactSubmit({ topic: "Test topic", source: "tracking_test_page" });
                setTick((t) => t + 1);
              }}
            />
            <TestButton
              label="Fire page_view (manual)"
              onClick={() => {
                trackPageView("/tracking-test", document.title);
                setTick((t) => t + 1);
              }}
            />
            <TestButton
              label="Fire custom event (test_custom)"
              onClick={() => {
                trackEvent("test_custom", { source: "tracking_test_page", custom_param: "abc" });
                setTick((t) => t + 1);
              }}
            />
            <a
              href="tel:+13157520150"
              className="rounded-xl border border-card-border bg-card hover:bg-card/70 px-5 py-4 text-sm font-medium text-center"
              data-booking-source="tracking_test_page"
              data-testid="test-tel"
            >
              Click tel:+13157520150 (real link — should auto-fire)
            </a>
            <a
              href="https://us2.cloudbeds.com/reservation/Uw3WC6"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-card-border bg-card hover:bg-card/70 px-5 py-4 text-sm font-medium text-center"
              data-booking-source="tracking_test_page"
              data-testid="test-bookingurl"
            >
              Click real Book Now link (should auto-fire begin_checkout)
            </a>
          </div>
        </section>

        {/* dataLayer view */}
        <section>
          <h2 className="font-display text-2xl mb-4">dataLayer (most recent 30)</h2>
          <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
            {events.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No events yet. Click a test button above.</p>
            ) : (
              <ul className="divide-y divide-card-border">
                {events.map((e, i) => (
                  <li key={i} className="p-4">
                    <code className="text-xs whitespace-pre-wrap break-all">{safeJson(e)}</code>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ConfigRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={ok ? "text-foreground font-medium" : "text-amber-500"}>{value}</dd>
    </>
  );
}

function TestButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-card-border bg-card hover:bg-card/70 px-5 py-4 text-sm font-medium text-left"
    >
      {label}
    </button>
  );
}

function safeJson(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}
