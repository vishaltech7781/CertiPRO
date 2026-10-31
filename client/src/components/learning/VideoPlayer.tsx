import React, { useState } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';

export interface VideoPlayerProps {
  youtubeVideoId?: string;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ youtubeVideoId, title }) => {
  const [loadError, setLoadError] = useState(false);

  if (!youtubeVideoId || loadError) {
    return (
      <div className="aspect-video w-full bg-ink-900 rounded-lg flex flex-col items-center justify-center p-6 text-center text-white border border-ink-800">
        <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
        <h4 className="font-semibold text-sm">Educational Video Reference</h4>
        <p className="mt-1 text-xs text-surface-400 max-w-md">
          This lecture is curated from public educational content. If YouTube playback is restricted in your browser environment, you can open the lecture directly.
        </p>
        {youtubeVideoId && (
          <a
            href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-ink-900 px-3.5 py-1.5 rounded hover:bg-surface-100 transition-colors"
          >
            Open Lecture on YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black shadow-md border border-surface-200">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&enablejsapi=1`}
        title={`Video lecture: ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
        onError={() => setLoadError(true)}
      />
    </div>
  );
};

