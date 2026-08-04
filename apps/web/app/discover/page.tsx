import { CinematicHero } from '../components/ui/CinematicHero';
import { EditorialCollection } from '../components/ui/EditorialCollection';
import { PageShell } from '../components/ui/PageShell';
import { getAmazonPrimeOriginals, getNetflixOriginals, getTrendingMovies } from '../lib/tmdb';

export default async function DiscoverPage() {
  const [trending, netflix, prime] = await Promise.all([
    getTrendingMovies(),
    getNetflixOriginals(),
    getAmazonPrimeOriginals(),
  ]);
  const featured = trending[0];

  return (
    <PageShell>
      <header className="mb-10 pt-4 text-center sm:text-left">
        <p className="section-label">Explore</p>
        <h1 className="font-display text-5xl font-semibold text-white sm:text-7xl">Discover</h1>
        <p className="mt-3 max-w-xl text-warm-300">
          Curated collections, hidden gems, and what the world is watching right now.
        </p>
      </header>

      {featured ? (
        <CinematicHero
          items={trending.slice(0, 6)}
          label="Editor's choice"
          browseHref="#discover-catalogue"
          browseLabel="Browse collections"
          variant="immersive"
        />
      ) : null}

      <div id="discover-catalogue" className="mt-16 space-y-4">
        <EditorialCollection
          title="Trending Films"
          subtitle="Hot right now"
          media={trending}
          variant="scroll"
        />
        <EditorialCollection
          title="Netflix Originals"
          subtitle="Exclusive picks"
          media={netflix}
          variant="editorial"
        />
        <EditorialCollection
          title="Prime Originals"
          subtitle="Worth your time"
          media={prime}
          variant="list"
        />
      </div>
    </PageShell>
  );
}
