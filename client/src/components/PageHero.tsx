import { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  image: string;
  align?: 'left' | 'center';
}

export function PageHero({ eyebrow, title, intro, image, align = 'left' }: PageHeroProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <section className="relative pt-[72px] bg-foreground text-background">
      <div className="relative h-[68svh] min-h-[480px] overflow-hidden">
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 lg:px-10 flex flex-col justify-end pb-16 lg:pb-24">
          <div className={`max-w-4xl ${alignCls}`}>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-90 mb-5">
              <span className="w-8 h-px bg-white/70" /> {eyebrow}
            </span>
            <h1 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95] tracking-tight text-balance">
              {title}
            </h1>
            {intro && (
              <p className="mt-6 text-base md:text-lg max-w-2xl opacity-90 leading-relaxed">
                {intro}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
