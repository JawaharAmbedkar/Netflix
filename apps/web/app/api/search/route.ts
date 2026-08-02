import { NextRequest, NextResponse } from 'next/server';
import { searchMedia } from '../../lib/tmdb';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (!query) return NextResponse.json({ results: [] });
  if (query.length > 100) return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });

  try {
    return NextResponse.json({ results: await searchMedia(query) });
  } catch (error) {
    console.error('Unable to search TMDB.', error);
    return NextResponse.json({ error: 'Unable to search the catalogue.' }, { status: 500 });
  }
}
