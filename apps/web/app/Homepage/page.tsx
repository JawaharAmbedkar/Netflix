'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Footer from '../components/footer';
import { Navbar } from '../components/navbar';
import type { Media } from '../lib/tmdb';

type Catalogue = {
  trending: Media[];
  movies: Media[];
  shows: Media[];
  anime: Media[];
};

const mediaHref = (item: Media) =>
  item.media_type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;

const year = (item: Media) => item.release_date?.slice(0, 4) || 'New';

function RailCard({ item }: { item: Media }) {
  return (
    <Link href={mediaHref(item)} className="group block w-[154px] flex-none sm:w-[178px]">
      <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-lg shadow-black/20">
        <div className="aspect-[3/4] overflow-hidden bg-zinc-800">
          {item.poster_path ? (
            <img src={item.poster_path} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          ) : <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-500">No artwork</div>}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent px-3 pb-3 pt-12">
          <h3 className="truncate text-sm font-bold text-white">{item.title}</h3>
          <p className="mt-1 text-xs text-zinc-300">{year(item)} <span className="mx-1 text-zinc-500">•</span> ★ {item.rating.toFixed(1)}</p>
        </div>
      </article>
    </Link>
  );
}

function NumberedCard({ item, index }: { item: Media; index: number }) {
  return (
    <Link href={mediaHref(item)} className="group relative block h-[210px] w-[190px] flex-none sm:h-[244px] sm:w-[218px]">
      <span aria-hidden className="absolute bottom-[-18px] left-0 z-0 select-none font-serif text-[150px] font-black leading-none tracking-[-0.16em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.38)] sm:text-[175px]">
        {index + 1}
      </span>
      <article className="absolute bottom-0 right-0 z-10 h-[185px] w-[132px] overflow-hidden rounded-xl border border-white/10 bg-zinc-800 shadow-xl shadow-black/40 sm:h-[217px] sm:w-[155px]">
        {item.poster_path ? <img src={item.poster_path} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /> : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent px-3 pb-3 pt-10">
          <p className="truncate text-sm font-bold">{item.title}</p>
        </div>
      </article>
    </Link>
  );
}

function ContentRail({ title, subtitle, items }: { title: string; subtitle: string; items: Media[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-400">{subtitle}</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-sm text-zinc-500">Explore</span>
          <div className="flex overflow-hidden rounded-xl bg-white/[0.07] shadow-lg shadow-black/20 ring-1 ring-white/[0.06]">
            <button type="button" onClick={() => scrollRail('left')} aria-label={`Show previous ${title}`} className="grid h-10 w-11 place-items-center text-base text-zinc-300 transition duration-200 hover:bg-white hover:text-black active:scale-95">←</button>
            <span className="my-2 w-px bg-white/10" />
            <button type="button" onClick={() => scrollRail('right')} aria-label={`Show more ${title}`} className="grid h-10 w-11 place-items-center text-base text-zinc-300 transition duration-200 hover:bg-white hover:text-black active:scale-95">→</button>
          </div>
        </div>
      </div>
      <div ref={railRef} className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        {items.map((item) => <RailCard key={`${item.media_type}-${item.id}`} item={item} />)}
      </div>
    </section>
  );
}

export default function Homepage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const trendingRef = useRef<HTMLDivElement>(null);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/signin');
    else if (!session.user.membership) router.push('/membership-payment');
  }, [status, session, router]);

  useEffect(() => {
    if (!session?.user.membership) return;
    fetch('/api/catalog')
      .then((response) => {
        if (!response.ok) throw new Error('Catalogue request failed');
        return response.json() as Promise<Catalogue>;
      })
      .then(setCatalogue)
      .catch(() => setError(true));
  }, [session?.user.membership]);

  if (status === 'loading' || !session || !session.user.membership) {
    return <div className="min-h-screen bg-zinc-950 p-10 text-center text-white">Checking access...</div>;
  }

  const featured = catalogue?.trending[0];
  const scrollTrending = (direction: 'left' | 'right') => {
    trendingRef.current?.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <Navbar />
      <div className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-8 lg:px-12">
        {error ? <p className="mt-8 rounded-xl border border-red-500/30 bg-red-950/60 p-4 text-red-100">The catalogue could not be loaded. Add a valid TMDB_READ_ACCESS_TOKEN to apps/web/.env.local and restart the app.</p> : null}
        {!catalogue && !error ? <div className="mt-12 animate-pulse text-zinc-400">Curating your next watch...</div> : null}

        {catalogue && featured ? <>
          <section className="relative mt-4 min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 sm:min-h-[560px]">
            {featured.poster_path ? <img src={featured.poster_path} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55 blur-[1px] scale-105" /> : null}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.98)_0%,rgba(8,8,8,0.76)_42%,rgba(8,8,8,0.16)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
            <div className="relative flex min-h-[500px] max-w-2xl flex-col justify-end p-7 sm:min-h-[560px] sm:p-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-red-400">#1 in your watchlist</p>
              <h1 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">{featured.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-200">
                <span>{year(featured)}</span><span className="rounded bg-white/15 px-2 py-0.5">{featured.media_type === 'movie' ? 'Movie' : 'Series'}</span><span>★ {featured.rating.toFixed(1)}</span>
              </div>
              <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{featured.overview || 'A standout pick selected from the shows and movies everyone is watching right now.'}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={mediaHref(featured)} className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.12] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.2]"><svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current"><path d="M8 5.7c0-1.08 1.17-1.76 2.11-1.23l8.07 4.55a3.41 3.41 0 0 1 0 5.96l-8.07 4.55A1.41 1.41 0 0 1 8 18.6V5.7Z" /></svg>Watch now</Link>
                <a href="#trending" className="rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">Browse picks</a>
              </div>
            </div>
          </section>

          <section id="trending" className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-400">Most watched</p><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Trending now</h2></div><div className="hidden items-center gap-3 sm:flex"><span className="text-sm text-zinc-500">This week</span><div className="flex overflow-hidden rounded-xl bg-white/[0.07] shadow-lg shadow-black/20 ring-1 ring-white/[0.06]"><button type="button" onClick={() => scrollTrending('left')} aria-label="Show previous trending titles" className="grid h-10 w-11 place-items-center text-base text-zinc-300 transition duration-200 hover:bg-white hover:text-black active:scale-95">←</button><span className="my-2 w-px bg-white/10" /><button type="button" onClick={() => scrollTrending('right')} aria-label="Show more trending titles" className="grid h-10 w-11 place-items-center text-base text-zinc-300 transition duration-200 hover:bg-white hover:text-black active:scale-95">→</button></div></div></div>
            <div ref={trendingRef} className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-5 scrollbar-hide sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
              {catalogue.trending.slice(0, 10).map((item, index) => <NumberedCard key={`${item.media_type}-${item.id}`} item={item} index={index} />)}
            </div>
          </section>

          <ContentRail title="Big-screen picks" subtitle="Popular movies" items={catalogue.movies} />
          <ContentRail title="Binge-worthy series" subtitle="Popular shows" items={catalogue.shows} />
          <ContentRail title="Anime after dark" subtitle="Japanese animation" items={catalogue.anime} />
        </> : null}
      </div>
      <Footer />
    </main>
  );
}
