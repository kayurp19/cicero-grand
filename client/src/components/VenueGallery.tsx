import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

export const venuePhotos = [
  { slug: 'cicero-grand-ballroom-wide', label: 'The ballroom', alt: 'Full view of the Cicero Grand ballroom with chandeliers, tall windows and concrete flooring' },
  { slug: 'cicero-grand-ballroom-chandeliers', label: 'Chandelier details', alt: 'Cicero Grand ballroom with illuminated wrought-iron chandeliers and natural light' },
  { slug: 'cicero-grand-event-entrance', label: 'A welcoming entrance', alt: 'Cicero Grand event entrance with a greenery wall between double doors' },
  { slug: 'cicero-grand-ballroom-windows', label: 'Room for your vision', alt: 'Open ballroom floor at Cicero Grand with tall windows and movable room divider' },
  { slug: 'cicero-grand-ballroom-daylight', label: 'Natural light', alt: 'Daylight across the concrete floor of the Cicero Grand ballroom' },
  { slug: 'cicero-grand-event-foyer', label: 'The foyer', alt: 'Cicero Grand event foyer with tiered chandelier and greenery accent wall' },
];

export function VenueGallery({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const shown = compact ? venuePhotos.slice(0, 3) : venuePhotos;
  const current = selected === null ? null : venuePhotos[selected];
  const step = (delta: number) => setSelected(i => ((i ?? 0) + delta + venuePhotos.length) % venuePhotos.length);

  return (
    <section className="bg-muted/30 py-16 lg:py-24" aria-label="Event center photo gallery" data-testid="venue-gallery">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 lg:mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Inside the event center · Cicero, NY</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-tight tracking-tight mb-4">Your vision. <em className="italic font-light">Our space.</em></h2>
            <p className="text-base text-muted-foreground leading-relaxed">Explore our ballroom and entrance spaces, photographed before event setup. Picture your celebration here, then come see it in person.</p>
          </div>
          <Link href="/contact?topic=Event%20%2F%20meeting%20inquiry&tour=1" data-testid="venue-gallery-tour" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-4 font-medium hover:opacity-90 transition-opacity">
            Request a tour <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {shown.map((photo, i) => (
            <figure key={photo.slug}>
              <button type="button" data-testid={`venue-photo-${i}`} aria-label={`Enlarge photo: ${photo.label}`} onClick={event => { opener.current = event.currentTarget; setSelected(i); }} className="group block w-full overflow-hidden rounded-2xl bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <img src={`/photos/${photo.slug}.webp`} srcSet={`/photos/${photo.slug}-800.webp 800w, /photos/${photo.slug}.webp 1920w`} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" alt={photo.alt} loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
              </button>
              <figcaption className="mt-3 flex justify-between gap-2 text-sm"><span>{photo.label}</span><span className="text-muted-foreground">View photo</span></figcaption>
            </figure>
          ))}
        </div>
        {compact && <Link href="/gallery" data-testid="venue-gallery-all" className="inline-flex items-center gap-2 mt-8 text-sm font-medium underline underline-offset-4">Explore the full gallery <ArrowUpRight className="w-4 h-4" /></Link>}
      </div>
      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] p-4 sm:p-6 max-h-[90svh] overflow-y-auto" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }} onKeyDown={event => { if (event.key === 'ArrowLeft') step(-1); if (event.key === 'ArrowRight') step(1); }} data-testid="venue-lightbox">
          <DialogTitle className="pr-8">{current?.label}</DialogTitle>
          <DialogDescription>Actual photos of the Cicero Grand event center, before event setup.</DialogDescription>
          {current && <img src={`/photos/${current.slug}.webp`} alt={current.alt} className="w-full max-h-[60svh] object-contain rounded-lg" data-testid="venue-lightbox-image" />}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" data-testid="venue-previous" className="p-3 rounded-full border border-border hover:bg-muted"><ChevronLeft className="w-5 h-5" /></button>
            <p className="text-sm text-muted-foreground" data-testid="venue-photo-count">{(selected ?? 0) + 1} / {venuePhotos.length}</p>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" data-testid="venue-next" className="p-3 rounded-full border border-border hover:bg-muted"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
