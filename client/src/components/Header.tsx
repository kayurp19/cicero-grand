import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone } from 'lucide-react';
import headerLogoLight from '/brand/cicero-grand-full-light.png';
import headerLogoDark from '/brand/cicero-grand-full-dark.png';
import site from '../content/site.json';
import { eventInquiry } from '@shared/event-inquiry';

const nav = [
  { href: '/rooms', label: 'Suites' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/area', label: 'Area Guide' },
  { href: '/event-center', label: 'Event Center' },
  { href: '/packages', label: 'Packages' },
  { href: '/offers', label: 'Offers' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const inquiry = eventInquiry(location, window.location.search, import.meta.env.VITE_PREVIEW === 'true');
  const primaryHref = inquiry?.quote ?? site.bookingUrl;
  const phoneRaw = inquiry ? site.salesPhoneRaw : site.phoneRaw;
  const phone = inquiry ? site.salesPhone : site.phone;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const onHome = location === '/';
  const transparent = onHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        style={{ top: 'var(--banner-height, 0px)' }}
        className={`fixed left-0 right-0 z-50 transition-colors duration-500 ${
          transparent
            ? 'bg-transparent text-white'
            : 'bg-background/85 backdrop-blur-xl text-foreground border-b border-border/60'
        }`}
        data-testid="site-header"
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between gap-6">
          <Link href="/" data-testid="link-home" className="shrink-0 inline-flex items-center gap-3.5" aria-label="Cicero Grand - Syracuse North home">
            <img src={transparent ? headerLogoLight : headerLogoDark}
              width={48} height={64} alt="Cicero Grand - Syracuse North"
              className="block h-16 w-auto select-none" draggable={false} />
            <span aria-hidden="true" className="border-l border-current/40 pl-3.5 font-display text-[1rem] sm:text-[1.1rem] leading-none whitespace-nowrap">
              Syracuse North
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-7 text-sm whitespace-nowrap">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={`relative transition-opacity hover:opacity-100 ${
                  location === n.href ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {n.label}
                {location === n.href && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-current" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${phoneRaw}`}
              data-testid="header-phone"
              className="hidden md:flex xl:hidden 2xl:flex items-center gap-2 text-sm whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
            <a
              href={primaryHref}
              target={inquiry ? undefined : '_blank'}
              rel="noopener noreferrer"
              data-testid="header-book-now"
              className="hidden sm:inline-flex shrink-0 whitespace-nowrap items-center px-5 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {inquiry ? 'Event inquiry' : 'Book Now'}
            </a>
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="xl:hidden w-10 h-10 grid place-items-center"
              data-testid="button-menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-300 xl:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        data-testid="mobile-menu"
      >
        <div style={{ paddingTop: 'calc(72px + var(--banner-height, 0px))' }} className="px-6 pb-10 h-full overflow-y-auto flex flex-col">
          <nav className="flex flex-col">
            {nav.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                className="font-display text-4xl py-3 border-b border-border/60"
                data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                style={{
                  transitionDelay: `${i * 40}ms`,
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 400ms ease, transform 400ms ease',
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-8 flex flex-col gap-3">
            <a
              href={primaryHref}
              target={inquiry ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-14 rounded-full bg-primary text-primary-foreground text-base font-medium"
              data-testid="mobile-book-now"
            >
              {inquiry ? 'Event inquiry' : 'Book Now'}
            </a>
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center h-14 rounded-full border border-border text-base font-medium"
            >
              <Phone className="w-4 h-4 mr-2" /> Call {phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
