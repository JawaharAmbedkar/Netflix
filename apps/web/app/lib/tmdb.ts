const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export type Media = { id: number; title: string; overview: string; release_date: string; rating: number; poster_path: string | null; media_type: 'movie' | 'tv' };
type TmdbResult = { id: number; title?: string; name?: string; overview?: string; release_date?: string; first_air_date?: string; vote_average?: number; poster_path?: string | null; media_type?: 'movie' | 'tv' };
function authHeaders() { const token = process.env.TMDB_READ_ACCESS_TOKEN; if (!token) throw new Error('TMDB_READ_ACCESS_TOKEN is not configured.'); return { Authorization: `Bearer ${token}`, accept: 'application/json' }; }
function normalise(item: TmdbResult, fallbackType: 'movie' | 'tv'): Media { return { id: item.id, title: item.title ?? item.name ?? 'Untitled', overview: item.overview ?? '', release_date: item.release_date ?? item.first_air_date ?? '', rating: item.vote_average ?? 0, poster_path: item.poster_path ? `${TMDB_IMAGE_URL}${item.poster_path}` : null, media_type: item.media_type === 'tv' || item.media_type === 'movie' ? item.media_type : fallbackType }; }
/** Server-only TMDB request helper. Keep the API token out of client components. */
export async function tmdbFetch<T>(path: string): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${TMDB_API_URL}${path}`, {
        headers: authHeaders(),
        next: { revalidate: 3600 },
      });
      if (!response.ok) throw new Error(`TMDB request failed (${response.status}).`);
      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('TMDB request failed.');
}
async function collection(path: string, type: 'movie' | 'tv') { const data = await tmdbFetch<{ results: TmdbResult[] }>(path); return data.results.map((item) => normalise(item, type)); }
export const getTrendingMovies = () => collection('/trending/movie/week', 'movie');
export const getPopularMovies = () => collection('/movie/popular', 'movie');
export const getPopularTv = () => collection('/tv/popular', 'tv');
export const getRelatedMedia = (type: 'movie' | 'tv', id: string) =>
  collection(`/${type}/${id}/recommendations`, type);

export async function isAnimeSeries(id: string) {
  const data = await tmdbFetch<{
    original_language?: string;
    genres?: { id: number }[];
  }>(`/tv/${id}`);

  return data.original_language === 'ja' && data.genres?.some((genre) => genre.id === 16) === true;
}
export const getAnime = () => collection('/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc', 'tv');
export const getNetflixOriginals = () => collection('/discover/tv?with_networks=213', 'tv');
export const getAmazonPrimeOriginals = () => collection('/discover/tv?with_networks=1024', 'tv');
export async function getMediaDetails(type: 'movie' | 'tv', id: string) { return normalise(await tmdbFetch<TmdbResult>(`/${type}/${id}`), type); }
export async function searchMedia(query: string) {
  const data = await tmdbFetch<{ results: TmdbResult[] }>(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item) => normalise(item, item.media_type === 'tv' ? 'tv' : 'movie'));
}
// 👇 ADD THIS TO THE BOTTOM OF YOUR EXISTING tmdb.ts FILE

export type TVSeasonMeta = { seasonNumber: number; episodeCount: number; name: string };

/** Fetches full structural metadata for a TV show to limit player navigation boundaries */
export async function getTvSeasonsMeta(id: string): Promise<TVSeasonMeta[]> {
  type TmdbTvResponse = { seasons: { season_number: number; episode_count: number; name: string }[] };
  
  try {
    const data = await tmdbFetch<TmdbTvResponse>(`/tv/${id}`);
    
    return data.seasons
      .filter((s) => s.season_number > 0) // Ignores Specials (Season 0)
      .map((s) => ({
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        name: s.name || `Season ${s.season_number}`,
      }));
  } catch (error) {
    console.error(`Failed to get TV Seasons for ID ${id}:`, error);
    return [];
  }
}
