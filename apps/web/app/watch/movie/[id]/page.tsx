import Link from 'next/link';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { RelatedContent } from '../../../components/RelatedContent';
import { Navbar } from '../../../components/navbar';
import { getMediaDetails } from '../../../lib/tmdb';
import { mediaYear } from '../../../components/ui/HeroBanner';

export default async function MovieWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMediaDetails('movie', id).catch(() => null);

  return (
    <main className="min-h-screen bg-canvas text-white">
      <Navbar />

      <div className="relative">
        {movie?.poster_path ? (
          <>
            <img
              src={movie.poster_path}
              alt=""
              className="absolute inset-x-0 top-0 h-[480px] w-full object-cover opacity-15 blur-2xl"
            />
            <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-canvas/30 via-canvas/90 to-canvas" />
          </>
        ) : null}

        <div className="relative mx-auto max-w-[1400px] px-4 pb-24 pt-6 sm:px-8">
          <Link
            href="/Homepage"
            className="mb-6 inline-flex items-center gap-2 text-sm text-warm-400 transition hover:text-gold-light"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to browse
          </Link>

          <div className="overflow-hidden rounded-4xl border border-white/[0.08] shadow-card">
            <VideoPlayer mediaType="movie" id={id} />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="animate-fade-up">
              <p className="section-label">Now playing</p>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                {movie?.title ?? 'Movie'}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-warm-300">
                {movie?.overview ??
                  'Details are temporarily unavailable. Please return to the catalogue and try again.'}
              </p>
            </div>

            {movie ? (
              <aside className="rounded-3xl border border-white/[0.06] bg-canvas-surface/60 p-6 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wider text-warm-400">Details</p>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-warm-500">Year</dt>
                    <dd className="mt-1 font-medium text-white">{mediaYear(movie)}</dd>
                  </div>
                  <div>
                    <dt className="text-warm-500">Type</dt>
                    <dd className="mt-1 font-medium text-white">Feature Film</dd>
                  </div>
                  <div>
                    <dt className="text-warm-500">Rating</dt>
                    <dd className="mt-1 font-medium text-gold-light">★ {movie.rating.toFixed(1)}</dd>
                  </div>
                </dl>
                {movie.poster_path ? (
                  <img
                    src={movie.poster_path}
                    alt=""
                    className="mt-6 w-full rounded-2xl border border-white/[0.06] shadow-card"
                  />
                ) : null}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-8">
        <RelatedContent mediaType="movie" id={id} />
      </div>
    </main>
  );
}
