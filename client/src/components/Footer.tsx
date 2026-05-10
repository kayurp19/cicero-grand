import { Link } from 'wouter';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import site from '../content/site.json';

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-32" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <Logo textClassName="text-background" />
            <p className="mt-6 text-background/70 max-w-md leading-relaxed">
              An all-suite hotel just off I-81 at Exit 98. Six minutes from Micron's New York
              megafab in Clay, plus Syracuse and Hancock International Airport.
            </p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-book-now"
              className="mt-6 inline-flex items-center px-6 h-12 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Book a stay →
            </a>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-xl mb-5">Visit</h3>
            <ul className="space-y-3 text-sm text-background/75">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{site.address.full}</span>
              </li>
              <li>
                <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-2 hover:text-background">
                  <Phone className="w-4 h-4" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-background">
                  <Mail className="w-4 h-4" /> {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-xl mb-5">Stay</h3>
            <ul className="space-y-2.5 text-sm text-background/75">
              <li><Link href="/rooms" className="hover:text-background">Suites</Link></li>
              <li><Link href="/amenities" className="hover:text-background">Amenities</Link></li>
              <li><Link href="/packages" className="hover:text-background">Packages</Link></li>
              <li><Link href="/offers" className="hover:text-background">Offers</Link></li>
              <li><Link href="/gallery" className="hover:text-background">Gallery</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-xl mb-5">Gather</h3>
            <ul className="space-y-2.5 text-sm text-background/75">
              <li><Link href="/event-center" className="hover:text-background">Event Center</Link></li>
              <li><Link href="/event-center/corporate-meetings" className="hover:text-background">Corporate meetings</Link></li>
              <li><Link href="/event-center/social-events" className="hover:text-background">Social events & banquets</Link></li>
              <li><Link href="/event-center/weddings" className="hover:text-background">Weddings</Link></li>
              <li><Link href="/area-guide" className="hover:text-background">Area Guide</Link></li>
              <li><Link href="/contact" className="hover:text-background">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Discover deeper links — helps SEO crawl + visitors */}
        <div className="pt-8 mt-8 border-t border-background/15">
          <h3 className="text-xs uppercase tracking-[0.2em] text-background/55 mb-4">Hotels in & near Syracuse</h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-background/75">
            <li><Link href="/hotels-syracuse-ny" className="hover:text-background">Hotels in Syracuse, NY</Link></li>
            <li><Link href="/cicero-ny-hotels" className="hover:text-background">Hotels in Cicero, NY</Link></li>
            <li><Link href="/pet-friendly-hotels-syracuse" className="hover:text-background">Pet-friendly hotels</Link></li>
            <li><Link href="/hotels-near-micron" className="hover:text-background">Hotels near Micron</Link></li>
            <li><Link href="/hotels-near-syracuse-airport" className="hover:text-background">Hotels near Syracuse Airport</Link></li>
            <li><Link href="/hotels-near-destiny-usa" className="hover:text-background">Hotels near Destiny USA</Link></li>
            <li><Link href="/hotels-near-jma-wireless-dome" className="hover:text-background">Hotels near the JMA Dome</Link></li>
            <li><Link href="/hotels-near-empower-amphitheater" className="hover:text-background">Hotels near Empower Amphitheater</Link></li>
            <li><Link href="/hotels-near-upstate-medical" className="hover:text-background">Hotels near Upstate Medical</Link></li>
            <li><Link href="/hotels-near-nys-fair" className="hover:text-background">Hotels near the NYS Fair</Link></li>
            <li><Link href="/hotels-near-turning-stone" className="hover:text-background">Hotels near Turning Stone</Link></li>
          </ul>
        </div>

        {/* Legal row */}
        <div className="pt-8 mt-8 border-t border-background/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-background/55">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-background">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-background">Terms of Use</Link>
            <Link href="/accessibility" className="hover:text-background">Accessibility</Link>
            <Link href="/contact" className="hover:text-background">Do Not Sell My Info</Link>
          </div>
          <div className="flex items-center gap-5">
            <span>Check-in {site.checkIn} · Check-out {site.checkOut}</span>
            {site.social.facebook && (
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Copyright + ADA */}
        <div className="pt-6 mt-6 border-t border-background/10 text-xs text-background/45 leading-relaxed space-y-2">
          <p>
            © {new Date().getFullYear()} The Cicero Grand. All rights reserved. The Cicero Grand is an independently owned and operated hotel.
          </p>
          <p>
            The Cicero Grand is committed to making this website accessible to all visitors. If you experience any difficulty accessing this site or need assistance with your reservation, please call <a href="tel:+13157520150" className="underline hover:text-background">(315) 752-0150</a>. See our <Link href="/accessibility" className="underline hover:text-background">Accessibility Statement</Link> for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
