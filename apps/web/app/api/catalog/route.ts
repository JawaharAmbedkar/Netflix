import { NextResponse } from 'next/server';
import { getAnime, getPopularMovies, getPopularTv, getTrendingMovies } from '../../lib/tmdb';

export async function GET() {
  try {
    const [trending, movies, shows, anime] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getPopularTv(),
      getAnime(),
    ]);

    return NextResponse.json({ trending, movies, shows, anime });
  } catch (error) {
    console.error('Unable to load TMDB catalogue.', error);
    return NextResponse.json({ error: 'Unable to load the catalogue.' }, { status: 500 });
  }
}
