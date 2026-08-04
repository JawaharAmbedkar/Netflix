import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref, mediaYear } from './HeroBanner';

type PosterCardProps = {
  item: Media;
  variant?: 'default' | 'compact';
};

export function PosterCard({ item, variant = 'default' }: PosterCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Link href={mediaHref(item)} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-canvas-surface shadow-card transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold/20 group-hover:shadow-card-hover">
        <div className={`relative overflow-hidden bg-canvas-elevated ${isCompact ? 'aspect-[3/4]' : 'aspect-[2/3]'}`}>
          {item.poster_path ? (
            <img
              src={item.poster_path}
              alt={item.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-warm-400">
              No artwork
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className={`${isCompact ? 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-16' : 'mt-3 px-0.5'}`}>
          <h3 className={`truncate font-medium text-white ${isCompact ? 'text-sm' : 'text-base'}`}>
            {item.title}
          </h3>
          <p className={`mt-1 text-warm-400 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {mediaYear(item)}
            <span className="mx-1.5 text-warm-500">·</span>
            {item.media_type === 'movie' ? 'Film' : 'Series'}
            {!isCompact && (
              <>
                <span className="mx-1.5 text-warm-500">·</span>
                <span className="text-gold-light">★ {item.rating.toFixed(1)}</span>
              </>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
}
