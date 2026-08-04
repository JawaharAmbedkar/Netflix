'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function WatchNavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading || !pathname?.startsWith('/watch/')) return;

    setIsLoading(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, [isLoading, pathname]);

  useEffect(() => {
    const handleWatchLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as Element | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank') return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname?.startsWith('/watch/')) return;

      setIsLoading(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsLoading(false), 12_000);
    };

    document.addEventListener('click', handleWatchLink, true);
    return () => {
      document.removeEventListener('click', handleWatchLink, true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas/95 px-6 backdrop-blur-sm"
      aria-live="polite"
      aria-label="Loading video"
    >
      <div className="flex flex-col items-center gap-5">
        <img
          className="h-40 w-40 object-contain sm:h-48 sm:w-48"
          src="/Loader/Popcorn.svg"
          alt=""
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-warm-300">Loading your video…</p>
      </div>
    </div>
  );
}