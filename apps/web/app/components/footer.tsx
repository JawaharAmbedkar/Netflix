'use client';

import Link from 'next/link';
import { FC } from 'react';
import { usePathname } from 'next/navigation';

const footerLinks = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
      />
    ),
  },
  {
    href: '/Anime',
    label: 'Anime',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
      </>
    ),
  },
  {
    href: '/Tv-Show',
    label: 'TV Shows',
    icon: (
      <path d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
    ),
    filled: true,
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    ),
  },
];

const Footer: FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/Homepage';
    return pathname?.startsWith(href);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:static sm:px-0 sm:pb-0">
      <div className="mx-auto max-w-md rounded-3xl border border-white/[0.08] bg-canvas/80 px-6 py-4 shadow-glass backdrop-blur-2xl sm:max-w-[1500px] sm:rounded-none sm:border-0 sm:border-t sm:border-white/[0.06] sm:bg-canvas/60 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex items-center justify-around sm:justify-center sm:gap-16">
          {footerLinks.map(({ href, label, icon, filled }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`group flex flex-col items-center gap-1.5 transition-all duration-300 ${
                isActive(href) ? 'text-gold' : 'text-warm-400 hover:text-gold-light'
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive(href)
                    ? 'bg-gold/15 shadow-glow'
                    : 'group-hover:bg-white/[0.06]'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={filled ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  strokeWidth={filled ? 0 : 1.5}
                  stroke={filled ? undefined : 'currentColor'}
                  className="h-5 w-5"
                >
                  {icon}
                </svg>
              </span>
              <span className="text-[10px] font-medium tracking-wide sm:text-xs">{label}</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 hidden text-center text-xs text-warm-500 sm:block">
          Premium streaming experience · Curated for cinephiles
        </p>
      </div>
    </footer>
  );
};

export default Footer;
