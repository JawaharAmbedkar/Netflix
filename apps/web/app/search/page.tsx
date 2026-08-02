'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Footer from '../components/footer';
import { Navbar } from '../components/navbar';
import type { Media } from '../lib/tmdb';

const watchLink = (item: Media) => item.media_type === 'movie'
  ? `/watch/movie/${item.id}`
  : `/watch/tv/${item.id}/1/1`;

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q')?.trim() ?? '';
  const [results, setResults] = useState<Media[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus('ready');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Search failed');
        return response.json() as Promise<{ results: Media[] }>;
      })
      .then((data) => {
        setResults(data.results);
        setStatus('ready');
      })
      .catch((error) => {
        if ((error as Error).name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [query]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Search results</h1>
        {query ? <p className="mt-2 text-zinc-400">Showing movies and series matching “{query}”.</p> : <p className="mt-2 text-zinc-400">Enter a movie or series name in the search box.</p>}

        {status === 'loading' ? <p className="mt-10 text-zinc-400">Searching…</p> : null}
        {status === 'error' ? <p className="mt-10 rounded-lg bg-red-950 p-4 text-red-200">Search is temporarily unavailable. Please try again.</p> : null}
        {status === 'ready' && query && results.length === 0 ? <p className="mt-10 rounded-lg bg-zinc-900 p-4 text-zinc-300">“{query}” is not available.</p> : null}

        {status === 'ready' && results.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((item) => (
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
        ) : null}
      </div>
      <Footer />
    </main>
  );
}

export default function SearchResultsPage() {
  return <Suspense fallback={<main className="min-h-screen bg-zinc-950 p-10 text-center text-white">Loading search…</main>}><SearchResultsContent /></Suspense>;
}
