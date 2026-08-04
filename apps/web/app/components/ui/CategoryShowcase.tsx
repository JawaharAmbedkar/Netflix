'use client';

import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref } from './HeroBanner';
import { PosterCard } from './PosterCard';

export function CategoryShowcase({ title, items }: { title: string; items: Media[] }) {
  const topRow = items.length > 1 ? items.slice(1, 5) : [];
  const gridItems = items.length > 5 ? items.slice(5) : items.length > 1 ? [] : items;

  return (
    <>
      {topRow.length > 0 ? (
        <section id="catalogue" className="mt-14">
          <p className="section-label">Staff picks</p>
          <h2 className="section-title mb-6">Popular now</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {topRow.map((item) => (
              <Link
                key={`${item.media_type}-${item.id}`}
                href={mediaHref(item)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.06]"
              >
                {item.poster_path ? (
                  <img
                    src={item.poster_path}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-xs text-warm-400">★ {item.rating.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {gridItems.length > 0 ? (
        <section className="mt-14">
          <p className="section-label">Full catalogue</p>
          <h2 className="section-title mb-8">All {title}</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {gridItems.map((item) => (
              <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
