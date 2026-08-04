'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Media } from '../../lib/tmdb';
import { mediaHref, mediaYear } from './HeroBanner';

type CinematicHeroProps = {
  items: Media[];
  label?: string;
  browseHref?: string;
  browseLabel?: string;
  variant?: 'default' | 'immersive';
  autoPlayMs?: number;
};

function HeroSlideContent({
  item,
  label,
  browseHref,
  browseLabel,
  variant,
}: {
  item: Media;
  label: string;
  browseHref: string;
  browseLabel: string;
  variant: 'default' | 'immersive';
}) {
  const isImmersive = variant === 'immersive';

  return (
    <div key={item.id} className={`hero-content-in ${isImmersive ? 'max-w-3xl' : 'max-w-2xl'}`}>
      <p className="section-label">{label}</p>
      <h1
        className={`font-display font-semibold leading-[0.92] tracking-tight text-white ${
          isImmersive
            ? 'text-5xl sm:text-6xl lg:text-7xl'
            : 'text-4xl sm:text-5xl lg:text-6xl'
        }`}
      >
        {item.title}
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-warm-200">
        <span>{mediaYear(item)}</span>
        <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-0.5 text-xs uppercase tracking-wider backdrop-blur-sm">
          {item.media_type === 'movie' ? 'Film' : 'Series'}
        </span>
        <span className="flex items-center gap-1 text-gold-light">
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.35 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
          </svg>
          {item.rating.toFixed(1)}
        </span>
      </div>
      <p
        className={`mt-5 text-sm leading-relaxed text-warm-300 sm:text-base ${
          isImmersive ? 'line-clamp-3 max-w-2xl' : 'line-clamp-4 max-w-xl'
        }`}
      >
        {item.overview || 'Handpicked from what everyone is watching right now.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={mediaHref(item)} className="btn-primary">
          <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
            <path d="M8 5.7c0-1.08 1.17-1.76 2.11-1.23l8.07 4.55a3.41 3.41 0 0 1 0 5.96l-8.07 4.55A1.41 1.41 0 0 1 8 18.6V5.7Z" />
          </svg>
          Watch now
        </Link>
        <a href={browseHref} className="btn-secondary">
          {browseLabel}
        </a>
      </div>
    </div>
  );
}

function HeroBackground({ item, isActive }: { item: Media; isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden
    >
      {item.poster_path ? (
        <img
          key={isActive ? `active-${item.id}` : item.id}
          src={item.poster_path}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center ${isActive ? 'hero-ken-burns' : 'scale-105'}`}
          style={{ filter: 'blur(2px) brightness(0.58) saturate(1.15)' }}
        />
      ) : (
        <div className="absolute inset-0 bg-canvas-surface" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,9,8,0.72)_0%,rgba(10,9,8,0.48)_40%,rgba(10,9,8,0.22)_72%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(201,169,98,0.1),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-canvas/80 via-canvas/30 to-transparent" />
    </div>
  );
}

function HeroPosterCard({ item, isActive }: { item: Media; isActive: boolean }) {
  if (!item.poster_path) return null;

  return (
    <div
      className={`absolute inset-0 flex items-end justify-center pb-2 transition-all duration-700 ease-out ${
        isActive ? 'z-10 scale-100 opacity-100' : 'z-0 scale-95 opacity-0'
      }`}
      aria-hidden={!isActive}
    >
      <Link href={mediaHref(item)} tabIndex={isActive ? 0 : -1} className="relative block">
        <div className="absolute -inset-6 rounded-full bg-gold/25 blur-[70px]" />
        <img
          src={item.poster_path}
          alt={item.title}
          className="relative z-10 h-[420px] w-auto rounded-3xl border border-white/15 object-cover shadow-card-hover sm:h-[460px] lg:h-[480px]"
        />
      </Link>
    </div>
  );
}

function CarouselControls({
  slides,
  activeIndex,
  goTo,
  prev,
  next,
}: {
  slides: Media[];
  activeIndex: number;
  goTo: (index: number) => void;
  prev: () => void;
  next: () => void;
}) {
  if (slides.length <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-3 sm:gap-4">
      <div className="flex items-center gap-2" role="tablist" aria-label="Slide navigation">
        {slides.map((item, index) => (
          <button
            key={`dot-${item.media_type}-${item.id}`}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${item.title}`}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === activeIndex ? 'w-8 bg-gold' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-warm-200 backdrop-blur-sm transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold-light"
        >
          ←
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-warm-200 backdrop-blur-sm transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold-light"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function CinematicHero({
  items,
  label = "Tonight's spotlight",
  browseHref = '#',
  browseLabel = 'Browse picks',
  variant = 'default',
  autoPlayMs = 6500,
}: CinematicHeroProps) {
  const slides = items.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) return;

    timerRef.current = setInterval(next, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused, prefersReducedMotion, autoPlayMs, next]);

  if (slides.length === 0) return null;

  const active = slides[activeIndex]!;
  const isImmersive = variant === 'immersive';

  const sectionClass = isImmersive
    ? 'relative -mx-4 min-h-[72vh] overflow-hidden sm:-mx-8 lg:-mx-12'
    : 'relative mt-2 min-h-[580px] overflow-hidden rounded-5xl border border-white/[0.08] shadow-card sm:min-h-[640px]';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <section
        className={sectionClass}
        aria-roledescription="carousel"
        aria-label="Featured titles"
      >
      {slides.map((item, index) => (
        <HeroBackground key={`${item.media_type}-${item.id}`} item={item} isActive={index === activeIndex} />
      ))}

      <div
        className={`relative z-10 grid min-h-[580px] sm:min-h-[640px] ${
          isImmersive
            ? 'mx-auto max-w-[1500px] lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10'
            : 'lg:grid-cols-[1fr_auto] lg:items-end lg:gap-6'
        } ${isImmersive ? 'px-8 pb-14 pt-28 sm:px-12 lg:px-16' : 'p-8 sm:p-12 lg:p-14'}`}
      >
        {/* Left: text + controls */}
        <div className="flex flex-col justify-end">
          <HeroSlideContent
            item={active}
            label={label}
            browseHref={browseHref}
            browseLabel={browseLabel}
            variant={variant}
          />

          {/* Mobile poster card */}
          <div className="relative mx-auto mt-8 aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-3xl border border-white/10 shadow-card lg:hidden">
            {active.poster_path ? (
              <Link href={mediaHref(active)}>
                <img
                  src={active.poster_path}
                  alt={active.title}
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : null}
          </div>
        </div>

        {/* Right: poster card (desktop) */}
        <div className="relative hidden h-[500px] w-[300px] shrink-0 lg:block xl:w-[320px]">
          {slides.map((item, index) => (
            <HeroPosterCard
              key={`poster-${item.media_type}-${item.id}`}
              item={item}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>

      {slides.length > 1 && !prefersReducedMotion && !isPaused ? (
        <div className="absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/[0.06]">
          <div
            key={activeIndex}
            className="hero-progress-bar h-full origin-left bg-gold/70"
            style={{ ['--hero-duration' as string]: `${autoPlayMs}ms` }}
          />
        </div>
      ) : null}
      </section>

      {slides.length > 1 ? (
        <div className={`mt-4 flex justify-end ${isImmersive ? 'px-0' : ''}`}>
          <CarouselControls
            slides={slides}
            activeIndex={activeIndex}
            goTo={goTo}
            prev={prev}
            next={next}
          />
        </div>
      ) : null}
    </div>
  );
}
