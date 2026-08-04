import Link from 'next/link';
import type { Media } from '../lib/tmdb';

export function MediaRow({ title, media }: { title: string; media: Media[] }) {
  return (
    <section className="mb-14 animate-fade-up">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="section-label">Curated</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <span className="hidden text-sm text-warm-400 sm:block">{media.length} titles</span>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {media.map((item) => {
          const href =
            item.media_type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;
          return (
            <Link key={`${item.media_type}-${item.id}`} href={href} className="group">
              <article className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-canvas-surface shadow-card transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold/20 group-hover:shadow-card-hover">
                <div className="aspect-[2/3] overflow-hidden bg-canvas-elevated">
                  {item.poster_path ? (
                    <img
                      src={item.poster_path}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-warm-400">No poster</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-warm-400">
                    {item.release_date.slice(0, 4) || '—'}
                    <span className="mx-1.5 text-warm-500">·</span>
                    <span className="text-gold-light">★ {item.rating.toFixed(1)}</span>
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
