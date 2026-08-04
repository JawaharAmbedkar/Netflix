'use client';

import { useEffect, useState } from 'react';
import { CategoryShowcase } from './ui/CategoryShowcase';
import { CinematicHero } from './ui/CinematicHero';
import { PageShell } from './ui/PageShell';
import { HeroSkeleton, PosterGridSkeleton } from './ui/Skeleton';
import type { Media } from '../lib/tmdb';

type Category = 'movies' | 'shows' | 'anime';
type Catalogue = Record<Category, Media[]>;

const categoryTitle: Record<Category, string> = {
  movies: 'Movies',
  shows: 'TV Shows',
  anime: 'Anime',
};

const categoryLabel: Record<Category, string> = {
  movies: 'Featured film',
  shows: 'Featured series',
  anime: 'Featured anime',
};

export function CategoryCatalogue({ category }: { category: Category }) {
  const [items, setItems] = useState<Media[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const title = categoryTitle[category];

  useEffect(() => {
    fetch('/api/catalog')
      .then((response) => {
        if (!response.ok) throw new Error('Catalogue request failed');
        return response.json() as Promise<Catalogue>;
      })
      .then((catalogue) => {
        setItems(catalogue[category]);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [category]);

  return (
    <PageShell>
      {status === 'loading' ? (
        <>
          <HeroSkeleton />
          <div className="mt-14">
            <PosterGridSkeleton />
          </div>
        </>
      ) : null}

      {status === 'error' ? (
        <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-950/40 p-5 text-red-100">
          {title} could not be loaded. Please try again shortly.
        </div>
      ) : null}

      {status === 'ready' && items.length === 0 ? (
        <div className="mt-10 rounded-2xl glass p-6 text-warm-300">
          No {title.toLowerCase()} are available right now.
        </div>
      ) : null}

      {status === 'ready' && items.length > 0 ? (
        <>
          <CinematicHero
            items={items.slice(0, 6)}
            label={categoryLabel[category]}
            browseHref="#catalogue"
            browseLabel={`Browse ${title}`}
          />
          <CategoryShowcase title={title} items={items} />
        </>
      ) : null}
    </PageShell>
  );
}
