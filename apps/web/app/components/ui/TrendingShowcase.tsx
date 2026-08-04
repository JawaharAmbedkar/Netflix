import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref, mediaYear } from './HeroBanner';

export function TrendingShowcase({ items }: { items: Media[] }) {
  const topThree = items.slice(0, 3);
  const rest = items.slice(3, 10);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="space-y-5">
        {topThree.map((item, index) => (
          <Link
            key={`${item.media_type}-${item.id}`}
            href={mediaHref(item)}
            className="group flex gap-5 overflow-hidden rounded-3xl border border-white/[0.06] bg-canvas-surface/60 p-4 transition-all duration-500 hover:border-gold/20 hover:bg-canvas-surface hover:shadow-card-hover sm:gap-6 sm:p-5"
          >
            <span className="font-display shrink-0 text-5xl font-bold leading-none text-gold/30 transition group-hover:text-gold/50 sm:text-6xl">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="h-28 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/[0.06] sm:h-36 sm:w-28">
              {item.poster_path ? (
                <img
                  src={item.poster_path}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 py-1">
              <h3 className="truncate font-display text-xl font-semibold text-white sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-warm-400">
                {item.overview || `${mediaYear(item)} · ${item.media_type === 'movie' ? 'Film' : 'Series'}`}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-warm-300">
                <span>{mediaYear(item)}</span>
                <span className="text-gold-light">★ {item.rating.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-white/[0.06] bg-canvas-surface/40 p-5 sm:p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-warm-400">
          Also trending
        </p>
        <ul className="space-y-1">
          {rest.map((item, index) => (
            <li key={`${item.media_type}-${item.id}`}>
              <Link
                href={mediaHref(item)}
                className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-white/[0.04]"
              >
                <span className="w-6 shrink-0 text-sm font-medium text-warm-500">{index + 4}</span>
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-white/[0.06]">
                  {item.poster_path ? (
                    <img src={item.poster_path} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white group-hover:text-gold-light">
                    {item.title}
                  </p>
                  <p className="text-xs text-warm-500">
                    {mediaYear(item)} · ★ {item.rating.toFixed(1)}
                  </p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-warm-500 opacity-0 transition group-hover:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
