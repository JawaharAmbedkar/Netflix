// components/TopSearches.tsx
'use client';

import { Video } from "../videos/TopSearches/video"

interface TopSearchesProps {
  videos: Video[];
}

export default function TopSearches({ videos }: TopSearchesProps) {
  return (
    <div className="col-span-1 p-4 border-l overflow-y-auto hidden lg:block">
      <h2 className="text-2xl font-bold mb-4 text-center">TOP SEARCHES</h2>
      <div className="flex flex-col gap-11">
        {videos.map(video => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform"
          >
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
