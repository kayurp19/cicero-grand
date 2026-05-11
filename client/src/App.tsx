import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyBookBar } from "@/components/StickyBookBar";
import { CookieConsent } from "@/components/CookieConsent";
import { RateBanner } from "@/components/RateBanner";

import Home from "@/pages/Home";
import Rooms from "@/pages/Rooms";
import Amenities from "@/pages/Amenities";
import Area from "@/pages/Area";
import EventCenter from "@/pages/EventCenter";
import CorporateMeetings from "@/pages/event-center/CorporateMeetings";
import SocialEvents from "@/pages/event-center/SocialEvents";
import Weddings from "@/pages/event-center/Weddings";
import Offers from "@/pages/Offers";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Accessibility from "@/pages/Accessibility";
import LandingPage from "@/pages/LandingPage";
import Packages from "@/pages/Packages";
import MicronCrewLongStay from "@/pages/MicronCrewLongStay";
import TrackingTest from "@/pages/TrackingTest";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEditor from "@/pages/admin/Editor";
import AdminSubmissions from "@/pages/admin/Submissions";
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
        {/* Legacy URL fallbacks — Express handles 301 in prod, these handle SPA dev navigation */}
        <Route path="/events" component={EventCenter} />
        <Route path="/weddings" component={Weddings} />
        <Route path="/offers" component={Offers} />
        <Route path="/packages" component={Packages} />
        <Route path="/micron-crew-long-stay" component={MicronCrewLongStay} />
        <Route path="/micron-long-stay" component={MicronCrewLongStay} />
        <Route path="/tracking-test" component={TrackingTest} />
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
        <TrackingProvider />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
