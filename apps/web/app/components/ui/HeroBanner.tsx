import Link from 'next/link';
import type { Media } from '../../lib/tmdb';

export const mediaHref = (item: Media) =>
  item.media_type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;

export const mediaYear = (item: Media) => item.release_date?.slice(0, 4) || 'New';

type HeroBannerProps = {
  item: Media;
  label: string;
  browseHref?: string;
  browseLabel?: string;
};

export function HeroBanner({ item, label, browseHref = '#', browseLabel = 'Browse picks' }: HeroBannerProps) {
  return (
    <section className="relative mt-2 min-h-[520px] overflow-hidden rounded-5xl border border-white/[0.08] bg-canvas-surface shadow-card sm:min-h-[580px] animate-fade-in">
      {item.poster_path ? (
        <img
          src={item.poster_path}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-40 blur-[2px]"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,9,8,0.97)_0%,rgba(10,9,8,0.82)_38%,rgba(10,9,8,0.25)_72%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(201,169,98,0.08),transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />

      <div className="relative flex min-h-[520px] max-w-2xl flex-col justify-end p-8 sm:min-h-[580px] sm:p-14 animate-fade-up">
        <p className="section-label">{label}</p>
        <h1 className="font-display max-w-xl text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl">
          {item.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-medium text-warm-200">
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
        <p className="mt-6 line-clamp-3 max-w-xl text-sm leading-relaxed text-warm-300 sm:text-base">
          {item.overview || 'A standout pick selected from the shows and films everyone is watching right now.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
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
    </section>
  );
}
