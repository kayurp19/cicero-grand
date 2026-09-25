import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { venuePhotos } from '../components/VenueGallery';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { useContent } from '../lib/content';
import { useSeo } from '../hooks/useSeo';

type Photo = { src: string; label: string; alt: string };
type Section = { id: string; title: string; intro: string; photos: Photo[] };
// Byte-identical aliases in the existing library; retain one copy in the gallery.
const duplicatePhotos = new Set([
  'king-suite-2.jpg', 'two-queen-suite-2.jpg', 'two-queen-suite-4.jpg',
  'king-jacuzzi-2.jpg', 'lobby-2.jpg', 'lobby-sitting-2.jpg',
  'pool-2.jpg', 'breakfast-2.jpg', 'exterior-2.jpg', 'exterior-3.jpg',
]);
const sections = [
  { id: 'events', title: 'Event Center', intro: 'Explore the ballroom and entrance spaces before event setup.' },
  { id: 'rooms', title: 'Guest Rooms', intro: 'A closer look at our suites, sleeping areas and guest bathrooms.' },
  { id: 'public', title: 'Public Spaces', intro: 'Step inside the lobby and shared spaces around the hotel.' },
  { id: 'amenities', title: 'Pool & Breakfast', intro: 'See our indoor pool and breakfast spaces.' },
  { id: 'exterior', title: 'Exterior & Arrival', intro: 'Get familiar with the hotel and entrance before you arrive.' },
  { id: 'other', title: 'More Around the Hotel', intro: 'More views from the Cicero Grand.' },
];

function category(src: string) {
  if (/event-|venue-|ballroom|foyer/.test(src)) return 'events';
  if (/suite|queen|king|bathroom/.test(src)) return 'rooms';
  if (/lobby|sitting|fireplace/.test(src)) return 'public';
  if (/pool|breakfast|fitness|gym/.test(src)) return 'amenities';
  if (/exterior/.test(src)) return 'exterior';
  return 'other';
}

function label(src: string) {
  const filename = src.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/-\d+$/, '') || 'Hotel view';
  const labels: Record<string, string> = {
    'king-suite': 'King suite', 'two-queen-suite': 'Two-queen suite',
    'accessible-queen': 'Accessible queen suite', 'king-jacuzzi': 'King whirlpool suite',
    bathroom: 'Guest bathroom', 'lobby-fireplace': 'Lobby fireplace', 'lobby-sitting': 'Lobby seating',
    lobby: 'The lobby', breakfast: 'Breakfast area', pool: 'Indoor pool',
    'exterior-entrance': 'Hotel entrance', exterior: 'Hotel exterior',
  };
  return labels[filename] || filename.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());
}

export default function Gallery() {
  const photos = useContent<string[]>('gallery');
  const opener = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<{ section: Section; index: number } | null>(null);
  const realVenue = venuePhotos.map(p => ({ src: `/photos/${p.slug}.webp`, label: p.label, alt: p.alt }));
  const groups: Section[] = sections.map(s => ({
    ...s,
    photos: s.id === 'events' ? realVenue : [...new Set(photos)]
      .filter(src => category(src) === s.id && !duplicatePhotos.has(src.split('/').pop() || ''))
      .map(src => ({ src, label: label(src), alt: `${label(src)} at the Cicero Grand in Cicero, NY` })),
  })).filter(s => s.photos.length > 0);
  const current = open?.section.photos[open.index];
  const step = (delta: number) => setOpen(value => value ? { ...value, index: (value.index + delta + value.section.photos.length) % value.section.photos.length } : null);

  useSeo({
    title: 'Photo Gallery · Event Center, Suites & Public Spaces | Cicero Grand',
    description: 'Explore Cicero Grand photos by section: event center, guest rooms, public spaces, pool, breakfast and hotel exterior in Cicero, NY.',
    canonicalPath: '/gallery',
    ogImage: '/photos/cicero-grand-ballroom-wide.jpg',
  });

  return (
    <>
      <PageHero eyebrow="Gallery" image="/photos/lobby-2.jpg" title={<>Take a <em className="italic font-light">look</em> around.</>} intro="Explore one space at a time. Choose a section below, and tap any photo for a closer look." />
      <nav aria-label="Gallery sections" className="bg-background border-b border-border py-6">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 flex flex-wrap gap-2">
          {groups.map(s => <button key={s.id} type="button" data-testid={`gallery-jump-${s.id}`} onClick={() => document.getElementById(`gallery-${s.id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })} className="px-5 py-3 text-sm rounded-full border border-border hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors">{s.title} <span className="ml-1 opacity-60">{s.photos.length}</span></button>)}
        </div>
      </nav>
      {groups.map((s, index) => (
        <section key={s.id} id={`gallery-${s.id}`} data-testid={`gallery-section-${s.id}`} className={`scroll-mt-36 py-16 lg:py-24 ${index % 2 ? 'bg-background' : 'bg-muted/30'}`}>
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{String(index + 1).padStart(2, '0')} / Explore Cicero Grand</p>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] tracking-tight leading-tight mb-3">{s.title}</h2>
                <p className="text-base text-muted-foreground">{s.intro}</p>
              </div>
              {s.id === 'events' && <Link href="/contact?topic=Event%20%2F%20meeting%20inquiry&tour=1" data-testid="gallery-tour" className="shrink-0 inline-flex justify-center items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full font-medium">Request a tour <ArrowUpRight className="w-4 h-4" /></Link>}
              {s.id === 'rooms' && <Link href="/rooms" data-testid="gallery-suites" className="shrink-0 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">Explore our suites <ArrowUpRight className="w-4 h-4" /></Link>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {s.photos.map((p, i) => (
                <figure key={p.src}>
                  <button type="button" data-testid={`gallery-photo-${s.id}-${i}`} aria-label={`Enlarge ${p.label}, photo ${i + 1}`} onClick={event => { opener.current = event.currentTarget; setOpen({ section: s, index: i }); }} className="group w-full block rounded-2xl overflow-hidden bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    <img src={p.src} alt={p.alt} loading="lazy" width={1200} height={900} className="w-full aspect-[4/3] object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
                  </button>
                  <figcaption className="mt-3 flex justify-between gap-2 text-sm"><span>{p.label}</span><span className="text-muted-foreground">View photo</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}
      <Dialog open={!!open} onOpenChange={value => { if (!value) setOpen(null); }}>
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] p-4 sm:p-6 max-h-[90svh] overflow-y-auto" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }} onKeyDown={event => { if (event.key === 'ArrowLeft') step(-1); if (event.key === 'ArrowRight') step(1); }} data-testid="gallery-lightbox">
          <DialogTitle className="pr-8">{current?.label}</DialogTitle>
          <DialogDescription>{open?.section.title} · Cicero Grand, Cicero NY</DialogDescription>
          {current && <img src={current.src} alt={current.alt} className="w-full max-h-[60svh] object-contain rounded-lg" />}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" data-testid="gallery-previous" className="p-3 rounded-full border border-border hover:bg-muted"><ChevronLeft className="w-5 h-5" /></button>
            <p className="text-sm text-muted-foreground" data-testid="gallery-count">{(open?.index ?? 0) + 1} / {open?.section.photos.length}</p>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" data-testid="gallery-next" className="p-3 rounded-full border border-border hover:bg-muted"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
