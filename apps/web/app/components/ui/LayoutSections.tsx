'use client';

import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref } from './HeroBanner';
import { PosterCard } from './PosterCard';

export function SearchSpotlight({ query, results }: { query: string; results: Media[] }) {
  const [featured, ...rest] = results;

  return (
    <div className="space-y-12">
      {featured ? (
        <Link
          href={mediaHref(featured)}
          className="group relative block overflow-hidden rounded-4xl border border-white/[0.08] bg-canvas-surface shadow-card"
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[320px]">
              {featured.poster_path ? (
                <img
                  src={featured.poster_path}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-canvas-surface/80 md:bg-gradient-to-l md:from-canvas-surface md:via-canvas-surface/40 md:to-transparent" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <p className="text-xs uppercase tracking-wider text-gold">Top match for &ldquo;{query}&rdquo;</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-warm-300">
                {featured.overview || 'The closest match in our catalogue.'}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="btn-primary pointer-events-none">Watch now</span>
                <span className="text-sm text-gold-light">★ {featured.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </Link>
      ) : null}

      {rest.length > 0 ? (
        <div>
          <p className="section-label mb-6">More results</p>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {rest.map((item) => (
              <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
