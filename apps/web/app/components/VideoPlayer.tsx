'use client';
import { useMemo, useState, useEffect } from 'react';

export type VideoSource = { src: string; label: string; type?: string }; 
export type Caption = { src: string; label: string; language: string; default?: boolean };

type SeasonData = {
  seasonNumber: number;
  episodeCount: number;
  name: string;
};

type Props = { 
  mediaType: 'movie' | 'tv'; 
  id: string; 
  season?: number; 
  episode?: number; 
  sources?: VideoSource[]; 
  captions?: Caption[]; 
  licensedEmbedUrl?: string;
};

export function VideoPlayer({ 
  mediaType, 
  id, 
  season = 1, 
  episode = 1, 
  sources = [], 
  captions = [], 
  licensedEmbedUrl
}: Props) { 
  const [selectedSource, setSelectedSource] = useState(0); 
  const [currentSeason, setCurrentSeason] = useState(season); 
  const [currentEpisode, setCurrentEpisode] = useState(episode); 
  const [isMounted, setIsMounted] = useState(false);

  const [seasonsList, setSeasonsList] = useState<SeasonData[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync TMDB metadata dynamically when selection modifies
  useEffect(() => {
    if (mediaType !== 'tv' || !id) return;
    
    async function fetchMeta() {
      setIsLoadingMeta(true);
      try {
        const res = await fetch(`/api/media-meta?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setSeasonsList(data.seasons || []);
        }
      } catch (err) {
        console.error("Metadata extraction error:", err);
      } finally {
        setIsLoadingMeta(false);
      }
    }
    
    fetchMeta();
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, [id, mediaType, season, episode]);

  const activeSeasonMeta = useMemo(() => {
    return seasonsList.find((s) => s.seasonNumber === currentSeason);
  }, [seasonsList, currentSeason]);

  const maxEpisodes = activeSeasonMeta ? activeSeasonMeta.episodeCount : 100;
  const maxSeasons = seasonsList.length || 20;

  const mediaKey = useMemo(() => 
    mediaType === 'tv' ? `${id}/s${currentSeason}/e${currentEpisode}` : id, 
    [mediaType, id, currentSeason, currentEpisode]
  ); 

  const dynamicNexStreamUrl = useMemo(() => {
    const BASE_URL = "https://vidsrc.to"; 

    if (mediaType === 'tv') {
      return `${BASE_URL}/embed/tv/${id}/${currentSeason}/${currentEpisode}`;
    }
    return `${BASE_URL}/embed/movie/${id}`;
  }, [mediaType, id, currentSeason, currentEpisode]);

  const previousEpisode = () => setCurrentEpisode((value) => Math.max(1, value - 1)); 
  const nextEpisode = () => setCurrentEpisode((value) => Math.min(maxEpisodes, value + 1));

  return (
    <div className="space-y-4 w-full">
      {sources.length ? (
        <div className="relative w-full rounded-lg bg-black overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <video key={`${mediaKey}-${selectedSource}`} controls className="absolute inset-0 w-full h-full" src={sources[selectedSource]?.src}>
            {captions.map((caption) => (
              <track key={caption.src} kind="subtitles" srcLang={caption.language} label={caption.label} src={caption.src} default={caption.default} />
            ))}
          </video>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 z-10">
            {sources.map((source, index) => (
              <button key={source.src} onClick={() => setSelectedSource(index)} className="rounded bg-zinc-800/80 backdrop-blur px-3 py-2 text-white hover:bg-zinc-700">
                {source.label}
              </button>
            ))}
          </div>
        </div>
      ) : licensedEmbedUrl ? (
        <div className="relative w-full rounded-lg bg-black overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <iframe title="Licensed video player" src={licensedEmbedUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen />
        </div>
      ) : isMounted && dynamicNexStreamUrl ? (
        /* 👇 THE FIXED MOBILE STRUCTURAL WRAPPER */
        /* padding-top: 56.25% forces a true native 16:9 vertical responsive footprint across screens */
        <div className="relative w-full rounded-lg bg-black overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <iframe 
            key={dynamicNexStreamUrl}
            title="NexStream Player" 
            src={dynamicNexStreamUrl} 
            className="absolute inset-0 w-full h-full border-0" /* 👈 Replaced w-full h-full with absolute layout */
            allowFullScreen 
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <div className="relative w-full rounded-lg bg-zinc-900 text-zinc-400 flex items-center justify-center" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            Loading Stream Player...
          </div>
        </div>
      )}

      {/* DYNAMIC VALIDATED CONTROLS BAR */}
      {mediaType === 'tv' && (
        <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 w-full">
          <div className="flex items-center gap-2">
            <button 
              disabled={currentSeason <= 1 || isLoadingMeta} 
              onClick={() => {
                setCurrentSeason((v) => Math.max(1, v - 1));
                setCurrentEpisode(1);
              }} 
              className="rounded bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700 disabled:opacity-40 text-xs font-medium"
            >
              Season −
            </button>
            
            <select
              disabled={isLoadingMeta || seasonsList.length === 0}
              value={currentSeason}
              onChange={(e) => {
                setCurrentSeason(Number(e.target.value));
                setCurrentEpisode(1);
              }}
              className="bg-zinc-800 text-white rounded px-2 py-1.5 text-xs font-medium border border-zinc-700 focus:outline-none"
            >
              {seasonsList.length > 0 ? (
                seasonsList.map((s) => (
                  <option key={s.seasonNumber} value={s.seasonNumber}>
                    {s.name || `Season ${s.seasonNumber}`}
                  </option>
                ))
              ) : (
                <option value={currentSeason}>Season {currentSeason}</option>
              )}
            </select>

            <button 
              disabled={currentSeason >= maxSeasons || isLoadingMeta} 
              onClick={() => {
                setCurrentSeason((v) => Math.min(maxSeasons, v + 1));
                setCurrentEpisode(1);
              }} 
              className="rounded bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700 disabled:opacity-40 text-xs font-medium"
            >
              Season +
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              disabled={currentEpisode <= 1 || isLoadingMeta} 
              onClick={previousEpisode} 
              className="rounded bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700 disabled:opacity-40 text-xs font-medium"
            >
              Episode −
            </button>

            <select
              disabled={isLoadingMeta}
              value={currentEpisode}
              onChange={(e) => setCurrentEpisode(Number(e.target.value))}
              className="bg-zinc-800 text-white rounded px-2 py-1.5 text-xs font-medium border border-zinc-700 focus:outline-none min-w-[70px]"
            >
              {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map((epNum) => (
                <option key={epNum} value={epNum}>
                  Episode {epNum}
                </option>
              ))}
            </select>

            <button 
              disabled={currentEpisode >= maxEpisodes || isLoadingMeta} 
              onClick={nextEpisode} 
              className="rounded bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700 disabled:opacity-40 text-xs font-medium"
            >
              Episode +
            </button>
          </div>

          {isLoadingMeta && <span className="text-zinc-500 text-xs animate-pulse">Syncing episodes...</span>}
        </div>
      )}
    </div>
  ); 
}
