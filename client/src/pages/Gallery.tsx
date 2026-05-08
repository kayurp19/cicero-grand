import { useState } from 'react';
import { X } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { useContent } from '../lib/content';
import gallerySeed from '../content/gallery.json';

export default function Gallery() {
  const photos = useContent<string[]>('gallery');
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        image="/photos/lobby-2.jpg"
        title={<>The <em className="italic font-light">place</em> in pictures.</>}
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
            {photos.map((src, i) => (
              <Reveal key={src} delay={(i % 6) * 40}>
                <button
                  type="button"
                  onClick={() => setOpen(src)}
                  data-testid={`gallery-photo-${i}`}
                  className={`block w-full overflow-hidden rounded-2xl bg-muted ${
                    i % 5 === 0 ? 'aspect-[4/5]' : i % 7 === 0 ? 'aspect-[5/4]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-12"
          onClick={() => setOpen(null)}
          data-testid="gallery-lightbox"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-5 right-5 w-12 h-12 rounded-full bg-background/10 text-background hover:bg-background/20 grid place-items-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <img src={open} alt="" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </>
  );
}
