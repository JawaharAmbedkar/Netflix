import { VideoPlayer } from '../../../components/VideoPlayer';
import { getMediaDetails } from '../../../lib/tmdb';

export default async function MovieWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMediaDetails('movie', id).catch(() => null);

  return <main className="min-h-screen bg-black p-4 text-white"><div className="mx-auto max-w-6xl pt-8"><VideoPlayer mediaType="movie" id={id} /><h1 className="mt-6 text-3xl font-bold">{movie?.title ?? 'Movie'}</h1><p className="mt-2 max-w-3xl text-zinc-300">{movie?.overview ?? 'Details are temporarily unavailable. Please return to the catalogue and try again.'}</p></div></main>;
}
