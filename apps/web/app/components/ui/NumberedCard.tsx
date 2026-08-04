import Link from 'next/link';
import type { Media } from '../../lib/tmdb';
import { mediaHref } from './HeroBanner';

export function NumberedCard({ item, index }: { item: Media; index: number }) {
  return (
    <Link
      href={mediaHref(item)}
      className="group relative block h-[220px] w-[200px] flex-none sm:h-[260px] sm:w-[230px]"
    >
      <span
        aria-hidden
        className="absolute bottom-[-20px] left-0 z-0 select-none font-display text-[155px] font-bold leading-none tracking-[-0.12em] text-transparent transition-all duration-500 group-hover:text-gold/10 [-webkit-text-stroke:1px_rgba(201,169,98,0.35)] sm:text-[185px]"
      >
        {index + 1}
      </span>
      <article className="absolute bottom-0 right-0 z-10 h-[195px] w-[138px] overflow-hidden rounded-2xl border border-white/[0.08] bg-canvas-elevated shadow-card transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold/25 group-hover:shadow-card-hover sm:h-[230px] sm:w-[162px]">
        {item.poster_path ? (
          <img
            src={item.poster_path}
            alt={item.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-3 pt-14">
          <p className="truncate text-sm font-medium text-white">{item.title}</p>
        </div>
      </article>
    </Link>
  );
}
