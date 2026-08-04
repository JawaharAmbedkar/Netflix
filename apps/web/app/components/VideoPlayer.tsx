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

// 👇 Updated servers: VidLink at the top, Embed.su removed, and clean low-ad servers added.
const SERVERS = [
  {
    name: 'Server 1 (VidLink - Fast)',
    getUrl: (type: string, id: string, s: number, e: number) =>
      type === 'tv' ? `https://vidlink.pro/tv/${id}/${s}/${e}` : `https://vidlink.pro/movie/${id}`,
  },
  {
    name: 'Server 2 (VidEasy - Low Ads)',
    getUrl: (type: string, id: string, s: number, e: number) =>
      type === 'tv' ? `https://player.videasy.net/tv/${id}/${s}/${e}` : `https://player.videasy.net/movie/${id}`,
  },
  {
    name: 'Server 3 (AutoEmbed - Reliable)',
    getUrl: (type: string, id: string, s: number, e: number) =>
      type === 'tv' ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}` : `https://player.autoembed.cc/embed/movie/${id}`,
  },
  {
    name: 'Server 4 (VidFast - Clean)',
    getUrl: (type: string, id: string, s: number, e: number) =>
      type === 'tv' ? `https://vidfast.pro/tv/${id}/${s}/${e}` : `https://vidfast.pro/movie/${id}`,
  },
  {
    name: 'Server 5 (SmashyVid - Backup)',
    getUrl: (type: string, id: string, s: number, e: number) =>
      type === 'tv' ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` : `https://player.smashy.stream/movie/${id}`,
  },
  {
    name: 'Server 6 (VidSrc IN - Fallback)',
    getUrl: (type: string, id: string, s: number, e: number) =>
      type === 'tv' ? `https://vidsrc.in/embed/tv/${id}/${s}/${e}` : `https://vidsrc.in/embed/movie/${id}`,
  },
];

function ControlButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-xs font-medium text-warm-100 backdrop-blur-sm transition-all duration-200 hover:border-gold/20 hover:bg-gold/10 hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ControlSelect({
  value,
  onChange,
  disabled,
  children,
  className = '',
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      disabled={disabled}
      value={value}
      onChange={onChange}
      className={`rounded-xl border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-xs font-medium text-warm-100 backdrop-blur-sm transition-all duration-200 focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20 disabled:opacity-40 ${className}`}
    >
      {children}
    </select>
  );
}

export function VideoPlayer({
  mediaType,
  id,
  season = 1,
  episode = 1,
  sources = [],
  captions = [],
  licensedEmbedUrl,
}: Props) {
  const [selectedSource, setSelectedSource] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isMounted, setIsMounted] = useState(false);
  const [seasonsList, setSeasonsList] = useState<SeasonData[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        console.error('Metadata extraction error:', err);
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

  const mediaKey = useMemo(
    () => (mediaType === 'tv' ? `${id}/s${currentSeason}/e${currentEpisode}` : id),
    [mediaType, id, currentSeason, currentEpisode],
  );

  const dynamicNexStreamUrl = useMemo(() => {
    const server = SERVERS[selectedServerIndex];
    if (!server) return '';
    return server.getUrl(mediaType, id, currentSeason, currentEpisode);
  }, [mediaType, id, currentSeason, currentEpisode, selectedServerIndex]);

  const previousEpisode = () => setCurrentEpisode((value) => Math.max(1, value - 1));
  const nextEpisode = () => setCurrentEpisode((value) => Math.min(maxEpisodes, value + 1));

  const isUsingDynamicPlayer = !sources.length && !licensedEmbedUrl && isMounted && dynamicNexStreamUrl;

  return (
    <div className="w-full space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-black shadow-card">
        {sources.length ? (
          <video
            key={`${mediaKey}-${selectedSource}`}
            controls
            className="aspect-video h-auto w-full bg-black object-cover"
            src={sources[selectedSource]?.src}
          >
            {captions.map((caption) => (
              <track
                key={caption.src}
                kind="subtitles"
                srcLang={caption.language}
                label={caption.label}
                src={caption.src}
                default={caption.default}
              />
            ))}
          </video>
        ) : licensedEmbedUrl ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <iframe
              title="Licensed video player"
              src={licensedEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
            />
          </div>
        ) : isUsingDynamicPlayer ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <iframe
              key={dynamicNexStreamUrl}
              title="Stream player"
              src={dynamicNexStreamUrl}
              className="absolute inset-0 block h-full w-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-canvas-surface">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
            <p className="text-sm font-medium text-warm-400">Loading player…</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {(mediaType === 'tv' || isUsingDynamicPlayer) && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass p-5">
          {mediaType === 'tv' ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <ControlButton
                  disabled={currentSeason <= 1 || isLoadingMeta}
                  onClick={() => {
                    setCurrentSeason((v) => Math.max(1, v - 1));
                    setCurrentEpisode(1);
                  }}
                >
                  Season −
                </ControlButton>

                <ControlSelect
                  disabled={isLoadingMeta || seasonsList.length === 0}
                  value={currentSeason}
                  onChange={(e) => {
                    setCurrentSeason(Number(e.target.value));
                    setCurrentEpisode(1);
                  }}
                >
                  {seasonsList.length > 0
                    ? seasonsList.map((s) => (
                        <option key={s.seasonNumber} value={s.seasonNumber}>
                          {s.name || `Season ${s.seasonNumber}`}
                        </option>
                      ))
                    : (
                      <option value={currentSeason}>Season {currentSeason}</option>
                    )}
                </ControlSelect>

                <ControlButton
                  disabled={currentSeason >= maxSeasons || isLoadingMeta}
                  onClick={() => {
                    setCurrentSeason((v) => Math.min(maxSeasons, v + 1));
                    setCurrentEpisode(1);
                  }}
                >
                  Season +
                </ControlButton>
              </div>

              <div className="flex items-center gap-2">
                <ControlButton disabled={currentEpisode <= 1 || isLoadingMeta} onClick={previousEpisode}>
                  Episode −
                </ControlButton>

                <ControlSelect
                  disabled={isLoadingMeta}
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                  className="min-w-[90px]"
                >
                  {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map((epNum) => (
                    <option key={epNum} value={epNum}>
                      Episode {epNum}
                    </option>
                  ))}
                </ControlSelect>

                <ControlButton disabled={currentEpisode >= maxEpisodes || isLoadingMeta} onClick={nextEpisode}>
                  Episode +
                </ControlButton>
              </div>

              {isLoadingMeta && (
                <span className="animate-pulse-soft text-xs text-warm-400">Syncing…</span>
              )}
            </div>
          ) : (
            <div />
          )}

          {isUsingDynamicPlayer && (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs font-medium text-warm-400 sm:inline">Source</span>
              <ControlSelect
                value={selectedServerIndex}
                onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
              >
                {SERVERS.map((server, index) => (
                  <option key={server.name} value={index}>
                    {server.name}
                  </option>
                ))}
              </ControlSelect>
            </div>
          )}
        </div>
      )}
    </div>
  );
}