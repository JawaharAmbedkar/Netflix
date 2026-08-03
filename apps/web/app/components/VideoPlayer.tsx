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

// 👇 A mix of different streaming providers to bypass ISP domain blocks
const SERVERS = [
  {
    name: "Server 1 (VidSrc CC)",
    getUrl: (type: string, id: string, s: number, e: number) => 
      type === 'tv' ? `https://vidsrc.cc/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/embed/movie/${id}`
  },
  {
    name: "Server 2 (AutoEmbed)",
    getUrl: (type: string, id: string, s: number, e: number) => 
      type === 'tv' ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}` : `https://player.autoembed.cc/embed/movie/${id}`
  },
  {
    name: "Server 3 (MultiEmbed)",
    getUrl: (type: string, id: string, s: number, e: number) => 
      type === 'tv' ? `https://multiembed.mov/direct/video.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/direct/video.php?video_id=${id}&tmdb=1`
  },
  {
    name: "Server 4 (VidSrc ME)",
    getUrl: (type: string, id: string, s: number, e: number) => 
      type === 'tv' ? `https://vidsrc.me/embed/tv/${id}/${s}/${e}` : `https://vidsrc.me/embed/movie/${id}`
  }
];

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

  // 👇 State to track the user's chosen server from the dropdown
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);

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

  // 👇 Generate URL based on the user's chosen server
  const dynamicNexStreamUrl = useMemo(() => {
    const server = SERVERS[selectedServerIndex];
    if (!server) return "";
    
    return server.getUrl(mediaType, id, currentSeason, currentEpisode);
  }, [mediaType, id, currentSeason, currentEpisode, selectedServerIndex]);

  const previousEpisode = () => setCurrentEpisode((value) => Math.max(1, value - 1));
  const nextEpisode = () => setCurrentEpisode((value) => Math.min(maxEpisodes, value + 1));

  // Helper boolean to know if we are currently rendering the dynamic iframe player
  const isUsingDynamicPlayer = !sources.length && !licensedEmbedUrl && isMounted && dynamicNexStreamUrl;

  return (
    <div className="space-y-4 w-full">
      {sources.length ? (
        <video
          key={`${mediaKey}-${selectedSource}`}
          controls
          className="aspect-video w-full h-auto rounded-lg bg-black object-cover"
          src={sources[selectedSource]?.src}
        >
          {captions.map((caption) => (
            <track key={caption.src} kind="subtitles" srcLang={caption.language} label={caption.label} src={caption.src} default={caption.default} />
          ))}
        </video>
      ) : licensedEmbedUrl ? (
        <div className="relative w-full aspect-video rounded-lg bg-black overflow-hidden">
          <iframe
            title="Licensed video player"
            src={licensedEmbedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
          />
        </div>
      ) : isUsingDynamicPlayer ? (
        <div className="relative w-full aspect-video rounded-lg bg-black overflow-hidden border border-zinc-800">
          <iframe
            key={dynamicNexStreamUrl}
            title="NexStream Player"
            src={dynamicNexStreamUrl}
            className="absolute inset-0 w-full h-full border-0 block"
            allowFullScreen
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="origin"
          />
        </div>
      ) : (
        <div className="aspect-video w-full flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 font-medium text-sm border border-zinc-800">
          Loading Stream Player...
        </div>
      )}

      {/* DYNAMIC VALIDATED CONTROLS BAR */}
      {(mediaType === 'tv' || isUsingDynamicPlayer) && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 w-full">
          
          {mediaType === 'tv' ? (
            <div className="flex flex-wrap items-center gap-4">
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
          ) : (
            <div /> // Pushes the server dropdown to the right on movies
          )}

          {/* 👇 Clickable Server Dropdown UI */}
          {isUsingDynamicPlayer && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-xs font-medium hidden sm:inline-block">
                Source:
              </span>
              <select
                value={selectedServerIndex}
                onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
                className="bg-zinc-800 text-zinc-200 rounded px-3 py-1.5 text-xs font-medium border border-zinc-700 focus:outline-none focus:border-zinc-500 hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Change server if the video isn't loading"
              >
                {SERVERS.map((server, index) => (
                  <option key={server.name} value={index}>
                    {server.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}