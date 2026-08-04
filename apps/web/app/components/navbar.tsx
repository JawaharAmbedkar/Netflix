'use client';

import { useState, useRef, useEffect } from 'react';
import ProfileSidebar from './profileSideBar';
import SearchBar from './search';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/Homepage', label: 'Home' },
  { href: '/discover', label: 'Discover' },
  { href: '/Tv-Show', label: 'TV Shows' },
  { href: '/Movies', label: 'Movies' },
  { href: '/Anime', label: 'Anime' },
];

function BellIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}

function NotificationDropdown({ open }: { open: boolean }) {
  return (
    <div
      className={`
        absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl glass-strong shadow-card transition-all duration-300 ease-out
        ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}
      `}
    >
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">Notifications</p>
      </div>
      <div className="px-4 py-8 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
          <BellIcon className="h-5 w-5 text-warm-400" />
        </div>
        <p className="text-sm text-warm-300">All caught up</p>
        <p className="mt-1 text-xs text-warm-500">No new notifications</p>
      </div>
    </div>
  );
}

export const Navbar = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/Homepage') return pathname === '/' || pathname === '/Homepage';
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav shadow-glass' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
        {/* Mobile and tablet */}
        <div className="w-full space-y-3 xl:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
              <img src="/png/series/netflix.png" alt="Netflix" className="h-7 w-auto" />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                  className="rounded-xl p-2 text-warm-200 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <BellIcon />
                </button>
                <NotificationDropdown open={notifOpen} />
              </div>
              <ProfileSidebar />
            </div>
          </div>
          <SearchBar />
        </div>
        {/* Desktop */}
        <div className="hidden w-full items-center justify-between xl:flex">
          <div className="flex items-center gap-10">
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
              <img src="/png/series/netflix.png" alt="Netflix" className="h-8 w-auto xl:h-9" />
            </Link>
            <nav aria-label="Main navigation">
              <ul className="flex items-center gap-1 lg:gap-2">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`nav-link rounded-xl px-3 py-2 lg:px-4 ${isActive(href) ? 'nav-link-active bg-white/[0.06]' : ''}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <SearchBar />
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Notifications"
                className="rounded-xl p-2.5 text-warm-200 transition hover:bg-white/[0.06] hover:text-white"
              >
                <BellIcon />
              </button>
              <NotificationDropdown open={notifOpen} />
            </div>
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </header>
  );
};
