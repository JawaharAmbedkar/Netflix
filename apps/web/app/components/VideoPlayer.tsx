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
  const [isShieldActive, setIsShieldActive] = useState(true);

  const [seasonsList, setSeasonsList] = useState<SeasonData[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch TMDB meta boundaries dynamically when show selection switches
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

  useEffect(() => {
    setIsShieldActive(true);
  }, [id, currentSeason, currentEpisode]);

  // Extract total episode bounds for current choice layer safely
  const activeSeasonMeta = useMemo(() => {
    return seasonsList.find((s) => s.seasonNumber === currentSeason);
  }, [seasonsList, currentSeason]);

  const maxEpisodes = activeSeasonMeta ? activeSeasonMeta.episodeCount : 100;
  const maxSeasons = seasonsList.length || 20;

  useEffect(() => {
    if (!isMounted) return;
    const originalWindowOpen = window.open;
    window.open = function (url) {
      console.warn("Blocked an automatic ad/redirect tab to:", url);
      return { focus: () => {}, blur: () => {}, close: () => {}, closed: true } as Window;
    };
    return () => { window.open = originalWindowOpen; };
  }, [isMounted]);

  const mediaKey = useMemo(() => 
    mediaType === 'tv' ? `${id}/s${currentSeason}/e${currentEpisode}` : id, 
    [mediaType, id, currentSeason, currentEpisode]
  ); 

  const dynamicNexStreamUrl = useMemo(() => {
    const BASE_URL = "https://api.codespecters.com"; 
    const apiKey = process.env.NEXT_PUBLIC_EMBED_API_KEY;

    if (!apiKey) return null;

    if (mediaType === 'tv') {
      return `${BASE_URL}/embed/tv/${id}/${currentSeason}/${currentEpisode}?apikey=${apiKey}`;
    }
    return `${BASE_URL}/embed/movie/${id}?apikey=${apiKey}`;
  }, [mediaType, id, currentSeason, currentEpisode]);

  const previousEpisode = () => setCurrentEpisode((value) => Math.max(1, value - 1)); 
  const nextEpisode = () => setCurrentEpisode((value) => Math.min(maxEpisodes, value + 1));

  return (
    <div className="space-y-4">
      {sources.length ? (
        <>
          <video key={`${mediaKey}-${selectedSource}`} controls className="aspect-video w-full rounded-lg bg-black" src={sources[selectedSource]?.src}>
            {captions.map((caption) => (
              <track key={caption.src} kind="subtitles" srcLang={caption.language} label={caption.label} src={caption.src} default={caption.default} />
            ))}
          </video>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <button key={source.src} onClick={() => setSelectedSource(index)} className="rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700">
                {source.label}
              </button>
            ))}
          </div>
        </>
      ) : licensedEmbedUrl ? (
        <iframe title="Licensed video player" src={licensedEmbedUrl} className="aspect-video w-full rounded-lg bg-black" allowFullScreen />
      ) : isMounted && dynamicNexStreamUrl ? (
        <div className="relative aspect-video w-full rounded-lg bg-black overflow-hidden">
          <iframe 
            key={dynamicNexStreamUrl}
            title="NexStream Player" 
            src={dynamicNexStreamUrl} 
            className="w-full h-full" 
            allowFullScreen 
          />

          {/* THE INTERCEPTION SHIELD CONTAINER */}
          {isShieldActive && (
            <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-sm">
              <p className="text-zinc-200 text-sm font-medium text-center max-w-xs">
                Clicking inside streaming players often forces malicious tab redirects.
              </p>
              <button
                type="button"
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setIsShieldActive(false);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsShieldActive(false);
                }}
                className="rounded bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-red-500 transition active:scale-95"
              >
                Unlock & Play Video Stream
              </button>
            </div>
          )}
        </div>
      ) : isMounted && !process.env.NEXT_PUBLIC_EMBED_API_KEY ? (
        <div className="flex aspect-video flex-col items-center justify-center rounded-lg bg-red-950/20 border border-red-900/50 text-red-400 p-6 text-center">
          <p className="font-semibold mb-1">NexStream Key Missing</p>
          <p className="text-xs max-w-xs text-red-300/80">
            Please append <code className="bg-black/40 px-1 py-0.5 rounded text-white text-[10px]">NEXT_PUBLIC_EMBED_API_KEY</code> to your root file configuration layout to activate playback.
          </p>
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg bg-zinc-900 text-zinc-400">
          Loading Stream Player...
        </div>
      )}

      {/* 👇 DYNAMIC VALIDATED CONTROLS BAR */}
      {mediaType === 'tv' && (
        <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
          
          {/* Season Controls Group */}
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
            
            {/* SELECT DROPDOWN FOR SEASONS */}
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

          {/* Episode Controls Group */}
          <div className="flex items-center gap-2">
            <button 
              disabled={currentEpisode <= 1 || isLoadingMeta} 
              onClick={previousEpisode} 
              className="rounded bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700 disabled:opacity-40 text-xs font-medium"
            >
              Episode −
            </button>

            {/* SELECT DROPDOWN FOR EPISODES */}
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

        </div>
      )}
    </div>
  );
}