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
              An all-suite hotel just off I-81 at Exit 30. Minutes from Syracuse, Micron's chip
              campus, and Hancock International Airport.
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
              <li><Link href="/offers" className="hover:text-background">Offers</Link></li>
              <li><Link href="/gallery" className="hover:text-background">Gallery</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-xl mb-5">Gather</h3>
            <ul className="space-y-2.5 text-sm text-background/75">
              <li><Link href="/events" className="hover:text-background">Events</Link></li>
              <li><Link href="/weddings" className="hover:text-background">Weddings</Link></li>
              <li><Link href="/area" className="hover:text-background">The Area</Link></li>
              <li><Link href="/contact" className="hover:text-background">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-background/50">
          <div>© {new Date().getFullYear()} The Cicero Grand. All rights reserved.</div>
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
      </div>
    </footer>
  );
}
