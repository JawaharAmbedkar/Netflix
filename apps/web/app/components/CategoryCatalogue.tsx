'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from './footer';
import { Navbar } from './navbar';
import type { Media } from '../lib/tmdb';

type Category = 'movies' | 'shows' | 'anime';
type Catalogue = Record<Category, Media[]>;

const categoryTitle: Record<Category, string> = {
  movies: 'Movies',
  shows: 'TV Shows',
  anime: 'Anime',
};

const categoryLabel: Record<Category, string> = {
  movies: 'Featured film',
  shows: 'Featured series',
  anime: 'Featured anime',
};

const watchLink = (item: Media) => item.media_type === 'movie'
  ? `/watch/movie/${item.id}`
  : `/watch/tv/${item.id}/1/1`;

export function CategoryCatalogue({ category }: { category: Category }) {
  const [items, setItems] = useState<Media[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const title = categoryTitle[category];
  const featured = items[0];

  useEffect(() => {
    fetch('/api/catalog')
      .then((response) => {
        if (!response.ok) throw new Error('Catalogue request failed');
        return response.json() as Promise<Catalogue>;
      })
      .then((catalogue) => {
        setItems(catalogue[category]);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [category]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <Navbar />
      <div className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-8 lg:px-12">

        {status === 'loading' ? <p className="mt-10 text-zinc-400">Loading {title.toLowerCase()}…</p> : null}
        {status === 'error' ? <p className="mt-10 rounded-lg bg-red-950 p-4 text-red-200">{title} could not be loaded. Please try again shortly.</p> : null}
        {status === 'ready' && items.length === 0 ? <p className="mt-10 rounded-lg bg-zinc-900 p-4 text-zinc-300">No {title.toLowerCase()} are available right now.</p> : null}

        {status === 'ready' && featured ? <>
          <section className="relative mt-4 min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 sm:min-h-[560px]">
            {featured.poster_path ? <img src={featured.poster_path} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55 blur-[1px] scale-105" /> : null}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.98)_0%,rgba(8,8,8,0.76)_42%,rgba(8,8,8,0.16)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
            <div className="relative flex min-h-[500px] max-w-2xl flex-col justify-end p-7 sm:min-h-[560px] sm:p-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-red-400">{categoryLabel[category]}</p>
              <h1 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">{featured.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-200">
                <span>{featured.release_date?.slice(0, 4) || 'New'}</span>
                <span className="rounded bg-white/15 px-2 py-0.5">{featured.media_type === 'movie' ? 'Movie' : 'Series'}</span>
                <span>★ {featured.rating.toFixed(1)}</span>
              </div>
              <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{featured.overview || `A standout ${title.toLowerCase()} pick, ready for your next watch.`}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={watchLink(featured)} className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.12] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.2]"><svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current"><path d="M8 5.7c0-1.08 1.17-1.76 2.11-1.23l8.07 4.55a3.41 3.41 0 0 1 0 5.96l-8.07 4.55A1.41 1.41 0 0 1 8 18.6V5.7Z" /></svg>Watch now</Link>
                <a href="#catalogue" className="rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">Browse {title}</a>
              </div>
            </div>
          </section>

          <section id="catalogue" className="mt-12">
            <div className="mb-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-400">Keep watching</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore {title}</h2>
            </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
              <Link key={`${item.media_type}-${item.id}`} href={watchLink(item)} className="group">
                <article>
                  <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800 shadow">
                    {item.poster_path ? <img src={item.poster_path} alt={item.title} className="h-full w-full object-cover transition duration-200 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center p-4 text-center text-zinc-400">No poster available</div>}
                  </div>
                  <h2 className="mt-2 truncate font-medium">{item.title}</h2>
                  <p className="text-sm text-zinc-400">{item.release_date.slice(0, 4) || 'Year unknown'} · {item.media_type === 'movie' ? 'Movie' : 'Series'}</p>
                </article>
              </Link>
            ))}
          </div>
          </section>
        </> : null}
      </div>
      <Footer />
    </main>
  );
}
