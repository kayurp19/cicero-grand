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

import Home from "@/pages/Home";
import Rooms from "@/pages/Rooms";
import Amenities from "@/pages/Amenities";
import Area from "@/pages/Area";
import Events from "@/pages/Events";
import Weddings from "@/pages/Weddings";
import Offers from "@/pages/Offers";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Accessibility from "@/pages/Accessibility";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEditor from "@/pages/admin/Editor";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
        <Route path="/events" component={Events} />
        <Route path="/weddings" component={Weddings} />
        <Route path="/offers" component={Offers} />
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
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
