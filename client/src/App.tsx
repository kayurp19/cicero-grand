import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyBookBar } from "@/components/StickyBookBar";
import { CookieConsent } from "@/components/CookieConsent";
import { RateBanner } from "@/components/RateBanner";
import { Canonical } from "@/components/Canonical";
import { EmailCapturePopup } from "@/components/EmailCapturePopup";

import Home from "@/pages/Home";
const Rooms = lazy(() => import("@/pages/Rooms"));
const Amenities = lazy(() => import("@/pages/Amenities"));
const Area = lazy(() => import("@/pages/Area"));
const EventCenter = lazy(() => import("@/pages/EventCenter"));
const CorporateMeetings = lazy(() => import("@/pages/event-center/CorporateMeetings"));
const SocialEvents = lazy(() => import("@/pages/event-center/SocialEvents"));
const Weddings = lazy(() => import("@/pages/event-center/Weddings"));
const Offers = lazy(() => import("@/pages/Offers"));
const DirectPerks = lazy(() => import("@/pages/DirectPerks"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Corporate = lazy(() => import("@/pages/Corporate"));
const Packages = lazy(() => import("@/pages/Packages"));
const Menus = lazy(() => import("@/pages/Menus"));
const MicronCrewLongStay = lazy(() => import("@/pages/MicronCrewLongStay"));
const TrackingTest = lazy(() => import("@/pages/TrackingTest"));
const Guest = lazy(() => import("@/pages/Guest"));
const NotFound = lazy(() => import("@/pages/not-found"));

const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminEditor = lazy(() => import("@/pages/admin/Editor"));
const AdminSubmissions = lazy(() => import("@/pages/admin/Submissions"));
const AdminEmailLeads = lazy(() => import("@/pages/admin/EmailLeads"));
import { initTracking, trackPageView, installGlobalClickTracking } from "@/lib/tracking";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

/**
 * Boots GTM once, then fires a virtual page_view event into the dataLayer
 * every time the wouter route changes. Safe to mount before tracking IDs
 * are pasted into TRACKING config — it short-circuits silently.
 */
function TrackingProvider() {
  const [location] = useLocation();
  useEffect(() => {
    initTracking();
    installGlobalClickTracking();
  }, []);
  useEffect(() => {
    // Defer one tick so the document.title from useSeo lands before the
    // pageview event captures it.
    const id = window.setTimeout(() => {
      trackPageView(location, document.title);
    }, 0);
    return () => window.clearTimeout(id);
  }, [location]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RateBanner />
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyBookBar />
      <CookieConsent />
      <EmailCapturePopup />
    </>
  );
}

function AppRouter() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/submissions" component={AdminSubmissions} />
        <Route path="/admin/email-leads" component={AdminEmailLeads} />
        <Route path="/admin/edit/:key" component={AdminEditor} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/amenities" component={Amenities} />
        <Route path="/area" component={Area} />
        <Route path="/area-guide" component={Area} />
        <Route path="/event-center" component={EventCenter} />
        <Route path="/event-center/corporate-meetings" component={CorporateMeetings} />
        <Route path="/event-center/social-events" component={SocialEvents} />
        <Route path="/event-center/weddings" component={Weddings} />
        <Route path="/event-center/menus" component={Menus} />
        {/* Legacy URL fallbacks — Express handles 301 in prod, these handle SPA dev navigation */}
        <Route path="/events" component={EventCenter} />
        <Route path="/weddings" component={Weddings} />
        <Route path="/offers" component={Offers} />
        <Route path="/direct-perks" component={DirectPerks} />
        <Route path="/book-direct" component={DirectPerks} />
        <Route path="/packages" component={Packages} />
        <Route path="/menus" component={Menus} />
        <Route path="/menu" component={Menus} />
        <Route path="/catering" component={Menus} />
        <Route path="/catering-menus" component={Menus} />
        <Route path="/micron-crew-long-stay" component={MicronCrewLongStay} />
        <Route path="/micron-long-stay" component={MicronCrewLongStay} />
        <Route path="/tracking-test" component={TrackingTest} />
        {/* QR-only guest directory — intentionally NOT in nav or sitemap */}
        <Route path="/guest" component={Guest} />
        <Route path="/guest-directory" component={Guest} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/hotels-near-destiny-usa">
          {() => <LandingPage slug="destiny-usa" />}
        </Route>
        <Route path="/hotels-near-syracuse-airport">
          {() => <LandingPage slug="syracuse-airport" />}
        </Route>
        <Route path="/hotels-near-jma-wireless-dome">
          {() => <LandingPage slug="jma-wireless-dome" />}
        </Route>
        <Route path="/hotels-near-micron">
          {() => <LandingPage slug="micron" />}
        </Route>
        <Route path="/hotels-near-turning-stone">
          {() => <LandingPage slug="turning-stone" />}
        </Route>
        <Route path="/hotels-near-empower-amphitheater">
          {() => <LandingPage slug="empower-amphitheater" />}
        </Route>
        <Route path="/hotels-near-upstate-medical">
          {() => <LandingPage slug="upstate-medical" />}
        </Route>
        <Route path="/hotels-near-nys-fair">
          {() => <LandingPage slug="nys-fair" />}
        </Route>
        <Route path="/hotels-syracuse-ny">
          {() => <LandingPage slug="syracuse-hotels" />}
        </Route>
        <Route path="/cicero-ny-hotels">
          {() => <LandingPage slug="cicero-ny-hotels" />}
        </Route>
        <Route path="/pet-friendly-hotels-syracuse">
          {() => <LandingPage slug="pet-friendly-syracuse" />}
        </Route>
        <Route path="/hotels-clay-ny">
          {() => <LandingPage slug="clay-ny-hotels" />}
        </Route>
        <Route path="/hotel-syracuse-ny">
          {() => <LandingPage slug="syracuse-hotel" />}
        </Route>
        <Route path="/hotels-liverpool-ny">
          {() => <LandingPage slug="liverpool-ny-hotels" />}
        </Route>
        <Route path="/hotels-near-lockheed-martin-syracuse">
          {() => <LandingPage slug="lockheed-martin" />}
        </Route>
        <Route path="/hotels-near-syracuse-university">
          {() => <LandingPage slug="syracuse-university" />}
        </Route>
        <Route path="/hotels-near-crouse-hospital">
          {() => <LandingPage slug="crouse-hospital" />}
        </Route>
        <Route path="/hotels-near-st-josephs-hospital-syracuse">
          {() => <LandingPage slug="st-josephs-hospital" />}
        </Route>
        <Route path="/hotels-near-srctec-syracuse">
          {() => <LandingPage slug="srctec" />}
        </Route>
        <Route path="/hotels-near-rtx-raytheon-syracuse">
          {() => <LandingPage slug="rtx-raytheon" />}
        </Route>
        <Route path="/hotels-near-raytheon-syracuse">
          {() => <LandingPage slug="rtx-raytheon" />}
        </Route>
        <Route path="/hotels-near-national-grid-syracuse">
          {() => <LandingPage slug="national-grid" />}
        </Route>
        <Route path="/hotels-near-va-medical-center-syracuse">
          {() => <LandingPage slug="va-medical-center" />}
        </Route>
        <Route path="/hotels-near-le-moyne-college">
          {() => <LandingPage slug="le-moyne" />}
        </Route>
        <Route path="/corporate" component={Corporate} />
        <Route path="/corporate-rates" component={Corporate} />
        <Route path="/business-travel" component={Corporate} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Canonical />
        <Suspense fallback={<div role="status" className="min-h-[60vh] px-6 pt-40 text-center">Loading page…</div>}>
          <AppRouter />
          {/* Commit the page view only after a lazy route and its metadata are ready. */}
          <TrackingProvider />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
