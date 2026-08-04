import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref, mediaYear } from './HeroBanner';
import { PosterCard } from './PosterCard';

type BentoCatalogueProps = {
  title: string;
  subtitle: string;
  items: Media[];
  href?: string;
};

export function BentoCatalogue({ title, subtitle, items, href }: BentoCatalogueProps) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const hrefPath = href ?? '#';

  return (
    <section className="mt-16 animate-fade-up">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="section-label">{subtitle}</p>
          <h2 className="section-title">{title}</h2>
        </div>
        {href ? (
          <Link href={hrefPath} className="hidden text-sm text-gold transition hover:text-gold-light sm:block">
            View all →
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6">
        {featured ? (
          <Link
            href={mediaHref(featured)}
            className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-canvas-surface shadow-card sm:col-span-2 lg:col-span-2"
          >
            <div className="aspect-[4/5] overflow-hidden sm:aspect-auto sm:min-h-[420px]">
              {featured.poster_path ? (
                <img
                  src={featured.poster_path}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs uppercase tracking-wider text-gold">Featured</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm text-warm-300">
                {mediaYear(featured)} · ★ {featured.rating.toFixed(1)}
              </p>
            </div>
          </Link>
        ) : null}

        {rest.slice(0, 4).map((item) => (
          <div key={`${item.media_type}-${item.id}`} className="sm:col-span-1 lg:col-span-1">
            <PosterCard item={item} />
          </div>
        ))}
      </div>

      {rest.length > 4 ? (
        <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {rest.slice(4, 10).map((item) => (
            <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
