import { VideoPlayer } from '../../../../../components/VideoPlayer';
import { getMediaDetails } from '../../../../../lib/tmdb';

export default async function TvWatchPage({ params }: { params: Promise<{ id: string; season: string; episode: string }> }) {
  const { id, season, episode } = await params;
  const show = await getMediaDetails('tv', id).catch(() => null);

  return <main className="min-h-screen bg-black p-4 text-white"><div className="mx-auto max-w-6xl pt-8"><VideoPlayer mediaType="tv" id={id} season={Number(season) || 1} episode={Number(episode) || 1} /><h1 className="mt-6 text-3xl font-bold">{show?.title ?? 'TV show'}</h1><p className="mt-2 max-w-3xl text-zinc-300">{show?.overview ?? 'Details are temporarily unavailable. Please return to the catalogue and try again.'}</p></div></main>;
}
