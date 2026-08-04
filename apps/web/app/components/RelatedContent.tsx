import { MediaRow } from './MediaRow';
import { getRelatedMedia } from '../lib/tmdb';

type RelatedContentProps = {
  mediaType: 'movie' | 'tv';
  id: string;
  isAnime?: boolean;
};

export async function RelatedContent({ mediaType, id, isAnime = false }: RelatedContentProps) {
  const related = await getRelatedMedia(mediaType, id).catch(() => []);
  const recommendations = related.filter((item) => item.id !== Number(id)).slice(0, 12);

  if (!recommendations.length) return null;

  const title = isAnime
    ? 'More anime to explore'
    : mediaType === 'movie'
      ? 'More movies like this'
      : 'More series like this';

  return (
    <div className="mt-16 border-t border-white/[0.08] pt-12">
      <MediaRow title={title} media={recommendations} />
    </div>
  );
}