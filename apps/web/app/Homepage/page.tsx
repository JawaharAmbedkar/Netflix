'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BentoCatalogue } from '../components/ui/BentoCatalogue';
import { CinematicHero } from '../components/ui/CinematicHero';
import { PageShell } from '../components/ui/PageShell';
import { HeroSkeleton, PageLoadingShell, RailSkeleton } from '../components/ui/Skeleton';
import { TrendingShowcase } from '../components/ui/TrendingShowcase';
import type { Media } from '../lib/tmdb';

type Catalogue = {
  trending: Media[];
  movies: Media[];
  shows: Media[];
  anime: Media[];
};

const quickLinks = [
  { href: '#trending', label: 'Trending' },
  { href: '#movies', label: 'Films' },
  { href: '#shows', label: 'Series' },
  { href: '#anime', label: 'Anime' },
];

export default function Homepage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    return <PageLoadingShell message="Checking access…" />;
  }
  return (
    <PageShell>
      {error ? (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-950/40 p-5 text-red-100 backdrop-blur-sm">
          The catalogue could not be loaded. Add a valid TMDB_READ_ACCESS_TOKEN to apps/web/.env.local
          and restart the app.
        </div>
      ) : null}

      {!catalogue && !error ? (
        <>
          <HeroSkeleton />
          <RailSkeleton />
          <RailSkeleton />
        </>
      ) : null}

      {catalogue && catalogue.trending.length > 0 ? (
        <>
          <CinematicHero
            items={catalogue.trending.slice(0, 6)}
            label="Tonight's spotlight"
            browseHref="#trending"
            browseLabel="See what's trending"
          />

          <nav
            aria-label="Quick navigation"
            className="mt-8 flex flex-wrap gap-2 sm:gap-3"
          >
            {quickLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-warm-200 transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold-light"
              >
                {label}
              </a>
            ))}
          </nav>

          <section id="trending" className="mt-16 animate-fade-up">
            <div className="mb-8">
              <p className="section-label">Most watched</p>
              <h2 className="section-title">Trending this week</h2>
            </div>
            <TrendingShowcase items={catalogue.trending.slice(0, 10)} />
          </section>

          <div id="movies">
            <BentoCatalogue
              title="Big-screen picks"
              subtitle="Popular films"
              items={catalogue.movies}
              href="/Movies"
            />
          </div>

          <div id="shows">
            <BentoCatalogue
              title="Binge-worthy series"
              subtitle="Popular shows"
              items={catalogue.shows}
              href="/Tv-Show"
            />
          </div>

          <div id="anime">
            <BentoCatalogue
              title="Anime after dark"
              subtitle="Japanese animation"
              items={catalogue.anime}
              href="/Anime"
            />
          </div>
        </>
      ) : null}
    </PageShell>
  );
}
