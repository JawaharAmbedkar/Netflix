'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { SearchSpotlight } from '../components/ui/LayoutSections';
import { PageShell } from '../components/ui/PageShell';
import { PageLoadingShell, PosterGridSkeleton } from '../components/ui/Skeleton';
import type { Media } from '../lib/tmdb';

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
    <PageShell>
      <div className="grid gap-10 pt-4 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="animate-fade-in lg:sticky lg:top-28 lg:self-start">
          <p className="section-label">Search</p>
          <h1 className="font-display text-4xl font-semibold text-white">Results</h1>

          {query ? (
            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-canvas-surface/60 p-5">
              <p className="text-xs uppercase tracking-wider text-warm-400">Query</p>
              <p className="mt-2 font-display text-xl text-gold-light">&ldquo;{query}&rdquo;</p>
              {status === 'ready' ? (
                <p className="mt-3 text-sm text-warm-400">
                  {results.length} {results.length === 1 ? 'title' : 'titles'} found
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-warm-400">
              Use the search bar above to find films and series.
            </p>
          )}

          <div className="mt-6 hidden space-y-2 lg:block">
            <p className="text-xs uppercase tracking-wider text-warm-500">Tips</p>
            <p className="text-sm text-warm-400">Try searching by title, genre, or year for best results.</p>
          </div>
        </aside>

        <div className="min-w-0">
          {status === 'loading' ? (
            <PosterGridSkeleton count={10} />
          ) : null}

          {status === 'error' ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-950/40 p-5 text-red-100">
              Search is temporarily unavailable. Please try again.
            </div>
          ) : null}

          {status === 'ready' && query && results.length === 0 ? (
            <div className="rounded-3xl glass p-12 text-center">
              <p className="font-display text-3xl text-warm-200">No matches</p>
              <p className="mt-3 text-warm-400">
                &ldquo;{query}&rdquo; isn&apos;t in our catalogue yet.
              </p>
            </div>
          ) : null}

          {status === 'ready' && results.length > 0 ? (
            <SearchSpotlight query={query} results={results} />
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<PageLoadingShell message="Loading search…" />}>
      <SearchResultsContent />
    </Suspense>
  );
}
