import { NextResponse } from 'next/server';
import { getTvSeasonsMeta } from '../../lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing show ID parameter' }, { status: 400 });
    }

    const seasons = await getTvSeasonsMeta(id);
    return NextResponse.json({ seasons });
  } catch (error) {
    console.error('Unable to fetch TMDB seasons meta loop.', error);
    return NextResponse.json({ error: 'Unable to load series boundaries.' }, { status: 500 });
  }
}
