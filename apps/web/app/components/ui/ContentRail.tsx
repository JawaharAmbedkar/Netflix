'use client';

import { useRef } from 'react';
import type { Media } from '../../lib/tmdb';
import { PosterCard } from './PosterCard';

type ContentRailProps = {
  title: string;
  subtitle: string;
  items: Media[];
  badge?: string;
};

export function SectionHeader({
  subtitle,
  title,
  badge,
  onScrollLeft,
  onScrollRight,
}: {
  subtitle: string;
  title: string;
  badge?: string;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="section-label">{subtitle}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {(badge || onScrollLeft) && (
        <div className="hidden items-center gap-4 sm:flex">
          {badge ? <span className="text-sm text-warm-400">{badge}</span> : null}
          {onScrollLeft && onScrollRight ? (
            <div className="flex overflow-hidden rounded-2xl glass shadow-glass">
              <button
                type="button"
                onClick={onScrollLeft}
                aria-label={`Show previous ${title}`}
                className="grid h-10 w-11 place-items-center text-warm-300 transition duration-200 hover:bg-gold/20 hover:text-gold-light active:scale-95"
              >
                ←
              </button>
              <span className="my-2 w-px bg-white/10" />
              <button
                type="button"
                onClick={onScrollRight}
                aria-label={`Show more ${title}`}
                className="grid h-10 w-11 place-items-center text-warm-300 transition duration-200 hover:bg-gold/20 hover:text-gold-light active:scale-95"
              >
                →
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function ContentRail({ title, subtitle, items, badge }: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  return (
    <section className="mt-14 animate-fade-up">
      <SectionHeader
        subtitle={subtitle}
        title={title}
        badge={badge}
        onScrollLeft={() => scrollRail('left')}
        onScrollRight={() => scrollRail('right')}
      />
      <div
        ref={railRef}
        className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        {items.map((item) => (
          <div key={`${item.media_type}-${item.id}`} className="w-[154px] flex-none sm:w-[178px]">
            <PosterCard item={item} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  );
}
