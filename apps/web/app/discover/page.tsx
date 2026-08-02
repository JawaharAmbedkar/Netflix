import Link from 'next/link';
import { Navbar } from '../components/navbar';
import { MediaRow } from '../components/MediaRow';
import { getAmazonPrimeOriginals, getNetflixOriginals, getTrendingMovies } from '../lib/tmdb';

export default async function DiscoverPage() {
  const [trending, netflix, prime] = await Promise.all([
    getTrendingMovies(),
    getNetflixOriginals(),
    getAmazonPrimeOriginals(),
  ]);
  const featured = trending[0];
  const watchLink = featured?.media_type === 'movie' ? `/watch/movie/${featured.id}` : featured ? `/watch/tv/${featured.id}/1/1` : '#discover-catalogue';

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <Navbar />
      <div className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-8 lg:px-12">
        {featured ? <section className="relative mt-4 min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 sm:min-h-[560px]">
          {featured.poster_path ? <img src={featured.poster_path} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55 blur-[1px] scale-105" /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.98)_0%,rgba(8,8,8,0.76)_42%,rgba(8,8,8,0.16)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
          <div className="relative flex min-h-[500px] max-w-2xl flex-col justify-end p-7 sm:min-h-[560px] sm:p-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-red-400">Discover something new</p>
            <h1 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">{featured.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-200">
              <span>{featured.release_date?.slice(0, 4) || 'New'}</span>
              <span className="rounded bg-white/15 px-2 py-0.5">{featured.media_type === 'movie' ? 'Movie' : 'Series'}</span>
              <span>★ {featured.rating.toFixed(1)}</span>
            </div>
            <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{featured.overview || 'A standout pick selected from the shows and movies everyone is watching right now.'}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={watchLink} className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.12] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.2]"><svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current"><path d="M8 5.7c0-1.08 1.17-1.76 2.11-1.23l8.07 4.55a3.41 3.41 0 0 1 0 5.96l-8.07 4.55A1.41 1.41 0 0 1 8 18.6V5.7Z" /></svg>Watch now</Link>
              <a href="#discover-catalogue" className="rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">Browse picks</a>
            </div>
          </div>
        </section> : null}

        <div id="discover-catalogue" className="pt-12">
          <MediaRow title="Trending Movies" media={trending} />
          <MediaRow title="Netflix Originals" media={netflix} />
          <MediaRow title="Amazon Prime Originals" media={prime} />
        </div>
      </div>
    </main>
  );
}
