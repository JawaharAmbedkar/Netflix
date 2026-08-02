'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Media } from '../lib/tmdb';

const resultLink = (item: Media) => item.media_type === 'movie'
  ? `/watch/movie/${item.id}`
  : `/watch/tv/${item.id}/1/1`;

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
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json() as { results: Media[] };
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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setShowSuggestions(false);
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
    <div className="relative z-50 mx-auto w-full max-w-md" ref={containerRef}>
      <div className="relative w-full">
        <input
          className="h-7 w-full rounded-md border-2 border-gray-300 bg-transparent px-0.5 pr-10 text-sm text-white placeholder:text-gray-300 focus:outline-none sm:px-4"
          type="search"
          name="search"
          placeholder="Search movies and series"
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
        <button type="button" aria-label="Search" onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966" width="16" height="16">
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c.571.593,1.339.92,2.162.92.779,0,1.518-.297,2.079-.837C56.255,54.982,56.293,53.08,55.146,51.887zM23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </div>

      {showSuggestions && hasDropdownContent ? (
        <div className="absolute mt-2 w-full overflow-hidden rounded-md bg-white text-sm text-black shadow-lg">
          {isSearching ? <p className="px-4 py-3 text-gray-600">Searching…</p> : null}
          {!isSearching && results.map((item) => (
            <button key={`${item.media_type}-${item.id}`} type="button" className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-200" onClick={() => handleSelect(item)}>
              <div className="h-12 w-8 shrink-0 overflow-hidden rounded bg-gray-200">
                {item.poster_path ? <img src={item.poster_path} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <span className="min-w-0">
                <span className="block truncate font-medium">{item.title}</span>
                <span className="block text-xs text-gray-500">{item.release_date.slice(0, 4) || 'Year unknown'} · {item.media_type === 'movie' ? 'Movie' : 'Series'}</span>
              </span>
            </button>
          ))}
          {!isSearching && results.length > 0 ? <button type="button" className="w-full border-t border-gray-200 px-4 py-3 text-left font-medium text-red-700 hover:bg-gray-100" onClick={handleSearch}>Show all results for “{query.trim()}”</button> : null}
          {!isSearching && message ? <p className="px-4 py-3 text-gray-700">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
