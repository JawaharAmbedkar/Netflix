import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref, mediaYear } from './HeroBanner';

type LayoutVariant = 'editorial' | 'scroll' | 'list';

export function EditorialCollection({
  title,
  subtitle,
  media,
  variant = 'editorial',
}: {
  title: string;
  subtitle: string;
  media: Media[];
  variant?: LayoutVariant;
}) {
  if (media.length === 0) return null;

  const [lead, ...rest] = media;

  if (variant === 'scroll') {
    return (
      <section className="mb-16 animate-fade-up">
        <header className="mb-6">
          <p className="section-label">{subtitle}</p>
          <h2 className="section-title">{title}</h2>
        </header>
        <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-8 sm:px-8">
          {media.map((item, i) => (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={mediaHref(item)}
              className={`group shrink-0 snap-start overflow-hidden rounded-3xl border border-white/[0.06] bg-canvas-surface transition hover:border-gold/20 hover:shadow-card-hover ${
                i === 0 ? 'w-[280px] sm:w-[340px]' : 'w-[160px] sm:w-[180px]'
              }`}
            >
              <div className={`overflow-hidden bg-canvas-elevated ${i === 0 ? 'aspect-[16/10]' : 'aspect-[2/3]'}`}>
                {item.poster_path ? (
                  <img
                    src={item.poster_path}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <p className="truncate font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs text-warm-400">★ {item.rating.toFixed(1)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'list') {
    return (
      <section className="mb-16 animate-fade-up">
        <header className="mb-6">
          <p className="section-label">{subtitle}</p>
          <h2 className="section-title">{title}</h2>
        </header>
        <div className="divide-y divide-white/[0.06] rounded-3xl border border-white/[0.06] bg-canvas-surface/40">
          {media.slice(0, 8).map((item, index) => (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={mediaHref(item)}
              className="group flex items-center gap-5 px-5 py-4 transition first:rounded-t-3xl last:rounded-b-3xl hover:bg-white/[0.03] sm:px-6"
            >
              <span className="w-8 shrink-0 text-lg font-display text-warm-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.06]">
                {item.poster_path ? (
                  <img src={item.poster_path} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white group-hover:text-gold-light">{item.title}</p>
                <p className="text-sm text-warm-400">
                  {mediaYear(item)} · {item.media_type === 'movie' ? 'Film' : 'Series'}
                </p>
              </div>
              <span className="shrink-0 text-sm text-gold-light">★ {item.rating.toFixed(1)}</span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16 animate-fade-up">
      <header className="mb-6">
        <p className="section-label">{subtitle}</p>
        <h2 className="section-title">{title}</h2>
      </header>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        {lead ? (
          <Link
            href={mediaHref(lead)}
            className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-canvas-surface shadow-card lg:row-span-2"
          >
            <div className="aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[360px]">
              {lead.poster_path ? (
                <img
                  src={lead.poster_path}
                  alt={lead.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-wider text-gold">Spotlight</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-white">{lead.title}</h3>
              <p className="mt-3 line-clamp-2 max-w-lg text-sm text-warm-300">{lead.overview}</p>
            </div>
          </Link>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {rest.slice(0, 4).map((item) => (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={mediaHref(item)}
              className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-canvas-surface transition hover:border-gold/20"
            >
              <div className="aspect-[2/3] overflow-hidden">
                {item.poster_path ? (
                  <img
                    src={item.poster_path}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : null}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-warm-400">★ {item.rating.toFixed(1)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
