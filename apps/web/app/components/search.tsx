'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Media } from '../lib/tmdb';

const resultLink = (item: Media) =>
  item.media_type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      setMessage('');
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setMessage('');
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search failed');
        const data = (await response.json()) as { results: Media[] };
        setResults(data.results.slice(0, 6));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setResults([]);
          setMessage('Search is temporarily unavailable. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: Media) => {
    setQuery('');
    setResults([]);
    setMessage('');
    setShowSuggestions(false);
    router.push(resultLink(item));
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const hasDropdownContent = isSearching || results.length > 0 || message;

  return (
    <div className="relative z-50 w-full max-w-[200px] sm:max-w-xs lg:max-w-sm" ref={containerRef}>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          className="h-9 w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] py-2 pl-9 pr-9 text-sm text-white placeholder:text-warm-400 backdrop-blur-md transition-all duration-300 focus:border-gold/30 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-gold/20 sm:h-10 sm:pl-10 sm:pr-10"
          type="search"
          name="search"
          placeholder="Search…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void handleSearch();
            }
          }}
          onFocus={() => query.trim() && setShowSuggestions(true)}
        />
        <button
          type="button"
          aria-label="Search"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-warm-400 transition hover:bg-white/[0.08] hover:text-gold-light"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {showSuggestions && hasDropdownContent ? (
        <div className="absolute mt-2 w-[280px] overflow-hidden rounded-2xl border border-white/[0.08] bg-canvas-elevated/95 text-sm shadow-card backdrop-blur-2xl sm:w-full">
          {isSearching ? (
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
              <span className="text-warm-300">Searching…</span>
            </div>
          ) : null}
          {!isSearching &&
            results.map((item) => (
              <button
                key={`${item.media_type}-${item.id}`}
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                onClick={() => handleSelect(item)}
              >
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-canvas-surface">
                  {item.poster_path ? (
                    <img src={item.poster_path} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-white">{item.title}</span>
                  <span className="block text-xs text-warm-400">
                    {item.release_date.slice(0, 4) || 'Year unknown'} ·{' '}
                    {item.media_type === 'movie' ? 'Film' : 'Series'}
                  </span>
                </span>
              </button>
            ))}
          {!isSearching && results.length > 0 ? (
            <button
              type="button"
              className="w-full border-t border-white/[0.06] px-4 py-3 text-left text-sm font-medium text-gold transition hover:bg-gold/10"
              onClick={handleSearch}
            >
              View all results for &ldquo;{query.trim()}&rdquo;
            </button>
          ) : null}
          {!isSearching && message ? (
            <p className="px-4 py-3 text-warm-300">{message}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
